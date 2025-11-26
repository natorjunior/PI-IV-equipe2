const { GoogleGenerativeAI } = require("@google/generative-ai");
const db = require("../connection"); // Importamos o banco de dados

// --- CONFIGURAÇÕES DE CHAVES ---
const GEMINI_API_KEY = "API KEY_GEMINI_AQUI"; 
const GOOGLE_SEARCH_KEY = "KEY_GOOGLE_CUSTOM_SEARCH"; 
const GOOGLE_SEARCH_CX = "ID_SEARCH_ENGINE_CX"; 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const CONTEXTO_SUPPHINTS = `
Você é o assistente virtual da InfoSuplementos (SuppHints).
Sua função é ajudar usuários com dúvidas sobre o site, a empresa e suplementos.

INFORMAÇÕES DA EMPRESA
- Nome InfoSuplementos.
- Missão Auxiliar consumidores na escolha segura de suplementos, mostrando laudos e aprovações.
- Contato Instagram @infosuplementos_oficial, WhatsApp (85) 99631-7582.
- Funcionalidades Busca de produtos, Favoritos (apenas logado), Detalhes técnicos de laudos.

REGRAS DE PRIORIDADE:
- Responda de forma curta, amigável e em português.
- Se a pergunta for sobre o site, responda como as funcionalidades funcionam ex: busca, favoritos, detalhes tecnicos etc...
- Se a pergunta for sobre um suplemento específico, explique o que é (ex Creatina serve para força) e siga as regras abaixo:
1. Se você receber "DADOS DO BANCO DE DADOS", essa é a verdade absoluta. Responda baseando-se APENAS neles. Informe o status (Aprovado/Reprovado) e os detalhes do laudo.
2. Se você receber "DADOS DA WEB", avise que o produto não consta na nossa base oficial, mas que você encontrou essas informações online.
3. Seja curto e objetivo.
4. Se não houver dados, responda que não encontrou informações sobre o suplemento específico.
-  Se não souber, peça para contatar o suporte.
`;

const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", 
    systemInstruction: CONTEXTO_SUPPHINTS 
});

// --- 1. BUSCA NO BANCO DE DADOS ---
async function buscarNoBanco(termo) {
    // Remove palavras comuns para melhorar a busca no LIKE
    const termoLimpo = termo.replace(/qual|a|o|é|bom|boa|pureza|de|da|do/gi, "").trim();
    const query = `%${termoLimpo}%`;

    const sql = `
        SELECT nome, marca, tipo_suplemento, status_aprovacao, detalhes_laudo, orgao_laudo 
        FROM suplementos 
        WHERE nome LIKE ? OR marca LIKE ?
        LIMIT 3
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [query, query], (err, results) => {
            if (err) {
                console.error("Erro ao buscar no banco para IA:", err);
                resolve(null); // Se der erro, resolve como nulo para tentar a web
            } else {
                resolve(results.length > 0 ? results : null);
            }
        });
    });
}

// --- 2. BUSCA NA WEB (Plano B) ---
async function buscarNaWeb(termo) {
    if (!GOOGLE_SEARCH_KEY || !GOOGLE_SEARCH_KEY.includes("AIza") || !GOOGLE_SEARCH_CX) {
        return null;
    }

    try {
        const query = encodeURIComponent(`${termo} laudo pureza abenutri aprovada reprovada`);
        const url = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_SEARCH_KEY}&cx=${GOOGLE_SEARCH_CX}&q=${query}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.items || data.items.length === 0) return null;

        return data.items.slice(0, 3).map(item => {
            return `- Fonte: ${item.title}\n  Resumo: ${item.snippet}`;
        }).join("\n\n");

    } catch (error) {
        console.error("Erro ao buscar no Google:", error);
        return null;
    }
}

// --- CONTROLADOR PRINCIPAL ---
exports.enviarMensagem = async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) return res.status(400).json({ message: "Mensagem vazia." });

  try {
    let promptContexto = "";
    let fonteInformacao = "";

    // 1. Tenta buscar no Banco de Dados PRIMEIRO
    const resultadosBanco = await buscarNoBanco(mensagem);

    if (resultadosBanco) {
        fonteInformacao = "BANCO DE DADOS INTERNO";
        const dadosFormatados = resultadosBanco.map(r => 
            `- Produto: ${r.nome} (${r.marca})\n  Status: ${r.status_aprovacao}\n  Laudo: ${r.detalhes_laudo} (${r.orgao_laudo})`
        ).join("\n\n");

        promptContexto = `
        PERGUNTA DO USUÁRIO: "${mensagem}"

        --- DADOS DO BANCO DE DADOS DA INFOSUPLEMENTOS (FONTE OFICIAL) ---
        ${dadosFormatados}
        -------------------------------------------------------------------
        O produto foi encontrado no nosso sistema. Responda com base nesses dados oficiais.
        `;
    
    } else {
        // 2. Se não achou no banco, busca na Web
        console.log("Produto não encontrado no banco. Buscando na web...");
        const dadosWeb = await buscarNaWeb(mensagem);

        if (dadosWeb) {
            fonteInformacao = "WEB";
            promptContexto = `
            PERGUNTA DO USUÁRIO: "${mensagem}"

            --- DADOS ENCONTRADOS NA WEB (FONTE EXTERNA) ---
            ${dadosWeb}
            ------------------------------------------------
            O produto NÃO consta no nosso banco de dados. Responda com base na pesquisa web acima, mas deixe claro que são informações externas.
            `;
        } else {
            // 3. Não achou em lugar nenhum
            promptContexto = `O usuário perguntou: "${mensagem}". Não temos dados internos nem externos sobre isso. Responda educadamente que não encontrou informações de laudos para essa marca específica.`;
        }
    }

    // 4. Envia para o Gemini
    const chat = model.startChat({ history: [] });
    const result = await chat.sendMessage(promptContexto);
    const response = await result.response;
    const text = response.text();

    res.json({ resposta: text });

  } catch (error) {
    console.error("Erro no Gemini:", error);
    res.json({ resposta: "Desculpe, tive um problema técnico. Tente novamente." });
  }
};
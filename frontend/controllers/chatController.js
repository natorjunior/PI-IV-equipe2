const { GoogleGenerativeAI } = require("@google/generative-ai");

// Configuração da API Key
// (Lembre-se: Em produção, use process.env.GEMINI_API_KEY)
const genAI = new GoogleGenerativeAI("key api aqui");

// Contexto: Ensinando a IA sobre o seu site
const CONTEXTO_SUPPHINTS = `
Você é o assistente virtual da InfoSuplementos (SuppHints).
Sua função é ajudar usuários com dúvidas sobre o site, a empresa e suplementos.

INFORMAÇÕES DA EMPRESA:
- Nome: InfoSuplementos.
- Missão: Auxiliar consumidores na escolha segura de suplementos, mostrando laudos e aprovações.
- Contato: Instagram @infosuplementos_oficial, WhatsApp (85) 99999-8888.
- Funcionalidades: Busca de produtos, Favoritos (apenas logado), Detalhes técnicos de laudos.

REGRAS:
- Responda de forma curta, amigável e em português.
- Se perguntarem sobre um suplemento específico, explique o que é (ex: Creatina serve para força), mas diga para buscarem na barra de pesquisa para ver as marcas aprovadas.
- Se não souber, peça para contatar o suporte.
`;

// Configuração do Modelo
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash", // Modelo rápido e eficiente (e gratuito no tier free)
    systemInstruction: CONTEXTO_SUPPHINTS // Instrução de sistema (quem a IA é)
});

exports.enviarMensagem = async (req, res) => {
  const { mensagem } = req.body;

  if (!mensagem) {
    return res.status(400).json({ message: "Mensagem vazia." });
  }

  try {
    // Inicia o chat (o Gemini suporta histórico, mas aqui faremos pergunta única para simplificar)
    const chat = model.startChat({
        history: [], // Se quiser manter histórico, podemos implementar depois
    });

    // Envia a mensagem do usuário e aguarda a resposta
    const result = await chat.sendMessage(mensagem);
    const response = await result.response;
    const text = response.text();

    // Retorna para o Front-end no mesmo formato que o front espera
    res.json({ resposta: text });

  } catch (error) {
    console.error("Erro no Gemini:", error);
    
    res.json({ 
        resposta: "Desculpe, estou tendo dificuldades para consultar meus dados agora. Tente novamente em alguns instantes ou fale conosco no WhatsApp." 
    });
  }
};
// importando módulos
const db = require("../connection");

// --- FUNÇÕES PÚBLICAS (NÃO PRECISAM DE LOGIN) ---

//  exportando o método buscarProduto
exports.buscarProduto = (req, res) => {
  //  armazenando o parâmetro de busca da requisição GET e adicionando os parâmetros para realizar a consulta com o LIKE
  //  tratando caso de nenhum parâmetro informado
  const query = req.query.q ? `%${req.query.q}%` : null;
  //  comando sql para realizar a consulta na base com base
  const category = req.query.category; // Novo parâmetro recebido
  let sql;
  //  lista de parâmetros de busca
  let params = [];

  let selectColumns = "s.id_suplemento, s.nome, s.marca, s.tipo_suplemento, s.status_aprovacao";
  //  reatribuindo o comando de acordo com o tipo de usuário
 if (req.session.usuario && req.session.usuario.tipo === "ADMINISTRADOR") {
    selectColumns = "s.*";
  }

  // Monta a query base com LEFT JOIN para imagem
  sql = `
      SELECT ${selectColumns}, ANY_VALUE(m.caminho_midia) AS imagem_url
      FROM suplementos s
      LEFT JOIN midias m ON s.id_suplemento = m.id_suplemento AND m.tipo_midia = 'IMAGEM'
      WHERE 1=1
  `;

  // Filtro por Texto (Nome ou Marca)
  if (query) {
      sql += ` AND (s.nome LIKE ? OR s.marca LIKE ?)`;
      params.push(query, query);
  }

  // Filtro por Categoria
  if (category && category !== 'all') {
      sql += ` AND s.tipo_suplemento = ?`;
      params.push(category);
  }

  // Agrupamento Final
  sql += ` GROUP BY s.id_suplemento`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Erro no banco de dados:", err);
      return res.status(500).json({ message: "Erro na busca." });
    }
    res.json(results);
  });
};

exports.listarDestaques = (req, res) => {
  const sql = `
    SELECT s.id_suplemento, s.nome, s.marca, s.status_aprovacao,
           ANY_VALUE(m.caminho_midia) AS imagem_url
    FROM suplementos s
    LEFT JOIN midias m ON s.id_suplemento = m.id_suplemento AND m.tipo_midia = 'IMAGEM'
    GROUP BY s.id_suplemento
    ORDER BY RAND()
    LIMIT 3
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar destaques:", err);
      return res.status(500).json({ message: "Erro ao buscar destaques." });
    }
    res.json(results);
  });
};

exports.buscarPorId = (req, res) => {
    const { id_suplemento } = req.params;

    const sql = `
        SELECT 
            s.id_suplemento, 
            s.nome, 
            s.marca, 
            s.tipo_suplemento, 
            s.status_aprovacao,
            s.detalhes_laudo,
            s.orgao_laudo,
            s.data_laudo,
            ANY_VALUE(m.caminho_midia) AS imagem_url
        FROM suplementos s
        LEFT JOIN midias m ON s.id_suplemento = m.id_suplemento AND m.tipo_midia = 'IMAGEM'
        WHERE s.id_suplemento = ?
        GROUP BY s.id_suplemento
    `;

    db.query(sql, [id_suplemento], (err, results) => {
        if (err) {
            console.error("Erro ao buscar detalhes:", err);
            return res.status(500).json({ message: "Erro no servidor." });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Suplemento não encontrado." });
        }
        res.json(results[0]);
    });
};

// --- FUNÇÕES PROTEGIDAS (PRECISAM DE LOGIN) ---

// Define e exporta a função para listar os favoritos.
exports.listarFavoritos = (req, res) => {
  // verificar se o usuário está logado.
  // Se não existir o objeto 'usuario' na sessão, o acesso é negado.
  if (!req.session.usuario) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Por favor, faça o login." });
  }
  // Pega o ID do usuário que está logado a partir da sessão.
  const userId = req.session.usuario.id;

  // Comando SQL que usa JOIN para "juntar" a tabela de suplementos com a de favoritos.
  // Ele seleciona apenas os suplementos cujo ID está na lista de favoritos DO USUÁRIO LOGADO.
  const sql = `
    SELECT s.id_suplemento, s.nome, s.marca, s.status_aprovacao,
           ANY_VALUE(m.caminho_midia) AS imagem_url
    FROM suplementos s
    JOIN favoritos f ON s.id_suplemento = f.id_suplemento
    LEFT JOIN midias m ON s.id_suplemento = m.id_suplemento AND m.tipo_midia = 'IMAGEM'
    WHERE f.id_usuario = ?
    GROUP BY s.id_suplemento
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Erro ao buscar favoritos." });
    res.json(results);
  });
};

// Define e exporta a função para adicionar um novo favorito.
exports.adicionarFavorito = (req, res) => {
  // Auth Guard: protege a função.
  if (!req.session.usuario) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Por favor, faça o login." });
  }
  const userId = req.session.usuario.id;
  // Pega o ID do suplemento que o front-end enviou
  const { suplementoId } = req.body;

  // Comando SQL para inserir um novo registro na tabela de 'favoritos', ligando o usuário ao suplemento.
  const sql = "INSERT INTO favoritos (id_usuario, id_suplemento) VALUES (?, ?)";
  db.query(sql, [userId, suplementoId], (err, result) => {
    // Se der erro...
    if (err) {
      // Verifica se o erro é de "Entrada Duplicada". Isso acontece se o usuário tentar favoritar o mesmo item duas vezes.
      if (err.code === "ER_DUP_ENTRY") {
        // Envia uma resposta amigável com o status 409 (Conflito).
        return res
          .status(409)
          .json({ message: "Este item já está nos seus favoritos." });
      }
      console.error("Erro ao adicionar favorito:", err);
      return res.status(500).json({ message: "Erro ao adicionar favorito." });
    }
    // Se a inserção funcionou, envia uma resposta de sucesso com o status 201 (Criado).
    res.status(201).json({ message: "Adicionado aos favoritos com sucesso!" });
  });
};

// Define e exporta a função para remover um favorito.
exports.removerFavorito = (req, res) => {
  // Auth Guard: protege a função.
  if (!req.session.usuario) {
    return res
      .status(401)
      .json({ message: "Acesso negado. Por favor, faça o login." });
  }
  const userId = req.session.usuario.id;
  // Pega o ID do suplemento da URL da requisição
  // O 'req.params' lê parâmetros que vêm na URL.
  const { id_suplemento } = req.params;

  // Comando SQL para deletar um registro da tabela de favoritos.
  // A condição WHERE garante que o usuário só pode deletar SEU PRÓPRIO favorito.
  const sql =
    "DELETE FROM favoritos WHERE id_usuario = ? AND id_suplemento = ?";
  db.query(sql, [userId, id_suplemento], (err, result) => {
    if (err) {
      console.error("Erro ao remover favorito:", err);
      return res.status(500).json({ message: "Erro ao remover favorito." });
    }
    // Se a deleção funcionou, envia uma resposta de sucesso.
    res.json({ message: "Favorito removido com sucesso!" });
  });
};

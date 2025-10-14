// importando módulos
const db = require("../connection");

// --- FUNÇÕES PÚBLICAS (NÃO PRECISAM DE LOGIN) ---

//  exportando o método buscarProduto
exports.buscarProduto = (req, res) => {
  //  armazenando o parâmetro de busca da requisição GET e adicionando os parâmetros para realizar a consulta com o LIKE
  //  tratando caso de nenhum parâmetro informado
  const query = req.query.q ? `%${req.query.q}%` : null;
  //  comando sql para realizar a consulta na base com base
  let sql;
  //  lista de parâmetros de busca
  let params = [];

  //  reatribuindo o comando de acordo com o tipo de usuário
  if (!req.session.usuario || req.session.usuario.tipo === "comum") {
    //  caso a busca contenha parâmetros
    if (query) {
      sql = `
        SELECT nome, marca, tipo, status 
        FROM suplementos 
        WHERE nome LIKE ? OR marca LIKE ? OR tipo LIKE ? OR status LIKE ?`;
      //  alimentanto a lista com os parâmetros de busca
      params = [query, query, query, query];
      //  caso a busca não contenha parâmetros
    } else {
      sql = "SELECT nome, marca, tipo, status FROM suplementos";
    }
    //  comando para usuário administrador
  } else if (req.session.usuario.tipo === "administrador") {
    if (query) {
      sql = `
        SELECT * 
        FROM suplementos 
        WHERE nome LIKE ? OR marca LIKE ? OR tipo LIKE ? OR status LIKE ?`;
      params = [query, query, query, query];
    } else {
      sql = "SELECT * FROM suplementos";
    }
    //  tratando erro de tipo de usuário
  } else {
    return res.status(403).json({ message: "Tipo de usuário inválido." });
  }

  //  realizando a consulta no banco
  db.query(sql, params, (err, results) => {
    //  tratando o caso erro na consulta
    if (err) {
      //  exibindo mensagem de erro no terminal
      console.error("Erro no banco de dados. Erro: ", err);
      //  enviando uma mensagem de erro do servidor para o frontend
      return res
        .status(500)
        .json({ message: "Erro no servidor. Busca por suplemento." });
      //  caso de consulta sem resultados recuperados
    } else if (results.length === 0) {
      return res.status(404).json({ message: "Nenhum suplemento encontrado." });
      //  caso de consulta com resultados recuperados
    } else {
      //  enviando dados recuperados da base
      return res.json(results);
    }
  });
};

// --- FUNÇÕES PROTEGIDAS (PRECISAM DE LOGIN) ---

// Define e exporta a função para listar os favoritos.
exports.listarFavoritos = (req, res) => {
    // verificar se o usuário está logado.
    // Se não existir o objeto 'usuario' na sessão, o acesso é negado.
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Acesso negado. Por favor, faça o login." });
    }
    // Pega o ID do usuário que está logado a partir da sessão.
    const userId = req.session.usuario.id;

    // Comando SQL que usa JOIN para "juntar" a tabela de suplementos com a de favoritos.
    // Ele seleciona apenas os suplementos cujo ID está na lista de favoritos DO USUÁRIO LOGADO.
    const sql = `
        SELECT s.id_suplemento, s.nome_produto, s.marca, s.status_aprovacao 
        FROM suplementos s
        JOIN favoritos f ON s.id_suplemento = f.id_suplemento
        WHERE f.id_usuario = ?
    `;
    // Executa a query, passando o ID do usuário como parâmetro para o 'WHERE'.
    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Erro ao buscar favoritos:", err);
            return res.status(500).json({ message: "Erro ao buscar favoritos." });
        }
        // Envia a lista de favoritos encontrada para o front-end.
        res.json(results);
    });
};

// Define e exporta a função para adicionar um novo favorito.
exports.adicionarFavorito = (req, res) => {
    // Auth Guard: protege a função.
    if (!req.session.usuario) {
        return res.status(401).json({ message: "Acesso negado. Por favor, faça o login." });
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
            if (err.code === 'ER_DUP_ENTRY') {
                // Envia uma resposta amigável com o status 409 (Conflito).
                return res.status(409).json({ message: "Este item já está nos seus favoritos." });
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
        return res.status(401).json({ message: "Acesso negado. Por favor, faça o login." });
    }
    const userId = req.session.usuario.id;
    // Pega o ID do suplemento da URL da requisição 
    // O 'req.params' lê parâmetros que vêm na URL.
    const { id_suplemento } = req.params; 

    // Comando SQL para deletar um registro da tabela de favoritos.
    // A condição WHERE garante que o usuário só pode deletar SEU PRÓPRIO favorito.
    const sql = "DELETE FROM favoritos WHERE id_usuario = ? AND id_suplemento = ?";
    db.query(sql, [userId, id_suplemento], (err, result) => {
        if (err) {
            console.error("Erro ao remover favorito:", err);
            return res.status(500).json({ message: "Erro ao remover favorito." });
        }
        // Se a deleção funcionou, envia uma resposta de sucesso.
        res.json({ message: "Favorito removido com sucesso!" });
    });
};
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

// importando módulos
const db = require("../connection");

// exportando o método listarUsuarios
exports.listarSuplementos = (req, res) => {
  //  tratando caso de usuário não logado
  if (!req.session.usuario) {
    return res.status(401).json({ message: "Acesso negado. Realize o login." });
  }

  //  comando sql para recuperar um usuário da base
  const sql = "SELECT * FROM suplementos";
  //  realizando a consulta no banco
  db.query(sql, (err, results) => {
    //  tratando o caso erro na consulta
    if (err) {
      //  exibindo mensagem de erro no terminal
      console.error("Erro ao buscar um suplemento. Erro: ", err);
      //  enviando uma mensagem de erro do servidor para o frontend
      res.status(500).json({ message: "Erro no servidor. Busca por usuário" });
      //  caso de usuário encontrado
    } else {
      //  enviando dados recuperados da base
      res.json(results);
    }
  });
};

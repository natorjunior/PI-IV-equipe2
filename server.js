//  importando módulos
const express = require("express");
const db = require("./db/connection");

const app = express();
const PORT = 3000;

//  Configurações básicas (middlewares)
app.use(express.json()); //  tratar arquivos JSON
app.use(express.urlencoded({ extended: true })); //  tratar formulários <form>
app.use(express.static("public")); // Servir arquivos estáticos

//  ROTAS
//  Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

//  Rota para cadastro
app.post("/cadastro", (req, res) => {
  //  Convertendo dados do corpo da requisição
  const { nome, email, senha } = req.body;

  //  Comando sql para inserir usuários na base
  const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?)";
  db.query(sql, [nome, email, senha], (err, result) => {
    //  Feedback do cadastro
    if (err) {
      console.error("Erro ao cadastrar: ", err);
      res.status(500).json({ message: "Erro ao cadastrar usuário" });
    } else {
      res.json({ message: "Usuário cadastrado com sucesso" });
    }
  });
});

//  Rota para login
app.post("/login", (req, res) => {
  //  Convertendo os dados do corpo da requisição
  const { email, senha } = req.body;

  //  Comando sql
  const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";
  db.query(sql, [email, senha], (err, result) => {
    //  Feedback do login
    if (err) {
      console.error("Erro no login: ", err);
      res.status(500).json({ message: "Errono no servidor" });
    } else if (result.length > 0) {
      res.json({ message: "Login bem-sucedido" });
    } else {
      res.status(401).json({ message: "E-mail ou senha incorretos" });
    }
  });
});

//  Iniciando servidor
app.listen(PORT, () => {
  console.log("Servidor online em http://localhost:", PORT);
});

//  Arquivo inicial do servidor
//  Vai importar o express, configurar middlewares (JSON, sessões) e chamar rotas;

//  importando o express
const express = require("express");
//  importando módulo session do express
const session = require("express-session");
//  importando o módulo path
const path = require("path");
//  importndo rotas
const authRoutes = require("./routes/authRoutes");
const produtosRoutes = require("./routes/produtosRoutes");

//  criando a aplicação express
const app = express();
//  definindo a porta do servidor
const PORT = 3000;

//  middleware para ler dados tipo json
app.use(express.json());
//  middleware para ler formulários (tag <form>)
app.use(express.urlencoded({ extended: true }));
// servindo arquivos estáticos usando o path que trata separadores de diretórios (/ ou \) de acordo com o sistema operacional
app.use(express.static(path.join(__dirname, "public")));
//  middlewre para usar sessões
app.use(
  session({
    //  chave para assinar cookies da sessão; garante que cookies não sejam adulterados;;
    secret: "seguredo",
    //  indica se a sessão deve ser salva de novo no banco de sessões mesmo sem alterações;
    resave: false,
    //  indica se deve ser criada uma sessão vazia para cada usuário
    saveUninitialized: false,
  })
);

//  rotas de autenticação
app.use("/api/auth", authRoutes);
//  rota de listagem de usuários
app.use("/api/infosuplementos", produtosRoutes);

//  iniciando servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em  http://localhost:${PORT}`);
});

//  Arquivo inicial do servidor
//  Vai importar o express, configurar middlewares (JSON, sessões) e chamar rotas;

//  importando o express
const express = require("express");
//  importando módulo session do express
const session = require("express-session");
//  importando o módulo session-file-store
const FileStore = require("session-file-store")(session);
//  importando o módulo path
const path = require("path");
//  importndo rotas
const authRoutes = require("./routes/authRoutes");
const produtosRoutes = require("./routes/produtosRoutes");
const chatRoutes = require("./routes/chatRoutes");
const adminRoutes = require("./routes/adminRoutes");

//  criando a aplicação express
const app = express();
//  definindo a porta do servidor
const PORT = 3000;

//  middleware para ler dados tipo json
app.use(express.json());
// definindo encoding de caracteres
app.use((req, res, next) => {
  res.charset = "utf-8";
  next();
});
//  middleware para ler formulários (tag <form>)
app.use(express.urlencoded({ extended: true }));
// servindo arquivos estáticos usando o path que trata separadores de diretórios (/ ou \) de acordo com o sistema operacional
app.use(express.static(path.join(__dirname, "public")));
//  middlewre para usar sessões
app.use(
  session({
    //  definindo onde as sessões são armazenadas e desativando os logs do FileStore
    store: new FileStore({ logFn: function () {} }),
    //  chave para assinar cookies da sessão; garante que cookies não sejam adulterados;;
    secret: "8fd7239d-23f1-4892-aaa1-f3a1cf9123f1",
    //  indica se a sessão deve ser salva de novo no banco de sessões mesmo sem alterações;
    resave: false,
    //  indica se deve ser criada uma sessão vazia para cada usuário
    saveUninitialized: false,
    //  renova o tempo de vida da sessão a cada requisição do usuário
    rolling: true,
    //  configurando o cookie de sessão
    cookie: {
      //  duração de 24h
      maxAge: 1000 * 60 * 60 * 24,
      //  impede que o js no navegador acesse o cookie, portegendo contra ataques xss
      httpOnly: true,
      //  define se o cookie só será enviado em conexões https (como estamos rodando em ambiente local com http, definimos como false)
      secure: false,
    },
  })
);
//  rotas de autenticação
app.use("/api/auth", authRoutes);
//  rota de listagem de usuários
app.use("/api/infosuplementos", produtosRoutes);
//  rota de chat com o bot
app.use("/api/chat", chatRoutes);
//  rotas administrativas
app.use("/api/admin", adminRoutes);

//  iniciando servidor
app.listen(PORT, () => {
  console.log("Servidor rodando em  http://localhost:1531");
});

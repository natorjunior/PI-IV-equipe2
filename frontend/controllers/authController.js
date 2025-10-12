//  impotando módulos
const bcrypt = require("bcrypt");
const db = require("../connection");

//  CADASTRO
//  exportando o método cadastrar
exports.cadastrar = async (req, res) => {
  //  Convertendo os dados do corpo da requisição (dados json  que chegaram) e arazenando-os no objeto javscript seguinte
  const { nome, email, senha } = req.body;

  try {
    //  gerando um hash da senha com fator de custo 10
    const hashedPassword = await bcrypt.hash(senha, 10);
    //  comando sql para cadastrar usuário
    const sql = "INSERT INTO usuarios (nome, email, senha_hash) VALUES (?,?,?)";
    //  cadastrando usuário no banco
    db.query(sql, [nome, email, hashedPassword], (err) => {
      //  tratando caso de erro no banco
      if (err) {
        //  exibindo mensagem de erro no terminal
        console.error("Erro ao cadastrar usuário. Erro:", err);
        //  enviando mensagem de erro do servidor para o frontend
        res.status(500).json({ message: "Erro ao cadastrar usuário" });
      } else {
        //  enviado mensagem de sucesso do servidor para o frontend
        res.json({ message: "Usuário cadastrado com sucesso!" });
      }
    });
    //  tratando erro ao gerar a senha hash
  } catch (err) {
    //  exibindo mensagem de erro no terminal
    console.error("Erro ao gerar a senha hash. Erro: ", err);
    //  enviando mensagem de erro no servidor para o frontend
    res.status(500).json({ message: "Erro no servidor. Senha hash" });
  }
};

//  LOGIN
//  exportando o método login
exports.login = (req, res) => {
  //  Convertendo os dados do corpo da requisição (dados json  que chegaram) e arazenando-os no objeto javscript seguinte
  const { email, senha } = req.body;
  //  comando sql para selecionar o registro do usuário a partir do usuário de login
  const sql =
    "SELECT id_usuario, nome, email, senha_hash FROM usuarios WHERE email = ?";
  //  realizando a consulta no banco
  db.query(sql, [email], async (err, results) => {
    //  tratando erro na consulta
    if (err) {
      //  exibindo mensagem de erro no terminal
      console.error("Erro ao realizar o login. Erro: ", err);
      //  enviando mensagem de erro no servidor para o frontend
      return res.status(500).json({ message: "Erro no servidor. Login" });
    }
    //  tratando caso de email NÃO cadastrado
    if (results.length === 0) {
      //  enviando mensagem de erro no servidor para o frontend
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    //  caso o email SEJA encontrado
    else if (results.length > 0) {
      //  armazenando, o registro do usuário retornado pela consulta ao banco, na variável usuario
      const usuario = results[0];
      //  comparando a senha enviada pela requisição com a senha cadastrada no banco
      bcrypt.compare(senha, usuario.senha_hash, (err, match) => {
        //  tratando caso de erro no hash da senha
        if (err) {
          //  exibindo mensagem de erro no terminal
          console.error("Erro no hash da senha. Erro: ", err);
          //  enviando mensagem de erro para o frontend
          return res
            .status(500)
            .json({ message: "Erro no servidor. Senha hash." });
        }

        //  caso de senhas coincidentes
        if (match) {
          //  configurando a sessãao do usuário em um objeto
          req.session.usuario = {
            id: usuario.id_usuario,
            tipo: usuario.tipo_usuairo,
            status: usuario.status_usuario,
            nome: usuario.nome,
            email: usuario.email,
          };

          //  enviando mensagem de sucesso do servidor para o frontend
          res.json({ message: "Login bem-sucedido!" });
        }
      });
    }
  });
};

//  LOGOUT
//  exportando o método logout
exports.logout = (req, res) => {
  //  destruindo a sessão do usuário
  req.session.destroy((err) => {
    //  tratando caso de erro ao destruir a sessão
    if (err) {
      //  exibindo mensagem de erro no termminal
      console.error("Erro ao encerrar a sessão. Erro: ", err);
      //  enviando mensagem de erro no servidor para o frontend
      res.status(500).json({ message: "Erro ao encerrar a sessão." });
      //  limpando a sessão
    } else {
      //  limpando os cookies de sessão do navegador
      res.clearCookie("connect.sid", { path: "/" });
      //  enviando mensagem de sucesso no servidor para o frontned
      res.json({ message: "Logout realizado com sucesso!" });
    }
  });
};

//  importando módulo
const mysql = require("mysql2");

//  função para dar mais robustez a conexão
function createConnectionWithRetry() {
  const config = {
    //  nome do serviço referente ao banco de dados no docker-compose
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "admin",
    database: process.env.DB_NAME || "info_suplementos",
  };

  //  criando a conexão com o banco de dados
  const db = mysql.createConnection(config);

  //  tratando o erro ao estabelecer a cenexão
  db.connect((err) => {
    if (err) {
      console.error(
        "Erro ao conectar ao MySQL, tentando novamente em 5s...:",
        err
      );
      setTimeout(() => {
        //  fechandoa a conexão atual e tantando novamente
        try {
          db.destroy();
        } catch (e) {}
        createConnectionWithRetry();
      }, 5000);
    } else {
      console.log("Conectado ao MySQL com sucesso!");
    }
  });
  return db;
}
module.exports = createConnectionWithRetry();

//  Importando o módulo mysql2
const mysql = require("mysql2");

//  Estabelecendo conexão com a base de dados
const db = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "app_user",
  password: "app_pass",
  database: "app_db",
});

//  Feedback da conexão
db.connect((err) => {
  if (err) {
    console.error("Erro ao conecta-se com o MySQL: ", err);
  } else {
    console.log("Conexão com o banco de dados bem-sucedida!");
  }
});

//  Exportando módulo
module.exports = db;

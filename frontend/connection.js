//  importando módulo
const mysql = require("mysql2");

//  criando o pool de cenexões

const pool = mysql.createPool({
  //  nome do serviço referente ao banco de dados no docker-compose
  host: process.env.DB_HOST || "db",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "admin",
  database: process.env.DB_NAME || "info_suplementos",
  // determinando o tipo de código de caracteres na conexão node-mysql
  charset: "utf8mb4",
  // novas requisições esperam uma conexão ser liberada
  waitForConnections: true,
  // número máximo de conexões
  connectionLimit: 10,
  // número máximo de conexões na fila
  queueLimit: 0,
});

// testando o pool
pool.getConnection((err, connection) => {
  // tratando erro
  if (err) {
    console.error("Erro ao conectar-se ao MySQL. Erro: ", err);
    return;
  }

  // por que não aparece no terminal ?
  // feedback no terminal
  console.log("Conexão (pool) com o MySQL bem sucedida!");

  // devolve a conexão ao pool
  connection.release();
});

// exportando módulo
module.exports = pool;

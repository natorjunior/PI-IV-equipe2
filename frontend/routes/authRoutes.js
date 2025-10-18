//  importando módulos
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

//  definindo rota de cadastro
router.post("/cadastro", authController.cadastrar);
//  defindo a rota de login
router.post("/login", authController.login);
//  defindo a rota de logout
router.post("/logout", authController.logout);

// ROTA ADICIONADA
//  definindo a rota para verificar o status da sessão (se está logado ou não)
router.get("/status", authController.status);

//  exportando módulo
module.exports = router;
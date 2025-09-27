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

//  exportando módulo
module.exports = router;

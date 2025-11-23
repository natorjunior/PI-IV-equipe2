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
// --- NOVAS ROTAS DE PERFIL ---
router.get("/perfil", authController.obterPerfil);
router.put("/perfil", authController.atualizarPerfil); // PUT é o verbo correto para atualizações

//  exportando módulo
module.exports = router;
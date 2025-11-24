const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authController = require("../controllers/authController"); // Importamos para usar o middleware

// Middleware de segurança aplicado a TODAS as rotas deste arquivo
// Se não for admin, nem chega no adminController
router.use(authController.verificarAdmin);

// Rota para cadastrar produto
router.post("/produtos", adminController.criarProduto);

// Rota para editar produto
router.put("/produtos/:id", adminController.editarProduto);

// Rota para excluir produto
router.delete("/produtos/:id", adminController.deletarProduto);

module.exports = router;
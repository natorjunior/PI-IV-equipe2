//  importando módulos
const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

//  Rota PÚBLICA para buscar produtos com ou sem filtros
router.get("/search", produtosController.buscarProduto);

//  exportando módulo
module.exports = router;

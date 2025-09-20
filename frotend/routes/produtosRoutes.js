//  importando módulos
const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

//  defindindo rota para listar usuários
router.get("/", produtosController.listarSuplementos);

//  exportando módulo
module.exports = router;

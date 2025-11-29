//  importando módulos
const express = require("express");
const router = express.Router();
const produtosController = require("../controllers/produtosController");

// --- ROTAS PÚBLICAS (NÃO PRECISAM DE LOGIN) ---

// Rota para pesquisar produtos: /api/infosupplementos/search?q=...
router.get("/search", produtosController.buscarProduto);

// Rota PÚBLICA para buscar os 3 produtos em destaque da home
router.get("/destaques", produtosController.listarDestaques);

// Rota PÚBLICA para exibir os detalhes dos produtos.
router.get("/detalhes/:id_suplemento", produtosController.buscarPorId);

// --- ROTAS PROTEGIDAS (PRECISAM DE LOGIN) ---

// Rota para LISTAR os favoritos do usuário logado
router.get("/favoritos", produtosController.listarFavoritos);

// Rota para ADICIONAR um novo favorito
router.post("/favoritos", produtosController.adicionarFavorito);

// Rota para REMOVER um favorito. O :id_suplemento é um parâmetro na URL
router.delete("/favoritos/:id_suplemento", produtosController.removerFavorito);

//  exportando módulo
module.exports = router;

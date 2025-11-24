const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController"); // Ajuste o caminho se necessário

// Rota pública para conversar com o bot
router.post("/falar", chatController.enviarMensagem);

module.exports = router;
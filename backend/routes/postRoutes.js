const express = require('express');
const postController = require('../controllers/postControlles');


const router = express.Router();

// Rota de criação de post
router.post('/', postController.criarPost);

module.exports = router;

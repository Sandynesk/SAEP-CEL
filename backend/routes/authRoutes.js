const express = require('express');
const authController = require('../controllers/authControllers');

const router = express.Router();

// Rota de login
router.post('/login', authController.login); // Rota de login

// Rota de cadastro
router.post('/cadastro', authController.cadastrar); // Rota de cadastro

module.exports = router;

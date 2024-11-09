// backend/routes/postRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const postQueries = require('../models/PostsModel'); // Funções de consultas SQL

// Rota GET para listar todos os posts
router.get('/', (req, res) => {
  const query = 'SELECT * FROM posts';  // Consulta para obter todos os posts
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar posts:', err);
      return res.status(500).json({ message: 'Erro ao buscar posts' });
    }
    res.status(200).json(results);  // Retorna os posts encontrados
  });
});

// Rota POST para criar um novo post
router.post('/', (req, res) => {
  const { title, content, author_id } = req.body;  // Obtém os dados do corpo da requisição
  const query = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';  // Query para inserir um novo post
  
  db.query(query, [title, content, author_id], (err, result) => {
    if (err) {
      console.error('Erro ao criar post:', err);
      return res.status(500).json({ message: 'Erro ao criar post', error: err });
    }
    res.status(201).json({ message: 'Post criado com sucesso', postId: result.insertId });
  });
});

module.exports = router;

// backend/controllers/postController.js
const postQueries = require('../models/PostsModel');

const criarPost = (req, res) => {
  const { title, content, author_id } = req.body;
  
  // Verifica se os parâmetros obrigatórios foram enviados
  if (!title || !content || !author_id) {
    return res.status(400).json({ message: 'Faltando parâmetros obrigatórios' });
  }

  // Cria o post usando a função de inserção
  postQueries.createPost(title, content, author_id)
    .then((result) => {
      res.status(201).json({ message: 'Post criado com sucesso', result });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Erro ao criar post', error: err });
    });
};

module.exports = {
  criarPost,
};

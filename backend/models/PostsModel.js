// backend/queries/postQueries.js
const db = require('../config/db');

// Função para criar um post
const createPost = (title, content, author_id) => {
  console.log('Inserindo post com os dados:', { title, content, author_id }); // Log dos dados
  
  const query = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    db.query(query, [title, content, author_id], (err, results) => {
      if (err) {
        console.error('Erro ao criar post:', err);  // Log do erro
        reject({ message: 'Erro ao criar post', error: err });
      } else {
        console.log('Post inserido com sucesso:', results);  // Log do resultado
        resolve(results);
      }
    });
  });
};


module.exports = {
  createPost,
};

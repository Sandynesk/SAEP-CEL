// backend/queries/postQueries.js
const db = require('../config/db');

// Função para criar um post
const createPost = (title, content, author_id) => {
  const query = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';
  
  return new Promise((resolve, reject) => {
    db.query(query, [title, content, author_id], (err, results) => {
      if (err) {
        console.error(err); // Exibe o erro no console para facilitar o debug
        reject({ message: 'Erro ao criar post', error: err });
      } else {
        resolve(results);
      }
    });
  });
};

module.exports = {
  createPost,
};

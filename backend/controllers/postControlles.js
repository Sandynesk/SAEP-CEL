const postQueries = require('../models/PostsModel');
const db = require('../config/db');

const criarPost = (req, res) => {
  const { title, content, author_id } = req.body;
  console.log('Recebido author_id:', author_id);

  // 1. Verifica se os parâmetros obrigatórios foram enviados
  if (!title || !content || author_id === undefined || author_id === null) {
    return res.status(400).json({ message: 'Faltando parâmetros obrigatórios ou author_id não foi informado' });
  }

  // 2. Verifica se o author_id existe na sessão e se corresponde ao enviado
  if (!req.session.usuario || req.session.usuario.id !== author_id) {
    return res.status(401).json({ message: 'Você não está autenticado ou o author_id está incorreto' });
  }

  // 3. Verifica se o author_id é válido no banco de dados (opcional, já que estamos garantindo que o author_id vem da sessão)
  const query = 'SELECT id FROM cadastro WHERE id = ?';
  db.query(query, [author_id], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao verificar autor', error: err });
    }

    if (results.length === 0) {
      return res.status(400).json({ message: 'author_id inválido. Não existe um usuário com esse ID.' });
    }

    // 4. Se o author_id for válido, cria o post
    postQueries.createPost(title, content, author_id)
      .then((result) => {
        res.status(201).json({ message: 'Post criado com sucesso', postId: result.insertId });
      })
      .catch((err) => {
        res.status(500).json({ message: 'Erro ao criar post', error: err });
      });
  });
};

module.exports = {
  criarPost,
};

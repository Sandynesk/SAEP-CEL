const db = require('../config/db');
const jwt = require('jsonwebtoken');

// Função para criar post
exports.criarPost = (req, res) => {
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({ message: 'Título e conteúdo são obrigatórios!' });
    }

    const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido. Você precisa estar logado.' });
    }

    jwt.verify(token, 'seu-segredo-aqui', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        const userId = decoded.userId;
        const query = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';
        db.query(query, [title, content, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao criar o post.', error: err });
            }

            res.status(201).json({ message: 'Post criado com sucesso!', postId: result.insertId });
        });
    });
};

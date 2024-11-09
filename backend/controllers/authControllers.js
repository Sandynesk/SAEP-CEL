const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Função de login
exports.login = (req, res) => {
    const { email, senha } = req.body;

    // Validações
    if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // Busca o usuário pelo email no banco de dados
    db.query('SELECT * FROM cadastro WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).json({ message: 'Erro ao buscar usuário' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const user = results[0];

        // Verifica se a senha está correta (com bcrypt)
        bcrypt.compare(senha, user.senha, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Senha inválida' });
            }

            // Gera o token JWT
            const token = jwt.sign({ userId: user.id, nome: user.nome }, 'seu-segredo-aqui', { expiresIn: '1h' });

            // Armazena o nome do usuário na sessão
            req.session.usuario = { id: user.id, nome: user.nome };  // Armazena a informação do usuário na sessão

            // Retorna a resposta com o token
            res.redirect('/');  // Redireciona para a página inicial (home)
        });
    });
};


// Função de cadastro
exports.cadastrar = (req, res) => {
    const { nome, email, idade, endereco, senha } = req.body;

    // Validação simples (opcional)
    if (!nome || !email || !senha) {
        return res.status(400).json({ message: 'Nome, email e senha são obrigatórios.' });
    }

    // Criptografa a senha
    bcrypt.hash(senha, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Erro ao criar senha' });
        }

        const query = 'INSERT INTO cadastro (nome, email, idade, endereco, senha) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nome, email, idade, endereco, hashedPassword], (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados:', err.stack);
                return res.status(500).json({ message: 'Erro ao cadastrar' });
            }
            res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
        });
    });
};

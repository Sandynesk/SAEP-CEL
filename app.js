const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser')
const path = require('path');  
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Pasta onde ficarão os templates

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Criação da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'cimatec',     
    database: 'saepdb' 
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.stack);
        return;
    }
    console.log('Conectado ao banco de dados');
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

// Rotas para os endpoints
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'HTML', 'Login.html'));
});

app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Cadastro.html'));
});

// Rota para pegar todos os posts e exibir
app.get('/posts', (req, res) => {
    // Consulta SQL para buscar os posts
    const query = 'SELECT posts.*, cadastro.nome AS author_name FROM posts JOIN cadastro ON posts.author_id = cadastro.id ORDER BY posts.date DESC';

    db.query(query, (err, result) => {
        if (err) {
            console.error('Erro ao buscar os posts:', err);
            return res.status(500).send('Erro ao carregar os posts');
        }

        // Renderiza o template EJS e passa os posts como dados
        res.render('posts', { posts: result });
    });
});





// Exemplo de rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    // Verifica se o email e senha foram fornecidos
    if (!email || !senha) {
        return res.status(400).send('Email e senha são obrigatórios.');
    }

    // Consulta ao banco de dados
    db.query('SELECT * FROM cadastro WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuário:', err);
            return res.status(500).send('Erro ao buscar usuário');
        }

        // Verifica se o usuário foi encontrado
        if (results.length === 0) {
            return res.status(401).send('Usuário não encontrado');
        }

        const user = results[0];  // O primeiro resultado é o usuário encontrado

        // Verifica se a senha fornecida corresponde à senha no banco de dados
        if (user.senha !== senha) {
            return res.status(401).send('Senha inválida');
        }

        // Gera um token JWT
        const token = jwt.sign({ userId: user.id }, 'seu-segredo-aqui', { expiresIn: '1h' });

        // Retorna o token para o cliente
        res.status(200).json({ message: 'Usuário autenticado com sucesso', token: token });
    });
});

app.post('/cadastro', (req, res) => {
    const { nome, email, idade, endereco, senha } = req.body;

    // Comando SQL para inserir os dados no banco
    const query = 'INSERT INTO cadastro (nome, email, idade, endereco, senha) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [nome, email, idade, endereco, senha], (err, result) => {
        if (err) {
            console.error('Erro ao inserir dados:', err.stack);
            res.status(500).send('Erro ao cadastrar');
            return;
        }
        res.send('Cadastro realizado com sucesso!');
    });
});


// Criação de posts

// Rota para processar o envio do post
// Rota para processar o envio do post
app.post('/posts', (req, res) => {
    const { title, content } = req.body;

    // Verifica se o título e o conteúdo foram preenchidos
    if (!title || !content) {
        return res.status(400).json({ message: 'Título e conteúdo são obrigatórios!' });
    }

    // Verifica se o token foi enviado no cabeçalho
    const token = req.headers['authorization']?.split(' ')[1]; // Obtém o token Bearer

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido. Você precisa estar logado.' });
    }

    // Verifica e decodifica o token
    jwt.verify(token, 'seu-segredo-aqui', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido ou expirado.' });
        }

        const userId = decoded.userId;  // Extrai o ID do usuário do token

        // Inserir o novo post no banco de dados com o user_id
        const query = 'INSERT INTO posts (title, content, author_id) VALUES (?, ?, ?)';
        db.query(query, [title, content, userId], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Erro ao criar o post.', error: err });
            }

            // Responde com sucesso e ID do post
            res.status(201).json({ message: 'Post criado com sucesso!', postId: result.insertId });
        });
    });
});
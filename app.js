const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser')
const path = require('path');  

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Criação da conexão com o banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      
    password: 'senha123',     
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
    res.sendFile(path.join(__dirname, 'public', 'Login.html'));
});



app.post('/login', (req, res) => {
    const { email, senha } = req.body;
    
    // Comando SQL para verificar se o email e senha existem no banco
    const query = 'SELECT * FROM cadastro WHERE email =? AND senha =?';
    
    db.query(query, [email, senha], (err, result) => {
        if (err) {
            console.error('Erro ao verificar dados:', err.stack);
            res.status(500).send('Erro ao realizar login');
            return;
        }
        
        if (result.length === 0) {
            res.status(401).send('Email ou senha inválidos');
            return;
        }
        
        res.send('Login realizado com sucesso!');
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
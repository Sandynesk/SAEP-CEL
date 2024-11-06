const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Conexão com o MySQL

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'cimatec',
    database: 'saep'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conexão com o MySQL realizada com sucesso!');
});

// Rotas



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/Cadastro', (req, res) => {
    const {email} = req.body;
    const sql = 'INSERT INTO email (email) VALUES (?)';
    db.query(sql, [email], (err, result) => {
            if (err){
                if(err.code === 'ER_DUP_ENTRY'){
                    res.send('Email já cadastrado!');
                } else {
                    console.log(err);
                    res.send('Erro ao cadastrar o email!');
            }
            res.send('Email cadastrado com sucesso!');
        }});


});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Importando as rotas de autenticação

const app = express();
const port = 3001;

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Garante que o Express saiba onde está sua pasta de views

// Middleware para processar dados do corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Middleware de sessão para armazenar dados temporários do usuário
app.use(session({ 
    secret: 'seu-segredo-aqui', 
    resave: false, 
    saveUninitialized: false 
}));

// Configurar o middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));  // Corrigido o caminho para a pasta 'public'

// Rota para a home (renderiza home.ejs)
app.get('/', (req, res) => {
    const usuario = req.session.usuario || null;  // Obtém o usuário da sessão ou `null` se não houver usuário logado
    res.render('home', { usuario });  // Passa o objeto `usuario` para a view EJS
});

// Rota para a página de cadastro
app.get('/cadastro', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'Cadastro.html'));  // Ajuste o caminho para o cadastro
});

// Rota para a página de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/html', 'Login.html'));  // Ajuste o caminho para o login
});

// Usar as rotas de autenticação para login e cadastro
app.use(authRoutes);  // Isso permite que as rotas definidas em authRoutes sejam usadas no app

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

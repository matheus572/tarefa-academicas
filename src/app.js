const express = require('express');
const methodOverride = require('method-override');
const path = require('path');
const tarefaRoutes = require('./routes/tarefaRoutes');

const app = express();
const PORT = 3000;

// Configuração do EJS como view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.urlencoded({ extended: true })); // Para parsear formulários
app.use(methodOverride('_method')); // Para suportar PUT/DELETE via formulários
app.use(express.static(path.join(__dirname, '../public'))); // Arquivos estáticos (CSS)

// Rotas
app.use('/tarefas', tarefaRoutes);

// Rota raiz redireciona para /tarefas
app.get('/', (req, res) => {
  res.redirect('/tarefas');
});

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).render('erro', {
    mensagem: 'Página não encontrada',
    statusCode: 404
  });
});

// Middleware de tratamento de erros genérico
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('erro', {
    mensagem: 'Erro interno do servidor',
    statusCode: 500
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
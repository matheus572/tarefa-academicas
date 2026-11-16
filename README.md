# Gerenciador de Tarefas Acadêmicas - MVC

Aplicação web em Node.js + Express para gerenciar tarefas acadêmicas, seguindo o padrão MVC (Model-View-Controller).

## Funcionalidades

- ✅ Cadastrar tarefas (título, descrição, disciplina)
- ✅ Listar tarefas com filtro por status (todas, pendentes, concluídas)
- ✅ Visualizar detalhes de uma tarefa
- ✅ Editar tarefas (título, descrição, disciplina)
- ✅ Marcar tarefas como concluídas
- ✅ Excluir tarefas com confirmação
- ✅ Validação de dados no servidor
- ✅ Páginas de erro amigáveis (404, 500)

## Tecnologias

- Node.js + Express
- EJS (views server-side)
- method-override (PUT/DELETE via formulários)
- CSS puro (sem frameworks)

## Estrutura do Projeto

```
tarefas-mvc/
├── src/
│   ├── app.js                 # Configura Express, middlewares, rotas
│   ├── models/
│   │   └── tarefaModel.js     # Array em memória + CRUD + dados iniciais
│   ├── controllers/
│   │   └── tarefaController.js # Validação, chamadas ao model, views
│   ├── routes/
│   │   └── tarefaRoutes.js    # Mapeamento de URLs
│   └── views/
│       ├── partials/          # header.ejs, footer.ejs
│       ├── lista.ejs          # Lista com filtro
│       ├── detalhes.ejs       # Detalhes completos
│       ├── form.ejs           # Cadastro e edição
│       └── erro.ejs           # Páginas 404/500
├── public/
│   └── css/style.css          # Estilos
├── package.json
├── .gitignore
└── README.md
```

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em produção
npm start

# Executar em desenvolvimento (com --watch)
npm dev
```

O servidor inicia em **http://localhost:3000**

## Rotas

| Método | URL | Descrição |
|--------|-----|-----------|
| GET | `/` | Redireciona para `/tarefas` |
| GET | `/tarefas` | Lista tarefas (query `?status=todas|pendente|concluida`) |
| GET | `/tarefas/nova` | Formulário de nova tarefa |
| POST | `/tarefas` | Cadastra tarefa |
| GET | `/tarefas/:id` | Detalhes da tarefa |
| GET | `/tarefas/:id/editar` | Formulário de edição |
| PUT | `/tarefas/:id` | Atualiza tarefa |
| PATCH | `/tarefas/:id/concluir` | Marca como concluída |
| DELETE | `/tarefas/:id` | Exclui tarefa |

## Validações

- **Título**: obrigatório, 3 a 100 caracteres
- **Descrição**: opcional, até 500 caracteres
- **Disciplina**: obrigatória, 2 a 80 caracteres
- **Status**: "pendente" (padrão) ou "concluida"
- **ID**: incremental, nunca reutilizado

Em caso de erro, o formulário é reexibido com mensagens específicas por campo e os dados digitados são preservados.

## Dados Iniciais

Ao iniciar, o sistema popula 3 tarefas de exemplo (2 pendentes, 1 concluída) em disciplinas diferentes para facilitar demonstração.

## Observações

- Dados armazenados **apenas em memória** (array no model). Reiniciar o servidor apaga tudo.
- Confirmação de exclusão feita via `confirm()` do JavaScript no navegador.
- Escapamento de saída com `<%= %>` no EJS (prevenção de XSS).
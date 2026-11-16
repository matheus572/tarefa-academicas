const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');

// GET /tarefas - Lista tarefas com filtro opcional ?status=
router.get('/', tarefaController.listar);

// GET /tarefas/nova - Formulário de cadastro
router.get('/nova', tarefaController.nova);

// POST /tarefas - Cadastra nova tarefa
router.post('/', tarefaController.criar);

// GET /tarefas/:id - Detalhes da tarefa
router.get('/:id', tarefaController.detalhes);

// GET /tarefas/:id/editar - Formulário de edição
router.get('/:id/editar', tarefaController.editar);

// PUT /tarefas/:id - Atualiza tarefa (via method-override)
router.put('/:id', tarefaController.atualizar);

// PATCH /tarefas/:id/concluir - Marca como concluída
router.patch('/:id/concluir', tarefaController.concluir);

// DELETE /tarefas/:id - Exclui tarefa (via method-override)
router.delete('/:id', tarefaController.excluir);

module.exports = router;
const tarefaModel = require('../models/tarefaModel');

/**
 * Valida os dados de uma tarefa (cadastro ou edição).
 * Retorna objeto com erros por campo (vazio se válido).
 * @param {Object} body - req.body com titulo, descricao, disciplina
 * @returns {Object} { erros: { campo: 'mensagem' }, dadosValidos: { titulo, descricao, disciplina } }
 */
function validarTarefa(body) {
  const erros = {};
  const titulo = body.titulo ? body.titulo.trim() : '';
  const descricao = body.descricao ? body.descricao.trim() : '';
  const disciplina = body.disciplina ? body.disciplina.trim() : '';

  // Validação do título: obrigatório, 3 a 100 caracteres
  if (!titulo) {
    erros.titulo = 'Título é obrigatório';
  } else if (titulo.length < 3) {
    erros.titulo = 'Título deve ter pelo menos 3 caracteres';
  } else if (titulo.length > 100) {
    erros.titulo = 'Título deve ter no máximo 100 caracteres';
  }

  // Validação da descrição: opcional, até 500 caracteres
  if (descricao && descricao.length > 500) {
    erros.descricao = 'Descrição deve ter no máximo 500 caracteres';
  }

  // Validação da disciplina: obrigatória, 2 a 80 caracteres
  if (!disciplina) {
    erros.disciplina = 'Disciplina é obrigatória';
  } else if (disciplina.length < 2) {
    erros.disciplina = 'Disciplina deve ter pelo menos 2 caracteres';
  } else if (disciplina.length > 80) {
    erros.disciplina = 'Disciplina deve ter no máximo 80 caracteres';
  }

  return {
    erros,
    dadosValidos: { titulo, descricao, disciplina }
  };
}

/**
 * Valida e converte ID da rota para número.
 * @param {string} idParam - Parâmetro :id da rota
 * @returns {number|null} ID como número ou null se inválido
 */
function validarId(idParam) {
  const id = parseInt(idParam, 10);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// --- Funções do Controller ---

/**
 * GET /tarefas - Lista tarefas com filtro opcional por status
 */
function listar(req, res) {
  const statusFiltro = req.query.status || 'todas';
  const statusValidos = ['todas', 'pendente', 'concluida'];

  // Se filtro inválido, usa 'todas' como padrão
  const filtro = statusValidos.includes(statusFiltro) ? statusFiltro : 'todas';

  const tarefas = tarefaModel.listar(filtro);
  res.render('lista', { tarefas, filtroAtivo: filtro });
}

/**
 * GET /tarefas/nova - Exibe formulário de cadastro
 */
function nova(req, res) {
  // Valores vazios para novo cadastro
  const tarefa = { titulo: '', descricao: '', disciplina: '' };
  res.render('form', { tarefa, erros: {}, acao: '/tarefas', metodo: 'POST', tituloPagina: 'Nova Tarefa' });
}

/**
 * POST /tarefas - Cadastra nova tarefa
 */
function criar(req, res) {
  const { erros, dadosValidos } = validarTarefa(req.body);

  if (Object.keys(erros).length > 0) {
    // Reexibe formulário com erros e dados preservados
    const tarefa = { ...dadosValidos };
    return res.status(400).render('form', {
      tarefa,
      erros,
      acao: '/tarefas',
      metodo: 'POST',
      tituloPagina: 'Nova Tarefa'
    });
  }

  // Dados válidos: cria no model e redireciona
  tarefaModel.criar(dadosValidos);
  res.redirect('/tarefas');
}

/**
 * GET /tarefas/:id - Exibe detalhes da tarefa
 */
function detalhes(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(404).render('erro', { mensagem: 'ID inválido', statusCode: 404 });
  }

  const tarefa = tarefaModel.buscarPorId(id);
  if (!tarefa) {
    return res.status(404).render('erro', { mensagem: 'Tarefa não encontrada', statusCode: 404 });
  }

  res.render('detalhes', { tarefa });
}

/**
 * GET /tarefas/:id/editar - Exibe formulário de edição preenchido
 */
function editar(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(404).render('erro', { mensagem: 'ID inválido', statusCode: 404 });
  }

  const tarefa = tarefaModel.buscarPorId(id);
  if (!tarefa) {
    return res.status(404).render('erro', { mensagem: 'Tarefa não encontrada', statusCode: 404 });
  }

  res.render('form', {
    tarefa,
    erros: {},
    acao: `/tarefas/${id}?_method=PUT`,
    metodo: 'POST', // Formulário usa POST com method-override
    tituloPagina: 'Editar Tarefa'
  });
}

/**
 * PUT /tarefas/:id - Atualiza tarefa (não altera status nem id)
 */
function atualizar(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(404).render('erro', { mensagem: 'ID inválido', statusCode: 404 });
  }

  const tarefaExistente = tarefaModel.buscarPorId(id);
  if (!tarefaExistente) {
    return res.status(404).render('erro', { mensagem: 'Tarefa não encontrada', statusCode: 404 });
  }

  const { erros, dadosValidos } = validarTarefa(req.body);

  if (Object.keys(erros).length > 0) {
    // Reexibe formulário com erros e dados preservados
    const tarefa = { ...tarefaExistente, ...dadosValidos };
    return res.status(400).render('form', {
      tarefa,
      erros,
      acao: `/tarefas/${id}?_method=PUT`,
      metodo: 'POST',
      tituloPagina: 'Editar Tarefa'
    });
  }

  // Dados válidos: atualiza no model e redireciona
  tarefaModel.atualizar(id, dadosValidos);
  res.redirect(`/tarefas/${id}`);
}

/**
 * PATCH /tarefas/:id/concluir - Marca tarefa como concluída
 */
function concluir(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(404).render('erro', { mensagem: 'ID inválido', statusCode: 404 });
  }

  const tarefa = tarefaModel.concluir(id);
  if (!tarefa) {
    return res.status(404).render('erro', { mensagem: 'Tarefa não encontrada', statusCode: 404 });
  }

  // Se já estava concluída, informa via query string para a view mostrar mensagem
  const jaConcluida = tarefa.status === 'concluida' && req.method === 'PATCH';
  res.redirect(`/tarefas/${id}${jaConcluida ? '?jaConcluida=1' : ''}`);
}

/**
 * DELETE /tarefas/:id - Exclui tarefa
 */
function excluir(req, res) {
  const id = validarId(req.params.id);
  if (!id) {
    return res.status(404).render('erro', { mensagem: 'ID inválido', statusCode: 404 });
  }

  const removido = tarefaModel.excluir(id);
  if (!removido) {
    return res.status(404).render('erro', { mensagem: 'Tarefa não encontrada', statusCode: 404 });
  }

  res.redirect('/tarefas');
}

module.exports = {
  listar,
  nova,
  criar,
  detalhes,
  editar,
  atualizar,
  concluir,
  excluir
};
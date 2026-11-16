// Array em memória para armazenar as tarefas
let tarefas = [];

// Contador incremental para geração de IDs únicos (nunca reutiliza IDs de tarefas excluídas)
let proximoId = 1;

/**
 * Popula o array com 3 tarefas iniciais para demonstração.
 * Uma concluída e duas pendentes, de disciplinas diferentes.
 * Esta função é claramente identificada para facilitar remoção posterior.
 */
function popularDadosIniciais() {
  tarefas = [
    {
      id: proximoId++,
      titulo: 'Estudar para prova de Cálculo',
      descricao: 'Revisar capítulos 1 a 3: limites, derivadas e aplicações',
      disciplina: 'Cálculo I',
      status: 'pendente'
    },
    {
      id: proximoId++,
      titulo: 'Trabalho de Estrutura de Dados',
      descricao: 'Implementar árvore binária de busca em JavaScript',
      disciplina: 'Estrutura de Dados',
      status: 'pendente'
    },
    {
      id: proximoId++,
      titulo: 'Leitura obrigatória de Sociologia',
      descricao: 'Ler capítulos 4 e 5 do livro base da disciplina',
      disciplina: 'Sociologia Geral',
      status: 'concluida'
    }
  ];
}

/**
 * Retorna todas as tarefas, opcionalmente filtradas por status.
 * @param {string} statusFiltro - 'todas', 'pendente' ou 'concluida'
 * @returns {Array} Lista de tarefas filtradas
 */
function listar(statusFiltro = 'todas') {
  if (statusFiltro === 'todas') {
    return [...tarefas]; // Retorna cópia para evitar mutação externa
  }
  return tarefas.filter(t => t.status === statusFiltro);
}

/**
 * Busca uma tarefa pelo ID.
 * @param {number} id - ID da tarefa
 * @returns {Object|undefined} Tarefa encontrada ou undefined
 */
function buscarPorId(id) {
  return tarefas.find(t => t.id === id);
}

/**
 * Cria uma nova tarefa com os dados fornecidos.
 * @param {Object} dados - { titulo, descricao, disciplina }
 * @returns {Object} Tarefa criada
 */
function criar({ titulo, descricao, disciplina }) {
  const novaTarefa = {
    id: proximoId++,
    titulo: titulo.trim(),
    descricao: descricao ? descricao.trim() : '',
    disciplina: disciplina.trim(),
    status: 'pendente' // Status inicial sempre pendente
  };
  tarefas.push(novaTarefa);
  return novaTarefa;
}

/**
 * Atualiza os dados de uma tarefa (não altera status nem id).
 * @param {number} id - ID da tarefa
 * @param {Object} dados - { titulo, descricao, disciplina }
 * @returns {Object|null} Tarefa atualizada ou null se não encontrada
 */
function atualizar(id, { titulo, descricao, disciplina }) {
  const tarefa = buscarPorId(id);
  if (!tarefa) return null;

  tarefa.titulo = titulo.trim();
  tarefa.descricao = descricao ? descricao.trim() : '';
  tarefa.disciplina = disciplina.trim();
  // status e id NÃO são alterados aqui

  return tarefa;
}

/**
 * Marca uma tarefa como concluída.
 * Se já estiver concluída, não faz nada e retorna a tarefa.
 * @param {number} id - ID da tarefa
 * @returns {Object|null} Tarefa atualizada ou null se não encontrada
 */
function concluir(id) {
  const tarefa = buscarPorId(id);
  if (!tarefa) return null;

  if (tarefa.status === 'pendente') {
    tarefa.status = 'concluida';
  }
  // Se já concluída, não altera nada (apenas retorna a tarefa)

  return tarefa;
}

/**
 * Remove uma tarefa pelo ID.
 * @param {number} id - ID da tarefa
 * @returns {boolean} true se removeu, false se não encontrou
 */
function excluir(id) {
  const indice = tarefas.findIndex(t => t.id === id);
  if (indice === -1) return false;

  tarefas.splice(indice, 1);
  return true;
}

// Exporta todas as funções do model
module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  concluir,
  excluir,
  popularDadosIniciais
};

// Popula dados iniciais ao carregar o módulo
popularDadosIniciais();
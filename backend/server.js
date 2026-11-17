// Importa o Express, framework que cria o servidor web (API)
const express = require('express');
// Importa o CORS, que permite o navegador (front) chamar esta API de outra porta
const cors = require('cors');
// Importa o Pool do pg, que gerencia as conexões com o Postgres
const { Pool } = require('pg');

// Cria a aplicação Express
const app = express();
// Libera o CORS para todas as origens e métodos (ok para aula; em produção restrinja)
app.use(cors());
// Faz o Express entender corpo de requisições em formato JSON
app.use(express.json());

// Cria a conexão com o banco usando variáveis de ambiente (definidas no docker-compose.yml)
const pool = new Pool({
  host: process.env.DB_HOST,         // "banco" = nome do serviço no compose (o Docker resolve como DNS)
  user: process.env.DB_USER,         // usuário do Postgres
  password: process.env.DB_PASSWORD, // senha do Postgres
  database: process.env.DB_NAME,     // nome do banco de dados
  port: 5432,                        // porta padrão do Postgres DENTRO da rede do Docker
});

// ---------- CRUD ----------

// READ (Ler): GET /api/tarefas devolve todas as tarefas
app.get('/api/tarefas', async (req, res) => {
  // Executa o SELECT no banco e espera o resultado
  const resultado = await pool.query('SELECT * FROM tarefas ORDER BY id');
  // Responde ao front com a lista (resultado.rows) em JSON
  res.json(resultado.rows);
});

// CREATE (Criar): POST /api/tarefas cria uma nova tarefa
app.post('/api/tarefas', async (req, res) => {
  // Pega o "titulo" enviado no corpo da requisição
  const { titulo } = req.body;
  // Validação simples: título não pode ser vazio
  if (!titulo || !titulo.trim()) {
    // 400 = requisição inválida
    return res.status(400).json({ erro: 'Título é obrigatório' });
  }
  // Insere no banco; $1 evita SQL injection; RETURNING devolve a linha criada
  const resultado = await pool.query(
    'INSERT INTO tarefas (titulo) VALUES ($1) RETURNING *',
    [titulo.trim()]
  );
  // 201 = criado; responde com a tarefa criada
  res.status(201).json(resultado.rows[0]);
});

// UPDATE (Atualizar): PUT /api/tarefas/:id altera título e/ou status de uma tarefa
app.put('/api/tarefas/:id', async (req, res) => {
  // Pega o id que veio na URL (ex: /api/tarefas/3)
  const { id } = req.params;
  // Pega os novos valores enviados no corpo
  const { titulo, concluida } = req.body;
  // COALESCE mantém o valor antigo quando o campo não foi enviado (null)
  const resultado = await pool.query(
    `UPDATE tarefas
        SET titulo = COALESCE($1, titulo),
            concluida = COALESCE($2, concluida)
      WHERE id = $3
  RETURNING *`,
    [titulo ?? null, concluida ?? null, id]
  );
  // Se nenhuma linha foi alterada, o id não existe
  if (resultado.rowCount === 0) {
    // 404 = não encontrado
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  // Responde com a tarefa já atualizada
  res.json(resultado.rows[0]);
});

// DELETE (Apagar): DELETE /api/tarefas/:id remove uma tarefa
app.delete('/api/tarefas/:id', async (req, res) => {
  // Pega o id da URL
  const { id } = req.params;
  // Apaga a linha com esse id
  const resultado = await pool.query('DELETE FROM tarefas WHERE id = $1', [id]);
  // Se nada foi apagado, o id não existe
  if (resultado.rowCount === 0) {
    return res.status(404).json({ erro: 'Tarefa não encontrada' });
  }
  // 204 = sucesso, sem conteúdo para devolver
  res.status(204).end();
});

// Sobe o servidor na porta 3000 (0.0.0.0 = aceita conexões de fora do container)
app.listen(3000, '0.0.0.0', () => {
  // Mensagem que aparece nos logs do container
  console.log('Backend rodando na porta 3000');
});

// Importa o Express, framework que cria o servidor web (API)
const express = require('express');
// Importa o CORS, que permite o navegador (front) chamar esta API de outra porta
const cors = require('cors');
// Importa o Pool do pg, que gerencia as conexões com o Postgres
const { Pool } = require('pg');

// Cria a aplicação Express
const app = express();
// Libera o CORS para todas as origens (ok para aula; em produção restrinja)
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

// Rota GET /api/tarefas: devolve todas as tarefas
app.get('/api/tarefas', async (req, res) => {
  // Executa o SELECT no banco e espera o resultado
  const resultado = await pool.query('SELECT * FROM tarefas ORDER BY id');
  // Responde ao front com a lista (resultado.rows) em JSON
  res.json(resultado.rows);
});

// Rota POST /api/tarefas: cria uma nova tarefa
app.post('/api/tarefas', async (req, res) => {
  // Pega o "titulo" enviado no corpo da requisição
  const { titulo } = req.body;
  // Insere no banco; $1 evita SQL injection; RETURNING devolve a linha criada
  const resultado = await pool.query(
    'INSERT INTO tarefas (titulo) VALUES ($1) RETURNING *',
    [titulo]
  );
  // Responde com a tarefa criada
  res.status(201).json(resultado.rows[0]);
});

// Sobe o servidor na porta 3000 (0.0.0.0 = aceita conexões de fora do container)
app.listen(3000, '0.0.0.0', () => {
  // Mensagem que aparece nos logs do container
  console.log('Backend rodando na porta 3000');
});

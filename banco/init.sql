-- Este arquivo roda UMA vez, automaticamente, quando o Postgres cria o banco pela primeira vez.

-- Cria a tabela "tarefas" apenas se ela ainda não existir
CREATE TABLE IF NOT EXISTS tarefas (
    id SERIAL PRIMARY KEY,                -- id numérico que aumenta sozinho (1, 2, 3...)
    titulo VARCHAR(200) NOT NULL,         -- texto da tarefa, obrigatório
    concluida BOOLEAN NOT NULL DEFAULT FALSE  -- true = feita, false = pendente (começa false)
);

-- Insere duas tarefas de exemplo para a tela não começar vazia
INSERT INTO tarefas (titulo) VALUES
    ('Aprender Docker'),                -- primeira tarefa
    ('Subir meu primeiro container');   -- segunda tarefa

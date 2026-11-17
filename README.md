# Aula de Docker: Front + Back + Banco

```
Navegador ──> frontend (Nginx :8080) 
Navegador ──> backend (Node/Express :3000) ──> banco (Postgres)
```

## Estrutura
```
docker-compose.yml   # orquestra os 3 containers
banco/init.sql       # cria a tabela e dados de exemplo
backend/             # API Node (Dockerfile, package.json, server.js)
frontend/            # página HTML (Dockerfile, index.html)
```

## Como rodar
```bash
docker compose up --build
```
Abra http://localhost:8080 (front). A API fica em http://localhost:3000/api/tarefas.

## Comandos úteis
```bash
docker compose ps          # lista containers
docker compose logs backend  # logs do backend
docker compose down        # para e remove containers (mantém dados)
docker compose down -v     # remove também o volume (apaga o banco)
```

> Obs.: `package.json` não aceita comentários (JSON), então ele não tem. Explique: `dependencies` lista as bibliotecas que o `npm install` do Dockerfile baixa.

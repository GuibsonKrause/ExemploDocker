# Imagem base: Linux leve (alpine) já com Node.js 20 instalado
FROM node:20-alpine

# Define a pasta de trabalho dentro do container (criada se não existir)
WORKDIR /app

# Copia só o package.json primeiro (aproveita o cache do Docker nas dependências)
COPY package.json ./

# Instala as dependências listadas no package.json
RUN npm install

# Copia o resto do código (server.js) para dentro do container
COPY . .

# Documenta que a aplicação escuta na porta 3000
EXPOSE 3000

# Comando executado quando o container inicia
CMD ["npm", "start"]

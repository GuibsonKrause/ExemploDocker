# Imagem base: servidor web Nginx leve, ideal para servir arquivos estáticos
FROM nginx:alpine

# Copia nossa página para a pasta que o Nginx serve por padrão
COPY index.html /usr/share/nginx/html/index.html

# Documenta que o Nginx escuta na porta 80
EXPOSE 80

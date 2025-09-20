# Imagem base - Usando Node.js 22 em versão leve (Alpine Linux)
FROM node:22-alpine

# Definindo diretório de trabalho dentro do container
WORKDIR /app

# Copiando package.json e package-lock.json
COPY package*.json ./

# Instalando dependências
RUN npm install

# Copiando o restante do código para o container
COPY . .


# Expõe a porta em que a aplicação vai rodar
EXPOSE 3000

# Use wait-for-it.sh para aguardar o MySQL antes de iniciar o servidor
CMD ["node", "server.js"]
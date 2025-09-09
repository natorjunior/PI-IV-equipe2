Guia para iniciar a aplicação

Uma vez no reositório raiz do projeto - PI-IV-equipe2, use o seguinte comando para instalar as dependências:

windows/macOS/linux:
npm install

use o seguinte comando para mudar para o diretório infra:

windows/macOS/linux:
cd infra

Em seguida use o seguinte comando para iniciar o docker-compose:

windows/macOS/linux:
docker-compose up -d

Para voltar ao diretório raiz, use:

windows/macOS/linux:
cd ../

para iniciar a aplicação use:

windows/macOS/linux:
npm start

Para a cessar o site da aplicação copie a seguinte URL no browser:

http://localhost:3000/

Para finalizar a aplicação use:

windows/macOS/linux:
ctrl + c

Para finalizar o docker-compose volte ao diretório infra com:

windows/macOS/linux:
cd infra

e execute o seguinte comando:

windows/macOS/linux:
docker-compose down

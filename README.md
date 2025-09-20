# PI-IV Equipe 2 - Sistema de Informações de Suplementos

Sistema web para informações sobre suplementos alimentares.

## Pré-requisitos

- Docker
- Docker Compose

## Como rodar o projeto

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd PI-IV-equipe2
```

2. Execute o projeto:
```bash
docker-compose up -d
```

3. Acesse a aplicação:
- Frontend: http://localhost:3000
- Banco de dados: localhost:3308

## Parar o projeto

```bash
docker-compose down
```

## Estrutura do projeto

- `frontend/` - Aplicação Node.js com Express
- `db/init/` - Scripts de inicialização do banco MySQL
- `docker-compose.yml` - Configuração dos containers

## Tecnologias utilizadas

- Node.js + Express
- MySQL 8.0
- Docker + Docker Compose

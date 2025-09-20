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


------

# 📌 Regras para Uso do Git e GitHub no Desenvolvimento

## ✅ 1. Siga um fluxo de trabalho definido, como **Git Flow**.

### 📂 Exemplo de branches:
- `main` → Produção
- `develop` → Desenvolvimento
- `feature/nome-da-feature` → Novos recursos
- `bugfix/nome-do-bug` → Correções de bugs
- `hotfix/nome-do-hotfix` → Correções urgentes em produção
- `release/versao` → Preparação para lançamento

Exemplo de branches:
main (produção)
develop (desenvolvimento)
feature/nome-da-feature (novos recursos)
bugfix/nome-do-bug (correções de bugs)
hotfix/nome-do-hotfix (correções urgentes em produção)
release/versão (preparação para lançamento)

---

## ✅ 2. Commits pequenos e descritivos
- Faça commits pequenos e frequentes, evitando alterações gigantes.
- Cada commit deve conter **apenas uma mudança lógica**.
- Utilize **um padrão consistente** para os commits.

### 📋 Tabela de Emojis para Commits:
| Emoji | Tipo de Commit      | Exemplo |
|--------|------------------|---------|
| 🎉  | Início de um projeto | `🎉 feat: inicia o projeto` |
| ✨  | Nova funcionalidade | `✨ feat: adiciona autenticação JWT` |
| 🐛  | Correção de bug | `🐛 fix: corrige erro de validação no formulário` |
| ♻️  | Refatoração | `♻️ refactor: melhora performance do endpoint` |
| 🔥  | Remoção de código | `🔥 chore: remove código obsoleto` |
| 🚀  | Melhoria de performance | `🚀 perf: otimiza consulta ao banco de dados` |
| 📝  | Documentação | `📝 docs: adiciona instruções ao README` |
| ✅  | Testes | `✅ test: adiciona novos testes unitários` |
| 🎨  | Estilização | `🎨 style: melhora layout do botão` |
| 🚑  | Hotfix | `🚑 hotfix: corrige erro crítico em produção` |
| ⏪  | Reversão de commit | `⏪ revert: reverte commit X` |

---

---
## ✅ 4 PULL REQUEST

O pull request vai ter as seguintes características:

Título do PR: [nome Projeto- Número Issue]:#tipo de atividade - descrição do título da atividade. 
Corpo do PR: descrição do PR em detalhes. 
Exemplo do PR usando a padronização:
 
Projeto: Aplicativo de lista de tarefas.
Issue: 10.
Tipo de atividade: pode ser feature, bugfix ou outra.

Exemplo:

Título do PR: 
[ALT-10]:#bugfix-Corrigir correção da data das notas.

## ✅ 3. Sempre use branches para novas funcionalidades e correções
- Nunca faça commits diretamente na branch `main` ou `develop`.
- Crie branches específicas para cada tarefa:
  ```sh
  git checkout -b feature/nova-feature
  ```

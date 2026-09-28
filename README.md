# Job Tracker

Plataforma web para centralizar, organizar e acompanhar candidaturas e processos seletivos em um só lugar, sem depender de planilhas, favoritos e anotações espalhadas.

> 🚧 **Status do Projeto:** Em desenvolvimento. O projeto ainda não está completo e algumas funcionalidades podem estar pendentes ou incompletas. 

## Sobre o Projeto

Quem procura emprego costuma gastar mais tempo organizando informações do que buscando novas oportunidades. O JobTracker resolve isso permitindo:

- Salvar vagas interessantes numa wishlist, sem precisar iniciar um processo seletivo;
- Converter uma vaga salva em candidatura ativa;
- Acompanhar cada candidatura em um quadro Kanban por etapa do processo;
- Registrar contatos, datas de entrevista e anotações;
- Visualizar métricas da sua busca por emprego.

## Funcionalidades 
- **Autenticação:** Cadastro, login, logout e isolamento dos dados por usuário
- **Vagas salvas:** CRUD de vagas (empresa, cargo, descrição, URL, salário, localização, modalidade, regime de contratação, fonte e prazo)
- **Candidaturas:** Conversão de vaga em candidatura, edição e exclusão
- **Kanban:** Candidaturas organizadas por status, com drag & drop
- **Notas:** Criar, visualizar e excluir anotações por candidatura
- **Histórico de status:** Linha do tempo de todas as mudanças de status
- **Dashboard:** Vagas salvas, candidaturas ativas e encerradas, taxa de avanço para entrevistas, candidaturas da semana, propostas e rejeições

**Status das candidaturas**
`APPLIED` → `IN_REVIEW` → `INTERVIEWING` → `TECHNICAL_TEST` → `PROPOSAL` → `HIRED`. Além de `REJECTED` e `WITHDRAWN` (desistência, não exibida no quadro).

## Tecnologias

- [Next.js](https://nextjs.org/)(App Router) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Prisma ORM](https://www.prisma.io/) + [PostgreSQL](https://www.postgresql.org/)
- [Better Auth](https://www.better-auth.com/) para autenticação
- [Zod](https://zod.dev/) para validação 

## Estrutura do Projeto

```text
src/
├── actions/          # Server Actions
├── app/           
|    ├── (auth)       # Rotas de autenticação
|    ├── (dashboard)  # Área autenticada
|    └── api/
├── components/       # Componentes reutilizáveis
├── lib/              # Prisma, autenticação e utilitários
└── schemas/          # Validação de dados com Zod

prisma/
├── migrations/    # Migrações do banco de dados
└── schema.prisma  # Modelos e enums do domínio

docs/              # Documentação complementar
```

## Modelo de Dados

Principais entidades: `User`, `Job`, `Application`, `Note` e `ApplicationStatusHistory`, além das tabelas de autenticação (`Session`, `Account`, `Verification`).
```text
User
 ├──< Job
 │     └── Application (0..1 por vaga)
 │            ├──< Note
 │            └──< ApplicationStatusHistory
 └──< Application
```
O schema completo está em `prisma/schema.prisma`.

## Como Executar o Projeto

### Pré-requisitos

- Node.js 18 ou superior
- Um banco PostgreSQL (local ou em nuvem)
- npm, yarn ou pnpm

### Configuração local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Crie um arquivo `.env` na raiz do projeto e configure a conexão com o PostgreSQL. Exemplo:

   ```dotenv
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/job_tracker?schema=public"
   ```

   Substitua `usuario`, `senha` e `job_tracker` pelos dados do seu banco.

3. Aplique as migrações e gere o Prisma Client:

   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse [http://localhost:3000](http://localhost:3000).

O arquivo `.env` não deve ser versionado. Em produção, configure também os valores de autenticação exigidos pelo Better Auth para o ambiente de implantação.

## Autor

Feito por **Tiane Matos**

- **GitHub:** @TianeMatos
- **LinkedIn:** https://www.linkedin.com/in/tiane-matos/



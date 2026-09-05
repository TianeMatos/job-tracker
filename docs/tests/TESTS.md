# 🧪 Plano de Testes Manual — JobTracker (MVP)

Este documento registra a suíte de testes manuais executada via rotas HTTP (Postman) e interface gráfica para validar as Server Actions e regras de negócio do backend do JobTracker.

---

## 1. Autenticação & Isolamento de Dados (Security & Auth)

- [✅] **TC-AUTH-01: Registro de Usuário com Sucesso**
  - **Entrada:** Body com e-mail válido, nome e senha.
  - **Esperado:** Retorno HTTP 201/200, usuário persistido no banco com hash de senha.
  - **Status:** Sucesso

- [✅] **TC-AUTH-02: Bloqueio de Acesso Não Autenticado**
  - **Ação:** Chamada para Server Action `createNote` sem cookie de sessão ativo.
  - **Esperado:** `requireAuth()` lança `Error("Não autenticado.")`.
  - **Status:** Sucesso

- [✅] **TC-AUTH-03: Sem Vazamento de Dados entre Usuários (Multi-tenant)**
  - **Cenário:** O Usuário 'A' tenta buscar, editar ou excluir uma nota/candidatura/vaga pertencente ao Usuário 'B' passando o ID diretamente.
  - **Esperado:** Retorno com erro `"Candidatura não encontrada."` / `"Nota não encontrada."` / `"Vaga não encontrada."` (via `P2025` do Prisma, já que o `where` sempre combina `id` + `userId`).
  - **Status:** Sucesso

- [✅] **TC-AUTH-04: Ownership Cruzado dentro do Mesmo Usuário (Notes)**
  - **Cenário:** Usuário 'A' possui duas candidaturas (`app-1` e `app-2`), cada uma com notas próprias. Ele tenta chamar `deleteNote(applicationId: "app-1", id: <nota que pertence a app-2>)` — ou seja, IDs válidos e do mesmo dono, mas combinação errada entre nota e candidatura.
  - **Esperado:** `P2025` / `"Nota não encontrada."`, validando que o filtro redundante `applicationId` no `where` do `deleteNote` realmente impede a exclusão cruzada, mesmo sendo tudo do mesmo usuário.
  - **Status:** Sucesso

- [✅] **TC-AUTH-05: Login com Credenciais Inválidas**
  - **Ação:** `signInAction` com senha incorreta.
  - **Esperado:** `success: false` com mensagem de erro vinda do Better Auth (via `isAPIError`), sem lançar exceção não tratada.
  - **Status:** Sucesso

- [✅] **TC-AUTH-06: Logout**
  - **Ação:** `signOutAction()` com sessão ativa.
  - **Esperado:** `success: true`, sessão/cookie invalidado — chamada subsequente a uma action autenticada deve falhar como TC-AUTH-02.
  - **Status:** Sucesso

---

## 2. Gerenciamento de Anotações (Notes)

- [✅] **TC-NOTE-01: Criar Nota Válida**
  - **Ação:** `createNote(applicationId, { content: "Entrevista técnica foi agendada para sexta." })`
  - **Esperado:** Sucesso (`success: true`), nota gravada no banco com `createdAt` e `applicationId` corretos.
  - **Status:** Sucesso

- [✅] **TC-NOTE-02: Validação Zod ao Criar Nota Inválida**
  - **Ação:** `createNote(applicationId, { content: "" })` (conteúdo vazio ou inválido).
  - **Esperado:** `success: false` com mensagem de erro retornada diretamente do Zod Schema.
  - **Status:** Sucesso

- [✅] **TC-NOTE-03: Listar Notas da Candidatura**
  - **Ação:** `getNotes(applicationId)`
  - **Esperado:** Lista de notas associadas à candidatura ordenada por data descendente (`orderBy: createdAt desc`).
  - **Status:** Sucesso

- [✅] **TC-NOTE-04: Excluir Nota Existente**
  - **Ação:** `deleteNote(applicationId, noteId)`
  - **Esperado:** `success: true`, remoção do registro no banco.
  - **Status:** Sucesso

- [✅] **TC-NOTE-05: Tentar Excluir Nota Inexistente**
  - **Ação:** `deleteNote(applicationId, "id-que-nao-existe")`
  - **Esperado:** Captura do erro `P2025` do Prisma e retorno da mensagem amigável `"Nota não encontrada."`.
  - **Status:** Sucesso -> mensagem (zod): "✖ ID da nota inválido."

- [✅] **TC-NOTE-06: Criar Nota com `applicationId` Inválido**
  - **Ação:** `createNote("id-mal-formatado", { content: "teste" })`
  - **Esperado:** `success: false` com erro de validação do `applicationIdSchema`, sem chegar a consultar o banco.
  - **Status:** Sucesso -> mensagem (zod): "✖ ID da candidatura inválido."

- [✅] **TC-NOTE-07: Cascade ao Excluir Application**
  - **Ação:** Criar 2+ notas em uma candidatura, depois excluir a candidatura (via `deleteApplication`).
  - **Esperado:** As notas são removidas automaticamente do banco (`onDelete: Cascade`), sem deixar registros órfãos.
  - **Status:** Sucesso

---

## 3. Gestão de Vagas (Jobs)

- [✅] **TC-JOB-01: Criar Vaga Salva (sem candidatura)**
  - **Ação:** `createJob({ hasApplied: false, company, role, ... })`
  - **Esperado:** `success: true`, `Job` criada sem `Application` vinculada, aparece em "Vagas Salvas" (UC05).
  - **Status:** Sucesso

- [✅] **TC-JOB-02: Criar Vaga já Aplicada (create aninhado)**
  - **Ação:** `createJob({ hasApplied: true, application: {...}, company, role, ... })`
  - **Esperado:** `Job` e `Application` criadas juntas, `Application` inicia com status correto e `userId` vinculado.
  - **Status:** Sucesso

- [✅] **TC-JOB-03: URL Inválida na Criação/Edição**
  - **Ação:** `createJob`/`updateJob` com `jobUrl: "não-e-uma-url"`.
  - **Esperado:** `success: false`, erro de validação Zod (RN-06 — URL deve ser `http://` ou `https://` quando preenchida).
  - **Status:** Sucesso

- [✅] **TC-JOB-04: Editar Vaga Existente**
  - **Ação:** `updateJob(id, { company: "Novo Nome" })`
  - **Esperado:** `success: true`, apenas o campo informado é alterado (update parcial), demais campos preservados.
  - **Status:** Sucesso

- [❌] **TC-JOB-05: Buscar Vaga por ID Inexistente**
  - **Ação:** `getJobById("id-que-nao-existe")`
  - **Esperado:** `success: false`, `"Vaga não encontrada."`
  - **Status:** Falhou -> Não tratava resultado `null`

---

## 4. Gestão de Candidaturas (Applications)

- [ ] **TC-APP-01: Mover Candidatura no Kanban (Status Change)**
  - **Ação:** Atualizar status de candidatura de `APPLIED` para `INTERVIEWING`.
  - **Esperado:** Atualização no banco e persistência da nova coluna ao recarregar a tela.
  - **Status:** ⏳ Pendente

- [✅] **TC-APP-02: Converter Vaga Salva em Candidatura**
  - **Ação:** `applyToJob(jobId)`
  - **Esperado:** Registro criado em `Application` associado ao `Job`, vinculando o `userId`, com `status: "APPLIED"` e `appliedAt` preenchido (data informada ou atual — RN-09).
  - **Status:** Sucesso

- [✅] **TC-APP-02b: Impedir Candidatura Duplicada na Mesma Vaga**
  - **Ação:** Chamar `applyToJob(jobId)` uma segunda vez para a **mesma** `Job` que já possui `Application` (RN-08).
  - **Esperado:** `success: false`, `"Você já se candidatou a esta vaga."`.
  - **Status:** Sucesso

- [✅] **TC-APP-03: Editar Detalhes da Candidatura**
  - **Ação:** `updateApplicationDetails(id, { contactName, contactEmail, interviewDate })`
  - **Esperado:** `success: true`, campos atualizados sem alterar `status`.
  - **Status:** Sucesso -> Ou altera os Campos Opcionais ou altera o Status

- [✅] **TC-APP-04: E-mail de Contato Inválido**
  - **Ação:** `updateApplicationDetails(id, { contactEmail: "nao-e-email" })`
  - **Esperado:** `success: false`, erro de validação Zod.
  - **Status:** Sucesso

- [✅] **TC-APP-05: Excluir Somente a Candidatura ("Cancelar Candidatura")**
  - **Ação:** `deleteApplication(id)`, mantendo a `Job` associada intacta.
  - **Esperado:** `Application` removida; a `Job` correspondente volta a aparecer em "Vagas Salvas" (`application == null`), conforme UC05.
  - **Status:** Sucesso

- [✅] **TC-APP-06: Excluir Vaga Inteira (com Candidatura)**
  - **Ação:** `deleteJob(id)` em uma vaga que possui `Application` vinculada.
  - **Esperado:** `Job` e `Application` (e `Notes`) removidas em cascade — nada órfão sobra no banco.
  - **Status:** Sucesso

---

## 5. Dashboard de Métricas (RF-08)

> **Pré-condição sugerida:** popular o banco com um conjunto conhecido de dados antes de rodar esta seção — ex: 2 `Job` sem `Application` (vagas salvas), 5 `Application` distribuídas entre `APPLIED`, `INTERVIEWING`, `PROPOSAL`, `REJECTED`, `HIRED`, e pelo menos 1 `Application` com `appliedAt` dentro dos últimos 7 dias e 1 fora desse período. Conferir os números manualmente contra o retorno da action.

- [✅] **TC-DASH-01: Contagem de Vagas Salvas**
  - **Esperado:** `savedJobs` reflete exatamente as `Job` com `application: null`, sem contar as já convertidas.
  - **Status:** Sucesso

- [✅] **TC-DASH-02: Contagem de Candidaturas Ativas vs. Encerradas**
  - **Esperado:** `activeJobs` soma `APPLIED + IN_REVIEW + INTERVIEWING + TECHNICAL_TEST + PROPOSAL`; `closed` soma `REJECTED + HIRED`. A soma dos dois deve bater com `totalApplications`.
  - **Status:** Sucesso

- [✅] **TC-DASH-03: Taxa de Avanço para Entrevista**
  - **Esperado:** `interviewRate` calculada como `(candidaturas em INTERVIEWING ou além) / total * 100`, usando o **status atual** (interpretação assumida, já que o schema não guarda histórico de status). Testar também com `totalApplications == 0` (usuário novo, sem candidaturas) — deve retornar `0`, não erro de divisão por zero.
  - **Status:** Sucesso

- [✅] **TC-DASH-04: Candidaturas da Semana**
  - **Esperado:** `applicationsThisWeek` conta apenas `Application` com `appliedAt` dentro dos últimos 7 dias — confirmar que uma candidatura com `appliedAt` antigo mas `createdAt` recente **não** é contada (valida que o filtro usa `appliedAt`, não `createdAt`).
  - **Status:** Sucesso

- [✅] **TC-DASH-05: Isolamento por Usuário no Dashboard**
  - **Ação:** Usuário 'A' e 'B' com dados distintos chamam `getDashboardMetrics()` cada um.
  - **Esperado:** Cada um vê apenas suas próprias métricas — nenhum número "vaza" de um usuário para outro.
  - **Status:** Sucesso

---

## 📊 Resumo das Execuções

* **Total de Cenários:** 28
* **Passou (PASS):** 27
* **Falhou (FAIL):** 1 (Encontrado e corrigido durante a execução)
* **Última Execução:** 04/09/2026
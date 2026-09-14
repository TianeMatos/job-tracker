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
  - **Esperado:** `requireAuth()` lança `AuthError("Não autenticado.")`, capturada pelo `runAction` e retornada como `{ success: false, error: { message: "Não autenticado.", code: 401 } }`.
  - **Status:** Sucesso

- [✅] **TC-AUTH-03: Sem Vazamento de Dados entre Usuários (Multi-tenant)**
  - **Cenário:** O Usuário 'A' tenta buscar, editar ou excluir uma nota/candidatura/vaga pertencente ao Usuário 'B' passando o ID diretamente.
  - **Esperado:** Retorno com `{ success: false, error: { message: "Registro não encontrado.", code: 404 } }` (via `P2025` do Prisma, já que o `where` sempre combina `id` + `userId`). A mensagem é genérica desde a centralização do tratamento de erro no `runAction` — não há mais diferenciação por entidade ("Candidatura não encontrada." etc. não são mais retornadas).
  - **Status:** Sucesso

- [✅] **TC-AUTH-04: Ownership Cruzado dentro do Mesmo Usuário (Notes)**
  - **Cenário:** Usuário 'A' possui duas candidaturas (`app-1` e `app-2`), cada uma com notas próprias. Ele tenta chamar `deleteNote(applicationId: "app-1", id: <nota que pertence a app-2>)` — ou seja, IDs válidos e do mesmo dono, mas combinação errada entre nota e candidatura.
  - **Esperado:** `{ success: false, error: { message: "Registro não encontrado.", code: 404 } }`, validando que o filtro redundante `applicationId` no `where` do `deleteNote` realmente impede a exclusão cruzada, mesmo sendo tudo do mesmo usuário.
  - **Status:** Sucesso

- [✅] **TC-AUTH-05: Login com Credenciais Inválidas**
  - **Ação:** `signIn` com senha incorreta.
  - **Esperado:** `{ success: false, error: { message, code } }` com mensagem e status vindos do Better Auth (via `isAPIError`), sem lançar exceção não tratada.
  - **Status:** Sucesso

- [✅] **TC-AUTH-06: Logout**
  - **Ação:** `signOut()` com sessão ativa.
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
  - **Esperado:** `success: false`, `error.code: 400`, mensagem legível vinda de `validationError`.
  - **Status:** Sucesso

- [✅] **TC-NOTE-03: Listar Notas da Candidatura**
  - **Ação:** `getNotes(applicationId)`
  - **Esperado:** Lista de notas associadas à candidatura ordenada por data descendente (`orderBy: createdAt desc`).
  - **Status:** Sucesso

- [✅] **TC-NOTE-04: Excluir Nota Existente**
  - **Ação:** `deleteNote(applicationId, noteId)`
  - **Esperado:** `success: true`, remoção do registro no banco.
  - **Status:** Sucesso

- [✅] **TC-NOTE-05: Criar Nota com `id` de Nota em Formato Inválido**
  - **Ação:** `deleteNote(applicationId, "id-que-nao-existe")` (string que não é um UUID válido).
  - **Esperado:** `success: false`, `error.code: 400`, mensagem de validação Zod: `"ID da nota inválido."` — rejeitado antes de chegar ao banco.
  - **Status:** Sucesso
  - **Observação:** este cenário originalmente estava rotulado como teste do caminho `P2025` ("nota inexistente"), mas na prática valida apenas a validação de formato do Zod, já que a string usada não é um UUID. Renomeado para refletir o que de fato é testado. O caminho `P2025` de `deleteNote` passou a ser coberto pelo novo TC-NOTE-05b abaixo.

- [✅] **TC-NOTE-05b: Excluir Nota com UUID Válido mas Inexistente**
  - **Ação:** `deleteNote(applicationId, "00000000-0000-0000-0000-000000000000")` — UUID bem formado, mas que não existe no banco.
  - **Esperado:** Passa pela validação Zod, chega ao Prisma, retorna `P2025` → `{ success: false, error: { message: "Registro não encontrado.", code: 404 } }`.
  - **Status:** Sucesso

- [✅] **TC-NOTE-06: Criar Nota com `applicationId` Inválido**
  - **Ação:** `createNote("id-mal-formatado", { content: "teste" })`
  - **Esperado:** `success: false`, `error.code: 400`, erro de validação do `applicationIdSchema`, sem chegar a consultar o banco.
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
  - **Esperado:** `success: false`, `"Registro não encontrado."`
  - **Status:** Falhou -> Não tratava resultado `null` | Consertado

- [✅] **TC-JOB-06: Paginação — Página Intermediária**
  - **Ação:** Popular o banco com mais vagas do que o `limit` padrão, chamar `getJobs({ limit: N })` com `N` menor que o total.
  - **Esperado:** Retorna exatamente `N` itens em `data.items`, `data.hasMore: true`.
  - **Status:** Sucesso

- [✅] **TC-JOB-07: Paginação — Última Página**
  - **Ação:** Avançar a paginação até o fim do conjunto de vagas do usuário.
  - **Esperado:** `data.hasMore: false`, sem itens duplicados ou faltando em relação ao total real no banco.
  - **Status:** Sucesso

- [✅] **TC-JOB-08: Paginação — Limite Fora do Permitido**
  - **Ação:** Chamar `getJobs({ limit: 999 })` (acima do máximo definido no `paginationInputSchema`).
  - **Esperado:** `success: false`, `error.code: 400` — validação Zod rejeita antes de consultar o banco, sem aplicar um limite absurdo silenciosamente.
  - **Status:** Sucesso

- [✅] **TC-JOB-09: Vaga com Candidatura Não Aparece como "Vaga Salva" Disponível (RN-13)**
  - **Ação:** Criar uma `Job` e convertê-la em `Application` via `applyToJob`. Consultar o fluxo/listagem de "Vagas Salvas".
  - **Esperado:** A vaga não aparece disponível para o fluxo de gerenciamento de vagas salvas (nem para exclusão direta por esse fluxo) enquanto a `Application` existir — conforme RN-13.
  - **Status:** Sucesso

---

## 4. Gestão de Candidaturas (Applications)

- [✅] **TC-APP-01: Mover Candidatura no Kanban (Status Change)**
  - **Ação:** Atualizar status de candidatura de `APPLIED` para `INTERVIEWING`.
  - **Esperado:** Atualização no banco e persistência da nova coluna ao recarregar a tela.
  - **Status:** Sucesso - No Back-end

- [✅] **TC-APP-01b: Reenviar o Mesmo Status (Idempotência)**
  - **Ação:** Chamar `updateApplicationStatus` passando o **mesmo** status que a candidatura já possui (ex: já está `INTERVIEWING`, reenvia `INTERVIEWING`).
  - **Esperado:** Nenhum novo registro em `ApplicationStatusHistory`; `data` retornado tem o mesmo shape (`Application & { job, notes }`) que o caminho de mudança real de status.
  - **Status:** Sucesso

- [✅] **TC-APP-02: Converter Vaga Salva em Candidatura**
  - **Ação:** `applyToJob(jobId)`
  - **Esperado:** Registro criado em `Application` associado ao `Job`, vinculando o `userId`, com `status: "APPLIED"` e `appliedAt` preenchido (data informada ou atual — RN-09).
  - **Status:** Sucesso

- [✅] **TC-APP-02b: Impedir Candidatura Duplicada na Mesma Vaga**
  - **Ação:** Chamar `applyToJob(jobId)` uma segunda vez para a **mesma** `Job` que já possui `Application` (RN-08).
  - **Esperado:** `success: false`, `BusinessError`: `"Você já se candidatou a esta vaga."`.
  - **Status:** Sucesso

- [✅] **TC-APP-03: Editar Detalhes da Candidatura**
  - **Ação:** `updateApplicationDetails(id, { contactName, contactEmail, interviewDate })`
  - **Esperado:** `success: true`, campos atualizados sem alterar `status`.
  - **Status:** Sucesso -> Ou altera os Campos Opcionais ou altera o Status

- [✅] **TC-APP-04: E-mail de Contato Inválido**
  - **Ação:** `updateApplicationDetails(id, { contactEmail: "nao-e-email" })`
  - **Esperado:** `success: false`, `error.code: 400`, erro de validação Zod.
  - **Status:** Sucesso

- [✅] **TC-APP-05: Excluir Somente a Candidatura ("Cancelar Candidatura")**
  - **Ação:** `deleteApplication(id)`, mantendo a `Job` associada intacta.
  - **Esperado:** `Application` removida; a `Job` correspondente volta a aparecer em "Vagas Salvas" (`application == null`), conforme UC05.
  - **Status:** Sucesso

- [✅] **TC-APP-06: Excluir Vaga Inteira (com Candidatura)**
  - **Ação:** `deleteJob(id)` em uma vaga que possui `Application` vinculada.
  - **Esperado:** `Job` e `Application` (e `Notes`) removidas em cascade — nada órfão sobra no banco.
  - **Status:** Sucesso

- [✅] **TC-APP-07: Desistir de uma Candidatura (`WITHDRAWN`)**
  - **Ação:** Atualizar o status de uma `Application` ativa para `WITHDRAWN`.
  - **Esperado:** `success: true`; registro de histórico criado com `status: "WITHDRAWN"`; a `Application` **não** é excluída, apenas muda de status (RF-12).
  - **Status:** Sucesso

- [✅] **TC-APP-08: Candidatura `WITHDRAWN` Não Aparece no Kanban (RN-04)**
  - **Ação:** Após o teste anterior, chamar `getApplications()` (usado para montar o Kanban).
  - **Esperado:** A candidatura com status `WITHDRAWN` **não** está presente na lista retornada (filtro `status: { not: "WITHDRAWN" }`).
  - **Status:** Sucesso

- [✅] **TC-APP-09: Candidatura `WITHDRAWN` Continua Visível no Detalhe da Vaga**
  - **Ação:** Chamar `getJobById(jobId)` para a vaga cuja `Application` está `WITHDRAWN`.
  - **Esperado:** `success: true`, a `Application` com status `WITHDRAWN` é retornada normalmente dentro de `job.application` — o dado não foi perdido, só saiu do Kanban.
  - **Status:** Sucesso

- [✅] **TC-APP-10: Vaga com Candidatura `WITHDRAWN` Continua "Travada" (RN-08)**
  - **Ação:** Tentar chamar `applyToJob(jobId)` novamente para a mesma `Job` cuja `Application` está `WITHDRAWN` (não excluída).
  - **Esperado:** `success: false`, `"Você já se candidatou a esta vaga."` — confirma que desistir (`WITHDRAWN`) é diferente de excluir a candidatura: a vaga só é liberada para nova candidatura via `deleteApplication`, não via mudança de status.
  - **Status:** Sucesso

- [✅] **TC-APP-11: Histórico de Status Preservado ao Excluir Candidatura**
  - **Cenário inverso:** Mudar status de uma `Application` 2-3 vezes (gerando múltiplos registros em `ApplicationStatusHistory`), depois excluir a `Application` via `deleteApplication`.
  - **Esperado:** Todos os registros de `ApplicationStatusHistory` associados são removidos em cascade — nenhum registro órfão sobra referenciando um `applicationId` inexistente.
  - **Status:** Sucesso

- [✅] **TC-APP-12: Ordem Cronológica do Histórico (RF-11)**
  - **Ação:** Mudar o status de uma `Application` em sequência: `APPLIED` → `IN_REVIEW` → `INTERVIEWING`. Consultar `ApplicationStatusHistory` dessa candidatura.
  - **Esperado:** Três registros existem, ordenados por `createdAt` do mais antigo para o mais recente, refletindo exatamente a sequência de transições realizada.
  - **Status:** Sucesso

---

## 5. Reordenação no Kanban (RF-13 — Drag & Drop Completo)

- Pré-condição sugerida: popular uma coluna (ex.: APPLIED) com 4 candidaturas do mesmo usuário, em posições conhecidas 0, 1, 2, 3 (W, Y, Z, D, respectivamente), para poder conferir o deslocamento exato após cada chamada.

- [✅] **TC-APP-13: Reordenar Para Frente na Mesma Coluna**
  -  **Ação:** reorderApplication(D.id, { position: 3 }), com D originalmente em position: 1.
  - **Esperado:** Cards nas posições 2 e 3 (Z, D originalmente) recuam uma casa (decrement); D passa a ter position: 3; card na posição 0 (W) permanece intocado.
  - **Status:** Sucesso

- [✅] **TC-APP-14: Reordenar Para Trás na Mesma Coluna**
  - **Ação:** reorderApplication(D.id, { position: 1 }), com D originalmente em position: 3.
  - **Esperado:** Cards nas posições 1 e 2 (Y, Z) avançam uma casa (increment); D passa a ter position: 1.
  - **Status:** Sucesso
 
- [✅] **TC-APP-15: Reordenar para a Mesma Posição (Idempotência)**
  - **Ação:** reorderApplication(D.id, { position: current.position }), ou seja, sem mudança real.
  - **Esperado:** Nenhum updateMany desloca outros cards; retorno tem o mesmo shape (Application & { job, notes }) que os demais caminhos, sem chamar a transação de deslocamento.
  - **Status:** Sucesso
 
- [✅] **TC-APP-16: Posição Inválida**
  - **Ação:** reorderApplication(id, { position: -1 }).
  - **Esperado:** success: false, error.code: 400 — rejeitado pelo reorderApplicationSchema (min(0)) antes de chegar ao banco.
  - **Status:** Sucesso

- [✅] **TC-APP-17: Isolamento por Usuário na Reordenação**
  - **Ação:** Usuário 'A' chama reorderApplication em uma candidatura sua, enquanto o Usuário 'B' possui candidaturas no mesmo status (ex.: ambos têm cards em APPLIED).
  - **Esperado:** O updateMany de deslocamento filtra por userId — nenhuma candidatura do Usuário 'B' tem sua position alterada pela reordenação de 'A', mesmo compartilhando o mesmo status globalmente.
  - **Status:** Sucesso

- [✅] **TC-APP-18: Ordenação Reflete a Posição Persistida**
  - **Ação:** Após qualquer reordenação bem-sucedida, chamar getApplications().
  - **Esperado:** A lista retornada respeita orderBy: [{ status: "asc" }, { position: "asc" }] — a ordem visual do Kanban bate com a última reordenação salva.
  - **Status:** Sucesso

- [✅] **TC-APP-19: Múltiplas Candidaturas Entrando na Mesma Coluna via Caminhos Diferentes**
  - **Ação:** Criar uma candidatura via applyToJob, depois outra via createJob({ hasApplied: true, ... }), ambas caindo em status: "APPLIED".
  - **Esperado:** A segunda recebe position: 1 (não 0), sem colidir com a primeira.
  - **Status:** Sucesso

- [✅] **TC-APP-20: Buraco na Coluna de Origem Não Causa Colisão de Posição**
  - **Ação:** Criar 3 candidaturas em APPLIED (posições 0,1,2) → mover a do meio (posição 1) para INTERVIEWING → chamar applyToJob numa vaga nova, caindo em APPLIED.
  - **Esperado:** Nenhuma colisão de position em APPLIED; a nova candidatura entra exatamente na posição que ficou vaga (ou no fim compacto da sequência), sem duplicar position com nenhum card existente.
  - **Status:** Sucesso

- [✅] **TC-APP-21: Usuário não pode Reordenar Application de outro Usuário**
  - **Ação:** Usuário A tenta  reordenar uma aplicação do usuário B, `reorderApplication(id_da_application_de_B, ...)`
  - **Esperado:** Erro - `success: false`, `"Registro não encontrado."`
  - **Status:** Sucesso

---

## 6. Dashboard de Métricas (RF-08)

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

- [✅] **TC-DASH-06: Total de Propostas (RF-08)**
  - **Ação:** Popular com N candidaturas em status `PROPOSAL` e outras em status distintos.
  - **Esperado:** Métrica individual de "total de propostas" reflete exatamente a contagem de `PROPOSAL`, não apenas somada dentro de `closed`.
  - **Status:** Sucesso

- [✅] **TC-DASH-07: Total de Rejeições (RF-08)**
  - **Ação:** Popular com N candidaturas em status `REJECTED` e outras em status distintos.
  - **Esperado:** Métrica individual de "total de rejeição" reflete exatamente a contagem de `REJECTED`, separada de `HIRED` dentro de `closed`.
  - **Status:** Sucesso

---

## 📊 Resumo das Execuções

* **Total de Cenários:** 53
* **Passou (PASS):** 52
* **Falhas Encontradas Durante a Execução:** 1
* **Falhas Corrigidas:** 1
* **Pendente:** 0
* **Última Execução:** 14/09/2026
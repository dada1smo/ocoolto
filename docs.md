# ocoolto: arquitetura e plano em fases

## Contexto
App de amigo oculto, simples e gratuito. O único custo é o domínio. Fluxo: criar grupo → link de convite → login sem senha (magic link por e-mail) → sorteio → cada um vê só o seu amigo oculto.

Infra: **Cloudflare Workers + D1 + Turnstile + Resend**. Ela não pausa por inatividade e um único fornecedor cuida de hospedagem, banco, DNS e anti-bot.
Por que não as outras: o Supabase gratuito pausa após 7 dias com pouco uso, e o Firebase gratuito manda só 5 e-mails por dia e não tem funções no servidor.

---

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Monorepo | **npm workspaces** | já vem com o Node, sem ferramenta extra. Turborepo ou Nx não se pagam com 2 apps |
| Front | **React + Vite + TypeScript + React Router** | SPA estática, servida pelo próprio Worker |
| Back | **Hono + TypeScript** no Cloudflare Workers | ver abaixo |
| Validação | **zod** + `@hono/zod-validator` | validar a entrada de dados na fronteira de confiança (o que vem do navegador) |
| Banco | **D1** (SQLite), SQL direto, migrations do wrangler | 5 tabelas não precisam de ORM |
| Testes | **Vitest** (os dois apps) | mesmo runner do Vite |
| Estilo | um arquivo CSS, sem biblioteca de UI | são 3 telas |

**Por que Hono e não Nest:** o NestJS precisa de um servidor Node rodando sempre (Express ou Fastify) e não roda no Workers. Para usar Nest, a hospedagem gratuita viraria Render ou Koyeb, que dormem e levam cerca de 1 minuto para acordar, ou Cloud Run, que exige cartão. O Hono é TypeScript, foi feito para o Workers, tem rotas e middleware parecidos com os do Express e oferece **tipos de ponta a ponta de graça**: o front importa o tipo da API (`hc<AppType>`), sem pacote compartilhado e sem gerar código.

---

## Estrutura do monorepo
```
ocoolto/
├── package.json              # workspaces: ["apps/*"]; scripts dev/test/deploy
├── tsconfig.base.json
├── apps/
│   ├── api/                  # Worker (Hono)
│   │   ├── wrangler.jsonc    # D1, rate limiter, vars, assets → ../web/dist
│   │   ├── migrations/0001_init.sql
│   │   └── src/
│   │       ├── index.ts      # app Hono, monta as rotas, exporta `AppType`
│   │       ├── routes/       # groups.ts, auth.ts
│   │       ├── lib/          # draw.ts, session.ts, email.ts, limits.ts, turnstile.ts
│   │       └── *.test.ts
│   └── web/                  # React (Vite)
│       ├── vite.config.ts    # proxy /api → localhost:8787 em dev
│       └── src/
│           ├── main.tsx      # router
│           ├── api.ts        # const api = hc<AppType>('/')
│           └── pages/        # Home.tsx, Group.tsx, Auth.tsx
└── docs.md
```
Pacote compartilhado (`packages/shared`): só se aparecer código usado pelos dois lados além dos tipos.

## Arquitetura

```
navegador
  │  SPA React (arquivos estáticos)        mesma origem, sem CORS
  ▼
Cloudflare Worker (apps/api)
  ├── /api/*  → Hono ──> D1
  │                 ├──> Turnstile siteverify
  │                 └──> Resend (magic link)
  └── /*      → assets de apps/web/dist (fallback de SPA para index.html)
```
- **Um deploy só:** o Worker serve a API e os arquivos estáticos do React (`assets.directory: "../web/dist"`, `not_found_handling: "single-page-application"`, `run_worker_first: ["/api/*"]`).
- **Dev:** `wrangler dev` (API na porta 8787) + `vite` (porta 5173, com proxy de `/api`), os dois juntos com `npm run dev` na raiz.

### Back: modelo de dados
```sql
groups(id TEXT PK, name TEXT, owner_email TEXT, drawn_at INT, created_at INT)
participants(id TEXT PK, group_id TEXT, email TEXT, name TEXT, target_id TEXT,
             UNIQUE(group_id, email))
login_tokens(hash TEXT PK, email TEXT, name TEXT, group_id TEXT, expires_at INT, used_at INT)
sessions(hash TEXT PK, email TEXT, expires_at INT)
email_log(email TEXT, sent_at INT)  -- índices em sent_at e em (email, sent_at)
```
O organizador é identificado por `owner_email`. Tokens e IDs vêm de `crypto.randomUUID()`. No banco, os tokens ficam só como SHA-256.

### Back: API (JSON)
| Rota | Quem | O que faz |
|---|---|---|
| `POST /api/groups` | qualquer pessoa | `{groupName, name, email, turnstile}` → cria o grupo e envia magic link ao dono |
| `GET /api/groups/:id` | qualquer pessoa / participante | sem sessão: `{name, drawn, member: false}`. Participante: lista, `isOwner` e, depois do sorteio, `target`. Dono: também e-mails e todos os pares |
| `POST /api/groups/:id/join` | qualquer pessoa | `{name, email, turnstile}` → envia magic link. Serve também para recuperar o acesso |
| `POST /api/auth` | quem tem o link | `{token}` → valida, cria ou atualiza o participante, cria a sessão (cookie) → `{groupId}` |
| `POST /api/groups/:id/participants` | dono | `{name, email}` → adiciona a pessoa sem mandar e-mail (ela entra depois pelo link de convite com o mesmo e-mail). Só antes do sorteio |
| `POST /api/groups/:id/draw` | dono | com 3 ou mais pessoas e ainda não sorteado → grava `target_id` de todos num `db.batch` |
| `DELETE /api/groups/:id/participants/:pid` | dono | só antes do sorteio |

Notas:
- **Middleware `session`:** lê o cookie e coloca `email` no contexto do Hono. Cookie `HttpOnly; Secure; SameSite=Lax`, 60 dias. Com o `SameSite=Lax` e a API aceitando só JSON, um site de terceiros não consegue disparar ações em nome do usuário logado (CSRF).
- **Sorteio (`lib/draw.ts`):** embaralha com Fisher-Yates (usando `crypto.getRandomValues`) e cada pessoa tira a seguinte, com a última tirando a primeira. Ninguém tira a si mesmo. É uma função pura, testável.
- **E-mail (`lib/email.ts`):** com `ENV=dev`, o link sai no console. Em produção, `fetch` direto na API do Resend, sem SDK.

### Front: telas
| Rota | Tela |
|---|---|
| `/` | formulário "criar grupo" (com Turnstile) → "confira seu e-mail" |
| `/g/:id` | **sem sessão**: formulário para entrar → "confira seu e-mail". **Participante**: lista, link de convite para copiar e "você tirou: X" depois do sorteio. **Dono**: botões de sortear e de remover |
| `/auth?t=…` | botão "Entrar", que chama `POST /api/auth` e redireciona para `/g/:id` |

- **Por que o login tem um botão em vez de entrar direto:** os scanners de link do Outlook e do Gmail corporativo abrem o link antes da pessoa, e o token de uso único chegaria já gasto.
- **Estado:** sem lib de estado global. Cada tela faz `fetch` pelo cliente tipado do Hono, com `useEffect` ou loader do React Router.
- **Turnstile:** carrega o script `challenges.cloudflare.com/turnstile/v0/api.js` com um componente pequeno, sem dependência extra.

### Anti-abuso de e-mail (checado nesta ordem, antes de enviar)
1. Turnstile válido.
2. Limite por IP: binding `ratelimits` do Workers, 5 por minuto.
3. Limite por e-mail (`email_log`): 1 a cada 2 minutos e 5 por dia.
4. Teto global: 90 envios em 24 horas (o Resend gratuito permite 100 por dia).
5. Limite por grupo: até 50 participantes; grupo já sorteado não aceita entrada nova.
6. E-mail com texto fixo: o nome do grupo é escapado e cortado em 40 caracteres.
7. Token de login: uso único, expira em 15 minutos.

---

## Fases

Cada fase termina com algo funcionando e verificável. As fases 1 a 4 rodam 100% locais, sem conta em nenhum serviço.

### Fase 1: esqueleto do monorepo ✅
Como rodar:
- `npm install` (exige **npm 11**: `npm i -g npm@11`; o npm 10 trava com o erro `edgesOut`)
- `npm run dev`: Vite + Worker. Front em `localhost:5180`, API em `:8787`.
- `npm run preview`: build + só o Worker, igual a produção.
- `npm test` e `npm run typecheck`
- Depois de mudar o `wrangler.jsonc`, rode `npm run types -w @ocoolto/api`.

Escopo:
- Raiz com npm workspaces, `tsconfig.base.json` e o script `npm run dev` que sobe os dois apps.
- `apps/api`: Hono no Workers com `GET /api/health`.
- `apps/web`: Vite + React + TS + Router, com a home chamando `/api/health` pelo cliente tipado.
- Assets do web servidos pelo Worker (testar com `vite build` + `wrangler dev`).
- **Pronto quando:** `npm run dev` abre a página mostrando "api ok", e `npm run build && wrangler dev` sozinho também.

### Fase 2: backend completo (local) ✅
Como rodar:
- `npm run migrate -w @ocoolto/api` cria o banco local (`.wrangler/`).
- `apps/api/.dev.vars` define `ENV=dev`: o magic link sai no console do `wrangler dev`.
- Turnstile ainda não é verificado (campo opcional até a fase 4).

Escopo:
- `migrations/0001_init.sql` aplicada com `--local`.
- `draw.ts` e o teste dele.
- Sessão, magic link (no console) e todas as rotas da tabela acima, com zod.
- **Pronto quando:**
  - o Vitest passa o sorteio com N de 3 a 50: ninguém tira a si mesmo, é uma permutação e é um ciclo único;
  - o fluxo completo funciona via `curl`: criar, entrar, autenticar, sortear e cada um vê só o seu par.

### Fase 3: frontend
Como rodar:
- `npm run dev` e abra `localhost:5180`. O link de login sai no console do `[api]`.
- Node 22 ou 24 (o vitest recusa o Node 23 por causa do `engine-strict`).
- Camadas em `apps/web/src`: `app/` (rotas e páginas), `global/` (cliente da API, auth, `useAction`), `domain/group/` (formulários, lista, painel do dono, `useGroup`), `ui/` (`Page`, `Section`, `CopyField`).
- Modo admin = painel do dono em `/g/:id`: adicionar pessoa, remover, sortear e, depois, o botão "Mostrar quem tirou quem" (desligado por padrão, porque o dono também participa).

- As 3 telas, consumindo a API.
- **Pronto quando:** 3 abas anônimas fazem o fluxo inteiro em `npm run dev`, com o link copiado do console.
- Separar o app em camadas de app (pages e routes), global (conexao com api, auth, clients), domain (componentes e hooks dos dominios de grupo) e ui (componentes sem regra de negócio, reutilizáveis)
- Para UI, utilizar https://primer.style/product/getting-started/react/ e tailwind
- Importante ter um modo "admin" em que possa criar grupo, adicionar pessoas, fazer o sorteio e ver o resultado como admin 

### Fase 4: anti-abuso
- Turnstile (com as chaves de teste da Cloudflare em dev) e os limites 1 a 7.
- **Pronto quando:** os testes cobrem estes casos:
  - o 2º pedido para o mesmo e-mail em menos de 2 minutos é bloqueado;
  - token reusado ou expirado é rejeitado;
  - com o teto global baixado temporariamente para 2, o 3º envio é bloqueado.

### Fase 5: contas, domínio e produção (passos manuais seus + deploy)
1. **Domínio:**
   - `.com.br` no registro.br (cerca de R$40/ano), apontando os nameservers para a Cloudflare;
   - ou `.com` no Cloudflare Registrar (cerca de US$10/ano).
   - Confira antes se `ocoolto` está livre.
2. **Cloudflare (grátis):** Add a site → plano Free → troque os nameservers.
3. **Wrangler:** `npx wrangler login` e depois `npx wrangler d1 create ocoolto`. Cole o `database_id` em `apps/api/wrangler.jsonc`.
4. **Turnstile:** Dashboard → Turnstile → Add widget com o hostname do seu domínio. Vai sair uma site key, que fica pública numa env do Vite, e uma secret key, que vai para `wrangler secret put TURNSTILE_SECRET`.
5. **Resend** (grátis: 3.000/mês, 100/dia):
   - adicione o domínio e copie os registros SPF, DKIM e MX para o DNS da Cloudflare, **com o proxy desligado (nuvem cinza)**;
   - adicione também um TXT `_dmarc` com o valor `v=DMARC1; p=none;`;
   - quando o domínio estiver "Verified", crie uma API key com "Sending access" e rode `wrangler secret put RESEND_API_KEY`.
6. **Deploy:** `wrangler d1 migrations apply ocoolto --remote`, depois `npm run deploy`. No `wrangler.jsonc`, configure o domínio próprio em `routes` com `custom_domain: true`.
- **Pronto quando:** 1 grupo real com 3 e-mails seus (Gmail e Outlook) funciona, o e-mail chega fora da caixa de spam e o link abre pelo Outlook.

### Fase 6 (opcional): deploy automático
- Repositório no GitHub e um GitHub Action que roda os testes e faz `wrangler deploy` a cada push na `main`.
- **Token de API da Cloudflare:** em My Profile → API Tokens, use o modelo "Edit Cloudflare Workers" e adicione a permissão "D1: Edit". Guarde como secrets `CLOUDFLARE_API_TOKEN` e `CLOUDFLARE_ACCOUNT_ID` no GitHub.

---

## Fora de escopo (dá para adicionar depois sem mudar o schema)
E-mail avisando que o sorteio saiu (gastaria cota), restrições do tipo "casal não tira casal", lista de desejos, sortear de novo, painel "meus grupos".

## Limitações conhecidas
- Quem tem o link do grupo consegue entrar. O dono vê a lista e remove.
- Com o teto diário, cabem cerca de 5 grupos de 20 pessoas por dia. Se faltar, dá para trocar pelo Brevo (cerca de 300 por dia).
- Quem tem acesso ao banco (você) consegue ver todos os pares.

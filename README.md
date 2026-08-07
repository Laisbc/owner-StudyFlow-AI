# StudyFlow AI - Plataforma de Estudos Inteligente

StudyFlow AI é uma plataforma de estudos para ENEM, vestibulares e provas escolares, com banco de questões, simulados, acompanhamento de desempenho, revisão espaçada e recursos de IA.

## Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- NextAuth v5 (Credentials)
- PostgreSQL + Prisma
- Zod
- Vitest
- OpenAI-compatible API para recursos de IA

## Funcionalidades atuais

- Cadastro e login com email e senha
- Perfil e metas de estudo
- Banco de questões com filtros por tópico e dificuldade
- Seleção aleatória de questões
- Registro de respostas e progresso por tópico
- Estatísticas e identificação de tópicos fracos
- Revisão espaçada básica baseada no desempenho
- Criação e histórico de simulados
- Endpoint seguro para envio de simulados
- Serviço de IA para explicações, resumos, planos, exercícios e recomendações
- Endpoint de health check em `/api/health`
- Seed de desenvolvimento com matérias e uma questão de exemplo
- CI com validação Prisma, TypeScript, testes e build

## Instalação

Requisitos: Node.js 20+, npm e PostgreSQL 14+.

```bash
git clone https://github.com/Laisbc/owner-StudyFlow-AI.git
cd owner-StudyFlow-AI
npm ci
cp .env.example .env.local
npm run db:generate
npm run db:validate
npm run db:push
npm run db:seed
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

Consulte `.env.example`. As principais são:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/studyflow"
NEXTAUTH_SECRET="gere-um-secret-forte"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-4o-mini"
OPENAI_BASE_URL="https://api.openai.com/v1"
```

A chave da OpenAI é opcional para executar o restante da aplicação, mas é necessária para as funcionalidades de IA.

## Scripts

```bash
npm run dev
npm run build
npm start
npm run type-check
npm run lint
npm test -- --run
npm run db:generate
npm run db:validate
npm run db:push
npm run db:seed
npm run db:studio
```

## Estrutura

```text
app/                 páginas e API Routes
components/          componentes React reutilizáveis
lib/                 Prisma, autenticação e utilitários
services/            regras de negócio e IA
schemas/             validações Zod
types/               tipos TypeScript
prisma/              schema e seed
tests/               testes
.github/workflows/   CI
```

## API principal

- `POST /api/auth/signup`
- `POST/GET /api/auth/[...nextauth]`
- `GET/PUT /api/profile`
- `GET /api/questions`
- `POST /api/questions/answer`
- `POST/GET /api/exams`
- `GET /api/exams/[id]`
- `POST /api/exams/submit`
- `POST /api/ai`
- `GET /api/stats`
- `GET /api/health`

Rotas que manipulam dados pessoais exigem sessão autenticada.

## IA

`services/ai.service.ts` usa uma interface de provedor e uma implementação compatível com a API de chat da OpenAI. A chave nunca deve ser colocada no código ou commitada no Git.

O serviço gera explicações, resumos, planos de estudo, exercícios e recomendações. Os exercícios gerados são solicitados como conteúdo original, evitando copiar questões protegidas.

## Banco de dados

O Prisma possui modelos para usuários, perfis, matérias, tópicos, questões, alternativas, respostas, progresso, revisões, planos de estudo e simulados.

Para desenvolvimento, `npm run db:seed` cria matérias básicas e uma questão de demonstração. Dados reais de provas devem ser inseridos somente quando houver direito/licença para utilizá-los.

## Qualidade

O workflow `.github/workflows/ci.yml` executa Prisma validation/generation, type-check, testes e build em cada push ou pull request para `main`.

Antes de considerar uma funcionalidade pronta, ela deve passar por validação de código e, quando aplicável, por teste de integração com PostgreSQL.

## Status

O projeto está em fase de MVP. A base principal está implementada, mas integrações externas e validações de produção ainda dependem da configuração do ambiente.

## Licença

MIT.

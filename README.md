# StudyFlow AI - Plataforma de Estudos Inteligente

## 📚 Visão Geral

StudyFlow AI é uma plataforma inteligente de estudos desenvolvida para preparar alunos para ENEM, vestibulares e provas escolares. Utiliza inteligência artificial para personalizar o aprendizado e otimizar o desempenho dos usuários.

## ✨ Funcionalidades

- 📝 **Banco de Questões**: Amplo acervo de questões de diferentes disciplinas e dificuldades
- 🤖 **IA Inteligente**: Recomendações personalizadas baseadas no desempenho
- 📊 **Análise de Progresso**: Acompanhamento detalhado do desempenho e evolução
- 🎯 **Simulados**: Crie e realize simulados personalizados
- 📋 **Planos de Estudo**: Planos personalizados baseados em metas
- 🔄 **Sistema de Revisão**: Algoritmo de revisão espaçada para melhor retenção
- 🏆 **Estatísticas**: Visualização de métricas e taxa de acerto

## 🛠 Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (React)
- **Estilo**: Tailwind CSS
- **Componentes**: Radix UI
- **Autenticação**: NextAuth.js v5
- **Gerenciamento de Estado**: Zustand

### Backend
- **Runtime**: Node.js
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **API**: REST (Next.js API Routes)
- **Validação**: Zod

### DevOps & Ferramentas
- **Linguagem**: TypeScript
- **Linting**: ESLint
- **Formatação**: Prettier
- **Testes**: Vitest

## 📦 Requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 14+

## 🚀 Instalação

### 1. Clonar o Repositório
```bash
git clone https://github.com/Laisbc/owner-StudyFlow-AI.git
cd owner-StudyFlow-AI
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/studyflow"

# NextAuth
NEXTAUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# API Keys (Opcional)
GOOGLE_CLIENT_ID="seu-google-client-id"
GOOGLE_CLIENT_SECRET="seu-google-client-secret"
```

### 4. Configurar Banco de Dados

```bash
# Executar migrações
npm run db:push

# (Opcional) Abrir Prisma Studio
npm run db:studio
```

### 5. Executar o Servidor de Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 📋 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor de desenvolvimento

# Build & Produção
npm run build            # Build para produção
npm start                # Inicia servidor de produção

# Banco de Dados
npm run db:push          # Sincroniza schema com banco
npm run db:studio        # Abre Prisma Studio
npm run db:generate      # Gera cliente Prisma

# Qualidade de Código
npm run lint             # Executa ESLint
npm run format           # Formata código com Prettier
npm run type-check       # Verifica tipos TypeScript

# Testes
npm test                 # Executa testes
npm run test:ui          # Executa testes com UI
npm run test:coverage    # Gera relatório de cobertura
```

## 📁 Estrutura do Projeto

```
owner-StudyFlow-AI/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticação
│   │   ├── questions/            # Questões
│   │   ├── profile/              # Perfil
│   │   ├── exams/                # Simulados
│   │   └── stats/                # Estatísticas
│   ├── dashboard/                # Dashboard
│   ├── auth/                     # Páginas de autenticação
│   ├── layout.tsx                # Layout raiz
│   ├── page.tsx                  # Página inicial
│   └── globals.css               # Estilos globais
├── components/                   # Componentes React
│   └── ui/                       # Componentes UI reutilizáveis
├── lib/                          # Funções utilitárias
│   ├── auth.ts                   # Funções de autenticação
│   ├── db.ts                     # Cliente Prisma
│   └── utils.ts                  # Funções auxiliares
├── services/                     # Serviços de negócio
│   ├── user.service.ts           # Serviço de usuário
│   ├── question.service.ts       # Serviço de questões
│   ├── answer.service.ts         # Serviço de respostas
│   ├── exam.service.ts           # Serviço de simulados
│   └── ai.service.ts             # Serviço de IA
├── schemas/                      # Schemas Zod
│   ├── auth.ts                   # Schemas de autenticação
│   ├── profile.ts                # Schemas de perfil
│   ├── question.ts               # Schemas de questões
│   └── exam.ts                   # Schemas de exames
├── types/                        # Tipos TypeScript
│   └── index.ts                  # Tipos principais
├── prisma/
│   └── schema.prisma             # Schema do banco de dados
└── public/                       # Arquivos estáticos
```

## 🔐 Autenticação

O projeto utiliza NextAuth.js v5 com autenticação baseada em credenciais (email/senha).

### Fluxo de Autenticação

1. **Signup**: Novo usuário cria conta
2. **Login**: Usuário faz login com email e senha
3. **Session**: Sessão mantida via JWT
4. **Logout**: Usuário faz logout

## 🗄️ Banco de Dados

Utiliza PostgreSQL com Prisma ORM. Schema principal:

- **User**: Dados do usuário
- **Profile**: Perfil e metas de estudo
- **Subject**: Disciplinas
- **Topic**: Tópicos dentro de disciplinas
- **Question**: Questões de estudo
- **Alternative**: Alternativas de questões
- **Answer**: Respostas do usuário
- **Progress**: Progresso por tópico
- **Exam**: Simulados
- **StudyPlan**: Planos de estudo

## 🤖 Integração com IA

O serviço de IA (`services/ai.service.ts`) fornece uma abstração para:

- Gerar explicações de questões
- Resumir conteúdos
- Criar planos de estudo personalizados
- Gerar exercícios
- Fornecer recomendações

Atualmente usa mock, mas pode ser facilmente integrado com:
- Google Gemini
- OpenAI GPT
- Outras APIs de IA

## 📊 API Endpoints

### Autenticação
- `POST /api/auth/signup` - Criar nova conta
- `POST /api/auth/[...nextauth]` - Endpoints NextAuth

### Perfil
- `GET /api/profile` - Obter perfil do usuário
- `PUT /api/profile` - Atualizar perfil

### Questões
- `GET /api/questions` - Listar questões
- `GET /api/questions/[id]` - Obter questão específica
- `POST /api/questions/answer` - Submeter resposta

### Simulados
- `POST /api/exams` - Criar simulado
- `GET /api/exams` - Listar simulados do usuário
- `GET /api/exams/[id]` - Obter simulado específico

### Estatísticas
- `GET /api/stats` - Obter estatísticas do usuário

## 🧪 Testes

O projeto utiliza Vitest para testes unitários. Exemplos:

```bash
# Executar todos os testes
npm test

# Modo watch
npm test -- --watch

# Com cobertura
npm run test:coverage
```

## 📝 Padrões de Código

### TypeScript
- Tipos explícitos em funções
- Interfaces para estruturas de dados
- Genéricos quando apropriado

### Componentes React
- Componentes funcionais com hooks
- Props bem tipados
- Separação de concerns

### Services
- Lógica de negócio centralizada
- Métodos reutilizáveis
- Tratamento de erros consistente

## 🚧 Roadmap

- [ ] Autenticação social (Google, GitHub)
- [ ] Integração com IA avançada (GPT-4, Gemini)
- [ ] App mobile (React Native)
- [ ] Sistema de comentários em questões
- [ ] Gamificação (badges, rankings)
- [ ] Integração com plataformas educacionais
- [ ] Análise preditiva de desempenho
- [ ] Sistema de notificações

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue ou entre em contato com os mantenedores.

## 🙏 Agradecimentos

- Comunidade Next.js
- Contribuidores do Prisma
- NextAuth.js team
- Tailwind CSS

---

**Desenvolvido com ❤️ para educação**

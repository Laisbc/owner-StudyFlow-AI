# StudyFlow AI - Plataforma de Estudos Inteligente

## O que é este projeto?

StudyFlow AI é uma plataforma moderna de estudos online que utiliza inteligência artificial para personalizar a experiência de aprendizado de alunos que se preparam para ENEM, vestibulares e provas escolares.

## 🎯 Funcionalidades Principais

### 1. **Autenticação Segura**
- Registro e login com email/senha
- Senha criptografada com bcryptjs
- Sessões seguras com NextAuth.js

### 2. **Banco de Questões Robusto**
- Organizado por disciplinas e tópicos
- Classificação por nível de dificuldade (Fácil, Médio, Difícil)
- Alternativas com gabarito
- Explicações detalhadas

### 3. **Acompanhamento de Progresso**
- Taxa de acerto por tópico
- Análise de desempenho em tempo real
- Sistema de revisão espaçada
- Histórico de respostas

### 4. **Simulados Personalizados**
- Criar simulados com seleção de disciplinas
- Configurar duração e percentual mínimo de aprovação
- Análise detalhada de resultados

### 5. **Planos de Estudo**
- Criar metas de estudo
- Acompanhar progresso
- Recomendações personalizadas

### 6. **IA Inteligente**
- Recomendações baseadas em desempenho
- Geração de explicações
- Criação de exercícios personalizados
- Planos de estudo adaptativos

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────┐
│        Frontend (Next.js + React)       │
│   - App Router (Client & Server)        │
│   - Tailwind CSS                        │
│   - NextAuth.js para autenticação       │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      API REST (Next.js Routes)          │
│   - /api/auth                           │
│   - /api/questions                      │
│   - /api/exams                          │
│   - /api/profile                        │
│   - /api/stats                          │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│    Services & Business Logic            │
│   - UserService                         │
│   - QuestionService                     │
│   - ExamService                         │
│   - AnswerService                       │
│   - AIService                           │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│      Database (PostgreSQL)              │
│   - Prisma ORM                          │
│   - Schema com 13 modelos               │
└─────────────────────────────────────────┘
```

## 📊 Modelos de Dados

### User (Usuário)
- Armazena informações de autenticação
- Relacionado com perfil, respostas e exames

### Profile (Perfil)
- Dados pessoais e metas de estudo
- Nível de conhecimento
- Tempo disponível para estudo

### Subject & Topic (Disciplina e Tópico)
- Organização hierárquica do conteúdo
- Cada tópico tem múltiplas questões

### Question & Alternative (Questão e Alternativa)
- Banco centralizado de questões
- Rastreamento de dificuldade e fonte
- Explicações incluídas

### Answer (Resposta)
- Histórico completo de respostas
- Rastreamento de tempo gasto
- Validação de acertos/erros

### Progress (Progresso)
- Estatísticas por tópico
- Taxa de acerto calculada
- Último acesso rastreado

### Exam & ExamResult (Simulado e Resultado)
- Simulados personalizáveis
- Resultados com análise detalhada
- Tempo total de resolução

## 🔄 Fluxo de Dados

### 1. Criação de Conta
```
Usuário → SignUp → API → UserService → Database
                      ↓
                   Criar Profile
```

### 2. Respondendo Questão
```
Usuário → Seleciona resposta → API → AnswerService
                                        ↓
                              Validar resposta
                                ↓
                              Atualizar Progress
                                ↓
                              Database
```

### 3. Criando Simulado
```
Usuário → Define filtros → API → ExamService
                                   ↓
                            Buscar questões
                                ↓
                            Associar ao Exam
                                ↓
                            Database
```

## 💾 Banco de Dados

### Modelos Principais

**User**
```sql
- id: String (PK)
- email: String (UNIQUE)
- password: String (hashed)
- name: String
- image: String
- emailVerified: DateTime
- createdAt: DateTime
- updatedAt: DateTime
```

**Profile**
```sql
- id: String (PK)
- userId: String (FK, UNIQUE)
- goal: String
- mainExam: String
- examDate: DateTime
- timePerDay: Int
- daysPerWeek: Int
- knowledgeLevel: String
- totalStudyTime: Int
- createdAt: DateTime
- updatedAt: DateTime
```

**Question**
```sql
- id: String (PK)
- enunciation: String
- topicId: String (FK)
- difficulty: String ('easy'|'medium'|'hard')
- source: String
- year: Int
- explanation: String
- createdAt: DateTime
- updatedAt: DateTime
```

**Answer**
```sql
- id: String (PK)
- userId: String (FK)
- questionId: String (FK)
- selectedAnswer: String
- isCorrect: Boolean
- timeSpent: Int
- createdAt: DateTime
```

**Progress**
```sql
- id: String (PK)
- userId: String (FK)
- topicId: String (FK)
- totalQuestions: Int
- correctAnswers: Int
- wrongAnswers: Int
- accuracy: Float
- lastAnsweredAt: DateTime
- createdAt: DateTime
- updatedAt: DateTime
- UNIQUE(userId, topicId)
```

**Exam**
```sql
- id: String (PK)
- userId: String (FK)
- title: String
- description: String
- totalQuestions: Int
- duration: Int
- passPercentage: Int
- createdAt: DateTime
- updatedAt: DateTime
- startedAt: DateTime
- finishedAt: DateTime
```

## 🔑 Conceitos Importantes

### 1. Autenticação com NextAuth.js
- Provider: Credentials (Email/Senha)
- Armazenamento: Banco de dados
- Segurança: Tokens JWT e sessões seguras

### 2. Validação com Zod
- Schemas para entrada de dados
- Type-safe com TypeScript
- Mensagens de erro em português

### 3. ORM com Prisma
- Type-safe queries
- Migrações automáticas
- Studio para gerenciar dados

### 4. UI com Tailwind + Componentes Customizados
- Componentes reutilizáveis (Button, Input, Card, Alert)
- Tema consistente
- Design responsivo

### 5. Serviços de Negócio
- Lógica centralizada
- Fácil de testar
- Reutilizável entre endpoints

## 🚀 Como Começar

### Desenvolvimento Local

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Laisbc/owner-StudyFlow-AI.git
   cd owner-StudyFlow-AI
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Crie um banco PostgreSQL
   - Configure DATABASE_URL no .env.local
   ```bash
   npm run db:push
   ```

4. **Inicie o servidor**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - Abra http://localhost:3000
   - Crie uma conta de teste
   - Explore as funcionalidades

## 📚 Stack Resumido

| Camada | Tecnologia | Uso |
|--------|-----------|-----|
| Frontend | Next.js 14 | Framework React moderno |
| Estilo | Tailwind CSS | Utilitários CSS |
| UI | Radix UI + CVA | Componentes sem estilos |
| Auth | NextAuth.js v5 | Gerenciamento de sessão |
| BD | PostgreSQL | Database relacional |
| ORM | Prisma | Type-safe database queries |
| Validação | Zod | Schema validation |
| Testes | Vitest | Testing framework |
| Linguagem | TypeScript | Type safety |

## 🎓 Aprendizados

Este projeto demonstra:
- Arquitetura full-stack moderna
- Boas práticas de segurança
- Separação de responsabilidades
- Type safety com TypeScript
- Testes automatizados
- Design system consistente

## 📞 Suporte

Para dúvidas ou problemas:
1. Abra uma issue
2. Consulte a documentação
3. Entre em contato com os mantenedores

---

**Desenvolvido para transformar a forma como as pessoas estudam! 🎓**

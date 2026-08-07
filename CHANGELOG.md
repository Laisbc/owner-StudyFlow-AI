# StudyFlow AI - Changelog

## [0.1.0] - 2026-08-07

### ✨ Added
- Projeto inicial com estrutura completa
- Autenticação com NextAuth.js (Credentials Provider)
- Banco de dados PostgreSQL com Prisma ORM
- API REST com endpoints para:
  - Autenticação (signup, login)
  - Perfil de usuário
  - Questões e respostas
  - Simulados
  - Estatísticas
- Dashboard com páginas:
  - Home/Dashboard
  - Questões
  - Simulados
  - Planos de Estudo
  - Progresso
  - Perfil
- Componentes UI reutilizáveis (Button, Input, Card, Alert)
- Schemas de validação com Zod
- Serviços de negócio:
  - UserService
  - QuestionService
  - AnswerService
  - ExamService
  - AIService
- Testes unitários com Vitest
- Documentação completa (README, ARCHITECTURE, CONTRIBUTING)
- TypeScript strict mode
- Tailwind CSS com tema customizado

### 📚 Models
- User (autenticação e dados pessoais)
- Profile (metas e configurações)
- Subject (disciplinas)
- Topic (tópicos)
- Question (questões)
- Alternative (alternativas de questões)
- Answer (respostas dos usuários)
- Progress (progresso por tópico)
- Review (sistema de revisão espaçada)
- StudyPlan (planos de estudo)
- Exam (simulados)
- ExamResult (resultados de simulados)

### 🎯 Features Principais
- Registro e login de usuários
- Banco centralizado de questões
- Sistema de respostas com validação
- Cálculo automático de progresso
- Criação de simulados personalizados
- Acompanhamento de estatísticas
- Interface responsiva com Tailwind CSS

### 🚀 Próximas Features
- [ ] Integração com Google Gemini/OpenAI
- [ ] Login social (Google, GitHub)
- [ ] Sistema de comentários em questões
- [ ] Gamificação (badges, rankings)
- [ ] App mobile
- [ ] Notificações push
- [ ] Análise preditiva de desempenho

### 📝 Notas
- Projeto em desenvolvimento inicial
- Banco de dados pré-configurado para PostgreSQL
- NextAuth.js configurado para Credentials Provider
- Pronto para adicionar mais provedores de autenticação


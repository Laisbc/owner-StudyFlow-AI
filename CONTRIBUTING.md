# Contribution Guide

## Como Contribuir

Obrigado por se interessar em contribuir para o StudyFlow AI! Aqui estão as diretrizes:

## 📋 Processo de Contribuição

1. **Fork o projeto**
   ```bash
   git clone https://github.com/Laisbc/owner-StudyFlow-AI.git
   cd owner-StudyFlow-AI
   git remote add upstream https://github.com/Laisbc/owner-StudyFlow-AI.git
   ```

2. **Crie uma branch para sua feature**
   ```bash
   git checkout -b feature/nome-da-feature
   ```

3. **Faça suas alterações**
   - Mantenha a consistência de código
   - Adicione testes para novas funcionalidades
   - Atualize a documentação se necessário

4. **Commit suas mudanças**
   ```bash
   git commit -m "feat: descrição clara da mudança"
   ```

5. **Push para sua fork**
   ```bash
   git push origin feature/nome-da-feature
   ```

6. **Abra um Pull Request**
   - Descreva claramente as mudanças
   - Referencie issues relacionadas
   - Certifique-se que não há conflitos

## ✅ Checklist Antes de Submeter

- [ ] Código segue o style guide do projeto
- [ ] Adicionei testes para novas funcionalidades
- [ ] Documentação foi atualizada
- [ ] Não há warnings do linter
- [ ] Build passa localmente
- [ ] Testes passam

## 🎨 Padrões de Código

### TypeScript
```typescript
// ✅ Bom
interface User {
  id: string;
  email: string;
  name?: string;
}

function getUserById(id: string): Promise<User | null> {
  // implementation
}

// ❌ Evitar
function getUserById(id) {
  // implementation
}
```

### React Components
```typescript
// ✅ Bom
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={cn(variants[variant])}>{children}</button>;
}

// ❌ Evitar
export function Button(props: any) {
  // implementation
}
```

### Commit Messages
- `feat:` para novas funcionalidades
- `fix:` para correções de bugs
- `docs:` para documentação
- `style:` para mudanças de estilo
- `refactor:` para refatoração
- `test:` para testes
- `chore:` para tarefas de manutenção

Exemplo: `feat: adicionar validação de email no signup`

## 🐛 Reportando Bugs

1. Verifique se o bug já foi reportado
2. Crie uma issue com:
   - Descrição clara do problema
   - Passos para reproduzir
   - Comportamento esperado vs. atual
   - Screenshots/logs se aplicável

## 💡 Sugestões de Feature

1. Descreva o caso de uso
2. Explique o benefício
3. Exemplos de implementação se possível

## 📚 Recursos

- [Documentação do Projeto](./README.md)
- [Arquitetura](./ARCHITECTURE.md)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

Obrigado por contribuir! 🎉

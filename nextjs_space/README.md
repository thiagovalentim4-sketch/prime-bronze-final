# Prime Bronze - Estúdio de Bronzeamento Artificial

Sistema de agendamento online para estúdio de bronzeamento artificial.

## 🎯 Funcionalidades

### Área Pública
- Homepage com hero, serviços e galeria
- Página de serviços com preços
- Sistema de agendamento em 4 etapas
- Integração com WhatsApp

### Área Admin
- Login seguro
- Dashboard com estatísticas
- Gerenciamento de agendamentos
- CRUD de serviços
- Configuração de horários e bloqueios

## 🛠️ Stack Técnico

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Database**: PostgreSQL com Prisma ORM
- **Auth**: NextAuth.js v4
- **API**: REST com React Query
- **UI**: Componentes personalizados com Tailwind

## 📋 Configuração

1. Clone o repositório
2. Copie `.env.example` para `.env.local`
3. Configure as variáveis de ambiente
4. Execute `npm install`
5. Execute `npx prisma migrate dev`
6. Execute `npx prisma db seed` para popular dados iniciais
7. Execute `npm run dev`

## 🎨 Identidade Visual

- **Cores**: Dourado (#D4AF37, #B8860B), Preto (#0a0a0a), Branco
- **Tema**: Escuro com acentos dourados
- **Slogan**: "Seu Brilho, Nossa Paixão"

## 📁 Estrutura do Projeto

```
nextjs_space/
├── app/
│   ├── (public)/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
├── components/
├── lib/
├── prisma/
└── public/
```

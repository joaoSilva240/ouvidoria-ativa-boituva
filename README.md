# 🏛️ Ouvidoria Ativa - Boituva

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)

Uma aplicação web moderna e interativa desenvolvida para a **Prefeitura Municipal de Boituva**, visando simplificar e agilizar o registro de manifestações (elogios, reclamações, denúncias) pelos cidadãos.

O projeto foca em uma experiência de usuário (UX) premium, com design fluido, animações suaves e um fluxo guiado (Wizard) que torna o processo acessível para todos.

---

## ✨ Funcionalidades Principais

- **Fluxo Guiado (Wizard)**: Registro passo-a-passo (Identificação -> Categoria -> Relato -> Finalização).
- **Autenticação Anônima**: Permite que cidadãos registrem ocorrências sem necessidade de criar conta, mantendo a segurança dos dados.
- **Integração com Supabase**: Persistência de dados segura e escalável utilizando PostgreSQL.
- **Design Responsivo**: Interface otimizada para desktops, tablets e celulares.
- **Animações Interativas**: Uso de *Framer Motion* para feedback visual rico.

---

## 🛠️ Tecnologias Utilizadas

- **[Next.js 16](https://nextjs.org/)** - Framework React com App Router e Server Actions.
- **[TypeScript](https://www.typescriptlang.org/)** - Superset JavaScript para tipagem estática e segurança.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Framework de utilitários CSS para estilização rápida.
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (Auth, Database, Storage).
- **[Framer Motion](https://www.framer.com/motion/)** - Biblioteca de animações para React.
- **[Lucide Icons](https://lucide.dev/)** - Ícones vetoriais leves e consistentes.

---

## 🚀 Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### 1. Clonar o Repositório

```bash
git clone https://github.com/joaoSilva240/ouvidoria-ativa-boituva.git
cd ouvidoria-ativa-boituva
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto e adicione as chaves do seu projeto Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_publica_jwt
```

> **Nota:** Certifique-se de habilitar o **"Anonymous Sign-ins"** no painel do Supabase (Authentication > Providers).

### 4. Rodar o Projeto

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver a aplicação.

---

## 📄 Licença

Este projeto é desenvolvido para fins educacionais e de demonstração.

---
Desenvolvido com 💙 por [João Silva](https://github.com/joaoSilva240)

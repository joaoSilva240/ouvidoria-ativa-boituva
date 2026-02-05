# 🏛️ Active Ombudsman - Boituva

![Next.js](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer-Black?style=for-the-badge&logo=framer&logoColor=blue)

![Application Screenshot](docs/screenshots/tela-inicial.png)

A modern and interactive web application developed for the **Municipal Government of Boituva**, designed to simplify and speed up the registration of public manifestations (compliments, complaints, reports) by citizens.

The project focuses on a **premium user experience (UX)**, featuring fluid design, smooth animations, and a guided flow (Wizard) that makes the process accessible to everyone.

> **Latest Update (Feb 2026):** Full authentication system with JWT via Supabase Auth, role-based access control (ADMIN/COMUM), and a transparency dashboard for administrators.

---

## 🏗️ Architecture

The application follows a modern four-tier architecture, leveraging Server Actions for secure backend communication, Redis for high-performance caching, and Supabase for robust data persistence.

```mermaid
graph TB
    subgraph "Client Layer (Browser)"
        UI[Next.js UI Components]
        Router[App Router]
        Motion[Framer Motion]
    end
    
    subgraph "Server Layer (Next.js)"
        SA[Server Actions]
        Proxy[proxy.ts Middleware]
        Cache[Redis Client]
    end
    
    subgraph "Cache Layer (Redis)"
        RC[(Redis Cloud)]
    end
    
    subgraph "Data Layer (Supabase)"
        Auth[Supabase Auth - JWT]
        DB[(PostgreSQL + RLS)]
        Profiles[(profiles table)]
    end
    
    User[👤 Citizen] --> UI
    UI --> Router
    Router --> SA
    SA --> Cache
    Cache -.->|Cache Hit| SA
    Cache -->|Cache Miss| DB
    SA --> DB
    Auth -.-> SA
    
    style UI fill:#000,stroke:#fff,color:#fff
    style Cache fill:#DC382D,stroke:#fff,color:#fff
    style DB fill:#3ECF8E,stroke:#000,color:#fff
```


### Key Integrations
- **Frontend**: Next.js 16 (App Router, Turbopack) with client-side interactivity via Framer Motion.
- **Backend Logic**: Server Actions handle form submissions, validation, and authentication.
- **Database**: Supabase PostgreSQL with Row Level Security (RLS).
- **Caching**: Redis layer for high-performance data retrieval and rate limiting.
- **Auth**: JWT-based authentication with role-based access control (ADMIN/COMUM).
- **Middleware**: `proxy.ts` for route protection and session management.

### 🔒 Security & Privacy (LGPD Compliance)
- **Row Level Security (RLS)**: Strictly enforced policies ensure users can only access their own data.
    - *Exception*: Administrators have elevated privileges to view all manifestations for management purposes.
- **Anonymous Reporting**: The system allows anonymous inserts (compliant with Ombudsman regulations). While unauthenticated users can write to the database, they have **zero read access** to other records.
- **Data Isolation**: Profile data is isolated; users cannot list or view other users' profiles.


---

## ✨ Key Features

- **Guided Flow (Wizard)**: Step-by-step registration (Identification → Category → Report → Finalization).
- **User Authentication**: Full login/register system with email/password via Supabase Auth (JWT).
- **Role-Based Access**: ADMIN users access the Transparency Dashboard; COMUM users see only their own manifestations.
- **Anonymous Option**: Citizens can still register occurrences anonymously if preferred.
- **Transparency Dashboard**: Real-time statistics, charts (by type, department, timeline), and complete manifestation listing for admins.
- **Satisfaction Survey**: Post-response feedback collection from citizens.
- **Supabase Integration**: Secure and scalable data persistence using PostgreSQL with RLS.
- **Responsive Design**: Interface optimized for desktops, tablets, and mobile devices.
- **Interactive Animations**: Rich visual feedback using *Framer Motion*.

---

## 🛠️ Technologies Used

- **[Next.js 16](https://nextjs.org/)** - React Framework with App Router and Server Actions.
- **[TypeScript](https://www.typescriptlang.org/)** - JavaScript superset for static typing and security.
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework for rapid styling.
- **[Supabase](https://supabase.com/)** - Backend-as-a-Service (Auth, Database, Storage).
- **[Redis](https://redis.io/)** - In-memory data store for high-performance caching.
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library for React.
- **[Lucide Icons](https://lucide.dev/)** - Lightweight and consistent vector icons.

---

## 🚀 Installation and Setup

Follow the steps below to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/joaoSilva240/ouvidoria-ativa-boituva.git
cd ouvidoria-ativa-boituva
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root and add your Supabase project keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_public_anon_jwt_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Required for admin operations

# Redis (Optional - enables caching)
REDIS_URL=redis://default:password@host:port
```

> **Notes:**
> - Enable **"Anonymous Sign-ins"** in Supabase Dashboard (Authentication → Providers) if using anonymous flow.
> - The `SUPABASE_SERVICE_ROLE_KEY` is required for Server Actions that bypass RLS (admin operations). **Never expose this key client-side.**

### 4. Run the Project

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📄 License

This project is developed for educational and demonstration purposes.

---

Developed with 💙 by [João Silva](https://github.com/joaoSilva240)

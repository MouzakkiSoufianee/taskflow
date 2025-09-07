# Quick Setup Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Git

## 1. Clone & Install
```bash
git clone https://github.com/MouzakkiSoufianee/taskflow.git
cd taskflow
npm install
```

## 2. Environment Setup
```bash
cp .env.example .env.local
```

Update `.env.local` with your database URL:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_db?schema=public"
NEXTAUTH_SECRET="your-secret-key-here"
```

## 3. Database Setup
```bash
npm run db:push
npm run db:seed
```

## 4. Start Development
```bash
npm run dev
```

## 5. Login with Demo Account
- Email: `demo@taskflow.com`
- Password: `password123`

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:studio` - Open database GUI
- `npm run db:push` - Update database schema
- `npm run db:seed` - Add demo data

## What's Included
✅ Complete database schema
✅ User authentication system (NextAuth.js)
✅ Login/Registration pages
✅ Protected routes middleware
✅ Professional UI components
✅ Responsive dashboard layout
✅ Project & task management models
✅ Real-time collaboration structure
✅ Demo data for testing
✅ TypeScript types & utilities

Ready for Phase 3: Project Management UI!

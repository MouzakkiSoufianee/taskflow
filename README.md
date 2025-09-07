# TaskFlow - Collaborative Task Management Application

TaskFlow is a modern, real-time collaborative task management application built with Next.js 14, showcasing advanced full-stack development skills perfect for a junior developer's portfolio.

## 🚀 Features

- **Real-time Collaboration**: Live updates and user presence with Socket.io
- **Project Management**: Create and manage multiple projects with team members
- **Task Management**: CRUD operations with drag-and-drop functionality
- **User Authentication**: NextAuth.js with email/password and OAuth providers
- **Role-based Access Control**: Owner, Admin, and Member roles
- **Activity Feed**: Track all project and task activities
- **Comments System**: Task discussions and feedback
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with app router
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons

### Backend
- **Next.js API Routes** - Server-side API endpoints
- **Prisma ORM** - Database toolkit and query builder
- **PostgreSQL** - Relational database
- **NextAuth.js** - Authentication library

### Real-time Features
- **Socket.io** - Real-time bidirectional communication

### Development Tools
- **ESLint** - Code linting
- **Prisma Studio** - Database GUI
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (local or cloud)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd taskflow
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the example environment file and configure your variables:
```bash
cp .env.example .env.local
```

Update `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/taskflow_db?schema=public"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Socket.io
SOCKET_PORT="3001"
```

### 4. Database Setup

#### Generate Prisma Client
```bash
npm run db:generate
```

#### Push the database schema
```bash
npm run db:push
```

#### Seed the database with demo data
```bash
npm run db:seed
```

### 5. Start the Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

## 📊 Database Scripts

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with demo data
- `npm run db:reset` - Reset database and run migrations

## 🧪 Demo Data

After seeding, you can use these demo credentials:

**Main Demo Account:**
- Email: `demo@taskflow.com`
- Password: `password123`

**Additional Demo Users:**
- Email: `alice@taskflow.com` / Password: `password123`
- Email: `bob@taskflow.com` / Password: `password123`

## 📁 Project Structure

```
taskflow/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Database seeding script
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js app router
│   │   ├── api/              # API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   ├── lib/                  # Utility libraries
│   │   ├── prisma.ts         # Prisma client setup
│   │   ├── db.ts             # Database operations
│   │   └── utils.ts          # Utility functions
│   └── types/                # TypeScript type definitions
├── .env.local               # Environment variables
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── prisma.schema            # Database schema
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## 🔧 Development

### Database Management
Access Prisma Studio to view and edit your database:
```bash
npm run db:studio
```

### Building for Production
```bash
npm run build
npm run start
```

## 🌟 Key Features Implementation

### Authentication
- Email/password authentication with NextAuth.js
- OAuth integration (Google, GitHub)
- Protected routes and API endpoints

### Real-time Features
- Live task updates across all connected clients
- User presence indicators
- Real-time activity feed

### Task Management
- Drag-and-drop task reordering
- Task status tracking (Todo, In Progress, In Review, Done)
- Priority levels (Low, Medium, High, Urgent)
- Due date management

### Collaboration
- Project-based team organization
- Role-based permissions (Owner, Admin, Member)
- Activity tracking and notifications
- Task comments and discussions

## 📈 Next Steps for Enhancement

- [ ] File attachments for tasks
- [ ] Task time tracking
- [ ] Kanban board view
- [ ] Email notifications
- [ ] Mobile app with React Native
- [ ] Advanced reporting and analytics
- [ ] Integrations with external tools

## 🤝 Contributing

This is a portfolio project, but feedback and suggestions are welcome!

## 📄 License

This project is for portfolio demonstration purposes.

---

**TaskFlow** - Showcasing modern full-stack development with real-time collaboration features.

# 🗳️ PollApp - Modern Polling Application

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</div>

<div align="center">
  <h3>Create, share, and analyze polls with real-time results and beautiful analytics</h3>
  <p>A modern, full-stack polling application built with Next.js 15, TypeScript, Supabase, and Shadcn/ui components.</p>
  <p>🚀 <strong>Authentication system fully implemented</strong> | 🎨 <strong>Modern UI ready</strong> | 📊 <strong>Backend integration in progress</strong></p>
</div>

---

## ✨ Features

- 🚀 **Quick Poll Creation** - Create polls in seconds with an intuitive interface
- 📊 **Real-time Analytics** - Watch results update in real-time with beautiful charts
- 🔐 **User Authentication** - Secure registration and login system
- 🔒 **Privacy Controls** - Choose between public and private polls
- ⏰ **Smart Scheduling** - Set expiration dates and automate feedback collection
- 👥 **Team Collaboration** - Share polls and collect feedback from your audience
- 📱 **Responsive Design** - Works perfectly on all devices
- 🎨 **Modern UI** - Built with Shadcn/ui components for a beautiful experience
- 🔄 **Real-time Updates** - Live poll results without page refresh
- 📈 **Advanced Analytics** - Detailed insights and statistics

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)

### Backend & Database
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL with real-time capabilities)
- **Authentication**: [Supabase Auth](https://supabase.com/docs/guides/auth) with JWT tokens
- **Real-time**: Supabase real-time subscriptions
- **API**: Next.js API routes with server-side Supabase client

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Deployment**: [Vercel](https://vercel.com/)

## 📁 Project Structure

```
polling-app/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Authentication routes group
│   │   ├── 📁 login/                # Login page with Supabase auth
│   │   └── 📁 register/             # Registration page with Supabase auth
│   ├── 📁 (dashboard)/              # Protected dashboard routes group
│   │   ├── 📁 dashboard/            # Dashboard overview
│   │   ├── 📁 polls/                # Polls management
│   │   │   ├── 📁 create/           # Create new poll
│   │   │   ├── 📁 [id]/             # Individual poll view
│   │   │   └── 📄 page.tsx          # Polls listing
│   │   └── 📄 layout.tsx            # Protected dashboard layout
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 auth/                 # Authentication endpoints
│   │   └── 📁 polls/                # Poll management endpoints
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout with AuthProvider
│   ├── 📄 page.tsx                  # Homepage
│   └── 📄 middleware.ts             # Route protection middleware
├── 📁 components/                   # React components
│   ├── 📁 auth/                     # Authentication components
│   │   ├── � login-form.tsx        # Login form with Supabase
│   │   └── 📄 register-form.tsx     # Registration form with Supabase
│   ├── �📁 dashboard/                # Dashboard components
│   ├── 📁 layout/                   # Layout components
│   │   ├── 📄 navbar.tsx            # Navigation with logout
│   │   ├── 📄 sidebar.tsx           # Dashboard sidebar
│   │   └── 📄 dashboard-layout.tsx  # Dashboard layout wrapper
│   ├── 📁 polls/                    # Poll-related components
│   │   ├── 📄 poll-card.tsx         # Poll display component
│   │   ├── 📄 poll-filters.tsx      # Poll filtering interface
│   │   └── � create-poll-form.tsx  # Poll creation form
│   └── �📁 ui/                       # Shadcn/ui components
├── 📁 lib/                          # Utility libraries
│   ├── 📁 auth/                     # Authentication utilities
│   │   ├── 📄 auth-context.tsx      # React auth context provider
│   │   └── 📄 middleware.ts         # Route protection utilities
│   ├── 📁 supabase/                 # Supabase configuration
│   │   ├── 📄 client.ts             # Browser Supabase client
│   │   └── 📄 server.ts             # Server Supabase client
│   ├── 📁 db/                       # Database operations (placeholder)
│   ├── 📁 types/                    # TypeScript type definitions
│   └── 📄 utils.ts                  # General utilities
├── 📁 public/                       # Static assets
├── 📄 package.json                  # Dependencies and scripts
├── 📄 tailwind.config.js            # Tailwind configuration
├── 📄 components.json               # Shadcn/ui configuration
├── 📄 .env.example                  # Environment variables template
├── 📄 middleware.ts                 # Next.js middleware
└── 📄 README.md                     # This file
```

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.17+ or 20.3+ ([Download](https://nodejs.org/))
- **pnpm** ([Install pnpm](https://pnpm.io/installation))
- **Supabase Account** ([Create account](https://supabase.com/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/polling-app.git
   cd polling-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up Supabase project**
   - Visit [supabase.com](https://supabase.com) and create a new project
   - Go to Settings → API to get your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Supabase credentials:
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler

# Database (when implemented)
pnpm db:push      # Push schema changes
pnpm db:studio    # Open database studio
pnpm db:migrate   # Run migrations
```

## 🎨 UI Components

This project uses [Shadcn/ui](https://ui.shadcn.com/) components with Tailwind CSS v4. The following components are included:

### Form Components
- `Button` - Interactive buttons with multiple variants
- `Input` - Form input fields with validation
- `Label` - Accessible form labels
- `Textarea` - Multi-line text inputs
- `Select` - Dropdown selections with search
- `Form` - Form handling utilities with React Hook Form

### Display Components
- `Card` - Container component for content sections
- `Badge` - Status and category indicators
- `Avatar` - User profile pictures and initials
- `Separator` - Visual dividers

### Navigation Components
- `Navigation Menu` - Main navigation component
- `Dropdown Menu` - Context menus and actions
- `Dialog` - Modal dialogs and confirmations

### Feedback Components
- `Alert` - Important messages and notifications
- `Progress` - Progress bars for poll results
- `Skeleton` - Loading states

## 🏗️ Architecture Overview

### Route Groups
The application uses Next.js 15 route groups to organize pages:
- `(auth)` - Authentication pages (login, register)
- `(dashboard)` - Protected dashboard pages with shared layout

### Component Organization
- **Layout Components** - Navbar, Sidebar, and layout wrappers
- **Feature Components** - Poll cards, forms, and dashboards
- **Auth Components** - Login and registration forms
- **UI Components** - Reusable Shadcn/ui components

### Type Safety
Complete TypeScript coverage with defined interfaces for:
- User and authentication types
- Poll and voting types
- API response types
- Form data types

### State Management
- **Server State** - React Query / SWR for API data
- **Client State** - React useState and useContext
- **Form State** - React Hook Form with Zod validation

## 📊 Features Overview

### 🔐 Authentication System
- [x] User registration with password strength validation
- [x] Secure login with email/password via Supabase
- [x] JWT token-based session management
- [x] Protected routes with middleware
- [x] Automatic redirects for authenticated/unauthenticated users
- [x] Password visibility toggle
- [x] Form validation and error handling
- [x] Logout functionality with session cleanup
- [ ] Social authentication (Google, GitHub)
- [ ] Password reset functionality
- [ ] Email verification

### 🗳️ Poll Management
- [x] Create polls with multiple options (up to 10)
- [x] Set poll visibility (public/private)
- [x] Configure voting rules (single/multiple choice)
- [x] Schedule poll expiration
- [ ] Real-time vote counting
- [ ] Poll templates
- [ ] Poll categories and tags
- [ ] Poll duplication

### 📈 Dashboard Features
- [x] Overview with statistics cards
- [x] Recent polls and activity feed
- [x] Quick action buttons
- [x] Responsive sidebar navigation
- [x] Poll filtering and search
- [ ] Advanced analytics charts
- [ ] Export functionality
- [ ] Bulk operations

### 🎯 Poll Display
- [x] Beautiful poll cards with voting interface
- [ ] Real-time results with progress bars
- [x] Vote counts and percentages
- [x] Creator information and timestamps
- [ ] Share and management options
- [ ] Comments and discussions
- [ ] Poll embedding

## 🔧 Development Setup

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NEXTAUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000
```

### Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Get your project credentials** from Settings → API
3. **Configure authentication** in Authentication → Settings
4. **Set up database tables** (when implementing polls functionality)

### Database Setup

The application uses **Supabase** (PostgreSQL with real-time capabilities) as the database and authentication provider.

#### Setting up Supabase

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Configure environment variables** with your project credentials
3. **Set up authentication** in the Supabase dashboard
4. **Create database tables** when implementing polls functionality

#### Alternative Database Options (Future)

##### Option 1: PostgreSQL with Prisma
```bash
pnpm add prisma @prisma/client
pnpm add -D @types/bcryptjs
npx prisma init
# Configure your schema and run migrations
```

##### Option 2: MongoDB with Mongoose
```bash
pnpm add mongoose
pnpm add -D @types/mongoose
```

### Authentication Setup

The application uses **Supabase Auth** for user authentication, which provides:

- Email/password authentication
- JWT token management
- Session handling
- User profile management
- Row Level Security (RLS) policies

#### Authentication Features Implemented ✅
- User registration and login
- Protected routes with middleware
- Session management
- Automatic redirects
- Logout functionality

#### Future Authentication Options

##### Option 1: NextAuth.js
```bash
pnpm add next-auth
```

##### Option 2: Clerk
```bash
pnpm add @clerk/nextjs
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure environment variables**
   - Add all environment variables from `.env.local`

3. **Deploy**
   ```bash
   pnpm build
   # Vercel will automatically deploy on git push
   ```

### Alternative Deployment Options

- **Netlify**: Great for static sites and edge functions
- **Railway**: Simple database and app hosting
- **PlanetScale**: For database hosting
- **Supabase**: All-in-one solution with database and auth

## 🎯 Roadmap

### Phase 1: Core Functionality ✅
- [x] Project setup and UI components
- [x] Basic routing and navigation
- [x] **Complete authentication system with Supabase**
- [x] Protected routes and middleware
- [x] User registration and login forms
- [x] Dashboard layout with authentication
- [x] Session management and logout
- [x] Poll creation interface (UI ready)
- [x] Responsive design implementation

### Phase 2: Backend Integration 🚧
- [ ] Database schema and models for polls
- [ ] API endpoints for poll CRUD operations
- [ ] Vote submission and counting system
- [ ] Real-time vote updates with Supabase
- [ ] User profile management
- [ ] Poll analytics and statistics

### Phase 3: Advanced Features 📋
- [ ] Real-time poll results with live updates
- [ ] Advanced analytics dashboard
- [ ] Email notifications for poll updates
- [ ] Poll templates and categories
- [ ] Social sharing functionality
- [ ] Comments and discussion system
- [ ] Poll expiration and archiving

### Phase 4: Enhancements 🔮
- [ ] Mobile app (React Native)
- [ ] AI-powered poll suggestions
- [ ] Integration with third-party tools
- [ ] Advanced permissions and roles
- [ ] White-label solutions
- [ ] API for third-party integrations

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests if applicable
   - Update documentation

4. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**

### Development Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Add proper error handling
- Write descriptive commit messages
- Update tests and documentation

## 🐛 Known Issues & Limitations

### ✅ Resolved Issues
- [x] Authentication system fully implemented with Supabase
- [x] Protected routes working with middleware
- [x] User registration and login functional
- [x] Session management implemented
- [x] Build compilation errors resolved

### 🚧 Current Limitations
- [ ] Poll creation and voting functionality (UI ready, backend pending)
- [ ] Database tables for polls not yet created in Supabase
- [ ] Real-time vote counting not implemented
- [ ] Poll analytics and statistics not available
- [ ] Calendar component temporarily disabled (react-day-picker compatibility)
- [ ] Social authentication (Google, GitHub) not implemented
- [ ] Password reset functionality not implemented
- [ ] Email verification not configured

### 🔄 In Progress
- [ ] Database schema design for polls and votes
- [ ] API endpoints for poll management
- [ ] Real-time subscriptions setup

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - Open source Firebase alternative with PostgreSQL
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Vercel](https://vercel.com/) - Platform for frontend developers
- [TypeScript](https://www.typescriptlang.org/) - JavaScript with syntax for types

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/polling-app/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions
4. Contact the maintainers

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/johnolamide">John Olamide</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

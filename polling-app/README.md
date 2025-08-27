# 🗳️ PollApp - Modern Polling Application

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white" alt="pnpm" />
</div>

<div align="center">
  <h3>Create, share, and analyze polls with real-time results and beautiful analytics</h3>
  <p>A modern, full-stack polling application built with Next.js 15, TypeScript, and Shadcn/ui components.</p>
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

### Backend (To be implemented)
- **Database**: Prisma + PostgreSQL / MongoDB / Supabase
- **Authentication**: NextAuth.js / Clerk / Supabase Auth
- **Real-time**: Socket.io / Server-Sent Events
- **Deployment**: Vercel / Netlify

### Development Tools
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Code Quality**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
polling-app/
├── 📁 app/                          # Next.js App Router
│   ├── 📁 (auth)/                   # Authentication routes group
│   │   ├── 📁 login/                # Login page
│   │   └── 📁 register/             # Registration page
│   ├── 📁 (dashboard)/              # Dashboard routes group
│   │   ├── 📁 dashboard/            # Dashboard overview
│   │   ├── 📁 polls/                # Polls management
│   │   │   ├── 📁 create/           # Create new poll
│   │   │   ├── 📁 [id]/             # Individual poll view
│   │   │   └── 📄 page.tsx          # Polls listing
│   │   └── 📄 layout.tsx            # Dashboard layout
│   ├── 📁 api/                      # API routes
│   │   ├── 📁 auth/                 # Authentication endpoints
│   │   └── 📁 polls/                # Poll management endpoints
│   ├── 📄 globals.css               # Global styles
│   ├── 📄 layout.tsx                # Root layout
│   └── 📄 page.tsx                  # Homepage
├── 📁 components/                   # React components
│   ├── 📁 auth/                     # Authentication components
│   ├── 📁 dashboard/                # Dashboard components
│   ├── 📁 layout/                   # Layout components
│   ├── 📁 polls/                    # Poll-related components
│   └── 📁 ui/                       # Shadcn/ui components
├── 📁 lib/                          # Utility libraries
│   ├── 📁 auth/                     # Authentication utilities
│   ├── 📁 db/                       # Database operations
│   ├── 📁 types/                    # TypeScript type definitions
│   └── 📄 utils.ts                  # General utilities
├── 📁 public/                       # Static assets
├── 📄 package.json                  # Dependencies and scripts
├── 📄 tailwind.config.js            # Tailwind configuration
├── 📄 components.json               # Shadcn/ui configuration
└── 📄 README.md                     # This file
```

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 18.17+ or 20.3+ ([Download](https://nodejs.org/))
- **pnpm** ([Install pnpm](https://pnpm.io/installation))

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

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
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
- [x] Secure login with email/password
- [ ] Social authentication (Google, GitHub)
- [x] Password visibility toggle
- [x] Form validation and error handling
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
# Database
DATABASE_URL="your_database_connection_string"

# Authentication
NEXTAUTH_SECRET="your_nextauth_secret"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# Email (optional)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your_email@gmail.com"
EMAIL_SERVER_PASSWORD="your_app_password"
EMAIL_FROM="noreply@yourapp.com"
```

### Database Setup (Choose one)

#### Option 1: PostgreSQL with Prisma
```bash
pnpm add prisma @prisma/client
pnpm add -D @types/bcryptjs
npx prisma init
# Configure your schema and run migrations
```

#### Option 2: MongoDB with Mongoose
```bash
pnpm add mongoose
pnpm add -D @types/mongoose
```

#### Option 3: Supabase (Recommended for quick setup)
```bash
pnpm add @supabase/supabase-js
# Set up your Supabase project and tables
```

### Authentication Setup (Choose one)

#### Option 1: NextAuth.js
```bash
pnpm add next-auth
```

#### Option 2: Clerk
```bash
pnpm add @clerk/nextjs
```

#### Option 3: Supabase Auth
```bash
# Already included if using Supabase
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
- [x] Authentication forms
- [x] Poll creation interface
- [x] Dashboard layout

### Phase 2: Backend Integration 🚧
- [ ] Database schema and models
- [ ] Authentication system
- [ ] API endpoints for polls
- [ ] Vote submission and counting
- [ ] User profile management

### Phase 3: Advanced Features 📋
- [ ] Real-time updates
- [ ] Advanced analytics
- [ ] Email notifications
- [ ] Poll templates
- [ ] Social sharing
- [ ] Comments system

### Phase 4: Enhancements 🔮
- [ ] Mobile app (React Native)
- [ ] AI-powered poll suggestions
- [ ] Integration with third-party tools
- [ ] Advanced permissions
- [ ] White-label solutions

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

## 🐛 Known Issues

- [ ] Real-time updates not implemented yet
- [ ] Database integration is placeholder
- [ ] Authentication is not fully functional
- [ ] Some responsive design improvements needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Shadcn/ui](https://ui.shadcn.com/) - Beautiful and accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit
- [Vercel](https://vercel.com/) - Platform for frontend developers

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/polling-app/issues) page
2. Create a new issue if your problem isn't already reported
3. Join our community discussions
4. Contact the maintainers

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/yourusername">Your Name</a></p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>

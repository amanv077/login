# MyAPP - Secure Authentication System

A modern, secure Next.js application with role-based authentication, OTP email verification, and dashboard management.

## Features

- 🔐 **Secure Authentication** - NextAuth.js with credentials provider
- 📧 **Email Verification** - OTP-based email verification system
- 👥 **Role-Based Access** - Admin, Agent, and User roles with dedicated dashboards
- 🛡️ **Security Middleware** - Route protection based on user roles
- 🎨 **Modern UI** - Clean white/blue theme with Tailwind CSS
- 📱 **Responsive Design** - Mobile-first responsive design
- 🔄 **Password Security** - bcrypt password hashing
- ☁️ **Cloud Ready** - Prisma with PostgreSQL and Cloudinary integration

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Email:** Nodemailer with Gmail SMTP
- **File Storage:** Cloudinary
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- PostgreSQL database (or Prisma Accelerate)
- Gmail account for SMTP
- Cloudinary account (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd login
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Copy the provided environment variables to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the following variables in `.env.local`:
   - `DATABASE_URL` - Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` - Random secret for NextAuth.js
   - `EMAIL_USER` - Your Gmail address
   - `EMAIL_PASS` - Your Gmail app password
   - `CLOUDINARY_*` - Your Cloudinary credentials (optional)

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## User Roles

### User (Default)
- Access to personal dashboard
- Profile management
- Document access

### Agent
- All user permissions
- Client management tools
- Task tracking
- Performance reports

### Admin
- All agent permissions  
- User management
- System settings
- Analytics and reports
- Security controls

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database commands
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma studio        # Open Prisma Studio
```

# Next.js Authentication App

A modern, secure authentication application built with Next.js, TypeScript, Prisma, NextAuth.js, and PostgreSQL.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth.js
- 📧 **Email Verification** - OTP-based email verification
- 👥 **Role-Based Access** - Support for User and Agent roles (Admin via seeding)
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- 📱 **Mobile Responsive** - Optimized for all device sizes
- � **Password Security** - Strong password requirements and hashing
- 🚀 **Fast Development** - Built with Next.js 15 and TypeScript

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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

## Admin Setup

### Creating Admin Users

For security reasons, admin users cannot be created through the registration form. Use the seeding script to create admin accounts:

```bash
npm run db:seed
```

This creates an admin user with:
- **Email**: `admin@company.com`
- **Password**: `Admin@123456`
- **Role**: `ADMIN`

**⚠️ Security Important**: Change the default password immediately after first login!

### Alternative Admin Creation Methods

#### Method 1: Using Prisma Studio
```bash
npx prisma studio
```
Navigate to the User table and manually create an admin user.

#### Method 2: Direct Database Insert
```sql
INSERT INTO "User" (
  id, name, email, password, role, "emailVerified", "isActive", "createdAt", "updatedAt"
) VALUES (
  'admin-001',
  'System Administrator', 
  'admin@company.com',
  '$2a$12$[bcrypt-hashed-password]',
  'ADMIN',
  NOW(),
  true,
  NOW(),
  NOW()
);
```

## User Roles

### User (👤)
- Available through registration
- Access to personal dashboard
- Profile management
- Basic application features

### Agent (🏢)
- Available through registration
- All user permissions
- Extended business tools
- Client management features

### Admin (⚙️)
- **Only available through seeding/manual creation**
- All agent permissions  
- User management
- System settings
- Complete system control

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

# Admin setup
npm run db:seed          # Create admin user
```

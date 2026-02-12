# Mission Control - Developer Setup Guide

This guide details how to set up the "Mission Control" project locally.

## 🛠 Prerequisites

- **Node.js**: v18+ (tested with v20/22)
- **PostgreSQL**: v14+ (for local database)
- **npm** or **bun**

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone <repo-url>
cd mission-control
npm install
```

### 2. Database Setup (PostgreSQL)
The project uses a local PostgreSQL database. You need to create a user and database matching the configuration.

**Default Local Credentials:**
- **Username:** `johndoe`
- **Password:** `randompassword`
- **Database:** `asoc_db`
- **Host:** `localhost`
- **Port:** `5432`

**Setup Commands (Terminal):**
```bash
# Start Postgres (if using Homebrew)
brew services start postgresql

# Create User
psql postgres -c "CREATE USER johndoe WITH PASSWORD 'randompassword' CREATEDB;"

# Create Database
psql postgres -c "CREATE DATABASE asoc_db OWNER johndoe;"
```

### 3. Environment Variables
Create a `.env.local` file in the root directory.

**Required Configuration:**
```ini
# Database (Local Postgres)
DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/asoc_db?schema=public"

# AI & LLM Services
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key

# Voice & Telephony
RETELL_API_KEY=your_retell_key
RETELL_AGENT_ID=your_agent_id
RETELL_FROM_NUMBER=+14155552671

# Lead Generation
APOLLO_API_KEY=your_apollo_key

# Email
RESEND_API_KEY=your_resend_key

# Real-time Updates (Optional for Dev, required for features)
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_pusher_secret
NEXT_PUBLIC_PUSHER_CLUSTER=mt1

# Scheduling
CALENDLY_API_KEY=your_calendly_key
```

### 4. Database Schema Migration
Push the Prisma schema to your local database to create tables.
```bash
npx prisma db push
```

### 5. Run the Server
```bash
npm run dev
```
Access the dashboard at [http://localhost:3000/dashboard](http://localhost:3000/dashboard).

## 📂 Project Structure

- `/src/app`: Next.js App Router pages and API routes.
- `/src/components`: React components (Dashboard, Shadcn UI).
- `/src/lib`: Utilities and service configurations (Prisma, Pusher, AI).
- `/prisma`: Database schema (`schema.prisma`).

## 🐛 Troubleshooting

**"PrismaClientInitializationError"**:
- Ensure PostgreSQL is running (`brew services list`).
- Verify `DATABASE_URL` in `.env.local` matches your Postgres setup.
- Run `npx prisma generate` to rebuild the client.

**Port Conflicts**:
- If port 3000 is in use, the app will try 3001.
- You can clear port 3000 with: `lsof -t -i:3000 | xargs kill -9`

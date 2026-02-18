# Gemini Chat - ChatGPT Clone

A production-ready full-stack web application built with Next.js 14+, TypeScript, Tailwind CSS, Prisma, Neon PostgreSQL, NextAuth, and Gemini AI.

## Features

- **Google Authentication**: Secure sign-in with NextAuth.
- **Gemini AI Integration**: Chat with Google's Gemini Pro model.
- **Persistent Chat History**: Chats and messages are saved in PostgreSQL via Prisma.
- **Responsive Design**: Mobile-friendly sidebar and chat interface.
- **Dark Mode**: Sleek dark theme by default.
- **Chat Management**: Create, delete, and search chats.

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory with the following:
   ```env
   DATABASE_URL="postgresql://user:password@host/neondb"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   GEMINI_API_KEY="AIzaSyAOQnDKWpBTUZmESCcXXd2Hpxzork2tI1U"
   ```

3. **Database Setup**
   Push the schema to your database:
   ```bash
   npx prisma db push
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components (Sidebar, ChatWindow, etc.).
- `src/lib`: Utilities (Prisma client, Auth config).
- `prisma`: Database schema.

## Deployment

Deploy easily on Vercel or any platform supporting Next.js. Remember to set the environment variables in your deployment dashboard.

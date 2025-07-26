# Goodluck Technology - Career Portal

## Overview

This is a full-stack web application for Goodluck Technology, a blockchain development company. The application serves as a career portal featuring job listings, company announcements, and an admin panel for managing content. It's built with a modern tech stack including React, Express, PostgreSQL, and uses Drizzle ORM for database management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and bundling
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Session Management**: Express sessions with PostgreSQL store
- **API**: RESTful endpoints for jobs, announcements, and applications

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` for type sharing
- **Migration Management**: Drizzle Kit for schema migrations
- **Connection**: Neon serverless PostgreSQL via connection pooling

## Key Components

### Database Schema
- **Users Table**: Stores user authentication data (required for Replit Auth)
- **Sessions Table**: Handles session persistence for authentication
- **Jobs Table**: Job listings with full details including salary, skills, requirements
- **Job Applications Table**: User applications with status tracking
- **Announcements Table**: Company news and updates with categories

### Authentication System
- **Provider**: Replit OpenID Connect integration
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation/updates on login
- **Route Protection**: Middleware for admin-only endpoints

### API Endpoints
- **Public Routes**: Job listings, announcements, job applications
- **Protected Routes**: Admin panel operations (create/edit jobs and announcements)
- **Authentication Routes**: User info, login/logout handling

### Frontend Features
- **Public Pages**: Homepage with jobs and announcements
- **Admin Panel**: Protected interface for content management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Support**: Light/dark mode with system preference detection

## Data Flow

1. **Public Access**: Users can view jobs and announcements without authentication
2. **Job Applications**: Anonymous users can submit applications for positions
3. **Admin Access**: Authenticated users (via Replit Auth) can access admin panel
4. **Content Management**: Admins can create, edit, and manage jobs and announcements
5. **Application Review**: Admins can view and update application statuses

## External Dependencies

### Core Libraries
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **ORM**: drizzle-orm with drizzle-kit for migrations
- **Authentication**: openid-client for Replit Auth integration
- **UI Components**: @radix-ui/* components for accessible interfaces
- **Forms**: react-hook-form with @hookform/resolvers for validation
- **Validation**: zod for schema validation and type safety

### Development Tools
- **Build**: Vite with React plugin and TypeScript support
- **Styling**: Tailwind CSS with PostCSS processing
- **Code Quality**: TypeScript with strict configuration
- **Development**: tsx for TypeScript execution in development

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Authentication**: Requires Replit-specific environment variables
- **Session Security**: Requires `SESSION_SECRET` for session encryption

### Production Setup
- **Server**: Express serves both API and static files
- **Database**: PostgreSQL with connection pooling
- **Assets**: Static file serving for built React application
- **Error Handling**: Comprehensive error middleware for API endpoints

The application follows a monorepo structure with shared TypeScript types between frontend and backend, ensuring type safety across the entire stack. The authentication system integrates seamlessly with Replit's infrastructure while maintaining the flexibility to work in other environments.
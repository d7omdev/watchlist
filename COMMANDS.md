# Command Reference Guide

This document provides a comprehensive reference for all available commands in the Watchlist project.

## Quick Start Commands

### Initial Setup
```bash
# Complete project setup (recommended for first-time setup)
npm run setup           # Install dependencies + database setup + migrations

# Alternative: step-by-step setup
npm run install:all     # Install all dependencies only
npm run db:setup        # Setup database and run migrations
npm run db:seed         # Add sample data (optional)
```

### Development
```bash
# Start development servers (both frontend and backend)
npm run dev             # Starts both servers with hot reload

# Start individual servers
npm run dev:frontend    # Frontend only (port 5173)
npm run dev:backend     # Backend only (port 3001)
```

### Production
```bash
# Build and start production servers
npm run build           # Build both projects for production
npm run start           # Start both production servers
npm run test:build      # Verify builds work correctly
```

## System Health & Maintenance

### Health Checks
```bash
npm run health          # Check if both servers are running
npm run test:mysql      # Test MySQL database connection
```

### Maintenance
```bash
npm run clean           # Remove all node_modules and build folders
npm run install:all     # Reinstall all dependencies after clean
```

## Database Management

### Setup & Migrations
```bash
npm run db:check        # Verify MySQL connection and database exists
npm run db:setup        # Generate and run all database migrations
npm run db:seed         # Populate database with sample data
```

### Advanced Database Commands (Backend Directory)
```bash
cd backend

# Migration management
npm run db:generate     # Generate new migration files
npm run db:migrate      # Run pending migrations
npm run db:studio       # Open Drizzle Studio (database GUI)

# Development utilities
npm run db:seed         # Add sample data to database
```

## Individual Project Commands

### Backend Commands (`cd backend`)

#### Development
```bash
npm run dev             # Start development server with hot reload (port 3001)
npm run build           # Compile TypeScript to JavaScript
npm start               # Start production server from compiled code
```

#### Database Operations
```bash
npm run db:generate     # Generate new migration files from schema changes
npm run db:migrate      # Apply pending migrations to database
npm run db:studio       # Launch Drizzle Studio (visual database editor)
npm run db:seed         # Populate database with sample data
```

#### Utilities
```bash
npm test                # Run backend tests (when implemented)
npx tsc --noEmit        # Type check without building
```

### Frontend Commands (`cd frontend`)

#### Development
```bash
npm run dev             # Start development server with HMR (port 5173)
npm run build           # Build optimized production bundle
npm run preview         # Preview production build locally (port 4173)
```

#### Code Quality
```bash
npm run lint            # Run ESLint for code quality checks
npm run type-check      # Run TypeScript compiler for type checking
```

#### Advanced
```bash
npm run dev -- --port 3000    # Start dev server on custom port
npm run build -- --mode staging  # Build for staging environment
```

## Development Workflows

### First-Time Setup Workflow
```bash
# 1. Clone and setup
git clone <repository-url>
cd watchlist

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your database credentials

# 3. Complete setup
npm run setup

# 4. Start development
npm run dev
```

### Daily Development Workflow
```bash
# Start your development session
npm run dev             # Starts both frontend and backend

# Check system health (optional)
npm run health          # Verify both servers are running

# During development, use individual commands as needed:
cd frontend && npm run lint        # Check frontend code quality
cd backend && npm run db:studio    # Open database GUI
```

### Pre-Deployment Workflow
```bash
# 1. Verify everything builds correctly
npm run test:build      # Test both frontend and backend builds

# 2. Build for production
npm run build           # Create optimized production builds

# 3. Test production build locally
npm start               # Start production servers locally

# 4. Run final checks
npm run health          # Ensure everything is working
```

### Troubleshooting Workflow
```bash
# For build or dependency issues:
npm run clean           # Remove all node_modules and builds
npm run setup           # Reinstall and setup everything

# For database issues:
npm run test:mysql      # Test database connection
npm run db:setup        # Reset database migrations

# For server issues:
npm run health          # Check what's running
lsof -ti:3001 | xargs kill -9    # Kill backend process if stuck
lsof -ti:5173 | xargs kill -9    # Kill frontend process if stuck
```

## Port Configuration

| Service | Development | Production | Description |
|---------|-------------|------------|-------------|
| Frontend | http://localhost:5173 | http://localhost:4173 | React application |
| Backend API | http://localhost:3001 | http://localhost:3001 | Express server |
| Database | localhost:3306 | localhost:3306 | MySQL server |
| Drizzle Studio | http://localhost:4983 | N/A | Database GUI |

### Custom Port Configuration
```bash
# Frontend custom port
cd frontend && npm run dev -- --port 3000

# Backend custom port (requires .env change)
# Edit backend/.env: PORT=3002
cd backend && npm run dev
```

## Environment-Specific Commands

### Development Environment
```bash
NODE_ENV=development npm run dev
npm run db:studio                    # Database GUI available
```

### Production Environment
```bash
NODE_ENV=production npm run build
NODE_ENV=production npm start
# Note: db:studio not recommended in production
```

### Testing Environment
```bash
NODE_ENV=test npm run test:build
# Add test database configuration in .env.test
```

## Command Aliases & Shortcuts

Create these aliases in your shell for faster development:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias watchlist-dev="cd /path/to/watchlist && npm run dev"
alias watchlist-health="cd /path/to/watchlist && npm run health"
alias watchlist-clean="cd /path/to/watchlist && npm run clean && npm run setup"
```

## CI/CD Commands

For automated deployment pipelines:

```bash
# Install dependencies
npm run install:all

# Run quality checks
cd frontend && npm run lint && npm run type-check
cd ../backend && npx tsc --noEmit

# Build and test
npm run test:build

# Deploy (platform-specific)
npm run build
```

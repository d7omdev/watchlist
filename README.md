# WatchList

A simple and modern web app to track your favorite movies and TV shows. Built with React, TypeScript, Node.js, and MySQL.

## Features

### Core Functionality
- ✅ **Content Management**: Add, edit, and delete movies and TV shows with detailed information
- ✅ **Advanced UI**: Responsive data table with infinite scroll and modern components
- ✅ **User Authentication**: Secure login/register system with JWT tokens
- ✅ **File Uploads**: Support for media file uploads with validation
- ✅ **Data Validation**: Comprehensive input validation on both frontend and backend
- ✅ **Real-time Updates**: Live data synchronization across the application

### Technical Features
- ✅ **Type Safety**: Full TypeScript implementation with strict mode
- ✅ **RESTful API**: Well-structured API with proper error handling and status codes
- ✅ **Database ORM**: Drizzle ORM with MySQL for type-safe database operations
- ✅ **Modern UI**: Shadcn UI components with TailwindCSS styling
- ✅ **Performance**: Optimized builds and efficient data loading
- ✅ **Security**: CORS configuration, input sanitization, and secure authentication

## Technology Stack

### Frontend
- **React 19** with Vite and TypeScript for modern development
- **Shadcn UI** for accessible, customizable components
- **TailwindCSS v4** for utility-first styling
- **React Hook Form** with Zod validation for form management
- **Tanstack Table** for advanced data table functionality
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express and TypeScript for robust server-side logic
- **Drizzle ORM** for type-safe database operations
- **MySQL 8.0+** as the primary database
- **OpenAuth** for secure authentication
- **Zod** for runtime schema validation
- **Multer** for file upload handling
- **CORS** configured for secure cross-origin requests

### Development Tools
- **ESLint** with TypeScript rules for code quality
- **Vite** for fast development and optimized builds
- **Drizzle Kit** for database migrations and studio
- **Concurrently** for running multiple development servers

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js) or **yarn** package manager
- **Git** for version control

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 1GB free space for dependencies and builds

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/d7omdev/watchlist.git
cd watchlist/backend

# Copy environment file and configure
cp .env.example .env
# Edit .env with your preferred settings

# Start with Docker Compose
docker-compose up -d

# The backend will be available at http://localhost:3001
# Database will be available at localhost:3306
```

### Option 2: Manual Setup

```bash
# Clone and setup
git clone https://github.com/d7omdev/watchlist.git
cd watchlist
npm run setup

# Start development servers
npm run dev
```

The app will be available at http://localhost:5173

### Manual Setup

```bash
# 1. Install dependencies
npm run install:all

# 2. Configure database
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL credentials

# 3. Create database
mysql -u root -p -e "CREATE DATABASE watchlist;"

# 4. Setup database
npm run db:setup

# 5. Start servers
npm run dev
```

### Option 3: Production Build

```bash
# Build for production
npm run build

# Start production servers
npm start

# Test production build locally
npm run test:build
```

## Application URLs

| Environment | Frontend | Backend API |
|-------------|----------|-------------|
| Development | http://localhost:5173 | http://localhost:3001 |
| Production | http://localhost:4173 | http://localhost:3001 |

### Health Check
Visit http://localhost:3001/health to verify the backend is running correctly.

## Detailed Setup Instructions

### Manual Setup (Alternative)

If you prefer to set up each part manually:

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Generate database migrations
npm run db:generate

# Run database migrations
npm run db:migrate

# Optional: Add sample data
npm run db:seed

# Start the development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Build to verify everything works
npm run build

# Start the development server
npm run dev
```

## Available Scripts

### Root Scripts (Recommended)

- `npm run setup` - Install all dependencies and setup database
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production
- `npm run start` - Start both frontend and backend in production mode
- `npm run test:build` - Test that both projects build successfully
- `npm run db:setup` - Generate and run database migrations
- `npm run db:seed` - Add sample data to database
- `npm run clean` - Remove all node_modules and build folders

### Individual Project Scripts

#### Backend (`/backend`)

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:seed` - Add sample data

#### Frontend (`/frontend`)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Entry Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/entries` | Get all entries with pagination | Yes |
| GET | `/api/entries/:id` | Get single entry | Yes |
| POST | `/api/entries` | Create new entry | Yes |
| PUT | `/api/entries/:id` | Update entry | Yes |
| DELETE | `/api/entries/:id` | Delete entry | Yes |

### File Upload
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload media files | Yes |

### System
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | Health check endpoint | No |

### Query Parameters
- **Pagination**: `?page=1&limit=20`
- **Search**: `?search=inception`
- **Filter**: `?type=movie&year=2010`

## Database Schema

The application uses a well-structured MySQL database with the following main tables:

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Entries Table
```sql
CREATE TABLE entries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  type ENUM('movie', 'tv_show') NOT NULL,
  director VARCHAR(255) NOT NULL,
  budget VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  year_time VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Indexes
- Primary keys on all tables
- Unique index on `users.email`
- Foreign key index on `entries.user_id`
- Composite index on `entries(user_id, created_at)` for efficient pagination

## Sample Data

Here's an example of the data structure:

```json
{
  "title": "Inception",
  "type": "Movie",
  "director": "Christopher Nolan",
  "budget": "$160M",
  "location": "LA, Paris, Tokyo",
  "duration": "148 min",
  "yearTime": "2010",
  "description": "A mind-bending thriller about dreams within dreams"
}
```

## Development Guidelines

- Follow the code style guidelines in `AGENTS.md`
- Use TypeScript with strict mode enabled
- Implement proper error handling and validation
- Follow RESTful API conventions
- Use functional components with React Hooks
- Maintain responsive design principles

## Production Deployment

This application is production-ready with optimized builds, security configurations, and deployment scripts.

### Deployment Platforms

#### Frontend Deployment (Vercel - Recommended)
```bash
# 1. Connect GitHub repository to Vercel
# 2. Configure build settings:
#    - Framework: Vite
#    - Root Directory: frontend
#    - Build Command: npm run build
#    - Output Directory: dist

# 3. Set environment variables:
VITE_API_BASE_URL=https://your-backend-url.com/api
```

#### Backend Deployment (Railway/Render - Recommended)
```bash
# 1. Connect GitHub repository
# 2. Set environment variables:
DATABASE_URL=mysql://user:pass@host:port/database
JWT_SECRET=your-super-secure-jwt-secret
NODE_ENV=production
PORT=3001

# 3. Configure build settings:
#    - Build Command: npm run build
#    - Start Command: npm start
```

### Docker Deployment

#### Using Docker Compose (Recommended)
```bash
# 1. Clone repository and navigate to backend
cd backend

# 2. Copy and configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f backend
```

#### Using Dockerfile only
```bash
# Build the image
docker build -t watchlist-backend .

# Run with environment file
docker run -d \
  --name watchlist-backend \
  --env-file .env \
  -p 3001:3001 \
  watchlist-backend
```

#### Environment Variables for Docker
The Docker setup automatically reads from a `.env` file in the backend directory. Key variables:

```env
# Database (automatically configured in docker-compose)
DATABASE_URL=mysql://watchlist_user:watchlist_password@db:3306/watchlist

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

#### Database Options
- **Production**: PlanetScale, AWS RDS, or Google Cloud SQL
- **Development**: Local MySQL or Docker container

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=mysql://username:password@localhost:3306/watchlist

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-frontend-domain.com

# File Upload (if using cloud storage)
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_NAME=WatchList
```

## Troubleshooting

### Common Issues & Solutions

#### Database Issues
| Problem | Solution |
|---------|----------|
| Connection refused | Ensure MySQL is running: `sudo systemctl start mysql` |
| Access denied | Check credentials in `backend/.env` |
| Database doesn't exist | Run: `mysql -u root -p -e "CREATE DATABASE watchlist;"` |
| Migration errors | Reset: `npm run db:generate && npm run db:migrate` |

#### Development Issues
| Problem | Solution |
|---------|----------|
| Port already in use | Kill process: `lsof -ti:3001 \| xargs kill -9` |
| CORS errors | Verify backend URL in frontend config |
| Build failures | Clear cache: `npm run clean && npm run setup` |
| TypeScript errors | Run: `npm run type-check` in respective directory |

#### Performance Issues
| Problem | Solution |
|---------|----------|
| Slow loading | Check database indexes and query optimization |
| Memory leaks | Monitor with `npm run dev` and check for unclosed connections |
| Large bundle size | Analyze with `npm run build` and check for unused imports |

### Debug Commands
```bash
# Check system health
npm run health

# Test database connection
npm run test:mysql

# Verify builds work
npm run test:build

# Check for TypeScript errors
cd frontend && npm run type-check
cd backend && npx tsc --noEmit
```

### Development Workflow
1. **Fork** the repository and create a feature branch
2. **Follow** the code style guidelines in `CODE.md`
3. **Add** proper TypeScript types for all new features
4. **Include** comprehensive error handling and validation
5. **Test** thoroughly with `npm run test:build`
6. **Document** any new features or API changes
7. **Submit** a pull request with a clear description

### Code Standards
- Use TypeScript with strict mode enabled
- Follow existing naming conventions and file structure
- Add JSDoc comments for complex functions
- Ensure all tests pass and builds succeed
- Maintain backwards compatibility when possible

### Security Features
- JWT-based authentication with secure token handling
- Input validation and sanitization on all endpoints
- CORS configuration for cross-origin security
- SQL injection prevention through parameterized queries
- File upload restrictions and validation

## License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 **Documentation**: Check this README and `COMMANDS.md`
- 🐛 **Bug Reports**: [Create an issue](https://github.com/d7omdev/watchlist/issues)
- 📧 **Email**: hello@d7om.dev



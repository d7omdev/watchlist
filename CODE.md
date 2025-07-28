# Development Guidelines & Standards

This document provides comprehensive development guidelines for the WatchList project. All contributors and AI agents should follow these standards to ensure code quality, consistency, and maintainability.

## Project Overview

**WatchList** is a simple web app to track movies and TV shows built with:
- **Frontend**: React 19 + TypeScript + Vite + TailwindCSS + Shadcn UI
- **Backend**: Node.js + Express + TypeScript + Drizzle ORM
- **Database**: MySQL 8.0+ with proper indexing and relationships
- **Authentication**: JWT-based with OpenAuth integration
- **File Handling**: Multer for uploads with validation

## Build & Development Commands

### Root Level Commands (Recommended)
```bash
# Development
npm run dev              # Start both frontend and backend
npm run build            # Build both projects for production
npm run start            # Start production servers
npm run test:build       # Verify builds work correctly

# Setup & Maintenance
npm run setup            # Complete project setup
npm run clean            # Clean all dependencies and builds
npm run health           # Check server status
```

### Frontend Commands (`cd frontend`)
```bash
npm run dev              # Development server (port 5173)
npm run build            # Production build
npm run preview          # Preview production build (port 4173)
npm run lint             # ESLint code quality check
npm run type-check       # TypeScript type checking
```

### Backend Commands (`cd backend`)
```bash
npm run dev              # Development server (port 3001)
npm run build            # Compile TypeScript
npm start                # Start production server
npm run db:generate      # Generate database migrations
npm run db:migrate       # Run database migrations
npm run db:studio        # Open Drizzle Studio GUI
npm run db:seed          # Add sample data
```

## Code Style Guidelines

### TypeScript Standards
- **Strict Mode**: Always use TypeScript with strict mode enabled
- **Type Definitions**: Define explicit types for all function parameters and return values
- **Interfaces**: Use interfaces for object shapes, types for unions/primitives
- **Generics**: Use generics for reusable components and functions
- **Null Safety**: Handle null/undefined cases explicitly

```typescript
// ✅ Good
interface UserProps {
  id: number;
  name: string;
  email: string | null;
}

const getUser = async (id: number): Promise<UserProps | null> => {
  // Implementation
};

// ❌ Bad
const getUser = async (id: any) => {
  // Implementation
};
```

### React Component Standards

#### Component Structure
```typescript
// ✅ Preferred structure
interface ComponentNameProps {
  prop1: string;
  prop2?: number;
  onAction: (data: ActionData) => void;
}

export const ComponentName = ({ prop1, prop2, onAction }: ComponentNameProps) => {
  // Hooks at the top
  const [state, setState] = useState<StateType>(initialState);

  // Event handlers
  const handleAction = useCallback((data: ActionData) => {
    onAction(data);
  }, [onAction]);

  // Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};
```

#### Component Guidelines
- **Functional Components Only**: No class components
- **React Hooks**: Use hooks for all state and side effects
- **Named Exports**: Prefer named exports over default exports
- **Props Interface**: Always define TypeScript interfaces for props
- **Prop Naming**: Use descriptive names ending in `Props`

### File Naming Conventions

```
components/
├── auth/
│   ├── login-form.tsx          # kebab-case for components
│   ├── register-form.tsx
│   └── index.ts                # barrel exports
├── ui/
│   ├── button.tsx
│   └── input.tsx
hooks/
├── use-entries.ts              # kebab-case with 'use-' prefix
└── use-auth.ts
lib/
├── api.ts                      # camelCase for utilities
├── utils.ts
└── validations.ts
types/
├── entry.ts                    # singular nouns
└── user.ts
```

### Import Organization

```typescript
// ✅ Correct import order
// 1. External libraries
import React, { useState, useCallback } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';

// 2. Internal modules (absolute paths)
import { api } from '@/lib/api';
import { EntryType } from '@/types/entry';

// 3. Relative imports
import './component.css';
```

## Backend Development Standards

### API Route Structure
```typescript
// ✅ RESTful API conventions
GET    /api/entries              # Get all entries (with pagination)
GET    /api/entries/:id          # Get single entry
POST   /api/entries              # Create new entry
PUT    /api/entries/:id          # Update entire entry
PATCH  /api/entries/:id          # Partial update
DELETE /api/entries/:id          # Delete entry

// Authentication routes
POST   /api/auth/register        # User registration
POST   /api/auth/login           # User login
GET    /api/auth/me              # Get current user
POST   /api/auth/logout          # User logout
```

### Error Handling Standards
```typescript
// ✅ Consistent error handling
try {
  const result = await someAsyncOperation();
  res.status(200).json({ success: true, data: result });
} catch (error) {
  console.error('Operation failed:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
}
```

### Database Guidelines
- **Drizzle ORM**: Use Drizzle for all database operations
- **Type Safety**: Leverage Drizzle's TypeScript integration
- **Migrations**: Always create migrations for schema changes
- **Indexing**: Add appropriate indexes for query performance
- **Relationships**: Define proper foreign key relationships

```typescript
// ✅ Proper Drizzle schema definition
export const entries = mysqlTable('entries', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  type: mysqlEnum('type', ['movie', 'tv_show']).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
}, (table) => ({
  userIdIdx: index('user_id_idx').on(table.userId),
  titleIdx: index('title_idx').on(table.title),
}));
```

## Frontend Development Standards

### State Management
- **Local State**: Use `useState` and `useReducer` for component-level state
- **Global State**: Use React Context for app-wide state
- **Server State**: Use custom hooks for API data management
- **Form State**: Use React Hook Form for all forms

```typescript
// ✅ Custom hook for API data
export const useEntries = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  return { entries, loading, error, fetchEntries };
};
```

### Form Handling Standards
```typescript
// ✅ React Hook Form with Zod validation
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['movie', 'tv_show']),
  director: z.string().min(1, 'Director is required'),
});

type FormData = z.infer<typeof formSchema>;

export const EntryForm = () => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      type: 'movie',
      director: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.createEntry(data);
      // Handle success
    } catch (error) {
      // Handle error
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### Styling Guidelines
- **TailwindCSS**: Use utility classes for all styling
- **Shadcn UI**: Use as base component library
- **Consistent Spacing**: Use 4, 8, 16, 24, 32px increments (space-1, space-2, etc.)
- **Responsive Design**: Mobile-first approach with responsive utilities
- **Dark Mode**: Support both light and dark themes

```typescript
// ✅ Proper Tailwind usage
<div className="flex flex-col gap-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
    Title
  </h2>
  <p className="text-sm text-gray-600 dark:text-gray-300">
    Description
  </p>
</div>
```

## Security Guidelines

### Authentication & Authorization
- **JWT Tokens**: Use secure JWT implementation with proper expiration
- **Password Hashing**: Use bcrypt with appropriate salt rounds
- **Input Validation**: Validate all inputs on both client and server
- **CORS Configuration**: Properly configure CORS for production

### Data Validation
```typescript
// ✅ Server-side validation with Zod
const createEntrySchema = z.object({
  title: z.string().min(1).max(255),
  type: z.enum(['movie', 'tv_show']),
  director: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
});

app.post('/api/entries', async (req, res) => {
  try {
    const validatedData = createEntrySchema.parse(req.body);
    // Process validated data
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    throw error;
  }
});
```

## Performance Guidelines

### Frontend Performance
- **Code Splitting**: Implement route-based code splitting
- **Lazy Loading**: Use React.lazy for non-critical components
- **Memoization**: Use React.memo, useMemo, and useCallback appropriately
- **Bundle Optimization**: Minimize bundle size with tree shaking

### Backend Performance
- **Database Queries**: Optimize queries with proper indexing
- **Pagination**: Implement cursor-based pagination for large datasets
- **Caching**: Use appropriate caching strategies
- **Connection Pooling**: Configure database connection pooling

## Testing Guidelines

### Frontend Testing
```typescript
// ✅ Component testing example
import { render, screen, fireEvent } from '@testing-library/react';
import { EntryForm } from './entry-form';

describe('EntryForm', () => {
  it('should submit form with valid data', async () => {
    render(<EntryForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Test Movie' }
    });

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Test Movie',
      // ... other fields
    });
  });
});
```

### Backend Testing
```typescript
// ✅ API endpoint testing
describe('POST /api/entries', () => {
  it('should create entry with valid data', async () => {
    const entryData = {
      title: 'Test Movie',
      type: 'movie',
      director: 'Test Director'
    };

    const response = await request(app)
      .post('/api/entries')
      .send(entryData)
      .expect(201);

    expect(response.body.data.title).toBe(entryData.title);
  });
});
```

## Git Workflow

### Commit Messages
```bash
# ✅ Good commit messages
feat: add user authentication with JWT
fix: resolve infinite scroll pagination bug
docs: update API documentation
refactor: extract common validation logic
test: add unit tests for entry service

# ❌ Bad commit messages
update stuff
fix bug
changes
```

### Branch Naming
```bash
# ✅ Good branch names
feature/user-authentication
fix/pagination-bug
docs/api-documentation
refactor/validation-logic

# ❌ Bad branch names
new-feature
bugfix
updates
```

## Production Readiness Checklist

### Before Deployment
- [ ] All TypeScript errors resolved
- [ ] ESLint warnings addressed
- [ ] Build process completes successfully
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Security headers configured
- [ ] CORS properly configured
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Performance optimizations applied

### Monitoring & Maintenance
- [ ] Health check endpoints implemented
- [ ] Error tracking configured
- [ ] Performance monitoring setup
- [ ] Database backup strategy
- [ ] SSL certificates configured
- [ ] CDN setup for static assets
- [ ] Rate limiting implemented
- [ ] Security scanning completed

## Common Patterns & Best Practices

### Error Boundaries
```typescript
// ✅ Error boundary implementation
export class ErrorBoundary extends Component<PropsWithChildren, { hasError: boolean }> {
  constructor(props: PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Custom Hooks Pattern
```typescript
// ✅ Reusable custom hook
export const useApi = <T>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get<T>(endpoint);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  return { data, loading, error, execute };
};
```

This document should be referenced for all development work on the WatchList project. Regular updates should be made as the project evolves and new patterns emerge.

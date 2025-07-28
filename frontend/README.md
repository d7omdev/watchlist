# WatchList Frontend

Modern React frontend for WatchList - a simple app to track your favorite movies and TV shows. Built with TypeScript, Vite, and TailwindCSS.

## Technology Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript with strict mode
- **Vite** - Fast build tool with HMR (Hot Module Replacement)
- **TailwindCSS v4** - Utility-first CSS framework
- **Shadcn UI** - Modern, accessible component library
- **React Hook Form** - Performant forms with easy validation
- **Zod** - TypeScript-first schema validation
- **Tanstack Table** - Powerful data tables with sorting, filtering, and pagination
- **Lucide React** - Beautiful, customizable icons

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── data-table/     # Table components with advanced features
│   ├── entries/        # Entry management components
│   ├── layout/         # Layout and navigation components
│   ├── profile/        # User profile components
│   └── ui/             # Base UI components (Shadcn)
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and configurations
├── types/              # TypeScript type definitions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Available Scripts

```bash
# Development
npm run dev             # Start development server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking
```

## Development Guidelines

### Component Architecture
- Use functional components with React Hooks
- Implement proper TypeScript interfaces for all props
- Follow the existing component structure and naming conventions
- Use Shadcn UI components as base building blocks

### State Management
- Use `useState` and `useReducer` for local component state
- Implement custom hooks for shared logic
- Use React Context for global state when needed
- Keep state as close to where it's used as possible

### Styling
- Use TailwindCSS utility classes for styling
- Follow the design system established by Shadcn UI
- Use consistent spacing (4, 8, 16px increments)
- Implement responsive design with mobile-first approach

### Form Handling
- Use React Hook Form for all forms
- Implement Zod schemas for validation
- Provide clear error messages and loading states
- Use controlled components for form inputs

## Environment Configuration

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=WatchList
```

## Build Configuration

The project uses Vite with the following optimizations:
- TypeScript compilation with strict mode
- ESLint integration for code quality
- TailwindCSS with PostCSS processing
- Automatic code splitting and tree shaking
- Development server with HMR

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Image and font optimization
- **Caching**: Efficient browser caching strategies
- **Bundle Analysis**: Built-in bundle size analysis

## Testing

```bash
# Run type checking
npm run type-check

# Lint code
npm run lint

# Build test
npm run build
```

## Deployment

The frontend is optimized for deployment on modern platforms:

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### Other Platforms
- **Netlify**: Works out of the box with `npm run build`
- **AWS S3 + CloudFront**: Upload `dist` folder contents
- **GitHub Pages**: Use GitHub Actions for automated deployment

## Contributing

When contributing to the frontend:

1. Follow the existing code structure and patterns
2. Use TypeScript with proper type definitions
3. Implement responsive design principles
4. Test components thoroughly
5. Run `npm run lint` and `npm run type-check` before committing
6. Update documentation for new features

## Common Issues

### Development Server Issues
- **Port in use**: Change port with `npm run dev -- --port 3000`
- **HMR not working**: Check firewall settings and browser extensions

### Build Issues
- **TypeScript errors**: Run `npm run type-check` to identify issues
- **Missing dependencies**: Run `npm install` to ensure all packages are installed
- **Environment variables**: Ensure all required `VITE_*` variables are set

### Styling Issues
- **TailwindCSS not working**: Check `tailwind.config.js` configuration
- **Components not styled**: Verify Shadcn UI components are properly imported

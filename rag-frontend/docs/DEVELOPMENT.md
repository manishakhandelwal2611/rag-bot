# Development Guide

This guide covers the development setup, coding standards, and best practices for the RAG Chat Bot application.

## Development Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**
- **VS Code** (recommended) with extensions:
  - ES7+ React/Redux/React-Native snippets
  - TypeScript Importer
  - Prettier - Code formatter
  - ESLint
  - Auto Rename Tag
  - Bracket Pair Colorizer

### Initial Setup

1. **Clone and Install:**
   ```bash
   git clone <repository-url>
   cd smart-chat
   npm install
   ```

2. **Environment Configuration:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. **Start Development Server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/           # React components
│   ├── Chat/            # Chat interface
│   │   ├── ChatComponents/
│   │   └── ChatHistory/
│   ├── Login/           # Authentication
│   ├── GlobalSnackbar/  # Global notifications
│   └── LoadingScreen/   # Loading states
├── modules/             # Redux modules
│   ├── auth/           # Authentication state
│   ├── chat/           # Chat messages
│   ├── threads/        # Thread management
│   └── global/         # Global app state
├── store/              # Redux store
├── api/                # API client
├── types/              # TypeScript types
├── utils/              # Utility functions
├── styles/             # Global styles
└── constants/          # App constants
```

## Coding Standards

### TypeScript Guidelines

1. **Type Definitions:**
   ```typescript
   // Always define interfaces for props
   interface ComponentProps {
     title: string;
     onAction: (id: string) => void;
     optional?: boolean;
   }
   
   // Use type unions for specific values
   type Status = 'loading' | 'success' | 'error';
   
   // Prefer interfaces over types for objects
   interface User {
     id: string;
     name: string;
   }
   ```

2. **Function Declarations:**
   ```typescript
   // Use arrow functions for components
   const MyComponent: React.FC<Props> = ({ title, onAction }) => {
     return <div>{title}</div>;
   };
   
   // Use regular functions for utilities
   function formatDate(date: Date): string {
     return date.toISOString();
   }
   ```

3. **Error Handling:**
   ```typescript
   // Always handle errors properly
   try {
     const result = await apiCall();
     return result;
   } catch (error) {
     console.error('API call failed:', error);
     throw new Error('Failed to fetch data');
   }
   ```

### React Best Practices

1. **Component Structure:**
   ```typescript
   import React, { useState, useEffect } from 'react';
   import { Box, Typography } from '@mui/material';
   import { useAppSelector, useAppDispatch } from '../store/hooks';
   import { createComponentStyles } from './Component.styles';
   
   interface ComponentProps {
     // Props definition
   }
   
   const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
     // Hooks
     const dispatch = useAppDispatch();
     const [state, setState] = useState('');
     
     // Effects
     useEffect(() => {
       // Effect logic
     }, []);
     
     // Event handlers
     const handleClick = () => {
       // Handler logic
     };
     
     // Render
     return (
       <Box>
         <Typography>{prop1}</Typography>
       </Box>
     );
   };
   
   export default Component;
   ```

2. **State Management:**
   ```typescript
   // Use Redux for global state
   const globalState = useAppSelector(state => state.global);
   
   // Use local state for component-specific data
   const [localState, setLocalState] = useState('');
   
   // Use useCallback for event handlers
   const handleAction = useCallback((id: string) => {
     dispatch(action(id));
   }, [dispatch]);
   ```

3. **Performance Optimization:**
   ```typescript
   // Memoize expensive calculations
   const expensiveValue = useMemo(() => {
     return heavyCalculation(data);
   }, [data]);
   
   // Memoize components
   const MemoizedComponent = React.memo(Component);
   
   // Use useCallback for functions passed as props
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

### Redux Patterns

1. **Action Creators:**
   ```typescript
   // Use createAction for simple actions
   export const setLoading = createAction<boolean>('feature/setLoading');
   
   // Use createAsyncThunk for async operations
   export const fetchData = createAsyncThunk(
     'feature/fetchData',
     async (params: FetchParams, { rejectWithValue, dispatch }) => {
       try {
         const response = await api.fetchData(params);
         return response.data;
       } catch (error) {
         dispatch(showErrorSnackbar(error, 'Feature Name'));
         return rejectWithValue(error.response?.data || error.message);
       }
     }
   );
   ```

2. **Reducers:**
   ```typescript
   export const featureReducer = createReducer(initialState, (builder) => {
     builder
       .addCase(setLoading, (state, action) => {
         state.isLoading = action.payload;
       })
       .addCase(fetchData.pending, (state) => {
         state.isLoading = true;
         state.error = null;
       })
       .addCase(fetchData.fulfilled, (state, action) => {
         state.isLoading = false;
         state.data = action.payload;
       })
       .addCase(fetchData.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload as string;
       });
   });
   ```

### Styling Guidelines

1. **Material-UI Styling:**
   ```typescript
   // Use sx prop for simple styles
   <Box sx={{ display: 'flex', gap: 2 }}>
   
   // Use style functions for complex styles
   const createStyles = (theme: Theme) => ({
     container: {
       display: 'flex',
       flexDirection: 'column',
       gap: theme.spacing(2),
       [theme.breakpoints.down('md')]: {
         flexDirection: 'row',
       },
     },
   });
   ```

2. **Responsive Design:**
   ```typescript
   // Use theme breakpoints
   const isMobile = useMediaQuery(theme.breakpoints.down('md'));
   
   // Responsive styles
   const styles = {
     container: {
       width: { xs: '100%', md: '50%' },
       padding: { xs: 1, md: 2 },
     },
   };
   ```

## Development Workflow

### Git Workflow

1. **Branch Naming:**
   ```bash
   feature/add-message-search
   bugfix/fix-typing-indicator
   hotfix/security-patch
   ```

2. **Commit Messages:**
   ```bash
   feat: add message search functionality
   fix: resolve typing indicator animation issue
   docs: update API documentation
   style: format code with prettier
   refactor: extract common utility functions
   test: add unit tests for chat components
   ```

3. **Pull Request Process:**
   - Create feature branch from main
   - Implement changes with tests
   - Update documentation if needed
   - Create pull request with description
   - Request code review
   - Merge after approval

### Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] Performance optimizations are applied
- [ ] Tests are included for new features
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Code is properly formatted
- [ ] No unused imports or variables

## Testing

### Unit Testing

1. **Component Testing:**
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Provider } from 'react-redux';
   import { store } from '../store';
   import Component from './Component';
   
   const renderWithProviders = (component: React.ReactElement) => {
     return render(
       <Provider store={store}>
         {component}
       </Provider>
     );
   };
   
   describe('Component', () => {
     it('renders correctly', () => {
       renderWithProviders(<Component title="Test" />);
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
     
     it('handles user interaction', () => {
       const mockHandler = jest.fn();
       renderWithProviders(<Component onAction={mockHandler} />);
       
       fireEvent.click(screen.getByRole('button'));
       expect(mockHandler).toHaveBeenCalled();
     });
   });
   ```

2. **Redux Testing:**
   ```typescript
   import { configureStore } from '@reduxjs/toolkit';
   import { featureReducer, fetchData } from './featureSlice';
   
   describe('feature reducer', () => {
     it('handles fetchData.pending', () => {
       const action = fetchData.pending('requestId', {});
       const state = featureReducer(initialState, action);
       
       expect(state.isLoading).toBe(true);
       expect(state.error).toBeNull();
     });
   });
   ```

### Integration Testing

1. **API Testing:**
   ```typescript
   import { rest } from 'msw';
   import { setupServer } from 'msw/node';
   import { renderWithProviders } from '../test-utils';
   
   const server = setupServer(
     rest.get('/api/data', (req, res, ctx) => {
       return res(ctx.json({ data: 'test' }));
     })
   );
   
   beforeAll(() => server.listen());
   afterEach(() => server.resetHandlers());
   afterAll(() => server.close());
   ```

### E2E Testing

1. **Playwright Setup:**
   ```typescript
   import { test, expect } from '@playwright/test';
   
   test('user can send a message', async ({ page }) => {
     await page.goto('/');
     await page.fill('[data-testid="message-input"]', 'Hello');
     await page.click('[data-testid="send-button"]');
     await expect(page.locator('[data-testid="message"]')).toContainText('Hello');
   });
   ```

## Debugging

### Development Tools

1. **React Developer Tools:**
   - Install browser extension
   - Inspect component props and state
   - Profile performance

2. **Redux DevTools:**
   - Install browser extension
   - Time-travel debugging
   - Action replay

3. **VS Code Debugging:**
   ```json
   // .vscode/launch.json
   {
     "version": "0.2.0",
     "configurations": [
       {
         "name": "Launch Chrome",
         "type": "chrome",
         "request": "launch",
         "url": "http://localhost:5173",
         "webRoot": "${workspaceFolder}/src"
       }
     ]
   }
   ```

### Common Debugging Techniques

1. **Console Debugging:**
   ```typescript
   // Use debugger statement
   const handleClick = () => {
     debugger; // Execution will pause here
     // Debug logic
   };
   
   // Use console methods
   console.log('Debug info:', data);
   console.table(arrayData);
   console.group('Grouped logs');
   ```

2. **Error Boundaries:**
   ```typescript
   class ErrorBoundary extends React.Component {
     constructor(props) {
       super(props);
       this.state = { hasError: false };
     }
     
     static getDerivedStateFromError(error) {
       return { hasError: true };
     }
     
     componentDidCatch(error, errorInfo) {
       console.error('Error caught:', error, errorInfo);
     }
     
     render() {
       if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
       }
       return this.props.children;
     }
   }
   ```

## Performance Optimization

### Bundle Analysis

1. **Analyze Bundle Size:**
   ```bash
   npm run build -- --analyze
   ```

2. **Code Splitting:**
   ```typescript
   // Lazy load components
   const Chat = lazy(() => import('./components/Chat'));
   const Login = lazy(() => import('./components/Login'));
   
   // Use Suspense
   <Suspense fallback={<LoadingScreen />}>
     <Chat />
   </Suspense>
   ```

### Performance Monitoring

1. **Web Vitals:**
   ```typescript
   import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
   
   getCLS(console.log);
   getFID(console.log);
   getFCP(console.log);
   getLCP(console.log);
   getTTFB(console.log);
   ```

2. **Performance Profiling:**
   ```typescript
   // Use React Profiler
   <Profiler id="ChatComponent" onRender={onRenderCallback}>
     <Chat />
   </Profiler>
   ```

## Code Quality

### Linting and Formatting

1. **ESLint Configuration:**
   ```json
   {
     "extends": [
       "eslint:recommended",
       "@typescript-eslint/recommended",
       "plugin:react/recommended",
       "plugin:react-hooks/recommended"
     ],
     "rules": {
       "no-console": "warn",
       "no-unused-vars": "error",
       "react/prop-types": "off"
     }
   }
   ```

2. **Prettier Configuration:**
   ```json
   {
     "semi": true,
     "trailingComma": "es5",
     "singleQuote": true,
     "printWidth": 80,
     "tabWidth": 2
   }
   ```

### Pre-commit Hooks

1. **Husky Setup:**
   ```bash
   npm install --save-dev husky lint-staged
   npx husky install
   npx husky add .husky/pre-commit "npx lint-staged"
   ```

2. **Lint-staged Configuration:**
   ```json
   {
     "lint-staged": {
       "*.{ts,tsx}": [
         "eslint --fix",
         "prettier --write"
       ],
       "*.{json,md}": [
         "prettier --write"
       ]
     }
   }
   ```

## Documentation

### Code Documentation

1. **JSDoc Comments:**
   ```typescript
   /**
    * Formats a timestamp for display in the chat interface
    * @param timestamp - The timestamp to format (Date or ISO string)
    * @param options - Formatting options
    * @returns Formatted timestamp string
    */
   export const formatTimestamp = (
     timestamp: Date | string,
     options: FormatOptions = {}
   ): string => {
     // Implementation
   };
   ```

2. **Component Documentation:**
   ```typescript
   /**
    * ChatHeader component displays the chat interface header
    * with bot information and status
    * 
    * @example
    * <ChatHeader />
    */
   const ChatHeader: React.FC = () => {
     // Component implementation
   };
   ```

### README Updates

- Update README.md for new features
- Document breaking changes
- Include usage examples
- Update installation instructions

## Troubleshooting

### Common Issues

1. **Build Errors:**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   
   # Check TypeScript errors
   npm run type-check
   ```

2. **Runtime Errors:**
   - Check browser console
   - Verify environment variables
   - Check API connectivity
   - Validate Redux state

3. **Performance Issues:**
   - Use React DevTools Profiler
   - Check bundle size
   - Optimize re-renders
   - Implement code splitting

### Getting Help

1. **Internal Resources:**
   - Check existing documentation
   - Review similar implementations
   - Ask team members

2. **External Resources:**
   - React documentation
   - TypeScript handbook
   - Material-UI documentation
   - Redux Toolkit documentation

This development guide ensures consistent, high-quality code development across the team.

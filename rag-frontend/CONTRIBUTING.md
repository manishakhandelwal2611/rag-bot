# Contributing to RAG Chat Bot

Thank you for your interest in contributing to the RAG Chat Bot project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Issue Reporting](#issue-reporting)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We pledge to:

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on what's best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- Node.js (v18 or higher)
- npm or yarn
- Git
- A code editor (VS Code recommended)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/rag-chat-bot.git
   cd rag-chat-bot
   ```

3. Add the upstream repository:
   ```bash
   git remote add upstream https://github.com/originalowner/rag-chat-bot.git
   ```

## Development Setup

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### VS Code Setup

Install the recommended extensions:

```bash
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-eslint
```

## Contributing Guidelines

### Types of Contributions

We welcome several types of contributions:

- **Bug fixes** - Fix issues and improve stability
- **New features** - Add new functionality
- **Documentation** - Improve or add documentation
- **Testing** - Add or improve tests
- **Performance** - Optimize code and improve performance
- **UI/UX** - Improve user interface and experience

### Before You Start

1. **Check existing issues** - Look for existing issues or discussions
2. **Create an issue** - For significant changes, create an issue first
3. **Discuss changes** - Get feedback before implementing large changes
4. **Check the roadmap** - See what's planned for future releases

## Pull Request Process

### Creating a Pull Request

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes:**
   - Write clean, well-documented code
   - Add tests for new functionality
   - Update documentation as needed

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

4. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request:**
   - Use the PR template
   - Provide a clear description
   - Link related issues
   - Request reviews from maintainers

### Pull Request Guidelines

- **One feature per PR** - Keep changes focused and atomic
- **Write clear descriptions** - Explain what and why
- **Include tests** - Add tests for new functionality
- **Update documentation** - Keep docs in sync with code
- **Follow naming conventions** - Use consistent naming
- **Keep PRs small** - Easier to review and merge

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**
```
feat(chat): add message search functionality
fix(auth): resolve login redirect issue
docs(api): update endpoint documentation
test(components): add unit tests for MessageBubble
```

## Coding Standards

### TypeScript Guidelines

1. **Use TypeScript strictly:**
   ```typescript
   // Good
   interface UserProps {
     name: string;
     age: number;
   }
   
   // Avoid
   const user: any = { name: "John" };
   ```

2. **Define interfaces for props:**
   ```typescript
   interface ComponentProps {
     title: string;
     onAction: (id: string) => void;
     optional?: boolean;
   }
   ```

3. **Use proper error handling:**
   ```typescript
   try {
     const result = await apiCall();
     return result;
   } catch (error) {
     console.error('API call failed:', error);
     throw new Error('Failed to fetch data');
   }
   ```

### React Best Practices

1. **Use functional components:**
   ```typescript
   const MyComponent: React.FC<Props> = ({ title, onAction }) => {
     return <div>{title}</div>;
   };
   ```

2. **Use hooks properly:**
   ```typescript
   const [state, setState] = useState('');
   const dispatch = useAppDispatch();
   
   useEffect(() => {
     // Effect logic
   }, [dependencies]);
   ```

3. **Optimize performance:**
   ```typescript
   const MemoizedComponent = React.memo(Component);
   const handleClick = useCallback(() => {
     // Handler logic
   }, [dependencies]);
   ```

### Code Style

1. **Use Prettier for formatting:**
   ```bash
   npm run format
   ```

2. **Follow ESLint rules:**
   ```bash
   npm run lint
   ```

3. **Use meaningful variable names:**
   ```typescript
   // Good
   const userMessageCount = messages.filter(m => m.isUser).length;
   
   // Avoid
   const cnt = msgs.filter(m => m.u).length;
   ```

## Testing

### Writing Tests

1. **Component Tests:**
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { Provider } from 'react-redux';
   import { store } from '../store';
   import Component from './Component';
   
   describe('Component', () => {
     it('renders correctly', () => {
       render(
         <Provider store={store}>
           <Component title="Test" />
         </Provider>
       );
       expect(screen.getByText('Test')).toBeInTheDocument();
     });
   });
   ```

2. **Redux Tests:**
   ```typescript
   import { configureStore } from '@reduxjs/toolkit';
   import { featureReducer, fetchData } from './featureSlice';
   
   describe('feature reducer', () => {
     it('handles fetchData.pending', () => {
       const action = fetchData.pending('requestId', {});
       const state = featureReducer(initialState, action);
       expect(state.isLoading).toBe(true);
     });
   });
   ```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Documentation

### Code Documentation

1. **Use JSDoc for functions:**
   ```typescript
   /**
    * Formats a timestamp for display
    * @param timestamp - The timestamp to format
    * @param options - Formatting options
    * @returns Formatted timestamp string
    */
   export const formatTimestamp = (timestamp: Date, options: FormatOptions): string => {
     // Implementation
   };
   ```

2. **Document components:**
   ```typescript
   /**
    * MessageBubble component displays individual chat messages
    * @param props - Component props
    * @returns JSX element
    */
   const MessageBubble: React.FC<Props> = ({ message, onCopy }) => {
     // Implementation
   };
   ```

### Updating Documentation

- Update README.md for new features
- Add API documentation for new endpoints
- Update component documentation
- Include usage examples

## Issue Reporting

### Bug Reports

When reporting bugs, include:

1. **Clear description** - What happened vs. what you expected
2. **Steps to reproduce** - Detailed steps to recreate the issue
3. **Environment info** - Browser, OS, Node.js version
4. **Screenshots** - If applicable
5. **Error messages** - Full error messages and stack traces

### Feature Requests

When requesting features, include:

1. **Problem description** - What problem does this solve?
2. **Proposed solution** - How should it work?
3. **Alternatives considered** - What other options were considered?
4. **Additional context** - Any other relevant information

### Issue Template

```markdown
## Description
Brief description of the issue or feature request.

## Steps to Reproduce (for bugs)
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What you expected to happen.

## Actual Behavior
What actually happened.

## Environment
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 91, Firefox 89]
- Node.js version: [e.g., 18.0.0]

## Additional Context
Any other relevant information.
```

## Release Process

### Version Numbering

We use semantic versioning (SemVer):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

### Release Checklist

- [ ] All tests pass
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] Version number is bumped
- [ ] Release notes are written
- [ ] Tag is created
- [ ] Release is published

## Getting Help

### Community Support

- **GitHub Discussions** - For questions and general discussion
- **GitHub Issues** - For bug reports and feature requests
- **Discord** - For real-time chat (if available)

### Maintainer Contact

For sensitive issues or security concerns, contact the maintainers directly.

## Recognition

Contributors will be recognized in:

- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to RAG Chat Bot! 🎉

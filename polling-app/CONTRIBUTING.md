# Contributing to PollApp

Thank you for your interest in contributing to PollApp! We welcome contributions from the community and are pleased to have you join us.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Bug Reports](#bug-reports)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

### Our Standards

- Be respectful and inclusive
- Exercise empathy and kindness
- Focus on what is best for the community
- Show courtesy and respect towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17+ or 20.3+
- pnpm (recommended) or npm
- Git
- A code editor (VS Code recommended)

### Setting Up Development Environment

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/polling-app.git
   cd polling-app
   ```

2. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/polling-app.git
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

## 🔄 Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes

### Working on Features

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code following our coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   pnpm lint
   pnpm type-check
   pnpm test # when available
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

## 🔍 Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (when available)
- [ ] Documentation is updated
- [ ] Changes are tested locally
- [ ] Commit messages follow our guidelines

### PR Template

When creating a PR, please include:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] I have added tests for new functionality

## Screenshots (if applicable)
Include screenshots for UI changes

## Additional Notes
Any additional information or context
```

### Review Process

1. PRs require at least one approval from maintainers
2. All automated checks must pass
3. Address any feedback promptly
4. Keep PRs focused and reasonably sized

## 🎨 Coding Standards

### TypeScript Guidelines

- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type unless absolutely necessary
- Use meaningful variable and function names

```typescript
// Good
interface PollData {
  title: string;
  options: string[];
  expiresAt?: Date;
}

// Bad
interface Data {
  title: any;
  opts: any;
}
```

### React Component Guidelines

- Use functional components with hooks
- Implement proper error boundaries
- Follow the component structure pattern

```typescript
// Component structure
interface ComponentProps {
  // Define props
}

export function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX
  );
}
```

### File Organization

```
components/
├── feature/           # Feature-specific components
│   ├── component.tsx
│   └── index.ts
├── ui/               # Reusable UI components
└── layout/           # Layout components
```

### Styling Guidelines

- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Use semantic class names
- Avoid inline styles

```tsx
// Good
<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">

// Bad
<div style={{ display: 'flex', gap: '16px' }}>
```

## 📝 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

### Examples

```bash
feat(auth): add password reset functionality
fix(polls): resolve vote counting issue
docs(readme): update installation instructions
style(components): improve button spacing
refactor(api): simplify poll creation logic
test(auth): add login form tests
chore(deps): update dependencies
```

## 🐛 Bug Reports

When reporting bugs, please include:

### Bug Report Template

```markdown
## Bug Description
A clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 96]
- Node.js version: [e.g., 18.17.0]

## Screenshots
If applicable, add screenshots

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

We welcome feature requests! Please provide:

### Feature Request Template

```markdown
## Feature Description
A clear description of the feature

## Problem Statement
What problem does this solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other solutions you've considered

## Additional Context
Any other relevant information
```

## 🧪 Testing Guidelines

### Testing Strategy

- Write unit tests for utility functions
- Write integration tests for API endpoints
- Write component tests for React components
- Write E2E tests for critical user flows

### Testing Tools

- Jest for unit testing
- React Testing Library for component testing
- Cypress for E2E testing

### Writing Tests

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import { PollCard } from './poll-card'

describe('PollCard', () => {
  it('renders poll title', () => {
    const mockPoll = {
      title: 'Test Poll',
      // ... other props
    }
    
    render(<PollCard poll={mockPoll} />)
    
    expect(screen.getByText('Test Poll')).toBeInTheDocument()
  })
})
```

## 📚 Documentation

### Documentation Standards

- Keep documentation up to date
- Write clear, concise explanations
- Include code examples
- Use proper markdown formatting

### Types of Documentation

- **README.md** - Project overview and setup
- **API.md** - API documentation
- **CONTRIBUTING.md** - This file
- **Code comments** - Inline documentation

## 🚀 Release Process

### Versioning

We use [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Major: Breaking changes
- Minor: New features
- Patch: Bug fixes

### Release Workflow

1. Update version in `package.json`
2. Update CHANGELOG.md
3. Create release PR
4. Tag release after merge
5. Deploy to production

## 🤝 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat (if available)

### Getting Help

1. Check existing issues and documentation
2. Search previous discussions
3. Create a new issue with detailed information
4. Be patient and respectful

## 🎯 Roadmap

Check our [project roadmap](https://github.com/username/polling-app/projects) to see:
- Planned features
- Current priorities
- How you can contribute

---

Thank you for contributing to PollApp! Your efforts help make this project better for everyone. 🙏

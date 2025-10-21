# Contributing to LVECDE

Thank you for your interest in contributing to LVECDE! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Areas for Contribution](#areas-for-contribution)
- [Communication](#communication)

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Focus on what is best for the community
- Show empathy towards others
- Be patient and understanding

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn 1.22+
- Basic knowledge of React Native and TypeScript
- Familiarity with Git and GitHub

### Setup Your Development Environment

1. **Fork the repository**
   ```bash
   # Fork via GitHub UI, then:
   git clone https://github.com/YOUR_USERNAME/LVECDE.git
   cd LVECDE
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your local AI configuration
   ```

4. **Run the development server**
   ```bash
   yarn start
   ```

5. **Verify setup**
   ```bash
   yarn typecheck
   ```

## Development Process

### 1. Choose an Issue

- Browse [open issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
- Look for `good first issue` or `help wanted` labels
- Comment on the issue to express interest
- Wait for maintainer response before starting work

### 2. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions or fixes

### 3. Make Your Changes

- Write clean, readable code
- Follow the coding standards (see below)
- Add or update tests as needed
- Update documentation if needed
- Run `yarn typecheck` frequently

### 4. Commit Your Changes

Use clear, descriptive commit messages:

```bash
git commit -m "feat: add Ollama provider implementation"
git commit -m "fix: resolve connection timeout issue"
git commit -m "docs: update Local AI setup guide"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build process or auxiliary tool changes

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request via GitHub UI.

## Coding Standards

### TypeScript

- **Strict Mode**: All code must pass `yarn typecheck`
- **Types**: Use explicit types, avoid `any`
- **Interfaces**: Prefer interfaces for object shapes
- **Documentation**: Add JSDoc comments for public APIs

Example:
```typescript
/**
 * Sends a chat message to the local AI provider
 * @param message - The user's message
 * @param options - Optional chat configuration
 * @returns Promise resolving to the AI response
 */
async function chat(message: string, options?: ChatOptions): Promise<ChatResponse> {
    // Implementation
}
```

### React Components

- **Functional Components**: Use functional components with hooks
- **Memo**: Wrap components with `React.memo` when appropriate
- **Hooks**: Follow React hooks rules
- **Unistyles**: Use Unistyles for styling (see CLAUDE.md)

Example:
```typescript
import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';

const styles = StyleSheet.create((theme) => ({
    container: {
        padding: theme.margins.md,
        backgroundColor: theme.colors.background,
    },
}));

export const MyComponent = memo(() => {
    return (
        <View style={styles.container}>
            <Text>Hello LVECDE</Text>
        </View>
    );
});
```

### File Organization

- **4 spaces** for indentation (not tabs)
- **No trailing whitespace**
- **Unix line endings** (LF)
- **File encoding**: UTF-8

### Naming Conventions

- **Files**: PascalCase for components (`MyComponent.tsx`), camelCase for utilities (`myUtil.ts`)
- **Variables**: camelCase (`myVariable`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`)
- **Interfaces/Types**: PascalCase (`MyInterface`, `MyType`)
- **Functions**: camelCase (`myFunction`)

### Code Style

```typescript
// ✅ Good
function processMessage(message: string): string {
    if (!message) {
        return '';
    }
    
    return message.trim().toLowerCase();
}

// ❌ Bad
function processMessage(message:string):string{
    if(!message){return ''}
    return message.trim().toLowerCase()
}
```

## Testing

### Running Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run with coverage
yarn test --coverage
```

### Writing Tests

- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test provider integrations
- **E2E Tests**: Test complete user workflows

Example test:
```typescript
import { validateLocalAIConfig } from '@/localai/config';

describe('validateLocalAIConfig', () => {
    it('should validate correct Ollama config', () => {
        const config = {
            provider: 'ollama' as const,
            ollama: {
                url: 'http://localhost:11434',
                model: 'codellama:13b',
            },
        };
        
        const result = validateLocalAIConfig(config);
        expect(result.valid).toBe(true);
        expect(result.errors).toHaveLength(0);
    });
    
    it('should reject config with missing URL', () => {
        const config = {
            provider: 'ollama' as const,
            ollama: {
                url: '',
                model: 'codellama:13b',
            },
        };
        
        const result = validateLocalAIConfig(config);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Ollama URL is required');
    });
});
```

## Pull Request Process

### Before Submitting

- [ ] Code passes `yarn typecheck`
- [ ] Tests pass (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with `main`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (specify)

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
- [ ] All tests pass
```

### Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, PR will be merged
4. Celebrate! 🎉

## Areas for Contribution

### High Priority

1. **Local AI Provider Implementation**
   - Ollama provider adapter
   - LM Studio provider adapter
   - LocalAI provider adapter
   - Provider testing

2. **UI Components**
   - Local AI settings screen
   - Connection status indicators
   - Model selection interface
   - Configuration wizard

3. **Testing**
   - Unit tests for config system
   - Integration tests for providers
   - E2E tests for workflows

4. **Documentation**
   - Tutorial videos
   - Provider-specific guides
   - Troubleshooting tips
   - Translation improvements

### Good First Issues

- Documentation improvements
- UI text refinements
- Bug fixes
- Adding code comments
- Writing tests
- Translating to new languages

### Translations

We welcome translations! To add a new language:

1. Check supported languages in `sources/text/_all.ts`
2. Create new file: `sources/text/translations/[code].ts`
3. Copy structure from `sources/text/_default.ts`
4. Translate all strings
5. Add language to `sources/text/index.ts`
6. Update `SUPPORTED_LANGUAGES` in `sources/text/_all.ts`
7. Test with your language selection

### Documentation

Documentation improvements are always welcome:
- Fix typos or unclear explanations
- Add examples
- Improve formatting
- Add diagrams
- Write tutorials

## Communication

### Where to Ask Questions

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Pull Request Comments**: Questions about specific code

### Getting Help

If you're stuck:
1. Check the documentation
2. Search existing issues
3. Ask in GitHub Discussions
4. Be patient and respectful

## Recognition

Contributors will be:
- Listed in release notes
- Credited in documentation
- Thanked publicly
- Invited to future discussions

## License

By contributing to LVECDE, you agree that your contributions will be licensed under the MIT License.

## Thank You!

Your contributions make LVECDE better for everyone. We appreciate your time and effort! 🙏

---

**Questions?** Open an issue or start a discussion on GitHub.

**Need help?** Check the [docs](docs/) or ask the community.

**Found a bug?** Please report it! We want to fix it.

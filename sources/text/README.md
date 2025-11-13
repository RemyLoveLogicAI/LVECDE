# Happy i18n (Object-Based Implementation)

A type-safe internationalization system using an object-based approach with functions and constants, accessed via the familiar `t('key', params)` API format.

## Overview

This implementation uses **no external libraries** and provides:
- **Full TypeScript type safety** with IntelliSense support
- **Object parameters** with strict typing: `t('welcome', { name: 'Steve' })`
- **Mixed value types**: String constants and functions in the same object
- **Smart pluralization** and complex logic built into translation functions
- **Compile-time validation** of keys and parameter shapes

## Architecture

### Translation Values
Translation values can be either:
1. **String constants**: `'Cancel'` for static text
2. **Functions**: `({ name }: { name: string }) => \`Welcome, ${name}!\`` for dynamic text

### Type Safety
- **Keys are validated**: Only existing keys can be used
- **Parameters are enforced**: Required/optional parameters are type-checked
- **Object shapes are validated**: Parameter objects must match expected structure
- **Return types are guaranteed**: Always returns a string

## Usage Examples

### Basic Usage

```typescript
import { t } from '@/text';

// ✅ Simple constants (no parameters)
t('common.cancel')              // "Cancel"
t('settings.title')             // "Settings"
t('session.connected')          // "Connected"

// ✅ Functions with required object parameters
t('common.welcome', { name: 'Steve' })           // "Welcome, Steve!"
t('common.itemCount', { count: 5 })              // "5 items"
t('time.minutesAgo', { count: 1 })               // "1 minute ago"

// ✅ Multiple parameters
t('errors.fieldError', { field: 'Email', reason: 'Invalid format' })
t('auth.loginAttempt', { attempt: 2, maxAttempts: 3 })

// ✅ Optional parameters
t('time.at', { time: '3:00 PM' })                // "3:00 PM"
t('time.at', { time: '3:00 PM', date: 'Monday' }) // "3:00 PM on Monday"
```

### Advanced Usage

```typescript
// Complex logic with multiple parameters
t('session.summary', { files: 3, messages: 10, duration: 5 })
// → "3 files, 10 messages in 5 minutes"

// Smart file size formatting
t('files.fileSize', { bytes: 1536 })  // "2 KB"
t('files.fileSize', { bytes: 500 })   // "500 B"

// Git status with conditional logic
t('git.branchStatus', { branch: 'main', ahead: 2, behind: 0 })
// → "On branch main, 2 commits ahead"

// Strict enum-like typing
t('common.greeting', { name: 'Steve', time: 'morning' })  // time must be 'morning' | 'afternoon' | 'evening'
```

### Type Safety Examples

```typescript
// ❌ These will cause TypeScript errors:
t('common.cancel', { extra: 'param' })   // Error: Expected 0 arguments
t('common.welcome')                      // Error: Missing required parameter
t('common.welcome', { wrongKey: 'x' })   // Error: Object must have 'name' property
t('common.welcome', { name: 123 })       // Error: 'name' must be string
t('invalid.key')                         // Error: Key doesn't exist
```

## Files Structure

### `_default.ts`
Contains the main translation object with mixed string/function values:

```typescript
export const en = {
    common: {
        cancel: 'Cancel',                    // String constant
        welcome: ({ name }: { name: string }) => `Welcome, ${name}!`,  // Function
        itemCount: ({ count }: { count: number }) =>  // Smart pluralization
            count === 1 ? '1 item' : `${count} items`,
    },
    // ... more categories
} as const;
```

### `index.ts`
Main module with the `t` function and utilities:
- `t()` - Main translation function with strict typing
- `hasTranslation()` - Check if a key exists
- `getAllTranslationKeys()` - Get all available keys (development)
- `getTranslationValue()` - Get raw value (debugging)

## Key Benefits

### 1. **Familiar API**
Uses the standard `t('key', params)` format that developers expect.

### 2. **Maximum Type Safety**
```typescript
// TypeScript knows exactly what parameters each key needs
type WelcomeParams = TranslationParams<'common.welcome'>;  // { name: string }
type CancelParams = TranslationParams<'common.cancel'>;    // void
```

### 3. **Object Parameters**
Clean, self-documenting parameter syntax:
```typescript
// Instead of positional: t('greeting', 'Steve', 'morning')
// Use named objects: t('greeting', { name: 'Steve', time: 'morning' })
```

### 4. **Logic in Translations**
Complex formatting and pluralization logic lives with the text:
```typescript
fileSize: ({ bytes }: { bytes: number }) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${Math.round(bytes / (1024 * 1024))} MB`;
}
```

### 5. **Performance**
- No string interpolation parsing
- Direct function calls
- Tree-shakeable (unused translations can be eliminated)
- No external dependencies

### 6. **Developer Experience**
- Full IntelliSense support
- Compile-time error catching
- Self-documenting parameter names
- Easy debugging with utility functions

## Migration Guide

If migrating from an interpolation-based system:

```typescript
// Old: String interpolation
t('welcome', { name: 'Steve' })  // Parsed "{name}" at runtime

// New: Same API, but with functions
t('welcome', { name: 'Steve' })  // Direct function call, same result
```

The API stays the same, but you get:
- Better performance (no parsing)
- Stronger typing (object shape validation)  
- More flexibility (complex logic in functions)

## Adding New Translations

1. **Add to `_default.ts`**:
```typescript
// String constant
newConstant: 'My New Text',

// Function with parameters
newFunction: ({ user, count }: { user: string; count: number }) =>
    `Hello ${user}, you have ${count} items`,
```

2. **TypeScript automatically updates** - the new keys become available with full type checking.

3. **Use immediately**:
```typescript
t('category.newConstant')                        // "My New Text"
t('category.newFunction', { user: 'Steve', count: 5 })  // "Hello Steve, you have 5 items"
```

## Best Practices

### Parameter Design
```typescript
// ✅ Good: Use descriptive parameter names
messageFrom: ({ sender }: { sender: string }) => `Message from ${sender}`,

// ✅ Good: Use optional parameters when appropriate
at: ({ time, date }: { time: string; date?: string }) =>
    date ? `${time} on ${date}` : time,

// ✅ Good: Use union types for strict validation
greeting: ({ name, time }: { name: string; time: 'morning' | 'afternoon' | 'evening' }) =>
    `Good ${time}, ${name}!`,
```

### Complex Logic
```typescript
// ✅ Good: Put complex logic in the translation function
statusMessage: ({ files, online, syncing }: {
    files: number;
    online: boolean;
    syncing: boolean;
}) => {
    if (!online) return 'Offline';
    if (syncing) return 'Syncing...';
    return files === 0 ? 'No files' : `${files} files ready`;
}
```

## Future Expansion

To add more languages:
1. Create new translation files (e.g., `_spanish.ts`)
2. Update types to include new locales
3. Add locale switching logic
4. All existing type safety is preserved

This implementation provides a solid foundation that can scale while maintaining perfect type safety and developer experience.

## Local AI Integration Examples

When integrating with Local AI models, use translations to provide clear feedback:

### AI Provider Status Messages

```typescript
// Translation definitions
export const en = {
    ai: {
        // Provider status
        providerConnecting: ({ provider }: { provider: string }) => 
            `Connecting to ${provider}...`,
        providerConnected: ({ provider }: { provider: string }) => 
            `Connected to ${provider}`,
        providerDisconnected: ({ provider }: { provider: string }) => 
            `Disconnected from ${provider}`,
        providerError: ({ provider, error }: { provider: string; error: string }) => 
            `Error connecting to ${provider}: ${error}`,
        
        // Model selection
        modelLoading: ({ model }: { model: string }) => 
            `Loading model: ${model}`,
        modelLoaded: ({ model }: { model: string }) => 
            `Model ${model} is ready`,
        modelNotFound: ({ model }: { model: string }) => 
            `Model ${model} not found. Please download it first.`,
        
        // Local AI specific
        localAIOffline: 'Local AI service is not running',
        localAIConfiguring: 'Configuring Local AI connection...',
        localAIReady: 'Local AI is ready to use',
        
        // Performance indicators
        responseTime: ({ ms }: { ms: number }) => 
            ms < 1000 ? 'Fast response' : `Response in ${Math.round(ms / 1000)}s`,
        tokensPerSecond: ({ tps }: { tps: number }) => 
            `${tps.toFixed(1)} tokens/sec`,
    }
} as const;

// Usage in components
import { t } from '@/text';

function LocalAIStatus({ provider, connected, model }: Props) {
    return (
        <View>
            <Text>
                {connected 
                    ? t('ai.providerConnected', { provider })
                    : t('ai.providerConnecting', { provider })
                }
            </Text>
            {model && (
                <Text>{t('ai.modelLoaded', { model })}</Text>
            )}
        </View>
    );
}
```

### Error Handling Edge Cases

```typescript
// Translation definitions for edge cases
export const en = {
    errors: {
        // Network related
        networkTimeout: ({ timeout }: { timeout: number }) => 
            `Request timed out after ${timeout} seconds`,
        networkUnreachable: ({ host }: { host: string }) => 
            `Cannot reach ${host}. Check your connection.`,
        
        // Local AI specific errors
        localAINotInstalled: 'Local AI software not detected. Install Ollama or LM Studio.',
        localAIModelMissing: ({ model }: { model: string }) => 
            `Model ${model} is not downloaded. Run: ollama pull ${model}`,
        localAIOutOfMemory: 'Insufficient memory for model. Try a smaller model.',
        localAIPortInUse: ({ port }: { port: number }) => 
            `Port ${port} is already in use. Check if another instance is running.`,
        
        // Encryption errors
        encryptionFailed: ({ reason }: { reason: string }) => 
            `Encryption failed: ${reason}`,
        decryptionFailed: 'Failed to decrypt message. Keys may be mismatched.',
        
        // Session errors
        sessionExpired: 'Your session has expired. Please reconnect.',
        sessionConflict: 'Session is active on another device.',
    }
} as const;

// Usage with error boundaries
try {
    await connectToLocalAI();
} catch (error) {
    if (error.code === 'ECONNREFUSED') {
        showError(t('errors.networkUnreachable', { host: 'localhost:11434' }));
    } else if (error.code === 'MODEL_NOT_FOUND') {
        showError(t('errors.localAIModelMissing', { model: 'llama3.2' }));
    } else {
        showError(t('errors.encryptionFailed', { reason: error.message }));
    }
}
```

### Complex Pluralization and Formatting

```typescript
// Advanced pluralization for AI features
export const en = {
    ai: {
        // Context window usage
        contextUsage: ({ used, total }: { used: number; total: number }) => {
            const percentage = Math.round((used / total) * 100);
            if (percentage < 50) return `${used}/${total} tokens (${percentage}%)`;
            if (percentage < 80) return `${used}/${total} tokens (${percentage}%) - Consider summarizing`;
            return `${used}/${total} tokens (${percentage}%) - Context nearly full`;
        },
        
        // Model size formatting
        modelSize: ({ bytes }: { bytes: number }) => {
            if (bytes < 1024 ** 3) return `${Math.round(bytes / (1024 ** 2))} MB`;
            return `${(bytes / (1024 ** 3)).toFixed(1)} GB`;
        },
        
        // Session duration
        sessionDuration: ({ minutes }: { minutes: number }) => {
            if (minutes < 1) return 'Just started';
            if (minutes < 60) return `${Math.round(minutes)} minute${minutes === 1 ? '' : 's'}`;
            const hours = Math.floor(minutes / 60);
            const mins = Math.round(minutes % 60);
            return `${hours}h ${mins}m`;
        },
    }
} as const;
```

### Best Practices for AI-Related Translations

1. **Be specific about the AI provider**:
   ```typescript
   // ✅ Good: Clear which provider
   t('ai.providerConnected', { provider: 'Local AI (Ollama)' })
   
   // ❌ Bad: Ambiguous
   t('ai.connected')
   ```

2. **Provide actionable error messages**:
   ```typescript
   // ✅ Good: Tells user what to do
   t('errors.localAINotInstalled') // "Install Ollama or LM Studio"
   
   // ❌ Bad: Vague error
   t('errors.aiError') // "AI error occurred"
   ```

3. **Include performance context**:
   ```typescript
   // ✅ Good: Helps user understand what's happening
   t('ai.responseTime', { ms: 1500 }) // "Response in 2s"
   t('ai.tokensPerSecond', { tps: 15.3 }) // "15.3 tokens/sec"
   ```

4. **Handle edge cases gracefully**:
   ```typescript
   // Handle zero/null values
   sessionDuration: ({ minutes }: { minutes: number }) => {
       if (minutes === 0 || !minutes) return 'Just started';
       // ... rest of logic
   }
   ```

## Testing Translations

### Unit Testing Example

```typescript
import { describe, it, expect } from 'vitest';
import { t } from '@/text';

describe('AI translations', () => {
    it('should format provider connection messages', () => {
        expect(t('ai.providerConnecting', { provider: 'Ollama' }))
            .toBe('Connecting to Ollama...');
    });
    
    it('should handle model loading states', () => {
        expect(t('ai.modelLoading', { model: 'llama3.2' }))
            .toBe('Loading model: llama3.2');
    });
    
    it('should format context usage warnings', () => {
        const result = t('ai.contextUsage', { used: 3500, total: 4096 });
        expect(result).toContain('85%');
        expect(result).toContain('Context nearly full');
    });
});
```

### Edge Cases to Test

- **Empty strings**: What happens with empty model names?
- **Very large numbers**: How to format 100GB models?
- **Negative values**: Handle invalid inputs gracefully
- **Special characters**: Unicode in model names
- **Null/undefined**: Always provide fallbacks
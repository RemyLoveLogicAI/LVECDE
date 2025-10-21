# Local AI Developer Documentation

This document provides technical details for developers who want to understand, extend, or modify the Local AI integration in Happy Coder.

## Architecture Overview

The Local AI integration follows a modular architecture that integrates seamlessly with Happy Coder's existing systems.

```
┌─────────────────────────────────────────────┐
│           Happy Coder App                   │
├─────────────────────────────────────────────┤
│  ┌──────────────┐      ┌──────────────┐    │
│  │  UI Layer    │◄────►│  Settings    │    │
│  └──────┬───────┘      └──────────────┘    │
│         │                                   │
│  ┌──────▼────────────────────────────┐     │
│  │    Realtime Voice System          │     │
│  │    (VoiceSession Interface)       │     │
│  └──────┬────────────────────────────┘     │
│         │                                   │
│  ┌──────▼────────────┬─────────────────┐   │
│  │ LocalAISession    │ ElevenLabs      │   │
│  │ (Local Models)    │ (Cloud Voice)   │   │
│  └──────┬────────────┴─────────────────┘   │
└─────────┼────────────────────────────────┬─┘
          │                                │
          │                                │
┌─────────▼──────────┐          ┌─────────▼────────┐
│   Local AI Server  │          │  Cloud Services  │
│   (Ollama/LM)      │          │  (ElevenLabs)    │
└────────────────────┘          └──────────────────┘
```

## Module Structure

### Core Modules

#### 1. `sources/sync/localAI.ts`
**Purpose**: Configuration and utility functions for Local AI

**Key Exports**:
- `LocalAIConfig` - Type definition for configuration
- `LocalAIModel` - Model metadata structure
- `DEFAULT_LOCAL_AI_CONFIG` - Default configuration
- `SUPPORTED_MODELS` - Model catalog
- `checkLocalAIAvailability()` - Service health check
- `listLocalAIModels()` - Available model enumeration
- `validateLocalAIConfig()` - Configuration validation
- `getRecommendedModel()` - Memory-based recommendation
- `formatModelSize()` - Human-readable size formatting
- `isModelSuitable()` - Memory compatibility check

**Dependencies**: None (pure TypeScript utilities)

#### 2. `sources/sync/localAIProvider.ts`
**Purpose**: Session management and API integration

**Key Exports**:
- `LocalAISession` - Implements `VoiceSession` interface
- `LocalAIMessage` - Message structure
- `streamLocalAIResponse()` - Streaming response generator
- `checkLocalAIModel()` - Model availability check

**Dependencies**:
- `sources/realtime/types` - Interface contracts
- `sources/sync/localAI` - Configuration utilities

#### 3. `sources/sync/localAIEnv.ts`
**Purpose**: Environment variable management

**Key Exports**:
- `LocalAIEnv` - Environment variable types
- `parseLocalAIEnv()` - Environment parser
- `getLocalAIConfigFromEnv()` - Config from environment
- `LOCAL_AI_ENV_DOCS` - Documentation metadata
- `generateEnvTemplate()` - Template generator

**Dependencies**: None (Node.js process.env only)

## API Design Patterns

### 1. VoiceSession Interface Implementation

The `LocalAISession` class implements the existing `VoiceSession` interface for seamless integration:

```typescript
interface VoiceSession {
    startSession(config: VoiceSessionConfig): Promise<void>;
    endSession(): Promise<void>;
    sendTextMessage(message: string): void;
    sendContextualUpdate(update: string): void;
}
```

**Why this approach?**
- **Compatibility**: Works with existing realtime infrastructure
- **Flexibility**: Can be swapped with cloud providers
- **Consistency**: Same API surface for all AI providers

### 2. Conversation History Management

```typescript
private conversationHistory: LocalAIMessage[] = [];

interface LocalAIMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
}
```

**Design decisions**:
- Simple array for history (no complex state management)
- System messages for context updates
- Immutable history returned via `getConversationHistory()`

### 3. Configuration Validation

```typescript
function validateLocalAIConfig(config: Partial<LocalAIConfig>): {
    valid: boolean;
    errors: string[];
}
```

**Benefits**:
- Early validation before network requests
- Clear error messages for users
- Type-safe configuration
- Composable with other validators

## Extension Points

### Adding New AI Providers

To add a new Local AI provider (e.g., LocalAI, text-generation-webui):

1. **Add provider type**:
```typescript
// In sources/sync/localAI.ts
export type LocalAIProvider = 'ollama' | 'lmstudio' | 'localai' | 'custom';
```

2. **Implement API adapter** (if API differs):
```typescript
// In sources/sync/localAIProvider.ts
class LocalAIAdapter {
    async chat(messages: LocalAIMessage[]): Promise<string> {
        // Provider-specific implementation
    }
}
```

3. **Update configuration**:
```typescript
// In sources/sync/localAI.ts
export const PROVIDER_DEFAULTS = {
    ollama: { port: 11434, endpoint: '/api/chat' },
    lmstudio: { port: 1234, endpoint: '/v1/chat/completions' },
    localai: { port: 8080, endpoint: '/v1/chat/completions' },
};
```

### Adding New Models

To add support for new models:

1. **Add to model catalog**:
```typescript
// In sources/sync/localAI.ts
export const SUPPORTED_MODELS = {
    // ... existing models
    'gemma': {
        name: 'Gemma 7B',
        size: 3.5 * 1024 ** 3,
        quantization: 'Q4_K_M',
        capabilities: ['code', 'chat', 'multilingual'],
    },
};
```

2. **Update recommendation logic** (if needed):
```typescript
// In sources/sync/localAI.ts
export function getRecommendedModel(availableMemory: number): string {
    // Add logic for new model
}
```

### Custom Endpoints

Support for task-specific endpoints:

```typescript
// In sources/sync/localAIProvider.ts
export class MultiEndpointSession implements VoiceSession {
    private codingEndpoint: string;
    private docsEndpoint: string;
    
    async sendTextMessage(message: string, context?: string) {
        const endpoint = this.selectEndpoint(context);
        // Route to appropriate endpoint
    }
    
    private selectEndpoint(context?: string): string {
        if (context?.includes('code')) return this.codingEndpoint;
        return this.docsEndpoint;
    }
}
```

## Testing Strategy

### Unit Tests

Located in `sources/sync/*.test.ts`:

1. **Configuration Tests** (`localAI.test.ts`):
   - Validation edge cases
   - Model recommendations
   - Size formatting
   - Memory suitability

2. **Provider Tests** (`localAIProvider.test.ts`):
   - Session lifecycle
   - Message handling
   - Error scenarios
   - Model availability

### Integration Tests

To add integration tests:

```typescript
// sources/sync/localAI.integration.test.ts
import { describe, it, expect } from 'vitest';
import { LocalAISession } from './localAIProvider';

describe('Local AI Integration', () => {
    it('should connect to real Ollama instance', async () => {
        // Skip if Ollama not running
        const isRunning = await checkLocalAIAvailability();
        if (!isRunning) return;
        
        const session = new LocalAISession({
            enabled: true,
            provider: 'ollama',
            endpoint: 'http://localhost:11434',
            model: 'phi3',
        });
        
        await session.startSession({ sessionId: 'test' });
        expect(session.getStatus()).toBe('connected');
    });
});
```

### Mock Strategies

Current approach using Vitest:

```typescript
// Mock fetch globally
global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ models: [] }),
});
```

**Benefits**:
- No external dependencies in tests
- Fast test execution
- Predictable results

## Performance Considerations

### Memory Management

1. **Conversation History Pruning**:
```typescript
class LocalAISession {
    private maxHistoryLength = 50;
    
    private pruneHistory() {
        if (this.conversationHistory.length > this.maxHistoryLength) {
            // Keep system messages and recent messages
            const system = this.conversationHistory.filter(m => m.role === 'system');
            const recent = this.conversationHistory.slice(-30);
            this.conversationHistory = [...system, ...recent];
        }
    }
}
```

2. **Context Window Management**:
```typescript
function calculateContextUsage(messages: LocalAIMessage[]): number {
    // Approximate token count (4 chars ≈ 1 token)
    return messages.reduce((sum, m) => sum + m.content.length / 4, 0);
}
```

### Request Optimization

1. **Request Deduplication**:
```typescript
class LocalAISession {
    private pendingRequests = new Map<string, Promise<any>>();
    
    async generateResponse(key: string) {
        if (this.pendingRequests.has(key)) {
            return this.pendingRequests.get(key);
        }
        
        const promise = this.doGenerate();
        this.pendingRequests.set(key, promise);
        
        try {
            return await promise;
        } finally {
            this.pendingRequests.delete(key);
        }
    }
}
```

2. **Streaming Responses**:
```typescript
// Use streaming for long responses
const stream = streamLocalAIResponse(config, messages);
for await (const chunk of stream) {
    // Process chunk incrementally
    onChunk(chunk);
}
```

## Security Considerations

### 1. Endpoint Validation

Always validate endpoints to prevent SSRF:

```typescript
function isValidEndpoint(url: string): boolean {
    try {
        const parsed = new URL(url);
        
        // Allow only localhost and private networks
        const allowed = [
            '127.0.0.1',
            'localhost',
            /^192\.168\./,
            /^10\./,
        ];
        
        return allowed.some(pattern => {
            if (typeof pattern === 'string') {
                return parsed.hostname === pattern;
            }
            return pattern.test(parsed.hostname);
        });
    } catch {
        return false;
    }
}
```

### 2. Data Sanitization

Sanitize user input before sending to Local AI:

```typescript
function sanitizeMessage(message: string): string {
    // Remove potential injection attempts
    return message
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .slice(0, 10000); // Limit length
}
```

### 3. Encryption

Local AI messages still use end-to-end encryption:

```typescript
import { encryptMessage, decryptMessage } from '@/encryption';

async function sendEncryptedMessage(message: string) {
    const encrypted = await encryptMessage(message, sessionKey);
    await localAI.sendTextMessage(encrypted);
}
```

## Debugging Tools

### 1. Debug Logging

Enable verbose logging:

```typescript
const DEBUG = process.env.EXPO_PUBLIC_DEBUG === '1';

function debugLog(...args: any[]) {
    if (DEBUG) {
        console.log('[LocalAI]', ...args);
    }
}
```

### 2. Performance Monitoring

Track response times:

```typescript
class LocalAISession {
    private metrics = {
        requests: 0,
        totalTime: 0,
        errors: 0,
    };
    
    private async trackRequest<T>(fn: () => Promise<T>): Promise<T> {
        const start = Date.now();
        this.metrics.requests++;
        
        try {
            return await fn();
        } catch (error) {
            this.metrics.errors++;
            throw error;
        } finally {
            this.metrics.totalTime += Date.now() - start;
        }
    }
    
    getMetrics() {
        return {
            ...this.metrics,
            avgTime: this.metrics.totalTime / this.metrics.requests,
        };
    }
}
```

### 3. Request Inspection

Log all requests in development:

```typescript
if (process.env.NODE_ENV === 'development') {
    const originalFetch = global.fetch;
    global.fetch = async (url, options) => {
        console.log('Fetch:', url, options);
        const response = await originalFetch(url, options);
        console.log('Response:', response.status);
        return response;
    };
}
```

## Future Enhancements

### Planned Features

1. **Model Hot-Swapping**: Switch models without session restart
2. **Multi-Model Inference**: Use multiple models in parallel
3. **Context Compression**: Automatic history summarization
4. **Offline Queue**: Queue requests when service is down
5. **Performance Profiler**: Built-in performance analysis tools

### Contribution Guidelines

To contribute:

1. Follow existing code patterns
2. Add tests for new features (unit + integration)
3. Update documentation
4. Ensure TypeScript strict mode compliance
5. Add changelog entry

## Resources

- [Ollama Documentation](https://ollama.ai/docs)
- [LM Studio API Reference](https://lmstudio.ai/docs)
- [OpenAI API Compatibility](https://platform.openai.com/docs/api-reference)
- [Happy Coder Architecture](../CLAUDE.md)

## License

MIT License - see [LICENSE](../LICENSE)

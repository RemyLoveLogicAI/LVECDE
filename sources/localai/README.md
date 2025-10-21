# Local AI Integration Module

This module provides the infrastructure for integrating local AI models into LVECDE.

## Status: 🚧 In Development

This is a stub implementation demonstrating the architecture for Local AI integration. The full implementation is planned for future releases.

## Structure

```
sources/localai/
├── config.ts              # Configuration types and utilities
├── providers/             # Provider-specific adapters
│   ├── OllamaProvider.ts  # Ollama integration (planned)
│   ├── LMStudioProvider.ts # LM Studio integration (planned)
│   └── LocalAIProvider.ts # LocalAI integration (planned)
└── README.md             # This file
```

## Current Implementation

### Configuration System ✅

The `config.ts` file provides:
- TypeScript types for all supported providers
- Configuration loading from environment variables
- Validation utilities
- Default configuration values

### Supported Providers (Planned)

1. **Ollama** - Recommended for most users
2. **LM Studio** - GUI-based local model management
3. **LocalAI** - Docker-based deployment
4. **OpenAI Compatible** - Generic adapter for custom servers
5. **Custom** - Fully customizable integration

## Usage Example

```typescript
import { loadLocalAIConfigFromEnv, validateLocalAIConfig } from '@/localai/config';

// Load configuration from environment
const config = loadLocalAIConfigFromEnv();

// Validate configuration
const { valid, errors } = validateLocalAIConfig(config as LocalAIConfig);
if (!valid) {
    console.error('Configuration errors:', errors);
}

// Use configuration
console.log('Using provider:', config.provider);
console.log('Model:', config.ollama?.model);
```

## Environment Variables

See `.env.example` in the project root for all available configuration options:

```bash
# Required
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b

# Optional
EXPO_PUBLIC_LOCAL_AI_TYPE=ollama
EXPO_PUBLIC_LOCAL_AI_TIMEOUT=30000
EXPO_PUBLIC_LOCAL_AI_TEMPERATURE=0.7
EXPO_PUBLIC_LOCAL_AI_MAX_TOKENS=2048
EXPO_PUBLIC_LOCAL_AI_DEBUG=0
```

## Architecture

See [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md) for detailed architecture documentation.

## Implementation Roadmap

### Phase 1: Foundation ✅
- [x] Configuration system
- [x] Type definitions
- [x] Documentation

### Phase 2: Core Integration (Next)
- [ ] Create `LocalAIManager` class
- [ ] Implement Ollama provider
- [ ] Add basic chat functionality
- [ ] Integrate with session management

### Phase 3: Enhanced Features
- [ ] Streaming responses
- [ ] Multiple provider support
- [ ] Health checking
- [ ] Error handling and retry logic

### Phase 4: UI Integration
- [ ] Settings screen for configuration
- [ ] Connection status indicators
- [ ] Model selection UI
- [ ] Performance monitoring

## Contributing

To implement provider adapters:

1. Create a new file in `providers/`
2. Implement the `LocalAIProvider` interface (see ARCHITECTURE.md)
3. Add tests
4. Update documentation

## Testing

Currently no tests as this is a stub implementation. Tests will be added as functionality is implemented.

## Documentation

- [Local AI Integration Guide](../../docs/LOCAL_AI_INTEGRATION.md)
- [Architecture Documentation](../../docs/ARCHITECTURE.md)
- [Setup Guide](../../docs/SETUP.md)

## Notes

- This module is designed to be independent and testable
- All providers should implement a common interface
- Configuration should be flexible and validated
- Security and privacy are paramount

## Future Enhancements

- Voice model integration
- Embedding generation
- RAG (Retrieval Augmented Generation) support
- Model performance monitoring
- Automatic model selection
- Fine-tuning support

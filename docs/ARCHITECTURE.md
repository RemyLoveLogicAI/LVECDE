# Local AI Integration Architecture

This document describes the architecture for integrating local AI models into LVECDE.

## Overview

LVECDE supports multiple local AI backends through a unified API interface. The system is designed to:

1. Support multiple AI providers (Ollama, LM Studio, LocalAI, custom servers)
2. Maintain compatibility with the existing encryption and session management
3. Provide a consistent interface regardless of the backend
4. Support real-time streaming responses
5. Handle network failures gracefully

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        LVECDE Client                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              UI Components                               │   │
│  │  (AgentInput, ChatView, SessionView, etc.)              │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │         Local AI Client Manager                          │   │
│  │  - Configuration management                              │   │
│  │  - Provider selection                                    │   │
│  │  - Connection pooling                                    │   │
│  │  - Error handling and retry logic                        │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │         Provider Adapters                                │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │   │
│  │  │   Ollama     │ │  LM Studio   │ │   LocalAI    │    │   │
│  │  │   Adapter    │ │   Adapter    │ │   Adapter    │    │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │   │
│  │  ┌──────────────┐ ┌──────────────┐                      │   │
│  │  │   OpenAI     │ │   Custom     │                      │   │
│  │  │   Compatible │ │   Adapter    │                      │   │
│  │  └──────────────┘ └──────────────┘                      │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
│  ┌──────────────────▼──────────────────────────────────────┐   │
│  │         Session & Encryption Layer                       │   │
│  │  - End-to-end encryption                                 │   │
│  │  - Session management                                    │   │
│  │  - Real-time sync                                        │   │
│  └──────────────────┬───────────────────────────────────────┘   │
│                     │                                             │
└─────────────────────┼─────────────────────────────────────────┘
                      │
         ┌────────────┴──────────────┐
         │                           │
    ┌────▼─────┐              ┌─────▼────┐
    │  Local   │              │  Cloud   │
    │  Backend │              │  Backend │
    │  Server  │              │  (Optional)│
    └──────────┘              └──────────┘
```

## Component Structure

### 1. Local AI Client Manager

**Location**: `sources/localai/LocalAIManager.ts`

**Responsibilities:**
- Initialize and configure AI providers
- Manage provider selection and fallback
- Handle connection state
- Coordinate between UI and providers
- Cache responses when appropriate

**Key Methods:**
```typescript
class LocalAIManager {
    // Initialize with configuration
    static async create(config: LocalAIConfig): Promise<LocalAIManager>
    
    // Send a message and get response
    async chat(message: string, options?: ChatOptions): Promise<ChatResponse>
    
    // Stream a response
    async chatStream(message: string, options?: ChatOptions): AsyncIterator<ChatChunk>
    
    // Check provider health
    async checkHealth(): Promise<HealthStatus>
    
    // Get current configuration
    getConfig(): LocalAIConfig
    
    // Update configuration
    updateConfig(config: Partial<LocalAIConfig>): void
}
```

### 2. Provider Adapters

**Location**: `sources/localai/providers/`

Each provider implements the `LocalAIProvider` interface:

```typescript
interface LocalAIProvider {
    // Provider identification
    readonly type: 'ollama' | 'lmstudio' | 'localai' | 'openai' | 'custom'
    
    // Initialize the provider
    initialize(config: ProviderConfig): Promise<void>
    
    // Check if provider is available
    isAvailable(): Promise<boolean>
    
    // Get list of available models
    listModels(): Promise<ModelInfo[]>
    
    // Send a chat message
    chat(request: ChatRequest): Promise<ChatResponse>
    
    // Stream a chat message
    chatStream(request: ChatRequest): AsyncIterator<ChatChunk>
    
    // Get provider status
    getStatus(): ProviderStatus
}
```

#### Provider Implementations

**Ollama Adapter** (`sources/localai/providers/OllamaProvider.ts`):
- Uses Ollama's native API
- Supports model management
- Handles streaming responses
- Auto-detects available models

**LM Studio Adapter** (`sources/localai/providers/LMStudioProvider.ts`):
- Uses OpenAI-compatible API
- Model selection from running models
- Streaming support via SSE

**LocalAI Adapter** (`sources/localai/providers/LocalAIProvider.ts`):
- OpenAI-compatible API
- Supports custom model configurations
- Docker deployment friendly

**OpenAI Compatible Adapter** (`sources/localai/providers/OpenAIProvider.ts`):
- Generic adapter for any OpenAI-compatible API
- Used for custom servers
- Configurable endpoints

### 3. Configuration System

**Location**: `sources/localai/config.ts`

```typescript
interface LocalAIConfig {
    // Primary provider
    provider: 'ollama' | 'lmstudio' | 'localai' | 'openai' | 'custom'
    
    // Provider-specific settings
    ollama?: OllamaConfig
    lmstudio?: LMStudioConfig
    localai?: LocalAIConfig
    openai?: OpenAIConfig
    custom?: CustomConfig
    
    // General settings
    timeout?: number
    maxRetries?: number
    fallbackProviders?: string[]
    
    // Model settings
    defaultModel?: string
    temperature?: number
    maxTokens?: number
    contextSize?: number
}

interface OllamaConfig {
    url: string
    model: string
}

interface LMStudioConfig {
    url: string
    model: string
    apiKey?: string
}

interface LocalAIConfig {
    url: string
    model: string
    apiKey?: string
}

interface OpenAIConfig {
    baseUrl: string
    apiKey?: string
    model: string
    organization?: string
}

interface CustomConfig {
    url: string
    model: string
    apiKey?: string
    headers?: Record<string, string>
    requestTransform?: (req: any) => any
    responseTransform?: (res: any) => any
}
```

### 4. UI Integration Points

#### Settings Screen

**Location**: `sources/app/(app)/settings/localai.tsx`

New settings screen for Local AI configuration:
- Provider selection
- URL configuration
- Model selection
- Test connection
- Advanced settings

#### Agent Input

**Location**: `sources/components/AgentInput.tsx`

Modifications needed:
- Add local AI model selector
- Show local AI status indicator
- Handle local AI errors gracefully

#### Session View

**Location**: `sources/-session/SessionView.tsx`

Integration points:
- Use LocalAIManager for sending messages
- Handle streaming responses
- Display connection status

## Data Flow

### 1. Sending a Message

```
User Input
  ↓
AgentInput Component
  ↓
LocalAIManager.chat()
  ↓
Provider Adapter (e.g., OllamaProvider)
  ↓
HTTP Request to Local AI Server
  ↓
Response Processing
  ↓
Encryption (if needed)
  ↓
Session Storage
  ↓
UI Update
```

### 2. Streaming Response

```
User Input
  ↓
AgentInput Component
  ↓
LocalAIManager.chatStream()
  ↓
Provider Adapter (e.g., OllamaProvider)
  ↓
SSE/Stream Connection to Local AI Server
  ↓
For each chunk:
  ↓
  Chunk Processing
  ↓
  Partial UI Update
  ↓
On complete:
  ↓
  Encryption (if needed)
  ↓
  Session Storage
```

## Error Handling

### Connection Errors

1. **Server Unreachable**
   - Display clear error message
   - Suggest checking server URL
   - Offer retry mechanism
   - Show last successful connection time

2. **Authentication Failed**
   - Prompt for API key if needed
   - Clear error message about auth
   - Link to configuration settings

3. **Timeout**
   - Configurable timeout settings
   - Display timeout warning
   - Offer to increase timeout
   - Cancel long-running requests

### Model Errors

1. **Model Not Found**
   - List available models
   - Suggest downloading model
   - Provide installation instructions

2. **Out of Memory**
   - Suggest smaller model
   - Show memory usage if available
   - Provide troubleshooting tips

3. **Invalid Response**
   - Log error details
   - Fallback to default behavior
   - Alert user of issue

## Security Considerations

### Network Security

1. **Local Network Only**
   - Default to localhost
   - Warn when using remote IP
   - Support VPN connections

2. **API Key Storage**
   - Store in secure storage
   - Encrypt if cloud sync enabled
   - Never log API keys

3. **Request Validation**
   - Validate all inputs
   - Sanitize prompts
   - Rate limiting if needed

### Data Privacy

1. **Local Processing**
   - All AI inference local
   - No cloud data transmission
   - Clear privacy indicators

2. **Encryption**
   - Maintain E2E encryption
   - Encrypt stored messages
   - Secure key derivation

## Performance Optimization

### Caching

1. **Response Caching**
   - Cache common completions
   - Configurable cache size
   - TTL-based expiration

2. **Model Caching**
   - Keep model in memory
   - Lazy loading
   - Resource management

### Request Optimization

1. **Context Management**
   - Sliding window context
   - Summarization for long contexts
   - Efficient token usage

2. **Batching**
   - Batch multiple requests
   - Reduce overhead
   - Maintain order

## Testing Strategy

### Unit Tests

- Test each provider adapter independently
- Mock AI responses
- Test error scenarios
- Validate configuration parsing

### Integration Tests

- Test with actual local AI servers
- Verify streaming responses
- Test failover mechanisms
- Validate encryption integration

### E2E Tests

- Complete user workflows
- Multi-device scenarios
- Network failure recovery
- Performance benchmarks

## Migration Path

### From Cloud to Local AI

1. **Gradual Migration**
   - Run both systems in parallel
   - User selects preferred backend
   - Seamless switching

2. **Data Compatibility**
   - Maintain session format
   - Keep encryption scheme
   - Preserve message history

3. **Feature Parity**
   - Ensure local AI matches cloud features
   - Document limitations
   - Clear user expectations

## Future Enhancements

### Phase 1 (Current)
- [x] Architecture design
- [x] Configuration system
- [ ] Basic Ollama integration
- [ ] Settings UI

### Phase 2
- [ ] Multiple provider support
- [ ] Streaming responses
- [ ] Error handling
- [ ] Connection status UI

### Phase 3
- [ ] Voice integration with local models
- [ ] Model performance monitoring
- [ ] Auto-model selection
- [ ] Advanced caching

### Phase 4
- [ ] Fine-tuning support
- [ ] Multi-model ensembles
- [ ] RAG integration
- [ ] Custom tool support

## Implementation Checklist

- [ ] Create LocalAIManager class
- [ ] Implement Ollama provider adapter
- [ ] Create configuration schema
- [ ] Add environment variable support
- [ ] Create settings UI screen
- [ ] Integrate with session management
- [ ] Add connection status indicators
- [ ] Implement error handling
- [ ] Add streaming support
- [ ] Write tests
- [ ] Update documentation
- [ ] Test on all platforms

## References

- [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [OpenAI API Specification](https://platform.openai.com/docs/api-reference)
- [LocalAI Documentation](https://localai.io/basics/getting_started/)
- [LM Studio Server API](https://lmstudio.ai/docs/local-server)

# Local AI Integration Guide

This guide provides comprehensive information on integrating and using Local AI models with Happy Coder.

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Advanced Topics](#advanced-topics)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

## Overview

Happy Coder's Local AI integration allows you to run AI models directly on your machine, providing:

- **Complete Privacy**: Your code and conversations never leave your device
- **Offline Capability**: Work without internet connectivity
- **Reduced Latency**: Faster responses without network overhead
- **Cost Savings**: No API usage fees
- **Model Control**: Choose and customize models to your needs

### Supported Providers

- **Ollama**: Lightweight, easy-to-use local AI runtime
- **LM Studio**: User-friendly desktop app for model management
- **Custom**: Any OpenAI-compatible API endpoint

### Supported Models

| Model | Size | Best For | Memory Required |
|-------|------|----------|-----------------|
| phi3 | 2.3 GB | Fast responses, low-end hardware | 4+ GB RAM |
| mistral | 4.1 GB | Balanced performance | 6+ GB RAM |
| llama3.2 | 3.8 GB | General coding, chat | 8+ GB RAM |
| codellama | 3.8 GB | Code-specific tasks | 8+ GB RAM |
| llama3.2:70b | 40 GB | Advanced reasoning | 64+ GB RAM |

## Installation

### Step 1: Install Ollama (Recommended)

**macOS/Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [https://ollama.ai/download](https://ollama.ai/download)

### Step 2: Download Models

```bash
# Start with a small, fast model
ollama pull phi3

# Or use the recommended model
ollama pull llama3.2

# For code-specific tasks
ollama pull codellama

# Check available models
ollama list
```

### Step 3: Verify Installation

```bash
# Test Ollama is running
curl http://localhost:11434/api/tags

# You should see a JSON response with your models
```

### Alternative: LM Studio

1. Download from [https://lmstudio.ai/](https://lmstudio.ai/)
2. Install and open LM Studio
3. Browse and download models through the UI
4. Start the local server (default: http://localhost:1234)

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```bash
# Enable Local AI
EXPO_PUBLIC_LOCAL_AI_ENABLED=true

# Provider configuration
EXPO_PUBLIC_LOCAL_AI_PROVIDER=ollama
EXPO_PUBLIC_LOCAL_AI_ENDPOINT=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=llama3.2

# Performance tuning
HAPPY_LOCAL_AI_CONTEXT_SIZE=4096
HAPPY_LOCAL_AI_TEMPERATURE=0.7
HAPPY_LOCAL_AI_THREADS=8
HAPPY_LOCAL_AI_GPU=true
```

### In-App Configuration

1. Open Happy Coder
2. Navigate to **Settings** → **AI Configuration**
3. Select **Local AI** as provider
4. Configure:
   - Endpoint URL
   - Model name
   - Performance settings

### Configuration Options

#### Context Size
Controls how much conversation history the model can "remember":
- **512-2048**: Fast, limited context
- **4096**: Recommended default
- **8192-16384**: Extended context for complex tasks
- **32768**: Maximum context (requires significant memory)

#### Temperature
Controls response randomness:
- **0.0-0.3**: Deterministic, focused responses
- **0.4-0.7**: Balanced (recommended)
- **0.8-1.2**: Creative, varied responses
- **1.3-2.0**: Very random, experimental

#### Threads
Number of CPU threads for inference:
- Set to number of CPU cores for best performance
- Lower if system becomes sluggish
- Has no effect when using GPU

#### GPU Acceleration
- **Enabled (default)**: Uses GPU if available (much faster)
- **Disabled**: CPU-only inference

## Usage

### Basic Usage

Once configured, Local AI works seamlessly with Happy Coder:

```bash
# Start Happy as usual
happy

# The CLI will automatically use Local AI if enabled
# No code changes required!
```

### Switching Between Cloud and Local

#### Temporary Switch to Cloud AI
```bash
export EXPO_PUBLIC_LOCAL_AI_ENABLED=false
happy
```

#### Temporary Switch to Local AI
```bash
export EXPO_PUBLIC_LOCAL_AI_ENABLED=true
happy
```

### Model Selection

#### Switch Models at Runtime
In settings, change the model name:
- `llama3.2` → General purpose
- `codellama` → Code-specific
- `mistral` → Balanced performance
- `phi3` → Fast, lightweight

#### Multiple Models for Different Tasks

```bash
# Coding assistant
HAPPY_LOCAL_AI_CODING_MODEL=codellama

# Documentation
HAPPY_LOCAL_AI_DOCS_MODEL=llama3.2
```

### Voice Integration

Local AI can work with voice features:

```bash
# Enable local voice processing
HAPPY_VOICE_LOCAL=true

# Or use hybrid (local AI, cloud voice)
EXPO_PUBLIC_LOCAL_AI_ENABLED=true
HAPPY_VOICE_LOCAL=false
```

## Advanced Topics

### Custom Model Configuration

#### Using Custom Models

Ollama supports many models from Hugging Face:

```bash
# Download any compatible model
ollama pull <model-name>

# Configure in Happy Coder
EXPO_PUBLIC_LOCAL_AI_MODEL=<model-name>
```

#### Creating Model Variants

Create custom Modelfile:

```dockerfile
FROM llama3.2

# Customize parameters
PARAMETER temperature 0.5
PARAMETER num_ctx 8192

# Add custom system prompt
SYSTEM You are an expert TypeScript developer specializing in React Native.
```

Load it:
```bash
ollama create typescript-expert -f Modelfile
```

### Performance Optimization

#### GPU Memory Management

For NVIDIA GPUs:
```bash
# Limit GPU memory usage
CUDA_VISIBLE_DEVICES=0 ollama serve

# Monitor GPU usage
nvidia-smi -l 1
```

For Apple Silicon:
```bash
# Metal GPU is automatically used
# Check Activity Monitor → GPU usage
```

#### Context Window Optimization

Larger context = more memory + slower responses:

| Context Size | Memory | Speed | Use Case |
|--------------|--------|-------|----------|
| 2048 | ~2 GB | Fast | Quick queries |
| 4096 | ~4 GB | Normal | Standard coding |
| 8192 | ~8 GB | Slower | Complex tasks |
| 16384 | ~16 GB | Slow | Entire file analysis |

#### CPU Thread Optimization

```bash
# Find optimal thread count
for threads in 2 4 8 16; do
    echo "Testing $threads threads..."
    HAPPY_LOCAL_AI_THREADS=$threads time ollama run llama3.2 "Hello"
done
```

### Multi-Model Setup

Run multiple Ollama instances:

```bash
# Primary instance (port 11434)
ollama serve

# Secondary instance (port 11435)
OLLAMA_HOST=0.0.0.0:11435 ollama serve

# Configure in Happy Coder
HAPPY_LOCAL_AI_CODING_ENDPOINT=http://localhost:11434
HAPPY_LOCAL_AI_CODING_MODEL=codellama

HAPPY_LOCAL_AI_DOCS_ENDPOINT=http://localhost:11435
HAPPY_LOCAL_AI_DOCS_MODEL=llama3.2
```

### Remote Local AI

Run Local AI on a powerful machine, access from laptop:

```bash
# On powerful machine (192.168.1.100)
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# On laptop
EXPO_PUBLIC_LOCAL_AI_ENDPOINT=http://192.168.1.100:11434
```

### Docker Deployment

```dockerfile
FROM ollama/ollama:latest

# Copy models
COPY models /root/.ollama/models

# Expose port
EXPOSE 11434

CMD ["serve"]
```

Run:
```bash
docker run -d -p 11434:11434 --gpus all ollama-happy
```

## Troubleshooting

### Common Issues

#### "Local AI service is not available"

**Cause**: Ollama not running or wrong endpoint

**Solutions**:
```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Start Ollama
ollama serve

# Check endpoint in config
echo $EXPO_PUBLIC_LOCAL_AI_ENDPOINT
```

#### "Model llama3.2 not found"

**Cause**: Model not downloaded

**Solution**:
```bash
# Download the model
ollama pull llama3.2

# Verify it's available
ollama list
```

#### Slow Responses

**Causes & Solutions**:

1. **Model too large for RAM**
   ```bash
   # Switch to smaller model
   EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
   ```

2. **GPU not being used**
   ```bash
   # Verify GPU is available
   nvidia-smi  # NVIDIA
   # or check Activity Monitor (Mac)
   
   # Enable GPU explicitly
   HAPPY_LOCAL_AI_GPU=true
   ```

3. **Too many threads**
   ```bash
   # Reduce thread count
   HAPPY_LOCAL_AI_THREADS=4
   ```

4. **Context too large**
   ```bash
   # Reduce context size
   HAPPY_LOCAL_AI_CONTEXT_SIZE=2048
   ```

#### Out of Memory

**Solutions**:

1. Use smaller model:
   ```bash
   EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
   ```

2. Reduce context:
   ```bash
   HAPPY_LOCAL_AI_CONTEXT_SIZE=2048
   ```

3. Close other applications

4. Upgrade RAM (if possible)

#### Connection Refused (Port Already in Use)

**Solution**:
```bash
# Find process using port
lsof -i :11434

# Kill the process
kill -9 <PID>

# Or use different port
OLLAMA_HOST=0.0.0.0:11435 ollama serve
EXPO_PUBLIC_LOCAL_AI_ENDPOINT=http://localhost:11435
```

#### Encryption Errors

Local AI maintains end-to-end encryption. If you see encryption errors:

1. Ensure both devices use same encryption keys
2. Check network connectivity
3. Verify Local AI endpoint is accessible from both devices

### Debugging

Enable debug logging:

```bash
# In .env
EXPO_PUBLIC_DEBUG=1

# View logs
expo start --dev-client
# Check terminal output for Local AI logs
```

### Getting Help

1. Check [GitHub Issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
2. Review [Ollama Documentation](https://ollama.ai/docs)
3. Join [Happy Coder Community](https://discord.gg/happy-coder)

## API Reference

### LocalAIConfig

```typescript
interface LocalAIConfig {
    enabled: boolean;
    provider: 'ollama' | 'lmstudio' | 'custom';
    endpoint: string;
    model: string;
    contextSize?: number;      // 512-32768
    temperature?: number;       // 0.0-2.0
    threads?: number;          // 1-64
    gpuEnabled?: boolean;
}
```

### Functions

#### checkLocalAIAvailability
```typescript
async function checkLocalAIAvailability(
    endpoint: string
): Promise<boolean>
```
Check if Local AI service is running and accessible.

#### listLocalAIModels
```typescript
async function listLocalAIModels(
    endpoint: string
): Promise<string[]>
```
Get list of available models on the Local AI server.

#### validateLocalAIConfig
```typescript
function validateLocalAIConfig(
    config: Partial<LocalAIConfig>
): { valid: boolean; errors: string[] }
```
Validate a Local AI configuration.

#### getRecommendedModel
```typescript
function getRecommendedModel(
    availableMemory: number
): string
```
Get recommended model based on available memory.

### Environment Variables

See [Configuration](#configuration) section for complete list.

## Best Practices

1. **Start Small**: Begin with `phi3` or `mistral` before trying larger models
2. **Monitor Resources**: Watch RAM and GPU usage, especially during first runs
3. **Context Management**: Keep context size appropriate for your use case
4. **Model Selection**: Use specialized models (`codellama`) for code tasks
5. **Regular Updates**: Keep Ollama and models up to date
6. **Backup Configs**: Save working configurations for easy restoration
7. **Security**: When using remote Local AI, ensure network is secure

## License

This Local AI integration is part of Happy Coder and follows the same MIT License.

## Contributing

Contributions welcome! See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

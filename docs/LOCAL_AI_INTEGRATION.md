# Local AI Integration Guide

This guide explains how to integrate LVECDE with local AI models for complete privacy and control.

## Overview

LVECDE supports integration with various local AI solutions, allowing you to run language models on your own infrastructure instead of relying on cloud services.

## Supported Local AI Solutions

### 1. Ollama (Recommended)

[Ollama](https://ollama.ai/) is the easiest way to run local LLMs.

#### Installation

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows
# Download from https://ollama.ai/download
```

#### Setup

```bash
# Pull a code model
ollama pull codellama:13b

# Start Ollama server (usually runs automatically)
ollama serve
```

#### Configuration

```bash
# In your .env file
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b
EXPO_PUBLIC_LOCAL_AI_TYPE=ollama
```

### 2. LM Studio

[LM Studio](https://lmstudio.ai/) provides a GUI for running local models.

#### Setup

1. Download and install LM Studio
2. Download a code model (e.g., CodeLlama, WizardCoder)
3. Start the local server in LM Studio
4. Configure LVECDE:

```bash
# In your .env file
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:1234/v1
EXPO_PUBLIC_LOCAL_AI_MODEL=TheBloke/CodeLlama-13B-Instruct-GGUF
EXPO_PUBLIC_LOCAL_AI_TYPE=openai
```

### 3. LocalAI

[LocalAI](https://localai.io/) is an OpenAI-compatible API for local models.

#### Installation with Docker

```bash
docker run -p 8080:8080 \
  -v $PWD/models:/models \
  localai/localai:latest
```

#### Configuration

```bash
# In your .env file
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:8080/v1
EXPO_PUBLIC_LOCAL_AI_MODEL=your-model-name
EXPO_PUBLIC_LOCAL_AI_TYPE=openai
```

### 4. Custom Server

You can integrate any server that implements an OpenAI-compatible API.

#### Requirements

Your server must support:
- Chat completions endpoint: `POST /v1/chat/completions`
- Streaming responses (optional but recommended)
- Standard OpenAI request/response format

#### Configuration

```bash
# In your .env file
EXPO_PUBLIC_LOCAL_AI_URL=http://your-server:port
EXPO_PUBLIC_LOCAL_AI_MODEL=your-model
EXPO_PUBLIC_LOCAL_AI_TYPE=custom
EXPO_PUBLIC_LOCAL_AI_API_KEY=optional-api-key
```

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Required
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b

# Optional
EXPO_PUBLIC_LOCAL_AI_TYPE=ollama  # ollama, openai, custom
EXPO_PUBLIC_LOCAL_AI_API_KEY=     # If your server requires authentication
EXPO_PUBLIC_LOCAL_AI_TIMEOUT=30000 # Request timeout in milliseconds
EXPO_PUBLIC_LOCAL_AI_MAX_TOKENS=2048
EXPO_PUBLIC_LOCAL_AI_TEMPERATURE=0.7

# Voice settings (for local voice models)
EXPO_PUBLIC_LOCAL_VOICE_URL=http://localhost:5002
EXPO_PUBLIC_LOCAL_VOICE_MODEL=coqui-tts
```

## Recommended Models

### For Code Generation

| Model | Size | RAM Required | Best For |
|-------|------|--------------|----------|
| CodeLlama 7B | 4GB | 8GB | Quick responses, simple tasks |
| CodeLlama 13B | 7GB | 16GB | Balanced performance |
| CodeLlama 34B | 20GB | 32GB | Complex code generation |
| WizardCoder 15B | 9GB | 18GB | Python and web development |
| DeepSeek Coder 6.7B | 4GB | 8GB | Fast, efficient coding |

### For Voice Processing (Future Integration)

| Model | Purpose | Size |
|-------|---------|------|
| Whisper (OpenAI) | Speech-to-text | Various (tiny to large) |
| Coqui TTS | Text-to-speech | ~200MB |
| Piper TTS | Text-to-speech | ~50MB per voice |

## Network Configuration

### Local Development

If running LVECDE and your AI server on the same machine:

```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
```

### Mobile Access

To access your local AI from a mobile device:

1. **Find your computer's local IP:**
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1
   
   # Windows
   ipconfig
   ```

2. **Update configuration:**
   ```bash
   EXPO_PUBLIC_LOCAL_AI_URL=http://192.168.1.100:11434
   ```

3. **Ensure firewall allows connections:**
   ```bash
   # macOS
   sudo defaults write /Library/Preferences/com.apple.alf globalstate -int 0
   
   # Linux (ufw)
   sudo ufw allow 11434
   ```

### Docker Network

If running in Docker, use Docker networking:

```yaml
# docker-compose.yml
version: '3.8'
services:
  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    
  lvecde:
    build: .
    environment:
      - EXPO_PUBLIC_LOCAL_AI_URL=http://ollama:11434
```

## Performance Optimization

### Hardware Requirements

**Minimum:**
- CPU: 4+ cores
- RAM: 8GB
- Storage: 10GB for models

**Recommended:**
- CPU: 8+ cores
- RAM: 16GB+
- GPU: NVIDIA GPU with 8GB+ VRAM
- Storage: 50GB SSD

### GPU Acceleration

#### NVIDIA CUDA (Linux/Windows)

```bash
# Ollama automatically uses GPU if available
ollama run codellama:13b

# For LocalAI with GPU
docker run -p 8080:8080 --gpus all \
  localai/localai:latest-gpu
```

#### Apple Silicon (macOS)

```bash
# Ollama uses Metal acceleration automatically
ollama run codellama:13b
```

### Model Quantization

Use quantized models for better performance:

```bash
# 4-bit quantization (smaller, faster, slightly less accurate)
ollama pull codellama:13b-q4_0

# 8-bit quantization (balanced)
ollama pull codellama:13b-q8_0
```

## Testing Your Integration

### 1. Test Local AI Server

```bash
# Test Ollama
curl http://localhost:11434/api/generate -d '{
  "model": "codellama:13b",
  "prompt": "Write a hello world function in Python"
}'

# Test OpenAI-compatible API
curl http://localhost:1234/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "codellama",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### 2. Test LVECDE Connection

```bash
# Start LVECDE in development mode
yarn start

# Check logs for connection status
# Should see: "[Local AI] Connected to http://localhost:11434"
```

### 3. Integration Test

1. Open LVECDE app
2. Start a new session
3. Send a code request
4. Verify response comes from local AI

## Troubleshooting

### Common Issues

#### "Connection Refused"

**Problem:** Cannot connect to local AI server

**Solutions:**
- Verify server is running: `curl http://localhost:11434`
- Check firewall settings
- Ensure correct port in configuration
- Try `http://127.0.0.1` instead of `http://localhost`

#### "Out of Memory"

**Problem:** Model crashes or system freezes

**Solutions:**
- Use a smaller model
- Use quantized model (q4_0)
- Close other applications
- Increase swap space (Linux)

#### "Slow Responses"

**Problem:** AI takes too long to respond

**Solutions:**
- Use GPU acceleration
- Switch to smaller model
- Reduce `max_tokens` setting
- Use quantized model
- Check CPU usage (should be near 100% during generation)

#### "Model Not Found"

**Problem:** AI server can't find the model

**Solutions:**
- Pull model: `ollama pull codellama:13b`
- Verify model name matches exactly
- Check model is in correct directory

### Debug Mode

Enable debug logging:

```bash
# In .env
EXPO_PUBLIC_DEBUG=1
EXPO_PUBLIC_LOCAL_AI_DEBUG=1
```

View logs:
```bash
# Check app logs
expo start --clear

# Check Ollama logs
journalctl -u ollama -f  # Linux systemd
tail -f /var/log/ollama.log  # macOS
```

## Security Considerations

### Network Security

1. **Firewall Rules:** Only expose AI server on local network
2. **API Authentication:** Use API keys if exposing externally
3. **HTTPS:** Use reverse proxy with SSL for production

### Data Privacy

1. **Local Processing:** All AI inference happens locally
2. **No Telemetry:** Models don't send data to external services
3. **Encrypted Storage:** Use disk encryption for model storage
4. **Network Isolation:** Run on isolated network segment

## Advanced Configuration

### Load Balancing

For high availability, run multiple AI servers:

```bash
# In .env
EXPO_PUBLIC_LOCAL_AI_URLS=http://server1:11434,http://server2:11434
EXPO_PUBLIC_LOCAL_AI_LOAD_BALANCE=round-robin
```

### Context Management

Configure context window size:

```bash
EXPO_PUBLIC_LOCAL_AI_CONTEXT_SIZE=4096  # Tokens of context
EXPO_PUBLIC_LOCAL_AI_MAX_HISTORY=10      # Messages to keep
```

### Custom Model Parameters

```bash
EXPO_PUBLIC_LOCAL_AI_TEMPERATURE=0.7     # Creativity (0.0-1.0)
EXPO_PUBLIC_LOCAL_AI_TOP_P=0.95          # Nucleus sampling
EXPO_PUBLIC_LOCAL_AI_TOP_K=40            # Top-k sampling
EXPO_PUBLIC_LOCAL_AI_REPEAT_PENALTY=1.1  # Repetition penalty
```

## Future Enhancements

Planned local AI integrations:

- [ ] Local voice model integration (Whisper, Coqui)
- [ ] Model performance monitoring
- [ ] Automatic model switching based on task
- [ ] Fine-tuning support for custom models
- [ ] Multi-model ensemble responses
- [ ] Local embedding generation for RAG
- [ ] Code completion streaming
- [ ] Syntax-aware model selection

## Resources

- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/README.md)
- [LM Studio Guide](https://lmstudio.ai/docs)
- [LocalAI Documentation](https://localai.io/docs/)
- [Quantization Guide](https://huggingface.co/docs/optimum/concept_guides/quantization)
- [Model Performance Benchmarks](https://github.com/ggerganov/llama.cpp#main-features)

## Support

For issues with Local AI integration:

1. Check this guide first
2. Review [GitHub Issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
3. Consult the specific AI server documentation
4. Open a new issue with:
   - Server type and version
   - Model being used
   - Error logs
   - System specifications

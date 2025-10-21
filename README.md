<div align="center"><img src="/logo.png" width="200" title="Happy Coder" alt="Happy Coder"/></div>

<h1 align="center">
  Mobile and Web Client for Claude Code & Codex
</h1>

<h4 align="center">
Use Claude Code or Codex from anywhere with end-to-end encryption.
</h4>

<div align="center">
  
[📱 **iOS App**](https://apps.apple.com/us/app/happy-claude-code-client/id6748571505) • [🤖 **Android App**](https://play.google.com/store/apps/details?id=com.ex3ndr.happy) • [🌐 **Web App**](https://app.happy.engineering) • [🎥 **See a Demo**](https://youtu.be/GCS0OG9QMSE) • [⭐ **Star on GitHub**](https://github.com/slopus/happy) • [📚 **Documentation**](https://happy.engineering/docs/)

</div>

<img width="5178" height="2364" alt="github" src="https://github.com/user-attachments/assets/14d517e9-71a8-4fcb-98ae-9ebf9f7c149f" />


<h3 align="center">
Step 1: Download App
</h3>

<div align="center">
<a href="https://apps.apple.com/us/app/happy-claude-code-client/id6748571505"><img width="135" height="39" alt="appstore" src="https://github.com/user-attachments/assets/45e31a11-cf6b-40a2-a083-6dc8d1f01291" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="https://play.google.com/store/apps/details?id=com.ex3ndr.happy"><img width="135" height="39" alt="googleplay" src="https://github.com/user-attachments/assets/acbba639-858f-4c74-85c7-92a4096efbf5" /></a>
</div>

<h3 align="center">
Step 2: Install CLI on your computer
</h3>

```bash
npm install -g happy-coder
```

<h3 align="center">
Step 3: Start using `happy` instead of `claude` or `codex`
</h3>

```bash

# Instead of: claude
# Use: happy

happy

# Instead of: codex
# Use: happy codex

happy codex

```

## How does it work?

On your computer, run `happy` instead of `claude` or `happy codex` instead of `codex` to start your AI through our wrapper. When you want to control your coding agent from your phone, it restarts the session in remote mode. To switch back to your computer, just press any key on your keyboard.

## 🔥 Why Happy Coder?

- 📱 **Mobile access to Claude Code and Codex** - Check what your AI is building while away from your desk
- 🔔 **Push notifications** - Get alerted when Claude Code and Codex needs permission or encounters errors  
- ⚡ **Switch devices instantly** - Take control from phone or desktop with one keypress
- 🔐 **End-to-end encrypted** - Your code never leaves your devices unencrypted
- 🛠️ **Open source** - Audit the code yourself. No telemetry, no tracking
- 🤖 **Local AI Support** - Run AI models locally for enhanced privacy and offline capabilities

## 📦 Project Components

- **[happy-cli](https://github.com/slopus/happy-cli)** - Command-line interface for Claude Code and Codex
- **[happy-server](https://github.com/slopus/happy-server)** - Backend server for encrypted sync
- **happy-coder** - This mobile client (you are here)

## 🏠 Who We Are

We're engineers scattered across Bay Area coffee shops and hacker houses, constantly checking how our AI coding agents are progressing on our pet projects during lunch breaks. Happy Coder was born from the frustration of not being able to peek at our AI coding tools building our side hustles while we're away from our keyboards. We believe the best tools come from scratching your own itch and sharing with the community.

## 🤖 Local AI Integration

Happy Coder now supports Local AI models, allowing you to run AI models directly on your machine for enhanced privacy, offline capabilities, and reduced latency.

### Benefits of Local AI

- **🔒 Enhanced Privacy**: Your code and conversations never leave your machine
- **📶 Offline Capability**: Work without an internet connection
- **⚡ Reduced Latency**: Faster response times by eliminating network roundtrips
- **💰 Cost Effective**: No API costs for local model inference
- **🎛️ Full Control**: Choose and customize your preferred models

### Supported Local AI Models

Happy Coder integrates with popular open-source AI models:

- **Llama 3.x** - Meta's latest language models
- **Mistral/Mixtral** - High-performance open models
- **CodeLlama** - Specialized for code understanding
- **Phi-3** - Microsoft's efficient small models
- **Gemma** - Google's open models

### Setup Local AI

#### Prerequisites

1. Install [Ollama](https://ollama.ai/) or [LM Studio](https://lmstudio.ai/)
2. Download your preferred model:

```bash
# For Ollama
ollama pull llama3.2
ollama pull codellama

# Or use any compatible model
```

#### Configuration

1. **Configure the Local AI endpoint in Happy Coder settings**:
   - Open the app settings
   - Navigate to "AI Configuration"
   - Select "Local AI" as your provider
   - Set the endpoint URL (default: `http://localhost:11434` for Ollama)

2. **Environment Variables** (for CLI):

```bash
# Set in your shell configuration (~/.bashrc, ~/.zshrc, etc.)
export HAPPY_AI_PROVIDER="local"
export HAPPY_AI_ENDPOINT="http://localhost:11434"
export HAPPY_AI_MODEL="llama3.2"
```

3. **Start using with Local AI**:

```bash
# The CLI will automatically use your configured Local AI
happy

# Or explicitly specify Local AI
happy --ai-provider local --ai-model llama3.2
```

### Local AI + Voice Features

Happy Coder's voice features work seamlessly with Local AI:

1. **Local Voice Recognition**: Use on-device speech recognition
2. **Local Text-to-Speech**: Generate voice responses locally
3. **Hybrid Mode**: Combine local AI models with cloud-based voice services

To configure:

```bash
# Enable local voice processing
export HAPPY_VOICE_LOCAL=true
```

### Advanced Configuration

#### Custom Model Endpoints

You can configure multiple Local AI endpoints for different use cases:

```bash
# Main coding assistant
export HAPPY_AI_CODING_ENDPOINT="http://localhost:11434"
export HAPPY_AI_CODING_MODEL="codellama"

# Documentation and explanation
export HAPPY_AI_DOCS_ENDPOINT="http://localhost:11435"
export HAPPY_AI_DOCS_MODEL="llama3.2"
```

#### Performance Tuning

Optimize Local AI performance:

```bash
# Adjust context window size
export HAPPY_AI_CONTEXT_SIZE=4096

# Enable GPU acceleration
export HAPPY_AI_GPU=true

# Set number of threads
export HAPPY_AI_THREADS=8
```

### Troubleshooting

**Issue**: Local AI not connecting
- Verify Ollama/LM Studio is running: `curl http://localhost:11434/api/tags`
- Check firewall settings allow local connections
- Ensure the model is downloaded: `ollama list`

**Issue**: Slow responses
- Try a smaller model (e.g., `phi3` instead of `llama3.2:70b`)
- Enable GPU acceleration if available
- Reduce context window size

**Issue**: Encryption errors with Local AI
- Ensure you're using the latest version of Happy Coder
- Local AI traffic is still encrypted end-to-end between devices

### Migration from Cloud to Local AI

To switch from cloud AI (Claude/Codex) to Local AI:

1. Keep your existing sessions - they'll continue to work
2. New sessions can use Local AI by default
3. Mix and match: use cloud AI for complex tasks, local AI for quick queries

## 📚 Documentation & Contributing

- **[Documentation Website](https://happy.engineering/docs/)** - Learn how to use Happy Coder effectively
- **[Edit docs at github.com/slopus/slopus.github.io](https://github.com/slopus/slopus.github.io)** - Help improve our documentation and guides

## License

MIT License - see [LICENSE](LICENSE) for details.

# Local AI Quick Start

Get up and running with Local AI in 5 minutes!

## 🚀 Quick Setup

### 1. Install Ollama (30 seconds)

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: Download from https://ollama.ai/download
```

### 2. Download a Model (2-3 minutes)

```bash
# Fast & lightweight (recommended for first try)
ollama pull phi3

# Or the full-featured model
ollama pull llama3.2
```

### 3. Configure Happy Coder (1 minute)

Create `.env` file in your project root:

```bash
EXPO_PUBLIC_LOCAL_AI_ENABLED=true
EXPO_PUBLIC_LOCAL_AI_ENDPOINT=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
```

### 4. Start Coding!

```bash
happy
# That's it! Local AI is now active
```

## 🎯 Common Commands

```bash
# List available models
ollama list

# Download a new model
ollama pull codellama

# Remove a model
ollama rm phi3

# Check if Ollama is running
curl http://localhost:11434/api/tags
```

## 🔧 Quick Configuration

### For Code-Specific Tasks
```bash
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama
```

### For Faster Responses
```bash
EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
HAPPY_LOCAL_AI_CONTEXT_SIZE=2048
```

### For Better Quality (needs more RAM)
```bash
EXPO_PUBLIC_LOCAL_AI_MODEL=llama3.2:70b
HAPPY_LOCAL_AI_CONTEXT_SIZE=8192
```

## 💡 Model Recommendations

| If you have... | Use this model | Download with |
|----------------|----------------|---------------|
| 4-6 GB RAM | `phi3` | `ollama pull phi3` |
| 6-8 GB RAM | `mistral` | `ollama pull mistral` |
| 8+ GB RAM | `llama3.2` | `ollama pull llama3.2` |
| 16+ GB RAM | `codellama` + `llama3.2` | `ollama pull codellama` |
| 64+ GB RAM | `llama3.2:70b` | `ollama pull llama3.2:70b` |

## 🐛 Quick Troubleshooting

### "Local AI service is not available"
```bash
# Start Ollama
ollama serve
```

### "Model not found"
```bash
# Download the model
ollama pull llama3.2
```

### "Out of memory"
```bash
# Use a smaller model
ollama pull phi3
EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
```

### Slow responses?
```bash
# Reduce context size
HAPPY_LOCAL_AI_CONTEXT_SIZE=2048

# Or use smaller model
EXPO_PUBLIC_LOCAL_AI_MODEL=phi3
```

## 📚 Learn More

- **Full Guide**: [docs/LOCAL_AI_GUIDE.md](./LOCAL_AI_GUIDE.md)
- **Developer Docs**: [docs/LOCAL_AI_DEVELOPER.md](./LOCAL_AI_DEVELOPER.md)
- **Main README**: [README.md](../README.md)

## 🆘 Need Help?

1. Check the [troubleshooting guide](./LOCAL_AI_GUIDE.md#troubleshooting)
2. Open an [issue on GitHub](https://github.com/RemyLoveLogicAI/LVECDE/issues)
3. Review [Ollama docs](https://ollama.ai/docs)

## ✅ Verify Installation

Run these commands to verify everything works:

```bash
# 1. Check Ollama is running
curl http://localhost:11434/api/tags

# 2. List your models
ollama list

# 3. Test a model
ollama run phi3 "Say hello!"

# 4. Start Happy Coder
happy
```

If all commands work, you're ready to go! 🎉

---

**Time to setup**: ~5 minutes  
**Disk space needed**: 2-4 GB per model  
**RAM needed**: 4+ GB (varies by model)  
**Internet**: Only for initial download

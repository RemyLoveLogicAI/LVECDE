# LVECDE Quick Start Guide

Get up and running with LVECDE in 10 minutes.

## Prerequisites

- Node.js 18+ installed
- Yarn package manager
- Code editor (VS Code recommended)

## 1. Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/RemyLoveLogicAI/LVECDE.git
cd LVECDE

# Install dependencies
yarn install
```

## 2. Configure Local AI (3 minutes)

### Option A: Quick Start (Ollama)

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Pull a model
ollama pull codellama:13b

# Copy environment template
cp .env.example .env
```

Your `.env` file should have:
```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b
EXPO_PUBLIC_LOCAL_AI_TYPE=ollama
```

### Option B: Use Existing Setup

If you already have a local AI server running:

```bash
cp .env.example .env
# Edit .env with your settings
```

## 3. Run the App (2 minutes)

### Web (Recommended for Development)

```bash
yarn web
```

Opens browser at http://localhost:8081

### iOS Simulator

```bash
yarn ios
```

### Android Emulator

```bash
yarn android
```

## 4. Verify Setup (3 minutes)

1. **Check TypeScript:**
   ```bash
   yarn typecheck
   ```
   Should complete without errors.

2. **Test Local AI:**
   ```bash
   curl http://localhost:11434/api/generate -d '{
     "model": "codellama:13b",
     "prompt": "Hello"
   }'
   ```
   Should return a response from Ollama.

3. **Open the App:**
   - Web: Visit http://localhost:8081
   - Mobile: Use Expo Go app or simulator
   - Should see LVECDE interface

## Next Steps

### Learn More
- Read [SETUP.md](docs/SETUP.md) for detailed setup
- Check [ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Review [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

### Implement Features
- Create an Ollama provider adapter
- Build the settings UI
- Add tests
- Improve documentation

### Customize
- Change app theme
- Add your own features
- Integrate different AI models
- Deploy to your own infrastructure

## Common Issues

### "Ollama not found"
```bash
# Check if Ollama is running
curl http://localhost:11434
# If not, start it:
ollama serve
```

### "Model not found"
```bash
# List available models
ollama list
# Pull the model you need
ollama pull codellama:13b
```

### "TypeScript errors"
```bash
# Reinstall dependencies
rm -rf node_modules yarn.lock
yarn install
```

### "Metro bundler issues"
```bash
# Clear Metro cache
yarn start --clear
```

## Development Workflow

1. **Make changes** to source code
2. **See changes** hot reload in app
3. **Check types** with `yarn typecheck`
4. **Commit** your changes
5. **Push** to your fork
6. **Create PR** when ready

## Resources

- **Documentation**: [docs/](docs/)
- **Issues**: [GitHub Issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RemyLoveLogicAI/LVECDE/discussions)
- **Original Project**: [Happy Coder](https://github.com/slopus/happy)

## Support

Need help?
1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
3. Ask in [discussions](https://github.com/RemyLoveLogicAI/LVECDE/discussions)
4. Create a new issue if needed

---

**Happy coding with LVECDE!** 🚀

For detailed documentation, see [docs/SETUP.md](docs/SETUP.md)

# LVECDE Setup Guide

Complete setup instructions for deploying LVECDE with local AI integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Local AI Setup](#local-ai-setup)
4. [Development](#development)
5. [Building for Production](#building-for-production)
6. [Deployment](#deployment)
7. [Configuration](#configuration)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required Software

- **Node.js**: Version 18 or higher
- **Yarn**: Version 1.22 or higher
- **Git**: Latest version

### For Mobile Development

#### iOS (macOS only)
- Xcode 15 or higher
- CocoaPods
- iOS Simulator or physical iOS device

#### Android
- Android Studio
- Android SDK (API level 33+)
- Android Emulator or physical Android device

### For Local AI

Choose one of the following:

- **Ollama** (Recommended for beginners)
- **LM Studio** (GUI-based)
- **LocalAI** (Docker-based)
- **Custom OpenAI-compatible server**

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/RemyLoveLogicAI/LVECDE.git
cd LVECDE
```

### 2. Install Dependencies

```bash
yarn install
```

This will:
- Install all npm packages
- Apply any necessary patches
- Set up the development environment

### 3. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
nano .env  # or use your preferred editor
```

Minimal configuration:
```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b
```

## Local AI Setup

### Option 1: Ollama (Recommended)

#### Installation

**macOS:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Download from [ollama.ai](https://ollama.ai/download)

#### Model Setup

```bash
# Pull a code model (13B recommended for balanced performance)
ollama pull codellama:13b

# Alternative models:
ollama pull deepseek-coder:6.7b    # Faster, smaller
ollama pull wizardcoder:15b        # Larger, more capable

# Verify installation
ollama list
```

#### Start Server

```bash
# Ollama usually starts automatically
# To manually start:
ollama serve

# To run in background:
nohup ollama serve &
```

### Option 2: LM Studio

#### Installation

1. Download from [lmstudio.ai](https://lmstudio.ai/)
2. Install and launch LM Studio
3. Download a model from the library (search for "CodeLlama" or "WizardCoder")
4. Go to "Local Server" tab
5. Start the server

#### Configuration

In your `.env`:
```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:1234/v1
EXPO_PUBLIC_LOCAL_AI_MODEL=TheBloke/CodeLlama-13B-Instruct-GGUF
EXPO_PUBLIC_LOCAL_AI_TYPE=openai
```

### Option 3: LocalAI with Docker

#### Installation

```bash
# Pull LocalAI image
docker pull localai/localai:latest

# Create models directory
mkdir -p models

# Run LocalAI
docker run -d \
  --name localai \
  -p 8080:8080 \
  -v $PWD/models:/models \
  localai/localai:latest
```

#### Add a Model

```bash
# Download a model (example)
cd models
wget https://huggingface.co/TheBloke/CodeLlama-13B-GGUF/resolve/main/codellama-13b.Q4_K_M.gguf

# Create model config
cat > codellama.yaml <<EOF
name: codellama
parameters:
  model: codellama-13b.Q4_K_M.gguf
  temperature: 0.7
  top_p: 0.95
EOF
```

#### Configuration

In your `.env`:
```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:8080/v1
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama
EXPO_PUBLIC_LOCAL_AI_TYPE=openai
```

## Development

### Start Development Server

```bash
# Start Expo dev server
yarn start

# Or start specific platform:
yarn web      # Web browser
yarn ios      # iOS simulator
yarn android  # Android emulator
```

### Development Workflow

1. **Start Local AI Server** (Ollama, LM Studio, etc.)
2. **Verify AI Connection**
   ```bash
   curl http://localhost:11434/api/generate -d '{
     "model": "codellama:13b",
     "prompt": "test"
   }'
   ```
3. **Start LVECDE**
   ```bash
   yarn start
   ```
4. **Open in Browser or Simulator**
5. **Test AI Integration**
   - Create a new session
   - Send a message
   - Verify response from local AI

### Hot Reload

The app supports hot reload during development:
- Code changes auto-refresh
- Fast iteration on features
- Preserves app state when possible

### Debug Mode

Enable debug logging:
```bash
# In .env
EXPO_PUBLIC_DEBUG=1
EXPO_PUBLIC_LOCAL_AI_DEBUG=1
```

View logs:
```bash
# Console will show:
# [Local AI] Connected to http://localhost:11434
# [Local AI] Using model: codellama:13b
# [Local AI] Request: {...}
# [Local AI] Response: {...}
```

## Building for Production

### Web

```bash
# Build for web
yarn web --no-dev --minify

# Output in dist/
```

Deploy `dist/` to any static hosting:
- Netlify
- Vercel
- GitHub Pages
- AWS S3
- Your own server

### iOS

#### Requirements
- macOS with Xcode
- Apple Developer Account
- Provisioning profiles

#### Build Steps

```bash
# Generate native projects
yarn prebuild

# Open in Xcode
open ios/LVECDE.xcworkspace

# In Xcode:
# 1. Select your team
# 2. Update bundle identifier if needed
# 3. Build (Cmd+B)
# 4. Archive (Product > Archive)
# 5. Distribute to App Store or TestFlight
```

### Android

#### Requirements
- Android Studio
- Java 11+
- Android SDK

#### Build Steps

```bash
# Generate native projects
yarn prebuild

# Build APK
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

#### Build AAB (for Google Play)

```bash
cd android
./gradlew bundleRelease

# AAB location:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Deployment

### Self-Hosted Backend (Optional)

If you want to self-host the sync server:

1. **Clone happy-server:**
   ```bash
   git clone https://github.com/slopus/happy-server.git
   cd happy-server
   ```

2. **Configure and deploy**
   Follow happy-server documentation

3. **Update LVECDE config:**
   ```bash
   EXPO_PUBLIC_HAPPY_SERVER_URL=https://your-server.com
   ```

### Firewall Configuration

For mobile access to local AI:

**macOS:**
```bash
# Allow incoming connections
sudo defaults write /Library/Preferences/com.apple.alf globalstate -int 0

# Or add specific port
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/ollama
```

**Linux (ufw):**
```bash
sudo ufw allow 11434/tcp
sudo ufw reload
```

**Linux (firewalld):**
```bash
sudo firewall-cmd --permanent --add-port=11434/tcp
sudo firewall-cmd --reload
```

### Network Access

#### Local Network Access

Find your computer's IP:
```bash
# macOS/Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig

# Or use:
hostname -I  # Linux
ipconfig getifaddr en0  # macOS
```

Update `.env`:
```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://192.168.1.100:11434
```

#### VPN Access

To access from outside your network:

1. **Set up VPN** (WireGuard, OpenVPN, Tailscale)
2. **Configure AI server to listen on VPN interface**
3. **Use VPN IP in configuration**

```bash
EXPO_PUBLIC_LOCAL_AI_URL=http://10.0.0.5:11434
```

## Configuration

### Advanced Settings

#### Performance Tuning

```bash
# Increase timeout for large models
EXPO_PUBLIC_LOCAL_AI_TIMEOUT=60000  # 60 seconds

# Adjust context size
EXPO_PUBLIC_LOCAL_AI_CONTEXT_SIZE=4096

# Limit conversation history
EXPO_PUBLIC_LOCAL_AI_MAX_HISTORY=10
```

#### Model Parameters

```bash
# More creative responses
EXPO_PUBLIC_LOCAL_AI_TEMPERATURE=0.9

# More deterministic responses
EXPO_PUBLIC_LOCAL_AI_TEMPERATURE=0.2

# Sampling parameters
EXPO_PUBLIC_LOCAL_AI_TOP_P=0.95
EXPO_PUBLIC_LOCAL_AI_TOP_K=40
```

### Multiple Environments

Create environment-specific files:

```bash
.env.development    # Local development
.env.staging        # Staging environment
.env.production     # Production
```

Load specific environment:
```bash
APP_ENV=production yarn start
```

## Troubleshooting

### Installation Issues

#### "yarn install fails"

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules yarn.lock
yarn cache clean
yarn install
```

#### "Expo CLI not found"

**Solution:**
```bash
npm install -g expo-cli
```

### Local AI Issues

#### "Connection refused to localhost:11434"

**Check server is running:**
```bash
# Ollama
ps aux | grep ollama

# Test endpoint
curl http://localhost:11434/api/generate -d '{"model":"codellama:13b","prompt":"test"}'
```

**Solutions:**
- Start Ollama: `ollama serve`
- Check firewall settings
- Try `http://127.0.0.1:11434` instead of `localhost`

#### "Model not found"

**Solution:**
```bash
# List available models
ollama list

# Pull missing model
ollama pull codellama:13b
```

#### "Out of memory"

**Solutions:**
- Use smaller model (7B instead of 13B)
- Use quantized model: `ollama pull codellama:13b-q4_0`
- Close other applications
- Add more RAM or swap space

### Mobile Development Issues

#### "iOS build fails"

**Solutions:**
```bash
# Clean and reinstall pods
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
```

#### "Android build fails"

**Solutions:**
```bash
# Clean gradle
cd android
./gradlew clean
./gradlew assembleDebug
cd ..
```

### Performance Issues

#### "Slow AI responses"

**Solutions:**
- Use GPU acceleration if available
- Switch to smaller/quantized model
- Reduce `max_tokens` setting
- Check CPU usage during generation
- Ensure model fits in RAM

#### "App crashes on mobile"

**Solutions:**
- Check device memory
- Review crash logs: `expo start --dev-client`
- Test on different device/emulator
- Reduce concurrent AI requests

### Network Issues

#### "Can't access from mobile device"

**Solutions:**
```bash
# Use computer's local IP, not localhost
EXPO_PUBLIC_LOCAL_AI_URL=http://192.168.1.100:11434

# Ensure both devices on same network
ping 192.168.1.100  # from mobile

# Check firewall allows connections
sudo ufw allow 11434  # Linux
```

## Getting Help

### Resources

- [Local AI Integration Guide](./LOCAL_AI_INTEGRATION.md)
- [GitHub Issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
- [Discussions](https://github.com/RemyLoveLogicAI/LVECDE/discussions)
- [Original Happy Coder Docs](https://happy.engineering/docs/)

### Reporting Issues

When reporting issues, include:
1. OS and version
2. Node.js and Yarn versions
3. Local AI setup (Ollama/LM Studio/etc.)
4. Model being used
5. Error messages and logs
6. Steps to reproduce

### Community

- Star the repo for updates
- Watch releases for new versions
- Contribute improvements via pull requests

## Next Steps

1. ✅ Complete setup
2. ✅ Test local AI connection
3. ✅ Develop and customize
4. 📱 Build for your target platforms
5. 🚀 Deploy to users

Happy coding with LVECDE! 🎉

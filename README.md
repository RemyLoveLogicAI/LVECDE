<div align="center"><img src="/logo.png" width="200" title="LVECDE" alt="LVECDE"/></div>

<h1 align="center">
  LVECDE - Local Voice-Enabled Code Development Environment
</h1>

<h4 align="center">
A customized fork of Happy Coder with Local AI integration for private, voice-enabled development.
</h4>

<div align="center">
  
[🌐 **Web App**](#) • [📱 **iOS**](#) • [🤖 **Android**](#) • [⭐ **Star on GitHub**](https://github.com/RemyLoveLogicAI/LVECDE) • [📖 **Original Project**](https://github.com/slopus/happy)

</div>

## 🎯 About LVECDE

LVECDE (Local Voice-Enabled Code Development Environment) is a fork of the popular Happy Coder project, customized to integrate with **Local AI** solutions instead of cloud-based services. This fork maintains all the core functionality while adding:

- 🤖 **Local AI Integration** - Run AI models locally for complete privacy
- 🔐 **Enhanced Privacy** - All processing happens on your infrastructure
- 🎙️ **Local Voice Processing** - Voice assistant powered by local models
- 🚀 **Open Architecture** - Easy to extend and customize
- 🌍 **Multi-language Support** - Interface available in 7 languages

## ✨ Key Features

### From Original Happy Coder
- 📱 **Mobile & Desktop Access** - iOS, Android, and Web support
- 🔐 **End-to-End Encryption** - Your code never leaves your devices unencrypted
- ⚡ **Real-time Sync** - Instant synchronization across all devices
- 🎙️ **Voice Assistant** - Natural conversation with your AI
- 🔄 **GitHub Integration** - Connect your developer identity
- 📝 **File Management** - Syntax highlighting and tree navigation

### LVECDE Enhancements
- 🏠 **Local AI Models** - Deploy and run AI models on your own infrastructure
- 🎯 **Custom Model Support** - Integrate with any local LLM (Ollama, LM Studio, etc.)
- 🔧 **Extended API** - Enhanced integration points for local services
- 📊 **Resource Monitoring** - Track local model performance
- 🛠️ **Developer Tools** - Additional debugging and development features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- iOS/Android development environment (for mobile)
- Local AI model server (Ollama, LM Studio, or similar)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RemyLoveLogicAI/LVECDE.git
   cd LVECDE
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure your local AI endpoint**
   ```bash
   # Create .env file
   cp .env.example .env
   # Edit EXPO_PUBLIC_LOCAL_AI_URL to point to your local AI server
   ```

4. **Start development server**
   ```bash
   # Web
   yarn web
   
   # iOS
   yarn ios
   
   # Android
   yarn android
   ```

## 🤖 Local AI Integration

LVECDE is designed to work with any local AI solution. Example configurations:

### Ollama Integration
```javascript
// Configure in your environment
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:11434
EXPO_PUBLIC_LOCAL_AI_MODEL=codellama:13b
```

### LM Studio
```javascript
EXPO_PUBLIC_LOCAL_AI_URL=http://localhost:1234/v1
EXPO_PUBLIC_LOCAL_AI_MODEL=TheBloke/CodeLlama-13B-Instruct-GGUF
```

### Custom Server
```javascript
EXPO_PUBLIC_LOCAL_AI_URL=http://your-server:port
EXPO_PUBLIC_LOCAL_AI_MODEL=your-model-name
```

## 📦 Architecture

The application uses:
- **React Native** with **Expo SDK 53** for cross-platform support
- **TypeScript** with strict mode for type safety
- **Unistyles** for theming and responsive design
- **Expo Router v5** for navigation
- **Socket.io** for real-time communication
- **tweetnacl** for encryption

### Project Structure
```
sources/
├── app/              # Expo Router screens
├── auth/             # Authentication (QR code based)
├── components/       # Reusable UI components
├── sync/             # Real-time sync engine
├── encryption/       # E2E encryption utilities
├── realtime/         # Voice and real-time features
└── text/             # Internationalization
```

## 🌍 Localization

LVECDE supports 7 languages:
- 🇬🇧 English (en)
- 🇷🇺 Russian (ru)
- 🇵🇱 Polish (pl)
- 🇪🇸 Spanish (es)
- 🇵🇹 Portuguese (pt)
- 🇨🇳 Chinese Simplified (zh-Hans)
- Catalan (ca)

To add a new language, see [sources/text/README.md](sources/text/README.md).

## 🛠️ Development

### Available Scripts

```bash
# Development
yarn start           # Start Expo dev server
yarn web            # Run on web
yarn ios            # Run on iOS simulator
yarn android        # Run on Android emulator

# Building
yarn prebuild       # Generate native directories

# Testing & Quality
yarn typecheck      # Run TypeScript checks
yarn test          # Run tests

# Deployment
yarn ota           # Deploy OTA update
```

### Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `yarn typecheck` to ensure type safety
5. Submit a pull request

## 📋 Differences from Happy Coder

| Feature | Happy Coder | LVECDE |
|---------|-------------|--------|
| AI Backend | Cloud-based (Claude/Codex) | Local AI models |
| Voice Processing | Cloud services | Local processing |
| Privacy Level | E2E encrypted | E2E + Local processing |
| Deployment | App stores + Web | Self-hosted |
| Cost | Subscription-based | Free (your hardware) |
| Customization | Limited | Fully customizable |

## 🙏 Acknowledgments

LVECDE is a fork of [Happy Coder](https://github.com/slopus/happy) by the Happy Coder Contributors. We are grateful for their excellent work creating a solid foundation for mobile AI development.

The original Happy Coder provides:
- Mobile client for Claude Code & Codex
- End-to-end encryption
- Real-time synchronization
- Cross-platform support

LVECDE builds on this foundation to add local AI capabilities and enhanced customization.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

This is a fork of Happy Coder, which is also MIT licensed. Both copyright notices are preserved in the LICENSE file as required.

## 🔗 Links

- **Original Project**: [Happy Coder](https://github.com/slopus/happy)
- **Documentation**: [LVECDE Docs](docs/)
- **Issues**: [GitHub Issues](https://github.com/RemyLoveLogicAI/LVECDE/issues)
- **Discussions**: [GitHub Discussions](https://github.com/RemyLoveLogicAI/LVECDE/discussions)

## 🛡️ Security

LVECDE maintains the same security standards as Happy Coder:
- End-to-end encryption for all sensitive data
- QR code-based device authentication
- Secure local storage
- No telemetry or tracking

Additionally, running AI locally means:
- Your code never leaves your infrastructure
- No cloud AI service has access to your data
- Complete control over model behavior

## ⚠️ Important Notes

1. **Local AI Performance**: Running AI models locally requires adequate hardware (GPU recommended for optimal performance)
2. **Network Configuration**: Ensure your local AI server is accessible from all devices
3. **Model Selection**: Choose models appropriate for your use case and hardware
4. **Backup Strategy**: Implement regular backups of your local AI configurations

## 📞 Support

For questions and support:
- Open an [issue](https://github.com/RemyLoveLogicAI/LVECDE/issues)
- Check the [documentation](docs/)
- Refer to the original [Happy Coder docs](https://happy.engineering/docs/)

---

<div align="center">

**Built with ❤️ on top of [Happy Coder](https://github.com/slopus/happy)**

Made for developers who value privacy and local control

</div>

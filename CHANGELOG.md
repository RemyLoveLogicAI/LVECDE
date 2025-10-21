# Changelog

## Version 1.0.0 - 2025-10-21

**LVECDE Fork - Initial Release**

This is the initial release of LVECDE (Local Voice-Enabled Code Development Environment), a fork of Happy Coder focused on local AI integration and enhanced privacy.

### Fork Changes
- Rebranded from "Happy" to "LVECDE" with new app identity
- Updated bundle identifiers for independent distribution
- Removed cloud service dependencies for self-hosted deployment
- Prepared architecture for Local AI model integration
- Updated documentation with fork information and setup guides
- Maintained MIT License compliance with proper attribution

### Architectural Preparation
- Designed integration points for Local AI models (Ollama, LM Studio, etc.)
- Prepared voice processing pipeline for local model integration
- Enhanced configuration system for custom AI endpoints
- Added environment variable support for flexible deployment

### Documentation Updates
- Comprehensive README with Local AI integration guide
- Setup instructions for self-hosted deployment
- Architecture documentation and customization guides
- Comparison table with original Happy Coder
- Security and privacy enhancements documentation

### Inherited Features from Happy Coder v1.5.1
- End-to-end encrypted session management
- QR code authentication for secure device linking
- Real-time synchronization across devices
- Voice assistant capabilities (ready for local model integration)
- File manager with syntax highlighting
- GitHub OAuth integration
- Multi-platform support (iOS, Android, Web)
- Internationalization support (7 languages)
- Dark theme with automatic detection
- Daemon Mode for instant remote access
- Codex integration support

---

## Original Happy Coder Changelog

The following versions are from the original Happy Coder project before the fork.

## Version 4 - 2025-09-12

This release revolutionizes remote development with Codex integration and Daemon Mode, enabling instant AI assistance from anywhere. Start coding sessions with a single tap while maintaining complete control over your development environment.

- Introduced Codex support for advanced AI-powered code completion and generation capabilities.
- Implemented Daemon Mode as the new default, enabling instant remote session initiation without manual CLI startup.
- Added one-click session launch from mobile devices, automatically connecting to your development machine.
- Added ability to connect anthropic and gpt accounts to account

## Version 3 - 2025-08-29

This update introduces seamless GitHub integration, bringing your developer identity directly into Happy while maintaining our commitment to privacy and security.

- Added GitHub account connection through secure OAuth authentication flow
- Integrated profile synchronization displaying your GitHub avatar, name, and bio
- Implemented encrypted token storage on our backend for additional security protection
- Enhanced settings interface with personalized profile display when connected
- Added one-tap GitHub disconnect functionality with confirmation protection
- Improved account management with clear connection status indicators

## Version 2 - 2025-06-26

This update focuses on seamless device connectivity, visual refinements, and intelligent voice interactions for an enhanced user experience.

- Added QR code authentication for instant and secure device linking across platforms
- Introduced comprehensive dark theme with automatic system preference detection
- Improved voice assistant performance with faster response times and reduced latency
- Added visual indicators for modified files directly in the session list
- Implemented preferred language selection for voice assistant supporting 15+ languages

## Version 1 - 2025-05-12

Welcome to Happy - your secure, encrypted mobile companion for Claude Code. This inaugural release establishes the foundation for private, powerful AI interactions on the go.

- Implemented end-to-end encrypted session management ensuring complete privacy
- Integrated intelligent voice assistant with natural conversation capabilities
- Added experimental file manager with syntax highlighting and tree navigation
- Built seamless real-time synchronization across all your devices
- Established native support for iOS, Android, and responsive web interfaces
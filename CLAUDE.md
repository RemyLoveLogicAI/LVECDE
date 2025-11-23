# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `yarn start` - Start the Expo development server
- `yarn ios` - Run the app on iOS simulator
- `yarn android` - Run the app on Android emulator  
- `yarn web` - Run the app in web browser
- `yarn prebuild` - Generate native iOS and Android directories
- `yarn typecheck` - Run TypeScript type checking after all changes

### Testing
- `yarn test` - Run tests in watch mode (Vitest with jest-expo preset)
- Test files use `.test.ts` suffix for unit tests or `.spec.ts` for integration/behavior tests
- 44+ tests across the codebase with 100% pass rate required
- Test files located alongside source files (e.g., `sync/localAI.test.ts`, `utils/debounce.test.ts`)
- Coverage: sync system, state management, encryption, AI providers, utilities, components

### Production
- `yarn ota` - Deploy over-the-air updates via EAS Update to production branch

## Changelog Management

The app includes an in-app changelog feature that displays version history to users. When making changes:

### Adding Changelog Entries

1. **Always update the latest version** in `/CHANGELOG.md` when adding new features or fixes
2. **Format**: Each version follows this structure:
   ```markdown
   ## Version [NUMBER] - YYYY-MM-DD
   - Brief description of change/feature/fix
   - Another change description
   - Keep descriptions user-friendly and concise
   ```

3. **Version numbering**: Increment the version number for each release (1, 2, 3, etc.)
4. **Date format**: Use ISO date format (YYYY-MM-DD)

### Regenerating Changelog Data

After updating CHANGELOG.md, run:
```bash
npx tsx sources/scripts/parseChangelog.ts
```

This generates `sources/changelog/changelog.json` which is used by the app.

### Best Practices

- Write changelog entries from the user's perspective
- Start each entry with a verb (Added, Fixed, Improved, Updated, Removed)
- Group related changes together
- Keep descriptions concise but informative
- Focus on what changed, not technical implementation details
- The changelog is automatically parsed during `yarn ota` and `yarn ota:production`
- Always improve and expand basic changelog descriptions to be more user-friendly and informative
- Include a brief summary paragraph before bullet points for each version explaining the theme of the update

### Example Entry

```markdown
## Version 4 - 2025-01-26
- Added dark mode support across all screens
- Fixed navigation issues on tablet devices  
- Improved app startup performance by 30%
- Updated authentication flow for better security
- Removed deprecated API endpoints
```

## Architecture Overview

### Core Technology Stack
- **React** 19.1.0 with **React Native** 0.81.4
- **Expo** SDK 54
- **TypeScript** 5.9.2 with strict mode enabled
- **Unistyles** 3.0.10 for cross-platform styling with themes and breakpoints
- **Expo Router** v6 for file-based routing with typed routes
- **Socket.io** 4.8.1 for real-time WebSocket communication
- **tweetnacl** (libsodium-wrappers) for end-to-end encryption
- **Vitest** 3.2.4 for testing (with jest-expo preset)
- **Zustand** 5.0.6 for additional state management

### Project Structure
```
sources/
├── app/                    # Expo Router screens (file-based routing)
│   ├── (app)/             # Authenticated app routes
│   └── _layout.tsx        # Root navigation layout
├── auth/                   # Authentication logic (QR code based)
├── components/             # Reusable UI components
│   ├── Item.tsx           # Core list item component
│   ├── ItemList.tsx       # Container for lists
│   ├── ItemGroup.tsx      # Grouped list component
│   ├── layout.ts          # Layout width constraints
│   ├── CommandPalette/    # Command palette system
│   ├── autocomplete/      # Text autocomplete
│   ├── diff/              # Git diff visualization
│   ├── markdown/          # Markdown rendering
│   └── navigation/        # Navigation components (Header)
├── sync/                   # Real-time sync engine with encryption
│   ├── sync.ts            # Main sync orchestration class
│   ├── reducer/           # State management reducers
│   ├── encryption/        # End-to-end encryption
│   ├── git-parsers/       # Git status/diff parsers
│   ├── revenueCat/        # In-app purchases
│   ├── localAI.ts         # Local AI configuration
│   ├── localAIProvider.ts # Local AI session management
│   └── localAIEnv.ts      # Environment variable handling
├── hooks/                  # Custom React hooks (20+ hooks)
│   ├── useHappyAction.ts  # Async action error handling
│   ├── useGlobalKeyboard.ts # Web keyboard shortcuts
│   └── useAutocomplete.ts # Text autocomplete logic
├── modal/                  # Cross-platform modal system
│   ├── ModalManager.ts    # Modal orchestration
│   ├── ModalProvider.tsx  # React context provider
│   └── types.ts           # Modal type definitions
├── text/                   # Internationalization (i18n)
│   ├── translations/      # Language files (en, ru, pl, es, pt, ca, zh-Hans)
│   ├── _default.ts        # English default translations
│   ├── _all.ts            # Language metadata & configuration
│   └── index.ts           # Type-safe translation function
├── utils/                  # Utility functions
│   ├── sync.ts            # InvalidateSync & ValueSync classes
│   ├── lock.ts            # AsyncLock for exclusive async operations
│   └── errors.ts          # HappyError class
├── realtime/               # WebSocket/real-time features
├── track/                  # Analytics & tracking
├── -session/               # Session management
├── -zen/                   # Zen/todo features
├── docs/                   # In-app documentation
├── changelog/              # Changelog data
├── scripts/                # Build scripts
│   └── parseChangelog.ts  # CHANGELOG.md parser
└── trash/                  # Temporary scripts & tests
```

### Key Architectural Patterns

1. **Authentication Flow**: QR code-based authentication using expo-camera with challenge-response mechanism
2. **Data Synchronization**: WebSocket-based real-time sync with automatic reconnection and state management
3. **Encryption**: End-to-end encryption using tweetnacl for all sensitive data
4. **State Management**: React Context for auth state, custom reducer for sync state
5. **Platform-Specific Code**: Separate implementations for web vs native when needed

### Development Guidelines

- Use **4 spaces** for indentation
- Use **yarn** instead of npm for package management
- Path alias `@/*` maps to `./sources/*`
- TypeScript strict mode is enabled - ensure all code is properly typed
- Follow existing component patterns when creating new UI components
- Real-time sync operations are handled through SyncSocket and SyncSession classes
- Store all temporary scripts and any test outside of unit tests in sources/trash folder
- When setting screen parameters ALWAYS set them in _layout.tsx if possible this avoids layout shifts
- **Never use Alert module from React Native, always use @sources/modal/index.ts instead**
- **Always apply layout width constraints** from `@/components/layout` to full-screen ScrollViews and content containers for responsive design across device sizes
- Always run `yarn typecheck` after all changes to ensure type safety

### Internationalization (i18n) Guidelines

**CRITICAL: Always use the `t(...)` function for ALL user-visible strings**

#### Basic Usage
```typescript
import { t } from '@/text';

// ✅ Simple constants
t('common.cancel')              // "Cancel"
t('settings.title')             // "Settings"

// ✅ Functions with parameters
t('common.welcome', { name: 'Steve' })           // "Welcome, Steve!"
t('time.minutesAgo', { count: 5 })               // "5 minutes ago"
t('errors.fieldError', { field: 'Email', reason: 'Invalid format' })
```

#### Adding New Translations

1. **Check existing keys first** - Always check if the string already exists in the `common` object or other sections before adding new keys
2. **Think about context** - Consider the screen/component context when choosing the appropriate section (e.g., `settings.*`, `session.*`, `errors.*`)
3. **Add to ALL languages** - When adding new strings, you MUST add them to all language files in `sources/text/translations/` (currently: `en`, `ru`, `pl`, `es`, `pt`, `ca`, `zh-Hans` - 7 languages total)
4. **Use descriptive key names** - Use clear, hierarchical keys like `newSession.machineOffline` rather than generic names
5. **Language metadata** - All supported languages and their metadata are centralized in `sources/text/_all.ts`

#### Translation Structure
```typescript
// String constants for static text
cancel: 'Cancel',

// Functions for dynamic text with typed parameters  
welcome: ({ name }: { name: string }) => `Welcome, ${name}!`,
itemCount: ({ count }: { count: number }) => 
    count === 1 ? '1 item' : `${count} items`,
```

#### Key Sections
- `common.*` - Universal strings used across the app (buttons, actions, status)
- `settings.*` - Settings screen specific strings
- `session.*` - Session management and display
- `errors.*` - Error messages and validation
- `modals.*` - Modal dialogs and popups
- `components.*` - Component-specific strings organized by component name

#### Language Configuration

The app uses a centralized language configuration system:

- **`sources/text/_all.ts`** - Centralized language metadata including:
  - `SupportedLanguage` type definition
  - `SUPPORTED_LANGUAGES` with native names and metadata
  - Helper functions: `getLanguageNativeName()`, `getLanguageEnglishName()`
  - Language constants: `SUPPORTED_LANGUAGE_CODES`, `DEFAULT_LANGUAGE`

- **Adding new languages:**
  1. Add the language code to the `SupportedLanguage` type in `_all.ts`
  2. Add language metadata to `SUPPORTED_LANGUAGES` object
  3. Create new translation file in `sources/text/translations/[code].ts`
  4. Add import and export in `sources/text/index.ts`

#### Important Rules
- **Never hardcode strings** in JSX - always use `t('key')`
- **Dev pages exception** - Development/debug pages can skip i18n
- **Check common first** - Before adding new keys, check if a suitable translation exists in `common`
- **Context matters** - Consider where the string appears to choose the right section
- **Update all languages** - New strings must be added to every language file
- **Use centralized language names** - Import language names from `_all.ts` instead of translation keys
- **Always re-read translations** - When new strings are added, always re-read the translation files to understand the existing structure and patterns before adding new keys
- **Use translations for common strings** - Always use the translation function `t()` for any user-visible string that is translatable, especially common UI elements like buttons, labels, and messages
- **Use the i18n-translator agent** - When adding new translatable strings or verifying existing translations, use the i18n-translator agent to ensure consistency across all language files
- **Beware of technical terms** - When translating technical terms, consider:
  - Keep universally understood terms like "CLI", "API", "URL", "JSON" in their original form
  - Translate terms that have well-established equivalents in the target language
  - Use descriptive translations for complex technical concepts when direct translations don't exist
  - Maintain consistency across all technical terminology within the same language

#### i18n-Translator Agent

When working with translations, use the **i18n-translator** agent for:
- Adding new translatable strings to the application
- Verifying existing translations across all language files
- Ensuring translations are consistent and contextually appropriate
- Checking that all required languages have new strings
- Validating that translations fit the UI context (headers, buttons, multiline text)

The agent should be called whenever new user-facing text is introduced to the codebase or when translation verification is needed.

### Important Files

- `sources/sync/types.ts` - Core type definitions for the sync protocol
- `sources/sync/reducer.ts` - State management logic for sync operations
- `sources/auth/AuthContext.tsx` - Authentication state management
- `sources/app/_layout.tsx` - Root navigation structure
- `sources/sync/sync.ts` - Main sync orchestration class
- `sources/utils/sync.ts` - InvalidateSync & ValueSync classes
- `sources/utils/lock.ts` - AsyncLock for exclusive async operations
- `sources/modal/index.ts` - Modal system (replaces React Native Alert)
- `sources/hooks/useHappyAction.ts` - Async action error handling

### State Management

The app uses a custom sync system centered around the `Sync` class for primary state management.

#### Core Patterns

**1. InvalidateSync** (`sources/utils/sync.ts`)
- Invalidation-based synchronization for resources
- Automatic retry with exponential backoff
- Queue management for pending operations
- Used for: sessions, settings, profile, machines, artifacts, friends, feed

```typescript
// Trigger invalidation and refetch
sync.sessionsSync.invalidate();

// Wait for completion
await sync.settingsSync.invalidateAndAwait();
```

**2. ValueSync** (`sources/utils/sync.ts`)
- Value-based synchronization for data changes
- Processes latest value only (not queued)
- Automatic retry mechanism
- Used for real-time updates

**3. AsyncLock** (`sources/utils/lock.ts`)
- Exclusive async operation locking
- Prevents race conditions in critical sections
- Used for font loading, encryption operations, etc.

```typescript
import { AsyncLock } from '@/utils/lock';

const lock = new AsyncLock();

await lock.inLock(async () => {
    // Critical section - only one execution at a time
});
```

**4. React Context**
- `AuthProvider` - Authentication state
- `ModalProvider` - Modal management
- `RealtimeProvider` - WebSocket connections
- `CommandPaletteProvider` - Command palette state

**5. Zustand**
- Used for specific feature state (not global)
- Lighter weight for component-level state

#### Data Flow
```
User Action
    ↓
Component calls sync.method()
    ↓
InvalidateSync.invalidate()
    ↓
API call with encryption (tweetnacl)
    ↓
WebSocket update (Socket.io)
    ↓
Storage persistence (MMKV)
    ↓
Component re-render
```

### Custom Header Component

The app includes a custom header component (`sources/components/Header.tsx`) that provides consistent header rendering across platforms and integrates with React Navigation.

#### Usage with React Navigation:
```tsx
import { NavigationHeader } from '@/components/Header';

// As default for all screens in Stack navigator:
<Stack
    screenOptions={{
        header: NavigationHeader,
        // Other default options...
    }}
>

// Or for individual screens:
<Stack.Screen
    name="settings"
    options={{
        header: NavigationHeader,
        headerTitle: 'Settings',
        headerSubtitle: 'Manage your preferences', // Custom extension
        headerTintColor: '#000',
        // All standard React Navigation header options are supported
    }}
/>
```

The custom header supports all standard React Navigation header options plus:
- `headerSubtitle`: Display a subtitle below the main title
- `headerSubtitleStyle`: Style object for the subtitle text

This ensures consistent header appearance and behavior across iOS, Android, and web platforms.

## Unistyles Styling Guide

### Creating Styles

Always use `StyleSheet.create` from 'react-native-unistyles':

```typescript
import { StyleSheet } from 'react-native-unistyles'

const styles = StyleSheet.create((theme, runtime) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: runtime.insets.top,
        paddingHorizontal: theme.margins.md,
    },
    text: {
        color: theme.colors.typography,
        fontSize: 16,
    }
}))
```

### Using Styles in Components

For React Native components, provide styles directly:

```typescript
import React from 'react'
import { View, Text } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

const styles = StyleSheet.create((theme, runtime) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: runtime.insets.top,
    },
    text: {
        color: theme.colors.typography,
        fontSize: 16,
    }
}))

const MyComponent = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Hello World</Text>
        </View>
    )
}
```

For other components, use `useStyles` hook:

```typescript
import React from 'react'
import { CustomComponent } from '@/components/CustomComponent'
import { useStyles } from 'react-native-unistyles'

const MyComponent = () => {
    const { styles, theme } = useStyles(styles)
    
    return (
        <CustomComponent style={styles.container} />
    )
}
```

### Variants

Create dynamic styles with variants:

```typescript
const styles = StyleSheet.create(theme => ({
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        variants: {
            color: {
                primary: {
                    backgroundColor: theme.colors.primary,
                },
                secondary: {
                    backgroundColor: theme.colors.secondary,
                },
                default: {
                    backgroundColor: theme.colors.background,
                }
            },
            size: {
                small: {
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                },
                large: {
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                }
            }
        }
    }
}))

// Usage
const { styles } = useStyles(styles, {
    button: {
        color: 'primary',
        size: 'large'
    }
})
```

### Media Queries

Use media queries for responsive design:

```typescript
import { StyleSheet, mq } from 'react-native-unistyles'

const styles = StyleSheet.create(theme => ({
    container: {
        padding: theme.margins.sm,
        backgroundColor: {
            [mq.only.width(0, 768)]: theme.colors.background,
            [mq.only.width(768)]: theme.colors.secondary,
        }
    }
}))
```

### Breakpoints

Access current breakpoint in components:

```typescript
const MyComponent = () => {
    const { breakpoint } = useStyles()
    
    const isTablet = breakpoint === 'md' || breakpoint === 'lg'
    
    return (
        <View>
            {isTablet ? <TabletLayout /> : <MobileLayout />}
        </View>
    )
}
```

### Special Component Considerations

#### Expo Image
- **Size properties** (`width`, `height`) must be set outside of Unistyles stylesheet as inline styles
- **`tintColor` property** must be set directly on the component, not in style prop
- All other styling goes through Unistyles

```typescript
import { Image } from 'expo-image'
import { StyleSheet, useStyles } from 'react-native-unistyles'

const styles = StyleSheet.create((theme) => ({
    image: {
        borderRadius: 8,
        backgroundColor: theme.colors.background, // Other styles use theme
    }
}))

const MyComponent = () => {
    const { theme } = useStyles()
    
    return (
        <Image 
            style={[{ width: 100, height: 100 }, styles.image]}  // Size as inline styles
            tintColor={theme.colors.primary}                     // tintColor goes on component
            source={{ uri: 'https://example.com/image.jpg' }}
        />
    )
}
```

### Best Practices

1. **Always use `StyleSheet.create`** from 'react-native-unistyles'
2. **Provide styles directly** to components from 'react-native' and 'react-native-reanimated' packages
3. **Use `useStyles` hook only** for other components (but try to avoid it when possible)
4. **Always use function mode** when you need theme or runtime access
5. **Use variants** for component state-based styling instead of conditional styles
6. **Leverage breakpoints** for responsive design rather than manual dimension calculations
7. **Keep styles close to components** but extract common patterns to shared stylesheets
8. **Use TypeScript** for better developer experience and type safety

## Local AI Integration

The app supports Local AI models through Ollama, LM Studio, and custom model servers, enabling privacy-focused, offline-capable AI functionality.

### Configuration

Set environment variables in `.env` file (see `.env.example` for template):

```bash
# Enable/disable Local AI
EXPO_PUBLIC_LOCAL_AI_ENABLED=true

# Provider: "ollama", "lmstudio", or "custom"
EXPO_PUBLIC_LOCAL_AI_PROVIDER=ollama

# Endpoint URL
EXPO_PUBLIC_LOCAL_AI_ENDPOINT=http://localhost:11434

# Model name
EXPO_PUBLIC_LOCAL_AI_MODEL=llama3.2

# Performance tuning (optional)
HAPPY_LOCAL_AI_CONTEXT_SIZE=4096
HAPPY_LOCAL_AI_TEMPERATURE=0.7
HAPPY_LOCAL_AI_THREADS=4
HAPPY_LOCAL_AI_GPU=true

# Multiple endpoints for different tasks (optional)
HAPPY_LOCAL_AI_CODING_ENDPOINT=http://localhost:11434
HAPPY_LOCAL_AI_CODING_MODEL=codellama
```

### Key Files

- `sources/sync/localAI.ts` - Configuration and validation module
- `sources/sync/localAIProvider.ts` - Session management and streaming
- `sources/sync/localAIEnv.ts` - Environment variable handling
- `sources/sync/localAI.test.ts` - Configuration tests (28 tests)
- `sources/sync/localAIProvider.test.ts` - Provider tests (16 tests)

### Supported Models

Memory-aware recommendations based on available RAM:
- **phi3** (2.3 GB) - Requires 4+ GB RAM
- **mistral** (4.1 GB) - Requires 6+ GB RAM
- **llama3.2** (3.8 GB) - Requires 8+ GB RAM
- **codellama** (3.8 GB) - Requires 8+ GB RAM
- **llama3.2:70b** (40 GB) - Requires 64+ GB RAM

### Features

- Streaming response support
- Session management with conversation history
- Integration with existing VoiceSession interface
- Automatic service availability checking
- Memory-aware model recommendations
- Multiple endpoint support for different tasks

### Documentation

- [Quick Start Guide](../docs/LOCAL_AI_QUICK_START.md) - 5-minute setup
- [User Guide](../docs/LOCAL_AI_GUIDE.md) - Comprehensive guide
- [Developer Documentation](../docs/LOCAL_AI_DEVELOPER.md) - Technical architecture
- [Implementation Summary](../docs/LOCAL_AI_IMPLEMENTATION_SUMMARY.md) - Implementation details

### Usage Pattern

```typescript
import { LocalAIProvider } from '@/sync/localAIProvider';
import { getLocalAIConfig } from '@/sync/localAI';

// Get configuration
const config = getLocalAIConfig();
if (config.enabled) {
    // Create session
    const provider = new LocalAIProvider(config);
    const session = await provider.createSession('general');

    // Send message with streaming
    await session.sendMessage('Hello!', (chunk) => {
        console.log('Received:', chunk);
    });
}
```

## Component Library Reference

### Core Components

The app includes a comprehensive component library designed for consistency across platforms.

#### Item Component (`sources/components/Item.tsx`)
Primary list item component - **always use this first** before creating custom components.

**Props:**
- `title` - Main text
- `subtitle` - Secondary text
- `detail` - Right-side detail text
- `icon` - Left icon (Ionicons name or custom element)
- `leftElement` - Custom left component
- `rightElement` - Custom right component
- `onPress` - Press handler
- `onLongPress` - Long press handler
- `loading` - Show loading indicator
- `selected` - Selected state styling
- `destructive` - Destructive action styling
- `chevron` - Show right chevron
- `divider` - Show bottom divider
- `copy` - Enable copy-to-clipboard on long press

**Usage:**
```typescript
import { Item } from '@/components/Item';

<Item
    title="Settings"
    subtitle="Manage your preferences"
    icon="settings-outline"
    chevron
    onPress={() => router.push('/settings')}
/>
```

#### ItemList Component (`sources/components/ItemList.tsx`)
Container for Item components - **use for most UI containers**.

**Features:**
- Inset grouped style (iOS)
- Automatic background color management
- ScrollView wrapper

**Usage:**
```typescript
import { ItemList } from '@/components/ItemList';
import { Item } from '@/components/Item';

<ItemList>
    <Item title="Option 1" />
    <Item title="Option 2" />
    <Item title="Option 3" />
</ItemList>
```

#### ItemGroup Component (`sources/components/ItemGroup.tsx`)
Groups related items with optional header/footer.

**Props:**
- `header` - Group header text
- `footer` - Group footer text
- `children` - Item components

#### Avatar Component (`sources/components/Avatar.tsx`)
User avatar display - **always use for avatars, never create custom**.

#### Layout Constraints (`sources/components/layout.ts`)
Responsive design helper for consistent widths across device sizes.

**Constants:**
- `layout.maxWidth` - 800px (tablets/web), 1400px (Mac Catalyst), full width (phones)
- `layout.headerMaxWidth` - Similar constraints for headers

**Usage:**
```typescript
import { layout } from '@/components/layout';
import { useStyles } from 'react-native-unistyles';

const { breakpoint } = useStyles();

<ScrollView
    contentContainerStyle={{
        maxWidth: layout.maxWidth[breakpoint],
        alignSelf: 'center',
        width: '100%'
    }}
>
    {/* Content */}
</ScrollView>
```

### Other Components

- **CommandPalette** - Global command search (sources/components/CommandPalette/)
- **DiffView** - Git diff visualization (sources/components/diff/)
- **MarkdownView** - Markdown rendering (sources/components/markdown/)
- **Modal** - Cross-platform modal system (sources/modal/) - **replaces React Native Alert**

## Project Scope and Priorities

- This project targets Android, iOS, and web platforms
- Web is considered a secondary platform
- Avoid web-specific implementations unless explicitly requested
- Keep dev pages without i18n, always use t(...) function to translate all strings, when adding new string add it to all languages, think about context before translating.
- Core principles: never show loading error, always just retry. Always sync main data in "sync" class. Always use invalidate sync for it. Always use Item component first and only then you should use anything else or custom ones for content. Do not ever do backward compatibility if not explicitly stated.
- Never use custom headers in navigation, almost never use Stack.Page options in individual pages. Only when you need to show something dynamic. Always show header on all screens.
- store app pages in @sources/app/(app)/
- use ItemList for most containers for UI, if it is not custom like chat one.
- Always use expo-router api, not react-navigation one.
- Always try to use "useHappyAction" from @sources/hooks/useHappyAction.ts if you need to run some async operation, do not handle errors, etc - it is handled automatically.
- Never use unistyles for expo-image, use classical one
- Always use "Avatar" for avatars
- No backward compatibliity ever
- When non-trivial hook is needed - create a dedicated one in hooks folder, add a comment explaining it's logic
- Always put styles in the very end of the component or page file
- Always wrap pages in memo
- For hotkeys use "useGlobalKeyboard", do not change it, it works only on Web
- Use "AsyncLock" class for exclusive async locks
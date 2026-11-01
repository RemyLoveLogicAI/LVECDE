# Project Map

> Overview of the codebase for new developers. Last updated: 2026-11-01. Deeper conventions live in `CLAUDE.md`.

**What it is:** "Happy", a mobile, web and desktop client for Claude Code and Codex sessions. It pairs with a CLI running on your machine through QR-code auth, then syncs sessions in real time with end-to-end encryption. It also has a voice assistant. This repo is the **client only**: the sync server is a separate service (default `https://api.cluster-fluster.com`).

## Tech Stack

- **App:** Expo SDK 54, React Native 0.81.4, React 19.1.0 (exact; `react-dom` must match, enforced in CI), TypeScript 5.9 (strict)
- **Routing:** Expo Router v6 (file-based, typed routes), web output `single` (SPA)
- **Styling:** Unistyles 3 (themes and breakpoints)
- **State:** a custom `Sync` engine (`InvalidateSync`/`ValueSync`), React Context and Zustand; local persistence with MMKV
- **Realtime:** Socket.io 4.8 client; LiveKit and ElevenLabs for voice
- **Crypto:** tweetnacl / libsodium (`@more-tech/react-native-libsodium`)
- **Payments and analytics:** RevenueCat (native and web via Stripe), PostHog
- **Desktop:** Tauri 2 (`src-tauri/`, Rust)
- **Tests:** Vitest 3

## Project Structure

```
/
├── sources/               # all app code (path alias @/* -> sources/*)
│   ├── app/               # Expo Router screens; (app)/ = authenticated routes
│   ├── auth/              # QR challenge-response auth, token storage, secret-key backup
│   ├── sync/              # sync engine: sync.ts, api*.ts REST clients, apiSocket.ts, reducer/, encryption/, git-parsers/, revenueCat/, localAI*.ts
│   ├── realtime/          # voice sessions (LiveKit/ElevenLabs), web vs native variants
│   ├── components/        # UI: Item/ItemList/ItemGroup (use first), Avatar, chat, diff/, markdown/, CommandPalette/, tools/
│   ├── hooks/             # custom hooks (useHappyAction, useGlobalKeyboard, ...)
│   ├── modal/             # cross-platform modal system (use instead of RN Alert)
│   ├── text/              # i18n: _default.ts (en) + translations/ (ru, pl, es, pt, ca, zh-Hans)
│   ├── encryption/ utils/ track/ constants/ types/
│   ├── -session/ -zen/    # route-private session and zen (todo) modules
│   ├── changelog/ scripts/  # changelog.json generated from CHANGELOG.md by scripts/parseChangelog.ts
│   ├── dev/ trash/        # dev-only pages and scratch scripts
├── src-tauri/             # Tauri desktop shell (com.slopus.happy)
├── plugins/               # Expo config plugin (withEinkCompatibility.js)
├── patches/               # patch-package patches (applied on postinstall)
├── public/                # static web assets (canvaskit.wasm, favicons)
├── docs/                  # Local AI guides
├── deploy/happy-app.yaml  # upstream maintainer's Kubernetes manifest (not used by this fork)
├── .github/               # CI workflow, Dependabot, PR template, CODEOWNERS, SECURITY.md, scripts/check-react-versions.mjs
├── app.config.js          # Expo config (variants by APP_ENV)
├── eas.json               # EAS build/submit profiles (development, preview, production)
├── Dockerfile             # web build -> nginx image
└── netlify.toml           # Netlify build for the web target
```

## API Surface (client calls to the sync server)

Requests carry the bearer token obtained through QR auth, except the auth bootstrap calls (`POST /v1/auth`, `/v1/auth/request`, `/v1/auth/account/request` and their status polls), which run before a token exists. Session content, messages, machine metadata, artifacts and account settings are encrypted on the client before upload. Account profile, friends, feed, usage and push tokens are sent as plain JSON the server can read.

- **Auth:** `POST /v1/auth`, `/v1/auth/request/status`, `/v1/auth/response`, `/v1/auth/account/request`, `/v1/auth/account/response`
- **Sessions:** `GET /v1/sessions`, `GET /v1/sessions/:id/messages`, `DELETE /v1/sessions/:id`
- **Machines:** `GET /v1/machines`
- **Account:** `/v1/account/profile`, `/v1/account/settings`, `/v1/usage/query`, `/v1/push-tokens`
- **Social:** `/v1/friends`, `/v1/friends/add`, `/v1/friends/remove`, `/v1/user/:id`, `/v1/user/search`, `/v1/feed`
- **Storage:** `/v1/artifacts`, `/v1/artifacts/:id`, `/v1/kv`, `/v1/kv/:key`, `/v1/kv/bulk`
- **Integrations:** `/v1/connect/github`, `/v1/connect/github/params`, `/v1/connect/:vendor`, `/v1/connect/:vendor/register`
- **External (not the sync server):** Claude OAuth token exchange at `https://console.anthropic.com/v1/oauth/token` (`sources/utils/oauth.ts`)
- **Misc:** `/v1/version`, `/v1/updates`
- **Socket.io:** the server pushes `update` and `ephemeral`; the client emits `rpc-call` (with ack), `message`, and `machine-update-metadata` (with ack)

## Data Model (client side)

There is no database in this repo. Data comes from the server and persists locally in MMKV (`sync/persistence.ts`, `sync/storage.ts`). Main types are in `sync/storageTypes.ts` and `sync/typesMessage.ts`:

- **Session:** an encrypted agent conversation, with metadata, agent state and messages
- **Machine:** a computer running the Happy CLI
- **Message:** raw and normalized agent events, turned into UI state by `sync/reducer/`
- **Artifact, Friend, FeedItem, Settings, Profile, Purchases**

## Frontend Architecture

Main routes (under `sources/app/(app)/`):
- `/`: session list / main view
- `/session/[id]` (+ `info`, `files`, `file`, `message/[messageId]`), `/session/recent`
- `/new` (+ `pick/machine`, `pick/path`): start a new session
- `/machine/[id]`, `/terminal`, `/terminal/connect`: pair with the CLI
- `/settings/*`: account, appearance, features, language, usage, voice, connect/claude
- `/inbox`, `/friends`, `/friends/search`, `/user/[id]`
- `/artifacts` (+ `new`, `[id]`, `edit/[id]`), `/zen` (todos), `/changelog`, `/restore` (+ `manual`), `/server` (custom server URL)
- `/dev/*`: developer and test pages (no i18n)

The root layout (`sources/app/_layout.tsx`) sets up the providers (Auth, Modal, Realtime, CommandPalette) and navigation. `CLAUDE.md` asks for new pages to be wrapped in `memo` with styles at the bottom of the file; some existing pages (for example `index.tsx`) predate that rule.

## Infrastructure

### Local Development
```bash
yarn install                  # also runs patch-package
yarn web                      # Expo web dev server (port 8081)
yarn ios                      # iOS simulator
yarn android                  # Android emulator
yarn start:local-server       # point at a local sync server on localhost:3005
# Android emulators can't reach the host as localhost: use
# EXPO_PUBLIC_HAPPY_SERVER_URL=http://10.0.2.2:3005 or set the URL in the app at /server
```

### Builds and Deploys
| Target | How | Notes |
|--------|-----|-------|
| Web (production) | Netlify, `netlify.toml` | Builds `yarn expo export --platform web` into `dist/`. Site `lvecde`; deploys once the repo is linked in Netlify |
| Web (container) | `Dockerfile` | nginx image, built by CI only (no push) |
| iOS/Android | EAS builds (`eas.json`); OTA updates: `yarn ota` (preview branch), `yarn ota:production` (production workflow) | `release-*.sh` and `deploy/happy-app.yaml` belong to the upstream maintainer's accounts |
| Desktop | Tauri (`src-tauri/`) | not built in CI |

### Environment Variables
| Variable | Purpose | Required |
|----------|---------|----------|
| `EXPO_PUBLIC_HAPPY_SERVER_URL` | sync server URL (default `https://api.cluster-fluster.com`; can be overridden in-app at `/server`) | No |
| `APP_ENV` | `development` / `preview` / `production` config variant | Build-time |
| `EXPO_PUBLIC_POSTHOG_API_KEY` | analytics | No |
| `EXPO_PUBLIC_REVENUE_CAT_APPLE` / `_GOOGLE` / `_STRIPE` | in-app purchases | No |
| `EXPO_PUBLIC_LOCAL_AI_ENABLED` / `_PROVIDER` / `_ENDPOINT` / `_MODEL` | Local AI (Ollama, LM Studio) | No |
| `HAPPY_LOCAL_AI_*`, `HAPPY_VOICE_*` | Local AI tuning and local voice | No |
| `EXPO_PUBLIC_DEBUG` | debug logging | No |

See `.env.example` for the full list with defaults.

## Testing

- **Framework:** Vitest (`vitest.config.ts`); 19 test files next to their sources (`*.test.ts` / `*.spec.ts`)
- **Run:** `yarn vitest run` (or `yarn test` for watch mode), `yarn typecheck`
- **Baseline:** 360 passed / 57 skipped / 0 failed; `CLAUDE.md` requires a 100% pass rate
- **CI** (`.github/workflows/ci.yml`): React version guard, typecheck and tests, web export, Docker build

## Development Workflow

1. `yarn install`, then `yarn web` (or a native target)
2. Make the change following `CLAUDE.md` (put every string in `t(...)` for all 7 languages, use `Item`/`ItemList`, `useHappyAction`, and the modal system instead of `Alert`)
3. `yarn typecheck && yarn vitest run`
4. For user-visible changes, add a `CHANGELOG.md` entry and run `npx tsx sources/scripts/parseChangelog.ts`
5. Open a PR using the template; CI and review bots run on it

## Current Features

- QR-code pairing with the Happy CLI; secret-key backup and restore
- Real-time, end-to-end-encrypted session sync with git status and diff views
- Voice assistant (LiveKit/ElevenLabs), optional local voice
- Local AI provider support (Ollama, LM Studio, custom)
- Artifacts, friends, inbox/feed, zen todos, usage stats
- Command palette and keyboard shortcuts (web), 7 languages, light and dark themes
- In-app purchases (RevenueCat), OTA updates (EAS)

## Known Limitations

- The app does nothing useful without a reachable sync server; it shows "disconnected" otherwise
- GitHub Actions has failed to start since 2026-10-26 (most likely a billing or spending limit on the account), so CI is not checking `main`
- A separately connected Cloudflare Workers build (`lvecde`) fails on every push
- The Docker image is built only in CI (no Docker daemon in the cloud dev container); the Tauri desktop build is not built in CI at all, so verify it locally with `yarn tauri build` on a machine with the Tauri system dependencies
- Release scripts and the Kubernetes manifest still target the upstream maintainer's accounts
- GitHub reports many open Dependabot alerts on `main`

# Zalo Linux - Architecture Documentation

## Overview

This document describes the architecture of the Zalo Linux desktop application (standard variant). The application is built using Electron and follows a multi-process architecture.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Main Process                            │
│  (main-dist/main.js - Electron main process)                │
│  - Window management (BrowserWindow)                         │
│  - IPC communication (ipcMain)                               │
│  - Auto-updater                                              │
│  - System tray (via Python tray.py)                          │
│  - Native integrations                                       │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ IPC Communication
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                   Renderer Process                           │
│  (pc-dist/ - React-based UI)                                │
│  - Main application UI                                       │
│  - Message rendering                                         │
│  - User interactions                                         │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ Web Workers
                   │
┌──────────────────┴──────────────────────────────────────────┐
│                    Worker Processes                          │
│  - shared-worker.js: Shared state management                 │
│  - search-worker.js: Message search indexing                 │
│  - dal-worker.js: Data access layer                          │
│  - cpu-heavy-worker.js: CPU-intensive operations             │
│  - zd-worker.js: Core business logic (largest file ~8MB)     │
└──────────────────────────────────────────────────────────────┘
```

## Key Modules

### Main Process (`main-dist/`)

#### 1. **main.js** (~5.2MB beautified)
- **Purpose**: Entry point for Electron main process
- **Key Components**:
  - Webpack bundle loader (custom `__ZaBUNDLENAME__` system)
  - BrowserWindow creation and management
  - IPC handlers for renderer communication
  - Auto-updater integration (electron-updater)
  - Sentry telemetry (error tracking)
  - Window controls and lifecycle management

#### 2. **preload.js** (~3.8MB beautified)
- **Purpose**: Preload script for main renderer window
- **Key Components**:
  - Context bridge for secure IPC
  - Exposed APIs to renderer process
  - Security sandboxing

#### 3. **preload-render.js** (~2.3MB beautified)
- **Purpose**: Preload script for render process
- **Key Components**:
  - Renderer-specific API exposure
  - DOM manipulation helpers

#### 4. **preload-shared-worker.js** (~2.3MB beautified)
- **Purpose**: Preload for shared worker window
- **Key Components**:
  - Worker initialization
  - Shared state management

#### 5. **preload-sqlite.js** (~3.4MB beautified)
- **Purpose**: Preload for SQLite utility process
- **Key Components**:
  - Database access layer
  - SQL query execution

#### 6. **migration.js** (~301KB beautified)
- **Purpose**: Database migration scripts
- **Key Components**:
  - Schema updates
  - Data migration logic

#### 7. **sentry.js** (~459KB beautified)
- **Purpose**: Sentry error tracking integration
- **Key Components**:
  - Error capture
  - Telemetry reporting
  - **Privacy Concern**: Sends error data to external servers

#### 8. **utility-process-sqlite.js** (~1.1MB beautified)
- **Purpose**: SQLite utility process
- **Key Components**:
  - Database operations in separate process
  - Prevents blocking main process

### Renderer Process (`pc-dist/`)

#### Core Files

1. **render.js** (~9KB beautified)
   - Main renderer entry point
   - React app initialization

2. **login.js** (~8KB beautified)
   - Login screen logic
   - Authentication flow

3. **znotification.js** (~6.4KB beautified)
   - Notification window logic
   - System notification integration

#### Worker Files

1. **zd-worker.js** (~8.1MB beautified) - **LARGEST FILE**
   - Core business logic
   - Message processing
   - Data synchronization
   - File upload/download
   - Encryption/decryption

2. **search-worker.js** (~2.8MB beautified)
   - Full-text search indexing
   - Message search functionality

3. **shared-worker.js** (~104KB beautified)
   - Shared state between windows
   - Cross-window communication

4. **dal-worker.js** (~221KB beautified)
   - Data Access Layer
   - Database queries
   - Caching logic

5. **cpu-heavy-worker.js** (~223KB beautified)
   - CPU-intensive operations
   - Image processing
   - Video thumbnail generation

6. **opfs-worker.js** (~218KB beautified)
   - Origin Private File System operations
   - File storage management

7. **pdf-worker.js** (~1.1MB beautified)
   - PDF rendering
   - PDF.js integration

8. **preview-thumb-worker.js** (~302KB beautified)
   - Thumbnail generation
   - Image preview processing

#### Lazy-Loaded Modules (`lazy/`)

The application uses code-splitting with 40+ lazy-loaded modules:

- **Vendor bundles**: React, Redux, UI libraries
- **Feature modules**: Settings, profile, group management
- **Language packs**: Vietnamese (`lang-vi.js`), English (`lang-en.js`)
- **Startup modules**: Login, main app initialization

**Key Lazy Modules**:
- `default-login-startup-main-startup-shared-worker.js` (~19MB beautified) - Main startup bundle
- `vendors-login-startup-main-startup-shared-worker.js` (~4MB beautified) - Vendor libraries
- `main-startup.js` (~1.6MB beautified) - Main app startup
- `login-startup.js` (~329KB beautified) - Login flow

#### Libraries (`libs/`)

1. **libsignal-protocol.static.js** (~1.3MB beautified)
   - End-to-end encryption
   - Signal Protocol implementation
   - Message encryption/decryption

## Data Flow

### Message Sending Flow

```
User Input (Renderer)
  ↓
IPC to Main Process
  ↓
zd-worker.js (encryption)
  ↓
dal-worker.js (store locally)
  ↓
Network request to Zalo servers
  ↓
Confirmation back to Renderer
```

### Message Receiving Flow

```
WebSocket connection (zd-worker.js)
  ↓
Message decryption (libsignal-protocol)
  ↓
dal-worker.js (store in database)
  ↓
search-worker.js (index for search)
  ↓
IPC to Renderer
  ↓
UI update (React)
```

## Security Considerations

### Current Security Measures

1. **End-to-End Encryption**: Uses Signal Protocol (libsignal-protocol.js)
2. **Context Isolation**: Preload scripts use context bridge
3. **Node Integration**: Disabled in renderer process

### Security Concerns

1. **Sentry Telemetry**: Sends error data to external servers (privacy risk)
2. **No Content Security Policy**: Missing CSP headers
3. **Auto-Updater**: Updates from external servers without user control
4. **Obfuscated Code**: Original code was heavily minified (now deobfuscated)

## Technology Stack

- **Framework**: Electron v22.3.27 (outdated, needs update)
- **UI Library**: React
- **State Management**: Redux (inferred from bundle names)
- **Database**: SQLite (via utility process)
- **Encryption**: Signal Protocol
- **Build Tool**: Webpack (custom bundle system)
- **Error Tracking**: Sentry

## File Size Summary

### Main Process
- Total: ~21MB beautified
- Largest: preload.js (3.8MB), preload-sqlite.js (3.4MB)

### Renderer Process
- Total: ~111MB beautified
- Largest: zd-worker.js (8.1MB), lazy/default-login-startup-main-startup-shared-worker.js (19MB)

### Total Deobfuscated Code
- **64 JavaScript files**
- **~132MB total**

## Known Issues

1. **Wayland Compatibility**: Window controls don't work properly on Wayland
2. **Message Sync**: Occasional sync failures reported
3. **Outdated Electron**: Using v22, should update to v28+ or v31+
4. **Python Dependency**: System tray requires Python (should use native Electron Tray)
5. **Privacy**: Sentry enabled by default without user consent

## Next Steps

1. Update Electron to v31.x LTS
2. Implement native Electron tray (remove Python dependency)
3. Add Content Security Policy
4. Make Sentry opt-in with user consent
5. Fix Wayland window controls
6. Debug message synchronization issues

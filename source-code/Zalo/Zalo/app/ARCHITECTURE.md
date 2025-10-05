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

## Deep Analysis Results

### Code Analysis Summary

**Completed**: 2025-10-05

- **Total Functions**: 10,934 (main process) + ~8,000 (renderer process)
- **Total Classes**: 1,232 (main process)
- **IPC Handlers**: 1 explicitly identified, many more embedded
- **Event Listeners**: 1,566 (main process)
- **Code Size**: ~132MB beautified

**Key Findings**:

1. Heavy obfuscation with single-letter variable names
2. Webpack bundling makes module boundaries unclear
3. Sentry telemetry deeply integrated
4. Large files (main.js: 36,793 lines)
5. Modern ES6+ syntax (async/await, destructuring)

**Detailed Analysis Documents**:

- `ANALYSIS-main.md` - Main process deep analysis
- `ANALYSIS-renderer.md` - Renderer process deep analysis
- `../FUNCTION-INDEX.md` - Comprehensive function catalog

### Security-Critical Functions

#### 1. Sentry Telemetry (main.js, lines 100-200)

```javascript
baggageHeaderToDynamicSamplingContext(e)
dynamicSamplingContextToSentryBaggageHeader(e)
```

**Risk**: Always-on telemetry without user consent  
**Action**: Implement opt-in controls (Task 10)

#### 2. IPC Communication (main.js, lines 25000+)

```javascript
ipcMain.on(channel, handler)
ipcMain.handle(channel, handler)
```

**Risk**: Potential unauthorized IPC calls  
**Action**: Audit all channels, implement CSP (Task 11)

#### 3. Auto-Updater (main.js, lines 24988+)

**Risk**: Automatic updates without user control  
**Action**: Disable auto-updater (Task 13)

### Performance-Critical Functions

#### 1. Message Sync (shared-worker.js)

```javascript
syncMessages(lastSyncTime)
fetchMissedMessages(timestamp)
reconcileMessages(localMessages, serverMessages)
```

**Status**: Broken (Task 7)  
**Priority**: HIGH

#### 2. File Processing (cpu-heavy-worker.js)

```javascript
compressFile(file, options)
generateThumbnail(file)
processImage(imageData)
```

**Status**: Working  
**Optimization**: Consider WebAssembly for better performance

#### 3. Search Indexing (search-worker.js)

```javascript
indexMessages(messages)
searchMessages(query)
rankResults(results)
```

**Status**: Working  
**Optimization**: Implement incremental indexing

### Call Graphs

#### Message Send Flow

```
User Input (MessageComposer)
  ↓
Redux Action (SEND_MESSAGE)
  ↓
Shared Worker (encryption)
  ↓
libsignal-protocol (encrypt)
  ↓
WebSocket (send)
  ↓
DAL Worker (store)
  ↓
SQLite (persist)
  ↓
UI Update (optimistic)
```

#### Message Receive Flow

```
WebSocket (receive)
  ↓
Shared Worker (decrypt)
  ↓
libsignal-protocol (decrypt)
  ↓
DAL Worker (store)
  ↓
SQLite (persist)
  ↓
Redux Action (RECEIVE_MESSAGE)
  ↓
UI Update (new message)
  ↓
Notification (if applicable)
```

#### Message Sync Flow

```
App Start / Come Online
  ↓
Redux Action (SYNC_START)
  ↓
Shared Worker (request sync)
  ↓
WebSocket (fetch missed messages)
  ↓
Server Response (encrypted messages)
  ↓
Shared Worker (decrypt batch)
  ↓
DAL Worker (store batch)
  ↓
SQLite (persist batch)
  ↓
Redux Action (SYNC_SUCCESS)
  ↓
UI Update (synced messages)
```

### Sequence Diagrams

#### Authentication Flow

```
User → Login Screen: Enter credentials
Login Screen → Main Process: IPC (authenticate)
Main Process → Server: HTTPS (login request)
Server → Main Process: Auth token + session
Main Process → Renderer: IPC (auth success)
Renderer → Redux Store: Save auth state
Redux Store → UI: Update to main app
Main App → Shared Worker: Initialize WebSocket
Shared Worker → Server: WebSocket connect (with token)
Server → Shared Worker: Connection established
Shared Worker → Main App: Ready for messaging
```

#### File Upload Flow

```
User → UI: Select file
UI → CPU Heavy Worker: Process file
CPU Heavy Worker → UI: Thumbnail + metadata
UI → Shared Worker: Upload request
Shared Worker → libsignal: Encrypt file
libsignal → Shared Worker: Encrypted data
Shared Worker → Server: Upload chunks (HTTPS)
Server → Shared Worker: Upload progress
Shared Worker → UI: Progress updates
Server → Shared Worker: Upload complete
Shared Worker → DAL Worker: Store file metadata
DAL Worker → SQLite: Persist metadata
SQLite → UI: File sent confirmation
```

## Next Steps

### Immediate (Security)

1. ✅ **COMPLETED**: Fix Wayland window controls (Task 3)
2. ✅ **COMPLETED**: Deep analysis and function indexing (Task 5)
3. **TODO**: Implement privacy controls for Sentry (Task 10)
4. **TODO**: Implement Content Security Policy (Task 11)
5. **TODO**: Disable auto-updater (Task 13)

### Short-Term (Modernization)

1. **TODO**: Update Electron to v28.x or v31.x LTS (Task 8)
2. **TODO**: Update npm dependencies (Task 9)
3. **TODO**: Fix message synchronization (Task 7)
4. **TODO**: Implement native Electron tray (Task 6)

### Long-Term (Maintainability)

1. **TODO**: Rename obfuscated variables to meaningful names
2. **TODO**: Add comprehensive code comments
3. **TODO**: Split large files into smaller modules
4. **TODO**: Document all IPC channels and their purposes
5. **TODO**: Create detailed architecture diagrams
6. **TODO**: Add unit and integration tests

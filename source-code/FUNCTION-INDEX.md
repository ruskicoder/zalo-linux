# Zalo Linux - Comprehensive Function Index

**Generated:** 2025-10-05  
**Purpose:** Searchable catalog of all functions, classes, and APIs across both Zalo and ZaDark variants  
**Scope:** Main process and renderer process for both variants

---

## Table of Contents

1. [Overview](#overview)
2. [Quick Reference](#quick-reference)
3. [Security-Critical Functions](#security-critical-functions)
4. [Messaging Functions](#messaging-functions)
5. [File Upload/Download Functions](#file-uploaddownload-functions)
6. [Sync Functions](#sync-functions)
7. [IPC Handlers](#ipc-handlers)
8. [Event Listeners](#event-listeners)
9. [ZaDark-Specific Functions](#zadark-specific-functions)
10. [Large File Guide](#large-file-guide)
11. [Cross-Reference Map](#cross-reference-map)

---

## Overview

This index catalogs functions across:
- **Zalo Main Process**: 10,934 functions, 1,232 classes
- **Zalo Renderer Process**: Thousands of functions (React components, workers)
- **ZaDark Main Process**: Identical to Zalo (10,934 functions, 1,232 classes)
- **ZaDark Renderer Process**: Zalo functions + ZaDark theme engine functions

**Total Estimated Functions**: 20,000+ across all files

---

## Quick Reference

### Most Important Files

| File | Process | Size | Functions | Purpose |
|------|---------|------|-----------|---------|
| **main.js** | Main | 36,793 lines | ~5,000 | Electron main process entry point |
| **render.js** | Renderer | ~9KB | ~100 | React renderer entry point |
| **zd-worker.js** | Renderer | ~8.1MB | ~3,000 | Core business logic worker |
| **shared-worker.js** | Renderer | ~104KB | ~200 | Message sync, WebSocket |
| **search-worker.js** | Renderer | ~2.8MB | ~500 | Search indexing |
| **zadark.min.js** | Renderer | ~40KB | ~50 | ZaDark theme engine |

### Key Modules

| Module | Location | Purpose |
|--------|----------|---------|
| **Sentry** | main.js (lines 100-200) | Error tracking telemetry |
| **Window Management** | main.js (lines 8669+) | BrowserWindow creation |
| **IPC Handlers** | main.js (lines 25000+) | Inter-process communication |
| **Auto-Updater** | main.js (lines 24988+) | Automatic updates |
| **Signal Protocol** | libsignal-protocol.static.js | End-to-end encryption |
| **Theme Engine** | zadark.min.js | ZaDark theme system |

---

## Security-Critical Functions

### 1. Sentry Telemetry Functions

**Location**: main.js (lines 100-200)

```javascript
// Sentry baggage header functions
baggageHeaderToDynamicSamplingContext(e)  // Parses Sentry headers
dynamicSamplingContextToSentryBaggageHeader(e)  // Creates Sentry headers
```

**Risk**: Always-on telemetry without user consent  
**Recommendation**: Implement opt-in controls (Task 10)

### 2. IPC Communication Functions

**Location**: main.js (lines 25000+), preload-*.js

```javascript
// IPC handlers (obfuscated names)
ipcMain.on(channel, handler)
ipcMain.handle(channel, handler)
ipcMain.once(channel, handler)
```

**Identified Channels**: 1 explicitly found, many more embedded  
**Risk**: Potential for unauthorized IPC calls  
**Recommendation**: Audit all channels, implement CSP (Task 11)

### 3. Cookie Manipulation Functions (ZaDark)

**Location**: zadark.min.js

```javascript
// Electron cookie manipulation
async setCookie(name, value, url, domain)
window.$zelectron.setCookie(name, value, url, domain)
window.electronAPI.setCustomCookie(url, domain, cookieData)
```

**Risk**: Direct cookie manipulation, potential injection  
**Recommendation**: Validate all cookie operations

### 4. Error Handling Functions

**Location**: main.js (line 6862)

```javascript
convertError(e)  // Converts errors to standard format
isPromise(e)     // Checks if value is a Promise
```

**Purpose**: Error handling and logging  
**Risk**: May expose sensitive information in error messages

### 5. Auto-Updater Functions

**Location**: main.js (lines 24988+)

```javascript
// Auto-updater functions (obfuscated)
// Handles automatic application updates
```

**Risk**: Automatic updates without user control  
**Recommendation**: Disable auto-updater (Task 13)

---

## Messaging Functions

### Core Messaging (Inferred from Architecture)

**Location**: zd-worker.js, shared-worker.js

```javascript
// Message sending (inferred)
sendMessage(conversationId, content, options)
encryptMessage(content, recipientKeys)
sendViaWebSocket(encryptedMessage)

// Message receiving (inferred)
onWebSocketMessage(event)
decryptMessage(encryptedData, senderKey)
storeMessage(message, conversationId)
notifyUI(message)

// Message sync (inferred)
syncMessages(lastSyncTime)
fetchMissedMessages(timestamp)
reconcileMessages(localMessages, serverMessages)
```

**Status**: Broken (Task 7 - needs debugging)  
**Priority**: HIGH (core functionality)

### Signal Protocol Functions

**Location**: libsignal-protocol.static.js

```javascript
// End-to-end encryption (Signal Protocol)
// ~1.3MB of encryption functions
// Includes: key exchange, message encryption/decryption, forward secrecy
```

**Status**: Implemented  
**Risk**: Need to verify implementation correctness

---

## File Upload/Download Functions

### File Transfer (Inferred)

**Location**: cpu-heavy-worker.js, zd-worker.js

```javascript
// File upload (inferred)
uploadFile(file, conversationId)
compressFile(file, options)
generateThumbnail(file)
uploadChunked(file, chunkSize)

// File download (inferred)
downloadFile(fileId, conversationId)
decryptFile(encryptedData, key)
saveFile(data, filename)
```

**Status**: Working  
**Priority**: MEDIUM

---

## Sync Functions

### Message Synchronization

**Location**: shared-worker.js, dal-worker.js

```javascript
// Sync operations (inferred)
startSync()
syncConversations()
syncMessages(conversationId)
syncContacts()
updateSyncStatus(status)

// Database sync (inferred)
queryLocalMessages(conversationId, limit)
insertMessages(messages)
updateMessageStatus(messageId, status)
deleteMessages(messageIds)
```

**Status**: Broken (Task 7)  
**Priority**: HIGH

---

## IPC Handlers

### Identified IPC Channels

**Location**: main.js, preload-*.js

| Channel | Method | File | Purpose |
|---------|--------|------|---------|
| (1 identified) | ipcMain.on | main.js | Unknown (obfuscated) |
| (Many more) | Various | Various | Need manual identification |

**Note**: Most IPC channels are embedded in obfuscated code and require manual analysis.

**Recommendation**: 
1. Search for `ipcMain.on`, `ipcMain.handle`, `ipcMain.once`
2. Search for `ipcRenderer.send`, `ipcRenderer.invoke`
3. Document all channels and their purposes
4. Implement input validation on all handlers

---

## Event Listeners

### Total Event Listeners

- **Main Process**: 1,566 listeners
- **Renderer Process**: Thousands (React events, worker messages)

### Common Events

**Application Lifecycle**:
```javascript
app.on('ready', handler)
app.on('window-all-closed', handler)
app.on('activate', handler)
app.on('quit', handler)
```

**Window Events**:
```javascript
window.on('close', handler)
window.on('minimize', handler)
window.on('maximize', handler)
window.on('focus', handler)
window.on('blur', handler)
```

**IPC Events**:
```javascript
ipcMain.on(channel, handler)
ipcRenderer.on(channel, handler)
```

**Worker Events**:
```javascript
worker.onmessage = handler
worker.onerror = handler
worker.postMessage(data)
```

---

## ZaDark-Specific Functions

### Theme Management

**Location**: zadark.min.js

```javascript
// Theme functions
getTheme()                    // Returns current theme (dark/light)
saveTheme(theme)              // Saves theme to localStorage
applyTheme(theme)             // Applies theme CSS

// Font functions
getFontFamily()               // Returns current font family
saveFontFamily(font)          // Saves font family
getFontSize()                 // Returns font size (small/medium/big/very-big)
saveFontSize(size)            // Saves font size
```

### Privacy Features

**Location**: zadark.min.js

```javascript
// Privacy functions
saveBlockSettings(setting, enabled)  // Saves privacy setting
getBlockSettings(setting)            // Gets privacy setting

// Specific privacy functions
saveEnabledHideLatestMessage(enabled)
getEnabledHideLatestMessage()
saveEnabledHideConvAvatar(enabled)
getEnabledHideConvAvatar()
saveEnabledHideConvName(enabled)
getEnabledHideConvName()
saveEnabledHideThreadChatMessage(enabled)
getEnabledHideThreadChatMessage()
```

### Storage Functions

**Location**: zadark.min.js

```javascript
// LocalForage (IndexedDB) functions
saveThreadChatBg(conversationId, imageData)  // Saves chat background
getThreadChatBg(conversationId)              // Gets chat background

// Translation functions
saveTranslateTarget(language)  // Saves translation language (vi/en)
getTranslateTarget()           // Gets translation language
```

### Window-Specific Functions

**Location**: zadark-main.min.js, zadark-znotification.min.js, etc.

```javascript
// Main window initialization
initializeMainWindow()
applyMainWindowTheme()

// Notification window
initializeNotificationWindow()
applyNotificationTheme()

// Popup viewer
initializePopupViewer()
applyPopupTheme()

// Conversation window
initializeConversationWindow()
applyConversationTheme()
```

---

## Large File Guide

### Files Over 10,000 Lines

| File | Lines | Size | Quick Navigation |
|------|-------|------|------------------|
| **main.js** | 36,793 | ~5.2MB | See sections below |
| **zd-worker.js** | ~30,000 | ~8.1MB | Core business logic |
| **mainless-worker.js** | 10,693 | ~1.2MB | Background tasks |

### main.js Navigation Guide

**Key Sections** (approximate line numbers):

```
Lines 1-100:      Webpack bundle loader
Lines 100-200:    Sentry telemetry configuration
Lines 200-1000:   Utility functions (string, object manipulation)
Lines 1000-5000:  Core Electron modules
Lines 5000-8600:  Third-party library integrations
Lines 8600-8669:  Electron app initialization
Lines 8669-17000: BrowserWindow management
Lines 17000-24988: Window controls & management
Lines 24988-25000: Auto-updater logic
Lines 25000-30000: IPC communication handlers
Lines 30000-35000: Additional utilities
Lines 35000-36793: System tray integration
```

**Search Tips**:
1. Search for `function` to find function declarations
2. Search for `class` to find class declarations
3. Search for `ipcMain` to find IPC handlers
4. Search for `BrowserWindow` to find window management
5. Search for `Sentry` to find telemetry code

### zd-worker.js Navigation Guide

**Estimated Sections**:

```
Lines 1-5000:     Worker initialization, utilities
Lines 5000-15000: Message handling logic
Lines 15000-25000: Data processing, encryption
Lines 25000-30000: API communication, sync logic
```

**Search Tips**:
1. Search for `onmessage` to find worker message handlers
2. Search for `postMessage` to find worker responses
3. Search for `fetch` to find API calls
4. Search for `encrypt` to find encryption functions

---

## Cross-Reference Map

### Function Call Relationships

**Main Process → Renderer Process**:
```
main.js (IPC handlers)
  ↓
preload-*.js (IPC bridge)
  ↓
render.js (React app)
  ↓
React components
```

**Renderer Process → Workers**:
```
render.js (React app)
  ↓
worker.postMessage()
  ↓
shared-worker.js / zd-worker.js / etc.
  ↓
worker.onmessage()
  ↓
React app updates
```

**ZaDark Theme Flow**:
```
zadark-main.min.js (initialization)
  ↓
zadark.min.js (theme engine)
  ↓
localStorage / LocalForage (storage)
  ↓
CSS injection (DOM manipulation)
  ↓
UI updates
```

### Module Dependencies

**Main Process Dependencies**:
```
main.js
├── electron (app, BrowserWindow, ipcMain, Tray, Menu)
├── @sentry/electron (error tracking)
├── Node.js built-ins (fs, path, os, crypto)
└── Internal modules (migration, sentry, etc.)
```

**Renderer Process Dependencies**:
```
render.js
├── React (UI framework)
├── Redux (state management)
├── Workers (shared-worker, zd-worker, etc.)
├── libsignal-protocol (encryption)
└── ZaDark (theme engine - ZaDark variant only)
```

**ZaDark Dependencies**:
```
zadark.min.js
├── zadark-jquery.min.js (DOM manipulation)
├── zadark-localforage.min.js (storage)
├── zadark-tippy.min.js (tooltips)
├── zadark-popper.min.js (positioning)
├── zadark-introjs.min.js (onboarding)
├── zadark-hotkeys-js.min.js (shortcuts)
├── zadark-toastify.min.js (notifications)
├── zadark-translate.min.js (i18n)
└── zadark-webfont.min.js (fonts)
```

---

## Search Strategies

### Finding Specific Functions

**By Purpose**:
```bash
# Messaging functions
grep -r "sendMessage\|receiveMessage\|syncMessage" source-code/

# File upload functions
grep -r "uploadFile\|downloadFile\|compressFile" source-code/

# IPC handlers
grep -r "ipcMain\.on\|ipcMain\.handle" source-code/

# Event listeners
grep -r "\.on\(.*addEventListener" source-code/

# Sentry telemetry
grep -r "Sentry\|sentry\|@sentry" source-code/
```

**By File**:
```bash
# Main process functions
grep "^function\|^async function" source-code/Zalo/main-dist/main.js

# Renderer functions
grep "^function\|^async function" source-code/Zalo/pc-dist/render.js

# ZaDark functions
grep "^function\|^async function" source-code/ZaDark/pc-dist/zadark.min.js
```

**By Pattern**:
```bash
# Arrow functions
grep "const.*=.*=>" source-code/

# Class methods
grep "^\s*[a-zA-Z_][a-zA-Z0-9_]*\s*(" source-code/

# Async functions
grep "async\s\+function\|async\s*(" source-code/
```

---

## Function Naming Patterns

### Obfuscated Names (Zalo Base)

**Single-Letter Functions** (most common):
```javascript
function e(t, n, r)  // Extremely common
function t(e)        // Very common
function n(e, t)     // Very common
function r(e, t, n)  // Common
function i(e)        // Common
function o(e, t)     // Common
function s(e, t, n)  // Common
function a(e)        // Common
function c(e, t)     // Common
function u(e)        // Common
function l(e, t)     // Common
function d(e, t, n)  // Common
function h(e)        // Common
function f(e, t)     // Common
function p(e)        // Common
```

**Two-Letter Functions** (less common):
```javascript
function Yn()        // Rare
function convertError(e)  // Rare (actual name!)
function isPromise(e)     // Rare (actual name!)
```

### ZaDark Names (More Readable)

**Theme Functions**:
```javascript
getTheme()
saveTheme()
getFontFamily()
saveFontFamily()
getFontSize()
saveFontSize()
```

**Privacy Functions**:
```javascript
saveBlockSettings()
getBlockSettings()
saveEnabledHideLatestMessage()
getEnabledHideLatestMessage()
```

---

## Recommendations for Using This Index

### For Security Audit

1. **Start with Security-Critical Functions** section
2. **Review all IPC Handlers** - audit for input validation
3. **Check Sentry Functions** - implement opt-in controls
4. **Audit ZaDark Cookie Functions** - validate cookie operations
5. **Review Auto-Updater** - consider disabling

### For Bug Fixing

1. **Message Sync Issues** → Check Sync Functions section
2. **File Upload Issues** → Check File Upload/Download Functions
3. **Window Control Issues** → Search main.js lines 8669-17000
4. **Theme Issues** → Check ZaDark-Specific Functions

### For Modernization

1. **Identify Outdated Patterns** - search for deprecated APIs
2. **Find Electron API Usage** - search for `electron`, `ipcMain`, `BrowserWindow`
3. **Locate Third-Party Dependencies** - check Module Dependencies
4. **Find Performance Bottlenecks** - check Large File Guide

### For Documentation

1. **Use Cross-Reference Map** - understand function relationships
2. **Follow Data Flow** - trace function calls
3. **Document IPC Channels** - create channel registry
4. **Map React Components** - create component tree

---

## Next Steps

1. **Manual Function Identification**
   - Analyze large files (main.js, zd-worker.js)
   - Identify and document key functions
   - Rename obfuscated functions

2. **Create Detailed Sub-Indexes**
   - IPC Channel Registry
   - React Component Tree
   - Worker Message Protocol
   - API Endpoint Catalog

3. **Security Audit**
   - Review all security-critical functions
   - Audit IPC handlers
   - Check for vulnerabilities

4. **Performance Profiling**
   - Identify slow functions
   - Optimize hot paths
   - Reduce bundle size

---

## Appendix: Statistics

### Function Count by File Type

| File Type | Count | Percentage |
|-----------|-------|------------|
| Main Process | 10,934 | ~55% |
| Renderer Process | ~8,000 | ~40% |
| ZaDark Theme | ~100 | ~0.5% |
| Workers | ~1,000 | ~5% |
| **Total** | **~20,000** | **100%** |

### Code Size by Component

| Component | Size | Percentage |
|-----------|------|------------|
| Main Process | ~21MB | ~16% |
| Renderer Process | ~111MB | ~84% |
| ZaDark Additional | ~377KB | ~0.3% |
| **Total** | **~132MB** | **100%** |

### Obfuscation Level

| Category | Level | Readability |
|----------|-------|-------------|
| Zalo Main | Very High | 2/10 |
| Zalo Renderer | High | 3/10 |
| ZaDark Theme | Medium | 5/10 |
| Libraries | Low | 8/10 |

---

**Document Status**: Draft v1.0  
**Last Updated**: 2025-10-05  
**Maintainer**: Security Audit Team  
**Next Review**: After Task 5.6 completion

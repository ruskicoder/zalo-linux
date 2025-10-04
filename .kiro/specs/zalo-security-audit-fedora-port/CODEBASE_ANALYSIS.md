# Zalo Linux Codebase Structure Analysis

**Date:** October 5, 2025  
**Analyzed Versions:** Zalo v24.9.1 and ZaloZaDark v24.9.1  
**Task:** Phase 1, Task 2 - Analyze current codebase structure

---

## Executive Summary

This document provides a comprehensive analysis of the Zalo Linux application codebase, including directory structure, minified files, dependencies, and Electron configuration. The application is an Electron-based desktop client with heavily minified JavaScript code requiring deobfuscation.

---

## 1. Directory Structure Overview

### Root Structure
```
zalo-linux-unofficial/
├── original/                          # Original application files
│   ├── Zalo/                         # Standard Zalo version
│   ├── ZaloZaDark/                   # Dark theme version
│   ├── Zalo_backup_20251005_021230/  # Backup (Standard)
│   ├── ZaloZaDark_backup_20251005_021338/  # Backup (Dark)
│   ├── en/                           # English language files
│   ├── vn/                           # Vietnamese language files
│   ├── prepare/                      # Desktop entry files
│   ├── install.sh                    # Installation script
│   ├── install_curl.sh               # Alternative installer
│   ├── update.sh                     # Update script
│   └── version.txt                   # Version information
├── package.json                       # Project dependencies (deobfuscation tools)
├── package-lock.json
├── README.md
└── LICENSE
```

### Application Structure (Both Versions)
```
Zalo/ or ZaloZaDark/
├── Zalo/                             # Main application directory
│   ├── app/                          # Application code
│   │   ├── bootstrap.js              # Entry point
│   │   ├── package.json              # App dependencies
│   │   ├── main-dist/                # Main process (minified)
│   │   ├── pc-dist/                  # Renderer process (minified)
│   │   ├── native/                   # Native modules
│   │   └── libs/                     # Libraries
│   ├── app-update.yml                # Auto-updater config
│   └── icon.icns                     # Application icon
├── assets/
│   └── Zalo.png                      # Application icon
└── start.sh                          # Startup script
```

---

## 2. Key Files and Their Purposes

### Entry Point
- **`bootstrap.js`**: Application entry point
  - Loads performance tracing
  - Runs database migrations
  - Handles single instance lock
  - Loads main process code

### Main Process Files (`main-dist/`)
| File | Size | Purpose |
|------|------|---------|
| `main.js` | 3.4 MB | Main Electron process (minified) |
| `preload.js` | 3.8 MB | Main preload script |
| `preload-render.js` | 1.7 MB | Renderer preload |
| `preload-sqlite.js` | 2.4 MB | SQLite process preload |
| `preload-noti.js` | 1.7 MB | Notification preload |
| `preload-shared-worker.js` | 1.7 MB | Shared worker preload |
| `migration.js` | 375 KB | Database migration logic |
| `sentry.js` | 312 KB | Sentry error tracking |
| `mainless-worker.js` | 648 KB | Worker process |
| `utility-process-sqlite.js` | 640 KB | SQLite utility process |
| `second-instance.js` | 1.5 KB | Second instance handler |

### Renderer Process Files (`pc-dist/`)
| File | Size | Purpose |
|------|------|---------|
| `zd-worker.3a6ecf693cff2fc53577.js` | 7.7 MB | Main worker (largest file) |
| `search-worker.3a6ecf693cff2fc53577.js` | 1.8 MB | Search functionality |
| `pdf-worker.3a6ecf693cff2fc53577.js` | 624 KB | PDF handling |
| `mainless-worker.3a6ecf693cff2fc53577.js` | 239 KB | Mainless worker |
| `preview-thumb-worker.3a6ecf693cff2fc53577.js` | 184 KB | Thumbnail generation |
| `cpu-heavy-worker.3a6ecf693cff2fc53577.js` | 137 KB | CPU-intensive tasks |
| `dal-worker.3a6ecf693cff2fc53577.js` | 136 KB | Data access layer |
| `opfs-worker.3a6ecf693cff2fc53577.js` | 132 KB | File system operations |
| `shared-worker.3a6ecf693cff2fc53577.js` | 67 KB | Shared worker |
| `render.3a6ecf693cff2fc53577.js` | 5.8 KB | Main renderer |
| `login.3a6ecf693cff2fc53577.js` | 5.0 KB | Login UI |
| `znotification.3a6ecf693cff2fc53577.js` | 4.1 KB | Notifications |
| `sqlite.3a6ecf693cff2fc53577.js` | 1.1 KB | SQLite interface |

### HTML Files
- `index.html` - Main application window
- `login.html` - Login screen
- `shared-worker.html` - Shared worker container
- `sqlite.html` - SQLite process container
- `popup-viewer.html` - Popup viewer
- `child.html` - Child window

### CSS Files
- Multiple CSS files with hash: `*.3a6ecf693cff2fc53577.css`
- Organized by feature/module

---

## 3. Minified Files Identification

### Characteristics of Minified Code
All JavaScript files in `main-dist/` and `pc-dist/` are **heavily minified**:
- Single-line or very few lines (main.js: only 12 lines for 3.4 MB)
- No whitespace or formatting
- Obfuscated variable names
- Webpack bundled with hash in filenames

### Example from main.js (first 50 characters):
```javascript
f");e.exports={mkdirs:r,mkdirsSync:i,mkdirp:r,mkdirpSync:i,ensureDir:r,ensureDirSync:i}}});
```

### Total Minified Code Size
- **Main Process**: ~17 MB
- **Renderer Process**: ~13 MB (JS files only)
- **Total**: ~30 MB of minified JavaScript

---

## 4. Dependencies Analysis

### Application Dependencies (`app/package.json`)

#### Core Framework
- **Electron**: Not explicitly listed (bundled separately)
- **React**: 16.14.0
- **Redux**: 4.0.5
- **React-Redux**: 7.2.4
- **@reduxjs/toolkit**: 1.5.1

#### Security & Monitoring
- **@sentry/electron**: 4.8.0 ⚠️ (Outdated, always-on telemetry)
- **@sentry/react**: 6.2.4 ⚠️ (Outdated)

#### Cloud Services
- **@google-cloud/secret-manager**: 4.0.0
- **@google-cloud/storage**: 6.1.0

#### Deprecated/Vulnerable Packages
- **request**: 2.88.0 ⚠️ (DEPRECATED - must replace with axios)
- **ajv**: 5.2.2 ⚠️ (Very old, security issues)
- **tough-cookie**: ^2.3.2 ⚠️ (Old version)
- **crypto-js**: 3.1.8 ⚠️ (Outdated)
- **adm-zip**: 0.4.16 ⚠️ (Known vulnerabilities)
- **js-yaml**: ^3.8.4 ⚠️ (Old version)
- **node-fetch**: 2.6.0 ⚠️ (Old version)
- **glob**: 7.1.2 ⚠️ (Old version)

#### File & Data Handling
- **fs-extra**: 6.0.1
- **archiver**: ^5.3.1
- **decompress**: 4.2.0
- **jszip**: 3.10.1
- **file-type**: 16.5.4
- **pdfjs-dist**: 2.5.207

#### Database
- **lowdb**: 2.1.0
- **generic-pool**: 3.9.0
- SQLite (via native modules)

#### State Management
- **recoil**: 0.7.1
- **xstate**: 4.23.1
- **immer**: 7.0.5

#### UI Components
- **react-virtualized**: 9.9.0
- **react-draggable**: ^4.4.3
- **react-resizable**: ^1.11.0
- **lottie-web**: ^5.1.7
- **chart.js**: 2.7.2

#### Utilities
- **moment**: ^2.29.1
- **lodash.debounce**: 4.0.8
- **uuid**: 3.1.0
- **nanoid**: 3.3.3

### Development Dependencies (Root `package.json`)
```json
{
  "dependencies": {
    "escodegen": "^2.1.0",
    "esprima": "^4.0.1",
    "js-beautify": "^1.15.4"
  }
}
```
These are tools for code deobfuscation.

---

## 5. Electron Configuration

### Version Detection
- Electron version is **NOT** explicitly listed in `package.json`
- Based on dependencies and file structure, likely **Electron v22.x** (mentioned in requirements)
- Confirmed from design document: **Electron v22.3.27**

### Window Configuration (from bootstrap.js analysis)
- Uses custom frame (frameless window)
- Multiple BrowserWindow instances:
  - Main window
  - Notification window
  - SQLite process window
  - Shared worker window

### Preload Scripts
Multiple preload scripts for different contexts:
- `preload.js` - Main window
- `preload-render.js` - Renderer process
- `preload-sqlite.js` - SQLite process
- `preload-noti.js` - Notifications
- `preload-shared-worker.js` - Shared workers

### Security Settings (Inferred)
- `nodeIntegration`: Likely disabled (best practice)
- `contextIsolation`: Likely enabled (modern Electron)
- `webSecurity`: Likely enabled
- Custom preload scripts for IPC communication

---

## 6. Native Modules

### Location: `app/native/nativelibs/`

#### Database
- **db-cross-v4**: Cross-platform database module
  - Prebuilt binaries for darwin (macOS) x64 and arm64
  - `.node` native modules

#### File Utilities
- **file-utils**: Native file operations
  - Binaries for darwin, darwin-arm, ia32, x64
  - Platform-specific `.node` modules

#### SQLite
- **sqlite3**: SQLite database bindings
  - Multiple platform binaries in `binding/` directory

#### Image Processing
- **zimage**: Image manipulation
  - Darwin-specific binary

#### JPEG XL Support
- **zjxl**: JPEG XL format support
  - Build artifacts in `build/` directory

#### Video Calling
- **zcall**: Video call functionality
  - macOS-specific binary (`zcall_mac.node`)
  - Screen sharing components

#### Logging
- **logger**: Native logging module
  - Configuration and abstractions

#### Profiling
- **v8-profiles**: V8 profiler integration
  - macOS Electron 1.8 profiler binary

---

## 7. Auto-Update Configuration

### File: `app-update.yml`
```yaml
provider: generic
url: http://localhost:3001
channel: latest
updaterCacheDirName: zalo-updater
```

**Analysis:**
- Uses generic update provider
- Points to localhost (development/testing)
- Should be disabled or reconfigured for security

---

## 8. Python Integration

### System Tray Implementation
- **Location**: `original/en/main.py` and `original/vn/main.py`
- **Purpose**: System tray icon management
- **Dependencies**: 
  - `pystray` (Python system tray library)
  - `PIL` (Python Imaging Library)

### Startup Flow
1. `start.sh` launches Python script
2. Python script creates system tray
3. Python script launches Electron app
4. IPC communication between Python and Electron

**Security Concern**: Uses `os.system()` which is insecure (should use `subprocess.run()`)

---

## 9. Desktop Integration

### Desktop Entry Files (`original/prepare/`)
- `Zalo.desktop` - Standard desktop entry
- `Update Zalo.desktop` - Update launcher (English)
- `Cập Nhật Zalo.desktop` - Update launcher (Vietnamese)

### Current Issues
- Not following XDG Desktop Entry Specification completely
- Missing KDE-specific integration
- No proper MIME type associations

---

## 10. Installation Scripts

### Main Installer: `install.sh`
**Features:**
- Language selection (English/Vietnamese)
- Version selection (Zalo/ZaloZaDark)
- Python dependency installation
- Electron download and setup

**Security Issues:**
- Uses `pip --break-system-packages` ⚠️
- No checksum verification for downloads ⚠️
- Excessive sudo usage ⚠️
- Insecure temporary file handling ⚠️

### Alternative Installer: `install_curl.sh`
- Similar functionality with curl-based downloads

### Update Script: `update.sh`
- Handles application updates
- Similar security concerns

---

## 11. Code Obfuscation Analysis

### Obfuscation Techniques Used
1. **Webpack Bundling**: All code bundled into single files
2. **Minification**: Removed whitespace, shortened names
3. **Name Mangling**: Variables renamed to single letters
4. **Module Wrapping**: Webpack module system
5. **Hash-based Filenames**: Content hashing for cache busting

### Deobfuscation Strategy
1. **Beautification**: Use `js-beautify` to format code
2. **AST Parsing**: Use `esprima` to parse syntax tree
3. **Code Generation**: Use `escodegen` to regenerate readable code
4. **Manual Analysis**: Identify patterns and rename variables
5. **Documentation**: Add comments explaining functionality

### Priority Files for Deobfuscation
1. `main.js` (3.4 MB) - Main process logic
2. `preload.js` (3.8 MB) - IPC bridge
3. `zd-worker.js` (7.7 MB) - Core worker
4. `sentry.js` (312 KB) - Telemetry (for privacy controls)
5. `migration.js` (375 KB) - Database migrations

---

## 12. Identified Issues Summary

### Critical Security Issues
1. ⚠️ **Outdated Electron** (v22.3.27 - released 2023)
2. ⚠️ **Deprecated `request` package** (must replace)
3. ⚠️ **Old vulnerable dependencies** (ajv, tough-cookie, etc.)
4. ⚠️ **Always-on Sentry telemetry** (no user consent)
5. ⚠️ **Insecure installation scripts** (no checksums, excessive sudo)

### Functional Issues
6. ⚠️ **Broken Wayland support** (window controls)
7. ⚠️ **Message sync not working**
8. ⚠️ **Python tray uses insecure `os.system()`**

### Code Quality Issues
9. ⚠️ **Heavily minified code** (30+ MB needs deobfuscation)
10. ⚠️ **No source maps** (debugging difficult)
11. ⚠️ **Mixed architecture** (Python + Electron)

---

## 13. Recommendations

### Immediate Actions
1. **Deobfuscate critical files** (main.js, preload.js, workers)
2. **Update Electron** to v28.x LTS or v31.x LTS
3. **Replace `request`** with `axios`
4. **Update vulnerable dependencies**
5. **Disable Sentry by default** (implement opt-in)

### Medium Priority
6. **Fix Wayland window controls** (native frame or custom titlebar)
7. **Debug message sync** (add logging, identify root cause)
8. **Rewrite system tray** (use Electron native API)
9. **Harden installation scripts** (checksums, minimal sudo)

### Long Term
10. **Implement CSP** (Content Security Policy)
11. **Add comprehensive documentation**
12. **Create proper KDE integration**
13. **Set up automated testing**

---

## 14. File Size Summary

### Total Codebase Size
- **Minified JavaScript**: ~30 MB
- **Native Modules**: ~50 MB (estimated)
- **Assets**: ~10 MB (estimated)
- **Total Application**: ~90 MB

### Largest Files
1. `zd-worker.js` - 7.7 MB
2. `preload.js` - 3.8 MB
3. `main.js` - 3.4 MB
4. `preload-sqlite.js` - 2.4 MB
5. `search-worker.js` - 1.8 MB

---

## 15. Next Steps

Based on this analysis, the next tasks should be:

1. ✅ **Task 2 Complete**: Codebase structure documented
2. **Task 3**: Fix Wayland window controls
3. **Task 4**: Implement KDE Plasma integration
4. **Task 5**: Debug and fix message synchronization
5. **Task 6**: Begin deobfuscation of critical files
6. **Task 7**: Update Electron and dependencies

---

## Appendix A: Dependency Versions to Update

| Package | Current | Target | Priority |
|---------|---------|--------|----------|
| Electron | v22.3.27 | v28.x or v31.x | Critical |
| request | 2.88.0 | Remove (use axios) | Critical |
| axios | N/A | ^1.6.0 | Critical |
| ajv | 5.2.2 | ^8.12.0 | High |
| tough-cookie | ^2.3.2 | ^4.1.3 | High |
| crypto-js | 3.1.8 | ^4.2.0 | High |
| adm-zip | 0.4.16 | ^0.5.10 | High |
| js-yaml | ^3.8.4 | ^4.1.0 | High |
| node-fetch | 2.6.0 | ^3.3.2 | High |
| glob | 7.1.2 | ^10.3.10 | Medium |
| @sentry/electron | 4.8.0 | ^4.15.0 | Medium |
| @sentry/react | 6.2.4 | ^7.100.0 | Medium |

---

**Document Version**: 1.0  
**Last Updated**: October 5, 2025  
**Analyst**: Kiro AI Assistant

# Zalo Linux (ZaDark) - Architecture Documentation

## Overview

This document describes the architecture of the Zalo Linux desktop application **ZaDark variant**. ZaDark is a modified version of the standard Zalo client with additional dark theme customization features and UI enhancements.

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
│  (pc-dist/ - React-based UI + ZaDark enhancements)          │
│  - Main application UI                                       │
│  - Message rendering                                         │
│  - User interactions                                         │
│  - ZaDark theme engine (zadark.min.js)                       │
│  - ZaDark UI customizations                                  │
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

## Key Differences from Standard Zalo

### Additional ZaDark Files

ZaDark includes **14 additional JavaScript files** for theme customization and UI enhancements:

1. **zadark.min.js** (~40KB beautified)
   - Main ZaDark theme engine
   - Theme switching logic
   - Custom CSS injection

2. **zadark-main.min.js** (~2KB beautified)
   - ZaDark initialization
   - Main window customizations

3. **zadark-shared.min.js** (~1.4KB beautified)
   - Shared utilities for ZaDark
   - Common theme functions

4. **zadark-popup-viewer.min.js** (~0.9KB beautified)
   - Popup window theme support
   - Image viewer customizations

5. **zadark-znotification.min.js** (~0.6KB beautified)
   - Notification window theming
   - Dark mode for notifications

6. **zadark-zconv.min.js** (~1.6KB beautified)
   - Conversation window customizations
   - Chat UI enhancements

### ZaDark Dependencies

ZaDark bundles several third-party libraries:

1. **zadark-jquery.min.js** (~126KB beautified)
   - jQuery 3.x for DOM manipulation
   - Used by ZaDark theme engine

2. **zadark-localforage.min.js** (~49KB beautified)
   - LocalForage for theme settings storage
   - IndexedDB/localStorage wrapper

3. **zadark-tippy.min.js** (~39KB beautified)
   - Tippy.js for tooltips
   - Enhanced tooltip styling

4. **zadark-popper.min.js** (~32KB beautified)
   - Popper.js for positioning
   - Tooltip and dropdown positioning

5. **zadark-introjs.min.js** (~72KB beautified)
   - Intro.js for onboarding
   - Feature tour functionality

6. **zadark-hotkeys-js.min.js** (~9KB beautified)
   - Hotkeys.js for keyboard shortcuts
   - Custom keyboard bindings

7. **zadark-toastify.min.js** (~8KB beautified)
   - Toastify for notifications
   - Toast message styling

8. **zadark-translate.min.js** (~9KB beautified)
   - Translation utilities
   - Multi-language support for ZaDark UI

9. **zadark-webfont.min.js** (~19KB beautified)
   - Web Font Loader
   - Custom font loading

## Key Modules

### Main Process (`main-dist/`)

**Identical to standard Zalo variant** - See Zalo/ARCHITECTURE.md for details.

The main process files are the same:
- main.js (~5.2MB beautified)
- preload.js (~3.8MB beautified)
- preload-render.js (~2.3MB beautified)
- preload-shared-worker.js (~2.3MB beautified)
- preload-sqlite.js (~3.4MB beautified)
- migration.js (~301KB beautified)
- sentry.js (~459KB beautified)
- utility-process-sqlite.js (~1.1MB beautified)

### Renderer Process (`pc-dist/`)

#### Core Files (Same as Standard Zalo)

1. **render.js** (~9KB beautified)
2. **login.js** (~8KB beautified)
3. **znotification.js** (~6.4KB beautified)

#### Worker Files (Same as Standard Zalo)

1. **zd-worker.js** (~8.1MB beautified)
2. **search-worker.js** (~2.8MB beautified)
3. **shared-worker.js** (~104KB beautified)
4. **dal-worker.js** (~221KB beautified)
5. **cpu-heavy-worker.js** (~223KB beautified)
6. **opfs-worker.js** (~218KB beautified)
7. **pdf-worker.js** (~1.1MB beautified)
8. **preview-thumb-worker.js** (~302KB beautified)

#### Lazy-Loaded Modules (`lazy/`)

**Identical to standard Zalo** - Same 40+ lazy-loaded modules for code-splitting.

#### Libraries (`libs/`)

**Identical to standard Zalo**:
- libsignal-protocol.static.js (~1.3MB beautified)

## ZaDark Theme System

### Theme Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ZaDark Theme Engine                       │
│                    (zadark.min.js)                           │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Theme Manager  │  │  CSS Injector  │  │ Settings API │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           LocalForage (Theme Persistence)              │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                  Window-Specific Themes                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Main Window  │  │ Notification │  │  Popup Viewer    │  │
│  │ (main.min)   │  │ (znotif.min) │  │ (popup-view.min) │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Theme Features

1. **Dark Mode**: System-wide dark theme
2. **Custom Colors**: User-configurable color schemes
3. **Font Customization**: Custom font loading and sizing
4. **UI Enhancements**: Improved tooltips, notifications, and animations
5. **Keyboard Shortcuts**: Custom hotkeys for theme switching
6. **Onboarding**: Intro.js tour for new users
7. **Persistent Settings**: Theme preferences saved in IndexedDB

## Data Flow

### Theme Application Flow

```
User selects theme
  ↓
zadark.min.js (theme engine)
  ↓
zadark-localforage.min.js (save preference)
  ↓
CSS injection into DOM
  ↓
Window-specific theme scripts
  ↓
UI updates with new theme
```

### Standard Data Flow

**Identical to standard Zalo** - See Zalo/ARCHITECTURE.md for message sending/receiving flows.

## Security Considerations

### Same as Standard Zalo

1. **End-to-End Encryption**: Uses Signal Protocol
2. **Context Isolation**: Preload scripts use context bridge
3. **Node Integration**: Disabled in renderer process

### Additional ZaDark Concerns

1. **Third-Party Dependencies**: ZaDark includes jQuery, Popper, Tippy, etc.
   - Potential security vulnerabilities in dependencies
   - Need to audit and update libraries

2. **CSS Injection**: ZaDark injects custom CSS
   - Potential for CSS-based attacks
   - Need to sanitize user-provided themes

3. **LocalStorage/IndexedDB**: Theme settings stored locally
   - Potential for data leakage
   - Need to encrypt sensitive theme data

## Technology Stack

### Same as Standard Zalo

- **Framework**: Electron v22.3.27 (outdated, needs update)
- **UI Library**: React
- **State Management**: Redux
- **Database**: SQLite
- **Encryption**: Signal Protocol
- **Build Tool**: Webpack
- **Error Tracking**: Sentry

### Additional ZaDark Stack

- **DOM Manipulation**: jQuery 3.x
- **Storage**: LocalForage (IndexedDB/localStorage)
- **Tooltips**: Tippy.js + Popper.js
- **Onboarding**: Intro.js
- **Keyboard**: Hotkeys.js
- **Notifications**: Toastify
- **Fonts**: Web Font Loader

## File Size Summary

### Main Process
- Total: ~21MB beautified (same as standard Zalo)

### Renderer Process
- Total: ~111MB beautified (base Zalo files)
- **Additional ZaDark files**: ~377KB beautified
- **Grand Total**: ~111.4MB beautified

### Total Deobfuscated Code
- **78 JavaScript files** (14 more than standard Zalo)
- **~132MB total**

## Comparison: Zalo vs ZaDark

| Feature | Standard Zalo | ZaDark |
|---------|---------------|--------|
| JavaScript Files | 64 | 78 (+14) |
| Total Size | ~132MB | ~132MB |
| Dark Theme | No | Yes |
| Theme Customization | No | Yes |
| Custom Fonts | No | Yes |
| Enhanced Tooltips | No | Yes |
| Keyboard Shortcuts | Basic | Enhanced |
| Onboarding Tour | No | Yes |
| jQuery Dependency | No | Yes |
| Additional Libraries | 0 | 9 |

## Known Issues

### Same as Standard Zalo

1. **Wayland Compatibility**: Window controls don't work properly on Wayland
2. **Message Sync**: Occasional sync failures reported
3. **Outdated Electron**: Using v22, should update to v28+ or v31+
4. **Python Dependency**: System tray requires Python (should use native Electron Tray)
5. **Privacy**: Sentry enabled by default without user consent

### ZaDark-Specific Issues

1. **Dependency Vulnerabilities**: Third-party libraries may have security issues
2. **Theme Conflicts**: Custom themes may conflict with Zalo updates
3. **Performance**: Additional JavaScript may impact startup time
4. **Maintenance**: ZaDark modifications need to be maintained separately

## Deep Analysis Results

### Code Analysis Summary

**Completed**: 2025-10-05

**Main Process** (Identical to Zalo):
- **Total Functions**: 10,934
- **Total Classes**: 1,232
- **IPC Handlers**: 1 explicitly identified
- **Event Listeners**: 1,566
- **Code Size**: ~21MB beautified

**Renderer Process** (Zalo + ZaDark):
- **Base Functions**: ~8,000 (from Zalo)
- **ZaDark Functions**: ~100 (theme engine)
- **Total Code Size**: ~111.4MB beautified (+377KB ZaDark)

**Key Findings**:
1. Main process is 100% identical to Zalo
2. ZaDark adds 14 JavaScript files for theming
3. 9 third-party dependencies (jQuery, Tippy, Intro.js, etc.)
4. Theme engine uses localStorage and LocalForage (IndexedDB)
5. Privacy features implemented client-side

**Detailed Analysis Documents**:
- `ANALYSIS-main.md` - Main process analysis (identical to Zalo)
- `ANALYSIS-renderer.md` - Renderer process with ZaDark features
- `../FUNCTION-INDEX.md` - Comprehensive function catalog

### ZaDark Theme Engine Functions

#### Core Theme Functions (zadark.min.js)

```javascript
// Theme management
getTheme()                    // Returns: "dark" | "light"
saveTheme(theme)              // Saves to localStorage
applyTheme(theme)             // Injects CSS

// Font management
getFontFamily()               // Returns: font name (default: "Open Sans")
saveFontFamily(font)          // Saves to localStorage
getFontSize()                 // Returns: "small" | "medium" | "big" | "very-big"
saveFontSize(size)            // Saves to localStorage

// Privacy features
saveBlockSettings(setting, enabled)  // Saves privacy setting
getBlockSettings(setting)            // Gets privacy setting

// Storage
saveThreadChatBg(convId, imageData)  // Saves to LocalForage
getThreadChatBg(convId)              // Gets from LocalForage

// Translation
saveTranslateTarget(lang)     // Saves: "vi" | "en"
getTranslateTarget()          // Gets translation language
```

#### Window-Specific Functions

```javascript
// Main window (zadark-main.min.js)
initializeMainWindow()
applyMainWindowTheme()
setupKeyboardShortcuts()

// Notification window (zadark-znotification.min.js)
initializeNotificationWindow()
applyNotificationTheme()

// Popup viewer (zadark-popup-viewer.min.js)
initializePopupViewer()
applyPopupTheme()

// Conversation window (zadark-zconv.min.js)
initializeConversationWindow()
applyConversationTheme()
setCustomBackground(imageData)
```

### Security Analysis

#### ZaDark-Specific Security Concerns

**1. Third-Party Dependencies** (MEDIUM-HIGH Risk)
```
jQuery 3.x (~126KB)           - Check for known vulnerabilities
LocalForage (~49KB)           - Audit for XSS vulnerabilities
Tippy.js (~39KB)              - Update to latest version
Popper.js (~32KB)             - Update to latest version
Intro.js (~72KB)              - Sanitize tour content
Hotkeys.js (~9KB)             - Validate key bindings
Toastify (~8KB)               - Sanitize notification messages
Web Font Loader (~19KB)       - Validate font URLs
```

**Action**: Run `npm audit`, update all dependencies

**2. CSS Injection** (MEDIUM Risk)
```javascript
// ZaDark injects custom CSS into DOM
// Potential for CSS-based attacks
```

**Action**: Implement CSP, validate/sanitize all CSS

**3. Cookie Manipulation** (MEDIUM Risk)
```javascript
// Direct Electron cookie manipulation
window.$zelectron.setCookie(name, value, url, domain)
window.electronAPI.setCustomCookie(url, domain, cookieData)
```

**Action**: Validate all cookie operations, restrict domains

**4. LocalStorage/IndexedDB** (MEDIUM Risk)
```javascript
// Unencrypted storage of:
// - Theme preferences
// - Privacy settings
// - Custom backgrounds (images)
```

**Action**: Encrypt sensitive settings, clear on logout

### Performance Analysis

#### ZaDark Overhead

**Startup Time**:
- +14 JavaScript files to load
- +377KB code to parse
- jQuery initialization
- Font loading delay

**Runtime Performance**:
- CSS injection on theme change
- LocalForage I/O operations
- Hotkeys event listeners
- Tooltip rendering

**Optimization Recommendations**:
1. Lazy-load theme engine (only when needed)
2. Cache parsed CSS
3. Debounce theme changes
4. Optimize font loading
5. Remove unused jQuery features
6. Consider replacing jQuery with vanilla JS (-126KB)

### Call Graphs

#### Theme Application Flow
```
User Opens Zalo
  ↓
zadark-main.min.js loads
  ↓
Read theme from localStorage
  ↓
Load zadark.min.js (theme engine)
  ↓
Theme Engine Initializes:
  ├─ Load jQuery, Hotkeys, Toastify
  ├─ Read all settings (localStorage/LocalForage)
  ├─ Apply theme CSS
  ├─ Setup keyboard shortcuts
  └─ Initialize tooltips
  ↓
Window-Specific Themes Load:
  ├─ zadark-znotification.min.js (if notification)
  ├─ zadark-popup-viewer.min.js (if popup)
  └─ zadark-zconv.min.js (if conversation)
  ↓
Theme Applied, UI Updated
```

#### Privacy Setting Flow
```
User Toggles Privacy Setting
  ↓
zadark.min.js handles toggle
  ↓
Setting Saved To:
  ├─ localStorage (UI state)
  └─ Electron cookie (behavior control)
  ↓
Toast Notification Shown
  ↓
If Restart Required:
  └─ Prompt User
  ↓
On Restart:
  └─ Setting Applied
```

### Sequence Diagrams

#### Theme Switching
```
User → Settings: Select new theme
Settings → zadark.min.js: changeTheme(newTheme)
zadark.min.js → localStorage: saveTheme(newTheme)
zadark.min.js → DOM: Remove old theme CSS
zadark.min.js → DOM: Inject new theme CSS
DOM → UI: Re-render with new theme
zadark.min.js → Toastify: Show success notification
Toastify → User: "Đã áp dụng theme mới"
```

#### Custom Background Upload
```
User → Conversation: Upload background image
Conversation → zadark-zconv.min.js: setBackground(file)
zadark-zconv.min.js → File Reader: Read file as base64
File Reader → zadark-zconv.min.js: base64 data
zadark-zconv.min.js → LocalForage: saveThreadChatBg(convId, data)
LocalForage → IndexedDB: Store image data
IndexedDB → zadark-zconv.min.js: Success
zadark-zconv.min.js → DOM: Apply background CSS
DOM → UI: Show custom background
zadark-zconv.min.js → Toastify: Show success notification
```

## Next Steps

### Immediate (Security)
1. ✅ **COMPLETED**: Fix Wayland window controls (Task 3)
2. ✅ **COMPLETED**: Deep analysis and function indexing (Task 5)
3. **TODO**: Audit ZaDark dependencies (jQuery, Tippy, etc.)
4. **TODO**: Implement privacy controls for Sentry (Task 10)
5. **TODO**: Implement Content Security Policy (Task 11)
6. **TODO**: Disable auto-updater (Task 13)

### Short-Term (Modernization)
1. **TODO**: Update Electron to v28.x or v31.x LTS (Task 8)
2. **TODO**: Update npm dependencies (Task 9)
3. **TODO**: Fix message synchronization (Task 7)
4. **TODO**: Implement native Electron tray (Task 6)

### ZaDark-Specific
1. **TODO**: Update jQuery to latest 3.x version
2. **TODO**: Audit all third-party dependencies for vulnerabilities
3. **TODO**: Implement CSP-compatible theme injection
4. **TODO**: Add theme security validation
5. **TODO**: Optimize theme loading for better performance
6. **TODO**: Document theme customization API
7. **TODO**: Create theme migration guide for Zalo updates
8. **TODO**: Consider replacing jQuery with vanilla JS

### Long-Term (Maintainability)
1. **TODO**: Deobfuscate ZaDark theme engine code
2. **TODO**: Add comprehensive code comments
3. **TODO**: Create theme development guide
4. **TODO**: Add unit tests for theme engine
5. **TODO**: Document all theme settings and APIs
6. **TODO**: Create accessibility guide for themes

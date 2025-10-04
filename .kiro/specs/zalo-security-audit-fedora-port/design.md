# Design Document

## Overview

This document outlines the technical design for conducting a comprehensive security audit, modernization, and Fedora KDE Plasma 42 optimization of the Zalo Linux port. The project addresses critical security vulnerabilities, deobfuscates minified code, fixes broken features, and ensures seamless operation on Fedora KDE Plasma 42.

**Project Goals:**
1. Deobfuscate and reverse engineer minified JavaScript code
2. Update Electron and npm dependencies to secure versions
3. Implement privacy controls (Sentry opt-in, local logging)
4. Fix critical bugs (Wayland window controls, message sync)
5. Optimize for Fedora KDE Plasma 42 with native integration
6. Harden installation scripts and implement CSP
7. Maintain core functionality (messaging, file upload, sync)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Zalo Linux Application                    │
├─────────────────────────────────────────────────────────────┤
│  Electron v28.x/v31.x LTS                                   │
│  ├─ Main Process (Node.js)                                  │
│  │  ├─ Window Management (Wayland/X11 support)              │
│  │  ├─ System Tray (KDE Plasma integration)                 │
│  │  ├─ Auto-updater                                         │
│  │  └─ IPC Communication                                    │
│  │                                                           │
│  ├─ Renderer Process (Chromium)                             │
│  │  ├─ React UI (deobfuscated)                              │
│  │  ├─ Content Security Policy                              │
│  │  ├─ Messaging Engine                                     │
│  │  ├─ File Transfer                                        │
│  │  └─ Message Sync                                         │
│  │                                                           │
│  └─ Preload Scripts                                         │
│     └─ Secure IPC Bridge                                    │
├─────────────────────────────────────────────────────────────┤
│  Updated Dependencies                                        │
│  ├─ axios (replaces request)                                │
│  ├─ ajv v8.x                                                │
│  ├─ tough-cookie v4.x                                       │
│  └─ ... (all updated packages)                              │
├─────────────────────────────────────────────────────────────┤
│  Privacy Layer                                               │
│  ├─ Sentry (disabled by default, opt-in)                    │
│  ├─ Local Error Logger                                      │
│  └─ Privacy Settings UI                                     │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
zalo-linux-unofficial/
├── source-code/              # NEW: Deobfuscated source code
│   ├── main-dist/           # Deobfuscated main process code
│   ├── pc-dist/             # Deobfuscated renderer code
│   └── ARCHITECTURE.md      # Code structure documentation
├── Zalo/                    # Original minified code (preserved)
│   └── Zalo/app/
│       ├── main-dist/       # Original minified
│       ├── pc-dist/         # Original minified
│       ├── bootstrap.js
│       └── package.json     # Updated dependencies
├── install.sh               # Hardened installation script
├── update.sh                # Hardened update script
├── SECURITY.md              # Security policy
├── CHANGELOG.md             # Change log
├── LICENSE                  # Legal disclaimer
└── README.md                # Updated documentation
```

(Note: Maintain the structure for both versions: Zalo and ZaloZaDark)

## Components and Interfaces

### 1. Code Deobfuscation Module

**Purpose:** Reverse engineer and deobfuscate minified JavaScript code

**Components:**
- **Beautifier:** Formats minified code
- **Analyzer:** Identifies code patterns and structures
- **Documenter:** Generates code documentation

**Process:**
```javascript
// Input: Minified code
const minified = fs.readFileSync('main-dist/main.js');

// Step 1: Beautify
const beautified = beautify(minified, {
  indent_size: 2,
  space_in_empty_paren: true
});

// Step 2: Analyze and rename variables
const analyzed = analyzeCode(beautified);

// Step 3: Generate documentation
const documented = generateDocs(analyzed);

// Output: Readable source code
fs.writeFileSync('source-code/main-dist/main.js', documented);
```

**Tools:**
- `js-beautify` for code formatting
- `esprima` for AST parsing
- `escodegen` for code generation
- Manual analysis for critical sections

### 2. Dependency Update Module

**Purpose:** Update outdated and vulnerable dependencies

**Strategy:**
```javascript
// package.json updates
{
  "dependencies": {
    // BEFORE → AFTER
    "request": "2.88.0" → REMOVED (use axios)
    "axios": "NEW" → "^1.6.0"
    "ajv": "5.2.2" → "^8.12.0"
    "tough-cookie": "^2.3.2" → "^4.1.3"
    "crypto-js": "3.1.8" → "^4.2.0"
    "adm-zip": "0.4.16" → "^0.5.10"
    "js-yaml": "^3.8.4" → "^4.1.0"
    "node-fetch": "2.6.0" → "^3.3.2"
    "glob": "7.1.2" → "^10.3.10"
    "@sentry/electron": "4.8.0" → "^4.15.0" (with opt-in)
    "@sentry/react": "6.2.4" → "^7.100.0" (with opt-in)
  }
}
```

**Migration Plan:**
1. Update `package.json` with new versions
2. Run `npm install` to update `package-lock.json`
3. Refactor code for breaking changes
4. Test core functionality after each update

### 3. Privacy Control Module

**Purpose:** Implement user-controlled telemetry

**Architecture:**
```javascript
// Privacy Manager
class PrivacyManager {
  constructor() {
    this.settings = this.loadSettings();
  }

  loadSettings() {
    return {
      sentryEnabled: false, // Disabled by default
      localLoggingEnabled: true
    };
  }

  enableSentry() {
    if (this.settings.sentryEnabled) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        // ... config
      });
    }
  }

  logError(error) {
    // Always log locally
    this.localLogger.error(error);
    
    // Optionally send to Sentry
    if (this.settings.sentryEnabled) {
      Sentry.captureException(error);
    }
  }
}
```

**UI Component:**
```jsx
// Settings > Privacy
<PrivacySettings>
  <Toggle
    label="Enable error reporting (Sentry)"
    checked={sentryEnabled}
    onChange={handleSentryToggle}
  />
  <InfoText>
    Help improve Zalo by sending anonymous error reports
  </InfoText>
</PrivacySettings>
```

### 4. Wayland Window Controls Fix

**Purpose:** Fix missing window controls on Wayland

**Root Cause Analysis:**
- Electron's default frame is disabled
- Custom titlebar not rendering on Wayland
- Missing `frame: true` or custom titlebar implementation

**Solution:**
```javascript
// main.js - Window creation
const mainWindow = new BrowserWindow({
  width: 1200,
  height: 800,
  frame: process.platform === 'linux' ? true : false, // Enable native frame on Linux
  titleBarStyle: 'default',
  webPreferences: {
    // ... other settings
  }
});

// Alternative: Custom titlebar with Wayland support
if (process.platform === 'linux' && process.env.XDG_SESSION_TYPE === 'wayland') {
  mainWindow.setMenu(null); // Remove menu bar
  // Implement custom titlebar in renderer
}
```

**Custom Titlebar Component:**
```jsx
// TitleBar.jsx
const TitleBar = () => {
  const handleMinimize = () => ipcRenderer.send('window-minimize');
  const handleMaximize = () => ipcRenderer.send('window-maximize');
  const handleClose = () => ipcRenderer.send('window-close');

  return (
    <div className="titlebar" style={{ WebkitAppRegion: 'drag' }}>
      <div className="titlebar-drag-region"></div>
      <div className="titlebar-controls" style={{ WebkitAppRegion: 'no-drag' }}>
        <button onClick={handleMinimize}>−</button>
        <button onClick={handleMaximize}>□</button>
        <button onClick={handleClose}>×</button>
      </div>
    </div>
  );
};
```

### 5. Message Sync Fix

**Purpose:** Fix broken message synchronization

**Investigation Areas:**
1. WebSocket connection issues
2. IndexedDB/SQLite sync logic
3. Network request failures
4. Authentication token expiration

**Debugging Approach:**
```javascript
// Add comprehensive logging
class MessageSyncService {
  async syncMessages() {
    console.log('[MessageSync] Starting sync...');
    
    try {
      // Check connection
      if (!this.isConnected()) {
        console.error('[MessageSync] Not connected to server');
        await this.reconnect();
      }

      // Fetch latest messages
      const lastSyncTime = await this.getLastSyncTime();
      console.log('[MessageSync] Last sync:', new Date(lastSyncTime));
      
      const messages = await this.fetchMessages(lastSyncTime);
      console.log('[MessageSync] Fetched', messages.length, 'messages');

      // Store in local database
      await this.storeMessages(messages);
      
      // Update sync time
      await this.updateLastSyncTime(Date.now());
      
      console.log('[MessageSync] Sync completed successfully');
    } catch (error) {
      console.error('[MessageSync] Sync failed:', error);
      this.scheduleRetry();
    }
  }
}
```

### 6. Fedora KDE Plasma Integration

**Purpose:** Native desktop integration for KDE Plasma

**Components:**

**A. System Tray Integration:**
```javascript
// Use Electron's native tray API (better than Python script)
const { Tray, Menu } = require('electron');

class SystemTrayManager {
  constructor() {
    this.tray = null;
  }

  create() {
    this.tray = new Tray(path.join(__dirname, 'assets/Zalo.png'));
    
    const contextMenu = Menu.buildFromTemplate([
      { label: 'Open Zalo', click: () => this.showWindow() },
      { label: 'Settings', click: () => this.openSettings() },
      { type: 'separator' },
      { label: 'About', click: () => this.showAbout() },
      { label: 'Exit', click: () => app.quit() }
    ]);

    this.tray.setContextMenu(contextMenu);
    this.tray.setToolTip('Zalo');
    
    // Handle click events
    this.tray.on('click', () => this.showWindow());
  }
}
```

**B. KDE Notifications:**
```javascript
// Use libnotify for KDE-native notifications
const { Notification } = require('electron');

function showNotification(title, body) {
  const notification = new Notification({
    title,
    body,
    icon: path.join(__dirname, 'assets/Zalo.png'),
    urgency: 'normal' // KDE-specific
  });

  notification.show();
}
```

**C. Desktop Entry:**
```ini
# Zalo.desktop
[Desktop Entry]
Version=1.0
Type=Application
Name=Zalo
Comment=Zalo Messenger for Linux
Exec=/home/USER/.local/share/Zalo/zalo %U
Icon=/home/USER/.local/share/Zalo/assets/Zalo.png
Terminal=false
Categories=Network;InstantMessaging;
MimeType=x-scheme-handler/zalo;
StartupWMClass=Zalo
```

### 7. Installation Script Hardening

**Purpose:** Secure installation process

**Security Improvements:**
```bash
#!/bin/bash
set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Use system package manager for Python deps
install_python_deps_fedora() {
    echo "Installing Python dependencies via dnf..."
    sudo dnf install -y python3-pystray python3-pillow
}

# Verify Electron checksum
verify_electron_checksum() {
    local file="$1"
    local expected_sha256="$2"
    
    echo "Verifying Electron checksum..."
    local actual_sha256=$(sha256sum "$file" | awk '{print $1}')
    
    if [ "$actual_sha256" != "$expected_sha256" ]; then
        echo "ERROR: Checksum mismatch!"
        echo "Expected: $expected_sha256"
        echo "Actual:   $actual_sha256"
        exit 1
    fi
    
    echo "Checksum verified successfully"
}

# Use secure temp directory
TEMP_DIR=$(mktemp -d -t zalo-install-XXXXXXXXXX)
trap "rm -rf $TEMP_DIR" EXIT

# Download Electron with checksum verification
ELECTRON_VERSION="28.2.0"
ELECTRON_SHA256="<official_checksum_here>"
ELECTRON_URL="https://github.com/electron/electron/releases/download/v${ELECTRON_VERSION}/electron-v${ELECTRON_VERSION}-linux-x64.zip"

wget -O "$TEMP_DIR/electron.zip" "$ELECTRON_URL"
verify_electron_checksum "$TEMP_DIR/electron.zip" "$ELECTRON_SHA256"

# Extract and install
unzip "$TEMP_DIR/electron.zip" -d "$HOME/.local/share/Zalo/electron-v${ELECTRON_VERSION}-linux-x64"

# Set correct permissions
chmod 755 "$HOME/.local/share/Zalo/electron-v${ELECTRON_VERSION}-linux-x64/electron"
sudo chown root "$HOME/.local/share/Zalo/electron-v${ELECTRON_VERSION}-linux-x64/chrome-sandbox"
sudo chmod 4755 "$HOME/.local/share/Zalo/electron-v${ELECTRON_VERSION}-linux-x64/chrome-sandbox"

echo "Installation completed successfully!"
```

### 8. Content Security Policy (CSP)

**Purpose:** Protect against XSS and injection attacks

**Implementation:**
```javascript
// main.js
const session = require('electron').session;

app.on('ready', () => {
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'", // Needed for React
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https://zalo.me https://*.zalo.me",
          "connect-src 'self' wss://zalo.me https://zalo.me https://*.zalo.me",
          "font-src 'self' data:",
          "media-src 'self' https://zalo.me https://*.zalo.me"
        ].join('; ')
      }
    });
  });
});
```

**CSP Violation Logging:**
```javascript
// preload.js
window.addEventListener('securitypolicyviolation', (e) => {
  console.error('[CSP Violation]', {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective,
    originalPolicy: e.originalPolicy
  });
  
  // Send to local logger (not Sentry unless opted-in)
  ipcRenderer.send('csp-violation', {
    blockedURI: e.blockedURI,
    violatedDirective: e.violatedDirective
  });
});
```

## Data Models

### Privacy Settings Model

```typescript
interface PrivacySettings {
  sentryEnabled: boolean;
  localLoggingEnabled: boolean;
  telemetryLevel: 'none' | 'errors' | 'full';
  lastUpdated: number;
}
```

### Error Log Model

```typescript
interface ErrorLog {
  timestamp: number;
  level: 'error' | 'warn' | 'info';
  message: string;
  stack?: string;
  context?: Record<string, any>;
  sentToSentry: boolean;
}
```

## Error Handling

### Local Error Logger

```javascript
class LocalErrorLogger {
  constructor() {
    this.logFile = path.join(app.getPath('userData'), 'logs', 'error.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    const logDir = path.dirname(this.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  }

  log(level, message, context = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    fs.appendFileSync(
      this.logFile,
      JSON.stringify(entry) + '\n',
      'utf8'
    );

    // Rotate logs if file is too large (> 10MB)
    this.rotateLogs();
  }

  rotateLogs() {
    const stats = fs.statSync(this.logFile);
    if (stats.size > 10 * 1024 * 1024) {
      const backupFile = `${this.logFile}.${Date.now()}.bak`;
      fs.renameSync(this.logFile, backupFile);
      
      // Keep only last 5 backup files
      this.cleanOldBackups();
    }
  }
}
```

## Testing Strategy

### 1. Smoke Testing

**Objective:** Verify application launches and basic functionality

**Test Cases:**
- Application starts without errors
- Main window displays correctly
- System tray icon appears
- Login screen loads

### 2. Functional Testing

**Objective:** Verify core features work correctly

**Test Cases:**

**Messaging:**
- Send text message
- Receive text message
- Read receipts display correctly
- Message history loads

**File Upload:**
- Upload image file
- Upload document file
- Download received file
- File preview works

**Message Sync:**
- Messages sync across devices
- Sync works after offline period
- No duplicate messages
- Sync status indicator accurate

**Window Controls (Wayland):**
- Minimize button works
- Maximize button works
- Close button works
- Titlebar drag works
- Window resize works

### 3. Security Testing (Optional)

**Objective:** Verify security measures are effective

**Test Cases:**
- CSP blocks unauthorized scripts
- Sentry is disabled by default
- Local logging works
- No sensitive data in logs
- Electron sandbox is enabled

## Implementation Phases

### Phase 1: Code Deobfuscation (Days 1-2)
1. Set up deobfuscation tools
2. Process main-dist/ files
3. Process pc-dist/ files
4. Generate ARCHITECTURE.md
5. Commit to source-code/ directory

### Phase 2: Dependency Updates (Days 2-3)
1. Update package.json
2. Run npm install
3. Fix breaking changes (axios migration)
4. Test application launches
5. Verify core functionality

### Phase 3: Bug Fixes (Days 3-4)
1. Fix Wayland window controls
2. Debug and fix message sync
3. Test on Fedora KDE Plasma 42
4. Verify X11 compatibility

### Phase 4: Privacy & Security (Days 4-5)
1. Implement Privacy Manager
2. Add Sentry opt-in UI
3. Implement local error logger
4. Add CSP headers
5. Test privacy controls

### Phase 5: Fedora Integration (Days 5-6)
1. Rewrite system tray (Electron native)
2. Implement KDE notifications
3. Update desktop entry
4. Harden installation script
5. Test on Fedora KDE Plasma 42

### Phase 6: Documentation & Polish (Day 6)
1. Write SECURITY.md
2. Update CHANGELOG.md
3. Update README.md
4. Add legal disclaimer
5. Final testing

## Electron Version Decision

**Options:**
- v28.x LTS (recommended for stability)
- v31.x LTS (newer, more features)

**Decision Criteria:**
1. Test with v28.x first
2. If major issues, try v31.x
3. If both have issues, stay on v22.x with patches

**Migration Checklist:**
- [ ] Update electron version in package.json
- [ ] Test application launch
- [ ] Test window creation
- [ ] Test IPC communication
- [ ] Test native modules
- [ ] Test file system access
- [ ] Test network requests
- [ ] Test notifications
- [ ] Test system tray

## Risk Mitigation

### Risk 1: Electron Update Breaks App
**Mitigation:** Incremental testing, keep v22.x as fallback

### Risk 2: Message Sync Cannot Be Fixed
**Mitigation:** Deep debugging, community support, upstream bug report

### Risk 3: Deobfuscation Incomplete
**Mitigation:** Focus on critical sections, document unclear parts

### Risk 4: Timeline Overrun
**Mitigation:** Prioritize core features, defer optional items

## Success Criteria

1. ✅ Application launches on Fedora KDE Plasma 42
2. ✅ Messaging works (send, receive, read receipts)
3. ✅ File upload/download works
4. ✅ Message sync works
5. ✅ Wayland window controls work
6. ✅ System tray integration works
7. ✅ Sentry is disabled by default
8. ✅ No critical security vulnerabilities
9. ✅ Installation script is secure
10. ✅ Documentation is complete

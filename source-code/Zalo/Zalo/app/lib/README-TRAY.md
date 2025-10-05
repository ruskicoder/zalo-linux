# System Tray Implementation

## Overview

This directory contains the native Electron system tray implementation that replaces the Python `pystray` dependency.

## Files

- **SystemTrayManager.js** - Main tray manager class
- **tray-integration.js** - Integration module for connecting tray to main window
- **../init-tray.js** - Initialization script loaded by bootstrap.js

## Features

### Core Features
- ✅ Native Electron Tray API (no Python dependency)
- ✅ KDE Plasma StatusNotifierItem protocol support
- ✅ System tray icon with context menu
- ✅ Click to show/hide window
- ✅ Configurable tray settings

### Tray Menu Options
- **Open Zalo** - Show and focus main window
- **Tray Settings** - Submenu with:
  - Close button hides to tray (checkbox)
  - Minimize to tray (checkbox)
  - Start minimized to tray (checkbox)
- **Exit** - Quit application

### Settings Persistence
Settings are stored in `~/.config/Zalo/tray-settings.json`:

```json
{
  "closeToTray": false,
  "minimizeToTray": false,
  "startMinimized": false
}
```

## Usage

### Automatic Initialization

The tray is automatically initialized when the application starts via `bootstrap.js`:

```javascript
// bootstrap.js
require('./main-dist/main');
require('./init-tray'); // Initializes tray after 2 seconds
```

### Manual Initialization

You can also manually initialize the tray:

```javascript
const trayIntegration = require('./lib/tray-integration');
const { BrowserWindow } = require('electron');

// Get main window
const mainWindow = BrowserWindow.getAllWindows()[0];

// Initialize tray
trayIntegration.initialize(mainWindow);
```

### Accessing Tray Manager

```javascript
const trayIntegration = require('./lib/tray-integration');

// Get tray manager instance
const trayManager = trayIntegration.getTrayManager();

// Check if initialized
if (trayIntegration.isReady()) {
  // Get current settings
  const settings = trayManager.getSettings();
  
  // Update settings
  trayManager.saveSettings({
    closeToTray: true,
    minimizeToTray: true
  });
  
  // Show/hide window
  trayManager.showWindow();
  trayManager.hideWindow();
  trayManager.toggleWindow();
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      bootstrap.js                            │
│  - Loads main.js                                             │
│  - Loads init-tray.js                                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                      init-tray.js                            │
│  - Waits for app ready                                       │
│  - Finds main window                                         │
│  - Calls trayIntegration.initialize()                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                  tray-integration.js                         │
│  - Gets SystemTrayManager instance                           │
│  - Calls trayManager.create(mainWindow)                      │
│  - Sets up window event handlers                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│                 SystemTrayManager.js                         │
│  - Creates Electron Tray                                     │
│  - Builds context menu                                       │
│  - Handles tray events                                       │
│  - Manages settings persistence                              │
└─────────────────────────────────────────────────────────────┘
```

## Event Flow

### Window Close Event

```
User clicks close button
  ↓
Window 'close' event fired
  ↓
tray-integration.js handles event
  ↓
Calls trayManager.handleWindowClose(event)
  ↓
If closeToTray is enabled:
  - event.preventDefault()
  - mainWindow.hide()
Else:
  - Window closes normally
```

### Tray Click Event

```
User clicks tray icon
  ↓
Tray 'click' event fired
  ↓
SystemTrayManager handles event
  ↓
Calls toggleWindow()
  ↓
If window is visible:
  - mainWindow.hide()
Else:
  - mainWindow.show()
  - mainWindow.focus()
```

### Settings Change Event

```
User toggles setting in menu
  ↓
Menu item 'click' event fired
  ↓
SystemTrayManager handles event
  ↓
Calls saveSettings(newSettings)
  ↓
Settings saved to tray-settings.json
  ↓
Context menu updated with new state
```

## Testing

### Test Tray Icon Appears

1. Start application: `./start-dev.sh`
2. Check system tray for Zalo icon
3. Verify icon is visible in KDE Plasma system tray

### Test Tray Menu

1. Right-click tray icon
2. Verify menu appears with:
   - Open Zalo
   - Tray Settings (submenu)
   - Exit
3. Click each menu item to test functionality

### Test Close to Tray

1. Right-click tray icon → Tray Settings → Enable "Close button hides to tray"
2. Click window close button (X)
3. Verify window hides instead of closing
4. Click tray icon to restore window

### Test Minimize to Tray

1. Right-click tray icon → Tray Settings → Enable "Minimize to tray"
2. Click window minimize button (−)
3. Verify window hides instead of minimizing
4. Click tray icon to restore window

### Test Start Minimized

1. Right-click tray icon → Tray Settings → Enable "Start minimized to tray"
2. Restart application
3. Verify window starts hidden
4. Click tray icon to show window

### Test Settings Persistence

1. Enable all tray settings
2. Restart application
3. Verify settings are still enabled
4. Check `~/.config/Zalo/tray-settings.json` exists

## KDE Plasma Integration

The tray implementation uses Electron's native Tray API, which automatically integrates with KDE Plasma's StatusNotifierItem protocol.

### Features Supported

- ✅ System tray icon display
- ✅ Context menu on right-click
- ✅ Click to show/hide window
- ✅ Tooltip on hover
- ✅ Icon scaling for HiDPI displays

### Wayland Compatibility

The tray works on both X11 and Wayland sessions:

- **X11**: Full support via XEmbed protocol
- **Wayland**: Full support via StatusNotifierItem protocol

## Troubleshooting

### Tray Icon Not Appearing

**Symptom**: No tray icon in system tray

**Possible Causes**:
1. Icon file not found
2. Tray not initialized
3. KDE Plasma tray disabled

**Solutions**:
1. Check console for `[SystemTrayManager] Icon found at: ...`
2. Verify `assets/Zalo.png` exists
3. Enable system tray in KDE Plasma settings

### Tray Menu Not Working

**Symptom**: Right-click on tray icon does nothing

**Possible Causes**:
1. Context menu not created
2. Electron version issue

**Solutions**:
1. Check console for `[SystemTrayManager] Tray created successfully`
2. Update Electron to v28+ or v31+

### Settings Not Persisting

**Symptom**: Settings reset after restart

**Possible Causes**:
1. Settings file not writable
2. Incorrect file path

**Solutions**:
1. Check permissions on `~/.config/Zalo/`
2. Check console for `[SystemTrayManager] Settings saved: ...`

### Window Not Hiding to Tray

**Symptom**: Close button closes app instead of hiding

**Possible Causes**:
1. Setting not enabled
2. Event handler not registered

**Solutions**:
1. Enable "Close button hides to tray" in tray menu
2. Check console for `[TrayIntegration] Window close prevented, hiding to tray`

## Migration from Python Tray

### Before (Python)

```bash
# Start script used Python
python main.py

# main.py started Electron as subprocess
process = subprocess.Popen([electron_path, app_path])
```

### After (Native Electron)

```bash
# Start script runs Electron directly
./electron-v22.3.27-linux-x64/electron app

# Tray is initialized inside Electron
require('./init-tray');
```

### Benefits

1. **No Python Dependency**: Removes `python3-pystray` and `python3-pillow` requirements
2. **Better Integration**: Native Electron Tray API integrates better with desktop environments
3. **Simpler Architecture**: No subprocess management needed
4. **More Features**: Configurable tray settings, persistent preferences
5. **Better Performance**: No IPC overhead between Python and Electron

## Requirements Satisfied

- ✅ **Requirement 5.1**: KDE Plasma system tray integration
- ✅ **Requirement 5.2**: KDE Plasma notification system (via Electron Notification API)
- ✅ **Requirement 7.1**: Improved tray implementation (native vs Python)

## Future Enhancements

- [ ] Add notification count badge on tray icon
- [ ] Add quick actions in tray menu (New Message, etc.)
- [ ] Add tray icon animation for new messages
- [ ] Add custom tray icon themes
- [ ] Add keyboard shortcuts for tray actions
- [ ] Add tray icon tooltip with unread count

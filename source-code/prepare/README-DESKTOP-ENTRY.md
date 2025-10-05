# Desktop Entry Files

## Overview

This directory contains XDG Desktop Entry files for integrating Zalo with KDE Plasma and other desktop environments.

## Files

- **Zalo.desktop** - Desktop entry for standard Zalo
- **ZaDark.desktop** - Desktop entry for ZaDark variant
- **Update Zalo.desktop** - Desktop entry for update script (Vietnamese)
- **Cập Nhật Zalo.desktop** - Desktop entry for update script (English)

## XDG Desktop Entry Specification

The desktop entry files follow the [XDG Desktop Entry Specification v1.5](https://specifications.freedesktop.org/desktop-entry-spec/latest/).

### Key Fields

#### Basic Information

- **Name**: Application name displayed in menus
- **GenericName**: Generic application type (e.g., "Instant Messenger")
- **Comment**: Brief description of the application
- **Keywords**: Search keywords for application launchers

#### Executable and Icon

- **Exec**: Command to execute the application
  - Uses `%h` for home directory (XDG variable)
  - Example: `bash %h/.local/share/Zalo/start.sh`
- **Icon**: Path to application icon
  - Uses `%h` for home directory
  - Example: `%h/.local/share/Zalo/assets/Zalo.png`
- **TryExec**: Path to test if executable exists

#### Application Type

- **Type**: Application type (always "Application")
- **Terminal**: Whether to run in terminal (false)

#### Categories

- **Categories**: XDG menu categories
  - Network: Network-related application
  - InstantMessaging: Instant messaging application
  - Chat: Chat application

#### MIME Types

- **MimeType**: Supported MIME types
  - `x-scheme-handler/zalo`: Handle zalo:// URLs

#### Startup Notification

- **StartupNotify**: Enable startup notification (true)
- **StartupWMClass**: Window manager class for window matching
  - Set to "Zalo" to match Electron window class

#### KDE Plasma Specific

- **X-KDE-StartupNotify**: Enable KDE startup notification
- **X-KDE-SubstituteUID**: Don't substitute user ID
- **X-KDE-Username**: Username (empty for current user)

## Installation

### Manual Installation

```bash
# Copy desktop entry to applications directory
cp Zalo.desktop ~/.local/share/applications/

# Update desktop database
update-desktop-database ~/.local/share/applications/
```

### Automatic Installation

The installation script (`install.sh`) automatically installs the desktop entry:

```bash
# Install Zalo
./install.sh

# Desktop entry is installed to:
# ~/.local/share/applications/Zalo.desktop
```

## Usage

### Launch from Application Menu

1. Open KDE Application Launcher (Super key)
2. Search for "Zalo"
3. Click to launch

### Launch from Command Line

```bash
# Using desktop entry
gtk-launch Zalo

# Or using xdg-open
xdg-open zalo://
```

### Pin to Taskbar

1. Launch Zalo
2. Right-click taskbar icon
3. Select "Pin to Taskbar"

### Add to Favorites

1. Open KDE Application Launcher
2. Find Zalo
3. Right-click → "Add to Favorites"

## Customization

### Change Icon

Edit the `Icon` field in the desktop entry:

```ini
Icon=/path/to/custom/icon.png
```

### Change Launch Command

Edit the `Exec` field:

```ini
# Launch with custom flags
Exec=bash %h/.local/share/Zalo/start.sh --custom-flag

# Launch with environment variables
Exec=env VAR=value bash %h/.local/share/Zalo/start.sh
```

### Add Custom Actions

Add actions to the desktop entry:

```ini
[Desktop Entry]
# ... existing fields ...

Actions=NewMessage;Settings;

[Desktop Action NewMessage]
Name=New Message
Exec=bash %h/.local/share/Zalo/start.sh --new-message

[Desktop Action Settings]
Name=Settings
Exec=bash %h/.local/share/Zalo/start.sh --settings
```

## KDE Plasma Integration

### Application Launcher

The desktop entry appears in:
- KDE Application Launcher
- KickOff menu
- Application Dashboard
- Search results

### Taskbar

When Zalo is running:
- Icon appears in taskbar
- Window title matches application name
- Right-click menu shows desktop actions

### System Tray

The system tray icon is managed by the SystemTrayManager, not the desktop entry.

### Notifications

Notifications are managed by the NotificationManager, not the desktop entry.

## Troubleshooting

### Application Not Appearing in Menu

**Symptom**: Zalo doesn't appear in application launcher

**Possible Causes**:
1. Desktop entry not installed
2. Desktop database not updated
3. Invalid desktop entry syntax

**Solutions**:
1. Check if file exists: `ls ~/.local/share/applications/Zalo.desktop`
2. Update database: `update-desktop-database ~/.local/share/applications/`
3. Validate syntax: `desktop-file-validate ~/.local/share/applications/Zalo.desktop`

### Icon Not Showing

**Symptom**: Application appears without icon

**Possible Causes**:
1. Icon path incorrect
2. Icon file doesn't exist
3. Icon format not supported

**Solutions**:
1. Check icon path in desktop entry
2. Verify icon exists: `ls ~/.local/share/Zalo/assets/Zalo.png`
3. Use PNG format for icons

### Application Won't Launch

**Symptom**: Clicking application does nothing

**Possible Causes**:
1. Exec path incorrect
2. Start script not executable
3. Dependencies missing

**Solutions**:
1. Check Exec path in desktop entry
2. Make script executable: `chmod +x ~/.local/share/Zalo/start.sh`
3. Check dependencies: Electron, etc.

### Wrong Window Class

**Symptom**: Taskbar shows multiple icons for same app

**Possible Causes**:
1. StartupWMClass doesn't match window class
2. Electron window class incorrect

**Solutions**:
1. Check window class: `xprop WM_CLASS` (click on window)
2. Update StartupWMClass to match
3. Set window class in Electron: `webPreferences.title = 'Zalo'`

## Validation

### Validate Desktop Entry

```bash
# Install desktop-file-utils
sudo dnf install desktop-file-utils

# Validate desktop entry
desktop-file-validate ~/.local/share/applications/Zalo.desktop
```

### Test Desktop Entry

```bash
# Test if executable exists
test -x ~/.local/share/Zalo/start.sh && echo "OK" || echo "FAIL"

# Test if icon exists
test -f ~/.local/share/Zalo/assets/Zalo.png && echo "OK" || echo "FAIL"

# Launch application
gtk-launch Zalo
```

## Requirements Satisfied

- ✅ **Requirement 5.5**: XDG Desktop Entry Specification compliance
- ✅ Correct Exec, Icon, Categories
- ✅ MimeType and StartupWMClass
- ✅ KDE Plasma specific fields

## References

- [XDG Desktop Entry Specification](https://specifications.freedesktop.org/desktop-entry-spec/latest/)
- [XDG Menu Specification](https://specifications.freedesktop.org/menu-spec/latest/)
- [KDE Desktop Entry Extensions](https://userbase.kde.org/KDE_System_Administration/Desktop_Entry_Extensions)
- [Freedesktop.org Icon Theme Specification](https://specifications.freedesktop.org/icon-theme-spec/latest/)

## Future Enhancements

- [ ] Add localized Name and Comment fields
- [ ] Add desktop actions (New Message, Settings, etc.)
- [ ] Add DBusActivatable support
- [ ] Add PrefersNonDefaultGPU for better performance
- [ ] Add X-GNOME-UsesNotifications for GNOME
- [ ] Add X-Unity-IconBackgroundColor for Unity

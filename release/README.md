# Zalo Linux v24.9.1 (Wayland Fixed)

**Release Date:** October 5, 2025  
**Version:** v24.9.1-wayland-fix

---

## What's New

This release fixes critical Wayland window control issues, making Zalo fully functional on modern Linux desktop environments.

### ✅ Fixed Issues

- **Wayland Window Controls** - All window controls (minimize, maximize, close) now work correctly
- **Native Window Frame** - Uses native window decorations on Linux for better desktop integration
- **Titlebar Drag** - Window can be moved by dragging the titlebar
- **Window Resize** - Window can be resized from corners and edges
- **KDE Plasma Support** - Full support for KDE Plasma 42 on Fedora

### 🎯 Features

- ✅ Native window frame for Linux (Wayland + X11)
- ✅ Working window controls (minimize, maximize, close)
- ✅ Draggable titlebar
- ✅ Resizable window
- ✅ Native appearance matching system theme
- ✅ Full KDE Plasma integration
- ✅ System tray support

---

## System Requirements

### Supported Distributions

- **Fedora** 38+ (Recommended: Fedora 42)
- **Ubuntu** 22.04+
- **Debian** 11+
- Other Linux distributions (may require manual dependency installation)

### Desktop Environments

- **KDE Plasma** (Recommended)
- GNOME
- XFCE
- Other desktop environments with X11 or Wayland support

### Display Servers

- ✅ Wayland (Fully supported)
- ✅ X11 (Fully supported)

### Dependencies

- Python 3.8+
- python3-pystray
- python3-pillow
- wget
- unzip

---

## Installation

### Quick Install

```bash
# Extract the archive
tar -xzf zalo-linux-v24.9.1-wayland-fix.tar.gz
cd zalo-linux-v24.9.1-wayland-fix

# Run installer
chmod +x install.sh
./install.sh
```

### Manual Installation Steps

1. **Extract the archive:**
   ```bash
   tar -xzf zalo-linux-v24.9.1-wayland-fix.tar.gz
   cd zalo-linux-v24.9.1-wayland-fix
   ```

2. **Make installer executable:**
   ```bash
   chmod +x install.sh
   ```

3. **Run installer:**
   ```bash
   ./install.sh
   ```

4. **Follow the prompts:**
   - Select language (English or Vietnamese)
   - Select version (Zalo or ZaloZaDark)
   - Enter sudo password when prompted (for chrome-sandbox permissions)

---

## Usage

### Launch Zalo

**Method 1: Application Menu**
- Open your application menu
- Search for "Zalo"
- Click to launch

**Method 2: Desktop Icon**
- Double-click the Zalo icon on your desktop

**Method 3: Command Line**
```bash
~/.local/share/Zalo/start.sh
```

---

## Uninstallation

### Quick Uninstall

```bash
~/.local/share/Zalo/uninstall.sh
```

### Manual Uninstallation

```bash
# Remove application
rm -rf ~/.local/share/Zalo

# Remove desktop entries
rm -f ~/.local/share/applications/Zalo.desktop
rm -f ~/.local/share/applications/"Update Zalo.desktop"
rm -f ~/Desktop/Zalo.desktop

# Optional: Remove user data
rm -rf ~/.config/Zalo
```

---

## Versions Included

### 1. Zalo (Standard)
- Standard Zalo interface
- Light theme

### 2. ZaloZaDark (Dark Theme)
- Dark theme interface
- Better for low-light environments

---

## Technical Details

### What Was Fixed

**Original Issue:**
- Application used frameless window design from macOS
- Window controls were missing/non-functional on Wayland
- Titlebar was not draggable
- Application was unusable on Wayland

**Solution:**
- Enabled native window frame on Linux
- Changed `frame: false` to `frame: process.platform === 'linux'`
- Maintains frameless design on macOS/Windows
- Provides native window controls on Linux

### File Structure

```
~/.local/share/Zalo/
├── Zalo/                          # Application files
│   └── app/
│       ├── main-dist/             # Main process (patched)
│       ├── pc-dist/               # Renderer process
│       └── ...
├── electron-v22.3.27-linux-x64/   # Electron runtime
├── start.sh                       # Launcher script
├── main.py                        # System tray script
├── uninstall.sh                   # Uninstaller
└── version.txt                    # Version info
```

---

## Known Issues

### Message Sync Not Working
- **Status:** Known issue (will be fixed in future release)
- **Impact:** Messages may not sync across devices
- **Workaround:** Restart application to force sync

### Window Position Not Remembered
- **Status:** Minor issue
- **Impact:** Window position resets on restart
- **Workaround:** None currently

---

## Troubleshooting

### Application Won't Launch

**Check chrome-sandbox permissions:**
```bash
ls -la ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
```

Should show: `-rwsr-xr-x 1 root ...`

**Fix permissions:**
```bash
sudo chown root ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
sudo chmod 4755 ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
```

### Python Tray Error

**Install dependencies:**
```bash
# Fedora
sudo dnf install python3-pystray python3-pillow

# Ubuntu/Debian
sudo apt install python3-pystray python3-pil
```

### Window Controls Still Not Working

**Verify you're using the patched version:**
```bash
# Check version
cat ~/.local/share/Zalo/version.txt
```

Should show: `v24.9.1-wayland-fix` or similar

**Reinstall if needed:**
```bash
./install.sh
```

---

## Support

### Reporting Issues

If you encounter issues, please provide:
1. Linux distribution and version
2. Desktop environment and version
3. Display server (Wayland or X11)
4. Error messages or logs
5. Steps to reproduce

### Getting Help

- Check the troubleshooting section above
- Review known issues
- Check system requirements

---

## Credits

### Original Application
- **Zalo** by VNG Corporation
- **ZaloZaDark** theme by community

### Wayland Fix
- Window controls fix by community contributors
- Tested on Fedora KDE Plasma 42

---

## Disclaimer

This is an **unofficial community port** of Zalo for Linux with Wayland fixes. This project is:

- ❌ **NOT** affiliated with VNG Corporation or Zalo
- ❌ **NOT** officially supported by VNG Corporation
- ✅ **Community-maintained** and provided as-is
- ✅ **Open to contributions** and improvements

**Use at your own risk.** The maintainers are not responsible for:
- Data loss
- Account issues
- Breaking changes from official Zalo updates
- Any other issues arising from use of this software

---

## License

This package includes:
- Zalo application (proprietary - © VNG Corporation)
- Electron runtime (MIT License)
- Community patches and scripts (MIT License)

The Wayland fix patches and installation scripts are provided under MIT License.

---

## Changelog

### v24.9.1-wayland-fix (2025-10-05)

**Added:**
- Native window frame support for Linux
- Working window controls on Wayland
- Improved KDE Plasma integration
- Proper install/uninstall scripts

**Fixed:**
- Window controls not working on Wayland
- Titlebar not draggable
- Window not resizable
- Application unusable on Wayland

**Changed:**
- Window frame behavior on Linux (now uses native frame)
- Installation process (improved dependency handling)

---

**Version:** v24.9.1-wayland-fix  
**Release Date:** October 5, 2025  
**Status:** Stable

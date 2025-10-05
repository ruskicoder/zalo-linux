# Zalo Linux - Build Instructions

This document provides complete instructions for building and running Zalo Linux from the source code in this directory.

## Prerequisites

### System Requirements

- **OS**: Fedora 40+ (or any modern Linux distribution)
- **Desktop**: KDE Plasma 6.2+ (or any desktop environment)
- **Node.js**: v16.x or higher
- **npm**: v8.x or higher
- **Python**: 3.x (for system tray - will be replaced in Task 6)

### Install Dependencies

#### Fedora/RHEL

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Install Electron dependencies
sudo dnf install libXScrnSaver gtk3 nss alsa-lib libXtst libnotify

# Install Python (for system tray)
sudo dnf install python3 python3-pip

# Install Python dependencies
pip3 install --user pystray pillow
```

#### Ubuntu/Debian

```bash
# Install Node.js and npm
sudo apt install nodejs npm

# Install Electron dependencies
sudo apt install libxss1 libgtk-3-0 libnss3 libasound2 libxtst6 libnotify4

# Install Python (for system tray)
sudo apt install python3 python3-pip

# Install Python dependencies
pip3 install --user pystray pillow
```

## Directory Structure

```
source-code/
├── Zalo/                    # Standard Zalo variant
│   ├── assets/             # Icons and images
│   ├── start.sh            # Startup script
│   └── Zalo/               # Application directory
│       └── app/            # Application files (main-dist, pc-dist, lib, etc.)
│
├── ZaDark/                  # ZaDark variant (with dark theme)
│   ├── assets/             # Icons and images
│   ├── start.sh            # Startup script
│   └── Zalo/               # Application directory
│       └── app/            # Application files (main-dist, pc-dist, lib, etc.)
│
├── prepare/                 # Desktop entry files
├── en/                      # English localization
├── vn/                      # Vietnamese localization
├── install.sh               # Installation script
├── uninstall.sh            # Uninstallation script
├── update.sh               # Update script
└── version.txt             # Version information
```

## Building from Source

### Option 1: Run Directly (No Installation)

#### Standard Zalo

```bash
cd source-code/Zalo
./start.sh
```

**Note**: The start.sh script expects the application to be installed at `~/.local/share/Zalo/`. For development, you can modify the script or install first.

#### ZaDark Variant

```bash
cd source-code/ZaDark
./start.sh
```

**Note**: The start.sh script expects the application to be installed at `~/.local/share/Zalo/`. For development, you can modify the script or install first.

### Option 2: Install System-Wide

#### Standard Zalo

```bash
cd source-code

# Edit install.sh to ensure it points to Zalo directory
# (Default is Zalo)

# Install
sudo ./install.sh

# Run from application menu or terminal
zalo
```

#### ZaDark Variant

```bash
cd source-code

# Edit install.sh to point to ZaDark directory
# Change: SOURCE_DIR="Zalo" to SOURCE_DIR="ZaDark"

# Install
sudo ./install.sh

# Run from application menu or terminal
zalo
```

## Installation Details

### What Gets Installed

The installation script (`install.sh`) performs the following:

1. **Creates directories**:
   - `/opt/zalo/` - Application files
   - `~/.config/zalo/` - User configuration
   - `~/.local/share/zalo/` - User data

2. **Copies files**:
   - Application code (main-dist/, pc-dist/, lib/, libs/, native/)
   - Assets (icons, images)
   - Configuration files (package.json, bootstrap.js)
   - Startup script (start.sh)

3. **Creates desktop entries**:
   - `~/.local/share/applications/Zalo.desktop` - Main launcher
   - `~/.local/share/applications/Update Zalo.desktop` - Update launcher

4. **Sets permissions**:
   - Makes start.sh executable
   - Sets proper ownership

### Installation Locations

| Item | Location |
|------|----------|
| Application | `/opt/zalo/` |
| User Config | `~/.config/zalo/` |
| User Data | `~/.local/share/zalo/` |
| Desktop Entry | `~/.local/share/applications/Zalo.desktop` |
| Logs | `~/.config/zalo/logs/` |

## Uninstallation

```bash
cd source-code
sudo ./uninstall.sh
```

This will:

- Remove `/opt/zalo/`
- Remove desktop entries
- Preserve user data in `~/.config/zalo/` and `~/.local/share/zalo/`

To completely remove including user data:

```bash
sudo ./uninstall.sh
rm -rf ~/.config/zalo ~/.local/share/zalo
```

## Updating

```bash
cd source-code
sudo ./update.sh
```

This will:

- Download latest version (if configured)
- Backup current installation
- Install new version
- Preserve user data

## Troubleshooting

### Application Won't Start

**Check logs**:

```bash
cat ~/.config/zalo/logs/main.log
cat ~/.config/zalo/logs/renderer.log
```

**Check permissions**:

```bash
ls -la /opt/zalo/
ls -la ~/.config/zalo/
```

**Reinstall**:

```bash
sudo ./uninstall.sh
sudo ./install.sh
```

### Missing Dependencies

**Check Electron dependencies**:

```bash
ldd /opt/zalo/lib/libffmpeg.so
ldd /opt/zalo/lib/libEGL.so
```

**Install missing libraries**:

```bash
# Fedora
sudo dnf install <missing-library>

# Ubuntu
sudo apt install <missing-library>
```

### Wayland Issues

**Window controls not working**:

- ✅ Fixed in Task 3
- Ensure you're running the latest version

**Force X11 mode** (if needed):

```bash
GDK_BACKEND=x11 zalo
```

### Python Tray Issues

**Tray icon not showing**:

```bash
# Check Python dependencies
pip3 list | grep -E "pystray|pillow"

# Reinstall if needed
pip3 install --user --force-reinstall pystray pillow
```

**Note**: Python tray will be replaced with native Electron tray in Task 6.

## Development

### Running in Development Mode

```bash
cd source-code/Zalo  # or ZaDark

# Set development environment
export NODE_ENV=development

# Run with debugging
./start.sh --enable-logging --v=1
```

### Debugging

**Enable DevTools**:

- Press `Ctrl+Shift+I` in the application
- Or add `--remote-debugging-port=9222` to start.sh

**View main process logs**:

```bash
tail -f ~/.config/zalo/logs/main.log
```

**View renderer process logs**:

```bash
tail -f ~/.config/zalo/logs/renderer.log
```

### Modifying Code

1. **Edit deobfuscated files** in `main-dist/` or `pc-dist/`
2. **Test changes** by running `./start.sh`
3. **Document changes** in ARCHITECTURE.md or ANALYSIS-*.md
4. **Commit changes** to version control

**Note**: The code is heavily obfuscated. See FUNCTION-INDEX.md for function catalog.

## Building Modified Version

### Prerequisites

```bash
# Install build tools
npm install -g electron-packager electron-builder
```

### Package Application

```bash
cd source-code/Zalo  # or ZaDark

# Package for Linux
electron-packager . Zalo --platform=linux --arch=x64 --out=dist/

# Or use electron-builder
electron-builder --linux --x64
```

### Create Installer

```bash
# Create .deb package
electron-builder --linux deb

# Create .rpm package
electron-builder --linux rpm

# Create AppImage
electron-builder --linux AppImage
```

## Security Considerations

### Before Deploying

1. **Disable Sentry** (Task 10):
   - Remove Sentry initialization in main.js
   - Or implement opt-in controls

2. **Implement CSP** (Task 11):
   - Add Content Security Policy headers
   - Restrict inline scripts and styles

3. **Disable Auto-Updater** (Task 13):
   - Remove auto-updater code
   - Or implement user-controlled updates

4. **Update Electron** (Task 8):
   - Update to v28.x or v31.x LTS
   - Test all functionality

5. **Audit Dependencies** (Task 9):
   - Run `npm audit`
   - Update vulnerable packages

### ZaDark-Specific

1. **Audit Third-Party Libraries**:
   - jQuery, Tippy, Intro.js, etc.
   - Check for known vulnerabilities

2. **Validate Theme CSS**:
   - Sanitize user-provided themes
   - Implement CSP-compatible theming

## Performance Optimization

### Reduce Startup Time

1. **Lazy-load modules**:
   - Defer non-critical imports
   - Use dynamic imports

2. **Optimize assets**:
   - Compress images
   - Minify CSS/JS

3. **Cache compiled code**:
   - Use V8 code cache
   - Precompile frequently used modules

### Reduce Memory Usage

1. **Limit worker threads**:
   - Reduce concurrent workers
   - Implement worker pooling

2. **Optimize React rendering**:
   - Use React.memo
   - Implement virtual scrolling

3. **Clear unused data**:
   - Implement data expiration
   - Clear old messages/files

## Testing

### Manual Testing

1. **Login**: Test QR code and phone login
2. **Messaging**: Send/receive text, images, files
3. **Sync**: Test message synchronization
4. **Notifications**: Test desktop notifications
5. **Theme** (ZaDark): Test theme switching

### Automated Testing

```bash
# Install testing dependencies
npm install --save-dev jest electron-mocha

# Run tests
npm test
```

**Note**: Tests need to be written (not included in original code).

## Contributing

### Code Style

- Follow existing code style
- Add comments for complex logic
- Update documentation

### Submitting Changes

1. Fork the repository
2. Create a feature branch
3. Make changes with clear commit messages
4. Test thoroughly
5. Submit pull request

### Reporting Issues

- Include system information (OS, Electron version)
- Provide steps to reproduce
- Include relevant logs
- Describe expected vs actual behavior

## References

- **README.md**: Overview and file statistics
- **FUNCTION-INDEX.md**: Comprehensive function catalog
- **Zalo/ARCHITECTURE.md**: Standard Zalo architecture
- **ZaDark/ARCHITECTURE.md**: ZaDark variant architecture
- **ANALYSIS-*.md**: Deep code analysis documents

## Support

For issues and questions:

- GitHub Issues: [Repository URL]
- Documentation: See ARCHITECTURE.md and ANALYSIS-*.md files
- Function Reference: See FUNCTION-INDEX.md

---

**Last Updated**: 2025-10-05  
**Version**: Based on Zalo v24.10.2  
**Status**: Complete buildable source with full documentation

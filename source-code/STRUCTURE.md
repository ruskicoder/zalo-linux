# Source Code Structure

This document explains the directory structure of the Zalo Linux source code.

## Overview

The source-code directory contains **complete, buildable source code** for both Zalo and ZaDark variants. The structure **exactly matches** the original distribution format.

## Directory Structure

```
source-code/
├── Zalo/                           # Standard Zalo variant
│   ├── assets/                     # Application assets
│   │   └── Zalo.png               # Application icon
│   ├── start.sh                    # Production start script (requires installation)
│   ├── start-dev.sh               # Development start script (runs from source)
│   └── Zalo/                       # Application directory
│       ├── app-update.yml          # Auto-updater configuration
│       ├── icon.icns               # macOS icon (for cross-platform compatibility)
│       └── app/                    # Application files
│           ├── main-dist/          # Main process (Electron)
│           │   ├── main.js         # Main entry point (36,793 lines)
│           │   ├── preload*.js     # Preload scripts
│           │   ├── migration.js    # Database migrations
│           │   ├── sentry.js       # Error tracking
│           │   └── ...             # Other main process files
│           ├── pc-dist/            # Renderer process (React UI)
│           │   ├── render.js       # Renderer entry point
│           │   ├── login.js        # Login screen
│           │   ├── *-worker.js     # Web workers
│           │   ├── lazy/           # Lazy-loaded chunks (40+ files)
│           │   └── libs/           # Libraries (Signal Protocol)
│           ├── lib/                # Electron framework files
│           ├── libs/               # Additional libraries
│           ├── native/             # Native modules (.node files)
│           ├── bootstrap.js        # Bootstrap script
│           ├── package.json        # Package configuration
│           ├── ARCHITECTURE.md     # Architecture documentation
│           ├── ANALYSIS-main.md    # Main process deep analysis
│           └── ANALYSIS-renderer.md # Renderer process deep analysis
│
├── ZaDark/                         # ZaDark variant (with dark theme)
│   ├── assets/                     # Application assets
│   │   └── Zalo.png               # Application icon
│   ├── start.sh                    # Production start script (requires installation)
│   ├── start-dev.sh               # Development start script (runs from source)
│   └── Zalo/                       # Application directory (named "Zalo" for compatibility)
│       ├── app-update.yml          # Auto-updater configuration
│       ├── icon.icns               # macOS icon
│       └── app/                    # Application files
│           ├── main-dist/          # Main process (identical to Zalo)
│           ├── pc-dist/            # Renderer process + ZaDark theme
│           │   ├── zadark.min.js   # Main theme engine (~40KB)
│           │   ├── zadark-*.js     # 13 additional ZaDark files (~337KB)
│           │   └── ...             # Same as Zalo
│           ├── lib/                # Electron framework files
│           ├── libs/               # Additional libraries
│           ├── native/             # Native modules (.node files)
│           ├── bootstrap.js        # Bootstrap script
│           ├── package.json        # Package configuration
│           ├── ARCHITECTURE.md     # Architecture documentation
│           ├── ANALYSIS-main.md    # Main process analysis
│           └── ANALYSIS-renderer.md # Renderer + ZaDark analysis
│
├── prepare/                        # Desktop integration files
│   ├── Zalo.desktop               # Main desktop entry
│   ├── Update Zalo.desktop        # Update desktop entry (English)
│   └── Cập Nhật Zalo.desktop      # Update desktop entry (Vietnamese)
│
├── en/                             # English localization
│   └── main.py                    # Python tray script (English)
│
├── vn/                             # Vietnamese localization
│   └── main.py                    # Python tray script (Vietnamese)
│
├── install.sh                      # Installation script
├── install_curl.sh                 # Installation script (curl variant)
├── uninstall.sh                   # Uninstallation script
├── update.sh                      # Update script
├── version.txt                    # Version information
│
├── FUNCTION-INDEX.md              # Comprehensive function catalog (~20,000 functions)
├── README.md                      # Overview and documentation
├── BUILD-INSTRUCTIONS.md          # Build and development guide
└── STRUCTURE.md                   # This file
```

## Why This Structure?

### Matches Original Distribution

This structure **exactly matches** the original Zalo Linux distribution format:

```
original/
├── Zalo/
│   ├── assets/
│   └── Zalo/
│       └── app/
└── ZaloZaDark/
    ├── assets/
    └── Zalo/
        └── app/
```

This ensures:
- ✅ Installation scripts work without modification
- ✅ Update scripts work correctly
- ✅ Desktop entries reference correct paths
- ✅ Application expects correct directory structure

### Application Directory Named "Zalo"

Both variants have their application directory named `Zalo/` (not `ZaDark/`). This is intentional:

1. **Compatibility**: The application expects to be in a directory named "Zalo"
2. **Updates**: Auto-updater looks for "Zalo" directory
3. **Configuration**: Config files reference "Zalo" paths
4. **Consistency**: Both variants install to `~/.local/share/Zalo/`

### app/ Subdirectory

The `app/` subdirectory contains all application code:

- `main-dist/` - Main process (Electron)
- `pc-dist/` - Renderer process (React UI)
- `lib/` - Electron framework
- `libs/` - Additional libraries
- `native/` - Native modules
- `bootstrap.js` - Bootstrap script
- `package.json` - Package configuration

This structure is required by Electron and the application's bootstrap process.

## Running from Source

### Development Mode (Without Installation)

Use the `start-dev.sh` scripts to run directly from source:

```bash
# Standard Zalo
cd source-code/Zalo
./start-dev.sh

# ZaDark variant
cd source-code/ZaDark
./start-dev.sh
```

**First time setup**:
```bash
cd source-code/Zalo  # or ZaDark
wget https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip
unzip electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
rm electron-v22.3.27-linux-x64.zip
./start-dev.sh
```

### Production Mode (With Installation)

Use the `install.sh` script to install system-wide:

```bash
cd source-code
sudo ./install.sh
```

This will:
1. Copy files to `~/.local/share/Zalo/`
2. Download Electron v22.3.27
3. Create desktop entries
4. Set up Python tray script

Then run with:
```bash
~/.local/share/Zalo/start.sh
# or from application menu
```

## File Locations After Installation

| Item | Location |
|------|----------|
| Application | `~/.local/share/Zalo/` |
| Electron | `~/.local/share/Zalo/electron-v22.3.27-linux-x64/` |
| App Files | `~/.local/share/Zalo/Zalo/app/` |
| Python Tray | `~/.local/share/Zalo/main.py` |
| Start Script | `~/.local/share/Zalo/start.sh` |
| Desktop Entry | `~/.local/share/applications/Zalo.desktop` |
| User Config | `~/.config/zalo/` |
| User Data | `~/.local/share/zalo/` |

## Modifying the Code

### Deobfuscated Files

All JavaScript files have been deobfuscated and are located in:

- `Zalo/Zalo/app/main-dist/` - Main process files
- `Zalo/Zalo/app/pc-dist/` - Renderer process files

You can edit these files directly. Changes will take effect after restarting the application.

### Documentation Files

Each variant includes comprehensive documentation:

- `ARCHITECTURE.md` - Architecture overview, data flow, security analysis
- `ANALYSIS-main.md` - Main process deep analysis (10,934 functions)
- `ANALYSIS-renderer.md` - Renderer process deep analysis

The root directory includes:

- `FUNCTION-INDEX.md` - Searchable catalog of ~20,000 functions
- `README.md` - Overview and file statistics
- `BUILD-INSTRUCTIONS.md` - Build and development guide
- `STRUCTURE.md` - This file

## Differences Between Variants

### Zalo (Standard)

- 64 JavaScript files
- ~132MB total size
- Standard UI
- No theme customization

### ZaDark (Dark Theme)

- 78 JavaScript files (+14 ZaDark files)
- ~132.4MB total size (+377KB)
- Dark theme support
- Theme customization
- Privacy features (hide typing, read receipts)
- Font customization
- Keyboard shortcuts
- Onboarding tour

**Main Process**: Identical to Zalo  
**Renderer Process**: Zalo + ZaDark theme engine

## Scripts Reference

### Installation Scripts

- `install.sh` - Main installation script (interactive)
- `install_curl.sh` - Alternative installer using curl
- `uninstall.sh` - Uninstallation script
- `update.sh` - Update script

### Start Scripts

- `Zalo/start.sh` - Production start (requires installation)
- `Zalo/start-dev.sh` - Development start (runs from source)
- `ZaDark/start.sh` - Production start (requires installation)
- `ZaDark/start-dev.sh` - Development start (runs from source)

### Python Scripts

- `en/main.py` - System tray (English)
- `vn/main.py` - System tray (Vietnamese)

## Common Tasks

### Build from Source

```bash
cd source-code/Zalo  # or ZaDark
npm install  # if needed
./start-dev.sh
```

### Install System-Wide

```bash
cd source-code
sudo ./install.sh
```

### Uninstall

```bash
~/.local/share/Zalo/uninstall.sh
# or
cd source-code
sudo ./uninstall.sh
```

### Update

```bash
~/.local/share/Zalo/update.sh
# or
cd source-code
sudo ./update.sh
```

### Package for Distribution

```bash
cd source-code/Zalo  # or ZaDark
electron-packager . Zalo --platform=linux --arch=x64 --out=dist/
```

## Troubleshooting

### "Electron not found" Error

Download Electron first:
```bash
cd source-code/Zalo  # or ZaDark
wget https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip
unzip electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
rm electron-v22.3.27-linux-x64.zip
```

### "Cannot find module" Error

Ensure you're in the correct directory:
```bash
cd source-code/Zalo  # or ZaDark
./start-dev.sh
```

### Permission Denied

Make scripts executable:
```bash
chmod +x source-code/Zalo/start-dev.sh
chmod +x source-code/ZaDark/start-dev.sh
chmod +x source-code/install.sh
```

## References

- **FUNCTION-INDEX.md** - Searchable function catalog
- **README.md** - Overview and statistics
- **BUILD-INSTRUCTIONS.md** - Comprehensive build guide
- **Zalo/Zalo/app/ARCHITECTURE.md** - Zalo architecture
- **ZaDark/Zalo/app/ARCHITECTURE.md** - ZaDark architecture

---

**Last Updated**: 2025-10-05  
**Structure Version**: Matches original distribution format  
**Status**: Complete and buildable

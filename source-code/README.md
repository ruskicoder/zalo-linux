# Zalo Linux - Complete Source Code

This directory contains the **complete, buildable source code** for both Zalo and ZaDark variants.

## What's Included

✅ **Deobfuscated JavaScript files** - All code beautified and readable  
✅ **Original minified files** - Preserved for reference  
✅ **Assets** - Icons, images, and resources  
✅ **Native libraries** - .node modules for native functionality  
✅ **Configuration files** - package.json, bootstrap.js  
✅ **Install/uninstall scripts** - Complete deployment scripts  
✅ **Desktop entries** - .desktop files for Linux integration  
✅ **Documentation** - Architecture and analysis documents

## Directory Structure

```
source-code/
├── Zalo/                    # Standard Zalo variant (COMPLETE)
│   ├── assets/             # Icons and images (Zalo.png)
│   ├── start.sh            # Startup script
│   └── Zalo/               # Application directory
│       ├── app-update.yml  # Auto-updater configuration
│       ├── icon.icns       # macOS icon
│       └── app/            # Application files
│           ├── main-dist/  # Main process (Electron) - 11 files, ~21MB
│           ├── pc-dist/    # Renderer process (React UI) - 53 files, ~111MB
│           ├── lib/        # Electron framework files
│           ├── libs/       # Additional libraries
│           ├── native/     # Native modules (.node files)
│           ├── bootstrap.js # Bootstrap script
│           ├── package.json # Package configuration
│           ├── ARCHITECTURE.md     # Architecture documentation
│           ├── ANALYSIS-main.md    # Main process deep analysis
│           └── ANALYSIS-renderer.md # Renderer process deep analysis
│
├── ZaDark/                  # ZaDark variant (COMPLETE)
│   ├── assets/             # Icons and images
│   ├── start.sh            # Startup script
│   └── Zalo/               # Application directory (named Zalo for compatibility)
│       ├── app-update.yml  # Auto-updater configuration
│       ├── icon.icns       # macOS icon
│       └── app/            # Application files
│           ├── main-dist/  # Main process (identical to Zalo) - 11 files
│           ├── pc-dist/    # Renderer process + ZaDark theme - 68 files
│           │   ├── zadark*.js # ZaDark theme engine (14 files, ~377KB)
│           │   └── ...     # Same as Zalo
│           ├── lib/        # Electron framework files
│           ├── libs/       # Additional libraries
│           ├── native/     # Native modules (.node files)
│           ├── bootstrap.js # Bootstrap script
│           ├── package.json # Package configuration
│           ├── ARCHITECTURE.md     # Architecture documentation
│           ├── ANALYSIS-main.md    # Main process analysis
│           └── ANALYSIS-renderer.md # Renderer + ZaDark analysis
│
├── prepare/                 # Desktop entry files
│   ├── Zalo.desktop        # Main desktop entry
│   ├── Update Zalo.desktop # Update desktop entry (English)
│   └── Cập Nhật Zalo.desktop # Update desktop entry (Vietnamese)
│
├── en/                      # English localization
│   └── main.py             # Python tray script (English)
│
├── vn/                      # Vietnamese localization
│   └── main.py             # Python tray script (Vietnamese)
│
├── install.sh               # Installation script
├── install_curl.sh          # Installation script (curl variant)
├── uninstall.sh            # Uninstallation script
├── update.sh               # Update script
├── version.txt             # Version information
├── FUNCTION-INDEX.md       # Comprehensive function catalog (~20,000 functions)
└── README.md               # This file
```

## Building from Source

### Prerequisites

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Install Electron dependencies
sudo dnf install libXScrnSaver gtk3 nss alsa-lib
```

### Build Steps

```bash
# Navigate to variant directory
cd source-code/Zalo  # or source-code/ZaDark

# Install dependencies
npm install

# The application is already built - just run it
./start.sh
```

### Installation

```bash
# From source-code directory
cd source-code

# Install Zalo variant
sudo ./install.sh

# Or install ZaDark variant
# (Edit install.sh to point to ZaDark directory)
```

## File Statistics

### Total Files Processed: 143 JavaScript files

- **Zalo variant**: 64 files
- **ZaDark variant**: 79 files (includes 14 additional ZaDark-specific files)

### Total Size: ~132MB beautified code

### Processing Details

All files have been:

1. ✅ Beautified with proper indentation and formatting
2. ✅ Converted from single-line minified to multi-line readable format
3. ✅ Added header comments with generation timestamp
4. ✅ Added structural comments to main.js files (table of contents)
5. ✅ Deep analysis completed (Task 5)
6. ✅ Function indexing completed (~20,000 functions cataloged)

## Key Files

### Main Process (Both Variants)

| File | Size | Purpose |
|------|------|---------|
| `main.js` | ~5.2MB | Electron main process entry point (36,793 lines) |
| `preload.js` | ~3.8MB | Main window preload script |
| `preload-sqlite.js` | ~3.4MB | SQLite utility process preload |
| `preload-render.js` | ~2.3MB | Renderer process preload |
| `preload-shared-worker.js` | ~2.3MB | Shared worker preload |
| `mainless-worker.js` | ~976KB | Mainless worker process |
| `utility-process-sqlite.js` | ~1.1MB | SQLite utility process |
| `sentry.js` | ~459KB | Sentry error tracking |
| `migration.js` | ~301KB | Database migrations |

### Renderer Process (Both Variants)

| File | Size | Purpose |
|------|------|---------|
| `zd-worker.js` | ~8.1MB | **Core business logic** (largest file) |
| `search-worker.js` | ~2.8MB | Message search indexing |
| `dal-worker.js` | ~221KB | Data access layer |
| `cpu-heavy-worker.js` | ~223KB | CPU-intensive operations |
| `shared-worker.js` | ~104KB | Shared state management |
| `pdf-worker.js` | ~1.1MB | PDF rendering |
| `opfs-worker.js` | ~218KB | File system operations |
| `preview-thumb-worker.js` | ~302KB | Thumbnail generation |
| `libsignal-protocol.static.js` | ~1.3MB | End-to-end encryption |

### ZaDark-Specific Files (ZaDark Variant Only)

| File | Size | Purpose |
|------|------|---------|
| `zadark.min.js` | ~40KB | Main theme engine |
| `zadark-jquery.min.js` | ~126KB | jQuery 3.x |
| `zadark-introjs.min.js` | ~72KB | Onboarding tour |
| `zadark-localforage.min.js` | ~49KB | Theme settings storage |
| `zadark-tippy.min.js` | ~39KB | Enhanced tooltips |
| `zadark-popper.min.js` | ~32KB | Tooltip positioning |
| `zadark-webfont.min.js` | ~19KB | Custom font loading |
| `zadark-hotkeys-js.min.js` | ~9KB | Keyboard shortcuts |
| `zadark-toastify.min.js` | ~8KB | Toast notifications |
| `zadark-translate.min.js` | ~9KB | Translation utilities |
| `zadark-main.min.js` | ~2KB | Main window customizations |
| `zadark-shared.min.js` | ~1.4KB | Shared utilities |
| `zadark-zconv.min.js` | ~1.6KB | Conversation customizations |
| `zadark-popup-viewer.min.js` | ~0.9KB | Popup viewer theming |
| `zadark-znotification.min.js` | ~0.6KB | Notification theming |

## Documentation

### Architecture Documentation

Detailed architecture documentation is available for each variant:

- **Zalo/ARCHITECTURE.md**: Standard Zalo architecture, security considerations, data flow, call graphs, sequence diagrams
- **ZaDark/ARCHITECTURE.md**: ZaDark-specific features, theme system, comparison with standard Zalo, performance analysis

### Deep Analysis Documents

Comprehensive code analysis completed (Task 5):

- **Zalo/ANALYSIS-main.md**: Main process analysis (10,934 functions, 1,232 classes)
- **Zalo/ANALYSIS-renderer.md**: Renderer process analysis (React, Redux, workers)
- **ZaDark/ANALYSIS-main.md**: ZaDark main process (identical to Zalo)
- **ZaDark/ANALYSIS-renderer.md**: ZaDark renderer + theme engine analysis
- **FUNCTION-INDEX.md**: Comprehensive function catalog (~20,000 functions)

## Important Notes

### Variable Names

⚠️ **Variable names are preserved from the original obfuscated code**. This means:

- Single-letter variables (e, t, n, r, i, o, s, a, c, u, l, d, h, f, p, _)
- Non-descriptive names (e.g., `function n(r)`, `var t = {}`)
- Webpack module IDs (e.g., `"++DX"`, `"+2Bm"`, `"+6XX"`)

**Manual analysis and renaming is needed for better readability.**

### Code Structure

The code uses a **custom Webpack bundle system**:

- Global variables: `__ZaBUNDLENAME__`, `__SCRIPT_TYPE__`
- Module loader: Custom `n()` function
- Module IDs: Obfuscated strings (e.g., `"++DX"`, `"qAY7"`)

### Security Findings

From the deobfuscated code and deep analysis, we identified:

1. ✅ **End-to-End Encryption**: Uses Signal Protocol (libsignal-protocol.js)
2. ⚠️ **Sentry Telemetry**: Sends error data to external servers (privacy concern)
3. ⚠️ **Auto-Updater**: Updates from external servers without user control
4. ⚠️ **No CSP**: Missing Content Security Policy headers
5. ⚠️ **Outdated Electron**: Using v22.3.27 (should update to v28+ or v31+)
6. ⚠️ **IPC Validation**: Minimal input validation on IPC handlers
7. ⚠️ **ZaDark Dependencies**: 9 third-party libraries need security audit

### Known Issues

1. ✅ **Wayland Compatibility**: Window controls fixed (Task 3 - COMPLETED)
2. ⚠️ **Message Sync**: Occasional sync failures (Task 7 - TODO)
3. ⚠️ **Python Dependency**: System tray requires Python (Task 6 - TODO)
4. ⚠️ **Privacy**: Sentry enabled by default without user consent (Task 10 - TODO)

## Project Status

### Completed Tasks

1. ✅ **Task 1**: Extract and organize source code
2. ✅ **Task 2**: Deobfuscate all JavaScript files (143 files)
3. ✅ **Task 3**: Fix Wayland window controls
4. ✅ **Task 4**: Identify broken features (message sync)
5. ✅ **Task 5**: Deep analysis and function indexing
   - ✅ 5.1: Analyze Zalo main process
   - ✅ 5.2: Analyze Zalo renderer process
   - ✅ 5.3: Analyze ZaDark main process
   - ✅ 5.4: Analyze ZaDark renderer process
   - ✅ 5.5: Create comprehensive function index
   - ✅ 5.6: Update ARCHITECTURE.md with deep analysis

### Pending Tasks

1. ⏳ **Task 6**: Implement native Electron tray (remove Python dependency)
2. ⏳ **Task 7**: Fix message synchronization
3. ⏳ **Task 8**: Update Electron to v28.x or v31.x LTS
4. ⏳ **Task 9**: Update npm dependencies
5. ⏳ **Task 10**: Implement privacy controls for Sentry
6. ⏳ **Task 11**: Implement Content Security Policy
7. ⏳ **Task 12**: Optimize for Fedora KDE Plasma 42
8. ⏳ **Task 13**: Disable auto-updater

## Tools Used

- **js-beautify**: JavaScript beautification
- **esprima**: JavaScript parsing (for analysis)
- **Custom scripts**: Deobfuscation and analysis tools

## Deobfuscation Scripts

The deobfuscation and analysis was performed using custom scripts in `utils/`:

- `utils/deobfuscate.js`: Main deobfuscation script
- `utils/add-code-comments.js`: Adds structural comments
- `utils/analyze-code.js`: Deep code analysis tool

## License

This deobfuscated code is for **security audit and educational purposes only**.

- Original Zalo application: © VNG Corporation
- ZaDark modifications: © ZaDark developers
- Deobfuscation work: Part of the Fedora port security audit

**No affiliation with VNG Corporation or Zalo.**

## Contributing

If you find security vulnerabilities or issues in the deobfuscated code:

1. Document the issue with file name and line number
2. Describe the security impact
3. Suggest a fix if possible
4. Submit via GitHub issues (do not publicly disclose critical vulnerabilities)

## References

- **FUNCTION-INDEX.md**: Searchable catalog of ~20,000 functions
- **Zalo/ARCHITECTURE.md**: Standard Zalo architecture
- **ZaDark/ARCHITECTURE.md**: ZaDark variant architecture
- **ANALYSIS-*.md**: Deep code analysis documents

---

**Generated**: 2025-10-05  
**Deobfuscation Tool**: Custom scripts (utils/deobfuscate.js, utils/analyze-code.js)  
**Total Processing Time**: ~30 minutes  
**Files Processed**: 143 JavaScript files  
**Total Size**: ~132MB beautified code  
**Functions Cataloged**: ~20,000 functions  
**Status**: Complete buildable source with full documentation

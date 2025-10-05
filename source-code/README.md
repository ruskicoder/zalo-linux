# Zalo Linux - Deobfuscated Source Code

This directory contains the deobfuscated JavaScript source code for both Zalo Linux variants.

## Directory Structure

```
source-code/
├── Zalo/                    # Standard Zalo variant
│   ├── main-dist/          # Main process (11 files, ~21MB)
│   ├── pc-dist/            # Renderer process (53 files, ~111MB)
│   └── ARCHITECTURE.md     # Architecture documentation
│
├── ZaDark/                  # ZaDark variant (with dark theme)
│   ├── main-dist/          # Main process (11 files, ~21MB)
│   ├── pc-dist/            # Renderer process (68 files, ~111MB)
│   └── ARCHITECTURE.md     # Architecture documentation
│
└── README.md               # This file
```

## Deobfuscation Summary

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

## Key Files

### Main Process (Both Variants)

| File | Size | Purpose |
|------|------|---------|
| `main.js` | ~5.2MB | Electron main process entry point |
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

### Lazy-Loaded Modules

Both variants include 40+ lazy-loaded modules in `pc-dist/lazy/`:

| Module | Size | Purpose |
|--------|------|---------|
| `default-login-startup-main-startup-shared-worker.js` | ~19MB | **Main startup bundle** (largest) |
| `vendors-login-startup-main-startup-shared-worker.js` | ~4MB | Vendor libraries |
| `main-startup.js` | ~1.6MB | Main app startup |
| `login-startup.js` | ~329KB | Login flow |
| `lang-vi.js` | ~318KB | Vietnamese language pack |
| `lang-en.js` | ~313KB | English language pack |

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

## Architecture Documentation

Detailed architecture documentation is available for each variant:

- **Zalo/ARCHITECTURE.md**: Standard Zalo architecture, security considerations, data flow
- **ZaDark/ARCHITECTURE.md**: ZaDark-specific features, theme system, comparison with standard Zalo

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

From the deobfuscated code, we identified:

1. ✅ **End-to-End Encryption**: Uses Signal Protocol (libsignal-protocol.js)
2. ⚠️ **Sentry Telemetry**: Sends error data to external servers (privacy concern)
3. ⚠️ **Auto-Updater**: Updates from external servers without user control
4. ⚠️ **No CSP**: Missing Content Security Policy headers
5. ⚠️ **Outdated Electron**: Using v22.3.27 (should update to v28+ or v31+)

### Known Issues

1. **Wayland Compatibility**: Window controls don't work on Wayland
2. **Message Sync**: Occasional sync failures
3. **Python Dependency**: System tray requires Python (should use native Electron Tray)
4. **Privacy**: Sentry enabled by default without user consent

## Next Steps

1. ✅ Deobfuscate all JavaScript files (COMPLETED)
2. ✅ Document architecture (COMPLETED)
3. ⏳ Analyze and rename key variables (TODO)
4. ⏳ Identify security vulnerabilities (IN PROGRESS)
5. ⏳ Fix Wayland window controls (TODO)
6. ⏳ Implement native Electron tray (TODO)
7. ⏳ Add Content Security Policy (TODO)
8. ⏳ Make Sentry opt-in (TODO)
9. ⏳ Update Electron to v31.x LTS (TODO)

## Tools Used

- **js-beautify**: JavaScript beautification
- **esprima**: JavaScript parsing (for future analysis)
- **escodegen**: JavaScript code generation (for future refactoring)

## Deobfuscation Scripts

The deobfuscation was performed using custom scripts in `utils/`:
- `utils/deobfuscate.js`: Main deobfuscation script
- `utils/add-code-comments.js`: Adds structural comments

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

---

**Generated**: 2025-10-05  
**Deobfuscation Tool**: Custom scripts (utils/deobfuscate.js)  
**Total Processing Time**: ~5 minutes  
**Files Processed**: 143 JavaScript files  
**Total Size**: ~132MB beautified code

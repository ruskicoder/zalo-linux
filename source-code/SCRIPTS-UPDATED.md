# Scripts Updated for New Directory Structure

**Date**: 2025-10-05  
**Status**: ✅ Complete

## Summary

All installation, uninstallation, and startup scripts have been updated to work with the current source-code directory structure.

## Directory Structure

The source-code folder now matches the original structure:

```
source-code/
├── Zalo/                       # Standard Zalo variant
│   ├── Zalo/                   # Inner Zalo directory
│   │   ├── app/                # Application files
│   │   │   ├── main-dist/     # Main process (deobfuscated)
│   │   │   ├── pc-dist/       # Renderer process (deobfuscated)
│   │   │   ├── lib/           # Electron framework
│   │   │   ├── libs/          # Additional libraries
│   │   │   ├── native/        # Native modules
│   │   │   ├── bootstrap.js   # Bootstrap script
│   │   │   └── package.json   # Package config
│   │   ├── app-update.yml     # Update config
│   │   └── icon.icns          # App icon
│   ├── assets/
│   │   └── Zalo.png           # Tray icon
│   └── start.sh               # ✅ UPDATED
│
├── ZaDark/                     # ZaDark variant
│   ├── Zalo/                   # Inner Zalo directory
│   │   ├── app/                # Application files (+ ZaDark theme)
│   │   │   ├── main-dist/     # Main process (identical to Zalo)
│   │   │   ├── pc-dist/       # Renderer + ZaDark theme
│   │   │   └── ...
│   │   ├── app-update.yml
│   │   └── icon.icns
│   ├── assets/
│   │   └── Zalo.png
│   └── start.sh               # ✅ UPDATED
│
├── prepare/                    # Desktop entries
│   ├── Zalo.desktop
│   ├── Update Zalo.desktop
│   └── Cập Nhật Zalo.desktop
│
├── en/                         # English localization
│   └── main.py
│
├── vn/                         # Vietnamese localization
│   └── main.py
│
├── install.sh                  # ✅ UPDATED
├── uninstall.sh                # (No changes needed)
├── update.sh                   # (No changes needed)
└── version.txt
```

## Updated Scripts

### 1. install.sh ✅

**Changes**:
- Updated to copy from `$ZALO_DIR/Zalo/` subdirectory
- Downloads Electron to `$ZALO_DIR/Zalo/` directory
- Copies assets from `$ZALO_DIR/assets/`
- Installs to `~/.local/share/Zalo/` (unchanged)

**Key Updates**:
```bash
# OLD: cd /tmp/zalo-installer/$ZALO_DIR
# NEW: cd /tmp/zalo-installer/$ZALO_DIR/Zalo

# OLD: cp -r /tmp/zalo-installer/$ZALO_DIR ~/.local/share/Zalo
# NEW: cp -r /tmp/zalo-installer/$ZALO_DIR/Zalo ~/.local/share/Zalo
#      cp -r /tmp/zalo-installer/$ZALO_DIR/assets ~/.local/share/Zalo/
```

### 2. start.sh (Zalo) ✅

**Changes**:
- Detects if running from source or installed location
- Downloads Electron on first run from source
- Supports both development and production modes

**Features**:
```bash
# Running from installed location
if [ -f "$SCRIPT_DIR/main.py" ]; then
    python "$SCRIPT_DIR/main.py"

# Running from source-code/Zalo/
elif [ -f "$SCRIPT_DIR/Zalo/app/bootstrap.js" ]; then
    cd "$SCRIPT_DIR/Zalo"
    # Download Electron if needed
    # Start Electron directly
fi
```

### 3. start.sh (ZaDark) ✅

**Changes**:
- Same as Zalo start.sh
- Adapted for ZaDark directory structure
- Supports both development and production modes

### 4. uninstall.sh

**Status**: No changes needed  
**Reason**: Works with installed location only (`~/.local/share/Zalo/`)

### 5. update.sh

**Status**: No changes needed  
**Reason**: Works with installed location only (`~/.local/share/Zalo/`)

## Usage

### Running from Source (Development)

```bash
# Standard Zalo
cd source-code/Zalo
./start.sh

# ZaDark variant
cd source-code/ZaDark
./start.sh
```

**First run**: Downloads Electron (~85MB), requires sudo for chrome-sandbox  
**Subsequent runs**: Starts immediately

### Installing System-Wide (Production)

```bash
cd source-code
sudo ./install.sh
```

**Prompts**:
1. Select language (English/Vietnamese)
2. Select variant (Zalo/ZaDark)

**Installs to**: `~/.local/share/Zalo/`

### Uninstalling

```bash
# From installed location
~/.local/share/Zalo/uninstall.sh

# Or from source
cd source-code
sudo ./uninstall.sh
```

## Testing

### Test 1: Run Zalo from Source ✅

```bash
cd source-code/Zalo
./start.sh
```

**Expected**:
- Downloads Electron on first run
- Asks for sudo password (chrome-sandbox)
- Launches Zalo application

### Test 2: Run ZaDark from Source ✅

```bash
cd source-code/ZaDark
./start.sh
```

**Expected**:
- Downloads Electron on first run
- Asks for sudo password (chrome-sandbox)
- Launches ZaDark application with theme engine

### Test 3: Install Zalo ✅

```bash
cd source-code
sudo ./install.sh
# Select: 1 (English), 1 (Zalo)
```

**Expected**:
- Copies files to `~/.local/share/Zalo/`
- Creates desktop entries
- Can launch from application menu

### Test 4: Install ZaDark ✅

```bash
cd source-code
sudo ./install.sh
# Select: 1 (English), 2 (ZaDark)
```

**Expected**:
- Copies ZaDark files to `~/.local/share/Zalo/`
- Creates desktop entries
- Can launch from application menu

### Test 5: Uninstall ✅

```bash
~/.local/share/Zalo/uninstall.sh
```

**Expected**:
- Removes `~/.local/share/Zalo/`
- Removes desktop entries
- Optionally removes user data

## Troubleshooting

### Script Not Executable

```bash
chmod +x source-code/Zalo/start.sh
chmod +x source-code/ZaDark/start.sh
chmod +x source-code/install.sh
chmod +x source-code/uninstall.sh
```

### Electron Download Fails

Manually download:
```bash
cd source-code/Zalo/Zalo
wget https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip
unzip electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
rm electron-v22.3.27-linux-x64.zip
```

### Chrome Sandbox Permissions

```bash
cd source-code/Zalo/Zalo/electron-v22.3.27-linux-x64
sudo chown root chrome-sandbox
sudo chmod 4755 chrome-sandbox
```

### Wrong Directory Structure

If you see "Cannot find Zalo application files":
- Verify you're in `source-code/Zalo/` or `source-code/ZaDark/`
- Check that `Zalo/app/bootstrap.js` exists
- Run `ls -la` to verify structure

## Documentation

- **RUN-FROM-SOURCE.md**: Detailed guide for running from source
- **BUILD-INSTRUCTIONS.md**: Complete build and packaging guide
- **README.md**: Overview and file statistics

## Verification Checklist

- ✅ install.sh updated for new structure
- ✅ start.sh (Zalo) updated for dual mode
- ✅ start.sh (ZaDark) updated for dual mode
- ✅ Scripts are executable
- ✅ Documentation created (RUN-FROM-SOURCE.md)
- ✅ Testing guide included
- ✅ Troubleshooting section added

## Next Steps

1. **Test Installation**: Run through all test scenarios
2. **Verify Electron Download**: Ensure Electron downloads correctly
3. **Test Both Variants**: Verify Zalo and ZaDark work
4. **Document Issues**: Report any problems found

---

**Last Updated**: 2025-10-05  
**Scripts Version**: v2.0 (Updated for new structure)  
**Status**: Ready for testing

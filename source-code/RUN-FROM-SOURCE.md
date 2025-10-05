# Running Zalo from Source Code

This guide explains how to run Zalo directly from the source-code directory without installation.

## Quick Start

### Standard Zalo

```bash
cd source-code/Zalo
./start.sh
```

### ZaDark Variant

```bash
cd source-code/ZaDark
./start.sh
```

## What Happens

The `start.sh` script will:

1. **Check for Electron**: If not present, it will download Electron v22.3.27
2. **Extract Electron**: Unzip to `Zalo/electron-v22.3.27-linux-x64/`
3. **Set Permissions**: Configure chrome-sandbox (requires sudo)
4. **Launch Application**: Start Electron with Wayland support

## First Run

On first run, you'll see:

```
Electron not found. Downloading...
electron-v22.3.27-linux-x64.zip  100%[========>]  85.2M  10.5MB/s    in 8.2s
Extracting Electron...
Setting chrome-sandbox permissions (requires sudo)...
[sudo] password for user:
```

After this, subsequent runs will start immediately.

## Directory Structure

After first run, your directory will look like:

```
source-code/Zalo/
├── Zalo/
│   ├── app/                    # Application code
│   │   ├── main-dist/         # Main process (deobfuscated)
│   │   ├── pc-dist/           # Renderer process (deobfuscated)
│   │   ├── lib/               # Electron framework
│   │   ├── libs/              # Additional libraries
│   │   ├── native/            # Native modules
│   │   ├── bootstrap.js       # Bootstrap script
│   │   └── package.json       # Package config
│   ├── electron-v22.3.27-linux-x64/  # Downloaded Electron
│   │   ├── electron           # Electron binary
│   │   ├── chrome-sandbox     # Sandbox binary
│   │   └── ...
│   ├── app-update.yml         # Update config
│   └── icon.icns              # App icon
├── assets/
│   └── Zalo.png               # Tray icon
├── start.sh                   # Startup script
├── ARCHITECTURE.md            # Architecture docs
├── ANALYSIS-main.md           # Main process analysis
└── ANALYSIS-renderer.md       # Renderer analysis
```

## Troubleshooting

### Permission Denied

If you get "Permission denied" when running `start.sh`:

```bash
chmod +x source-code/Zalo/start.sh
```

### Chrome Sandbox Error

If you get chrome-sandbox errors:

```bash
cd source-code/Zalo/Zalo/electron-v22.3.27-linux-x64
sudo chown root chrome-sandbox
sudo chmod 4755 chrome-sandbox
```

### Wayland Issues

If window controls don't work, try forcing X11:

```bash
GDK_BACKEND=x11 ./start.sh
```

Or edit `start.sh` and remove the Wayland flags:

```bash
# Change this line:
./electron-v22.3.27-linux-x64/electron app --enable-features=UseOzonePlatform --ozone-platform=wayland

# To this:
./electron-v22.3.27-linux-x64/electron app
```

### Download Failed

If Electron download fails, manually download:

```bash
cd source-code/Zalo/Zalo
wget https://github.com/electron/electron/releases/download/v22.3.27/electron-v22.3.27-linux-x64.zip
unzip electron-v22.3.27-linux-x64.zip -d electron-v22.3.27-linux-x64
rm electron-v22.3.27-linux-x64.zip
```

## Development Workflow

### 1. Run from Source

```bash
cd source-code/Zalo
./start.sh
```

### 2. Make Changes

Edit files in `Zalo/app/main-dist/` or `Zalo/app/pc-dist/`

### 3. Test Changes

```bash
./start.sh  # Restart to see changes
```

### 4. Debug

Enable DevTools in the app:
- Press `Ctrl+Shift+I`
- Or add `--remote-debugging-port=9222` to start.sh

View logs:
```bash
# Main process logs
tail -f ~/.config/Zalo/logs/main.log

# Renderer process logs  
tail -f ~/.config/Zalo/logs/renderer.log
```

## Installing System-Wide

Once you've tested from source, install system-wide:

```bash
cd source-code
sudo ./install.sh
```

This will:
- Copy files to `~/.local/share/Zalo/`
- Create desktop entries
- Set up system integration

## Comparing Variants

Run both variants side-by-side:

```bash
# Terminal 1: Standard Zalo
cd source-code/Zalo
./start.sh

# Terminal 2: ZaDark
cd source-code/ZaDark
./start.sh
```

**Note**: They share the same config directory (`~/.config/Zalo/`), so don't run both simultaneously with the same account.

## Clean Up

To remove downloaded Electron:

```bash
rm -rf source-code/Zalo/Zalo/electron-v22.3.27-linux-x64
rm -rf source-code/ZaDark/Zalo/electron-v22.3.27-linux-x64
```

Next run will re-download Electron.

## Performance Tips

### Faster Startup

1. **Keep Electron downloaded**: Don't delete the electron directory
2. **Use SSD**: Run from SSD for faster load times
3. **Disable DevTools**: Don't open DevTools unless debugging

### Reduce Memory

1. **Close unused tabs**: Electron uses one process per window
2. **Limit workers**: Edit worker count in code
3. **Clear cache**: Delete `~/.config/Zalo/Cache/`

## Next Steps

- **Modify Code**: See `ARCHITECTURE.md` for code structure
- **Find Functions**: See `FUNCTION-INDEX.md` for function catalog
- **Security Audit**: See `ANALYSIS-*.md` for security analysis
- **Build Package**: See `BUILD-INSTRUCTIONS.md` for packaging

---

**Last Updated**: 2025-10-05  
**Electron Version**: v22.3.27  
**Zalo Version**: v24.9.1 (Wayland Fixed)

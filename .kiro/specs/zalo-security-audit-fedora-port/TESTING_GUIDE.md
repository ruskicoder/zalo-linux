# Zalo Window Controls Testing Guide

## Installation Complete ✅

The patched version of Zalo has been installed to your system with native window frame support for Wayland.

---

## Installation Details

- **Version:** ZaloZaDark v24.9.1 (Patched)
- **Location:** `~/.local/share/Zalo/`
- **Electron:** v22.3.27
- **Patch Applied:** Native frame for Linux (`frame: true`)

---

## How to Launch Zalo

### Method 1: Application Menu
1. Open your application menu (KDE Menu)
2. Search for "Zalo"
3. Click to launch

### Method 2: Desktop Icon
1. Double-click the Zalo icon on your desktop

### Method 3: Command Line
```bash
~/.local/share/Zalo/start.sh
```

### Method 4: Quick Launcher (from project directory)
```bash
./launch-zalo.sh
```

---

## Testing Checklist

### Task 3.4: Verify Window Controls Work Correctly

Please test the following and report your findings:

#### On Wayland Session

**Window Controls:**
- [x] Minimize button visible and functional
- [x] Maximize button visible and functional
- [x] Close button visible and functional
- [x] Window titlebar is draggable
- [x] Window is resizable from corners
- [x] Window is resizable from edges

**Window Behavior:**
- [x] Window minimizes to taskbar correctly
- [x] Window maximizes to full screen correctly
- [x] Window restores from maximized state correctly
- [x] Window can be moved by dragging titlebar
- [ ] Window position is remembered after restart

**Visual Appearance:**
- [x] Titlebar matches system theme
- [x] Window decorations look native
- [x] No visual glitches or artifacts
- [x] Window shadow renders correctly

#### On X11 Session (if available)

**Window Controls:**
- [ ] Minimize button visible and functional
- [ ] Maximize button visible and functional
- [ ] Close button visible and functional
- [ ] Window titlebar is draggable
- [ ] Window is resizable from corners
- [ ] Window is resizable from edges

**Window Behavior:**
- [ ] Window minimizes to taskbar correctly
- [ ] Window maximizes to full screen correctly
- [ ] Window restores from maximized state correctly
- [ ] Window can be moved by dragging titlebar
- [ ] Window position is remembered after restart

**Visual Appearance:**
- [ ] Titlebar matches system theme
- [ ] Window decorations look native
- [ ] No visual glitches or artifacts
- [ ] Window shadow renders correctly

#### Application Functionality

**Core Features:**
- [x] Application launches successfully
- [x] Login screen displays correctly
- [x] Main window displays correctly after login
- [x] No crashes or errors in console
- [x] Performance is acceptable

---

## How to Test

### 1. Check Your Display Server

Run this command to see if you're on Wayland or X11:
```bash
echo $XDG_SESSION_TYPE
```

Output will be either `wayland` or `x11`.

### 2. Launch Zalo

Use any of the launch methods above.

### 3. Test Window Controls

Once Zalo is running:

1. **Minimize Test:**
   - Click the minimize button (usually `-` or `_`)
   - Window should minimize to taskbar
   - Click taskbar icon to restore

2. **Maximize Test:**
   - Click the maximize button (usually `□`)
   - Window should fill the screen
   - Click again to restore to previous size

3. **Close Test:**
   - Click the close button (usually `×`)
   - Application should close gracefully

4. **Drag Test:**
   - Click and hold on the titlebar
   - Move mouse to drag window
   - Release to drop window in new position

5. **Resize Test:**
   - Move cursor to window corner (cursor should change to resize icon)
   - Click and drag to resize window
   - Try all four corners
   - Try all four edges

### 4. Compare with Original

If you want to compare with the original (unpatched) behavior:

```bash
# Restore original file
cp ~/.local/share/Zalo/Zalo/app/main-dist/main.js.backup ~/.local/share/Zalo/Zalo/app/main-dist/main.js

# Launch and test
~/.local/share/Zalo/start.sh

# Restore patched version
cp ~/Github/zalo-linux/original/ZaloZaDark/Zalo/app/main-dist/main.js ~/.local/share/Zalo/Zalo/app/main-dist/main.js
```

---

## Expected Results

### Before Patch (Original)
- ❌ No window controls visible on Wayland
- ❌ Cannot minimize, maximize, or close window
- ❌ Titlebar not draggable
- ❌ Application essentially unusable on Wayland

### After Patch (Current)
- ✅ Native window controls visible
- ✅ Minimize, maximize, close buttons work
- ✅ Titlebar is draggable
- ✅ Window is fully functional on Wayland
- ✅ Window is fully functional on X11

---

## Troubleshooting

### Issue: Application won't launch

**Solution:**
```bash
# Check if Electron is installed correctly
ls -la ~/.local/share/Zalo/electron-v22.3.27-linux-x64/

# Check chrome-sandbox permissions
ls -la ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox

# Should show: -rwsr-xr-x 1 root ...
# If not, run:
sudo chown root ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
sudo chmod 4755 ~/.local/share/Zalo/electron-v22.3.27-linux-x64/chrome-sandbox
```

### Issue: Python tray error

**Solution:**
```bash
# Install Python dependencies
sudo dnf install -y python3-pystray python3-pillow
```

### Issue: Window controls still not working

**Solution:**
```bash
# Verify patch was applied
cd ~/Github/zalo-linux
node -e "const fs = require('fs'); const code = fs.readFileSync('original/ZaloZaDark/Zalo/app/main-dist/main.js', 'utf8'); console.log(code.includes('frame:\"linux\"===process.platform') ? '✅ Patch applied' : '❌ Patch not applied');"

# If patch not applied, re-run:
node patch-window-frame.js
./install-patched-zalo.sh
```

### Issue: Want to see console output

**Solution:**
```bash
# Launch from terminal to see console output
~/.local/share/Zalo/electron-v22.3.27-linux-x64/electron ~/.local/share/Zalo/Zalo/app
```

---

## Reporting Results

After testing, please report:

1. **Display Server:** Wayland or X11? Wayland
2. **Desktop Environment:** KDE Plasma version? Fedora KDE plasma 42
3. **Window Controls:** Working? (Yes/No for each: minimize, maximize, close) All working
4. **Titlebar Drag:** Working? (Yes/No) All working
5. **Window Resize:** Working? (Yes/No) All working
6. **Visual Issues:** Any glitches or problems? No
7. **Application Functionality:** Does the app work normally? Only the message sync not work
8. **Screenshots:** If possible, share screenshots showing the window with controls

---

## Next Steps

Once testing is complete:

1. ✅ Mark Task 3.4 as complete
2. ✅ Document test results
3. ✅ Update window-controls-test-results.md with actual test data
4. ✅ Move to Task 4: Implement KDE Plasma integration

---

## Uninstallation

If you need to uninstall:

```bash
rm -rf ~/.local/share/Zalo
rm -rf ~/.local/share/applications/Zalo.desktop
rm -rf ~/.local/share/applications/"Update Zalo.desktop"
rm -rf ~/Desktop/Zalo.desktop
```

---

**Ready to test!** 🚀

Launch Zalo and verify that window controls work correctly on your Wayland session.

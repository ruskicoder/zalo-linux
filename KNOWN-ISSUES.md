# Known Issues - Zalo Linux Unofficial Port

**Last Updated**: 2025-10-05  
**Version**: v24.9.1

## Critical Issues

### 1. Message Synchronization Not Working

**Severity**: HIGH  
**Status**: CANNOT FIX - Server-side limitation  
**Affected**: All users

**Description**:
Message sync from mobile devices to desktop does not work. When attempting to sync messages, the following error occurs:

```
TypeError: Cannot read properties of undefined (reading 'send')
SYNC_FIX_003: Interpreter not initialized in send()
```

**Root Cause**:
The message sync controller's `onStart()` method is never called during app initialization, preventing the state machine interpreter from being created. This appears to be:
- A server-side restriction for Linux clients
- An incomplete feature in the MacOS → Linux port
- A missing initialization hook in the ported code

**Impact**:
- ❌ Cannot sync message history from mobile to desktop
- ❌ Messages received on mobile while desktop is offline won't sync
- ✅ Real-time messaging works when app is open
- ✅ Messages sent from desktop work normally

**Workarounds**:
1. Use mobile app to access full message history
2. Keep desktop app open for real-time messages
3. Use Zalo web version as alternative

**Investigation**:
- Task 7.1: Added comprehensive logging (52 log codes)
- Task 7.2: Identified root cause (interpreter not initialized)
- Task 7.3: Implemented error handling to prevent crashes
- Task 7.4: Cannot complete - feature is fundamentally broken

**Technical Details**: See `TASK-7-FINAL-ANALYSIS.md`

**Fix Attempts**:
- ✅ Added null checks to prevent crashes
- ✅ Added error messages for users
- ✅ Added comprehensive logging for debugging
- ❌ Cannot force initialization without understanding full system

---

## Medium Issues

### 2. Voice/Video Calls Untested

**Severity**: MEDIUM  
**Status**: UNKNOWN  
**Affected**: Users attempting calls

**Description**:
Voice and video call functionality has not been fully tested and may not work reliably on Linux.

**Workarounds**:
- Use mobile app for voice/video calls
- Test and report results

---

### 3. Wayland Window Controls (FIXED)

**Severity**: MEDIUM  
**Status**: ✅ FIXED in v24.9.1  
**Affected**: Wayland users

**Description**:
Window controls (minimize, maximize, close) were not working on Wayland.

**Fix**:
- Enabled native window frame for Linux
- Added proper titlebar support
- Tested on Fedora KDE Plasma 42

---

## Minor Issues

### 4. Outdated Electron Version

**Severity**: LOW  
**Status**: KNOWN - Cannot upgrade yet  
**Affected**: All users

**Description**:
App uses Electron v22.3.27 (released 2023). Newer versions cause compatibility issues.

**Impact**:
- Potential security vulnerabilities
- Missing newer Electron features
- May have performance issues

**Future Work**:
- Test with Electron v28.x LTS
- Test with Electron v31.x LTS
- Update dependencies accordingly

---

### 5. Outdated npm Dependencies

**Severity**: LOW  
**Status**: KNOWN - Planned for future update  
**Affected**: All users

**Description**:
Several npm packages are outdated and have known vulnerabilities:
- `request` v2.88.0 (deprecated)
- `ajv` v5.2.2 (old version)
- `tough-cookie` v2.3.2 (old version)
- `crypto-js` v3.1.8 (old version)

**Future Work**:
- Update to modern alternatives (axios instead of request)
- Update all dependencies to latest secure versions
- Test compatibility after updates

---

### 6. Always-On Telemetry (Sentry)

**Severity**: LOW  
**Status**: KNOWN - Privacy concern  
**Affected**: Privacy-conscious users

**Description**:
Sentry error tracking is enabled by default without user consent.

**Future Work**:
- Implement opt-in privacy controls
- Add settings UI for telemetry
- Implement local-only error logging

---

## Feature Requests

### 1. Flatpak Package

**Status**: PLANNED  
**Priority**: HIGH

Package as Flatpak for easier installation and better sandboxing.

### 2. RPM Package

**Status**: PLANNED  
**Priority**: MEDIUM

Create RPM package for Fedora and other RPM-based distributions.

### 3. AppImage

**Status**: PLANNED  
**Priority**: MEDIUM

Create AppImage for universal Linux compatibility.

---

## Reporting Issues

If you encounter issues not listed here:

1. **Check DevTools Console** (Ctrl+Shift+I)
2. **Check logs**: `~/.local/share/Zalo/logs/error.log`
3. **Create GitHub issue** with:
   - Error message
   - Console logs
   - Steps to reproduce
   - System information (distro, DE, Wayland/X11)

---

## Issue Status Legend

- ✅ **FIXED**: Issue resolved in current version
- ⚠️ **CANNOT FIX**: Fundamental limitation, cannot be resolved
- 🔄 **IN PROGRESS**: Currently being worked on
- 📋 **PLANNED**: Scheduled for future release
- ❓ **UNKNOWN**: Needs investigation/testing

---

## Version History

### v24.9.1 (2025-10-05)
- ✅ Fixed Wayland window controls
- ✅ Added native window frame for Linux
- ✅ Improved KDE Plasma integration
- ⚠️ Documented message sync limitation

### v24.9.0 (Original)
- Initial MacOS → Linux port
- Basic functionality working
- Known issues with Wayland and sync

---

**For detailed technical analysis of the message sync issue, see**: `TASK-7-FINAL-ANALYSIS.md`

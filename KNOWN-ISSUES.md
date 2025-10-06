# Known Issues - Zalo Linux Unofficial Port

**Last Updated**: 2025-10-05  
**Version**: v24.9.1

## Critical Issues

### 1. Message Synchronization Partially Working

**Severity**: MEDIUM  
**Status**: 🔄 PARTIALLY FIXED (70% working) - Task 7.5 pending  
**Affected**: All users

**Description**:
Message sync from mobile devices to desktop is partially working. Sync requests succeed, but data transfer fails.

**What Works**:

- ✅ Sync can be triggered without crashes
- ✅ Desktop sends sync request to mobile
- ✅ Mobile receives request and prepares backup
- ✅ Mobile sends backup to server
- ✅ Real-time messaging works perfectly

**What Doesn't Work**:

- ❌ Desktop fails to download backup from server
- ❌ Message history doesn't sync
- ❌ Offline messages don't sync

**Root Cause**:

- ✅ Fixed: Initialization issue (Task 7.1-7.4)
- ❌ Remaining: Data transfer fails at download stage

**Possible Causes of Data Transfer Failure**:

- Server-side restriction for Linux clients
- Network/firewall blocking data transfer
- Encryption/decryption key mismatch
- File system permission issues

**Impact**:

- ❌ Cannot sync message history from mobile to desktop
- ❌ Messages received on mobile while desktop is offline won't sync
- ✅ Real-time messaging works perfectly when app is open
- ✅ Messages sent from desktop work normally

**Workarounds**:

1. Use mobile app to access full message history
2. Keep desktop app open for real-time messages
3. Use Zalo web version as alternative

**Progress**:

- Task 7.1: ✅ Added comprehensive logging
- Task 7.2: ✅ Identified initialization issue
- Task 7.3: ✅ Fixed initialization (forced init in constructor)
- Task 7.4: ✅ Verified sync request works
- Task 7.5: ⏳ PENDING - Fix data transfer failure

**Technical Details**: See `TASK-7-MESSAGE-SYNC-COMPLETE.md`

**Next Steps**:

- Add logging to download/decrypt states
- Monitor network traffic with Wireshark
- Check file system permissions
- Investigate encryption key handling

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

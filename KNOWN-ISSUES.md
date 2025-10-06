# Known Issues - Zalo Linux Unofficial Port

**Last Updated**: 2025-10-06  
**Version**: v24.9.1

## Critical Issues

### 1. Message History Sync Not Supported

**Severity**: MEDIUM  
**Status**: ⚠️ CANNOT FIX - Missing native Linux module  
**Affected**: All users

**Description**:
Message history sync from mobile devices to desktop does not work. After extensive investigation (Task 7.5), we've identified that this is a **client-side data processing failure**, not a network issue.

**What Works** ✅:

- ✅ Real-time messaging (send/receive messages)
- ✅ File sharing
- ✅ Notifications
- ✅ System tray integration
- ✅ Network communication with Zalo servers
- ✅ Desktop receives encrypted backup data (1433 bytes)

**What Doesn't Work** ❌:

- ❌ Syncing message history from mobile
- ❌ Viewing old messages on desktop
- ❌ Syncing offline messages
- ❌ Decrypting/processing backup data

**Root Cause** (CONFIRMED):

The decryption is handled by a **native C++ module** that is **only compiled for macOS**:

- **Module**: `db-cross-v4-native.node`
- **Location**: `app/native/nativelibs/db-cross-v4/prebuilt/`
- **Available**: macOS only (darwin/)
- **Missing**: Linux, Windows

The sync flow:
1. ✅ Mobile → Server → Desktop (network works)
2. ✅ Desktop receives encrypted data (1433 bytes)
3. ✅ Shared worker calls DECRYPT_BACKUP task
4. ❌ Native module doesn't exist for Linux
5. ❌ `require()` fails silently
6. ❌ Error UI shown

**Technical Evidence**:

```
Request 1: Long-polling for messages
URL: https://ws1-ctl.chat.zalo.me/?zpw_ver=642&zpw_type=25
Status: 200 OK
Content-Length: 1433 bytes
Response: {"error_code":0,"data":"1Cg1H39nsaWmtHINKh3Yf3pCcKHrl/Gpwu07r8pRRNR0..."}
✅ Data received successfully

Request 2: Acknowledgment
Status: 200 OK
Content-Length: 0
✅ Acknowledgment sent

Client Processing: ❌ FAILURE
Shows error UI (img-error-sync.svg)
```

**Impact**:

- ❌ Cannot sync message history from mobile to desktop
- ❌ Messages received on mobile while desktop is offline won't sync
- ✅ Real-time messaging works perfectly when app is open (70% functionality)
- ✅ Messages sent from desktop work normally

**Workarounds**:

1. **Use mobile app** for message history
2. **Keep desktop app open** for real-time messages
3. **Use Zalo web version** (chat.zalo.me) as alternative

**Investigation Complete** (Task 7.5):

- ✅ Task 7.1: Added comprehensive logging
- ✅ Task 7.2: Identified initialization issue
- ✅ Task 7.3: Fixed initialization (forced init in constructor)
- ✅ Task 7.4: Verified sync request works
- ✅ Task 7.5: Found root cause - native C++ module missing for Linux

**Why This Cannot Be Fixed**:

To fix this would require:

1. **Source code** for the `db-cross-v4-native` C++ module (we don't have it)
2. **Compiling** the module for Linux with proper dependencies
3. **Crypto libraries** (OpenSSL, etc.) configured correctly
4. **Testing** to ensure compatibility

Without the source code, this is impossible. Reverse engineering a native cryptographic module would be:
- Extremely difficult (weeks/months of work)
- Potentially illegal (violates Zalo's terms of service)
- No guarantee of success

**Possible Solutions**:

1. **Contact Zalo/VNG Corp** - Request official Linux support
2. **Accept limitation** - Document clearly what works and what doesn't (RECOMMENDED)
3. **Use web version** - For full functionality including history sync

**Technical Details**: See `TASK-7.5-ROOT-CAUSE-FOUND.md`

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

### v24.9.1 (2025-10-06)

- ✅ Fixed Wayland window controls
- ✅ Added native window frame for Linux
- ✅ Improved KDE Plasma integration
- ✅ Fixed message sync initialization (real-time messaging works)
- ⚠️ Documented message history sync limitation (cannot be fixed)

### v24.9.0 (Original)

- Initial MacOS → Linux port
- Basic functionality working
- Known issues with Wayland and sync

---

**For detailed technical analysis of the message sync issue, see**: `TASK-7.5-COMPLETE-FINDINGS.md`

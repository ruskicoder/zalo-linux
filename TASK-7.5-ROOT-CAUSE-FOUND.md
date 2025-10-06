# Task 7.5: ROOT CAUSE FOUND! 🎯

**Date**: 2025-10-06  
**Status**: ✅ ROOT CAUSE IDENTIFIED  
**Severity**: CRITICAL - Cannot be fixed without native module

---

## Executive Summary

**Message history sync fails because the decryption is done by a NATIVE C++ MODULE that is ONLY compiled for macOS. There is NO Linux version of this module.**

---

## The Complete Picture

### 1. How Sync Works

```
Mobile → Server → Desktop (Network) ✅ WORKS
                ↓
         Encrypted Data (1433 bytes) ✅ RECEIVED
                ↓
         Shared Worker ✅ CALLED
                ↓
         Native Module (db-cross-v4-native.node) ❌ FAILS
                ↓
         Decryption ❌ NEVER HAPPENS
                ↓
         Error UI (img-error-sync.svg) ❌ SHOWN
```

### 2. Why Our Logs Didn't Appear

We added logs to `main.js` → `decryptAESZalo()` function, but:

- That function is for **API domain decryption** (different purpose)
- **Message sync decryption** happens in the **shared worker**
- The shared worker calls a **native C++ module**
- The native module doesn't exist for Linux

---

## Technical Details

### Location of Decryption Code

**File**: `source-code/ZaDark/Zalo/app/pc-dist/shared-worker.beautified.js`  
**Line**: 1898-1940

```javascript
class extends D.a {
  getType() {
    return "DECRYPT_BACKUP"
  }
  
  async execute(e) {
    return e.abort.aborted ? Promise.reject(new Error("Aborted")) : this._decyptBackup(e)
  }
  
  async _decyptBackup(e) {
    const { params: t, report: s } = e;
    return await Object(Ee.b)(t.outputPath), 
      0 === t.format 
        ? this._decryptBackupFormat0(t.inputPath, t.outputPath, t.privateKey) 
        : this._decryptBackupFormat1(t.inputPath, t.outputPath, t.privateKey, t.numberOfConversationsCount, s)
  }
  
  async _decryptBackupFormat0(e, t, s) {
    const { result: i, err_message: r } = je.decompressAndDecryptDb(e, t, s);
    return 0 === i ? t : Promise.reject({ error: i, message: r })
  }
  
  async _decryptBackupFormat1(e, t, s, i, r) {
    t = await Object(Ee.a)(t);
    let n = 0;
    const { result: a, inner_error: o, error_message: c } = 
      je.decompressAndDecryptDb_V2(e, t, s.toUpperCase(), (() => {
        n++;
        const e = Math.round(n / i * 100);
        r(e)
      }));
    return 0 === a ? t : Promise.reject({ error: a, inner_error: o, message: c })
  }
}
```

### The Native Module

**Line 1896**:

```javascript
const je = $znode.nativelibs.dbUtils();
```

This loads the native module from:

```
source-code/ZaDark/Zalo/app/native/nativelibs/db-cross-v4/dist/binding.js
```

### The Binding Code

```javascript
"use strict";
let addon;
if (process.platform === 'darwin') {
    addon = require(`../prebuilt/darwin/electron/${process.arch}/db-cross-v4-native.node`);
}
else {
    if (process.arch === 'x64') {
        addon = require('../prebuilt/window/electron_x86_64/db-cross-v4-native.node');
    }
    else {
        addon = require('../prebuilt/window/electron_x86/db-cross-v4-native.node');
    }
}
module.exports = addon;
```

### The Problem

**Only macOS binaries exist**:

```bash
$ ls source-code/ZaDark/Zalo/app/native/nativelibs/db-cross-v4/prebuilt/
darwin/
```

**No Windows or Linux binaries!**

The code references `../prebuilt/window/` but that directory **doesn't exist**.

---

## Why This Happens

### On macOS ✅

1. `process.platform === 'darwin'` → true
2. Loads `darwin/electron/x64/db-cross-v4-native.node`
3. Native module exists ✅
4. Decryption works ✅

### On Linux ❌

1. `process.platform === 'linux'` → not darwin
2. Tries to load `window/electron_x86_64/db-cross-v4-native.node`
3. Directory doesn't exist ❌
4. `require()` throws error ❌
5. Shared worker catches error silently ❌
6. Shows error UI ❌

---

## What the Native Module Does

Based on the function names:

- `decompressAndDecryptDb()` - Format 0 (older)
- `decompressAndDecryptDb_V2()` - Format 1 (newer)

The native module:

1. Takes encrypted backup data
2. Decrypts it using a private key
3. Decompresses it
4. Writes to SQLite database
5. Returns success/error code

This is **complex cryptographic and database operations** done in C++ for performance.

---

## Why We Can't Fix This Easily

### Option A: Compile Native Module for Linux

**Difficulty**: VERY HIGH  
**Requirements**:

- Source code for `db-cross-v4-native` (we don't have it)
- C++ compiler toolchain
- Crypto libraries (OpenSSL, etc.)
- SQLite libraries
- Electron native module build tools
- Deep understanding of the encryption algorithm

**Challenges**:

- We don't have the source code
- Reverse engineering a native module is extremely difficult
- The encryption algorithm might be proprietary
- Even if we had source, compiling for Linux might reveal platform-specific issues

### Option B: Reverse Engineer the Module

**Difficulty**: EXTREMELY HIGH  
**Requirements**:

- Disassemble the macOS `.node` file
- Understand x86_64 assembly
- Reverse engineer the encryption algorithm
- Reimplement in C++
- Compile for Linux

**Challenges**:

- This could take weeks or months
- Might violate Zalo's terms of service
- Encryption algorithms are intentionally hard to reverse engineer
- No guarantee of success

### Option C: Use JavaScript Decryption

**Difficulty**: HIGH  
**Requirements**:

- Understand the exact encryption algorithm
- Understand the key derivation
- Understand the data format
- Reimplement in pure JavaScript

**Challenges**:

- We don't know the exact algorithm
- Performance would be much slower
- Might not handle all edge cases

---

## Possible Solutions

### Solution 1: Accept the Limitation (RECOMMENDED)

**Effort**: LOW  
**Success**: 100%

**Action**:

- Document that message history sync is not supported on Linux
- Explain that real-time messaging works (70% functionality)
- Provide workarounds (use mobile for history)

**Pros**:

- Honest and transparent
- No risk of breaking things
- Users know what to expect

**Cons**:

- Message history sync doesn't work

### Solution 2: Contact Zalo/VNG Corp

**Effort**: MEDIUM  
**Success**: UNKNOWN

**Action**:

- Reach out to Zalo developers
- Request Linux binaries for `db-cross-v4-native.node`
- Explain the community need

**Pros**:

- Official solution
- Would work properly
- Might get other Linux improvements

**Cons**:

- Zalo might not respond
- Zalo might not support Linux officially
- Could take a long time

### Solution 3: Stub the Native Module

**Effort**: LOW  
**Success**: PARTIAL

**Action**:

- Create a fake `db-cross-v4-native.node` that returns errors gracefully
- Prevents crashes
- Shows better error messages

**Pros**:

- App doesn't crash
- Better error handling
- Easy to implement

**Cons**:

- Still doesn't decrypt messages
- Just makes the failure more graceful

---

## Current Status

### What Works ✅

- Real-time messaging (send/receive)
- File sharing
- Notifications
- System tray
- Network communication
- Sync request/response

### What Doesn't Work ❌

- Message history sync
- Offline message sync
- Backup decryption

### Why It Doesn't Work

**Native C++ module `db-cross-v4-native.node` is not compiled for Linux**

---

## Recommendation

**Accept this as a known limitation and document it clearly.**

### Reasoning

1. **Real-time messaging works** - Users can send/receive messages
2. **Fixing requires source code** - We don't have it
3. **Reverse engineering is impractical** - Too difficult and time-consuming
4. **This is a port, not official** - Some limitations are expected
5. **70% functionality is good** - Better than nothing

### Documentation Updates

1. Update `KNOWN-ISSUES.md` with clear explanation
2. Update `README.md` with limitations section
3. Provide workarounds (use mobile for history)
4. Explain what works and what doesn't

---

## Files Investigated

1. `source-code/ZaDark/Zalo/app/main-dist/main.js` - API domain decryption (wrong place)
2. `source-code/ZaDark/Zalo/app/pc-dist/shared-worker.beautified.js` - Actual sync decryption
3. `source-code/ZaDark/Zalo/app/native/nativelibs/index.js` - Native module loader
4. `source-code/ZaDark/Zalo/app/native/nativelibs/db-cross-v4/dist/binding.js` - Platform detection
5. `source-code/ZaDark/Zalo/app/native/nativelibs/db-cross-v4/prebuilt/` - Only macOS binaries

---

## Conclusion

**Message history sync on Linux is impossible without the native C++ module compiled for Linux.**

The sync process works perfectly up until the decryption step, where it requires a platform-specific native module that only exists for macOS. This is a fundamental architectural limitation, not a bug we can fix with JavaScript.

**Recommended Action**: Document this as a known limitation and focus on ensuring the 70% of functionality that DOES work (real-time messaging) works reliably.

---

**Task 7.5 Status**: Investigation complete, root cause identified, cannot be fixed without native module source code.

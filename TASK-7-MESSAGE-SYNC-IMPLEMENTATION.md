# Task 7: Message Sync - Complete Implementation Guide

**Status**: Task 7.6 ✅ Complete | Task 7.7 🎯 Ready to Implement  
**Timeline**: 1-2 days for Task 7.7  
**Approach**: JavaScript implementation using standard crypto

---

## Overview

Message history sync doesn't work on Linux because the decryption is done by a native C++ module (`db-cross-v4-native.node`) that's only compiled for macOS.

**Good news**: After analyzing the binary, we discovered it uses **standard algorithms** (AES + LZMA + MD5) that we can implement in JavaScript!

---

## What We Discovered

### Algorithms Used

```
Encryption: AES (Advanced Encryption Standard)
├─ Modes: CBC, CFB, ECB (likely CBC)
├─ Key sizes: 128, 192, or 256 bits
└─ Available in Node.js crypto module

Compression: LZMA (Lempel-Ziv-Markov chain)
├─ Same as 7-Zip, XZ Utils
└─ Available via lzma-native npm package

Hashing: MD5
├─ For integrity verification
└─ Available in Node.js crypto module
```

### Process Flow

```
Encrypted File → Parse Format → Derive Key → Decrypt (AES) → 
Verify (MD5) → Decompress (LZMA) → SQLite Database → Success!
```

---

## Quick Start: Task 7.7 Implementation

### Step 1: Capture Encrypted Data (30 min)

```bash
node capture-encrypted-backup.js
```

Follow instructions to:
1. Modify `source-code/ZaDark/Zalo/app/pc-dist/shared-worker.beautified.js`
2. Add capture code to `_decryptBackupFormat1` function (line ~1920)
3. Run Zalo and trigger message history sync
4. Check `/tmp/zalo-capture/` for files

### Step 2: Analyze File Format (1-2 hours)

```bash
node analyze-captured-data.js
```

This shows:
- File structure (header, MD5, IV, encrypted data)
- Entropy analysis
- Possible MD5/IV locations
- Byte patterns

### Step 3: Test Decryption (2-4 hours)

```bash
# Edit with your findings
nano test-decryption-template.js

# Update CONFIG section with file format offsets
# Try different combinations:
# - aesMode: 'aes-256-cbc', 'aes-192-cbc', 'aes-128-cbc'
# - keyDerivation: 'sha256', 'md5', 'direct', 'pbkdf2'

node test-decryption-template.js
```

Success indicators:
- ✅ No decryption errors
- ✅ MD5 checksum matches
- ✅ LZMA signature (FD377A58) or SQLite signature (53514C69)

### Step 4: Implement in Zalo (2-3 hours)

```bash
# Install dependency
cd source-code/ZaDark/Zalo/app
npm install lzma-native

# Create binding-js.js with working decryption code
# Update binding.js to use it on Linux
# Test in Zalo app
```

### Step 5: Update Documentation (1 hour)

Update:
- `KNOWN-ISSUES.md` - Remove limitation
- `FEATURE-MATRIX.md` - Mark sync as working
- `README.md` - Add success story

---

## Tools Available

### Analysis Tools
- `analyze-native-module-deep.js` - Binary analysis, proves feasibility
- `capture-encrypted-backup.js` - Data capture instructions
- `analyze-captured-data.js` - File format analysis
- `test-decryption-template.js` - Decryption testing template

### Test Tools
- `inspect-native-module.js` - Inspect binary for function names
- `test-stub-module.js` - Test stub implementation
- `test-binding-linux.js` - Test binding loader

---

## Implementation Template

```javascript
const crypto = require('crypto');
const lzma = require('lzma-native');
const fs = require('fs');

class DbDecryptor {
  async decompressAndDecryptDb(inputPath, outputPath, privateKey) {
    try {
      // 1. Read encrypted file
      const encryptedData = fs.readFileSync(inputPath);
      
      // 2. Parse file format (update offsets based on analysis)
      const md5 = encryptedData.slice(0, 16);
      const iv = encryptedData.slice(16, 32);
      const encrypted = encryptedData.slice(32);
      
      // 3. Derive AES key (try SHA256 first)
      const key = crypto.createHash('sha256')
        .update(privateKey)
        .digest()
        .slice(0, 32); // 256 bits
      
      // 4. Decrypt with AES-256-CBC
      const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]);
      
      // 5. Verify MD5
      const calculatedMd5 = crypto.createHash('md5').update(decrypted).digest();
      if (!calculatedMd5.equals(md5)) {
        return { result: 2, err_message: 'MD5 checksum mismatch' };
      }
      
      // 6. Decompress with LZMA
      const decompressed = await lzma.decompress(decrypted);
      
      // 7. Write to output
      fs.writeFileSync(outputPath, decompressed);
      
      return { result: 0, err_message: '' };
      
    } catch (error) {
      return { result: 1, err_message: error.message };
    }
  }
  
  async decompressAndDecryptDb_V2(inputPath, outputPath, privateKey, progressCallback) {
    // Same as above but call progressCallback during processing
    return this.decompressAndDecryptDb(inputPath, outputPath, privateKey);
  }
}

module.exports = new DbDecryptor();
```

---

## Troubleshooting

### Decryption Fails
Try different combinations:
- AES modes: CBC, CFB, ECB
- Key sizes: 128, 192, 256 bits
- Key derivations: SHA256, MD5, direct, PBKDF2
- File format offsets

### MD5 Mismatch
- Wrong AES mode
- Wrong key derivation
- Wrong IV location
- Wrong file format parsing

### LZMA Fails
- Check decryption is correct (MD5 should match first)
- Verify LZMA signature (FD377A58)
- Try different LZMA options

---

## Why This Will Work

1. **Standard Algorithms** - AES, LZMA, MD5 are well-documented
2. **Available in JS** - Node.js crypto + lzma-native package
3. **Legal** - Reverse engineering for interoperability
4. **Proven** - Similar projects have succeeded
5. **Maintainable** - Readable source code, no binaries

---

## Timeline

**Day 1**: Capture (30 min) + Analyze (1-2 hrs) + Test decryption (2-4 hrs)  
**Day 2**: Implement (2-3 hrs) + Test (1-2 hrs) + Document (1 hr)

**Total**: 1-2 days

---

## Success Criteria

- ✅ Decrypt sample file successfully
- ✅ MD5 verification passes
- ✅ LZMA decompression works
- ✅ SQLite database is valid
- ✅ Message history appears in Zalo
- ✅ No data corruption
- ✅ Performance <5 seconds

---

## Resources

- [Node.js Crypto](https://nodejs.org/api/crypto.html)
- [lzma-native](https://www.npmjs.com/package/lzma-native)
- [AES Encryption](https://en.wikipedia.org/wiki/Advanced_Encryption_Standard)

---

## Next Steps

1. Run `node capture-encrypted-backup.js` for instructions
2. Capture encrypted data
3. Analyze file format
4. Test decryption
5. Implement in Zalo
6. Celebrate! 🎉

**Status**: 🎯 Ready to implement Task 7.7

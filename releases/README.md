# Zalo Linux Releases

This directory contains official release packages for Zalo Linux.

## Available Versions

### v0.0.1-rev.02 (Latest)
- **Release Date**: 2025-10-06
- **Packages**:
  - `zalo-linux-v0.0.1-rev.02.tar.gz` - Standard version (66 MB)
  - `zadark-linux-v0.0.1-rev.02.tar.gz` - Dark theme version (64 MB)
- **Release Notes**: See `RELEASE-NOTES-v0.0.1-rev.02.md`

## Quick Start

### 1. Download Package
Choose either standard or dark theme version.

### 2. Verify Checksum (Optional but Recommended)
```bash
sha256sum -c SHA256SUMS
```

### 3. Extract
```bash
# Standard version
tar -xzf zalo-linux-v0.0.1-rev.02.tar.gz

# Dark theme version
tar -xzf zadark-linux-v0.0.1-rev.02.tar.gz
```

### 4. Run
```bash
cd Zalo
./Zalo
```

## Checksums

See `SHA256SUMS` file for package verification.

```
74e5061de85f92471b758ac6d6770398347e335cddb76c9e18f1d38496f3f0bc  zadark-linux-v0.0.1-rev.02.tar.gz
2e33634f9a4319df5c0b9384462db9e83f77e73f38771d8438365430aebaeace  zalo-linux-v0.0.1-rev.02.tar.gz
```

## Known Limitations

⚠️ **Message sync from mobile to desktop is not functional** in this release.

**Workarounds**:
- Keep desktop app open for real-time messages
- Use mobile app for message history

See `RELEASE-NOTES-v0.0.1-rev.02.md` for complete details.

## Support

- **Issues**: [GitHub Issues](https://github.com/your-repo/zalo-linux/issues)
- **Documentation**: See main README.md
- **Release Notes**: See RELEASE-NOTES-v0.0.1-rev.02.md

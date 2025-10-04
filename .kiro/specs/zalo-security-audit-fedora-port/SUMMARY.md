# Zalo Linux Security Audit & Fedora Port - Project Summary

## Project Overview

**Goal:** Conduct comprehensive security audit, modernization, and Fedora KDE Plasma 42 optimization of the Zalo Linux port.

**Timeline:** 6 days (soft targets, work at natural pace)

**MVP Definition:** Setup → Wayland/KDE → Message Sync (Pre-development MVP release)

---

## Success Criteria

**Minimum Viable Product (MVP):**
1. ✅ Application launches on Fedora KDE Plasma 42
2. ✅ Wayland window controls work (minimize, maximize, close, titlebar)
3. ✅ KDE Plasma integration (system tray, notifications)
4. ✅ Messaging works (send, receive, read receipts)
5. ✅ File upload/download works
6. ✅ Message sync works (or documented if server-side issue)

**Post-MVP (Security & Polish):**
- Code deobfuscation and reverse engineering
- Electron and dependency updates
- Privacy controls (Sentry opt-in)
- Content Security Policy
- Installation script hardening
- Comprehensive documentation

---

## Key Technical Decisions

### Architecture
- **Electron Version:** Test v28 → v31 sequentially, stay on v22 if both fail
- **Dependencies:** Incremental updates with wrappers as needed (axios for request)
- **System Tray:** Electron native API (Python fallback if issues)
- **Window Controls:** Native frame first, custom titlebar (8+ hours) if needed

### Development Approach
- **Deobfuscation:** BEFORE bug fixes (understand code first)
- **Testing:** Embedded in each task, ad-hoc manual testing
- **Milestones:** Report when something works (not phase-based)
- **Version Control:** Main branch, feature branches as needed, commit when working
- **Bug Tracking:** BUGS.md (temp), all records → history.md

### Privacy & Security
- **Sentry:** Disabled by default, opt-in via Settings > Privacy
- **Local Logging:** `~/.local/share/Zalo/logs/`, minimal (error message only)
- **CSP:** Relax if any feature breaks, dev-mode only, can be fully disabled
- **Auto-Update:** Comment out code, no manual update check

### Installation
- **Package Manager:** dnf for Fedora (pip fallback)
- **Uninstall:** Create uninstall.sh
- **Testing:** Actual system (not VM)
- **Checksum:** Verify from GitHub SHASUMS256.txt

---

## Implementation Phases

### Phase 1: MVP - Core Functionality (Days 1-3)
**Priority: CRITICAL**

1. **Environment Setup**
   - Set up dev environment
   - Analyze codebase structure
   - Install deobfuscation tools

2. **Wayland Window Controls Fix**
   - Test current behavior
   - Try native frame (`frame: true`)
   - If fails: Custom titlebar (Zalo design + system theme option)
   - Verify on Wayland and X11

3. **KDE Plasma Integration**
   - Replace Python tray with Electron native (Python fallback if issues)
   - Implement tray menu: Open, Tray Settings (close to tray), Exit
   - Implement KDE notifications
   - Update desktop entry

4. **Message Sync Fix**
   - Add comprehensive logging
   - Check network traffic (is client sending requests?)
   - Identify root cause
   - Fix if client-side, document if server-side
   - Test with chat.zalo.me and mobile devices

**Deliverable:** Pre-development MVP - Zalo working on Fedora with Wayland/KDE support

---

### Phase 2: Code Understanding (Days 3-4)
**Priority: HIGH**

5. **Code Deobfuscation**
   - Deobfuscate main.js (main process)
   - Deobfuscate pc-dist files (renderer, focus on modified files)
   - Create source-code/ directory
   - Document in ARCHITECTURE.md
   - Create REVERSE-ENGINEER.md (detailed methodology, not prioritized)

**Deliverable:** Readable source code for maintenance

---

### Phase 3: Security Updates (Days 4-5)
**Priority: MEDIUM**

6. **Electron Update**
   - Test v28.x LTS
   - Test v31.x LTS
   - Choose best version or stay on v22
   - Fix breaking changes (as long as needed)

7. **Dependency Updates**
   - Create axios wrapper for request
   - Update dependencies incrementally/in groups
   - Create wrappers for other breaking changes as needed
   - Fix code to work with new versions (or revert/find alternatives)

8. **Privacy Controls**
   - Find Settings location
   - Create Privacy Manager module
   - Add Privacy tab with Sentry opt-in toggle
   - Implement local error logger (`~/.local/share/Zalo/logs/`)
   - No in-app log viewer for MVP

9. **Content Security Policy**
   - Implement CSP with Zalo API whitelist
   - Allow `'unsafe-inline'` for React
   - Add CSP violation logging (dev-mode only)
   - Relax policy if any feature breaks
   - Make fully disableable in dev mode

**Deliverable:** Secure, modern codebase

---

### Phase 4: Installation & Documentation (Days 5-6)
**Priority: MEDIUM**

10. **Installation Script Hardening**
    - Use dnf for Python deps (pip fallback)
    - Add Electron checksum verification (GitHub SHASUMS256.txt)
    - Use secure temp directories
    - Minimize sudo usage
    - Create uninstall.sh
    - Test on actual Fedora system

11. **Auto-Update Disable**
    - Comment out auto-updater code
    - Skip manual update check (users use GitHub/git)

12. **Documentation**
    - Create SECURITY.md (balance between brief and detailed)
    - Update README.md (installation, building, troubleshooting, known issues)
    - Add screenshots if easy (will instruct)
    - Create CHANGELOG.md
    - Update LICENSE with friendly disclaimer (credit VNG for trademarks)
    - Create REVERSE-ENGINEER.md (not prioritized)

13. **Final Testing & Polish**
    - Ad-hoc testing of all features
    - Skip voice/video calls if too difficult
    - Fix bugs by priority (critical first, document non-critical)
    - Track bugs in BUGS.md (temp), record in history.md
    - Clean up code
    - Final installation test

**Deliverable:** Production-ready release with documentation

---

## Stretch Goals (If Time Permits)

- Performance optimizations
- Additional KDE integrations
- Multi-account support
- Custom titlebar with both options (Zalo design + system theme)
- Tray icon style and notification badges settings
- In-app log viewer

---

## File Structure

```
zalo-linux-unofficial/
├── source-code/              # Deobfuscated code
│   ├── main-dist/
│   ├── pc-dist/
│   └── ARCHITECTURE.md
├── Zalo/                     # Original code
│   └── Zalo/app/
│       ├── main-dist/        # Minified
│       ├── pc-dist/          # Minified
│       └── package.json      # Updated deps
├── install.sh                # Hardened
├── uninstall.sh              # NEW
├── SECURITY.md               # NEW
├── CHANGELOG.md              # NEW
├── REVERSE-ENGINEER.md       # NEW (not prioritized)
├── BUGS.md                   # Temp file
├── LICENSE                   # Updated disclaimer
└── README.md                 # Updated
```

---

## Development Workflow

1. **Work on tasks** from tasks.md
2. **Test embedded** in each task
3. **Commit when something works**
4. **Report milestone** when feature complete
5. **Track bugs** in BUGS.md (temp)
6. **Record everything** in history.md
7. **Use main branch** + feature branches as needed

---

## Testing Approach

- **Manual ad-hoc testing** after each change
- **Install/test/uninstall** cycle on actual Fedora system
- **Test with chat.zalo.me** and mobile devices for message sync
- **Skip voice/video calls** if too difficult
- **No automated tests** for MVP

---

## Blocker Handling

1. **Spend more time** on it (as long as needed)
2. **Try alternative approaches**
3. **Document and move to next task**

---

## Cut Priority (If Behind Schedule)

**Keep at all costs:** Setup → Wayland/KDE → Message Sync (MVP)

**Can cut:** Everything after deobfuscation (security updates, privacy, CSP, docs)

---

## Next Steps

1. Open `.kiro/specs/zalo-security-audit-fedora-port/tasks.md`
2. Start with Task 1: Set up development environment
3. Work through tasks sequentially (some parallel for docs/testing)
4. Report milestones when features work
5. Track progress in history.md

**Ready to begin implementation!** 🚀

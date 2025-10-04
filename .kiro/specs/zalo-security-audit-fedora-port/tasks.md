# Implementation Plan

## Task Overview

This implementation plan breaks down the Zalo Linux security audit and Fedora port into discrete, manageable tasks. Tasks are organized by priority based on user requirements: **Wayland → KDE Integration → Message Sync → Security Updates**. 

---

## Phase 1: Environment Setup and Initial Analysis

- [x] 1. Set up development environment
  - Create backup of current codebase to separate directory
  - Set up Node.js development environment
  - Install required tools: `js-beautify`, `esprima`, `escodegen`
  - Verify Fedora KDE Plasma 42 system is ready for testing
  - _Requirements: All_

- [ ] 2. Analyze current codebase structure
  - Document directory structure and key files
  - Identify minified files in `main-dist/` and `pc-dist/`
  - Map dependencies in `package.json`
  - Identify Electron version and configuration
  - _Requirements: 1.1, 2.1_

---

## Phase 2: Critical Bug Fixes (Wayland + KDE Integration)

- [ ] 3. Fix Wayland window controls
  - [ ] 3.1 Test current behavior on Wayland and X11
    - Launch app and document window control issues
    - Test minimize, maximize, close buttons
    - Test titlebar drag functionality
    - _Requirements: 4.1, 4.2_
  
  - [ ] 3.2 Implement native frame solution (Option A)
    - Modify `BrowserWindow` creation in main process
    - Set `frame: true` for Linux platform
    - Test on Wayland and X11
    - _Requirements: 4.1, 4.2_
  
  - [ ] 3.3 If native frame fails, implement custom titlebar (Option B)
    - Create React titlebar component with Zalo MacOS design
    - Add option for system theme matching
    - Implement IPC handlers for window controls
    - Set `WebkitAppRegion: 'drag'` for titlebar
    - Test on Wayland and X11
    - _Requirements: 4.1, 4.2_
  
  - [ ] 3.4 Verify window controls work correctly
    - Test minimize, maximize, close on Wayland
    - Test minimize, maximize, close on X11
    - Test window resize and drag
    - _Requirements: 4.1, 4.2, 4.5_

- [ ] 4. Implement KDE Plasma integration
  - [ ] 4.1 Replace Python tray with Electron native tray
    - Remove Python `main.py` dependency
    - Implement `SystemTrayManager` class using Electron's `Tray` API
    - Create tray menu with: Open Zalo, Tray Settings, Exit
    - Test tray icon appears in KDE Plasma system tray
    - _Requirements: 5.1, 5.2, 7.1_
  
  - [ ] 4.2 Implement tray settings
    - Add "Close button hides to tray" setting
    - Store setting in Electron store
    - Implement window close behavior based on setting
    - _Requirements: 5.1_
  
  - [ ] 4.3 Implement KDE notifications
    - Use Electron's `Notification` API
    - Test notifications appear in KDE Plasma
    - Verify notification actions work
    - _Requirements: 5.2_
  
  - [ ] 4.4 Update desktop entry for KDE
    - Modify `Zalo.desktop` file
    - Follow XDG Desktop Entry Specification
    - Set correct `Exec`, `Icon`, `Categories`
    - Add `MimeType` and `StartupWMClass`
    - _Requirements: 5.5_

---

## Phase 3: Message Sync Fix

- [ ] 5. Debug and fix message synchronization
  - [ ] 5.1 Add comprehensive logging to sync service
    - Identify message sync service in deobfuscated code
    - Add logging for connection status, sync attempts, errors
    - Log WebSocket connection state
    - _Requirements: 4.3, 4.4_
  
  - [ ] 5.2 Test and identify root cause
    - Run app with logging enabled
    - Attempt to sync messages
    - Analyze logs to identify failure point
    - Check if it's server-side, client-side, or network issue
    - _Requirements: 4.3, 4.4_
  
  - [ ] 5.3 Implement fix based on root cause
    - If WebSocket issue: Fix connection logic
    - If database issue: Fix IndexedDB/SQLite sync
    - If authentication issue: Fix token handling
    - If server-side issue: Implement workaround or document limitation
    - _Requirements: 4.3, 4.4_
  
  - [ ] 5.4 Verify message sync works
    - Test sending messages from desktop
    - Test receiving messages on desktop
    - Test sync after offline period
    - Verify no duplicate messages
    - _Requirements: 4.3, 4.4, 11.2_

---

## Phase 4: Code Deobfuscation

- [ ] 6. Deobfuscate critical JavaScript files
  - [ ] 6.1 Deobfuscate main process code
    - Beautify `main-dist/main.js`
    - Analyze and rename variables where possible
    - Add comments for clarity
    - Save to `source-code/main-dist/main.js`
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 6.2 Deobfuscate renderer process code
    - Beautify key files in `pc-dist/`
    - Focus on files related to messaging, file upload, sync
    - Add comments for clarity
    - Save to `source-code/pc-dist/`
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [ ] 6.3 Document code structure
    - Create `source-code/ARCHITECTURE.md`
    - Document high-level architecture
    - Document key modules and their purposes
    - Add code comments in deobfuscated files
    - _Requirements: 1.6, 10.6_

---

## Phase 5: Electron and Dependency Updates

- [ ] 7. Update Electron version
  - [ ] 7.1 Test with Electron v28.x LTS
    - Update `package.json` to Electron v28.x
    - Run `npm install`
    - Test application launch
    - Test core functionality (messaging, file upload, sync)
    - Document any breaking changes
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [ ] 7.2 Test with Electron v31.x LTS
    - Update `package.json` to Electron v31.x
    - Run `npm install`
    - Test application launch
    - Test core functionality
    - Compare with v28.x results
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [ ] 7.3 Choose Electron version and fix breaking changes
    - Select v31.x if viable, otherwise v28.x
    - Fix any breaking changes in code
    - Update Electron-specific APIs if needed
    - Verify all features work
    - _Requirements: 2.1, 2.3, 2.4_

- [ ] 8. Update npm dependencies
  - [ ] 8.1 Create axios wrapper for request migration
    - Create `lib/request-wrapper.js`
    - Implement wrapper to mimic `request` API using `axios`
    - Test wrapper with sample requests
    - _Requirements: 2.2, 2.3_
  
  - [ ] 8.2 Update package.json dependencies
    - Add `axios: ^1.6.0`
    - Update `ajv: ^8.12.0`
    - Update `tough-cookie: ^4.1.3`
    - Update `crypto-js: ^4.2.0`
    - Update `adm-zip: ^0.5.10`
    - Update `js-yaml: ^4.1.0`
    - Update `node-fetch: ^3.3.2`
    - Update `glob: ^10.3.10`
    - Update `@sentry/electron: ^4.15.0`
    - Update `@sentry/react: ^7.100.0`
    - _Requirements: 2.2, 2.3_
  
  - [ ] 8.3 Run npm install and fix breaking changes
    - Run `npm install`
    - Fix any breaking changes from updated dependencies
    - Replace `request` calls with axios wrapper
    - Test application after each major change
    - _Requirements: 2.3, 2.4_
  
  - [ ] 8.4 Verify core functionality after updates
    - Test messaging (send, receive, read receipts)
    - Test file upload and download
    - Test message sync
    - Test all major features
    - _Requirements: 2.5, 11.1, 11.2, 11.3_

---

## Phase 6: Privacy Controls and Security

- [ ] 9. Implement privacy controls
  - [ ] 9.1 Create Privacy Manager module
    - Create `lib/PrivacyManager.js`
    - Implement settings storage (Electron store)
    - Implement Sentry initialization (disabled by default)
    - Implement local error logger
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 9.2 Add Privacy settings UI
    - Add "Privacy" tab in Settings
    - Add Sentry opt-in toggle (disabled by default)
    - Add warning popup when enabling Sentry
    - Store user preference
    - _Requirements: 3.1, 3.5, 3.6_
  
  - [ ] 9.3 Implement local error logging
    - Create `LocalErrorLogger` class
    - Log errors to file (minimal: error message only)
    - Implement log rotation (keep file size manageable)
    - _Requirements: 3.3_
  
  - [ ] 9.4 Test privacy controls
    - Verify Sentry is disabled by default
    - Test enabling Sentry via settings
    - Verify local logging works
    - Verify no personal data in logs
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 10. Implement Content Security Policy
  - [ ] 10.1 Add CSP headers
    - Implement CSP in main process
    - Set strict policy with Zalo API whitelist
    - Allow `'unsafe-inline'` for React
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 10.2 Add CSP violation logging (dev only)
    - Add event listener for CSP violations
    - Log violations in development mode only
    - Send to local logger
    - _Requirements: 8.4_
  
  - [ ] 10.3 Test CSP with core features
    - Test messaging works with CSP
    - Test file upload works with CSP
    - Test message sync works with CSP
    - Relax policy if needed for functionality
    - _Requirements: 8.3, 11.1, 11.2, 11.3_

---

## Phase 7: Installation Script Hardening

- [ ] 11. Harden installation script for Fedora
  - [ ] 11.1 Update install.sh for Fedora
    - Use `dnf` for Python dependencies
    - Install `python3-pystray` and `python3-pillow` via dnf
    - Remove `--break-system-packages` flag
    - _Requirements: 5.4, 6.1, 6.2_
  
  - [ ] 11.2 Add Electron checksum verification
    - Download SHASUMS256.txt from GitHub releases
    - Verify Electron zip checksum before extraction
    - Exit with error if checksum mismatch
    - _Requirements: 6.2_
  
  - [ ] 11.3 Use secure temporary directories
    - Use `mktemp -d` for temp directories
    - Clean up temp files after installation
    - _Requirements: 6.4_
  
  - [ ] 11.4 Minimize sudo usage
    - Only use sudo for chrome-sandbox permissions
    - Document why sudo is needed
    - _Requirements: 6.3_
  
  - [ ] 11.5 Test installation script
    - Test on clean Fedora KDE Plasma 42 system
    - Verify all dependencies install correctly
    - Verify app launches after installation
    - _Requirements: 5.3, 5.6, 5.7, 5.8_

- [ ] 12. Disable auto-update mechanism
  - [ ] 12.1 Disable built-in auto-updater
    - Locate auto-updater code in main process
    - Disable automatic update checks
    - Remove update notifications
    - _Requirements: None (user request)_
  
  - [ ] 12.2 Implement manual update check (optional)
    - Add "Check for Updates" in Help menu
    - Check GitHub releases for new version
    - Notify user if update available
    - Provide download link (no auto-install)
    - _Requirements: None (user request)_

---

## Phase 8: Documentation and Legal

- [ ] 13. Create documentation
  - [ ] 13.1 Create SECURITY.md
    - Document security measures implemented
    - Document vulnerability fixes
    - Document privacy controls
    - Document CSP implementation
    - _Requirements: 2.6, 10.1, 10.2, 10.3_
  
  - [ ] 13.2 Update README.md
    - Add installation instructions for Fedora
    - Add building from source instructions
    - Add troubleshooting section
    - Add known issues section
    - Document privacy controls
    - Add credits to VNG Corp (trademarks only)
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 13.3 Create CHANGELOG.md
    - Document all changes made
    - Document bug fixes (Wayland, message sync)
    - Document security updates
    - Document new features (privacy controls, KDE integration)
    - _Requirements: 10.2_
  
  - [ ] 13.4 Update LICENSE with friendly disclaimer
    - State no affiliation with VNG Corp/Zalo
    - Use friendly, non-threatening language
    - Credit VNG Corp for trademarks
    - Maintain welcoming tone
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

---

## Phase 9: Final Testing and Polish

- [ ] 14. Comprehensive testing
  - [ ] 14.1 Test all core features
    - Test messaging (send, receive, read receipts)
    - Test file upload and download
    - Test message sync across devices
    - Test voice/video calls (if possible)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 14.2 Test Wayland and X11 compatibility
    - Test window controls on Wayland
    - Test window controls on X11
    - Test system tray on both
    - Test notifications on both
    - _Requirements: 4.5, 5.6_
  
  - [ ] 14.3 Test privacy controls
    - Verify Sentry disabled by default
    - Test enabling/disabling Sentry
    - Verify local logging works
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 14.4 Test installation and uninstallation
    - Test fresh installation on Fedora
    - Test application launch after install
    - Test uninstallation (clean removal)
    - _Requirements: 5.3, 5.7, 5.8_
  
  - [ ] 14.5 Fix any bugs discovered during testing
    - Document bugs found
    - Fix critical bugs
    - Test fixes
    - _Requirements: 11.7_

- [ ] 15. Final polish and delivery
  - [ ] 15.1 Clean up codebase
    - Remove debug logging
    - Remove commented-out code
    - Ensure code formatting is consistent
    - _Requirements: All_
  
  - [ ] 15.2 Verify all documentation is complete
    - Review SECURITY.md
    - Review README.md
    - Review CHANGELOG.md
    - Review LICENSE
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 15.3 Create final backup
    - Backup modified files
    - Document changes made
    - _Requirements: None_
  
  - [ ] 15.4 Final installation test
    - Install on clean Fedora system
    - Test all features one final time
    - Verify no errors in console
    - _Requirements: All_

---

## Notes

- **Priority Order**: Wayland → KDE Integration → Message Sync → Security Updates
- **Testing**: Manual testing after each major task, install/test/uninstall cycle
- **Check-ins**: Report progress at major milestones (end of each phase)
- **Timeline**: 6 days total, approximately 1-1.5 days per phase
- **Backup**: Backup modified files before making changes, delete temp files after confirmation
- **Bug Fixes**: Fix all bugs discovered during development
- **Optional Tasks**: None marked as optional - all tasks are required for MVP


- [x] 1. Set up development environment
  - Create backup of current codebase to separate directory
  - Set up Node.js development environment
  - Install required tools: `js-beautify`, `esprima`, `escodegen`
  - Verify Fedora KDE Plasma 42 system is ready for testing
  - _Requirements: All_

- [x] 2. Analyze current codebase structure
  - Document directory structure and key files
  - Identify minified files in `main-dist/` and `pc-dist/`
  - Map dependencies in `package.json`
  - Identify Electron version and configuration
  - _Requirements: 1.1, 2.1_


- [x] 3. Fix Wayland window controls
  - [x] 3.1 Test current behavior on Wayland and X11
    - Launch app and document window control issues
    - Test minimize, maximize, close buttons
    - Test titlebar drag functionality
    - _Requirements: 4.1, 4.2_
  
  - [x] 3.2 Implement native frame solution (Option A)
    - Modify `BrowserWindow` creation in main process
    - Set `frame: true` for Linux platform
    - Test on Wayland and X11
    - _Requirements: 4.1, 4.2_
  
  - [x] 3.3 If native frame fails, implement custom titlebar (Option B)
    - Create React titlebar component with Zalo MacOS design
    - Add option for system theme matching
    - Implement IPC handlers for window controls
    - Set `WebkitAppRegion: 'drag'` for titlebar
    - Test on Wayland and X11
    - _Requirements: 4.1, 4.2_
  
  - [x] 3.4 Verify window controls work correctly
    - Test minimize, maximize, close on Wayland
    - Test minimize, maximize, close on X11
    - Test window resize and drag
    - _Requirements: 4.1, 4.2, 4.5_

- [x] 4. Deobfuscate main and renderer processes from both Zalo variants
  - [x] 4.1 Deobfuscate Zalo variant - main process
    - Beautify all files in `original/Zalo/Zalo/app/main-dist/`
    - Add structural comments for clarity
    - Save to `source-code/Zalo/main-dist/`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.2 Deobfuscate Zalo variant - renderer process
    - Beautify all JavaScript files in `original/Zalo/Zalo/app/pc-dist/`
    - Add structural comments for clarity
    - Save to `source-code/Zalo/pc-dist/`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.3 Deobfuscate ZaDark variant - main process
    - Beautify all files in `original/ZaloZaDark/Zalo/app/main-dist/`
    - Add structural comments for clarity
    - Save to `source-code/ZaDark/main-dist/`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.4 Deobfuscate ZaDark variant - renderer process
    - Beautify all JavaScript files in `original/ZaloZaDark/Zalo/app/pc-dist/`
    - Add structural comments for clarity
    - Save to `source-code/ZaDark/pc-dist/`
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 4.5 Document code structure for both variants
    - Create `source-code/Zalo/ARCHITECTURE.md`
    - Create `source-code/ZaDark/ARCHITECTURE.md`
    - Document high-level architecture
    - Document key modules and their purposes
    - Document differences between Zalo and ZaDark variants
    - _Requirements: 1.6, 10.6_

- [ ] 5. Deep analysis and function indexing for all deobfuscated files
  - [ ] 5.1 Analyze Zalo variant - main process files
    - Parse all files in `source-code/Zalo/main-dist/`
    - Extract and index all functions, classes, and exports
    - Identify IPC handlers, event listeners, and API endpoints
    - Document function signatures, parameters, and return types
    - Map dependencies between modules
    - Save analysis to `source-code/Zalo/ANALYSIS-main.md`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ] 5.2 Analyze Zalo variant - renderer process files
    - Parse all files in `source-code/Zalo/pc-dist/`
    - Extract and index all functions, classes, and exports
    - Identify React components, Redux actions, and state management
    - Document worker message handlers and APIs
    - Map data flow between workers and main renderer
    - Save analysis to `source-code/Zalo/ANALYSIS-renderer.md`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ] 5.3 Analyze ZaDark variant - main process files
    - Parse all files in `source-code/ZaDark/main-dist/`
    - Extract and index all functions, classes, and exports
    - Identify differences from standard Zalo main process
    - Document ZaDark-specific modifications
    - Save analysis to `source-code/ZaDark/ANALYSIS-main.md`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ] 5.4 Analyze ZaDark variant - renderer process files
    - Parse all files in `source-code/ZaDark/pc-dist/`
    - Extract and index all functions, classes, and exports
    - Identify ZaDark theme engine functions and APIs
    - Document theme customization hooks and extension points
    - Map ZaDark-specific data flow
    - Save analysis to `source-code/ZaDark/ANALYSIS-renderer.md`
    - _Requirements: 1.1, 1.2, 1.3, 1.6_

  - [ ] 5.5 Create comprehensive function index
    - Create `source-code/FUNCTION-INDEX.md` with searchable function catalog
    - Index all functions by name, file, and purpose
    - Create cross-reference map for function calls
    - Document critical functions for security audit
    - Document functions related to messaging, file upload, sync
    - Create quick reference guide for large files (10000+ lines)
    - _Requirements: 1.6, 10.6_

  - [ ] 5.6 Update ARCHITECTURE.md with deep analysis
    - Enhance `source-code/Zalo/ARCHITECTURE.md` with function-level details
    - Enhance `source-code/ZaDark/ARCHITECTURE.md` with function-level details
    - Add detailed call graphs for critical operations
    - Add sequence diagrams for message flow
    - Add security-critical function documentation
    - Add performance-critical function documentation
    - _Requirements: 1.6, 10.6_

- [ ] 6. Implement KDE Plasma integration with native Electron
  - [ ] 6.1 Implement native Electron tray
    - Remove Python `main.py` dependency
    - Implement `SystemTrayManager` class using Electron's `Tray` API
    - Create tray menu with: Open Zalo, Tray Settings, Exit
    - Test tray icon in KDE Plasma system tray
    - _Requirements: 5.1, 5.2, 7.1_
    - _Note: Moved from Phase 2 - requires deobfuscated code_

  - [ ] 6.2 Implement tray settings
    - Add "Close button hides to tray" setting
    - Store setting in Electron store
    - Implement window close behavior based on setting
    - _Requirements: 5.1_

  - [ ] 6.3 Implement KDE notifications
    - Use Electron's `Notification` API
    - Test notifications appear in KDE Plasma
    - Verify notification actions work
    - _Requirements: 5.2_

  - [ ] 6.4 Update desktop entry for KDE
    - Modify `Zalo.desktop` file
    - Follow XDG Desktop Entry Specification
    - Set correct `Exec`, `Icon`, `Categories`
    - Add `MimeType` and `StartupWMClass`
    - _Requirements: 5.5_

- [ ] 7. Debug and fix message synchronization
  - [ ] 7.1 Add comprehensive logging to sync service
    - Identify message sync service in deobfuscated code
    - Add logging for connection status, sync attempts, errors
    - Log WebSocket connection state
    - _Requirements: 4.3, 4.4_
    - _Note: Moved from Phase 3 - requires deobfuscated code_

  - [ ] 7.2 Test and identify root cause
    - Run app with logging enabled
    - Attempt to sync messages
    - Analyze logs to identify failure point
    - Check if it's server-side, client-side, or network issue
    - _Requirements: 4.3, 4.4_

  - [ ] 7.3 Implement fix based on root cause
    - If WebSocket issue: Fix connection logic
    - If database issue: Fix IndexedDB/SQLite sync
    - If authentication issue: Fix token handling
    - If server-side issue: Implement workaround or document limitation
    - _Requirements: 4.3, 4.4_

  - [ ] 7.4 Verify message sync works
    - Test sending messages from desktop
    - Test receiving messages on desktop
    - Test sync after offline period
    - Verify no duplicate messages
    - _Requirements: 4.3, 4.4, 11.2_

- [ ] 8. Update Electron version
  - [ ] 16.1 Test with Electron v28.x LTS
    - Update `package.json` to Electron v28.x
    - Run `npm install`
    - Test application launch
    - Test core functionality (messaging, file upload, sync)
    - Document any breaking changes
    - _Requirements: 2.1, 2.3, 2.4_

  - [ ] 16.2 Test with Electron v31.x LTS
    - Update `package.json` to Electron v31.x
    - Run `npm install`
    - Test application launch
    - Test core functionality
    - Compare with v28.x results
    - _Requirements: 2.1, 2.3, 2.4_
  
  - [ ] 12.3 Choose Electron version and fix breaking changes
    - Select v31.x if viable, otherwise v28.x
    - Fix any breaking changes in code
    - Update Electron-specific APIs if needed
    - Verify all features work
    - _Requirements: 2.1, 2.3, 2.4_

- [ ] 9. Update npm dependencies
  - [ ] 16.1 Create axios wrapper for request migration
    - Create `lib/request-wrapper.js`
    - Implement wrapper to mimic `request` API using `axios`
    - Test wrapper with sample requests
    - _Requirements: 2.2, 2.3_
  
  - [ ] 16.2 Update package.json dependencies
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
  
  - [ ] 12.3 Run npm install and fix breaking changes
    - Run `npm install`
    - Fix any breaking changes from updated dependencies
    - Replace `request` calls with axios wrapper
    - Test application after each major change
    - _Requirements: 2.3, 2.4_
  
  - [ ] 10.4 Verify core functionality after updates
    - Test messaging (send, receive, read receipts)
    - Test file upload and download
    - Test message sync
    - Test all major features
    - _Requirements: 2.5, 11.1, 11.2, 11.3_


- [ ] 10. Implement privacy controls
  - [ ] 16.1 Create Privacy Manager module
    - Create `lib/PrivacyManager.js`
    - Implement settings storage (Electron store)
    - Implement Sentry initialization (disabled by default)
    - Implement local error logger
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 16.2 Add Privacy settings UI
    - Add "Privacy" tab in Settings
    - Add Sentry opt-in toggle (disabled by default)
    - Add warning popup when enabling Sentry
    - Store user preference
    - _Requirements: 3.1, 3.5, 3.6_
  
  - [ ] 12.3 Implement local error logging
    - Create `LocalErrorLogger` class
    - Log errors to file (minimal: error message only)
    - Implement log rotation (keep file size manageable)
    - _Requirements: 3.3_
  
  - [ ] 10.4 Test privacy controls
    - Verify Sentry is disabled by default
    - Test enabling Sentry via settings
    - Verify local logging works
    - Verify no personal data in logs
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 11. Implement Content Security Policy
  - [ ] 16.1 Add CSP headers
    - Implement CSP in main process
    - Set strict policy with Zalo API whitelist
    - Allow `'unsafe-inline'` for React
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 16.2 Add CSP violation logging (dev only)
    - Add event listener for CSP violations
    - Log violations in development mode only
    - Send to local logger
    - _Requirements: 8.4_
  
  - [ ] 12.3 Test CSP with core features
    - Test messaging works with CSP
    - Test file upload works with CSP
    - Test message sync works with CSP
    - Relax policy if needed for functionality
    - _Requirements: 8.3, 11.1, 11.2, 11.3_

- [ ] 12. Harden installation script for Fedora
  - [ ] 16.1 Update install.sh for Fedora
    - Use `dnf` for Python dependencies
    - Install `python3-pystray` and `python3-pillow` via dnf
    - Remove `--break-system-packages` flag
    - _Requirements: 5.4, 6.1, 6.2_
  
  - [ ] 16.2 Add Electron checksum verification
    - Download SHASUMS256.txt from GitHub releases
    - Verify Electron zip checksum before extraction
    - Exit with error if checksum mismatch
    - _Requirements: 6.2_
  
  - [ ] 12.3 Use secure temporary directories
    - Use `mktemp -d` for temp directories
    - Clean up temp files after installation
    - _Requirements: 6.4_
  
  - [ ] 12.4 Minimize sudo usage
    - Only use sudo for chrome-sandbox permissions
    - Document why sudo is needed
    - _Requirements: 6.3_
  
  - [ ] 12.5 Test installation script
    - Test on clean Fedora KDE Plasma 42 system
    - Verify all dependencies install correctly
    - Verify app launches after installation
    - _Requirements: 5.3, 5.6, 5.7, 5.8_

- [ ] 13. Disable auto-update mechanism
  - [ ] 16.1 Disable built-in auto-updater
    - Locate auto-updater code in main process
    - Disable automatic update checks
    - Remove update notifications
    - _Requirements: None (user request)_
  
  - [ ] 16.2 Implement manual update check (optional)
    - Add "Check for Updates" in Help menu
    - Check GitHub releases for new version
    - Notify user if update available
    - Provide download link (no auto-install)
    - _Requirements: None (user request)_

- [ ] 14. Create documentation
  - [ ] 16.1 Create SECURITY.md
    - Document security measures implemented
    - Document vulnerability fixes
    - Document privacy controls
    - Document CSP implementation
    - _Requirements: 2.6, 10.1, 10.2, 10.3_
  
  - [ ] 16.2 Update README.md
    - Add installation instructions for Fedora
    - Add building from source instructions
    - Add troubleshooting section
    - Add known issues section
    - Document privacy controls
    - Add credits to VNG Corp (trademarks only)
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 16.3 Create CHANGELOG.md
    - Document all changes made
    - Document bug fixes (Wayland, message sync)
    - Document security updates
    - Document new features (privacy controls, KDE integration)
    - _Requirements: 10.2_
  
  - [ ] 16.4 Update LICENSE with friendly disclaimer
    - State no affiliation with VNG Corp/Zalo
    - Use friendly, non-threatening language
    - Credit VNG Corp for trademarks
    - Maintain welcoming tone
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 15. Comprehensive testing
  - [ ] 16.1 Test all core features
    - Test messaging (send, receive, read receipts)
    - Test file upload and download
    - Test message sync across devices
    - Test voice/video calls (if possible)
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [ ] 16.2 Test Wayland and X11 compatibility
    - Test window controls on Wayland
    - Test window controls on X11
    - Test system tray on both
    - Test notifications on both
    - _Requirements: 4.5, 5.6_
  
  - [ ] 16.3 Test privacy controls
    - Verify Sentry disabled by default
    - Test enabling/disabling Sentry
    - Verify local logging works
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [ ] 16.4 Test installation and uninstallation
    - Test fresh installation on Fedora
    - Test application launch after install
    - Test uninstallation (clean removal)
    - _Requirements: 5.3, 5.7, 5.8_
  
  - [ ] 15.5 Fix any bugs discovered during testing
    - Document bugs found
    - Fix critical bugs
    - Test fixes
    - _Requirements: 11.7_

- [ ] 16. Final polish and delivery
  - [ ] 16.1 Clean up codebase
    - Remove debug logging
    - Remove commented-out code
    - Ensure code formatting is consistent
    - _Requirements: All_
  
  - [ ] 16.2 Verify all documentation is complete
    - Review SECURITY.md
    - Review README.md
    - Review CHANGELOG.md
    - Review LICENSE
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ] 16.3 Create final backup
    - Backup modified files
    - Document changes made
    - _Requirements: None_
  
  - [ ] 16.4 Final installation test
    - Install on clean Fedora system
    - Test all features one final time
    - Verify no errors in console
    - _Requirements: All_

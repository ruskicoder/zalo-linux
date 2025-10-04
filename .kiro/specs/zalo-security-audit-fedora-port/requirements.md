# Requirements Document

## Introduction

This document outlines the requirements for conducting a comprehensive security audit, modernization, and Fedora KDE Plasma 42 optimization of the Zalo Linux port. The project involves analyzing and deobfuscating the codebase, updating outdated dependencies, fixing broken features (Wayland window controls, message sync), implementing privacy controls, and ensuring seamless operation on Fedora KDE Plasma 42.

The current application is a MacOS Zalo client ported to Linux using Electron v22.3.27 with minified/compiled code. Critical issues include:
- Outdated Electron and npm dependencies with known CVEs
- Minified JavaScript code that needs reverse engineering
- Broken Wayland window controls (minimize, maximize, close, titlebar)
- Non-functional message synchronization
- Always-on telemetry (Sentry) without user consent
- Insecure installation scripts

**Project Priorities:**
1. Maintain core functionality (messaging, file upload, message sync)
2. Full modernization with security updates
3. Fedora KDE Plasma 42 compatibility
4. Code deobfuscation for maintainability
5. Fast delivery (few days) with quality

**MVP Scope:** Install script (build from source) with KDE Plasma integration
**Future Scope:** Flatpak, RPM packages, multi-distro support

## Requirements

### Requirement 1: Code Deobfuscation and Reverse Engineering

**User Story:** As a developer maintaining this codebase, I want the minified/compiled JavaScript code deobfuscated into readable source code, so that I can understand, modify, and maintain the application effectively.

#### Acceptance Criteria

1. WHEN main-dist/ and pc-dist/ directories are analyzed THEN the system SHALL identify all minified JavaScript files
2. WHEN minified code is processed THEN the system SHALL deobfuscate/beautify the code into readable format
3. WHEN deobfuscation is complete THEN the system SHALL create a new source-code/ directory with organized, readable code
4. WHEN source code is extracted THEN the system SHALL preserve the original minified code in its current location
5. WHEN tracking code is found THEN the system SHALL document all telemetry endpoints and data collection mechanisms
6. WHEN the reverse engineering is complete THEN the system SHALL generate a code structure documentation
7. IF deobfuscation reveals proprietary algorithms THEN the system SHALL document them without violating license terms

### Requirement 2: Security Vulnerability Assessment and Remediation

**User Story:** As a security-conscious user, I want the application updated to use secure, modern dependencies, so that my data and system remain protected from known vulnerabilities.

#### Acceptance Criteria

1. WHEN Electron version is evaluated THEN the system SHALL upgrade to Electron v28.x LTS or v31.x LTS based on compatibility testing
2. WHEN npm packages are updated THEN the system SHALL replace deprecated `request` package with `axios`
3. WHEN security updates are applied THEN the system SHALL update to latest compatible versions:
   - `ajv` to v8.x
   - `tough-cookie` to v4.x
   - `crypto-js` to latest stable
   - `adm-zip` to v0.5.x or secure alternative
   - `js-yaml` to v4.x
   - `node-fetch` to v3.x
   - `glob` to v10.x
4. WHEN breaking changes occur THEN the system SHALL refactor affected code to maintain functionality
5. WHEN updates are complete THEN the system SHALL verify core features work (messaging, file upload, sync)
6. WHEN security audit is complete THEN the system SHALL generate a vulnerability report and SECURITY.md document

### Requirement 3: Privacy Controls and Telemetry Management

**User Story:** As a privacy-focused user, I want control over telemetry and tracking, so that I can decide what data is shared with third parties.

#### Acceptance Criteria

1. WHEN Sentry telemetry is configured THEN the system SHALL disable it by default
2. WHEN the application starts THEN the system SHALL provide a settings option to enable Sentry error reporting (opt-in)
3. WHEN Sentry is disabled THEN the system SHALL implement local-only error logging as fallback
4. WHEN Google Cloud dependencies are analyzed THEN the system SHALL document their purpose and data flow
5. WHEN privacy settings are changed THEN the system SHALL persist user preferences
6. WHEN the application is installed THEN the system SHALL display a privacy notice explaining data collection options

### Requirement 4: Critical Bug Fixes

**User Story:** As a Wayland user on Fedora KDE Plasma 42, I want proper window controls and message synchronization, so that I can use the application effectively.

#### Acceptance Criteria

1. WHEN the application runs on Wayland THEN the system SHALL display functional window controls (minimize, maximize, close)
2. WHEN the application runs on Wayland THEN the system SHALL display a proper titlebar
3. WHEN messages are sent/received THEN the system SHALL synchronize messages across devices
4. WHEN message sync is tested THEN the system SHALL verify real-time synchronization works
5. WHEN window controls are implemented THEN the system SHALL support both X11 and Wayland protocols
6. WHEN bugs are fixed THEN the system SHALL document the root cause and solution in CHANGELOG

### Requirement 5: Fedora KDE Plasma 42 Optimization

**User Story:** As a Fedora KDE Plasma 42 user, I want native desktop integration and seamless installation, so that Zalo feels like a first-class KDE application.

#### Acceptance Criteria

1. WHEN the application is launched THEN the system SHALL integrate with KDE Plasma system tray using native protocols
2. WHEN notifications are sent THEN the system SHALL use KDE Plasma notification system
3. WHEN the application is installed THEN the system SHALL use `dnf` to install system dependencies
4. WHEN Python dependencies are needed THEN the system SHALL use system package manager (`dnf install python3-pystray python3-pillow`)
5. WHEN desktop entry is created THEN the system SHALL follow XDG Desktop Entry Specification for KDE
6. WHEN the application runs THEN the system SHALL support both X11 and Wayland sessions
7. WHEN chrome-sandbox is configured THEN the system SHALL set correct permissions for Fedora security policies
8. WHEN the installation completes THEN the system SHALL verify all KDE integration features work

### Requirement 6: Installation Script Security Hardening

**User Story:** As a user running installation scripts, I want the scripts to follow security best practices, so that my system is not compromised during installation.

#### Acceptance Criteria

1. WHEN Python packages are installed THEN the system SHALL use system package manager instead of `pip --break-system-packages`
2. WHEN Electron is downloaded THEN the system SHALL verify SHA256 checksums against official releases
3. WHEN scripts use `sudo` THEN the system SHALL minimize privileged operations to only chrome-sandbox configuration
4. WHEN temporary files are created THEN the system SHALL use `mktemp -d` for secure temporary directories
5. WHEN user input is processed THEN the system SHALL validate and sanitize all inputs
6. WHEN file paths are constructed THEN the system SHALL prevent path traversal attacks
7. WHEN the installation script runs THEN the system SHALL provide clear progress feedback and error messages

### Requirement 7: System Tray Implementation Improvement

**User Story:** As a user, I want a secure and performant system tray implementation, so that the application integrates well with my desktop environment.

#### Acceptance Criteria

1. WHEN tray implementation is evaluated THEN the system SHALL compare Python (pystray) vs JavaScript/Node.js approaches
2. WHEN performance is measured THEN the system SHALL document startup time and memory usage for each approach
3. WHEN the decision is made THEN the system SHALL choose the implementation with best performance and compatibility
4. IF Python is chosen THEN the system SHALL refactor to use `subprocess.run()` instead of `os.system()`
5. IF JavaScript is chosen THEN the system SHALL implement tray using Electron's native tray API
6. WHEN the tray is implemented THEN the system SHALL support KDE Plasma StatusNotifierItem protocol
7. WHEN the tray menu is displayed THEN the system SHALL include options for: Open, Settings, About, Exit

### Requirement 8: Content Security Policy (CSP) Implementation

**User Story:** As a security-conscious user, I want the Electron application to have Content Security Policy enabled, so that it's protected against XSS and injection attacks without affecting normal usage.

#### Acceptance Criteria

1. WHEN CSP is implemented THEN the system SHALL define strict content security policies for Electron
2. WHEN CSP rules are configured THEN the system SHALL allow legitimate Zalo API endpoints
3. WHEN CSP is tested THEN the system SHALL verify core features work (messaging, file upload, sync)
4. WHEN CSP blocks a request THEN the system SHALL log the violation for debugging
5. WHEN CSP is active THEN the system SHALL prevent inline script execution except where explicitly needed
6. WHEN CSP configuration is complete THEN the system SHALL document the policy in SECURITY.md

### Requirement 9: Legal Compliance and Disclaimer

**User Story:** As the project maintainer, I want clear legal disclaimers, so that users understand this is an unofficial port with no affiliation to VNG Corp or Zalo.

#### Acceptance Criteria

1. WHEN LICENSE file is created THEN the system SHALL include a disclaimer stating no affiliation with VNG Corp or Zalo
2. WHEN disclaimer is written THEN the system SHALL use respectful, non-threatening language
3. WHEN README is updated THEN the system SHALL clearly state this is an unofficial community port
4. WHEN disclaimer is displayed THEN the system SHALL inform users that the maintainer is not responsible for breaking changes
5. WHEN legal notices are complete THEN the system SHALL ensure they comply with open source licensing requirements

### Requirement 10: Documentation and Transparency

**User Story:** As a user of this application, I want clear documentation about security measures, features, and known issues, so that I can make informed decisions.

#### Acceptance Criteria

1. WHEN SECURITY.md is created THEN the system SHALL document all security measures, vulnerability fixes, and reporting procedures
2. WHEN CHANGELOG.md is updated THEN the system SHALL document all changes, fixes, and breaking changes
3. WHEN README.md is updated THEN the system SHALL document installation, features, known issues, and troubleshooting
4. WHEN privacy controls are implemented THEN the system SHALL document telemetry options in README
5. WHEN known issues exist THEN the system SHALL document them with severity levels and workarounds
6. WHEN code structure is documented THEN the system SHALL create ARCHITECTURE.md explaining the deobfuscated codebase


### Requirement 11: Core Feature Validation and Testing

**User Story:** As a Zalo user, I want all critical features to work reliably after updates, so that I can communicate effectively without interruption.

#### Acceptance Criteria

1. WHEN the application is tested THEN the system SHALL verify messaging functionality works (send, receive, read receipts)
2. WHEN file upload is tested THEN the system SHALL verify files can be uploaded and downloaded successfully
3. WHEN message sync is tested THEN the system SHALL verify messages synchronize across devices in real-time
4. WHEN voice/video calls are tested THEN the system SHALL attempt to verify call functionality (best effort)
5. WHEN any security measure is implemented THEN the system SHALL NOT break messaging, file upload, or message sync
6. WHEN testing is complete THEN the system SHALL document which features work, which are broken, and which are untested
7. WHEN a critical feature breaks THEN the system SHALL revert the change that caused the breakage
8. WHEN the application launches THEN the system SHALL perform a smoke test of core features

### Requirement 12: Future Packaging Strategy

**User Story:** As a Linux user, I want multiple installation options, so that I can choose the method that best fits my system and preferences.

#### Acceptance Criteria

1. WHEN MVP is delivered THEN the system SHALL provide a working install script (build from source)
2. WHEN future packaging is planned THEN the system SHALL document roadmap for Flatpak, RPM, and AppImage
3. WHEN packaging formats are designed THEN the system SHALL ensure compatibility across Debian-based and RPM-based distributions
4. WHEN Flatpak is considered THEN the system SHALL evaluate sandboxing implications for Zalo functionality
5. WHEN RPM package is planned THEN the system SHALL follow Fedora packaging guidelines
6. WHEN AppImage is considered THEN the system SHALL ensure portability across distributions
7. WHEN packaging documentation is created THEN the system SHALL include build instructions for each format

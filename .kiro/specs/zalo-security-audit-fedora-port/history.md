# Development History

## Methodology

This project follows an **Agile Iterative Development** approach with three main phases:
1. **PLAN** - Requirements gathering and refinement
2. **DESIGN** - Architecture and technical design
3. **IMPLEMENT** - Code implementation and testing

We can jump between phases as needed for quick fixes or hotfixes. All phase transitions and significant changes are logged below.

---

## History Log

### Session 1 - Initial Planning Phase
**Date:** 2025-10-05  
**Phase:** PLAN  
**Status:** ✅ Completed

**Activities:**
- Created initial requirements document
- Identified critical security issues:
  - Electron v22.3.27 (outdated, 2+ years old)
  - 10+ npm packages with known CVEs
  - Sentry/Google Cloud telemetry
  - Insecure installation scripts
  - Python code using `os.system()`
- Identified critical bugs:
  - Wayland window controls missing
  - Message sync not working
- Created questionnaire for requirements refinement
- User provided detailed answers

**Key Decisions:**
- Priority: Full modernization + Fedora compatibility
- Electron: Update to v28.x or v31.x LTS
- Privacy: Sentry disabled by default (opt-in)
- Packaging: MVP = install script, future = Flatpak/RPM/AppImage
- Critical features: Messaging, file upload, message sync MUST work
- Timeline: ASAP (few days) but done right

**Deliverables:**
- ✅ requirements.md (12 requirements with EARS format)
- ✅ questions.md (user responses)
- ✅ Uninstalled existing Zalo installation

**Next Phase:** DESIGN

---

### Session 2 - Design Phase
**Date:** 2025-10-05  
**Phase:** DESIGN  
**Status:** ✅ Completed

**Activities:**
- Analyzed codebase structure (Zalo/Zalo/app/)
- Identified minified code in main-dist/ and pc-dist/
- Designed comprehensive architecture for all 12 requirements
- Created detailed component designs:
  - Code Deobfuscation Module
  - Dependency Update Module (Electron v28/v31, axios, etc.)
  - Privacy Control Module (Sentry opt-in)
  - Wayland Window Controls Fix
  - Message Sync Fix
  - Fedora KDE Plasma Integration
  - Installation Script Hardening
  - Content Security Policy Implementation

**Key Design Decisions:**
- Electron: v28.x LTS (primary), v31.x LTS (fallback)
- Replace `request` with `axios`
- System tray: Electron native API (not Python)
- Privacy: Sentry disabled by default, local logging always on
- CSP: Strict policy with Zalo API whitelist
- Installation: System package manager for Python deps, checksum verification

**Deliverables:**
- ✅ design.md (comprehensive technical design)
- ✅ Architecture diagrams
- ✅ Component specifications
- ✅ Implementation phases (6 days)
- ✅ Risk mitigation strategies

**Next Phase:** IMPLEMENT (Task List Creation)

---

### Session 3 - Task List Creation
**Date:** 2025-10-05  
**Phase:** DESIGN → TASKS  
**Status:** ✅ Completed

**Activities:**
- Created design clarification questionnaire (18 sections, 50+ questions)
- User provided detailed answers for all design decisions
- Refined design based on user feedback
- Created comprehensive implementation task list

**Key User Decisions:**
- **Deobfuscation**: Hybrid approach (automated + manual), prioritize main.js and modified files
- **Electron**: Test both v28 and v31, prefer v31 if viable, maximize compatibility
- **Dependencies**: Use axios wrapper for backward compatibility
- **Wayland**: Try native frame first, custom titlebar (Zalo design + system theme option) as fallback
- **Message Sync**: Check server-side first, then deep dive into WebSocket/network layer
- **System Tray**: Electron native (remove Python), simple menu (Open, Tray Settings, Exit)
- **Privacy**: Sentry in Settings > Privacy (disabled by default), minimal local logging
- **CSP**: Relax if needed for functionality, dev-only violation logging
- **Installation**: dnf for Fedora MVP, checksum verification from GitHub
- **Testing**: Manual testing, install/test/uninstall cycle
- **Priority**: Wayland → KDE Integration → Message Sync → Security Updates
- **Timeline**: 6 days, milestone-based check-ins
- **Auto-update**: Disable completely, manual updates only
- **Legal**: Friendly disclaimer, no threatening language, credit VNG for trademarks

**Deliverables:**
- ✅ design-questions.md (18 sections, user responses)
- ✅ tasks.md (15 top-level tasks, 60+ sub-tasks)
- ✅ 9 implementation phases
- ✅ Priority-based task ordering

**Task Breakdown:**
- Phase 1: Environment Setup (2 tasks)
- Phase 2: Wayland + KDE Integration (2 tasks, 8 sub-tasks)
- Phase 3: Message Sync Fix (1 task, 4 sub-tasks)
- Phase 4: Code Deobfuscation (1 task, 3 sub-tasks)
- Phase 5: Electron + Dependencies (2 tasks, 7 sub-tasks)
- Phase 6: Privacy + Security (2 tasks, 7 sub-tasks)
- Phase 7: Installation Hardening (2 tasks, 7 sub-tasks)
- Phase 8: Documentation (1 task, 4 sub-tasks)
- Phase 9: Testing + Polish (2 tasks, 9 sub-tasks)

**Next Phase:** EXECUTE (Begin implementation)

---

## Phase Transition Rules

### When to Return to PLAN
- New requirements discovered during implementation
- Critical feature conflicts with security measures
- User requests scope changes

### When to Return to DESIGN
- Implementation reveals architectural issues
- Better technical approach discovered
- Breaking changes require redesign

### Quick Fix Protocol
- Small fixes (< 30 min): Document in current phase
- Medium fixes (30 min - 2 hours): Create sub-session entry
- Major fixes (> 2 hours): Return to appropriate phase

### Hotfix Protocol
- Critical bugs blocking progress: Immediate fix, log in history
- Security vulnerabilities: Immediate fix, update SECURITY.md
- Broken core features: Stop current work, fix, then resume

---

## Metrics Tracking

| Metric | Target | Current |
|--------|--------|---------|
| Requirements Completed | 12 | 0 |
| Core Features Working | 3 (msg, file, sync) | 0 |
| Security Issues Fixed | ~15 | 0 |
| Electron Version | v28.x or v31.x | v22.3.27 |
| Test Coverage | Smoke + Functional | 0% |

---

## Notes

- All phase transitions must be logged here
- Include date, phase, status, activities, and decisions
- Link to relevant commits/files when applicable
- Keep entries concise but informative

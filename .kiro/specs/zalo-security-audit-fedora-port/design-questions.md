# Design Review - Clarification Questions

Please answer the following questions to refine the technical design. Add your answers below each question.

---

## 1. Code Deobfuscation Strategy

**Q1.1:** The design proposes using `js-beautify` and `esprima` for deobfuscation. Are you comfortable with:
- [ ] A) Automated deobfuscation (faster but may miss context)
- [ ] B) Manual analysis of critical sections (slower but more accurate)
- [ ] C) Hybrid approach (automated + manual review)

**Your Answer:**C


**Q1.2:** Should we prioritize deobfuscating specific files first?
- [ ] A) main-dist/main.js (main process - critical)
- [ ] B) pc-dist/ files (renderer - UI/messaging)
- [ ] C) All files equally
- [ ] D) Only files we need to modify

**Your Answer:**A, B, D


**Q1.3:** What should we do if deobfuscation reveals proprietary algorithms or obfuscated intentionally?
- [ ] A) Document as-is without revealing details
- [ ] B) Reverse engineer and document fully
- [ ] C) Skip those sections

**Your Answer:**B


---

## 2. Electron Version Selection

**Q2.1:** The design recommends v28.x LTS as primary. Should we:
- [ ] A) Start with v28.x, only try v31.x if issues
- [ ] B) Test both v28.x and v31.x in parallel
- [ ] C) Go straight to v31.x (newer = better?)
- [ ] D) Stay on v22.x and manually patch vulnerabilities

**Your Answer:**B, if viable then C, maximize compatibility and ensure app function


**Q2.2:** If Electron update breaks critical features, what's the priority?
- [ ] A) Fix the code to work with new Electron (may take time)
- [ ] B) Revert to v22.x and document risks
- [ ] C) Try different Electron version
- [ ] D) Release with broken features and fix later

**Your Answer:**A


---

## 3. Dependency Migration - `request` to `axios`

**Q3.1:** The codebase likely has many `request` calls. Should we:
- [ ] A) Replace all at once (risky but clean)
- [ ] B) Create a wrapper function to minimize changes
- [ ] C) Replace incrementally, test each change
- [ ] D) Keep `request` for now, just update to latest patch

**Your Answer:**B


**Q3.2:** Example wrapper approach:
```javascript
// Old code: request(url, callback)
// New wrapper:
function request(url, callback) {
  axios.get(url)
    .then(response => callback(null, response, response.data))
    .catch(error => callback(error));
}
```
Is this acceptable or do you want native axios usage?

**Your Answer:**Either options is ok. Choose either regarding performance.


---

## 4. Wayland Window Controls Fix

**Q4.1:** The design proposes two solutions:
- **Option A:** Enable native frame (`frame: true`) - simple but may not match Zalo's design
- **Option B:** Custom titlebar with React component - matches design but more complex

Which approach should we take?

**Your Answer:**A first. if not working then B


**Q4.2:** Should the window controls solution work on both Wayland AND X11?
- [ ] Yes, must work on both
- [ ] Wayland priority, X11 can be different
- [ ] Separate implementations for each

**Your Answer:**Yes


**Q4.3:** If custom titlebar is chosen, should it match:
- [ ] A) KDE Breeze theme (native look)
- [ ] B) Original Zalo MacOS design
- [ ] C) Generic modern design
- [ ] D) User's system theme

**Your Answer:**B with options of D


---

## 5. Message Sync Debugging

**Q5.1:** Message sync is broken but we don't know why yet. How deep should we investigate?
- [ ] A) Add logging and see what happens (quick)
- [ ] B) Deep dive into WebSocket/network layer (thorough)
- [ ] C) Reverse engineer sync protocol (very thorough)
- [ ] D) Check if it's a server-side issue first

**Your Answer:**first D, then B, then C

**Q5.2:** If message sync requires server-side changes (which we can't control), should we:
- [ ] A) Document the issue and move on
- [ ] B) Try to find workarounds
- [ ] C) Contact Zalo/VNG for support (unlikely to help)
- [ ] D) Implement a different sync mechanism

**Your Answer:**B, if not plausible then A


**Q5.3:** Should we implement offline message queuing as part of the fix?
- [ ] Yes, queue messages when offline
- [ ] No, just fix the sync
- [ ] Only if time permits

**Your Answer:**No, keep as is, the main idea is to create a functioning port of Zalo into Linux.


---

## 6. System Tray Implementation

**Q6.1:** The design recommends Electron's native tray API instead of Python. Confirm this is acceptable?
- [ ] Yes, use Electron native (better performance)
- [ ] No, keep Python script (if it works, don't change it)
- [ ] Test both and decide

**Your Answer:**Yes


**Q6.2:** Should the tray icon show notification badges (unread message count)?
- [ ] Yes, implement badge counter
- [ ] No, just show icon
- [ ] Only if easy to implement

**Your Answer:**No


**Q6.3:** Tray menu items - which should we include?
- [ ] Open Zalo
- [ ] Settings
- [ ] About
- [ ] Check for Updates
- [ ] Toggle Notifications
- [ ] Exit
- [ ] Other: ___________

**Your Answer:**Open Zalo, Tray settings (only have 1 setting: Close button hides the app in system tray) and Exit


---

## 7. Privacy Controls UI

**Q7.1:** Where should the Sentry opt-in toggle be located?
- [ ] A) Settings > Privacy tab
- [ ] B) First-run welcome dialog
- [ ] C) Both (dialog + settings)
- [ ] D) Hidden in advanced settings

**Your Answer:**A, default is disabled


**Q7.2:** Should we show a privacy notice on first launch?
- [ ] Yes, explain data collection
- [ ] No, just have it in settings
- [ ] Only if Sentry is enabled

**Your Answer:**No, have it in settings only when sentry is enable, show a warning popup and confirmation and thats it.


**Q7.3:** What information should the local error logs contain?
- [ ] A) Everything (full stack traces, context)
- [ ] B) Minimal (error message only)
- [ ] C) Configurable by user
- [ ] D) No personal data (sanitized)

**Your Answer:**B


---

## 8. Content Security Policy (CSP)

**Q8.1:** The design proposes a strict CSP. If it breaks some features, should we:
- [ ] A) Relax the policy to allow the feature
- [ ] B) Fix the code to comply with strict CSP
- [ ] C) Make CSP configurable (not recommended)
- [ ] D) Disable CSP for that specific feature

**Your Answer:**A or D


**Q8.2:** Should CSP violations be logged?
- [ ] Yes, log all violations
- [ ] Yes, but only in development
- [ ] No, too noisy

**Your Answer:**Yes, dev only


**Q8.3:** The design allows `'unsafe-inline'` for React. Is this acceptable or should we:
- [ ] A) Keep it (React needs it)
- [ ] B) Use nonces for inline scripts (more secure but complex)
- [ ] C) Refactor to eliminate inline scripts

**Your Answer:**A


---

## 9. Installation Script Security

**Q9.1:** The design proposes using system package manager (`dnf`) for Python deps. Confirm this is acceptable?
- [ ] Yes, use dnf (cleaner)
- [ ] No, use pip with venv (more control)
- [ ] Offer both options

**Your Answer:**Yes. use dnf


**Q9.2:** Should the installation script support other distros beyond Fedora?
- [ ] Yes, support Debian/Ubuntu too (apt)
- [ ] Yes, support Arch (pacman)
- [ ] No, Fedora only for MVP
- [ ] Yes, but as separate scripts

**Your Answer:**Not yet. Fedora for MVP


**Q9.3:** Electron checksum verification - where should we get the official checksums?
- [ ] A) GitHub releases page (SHASUMS256.txt)
- [ ] B) Hardcode in script
- [ ] C) Download from official source
- [ ] D) Skip verification (not recommended)

**Your Answer:**A


---

## 10. Testing Approach

**Q10.1:** How should we test the application during development?
- [ ] A) Manual testing after each change
- [ ] B) Automated smoke tests
- [ ] C) Both manual and automated
- [ ] D) Test only at the end

**Your Answer:**A. You will install the app into the system, i test it, then uninstall it.


**Q10.2:** Should we create a test checklist document?
- [ ] Yes, detailed checklist
- [ ] Yes, simple checklist
- [ ] No, test ad-hoc

**Your Answer:**No


**Q10.3:** For message sync testing, do you have a test account we can use?
- [ ] Yes, I have test accounts
- [ ] No, use my main account
- [ ] We'll create test accounts

**Your Answer:**No. I will test using my account. if my account works then move on


---

## 11. Documentation

**Q11.1:** ARCHITECTURE.md for deobfuscated code - how detailed should it be?
- [ ] A) High-level overview only
- [ ] B) Detailed module documentation
- [ ] C) Full code documentation with diagrams
- [ ] D) Just comments in code

**Your Answer:**A,B, and D


**Q11.2:** Should we document the reverse engineering process?
- [ ] Yes, document methodology
- [ ] No, just document results
- [ ] Only if we find interesting things

**Your Answer:**Yes, but this is not the main task.


**Q11.3:** README.md - should it include:
- [ ] Installation instructions
- [ ] Building from source
- [ ] Troubleshooting
- [ ] Known issues
- [ ] Contributing guidelines
- [ ] All of the above

**Your Answer:**All of the above, but contributing goes to me (ruskicoder). VNG corps only credit for the trademarks for legal purposes


---

## 12. Legal and Licensing

**Q12.1:** The disclaimer should state no affiliation with VNG/Zalo. Should it also:
- [ ] A) Warn about potential ToS violations
- [ ] B) Disclaim warranty (use at your own risk)
- [ ] C) State it's for educational purposes
- [ ] D) All of the above

**Your Answer:**none of the above. The disclaimer should be friendly and do not aim users to not use the application.


**Q12.2:** Should we add a CONTRIBUTING.md for community contributions?
- [ ] Yes, encourage contributions
- [ ] No, keep it personal project
- [ ] Maybe later

**Your Answer:**No


---

## 13. Performance Considerations

**Q13.1:** Should we implement any performance optimizations?
- [ ] A) Yes, optimize startup time
- [ ] B) Yes, optimize memory usage
- [ ] C) Yes, optimize message loading
- [ ] D) No, focus on functionality first

**Your Answer:**D, just ensure the app works first.


**Q13.2:** Should we profile the application to find bottlenecks?
- [ ] Yes, use Chrome DevTools
- [ ] Yes, use Electron profiling tools
- [ ] No, not needed for MVP

**Your Answer:**No


---

## 14. Update Mechanism

**Q14.1:** The app has an auto-updater. Should we:
- [ ] A) Keep it as-is
- [ ] B) Update to use our own update server
- [ ] C) Disable auto-update (manual updates only)
- [ ] D) Implement GitHub releases-based updates

**Your Answer:**C, because they do not have updates for the Linux distros. WE have. And D


**Q14.2:** Should updates be:
- [ ] Automatic (download and install)
- [ ] Notify user, let them choose
- [ ] Manual check only

**Your Answer:**Manual, preferrably no updates popup or no reminders.


---

## 15. Additional Features

**Q15.1:** Should we add any features not in the original requirements?
Examples:
- Dark mode toggle
- Custom themes
- Keyboard shortcuts customization
- Multi-account support
- Other: ___________

**Your Answer:**Dark mode is already available in the ZaloZaDark version of the app, no need. For MVP, custom themes and multi-account not yet. keyboard shortcuts optimization not needed. 


**Q15.2:** Should we fix any other bugs we discover during development?
- [ ] Yes, fix all bugs found
- [ ] Only if they're critical
- [ ] Document but don't fix (out of scope)

**Your Answer:**Yes


---

## 16. Timeline and Priorities

**Q16.1:** The design proposes 6 days. Is this realistic given "ASAP but do it right"?
- [ ] Yes, 6 days is fine
- [ ] No, need more time (how many days?: ___)
- [ ] No, need less time (how many days?: ___)

**Your Answer:**Yes


**Q16.2:** If we run out of time, what should we prioritize?
Rank these 1-5 (1 = highest priority):
- [ ] ___ Wayland window controls fix
- [ ] ___ Message sync fix
- [ ] ___ Security updates (Electron, deps)
- [ ] ___ Privacy controls (Sentry opt-in)
- [ ] ___ KDE integration (tray, notifications)

**Your Answer:**Wayland, KDE, then message sync. get the app working first. then security later.


**Q16.3:** Should we do daily check-ins to track progress?
- [ ] Yes, daily updates
- [ ] Every 2 days
- [ ] Only when major milestones complete

**Your Answer:**Only when major milestones complete


---

## 17. Backup and Rollback

**Q17.1:** Should we create backups before making changes?
- [ ] Yes, backup entire codebase
- [ ] Yes, backup only modified files
- [ ] No, git is enough

**Your Answer:**Yes, backup only modified files, delete the temp files after confirmed working


**Q17.2:** Should we create a rollback script in case something breaks?
- [ ] Yes, automated rollback
- [ ] Yes, manual rollback instructions
- [ ] No, just use git revert

**Your Answer:**Normally, i do not commit code until the code runs, so Yes, manual/rollback either is fine


---

## 18. Community and Support

**Q18.1:** Should we create a GitHub Issues template?
- [ ] Yes, for bug reports
- [ ] Yes, for feature requests
- [ ] Yes, for both
- [ ] No

**Your Answer:**No need. Quick fix


**Q18.2:** Should we set up a discussion forum or Discord?
- [ ] Yes, Discord server
- [ ] Yes, GitHub Discussions
- [ ] No, just GitHub Issues

**Your Answer:**No


---

## Instructions

Please fill in your answers above and save this file. Let me know when you're done, and I'll refine the design based on your responses.

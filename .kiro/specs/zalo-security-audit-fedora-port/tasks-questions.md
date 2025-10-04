# Task List Review - Clarification Questions

Please answer the following questions to refine the implementation tasks. Add your answers below each question.

---

## 1. Task Ordering and Dependencies

**Q1.1:** The current task order is: Setup → Wayland/KDE → Message Sync → Deobfuscation → Electron/Deps → Privacy → Installation → Docs → Testing. Is this order acceptable?
- [ ] Yes, this order makes sense
- [ ] No, I want different order (specify below)

**Your Answer:** The testing phase is embedded in each task. the final testing task is to ensure ALL implemented features works. Also after Wayland/KDE or Message Sync, package it into a "Pre-development MVP" version, which is a version that is already compatible with Fedora linux, other future version is only for reverse engineering and fix security issues, which is the hard part. You could consider tasks upto message sync as MVP release.


**Q1.2:** Should we do deobfuscation BEFORE or AFTER fixing bugs?
- [ ] A) Before (understand code first, then fix)
- [ ] B) After (fix bugs first, deobfuscate later)
- [ ] C) In parallel (deobfuscate as needed for fixes)

**Your Answer:**A


---

## 2. Wayland Window Controls (Task 3)

**Q2.1:** Task 3.2 tries native frame first. If it works, should we skip custom titlebar entirely?
- [ ] Yes, skip custom titlebar if native works
- [ ] No, implement both and let user choose
- [ ] Implement custom titlebar anyway for consistency

**Your Answer:**Yes. For MVP. But after the MVP release do consider to implement both


**Q2.2:** How much time should we spend on custom titlebar if native frame fails?
- [ ] A) 2-4 hours (simple implementation)
- [ ] B) 4-8 hours (polished implementation)
- [ ] C) 8+ hours (perfect implementation)
- [ ] D) As long as it takes

**Your Answer:**C, D


---

## 3. KDE Integration (Task 4)

**Q3.1:** Task 4.1 removes Python tray. Should we keep Python as fallback if Electron tray fails?
- [ ] Yes, keep Python as fallback
- [ ] No, Electron tray must work
- [ ] Only if Electron tray has issues

**Your Answer:**Only if Electron tray has issues, if too complex then Yes, keep Python as fallback


**Q3.2:** "Tray Settings" menu item - what settings should it include?
Currently planned: "Close button hides to tray"
Other options:
- [ ] Start minimized to tray
- [ ] Show notification badges
- [ ] Tray icon style
- [ ] Other: ___________

**Your Answer:**For MVP, just the option Close button hides to tray, future development will have Tray icon style and Show notification badges


---

## 4. Message Sync (Task 5)

**Q4.1:** Task 5.2 says "check if it's server-side issue first". How do we check this?
- [ ] A) Test with official Zalo Windows/Mac client
- [ ] B) Analyze network traffic
- [ ] C) Check Zalo server status
- [ ] D) All of the above

**Your Answer:**B, or check if the client actually sends the request


**Q4.2:** If message sync is a server-side issue we can't fix, should we:
- [ ] A) Document it and move on (as planned)
- [ ] B) Implement a workaround (polling, manual refresh)
- [ ] C) Contact Zalo support (unlikely to help)
- [ ] D) Give up on this feature

**Your Answer:**A and D


**Q4.3:** How will we test message sync without multiple devices?
- [ ] A) Use web.zalo.me in browser
- [ ] B) Use mobile app
- [ ] C) Use another computer
- [ ] D) Other: ___________

**Your Answer:**I have multiple devices, also use chat.zalo.me in browser for fallback. i will test manually.


---

## 5. Code Deobfuscation (Task 6)

**Q5.1:** Task 6 deobfuscates main.js and pc-dist files. Should we deobfuscate ALL files or just what we need?
- [ ] A) All files (complete but time-consuming)
- [ ] B) Only files we modify (efficient)
- [ ] C) Main files + files related to bugs (balanced)

**Your Answer:**B and C


**Q5.2:** Should deobfuscation be a separate deliverable or just internal documentation?
- [ ] A) Separate deliverable (commit to source-code/)
- [ ] B) Internal only (don't commit)
- [ ] C) Optional (only if time permits)

**Your Answer:**A but not a high priority. so if time not permits then just internal documentation, but still commit the documentation.


---

## 6. Electron Update (Task 7)

**Q6.1:** Task 7 tests both v28 and v31. Should we test them sequentially or in parallel?
- [ ] A) Sequential (v28 first, then v31)
- [ ] B) Parallel (test both at same time)
- [ ] C) v31 only (skip v28)

**Your Answer:**A


**Q6.2:** If both v28 and v31 have issues, should we:
- [ ] A) Stay on v22 and patch manually
- [ ] B) Try other versions (v29, v30, v32)
- [ ] C) Fix the code to work with v31
- [ ] D) Document issues and proceed

**Your Answer:**A first. If the security issues is too big then try C, if C not working then D and A


**Q6.3:** How much time should we allocate for fixing Electron breaking changes?
- [ ] A) 2-4 hours
- [ ] B) 4-8 hours
- [ ] C) 8-16 hours
- [ ] D) As long as needed

**Your Answer:**D


---

## 7. Dependency Updates (Task 8)

**Q7.1:** Task 8.1 creates axios wrapper. Should we also create wrappers for other updated deps?
- [ ] Yes, create wrappers for all breaking changes
- [ ] No, only axios wrapper
- [ ] Only if needed

**Your Answer:**Yes, and only if needed


**Q7.2:** Should we update dependencies all at once or incrementally?
- [ ] A) All at once (faster but riskier)
- [ ] B) One by one (slower but safer)
- [ ] C) In groups (balanced)

**Your Answer:**B and C


**Q7.3:** If a dependency update breaks something critical, should we:
- [ ] A) Revert that specific dependency
- [ ] B) Fix the code to work with new version
- [ ] C) Find alternative package
- [ ] D) Skip that dependency for now

**Your Answer:**B, if not working or too complex then C, then A and D


---

## 8. Privacy Controls (Task 9)

**Q8.1:** Task 9.2 adds Privacy tab in Settings. Where is Settings currently located?
- [ ] A) I know where it is
- [ ] B) Need to find it first
- [ ] C) Create new Settings window if doesn't exist

**Your Answer:**B


**Q8.2:** Local error logger (Task 9.3) - where should logs be stored?
- [ ] A) `~/.local/share/Zalo/logs/`
- [ ] B) `~/.config/Zalo/logs/`
- [ ] C) User's home directory
- [ ] D) Other: ___________

**Your Answer:**A


**Q8.3:** Should error logs be viewable from within the app?
- [ ] Yes, add "View Logs" button in Settings
- [ ] No, user can open file manually
- [ ] Only in development mode

**Your Answer:**No. Avoid full app tampering to add buttons in the first few phases,user can open file manually, get it to work first.


---

## 9. Content Security Policy (Task 10)

**Q9.1:** Task 10.3 says "relax policy if needed". What's the threshold for relaxing?
- [ ] A) Any feature breaks → relax
- [ ] B) Critical feature breaks → relax
- [ ] C) Try to fix code first, relax only if impossible

**Your Answer:**A


**Q9.2:** Should CSP be configurable by user?
- [ ] Yes, add CSP toggle in Settings
- [ ] No, hardcoded policy
- [ ] Only in development mode

**Your Answer:**Development mode. Can be turned off fully.


---

## 10. Installation Script (Task 11)

**Q10.1:** Task 11.1 uses dnf for Python deps. What if dnf doesn't have the packages?
- [ ] A) Fall back to pip
- [ ] B) Build from source
- [ ] C) Document as requirement
- [ ] D) Other: ___________

**Your Answer:**A


**Q10.2:** Should installation script support uninstallation too?
- [ ] Yes, create uninstall.sh
- [ ] No, manual uninstall instructions in README
- [ ] Add --uninstall flag to install.sh

**Your Answer:**Yes


**Q10.3:** Should we test installation on a VM or your actual system?
- [ ] VM (safer)
- [ ] Actual system (more realistic)
- [ ] Both

**Your Answer:**Actual system


---

## 11. Auto-Update Disable (Task 12)

**Q11.1:** Task 12.1 disables auto-updater. Should we completely remove the code or just disable it?
- [ ] A) Remove code completely
- [ ] B) Disable but keep code
- [ ] C) Comment out code

**Your Answer:**C and make the app work without auto-update.


**Q11.2:** Task 12.2 implements manual update check. Is this required or optional?
- [ ] Required
- [ ] Optional (nice to have)
- [ ] Skip entirely

**Your Answer:**Skip. User will go to the github page and download new package manually. or via git.


---

## 12. Documentation (Task 13)

**Q12.1:** How detailed should SECURITY.md be?
- [ ] A) Brief overview (1-2 pages)
- [ ] B) Detailed documentation (5+ pages)
- [ ] C) Comprehensive guide (10+ pages)

**Your Answer:**Balance between A and B


**Q12.2:** Should README include screenshots?
- [ ] Yes, add screenshots of app
- [ ] No, text only
- [ ] Only if easy to add

**Your Answer:**Only if easy to add, if possible instruct me


**Q12.3:** Should we document the deobfuscation process in ARCHITECTURE.md?
- [ ] Yes, detailed methodology
- [ ] Yes, brief overview
- [ ] No, just document results

**Your Answer:**Yes, detailed methodology, but in a separate file called REVERSE-ENGINEER.md. This is not prioritized.


---

## 13. Testing (Task 14)

**Q13.1:** Task 14.1 tests core features. Should we create a test script or manual checklist?
- [ ] A) Automated test script
- [ ] B) Manual checklist
- [ ] C) Both
- [ ] D) Neither (ad-hoc testing)

**Your Answer:** adhoc testing


**Q13.2:** How should we test voice/video calls?
- [ ] A) Test with another user
- [ ] B) Test with mobile app
- [ ] C) Skip if too difficult
- [ ] D) Other: ___________

**Your Answer:**C


**Q13.3:** Should we test on a clean Fedora install or your current system?
- [ ] Clean install (VM or separate partition)
- [ ] Current system
- [ ] Both

**Your Answer:**Current system


---

## 14. Bug Fixes (Task 14.5)

**Q14.1:** Task 14.5 says "fix any bugs discovered". What if we discover many bugs?
- [ ] A) Fix all bugs (may take extra time)
- [ ] B) Fix only critical bugs
- [ ] C) Document non-critical bugs for later
- [ ] D) Prioritize based on severity

**Your Answer:**D, B, and if unable to fix, C


**Q14.2:** Should we track bugs in a separate document?
- [ ] Yes, create BUGS.md
- [ ] No, just fix them
- [ ] Use GitHub Issues

**Your Answer:**Yes. but the BUGS.md is a temp file. All log records goes into history.md. When detect bugs, put them in the bugs md, when done fixing a bug, remove it from the bugs md. All record goes into history.md


---

## 15. Timeline and Milestones

**Q15.1:** The plan has 9 phases over 6 days. Should we set specific deadlines for each phase?
- [ ] Yes, set deadlines (e.g., Phase 1-2: Day 1-2)
- [ ] No, work at natural pace
- [ ] Set soft targets, not hard deadlines

**Your Answer:**Soft targets


**Q15.2:** What constitutes a "milestone" for check-ins?
- [ ] A) End of each phase
- [ ] B) End of each major task
- [ ] C) When something works (e.g., Wayland fix complete)
- [ ] D) Daily

**Your Answer:**C


**Q15.3:** If we fall behind schedule, what should we cut?
Rank these 1-5 (1 = cut first, 5 = keep at all costs):
- [ ] ___ Code deobfuscation
- [ ] ___ Privacy controls (Sentry opt-in)
- [ ] ___ CSP implementation
- [ ] ___ Documentation (SECURITY.md, etc.)
- [ ] ___ Manual update check feature

**Your Answer:**Any thing after Deobfuscation. So ensure Setup → Wayland/KDE → Message Sync is done, this is the MVP.


---

## 16. Task Granularity

**Q16.1:** Are the sub-tasks granular enough or should we break them down further?
- [ ] A) Current granularity is good
- [ ] B) Break down further (more sub-tasks)
- [ ] C) Combine some sub-tasks (less granular)

**Your Answer:**A


**Q16.2:** Should each sub-task have estimated time?
- [ ] Yes, add time estimates
- [ ] No, work at natural pace
- [ ] Only for major tasks

**Your Answer:**No, work at natural pace


---

## 17. Backup and Version Control

**Q17.1:** Task 15.3 creates final backup. Should we also backup at each phase?
- [ ] Yes, backup after each phase
- [ ] Yes, backup after each major task
- [ ] No, only final backup
- [ ] Git commits are enough

**Your Answer:**Git commits are enough


**Q17.2:** Should we use git branches for each phase?
- [ ] Yes, one branch per phase
- [ ] Yes, one branch per major task
- [ ] No, work on main branch
- [ ] Create feature branches as needed

**Your Answer:**No, work on main branch and Create feature branches as needed


---

## 18. Success Criteria

**Q18.1:** What defines "success" for this project?
- [ ] A) All tasks completed
- [ ] B) Core features work (Wayland, KDE, messaging, sync)
- [ ] C) App is usable on Fedora
- [ ] D) All of the above

**Your Answer:**B and C. Setup → Wayland/KDE → Message Sync must be achieved.


**Q18.2:** If we can't complete everything in 6 days, what's the minimum viable product?
- [ ] A) Wayland + KDE working
- [ ] B) Wayland + KDE + Message sync working
- [ ] C) Wayland + KDE + Message sync + Security updates
- [ ] D) Everything must be done

**Your Answer:**A or B is fine. Security takes time.


---

## 19. Additional Tasks

**Q19.1:** Are there any tasks missing from the plan?
- [ ] No, plan is complete
- [ ] Yes (specify below)

**Your Answer:**No, plan is fine now.


**Q19.2:** Should we add any "stretch goals" for if we finish early?
Examples:
- Performance optimizations
- Additional KDE integrations
- Multi-account support
- Other: ___________

**Your Answer:**- Performance optimizations
- Additional KDE integrations
- Multi-account support


---

## 20. Execution Approach

**Q20.1:** Should we work on tasks sequentially or can some be done in parallel?
- [ ] A) Strictly sequential (one task at a time)
- [ ] B) Some parallel (e.g., docs while testing)
- [ ] C) Fully parallel (multiple tasks at once)

**Your Answer:**B


**Q20.2:** Should we commit code after each task or at end of each phase?
- [ ] After each task
- [ ] After each phase
- [ ] Only at the end
- [ ] When something works

**Your Answer:**When something works


**Q20.3:** How should we handle blockers (e.g., can't fix message sync)?
- [ ] A) Stop and ask for guidance
- [ ] B) Document and move to next task
- [ ] C) Try alternative approaches
- [ ] D) Spend more time on it

**Your Answer:**D, if too hard then C, and then B


---

## Instructions

Please fill in your answers above and save this file. Let me know when you're done, and I'll finalize the task list and we can begin execution!

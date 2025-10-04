# Security Audit & Fedora Port - Clarification Questions

Please answer the following questions to help refine the requirements. Add your answers below each question.

---

## 1. Scope and Priorities

**Q1.1:** What is your primary goal for this project?
- [ ] A) Security fixes only (patch vulnerabilities but keep current Electron version)
- [ ] B) Full modernization (update Electron + all dependencies)
- [ ] C) Privacy-focused (remove all tracking, even if it breaks some features)
- [ ] D) Fedora compatibility first (get it working, then address security)
- [ ] E) All of the above

**Your Answer:**B and D, but ensure the app functions are working properly


**Q1.2:** Are you willing to accept breaking changes if they improve security? For example, updating Electron from v22 to v33 might break some features.
- [ ] Yes, security is priority
- [ ] No, maintain full compatibility
- [ ] Case-by-case basis

**Your Answer:** Do the best to fix the features and mitigate security risks, but for now compatibility is key


---

## 2. Tracking and Privacy

**Q2.1:** What should we do with the Sentry error tracking (@sentry/electron, @sentry/react)?
- [ ] A) Remove completely
- [ ] B) Disable by default, allow opt-in
- [ ] C) Keep but document it
- [ ] D) Replace with local-only error logging

**Your Answer:**B, will allow to enable or disable


**Q2.2:** What about Google Cloud dependencies (@google-cloud/secret-manager, @google-cloud/storage)?
- [ ] A) Remove completely (may break cloud sync features)
- [ ] B) Keep but audit what data is sent
- [ ] C) Make optional/configurable
- [ ] D) Leave as-is

**Your Answer:**D


**Q2.3:** Should we analyze the compiled JavaScript in main-dist/ and pc-dist/ for tracking code?
- [ ] Yes, deep analysis needed
- [ ] No, focus on dependencies only

**Your Answer:**Yes, also try to separate the minified code into a source code so that we can easily work on with, the source code will be a different folder. Keep the current codebase dont delete it just yet


---

## 3. Electron Version Strategy

**Q3.1:** Electron v22.3.27 is from 2023 and has known vulnerabilities. What approach should we take?
- [ ] A) Update to latest stable (v33.x) - recommended but may break things
- [ ] B) Update to latest v22.x patch (minimal changes)
- [ ] C) Update to v28.x LTS (balance of stability and security)
- [ ] D) Keep v22.3.27 but apply security patches manually

**Your Answer:**C, or v31.x LTS or depends on how major the changes are/ possibility to fix breaking changes. Do mind the security factor.


**Q3.2:** If Electron update breaks the app, should we:
- [ ] A) Fix the code to work with new Electron
- [ ] B) Revert to old version
- [ ] C) Document issues and let user decide

**Your Answer:**A


---

## 4. Dependency Management

**Q4.1:** Many dependencies are severely outdated. Should we:
- [ ] A) Update all to latest versions (aggressive, may break things)
- [ ] B) Update only those with known CVEs (conservative)
- [ ] C) Update to latest compatible versions (balanced)
- [ ] D) Create a security-patched fork with minimal changes

**Your Answer:**C, if possible A


**Q4.2:** The `request` package is deprecated. Replace with:
- [ ] A) axios (popular, well-maintained)
- [ ] B) node-fetch v3 (lightweight)
- [ ] C) native fetch (requires Node 18+)
- [ ] D) Keep request but document the risk

**Your Answer:**A


---

## 5. Installation and System Integration

**Q5.1:** The install script uses `pip install --break-system-packages`. Should we:
- [ ] A) Use Python virtual environment (venv) - cleanest approach
- [ ] B) Use pipx for isolated installation
- [ ] C) Package as Flatpak/AppImage (no system Python needed)
- [ ] D) Use system package manager (dnf install python3-pystray)
- [ ] E) Keep current approach but warn user

**Your Answer:**C and D, optimize for rpm systems for MVP, but in future maintain compatibility for most Linux based systems (including Deb, rpm, etc...)


**Q5.2:** For Fedora KDE Plasma 42 specifically, do you want:
- [ ] A) Native RPM package
- [ ] B) Flatpak package
- [ ] C) AppImage (portable)
- [ ] D) Current install script (to ~/.local/share)
- [ ] E) Multiple distribution methods

**Your Answer:**E, flatpak, rpm, install script (build from source), but for MVP is install script (build from source)


**Q5.3:** Should the app integrate with KDE Plasma features?
- [ ] A) Yes - use KDE notifications, system tray, etc.
- [ ] B) No - keep generic Linux support
- [ ] C) Optional KDE integration

**Your Answer:**A first for MVP, also maintain compatibility for other linux distros


---

## 6. Code Security Improvements

**Q6.1:** The Python tray script uses `os.system()` which is a security risk. Should we:
- [ ] A) Refactor to use subprocess.run() with proper argument handling
- [ ] B) Rewrite in JavaScript/Node.js to eliminate Python dependency
- [ ] C) Keep as-is but document the risk

**Your Answer:**A or B is possible, consider for performance and compatibility


**Q6.2:** Should we implement additional security measures?
- [ ] A) Sandboxing/AppArmor profile
- [ ] B) Content Security Policy (CSP) for Electron
- [ ] C) Code signing for binaries
- [ ] D) All of the above
- [ ] E) None needed

**Your Answer:**B, ensure CSP does not affect normal usage of the app, only there to widthstand security risks and attacks


---

## 7. Testing and Validation

**Q7.1:** What level of testing do you need?
- [ ] A) Basic smoke testing (app launches and runs)
- [ ] B) Functional testing (test major features)
- [ ] C) Security testing (penetration testing, vulnerability scanning)
- [ ] D) All of the above

**Your Answer:**A and B for MVP, C optional


**Q7.2:** Do you have a Fedora KDE Plasma 42 system available for testing?
- [ ] Yes, that's my current system
- [ ] No, need to set up VM/container
- [ ] Not sure

**Your Answer:**Yes, that's my current system that you are operating on


---

## 8. Maintenance and Updates

**Q8.1:** After initial fixes, how should updates be handled?
- [ ] A) Create automated dependency update workflow
- [ ] B) Manual updates when vulnerabilities are found
- [ ] C) Fork and maintain separately from upstream
- [ ] D) Contribute fixes back to original repo

**Your Answer:**for now, B and D. Manual updates from github repo.


**Q8.2:** Should we create a security policy document (SECURITY.md)?
- [ ] Yes
- [ ] No

**Your Answer:**Yes


---

## 9. Feature Compatibility

**Q9.1:** Are there specific Zalo features you rely on that must keep working?
(e.g., voice calls, video calls, file transfers, screen sharing, etc.)

**Your Answer:**Message, file upload, message sync, if possible: calls; i expect almost all major functions working


**Q9.2:** Are you okay with some features breaking if it improves security?

**Your Answer:**These functions must work: Message, file upload, message sync. If security measures breaks them, then it is not worth it


---

## 10. Additional Concerns

**Q10.1:** Are there any other security concerns or requirements not covered above?

**Your Answer:** Reverse engineering (deminify and put them in a clean source code); current installation does not have wayland supported windows controls (Minimize, maximize, close, titlebar, etc...), message sync is not working


**Q10.2:** Do you have any compliance requirements (GDPR, corporate security policies, etc.)?

**Your Answer:**No. But ensure that this application's license states that this is not associated with Zalo whatsoever, and i will not be responsible or any breaking changes, nor i do associated with VNG corps, but do say it with a gentle manner, don't threat the user!


**Q10.3:** What's your timeline for this project?
- [ ] A) ASAP - need it working now
- [ ] B) 1-2 weeks - thorough but timely
- [ ] C) 1+ month - comprehensive security overhaul
- [ ] D) No rush - do it right

**Your Answer:**A, basically in a few days, but at the same time, DO IT RIGHT!


---

## Instructions

Please fill in your answers above and save this file. Let me know when you're done, and I'll refine the requirements based on your responses.

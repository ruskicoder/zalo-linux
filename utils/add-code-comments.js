#!/usr/bin/env node
/**
 * Add structural comments to deobfuscated code
 * Identifies and marks key sections for easier navigation
 */

const fs = require('fs');

function addStructuralComments(filePath) {
  console.log(`Adding structural comments to: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Define patterns and their comments
  const patterns = [
    {
      regex: /(__ZaBUNDLENAME__\s*=\s*"main")/,
      comment: '\n// ============================================================================\n// WEBPACK BUNDLE: Main Process Entry Point\n// This is the Electron main process bundled with Webpack\n// ============================================================================\n'
    },
    {
      regex: /(BrowserWindow:\s*s,)/,
      comment: '\n    // Electron BrowserWindow - manages application windows\n    '
    },
    {
      regex: /(ipcMain:\s*a,)/,
      comment: '\n    // Electron IPC Main - handles inter-process communication\n    '
    },
    {
      regex: /(autoUpdater[,:])/,
      comment: '\n    // Electron Auto-Updater - handles application updates\n    '
    },
    {
      regex: /(getTray:\s*\w+)/,
      comment: '\n      // System Tray Management\n      '
    },
    {
      regex: /("sentry-")/,
      comment: '\n      // Sentry telemetry configuration\n      '
    },
    {
      regex: /(SENTRY_BAGGAGE_KEY_PREFIX)/,
      comment: '\n      // Sentry baggage headers for error tracking\n      '
    }
  ];
  
  // Apply patterns
  patterns.forEach(({ regex, comment }) => {
    content = content.replace(regex, comment + '$1');
  });
  
  // Add table of contents at the top
  const toc = `
// ============================================================================
// TABLE OF CONTENTS (Key Sections)
// ============================================================================
// 1. Webpack Bundle Loader (~line 11)
// 2. Sentry Telemetry Configuration (~line 100+)
// 3. Electron Main Process Setup (~line 8600+)
// 4. BrowserWindow Management (~line 8669+)
// 5. IPC Communication Handlers (~line 25000+)
// 6. Auto-Updater Logic (~line 24988+)
// 7. System Tray Integration (~line 35000+)
// 8. Window Controls & Management (~line 17000+)
//
// Note: Line numbers are approximate and may shift as code is modified
// ============================================================================

`;
  
  // Insert TOC after the header comment
  content = content.replace(/(\*\/\n\n)/, '$1' + toc);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Structural comments added successfully');
}

// Main execution
if (require.main === module) {
  const filePath = process.argv[2];
  
  if (!filePath) {
    console.log('Usage: node add-code-comments.js <file-path>');
    process.exit(1);
  }
  
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File does not exist: ${filePath}`);
    process.exit(1);
  }
  
  addStructuralComments(filePath);
}

module.exports = { addStructuralComments };

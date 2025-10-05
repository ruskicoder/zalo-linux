/**
 * System Tray Initialization Script
 * 
 * This script initializes the native Electron system tray.
 * It should be required after the main window is created.
 * 
 * To integrate into main.js, add this line after main window creation:
 *   require('./init-tray');
 */

const { app } = require('electron');
const trayIntegration = require('./lib/tray-integration');

// Wait for app to be ready
if (app.isReady()) {
  initializeTray();
} else {
  app.on('ready', initializeTray);
}

function initializeTray() {
  // Wait a bit for main window to be created
  setTimeout(() => {
    try {
      // Try to find main window
      const { BrowserWindow } = require('electron');
      const windows = BrowserWindow.getAllWindows();
      
      if (windows.length > 0) {
        // Find the main window (largest visible window, or first visible window)
        let mainWindow = null;
        
        // First, try to find a visible window
        for (const win of windows) {
          if (win.isVisible() && !win.isDestroyed()) {
            mainWindow = win;
            break;
          }
        }
        
        // If no visible window, use the first window
        if (!mainWindow) {
          mainWindow = windows[0];
        }
        
        console.log('[init-tray] Found main window (visible:', mainWindow.isVisible(), ', title:', mainWindow.getTitle(), ')');
        trayIntegration.initialize(mainWindow);
      } else {
        console.error('[init-tray] No windows found, tray not initialized');
      }
    } catch (error) {
      console.error('[init-tray] Failed to initialize tray:', error);
    }
  }, 3000); // Wait 3 seconds for window to be fully loaded
}

console.log('[init-tray] Tray initialization script loaded');

/**
 * Tray Integration Module
 * 
 * This module integrates SystemTrayManager into the Zalo application.
 * It should be required early in the main process (after app ready).
 * 
 * Usage:
 *   const trayIntegration = require('./lib/tray-integration');
 *   trayIntegration.initialize(mainWindow);
 */

const { app } = require('electron');
const { getInstance } = require('./SystemTrayManager');

let trayManager = null;
let isInitialized = false;

/**
 * Initialize tray integration
 * @param {BrowserWindow} mainWindow - Main application window
 */
function initialize(mainWindow) {
  if (isInitialized) {
    console.log('[TrayIntegration] Already initialized');
    return;
  }

  if (!mainWindow) {
    console.error('[TrayIntegration] Main window is required');
    return;
  }

  console.log('[TrayIntegration] Initializing system tray...');

  // Get tray manager instance
  trayManager = getInstance();

  // Create tray
  trayManager.create(mainWindow);

  // Setup window event handlers
  setupWindowHandlers(mainWindow);

  // Handle app quit
  app.on('before-quit', () => {
    if (trayManager) {
      trayManager.destroy();
    }
  });

  isInitialized = true;
  console.log('[TrayIntegration] System tray initialized successfully');
}

/**
 * Setup window event handlers (simplified - no special behavior)
 * @param {BrowserWindow} mainWindow - Main application window
 */
function setupWindowHandlers(mainWindow) {
  // Handle window destroyed - update tray manager reference
  mainWindow.on('closed', () => {
    console.log('[TrayIntegration] Main window closed');
    if (trayManager) {
      trayManager.mainWindow = null;
    }
  });
}

/**
 * Get tray manager instance
 * @returns {SystemTrayManager|null} Tray manager instance or null
 */
function getTrayManager() {
  return trayManager;
}

/**
 * Check if tray is initialized
 * @returns {boolean} True if initialized
 */
function isReady() {
  return isInitialized;
}

module.exports = {
  initialize,
  getTrayManager,
  isReady
};

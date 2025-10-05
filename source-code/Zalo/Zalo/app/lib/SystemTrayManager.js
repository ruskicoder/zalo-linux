/**
 * SystemTrayManager - Native Electron System Tray Implementation
 * 
 * Replaces Python pystray dependency with native Electron Tray API
 * Provides KDE Plasma integration with StatusNotifierItem protocol
 * 
 * Simplified version with no settings - just "Open Zalo" and "Exit"
 * 
 * Requirements: 5.1, 5.2, 7.1
 */

const { app, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');

class SystemTrayManager {
  constructor() {
    this.tray = null;
    this.mainWindow = null;
  }

  /**
   * Create system tray icon
   * @param {BrowserWindow} mainWindow - Main application window
   */
  create(mainWindow) {
    if (this.tray) {
      console.log('[SystemTrayManager] Tray already exists');
      return;
    }

    this.mainWindow = mainWindow;

    // Find icon path
    const iconPath = this.findIconPath();
    if (!iconPath) {
      console.error('[SystemTrayManager] Icon not found, tray not created');
      return;
    }

    // Create tray icon
    const icon = nativeImage.createFromPath(iconPath);
    this.tray = new Tray(icon);
    
    // Set tooltip
    this.tray.setToolTip('Zalo');
    
    // Create context menu
    this.updateContextMenu();
    
    // Handle tray click (show/hide window)
    this.tray.on('click', () => {
      this.toggleWindow();
    });

    console.log('[SystemTrayManager] Tray created successfully');
  }

  /**
   * Find icon path (supports multiple locations)
   * @returns {string|null} Icon path or null if not found
   */
  findIconPath() {
    const possiblePaths = [
      // Development paths
      path.join(__dirname, '../../assets/Zalo.png'),
      path.join(__dirname, '../../../assets/Zalo.png'),
      path.join(__dirname, '../../../../assets/Zalo.png'),
      // Installed paths
      path.join(app.getPath('home'), '.local/share/Zalo/assets/Zalo.png'),
      // Relative to app path
      path.join(app.getAppPath(), '../assets/Zalo.png'),
      path.join(app.getAppPath(), '../../assets/Zalo.png')
    ];

    for (const iconPath of possiblePaths) {
      if (fs.existsSync(iconPath)) {
        console.log('[SystemTrayManager] Icon found at:', iconPath);
        return iconPath;
      }
    }

    console.error('[SystemTrayManager] Icon not found in any of these paths:', possiblePaths);
    return null;
  }

  /**
   * Update context menu (simplified - no settings)
   */
  updateContextMenu() {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Open Zalo',
        click: () => this.showWindow()
      },
      {
        type: 'separator'
      },
      {
        label: 'Exit',
        click: () => this.exitApplication()
      }
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  /**
   * Show main window
   */
  showWindow() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.error('[SystemTrayManager] Main window not available');
      return;
    }

    if (this.mainWindow.isMinimized()) {
      this.mainWindow.restore();
    }
    
    if (!this.mainWindow.isVisible()) {
      this.mainWindow.show();
    }
    
    this.mainWindow.focus();
  }

  /**
   * Hide main window
   */
  hideWindow() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.error('[SystemTrayManager] Main window not available');
      return;
    }
    this.mainWindow.hide();
  }

  /**
   * Toggle window visibility (simplified - always show)
   */
  toggleWindow() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.error('[SystemTrayManager] Main window not available');
      return;
    }

    // Always show window when tray is clicked
    this.showWindow();
  }

  /**
   * Exit application
   */
  exitApplication() {
    // Destroy tray before quitting
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
    }
    
    // Quit application
    app.quit();
  }

  /**
   * Destroy tray icon
   */
  destroy() {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
      console.log('[SystemTrayManager] Tray destroyed');
    }
  }
}

// Export singleton instance
let instance = null;

module.exports = {
  /**
   * Get SystemTrayManager instance
   * @returns {SystemTrayManager} Singleton instance
   */
  getInstance() {
    if (!instance) {
      instance = new SystemTrayManager();
    }
    return instance;
  },
  
  SystemTrayManager
};

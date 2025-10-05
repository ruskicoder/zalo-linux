/**
 * SystemTrayManager - Native Electron System Tray Implementation
 * 
 * Replaces Python pystray dependency with native Electron Tray API
 * Provides KDE Plasma integration with StatusNotifierItem protocol
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
    this.settings = this.loadSettings();
  }

  /**
   * Load tray settings from storage
   * @returns {Object} Settings object
   */
  loadSettings() {
    // Default settings
    const defaults = {
      closeToTray: false, // Close button hides to tray (disabled by default)
      minimizeToTray: false, // Minimize button hides to tray (disabled by default)
      startMinimized: false // Start minimized to tray (disabled by default)
    };

    try {
      const userDataPath = app.getPath('userData');
      const settingsPath = path.join(userDataPath, 'tray-settings.json');
      
      if (fs.existsSync(settingsPath)) {
        const data = fs.readFileSync(settingsPath, 'utf8');
        return { ...defaults, ...JSON.parse(data) };
      }
    } catch (error) {
      console.error('[SystemTrayManager] Failed to load settings:', error);
    }

    return defaults;
  }

  /**
   * Save tray settings to storage
   * @param {Object} settings - Settings to save
   */
  saveSettings(settings) {
    try {
      const userDataPath = app.getPath('userData');
      const settingsPath = path.join(userDataPath, 'tray-settings.json');
      
      this.settings = { ...this.settings, ...settings };
      fs.writeFileSync(settingsPath, JSON.stringify(this.settings, null, 2), 'utf8');
      
      console.log('[SystemTrayManager] Settings saved:', this.settings);
    } catch (error) {
      console.error('[SystemTrayManager] Failed to save settings:', error);
    }
  }

  /**
   * Get current tray settings
   * @returns {Object} Current settings
   */
  getSettings() {
    return { ...this.settings };
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
   * Update context menu
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
        label: 'Tray Settings',
        submenu: [
          {
            label: 'Close button hides to tray',
            type: 'checkbox',
            checked: this.settings.closeToTray,
            click: (menuItem) => {
              this.saveSettings({ closeToTray: menuItem.checked });
              this.updateContextMenu();
            }
          },
          {
            label: 'Minimize to tray',
            type: 'checkbox',
            checked: this.settings.minimizeToTray,
            click: (menuItem) => {
              this.saveSettings({ minimizeToTray: menuItem.checked });
              this.updateContextMenu();
            }
          },
          {
            label: 'Start minimized to tray',
            type: 'checkbox',
            checked: this.settings.startMinimized,
            click: (menuItem) => {
              this.saveSettings({ startMinimized: menuItem.checked });
              this.updateContextMenu();
            }
          }
        ]
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
   * Toggle window visibility
   */
  toggleWindow() {
    if (!this.mainWindow || this.mainWindow.isDestroyed()) {
      console.error('[SystemTrayManager] Main window not available');
      return;
    }

    if (this.mainWindow.isVisible()) {
      this.hideWindow();
    } else {
      this.showWindow();
    }
  }

  /**
   * Handle window close event
   * @param {Event} event - Close event
   * @returns {boolean} True if event was handled (prevented)
   */
  handleWindowClose(event) {
    if (this.settings.closeToTray) {
      event.preventDefault();
      this.hideWindow();
      return true;
    }
    return false;
  }

  /**
   * Handle window minimize event
   * @param {Event} event - Minimize event
   * @returns {boolean} True if event was handled (prevented)
   */
  handleWindowMinimize(event) {
    if (this.settings.minimizeToTray) {
      event.preventDefault();
      this.hideWindow();
      return true;
    }
    return false;
  }

  /**
   * Check if app should start minimized
   * @returns {boolean} True if should start minimized
   */
  shouldStartMinimized() {
    return this.settings.startMinimized;
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

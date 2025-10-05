/**
 * NotificationManager - Native Electron Notification Implementation
 * 
 * Provides KDE Plasma notification integration using Electron's Notification API
 * Supports notification actions, icons, and urgency levels
 * 
 * Requirements: 5.2
 */

const { Notification, app } = require('electron');
const path = require('path');
const fs = require('fs');

class NotificationManager {
  constructor() {
    this.iconPath = this.findIconPath();
    this.notificationsEnabled = true;
  }

  /**
   * Find icon path for notifications
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
        console.log('[NotificationManager] Icon found at:', iconPath);
        return iconPath;
      }
    }

    console.warn('[NotificationManager] Icon not found, notifications will use default icon');
    return null;
  }

  /**
   * Check if notifications are supported
   * @returns {boolean} True if supported
   */
  isSupported() {
    return Notification.isSupported();
  }

  /**
   * Enable notifications
   */
  enable() {
    this.notificationsEnabled = true;
    console.log('[NotificationManager] Notifications enabled');
  }

  /**
   * Disable notifications
   */
  disable() {
    this.notificationsEnabled = false;
    console.log('[NotificationManager] Notifications disabled');
  }

  /**
   * Check if notifications are enabled
   * @returns {boolean} True if enabled
   */
  isEnabled() {
    return this.notificationsEnabled;
  }

  /**
   * Show a notification
   * @param {Object} options - Notification options
   * @param {string} options.title - Notification title
   * @param {string} options.body - Notification body
   * @param {string} [options.icon] - Custom icon path (optional)
   * @param {string} [options.urgency] - Urgency level: 'low', 'normal', 'critical' (KDE-specific)
   * @param {boolean} [options.silent] - Silent notification (no sound)
   * @param {Array} [options.actions] - Notification actions (buttons)
   * @param {Function} [options.onClick] - Click handler
   * @param {Function} [options.onClose] - Close handler
   * @param {Function} [options.onAction] - Action handler
   * @returns {Notification|null} Notification instance or null if disabled
   */
  show(options) {
    if (!this.notificationsEnabled) {
      console.log('[NotificationManager] Notifications disabled, skipping');
      return null;
    }

    if (!this.isSupported()) {
      console.error('[NotificationManager] Notifications not supported on this system');
      return null;
    }

    try {
      const notification = new Notification({
        title: options.title || 'Zalo',
        body: options.body || '',
        icon: options.icon || this.iconPath,
        silent: options.silent || false,
        urgency: options.urgency || 'normal', // KDE-specific: low, normal, critical
        actions: options.actions || []
      });

      // Handle click event
      if (options.onClick) {
        notification.on('click', () => {
          console.log('[NotificationManager] Notification clicked');
          options.onClick();
        });
      }

      // Handle close event
      if (options.onClose) {
        notification.on('close', () => {
          console.log('[NotificationManager] Notification closed');
          options.onClose();
        });
      }

      // Handle action event
      if (options.onAction) {
        notification.on('action', (event, index) => {
          console.log('[NotificationManager] Notification action clicked:', index);
          options.onAction(index);
        });
      }

      // Show notification
      notification.show();

      console.log('[NotificationManager] Notification shown:', options.title);
      return notification;
    } catch (error) {
      console.error('[NotificationManager] Failed to show notification:', error);
      return null;
    }
  }

  /**
   * Show a message notification
   * @param {Object} options - Message options
   * @param {string} options.sender - Sender name
   * @param {string} options.message - Message text
   * @param {string} [options.avatar] - Sender avatar path (optional)
   * @param {Function} [options.onReply] - Reply handler
   * @param {Function} [options.onView] - View handler
   * @returns {Notification|null} Notification instance or null
   */
  showMessage(options) {
    const actions = [];

    // Add reply action if handler provided
    if (options.onReply) {
      actions.push({
        type: 'button',
        text: 'Reply'
      });
    }

    // Add view action if handler provided
    if (options.onView) {
      actions.push({
        type: 'button',
        text: 'View'
      });
    }

    return this.show({
      title: options.sender || 'New Message',
      body: options.message || '',
      icon: options.avatar || this.iconPath,
      urgency: 'normal',
      actions: actions,
      onClick: options.onView || (() => {}),
      onAction: (index) => {
        if (index === 0 && options.onReply) {
          options.onReply();
        } else if (index === 1 && options.onView) {
          options.onView();
        } else if (index === 0 && options.onView) {
          options.onView();
        }
      }
    });
  }

  /**
   * Show a call notification
   * @param {Object} options - Call options
   * @param {string} options.caller - Caller name
   * @param {string} options.type - Call type: 'voice' or 'video'
   * @param {Function} [options.onAccept] - Accept handler
   * @param {Function} [options.onDecline] - Decline handler
   * @returns {Notification|null} Notification instance or null
   */
  showCall(options) {
    const callType = options.type === 'video' ? 'Video Call' : 'Voice Call';
    const actions = [];

    // Add accept action if handler provided
    if (options.onAccept) {
      actions.push({
        type: 'button',
        text: 'Accept'
      });
    }

    // Add decline action if handler provided
    if (options.onDecline) {
      actions.push({
        type: 'button',
        text: 'Decline'
      });
    }

    return this.show({
      title: `${callType} from ${options.caller}`,
      body: 'Incoming call...',
      icon: this.iconPath,
      urgency: 'critical', // High priority for calls
      actions: actions,
      onClick: options.onAccept || (() => {}),
      onAction: (index) => {
        if (index === 0 && options.onAccept) {
          options.onAccept();
        } else if (index === 1 && options.onDecline) {
          options.onDecline();
        }
      }
    });
  }

  /**
   * Show a system notification
   * @param {Object} options - System notification options
   * @param {string} options.title - Notification title
   * @param {string} options.message - Notification message
   * @param {string} [options.urgency] - Urgency level: 'low', 'normal', 'critical'
   * @returns {Notification|null} Notification instance or null
   */
  showSystem(options) {
    return this.show({
      title: options.title || 'Zalo',
      body: options.message || '',
      icon: this.iconPath,
      urgency: options.urgency || 'low',
      silent: true
    });
  }
}

// Export singleton instance
let instance = null;

module.exports = {
  /**
   * Get NotificationManager instance
   * @returns {NotificationManager} Singleton instance
   */
  getInstance() {
    if (!instance) {
      instance = new NotificationManager();
    }
    return instance;
  },
  
  NotificationManager
};

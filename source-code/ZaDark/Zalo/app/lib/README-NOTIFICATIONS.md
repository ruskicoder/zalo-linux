# Notification Implementation

## Overview

This directory contains the native Electron notification implementation that integrates with KDE Plasma's notification system.

## Files

- **NotificationManager.js** - Main notification manager class
- **test-notifications.js** - Test script for notification functionality

## Features

### Core Features
- ✅ Native Electron Notification API
- ✅ KDE Plasma notification integration
- ✅ Notification actions (buttons)
- ✅ Custom icons and urgency levels
- ✅ Click and action handlers
- ✅ Enable/disable notifications

### Notification Types

1. **Basic Notification**
   - Title and body text
   - Custom icon
   - Click handler

2. **Message Notification**
   - Sender name and message
   - Reply and View actions
   - Custom avatar

3. **Call Notification**
   - Caller name and call type (voice/video)
   - Accept and Decline actions
   - Critical urgency

4. **System Notification**
   - System messages
   - Low urgency
   - Silent (no sound)

### Urgency Levels (KDE-Specific)

- **low** - Low priority, minimal interruption
- **normal** - Normal priority (default)
- **critical** - High priority, persistent notification

## Usage

### Basic Usage

```javascript
const { getInstance } = require('./lib/NotificationManager');

// Get notification manager instance
const notificationManager = getInstance();

// Show a basic notification
notificationManager.show({
  title: 'Hello',
  body: 'This is a notification',
  onClick: () => {
    console.log('Notification clicked');
  }
});
```

### Message Notification

```javascript
notificationManager.showMessage({
  sender: 'John Doe',
  message: 'Hey! How are you?',
  avatar: '/path/to/avatar.png', // Optional
  onReply: () => {
    // Handle reply action
    console.log('User wants to reply');
  },
  onView: () => {
    // Handle view action
    console.log('User wants to view message');
  }
});
```

### Call Notification

```javascript
notificationManager.showCall({
  caller: 'Jane Smith',
  type: 'video', // or 'voice'
  onAccept: () => {
    // Handle accept action
    console.log('User accepted call');
  },
  onDecline: () => {
    // Handle decline action
    console.log('User declined call');
  }
});
```

### System Notification

```javascript
notificationManager.showSystem({
  title: 'System Update',
  message: 'Zalo has been updated',
  urgency: 'low' // low, normal, or critical
});
```

### Enable/Disable Notifications

```javascript
// Disable notifications
notificationManager.disable();

// Enable notifications
notificationManager.enable();

// Check if enabled
if (notificationManager.isEnabled()) {
  console.log('Notifications are enabled');
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  NotificationManager                         │
│  - Manages notification state                                │
│  - Provides notification methods                             │
│  - Handles notification events                               │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│              Electron Notification API                       │
│  - Creates native notifications                              │
│  - Handles platform-specific behavior                        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────────────────────┐
│            KDE Plasma Notification System                    │
│  - Displays notifications in system tray                     │
│  - Handles notification actions                              │
│  - Manages notification history                              │
└─────────────────────────────────────────────────────────────┘
```

## Event Flow

### Show Notification

```
Application calls notificationManager.show()
  ↓
NotificationManager creates Electron Notification
  ↓
Electron sends notification to system
  ↓
KDE Plasma displays notification
  ↓
User interacts with notification
  ↓
Event handler called (onClick, onAction, onClose)
```

### Notification Actions

```
User clicks action button
  ↓
Electron fires 'action' event
  ↓
NotificationManager handles event
  ↓
Calls onAction handler with action index
  ↓
Application responds to action
```

## Testing

### Manual Testing

1. Start application: `./start-dev.sh`
2. Open DevTools: Ctrl+Shift+I
3. Run test script:
   ```javascript
   require('./lib/test-notifications').runTests();
   ```
4. Watch for notifications in KDE Plasma system tray

### Test Checklist

- [ ] Basic notification appears
- [ ] Notification icon displays correctly
- [ ] Click handler works
- [ ] Message notification with actions appears
- [ ] Reply button works
- [ ] View button works
- [ ] Call notification appears
- [ ] Accept button works
- [ ] Decline button works
- [ ] System notification appears
- [ ] Urgent notification appears with high priority
- [ ] Disable notifications works
- [ ] Enable notifications works

### Expected Results

**Wayland Session**:
- ✅ Notifications appear in KDE Plasma notification area
- ✅ Notification actions work
- ✅ Click handlers work
- ✅ Urgency levels respected

**X11 Session**:
- ✅ Notifications appear in KDE Plasma notification area
- ✅ Notification actions work
- ✅ Click handlers work
- ✅ Urgency levels respected

## KDE Plasma Integration

### Notification Protocol

Electron's Notification API automatically integrates with KDE Plasma's notification system via:

- **D-Bus**: org.freedesktop.Notifications interface
- **Protocol**: Desktop Notifications Specification
- **Features**: Actions, icons, urgency, persistence

### Notification Appearance

Notifications appear in:
- System tray notification area
- Notification history (accessible via system tray)
- Lock screen (if configured)

### Notification Settings

Users can configure notification behavior in:
- KDE System Settings → Notifications
- Per-application notification settings
- Do Not Disturb mode

## Integration with Zalo

### Message Notifications

When a new message arrives, the application should call:

```javascript
const { getInstance } = require('./lib/NotificationManager');
const notificationManager = getInstance();

notificationManager.showMessage({
  sender: message.senderName,
  message: message.text,
  avatar: message.senderAvatar,
  onView: () => {
    // Show conversation window
    showConversation(message.conversationId);
  }
});
```

### Call Notifications

When a call arrives, the application should call:

```javascript
notificationManager.showCall({
  caller: call.callerName,
  type: call.type, // 'voice' or 'video'
  onAccept: () => {
    // Accept the call
    acceptCall(call.id);
  },
  onDecline: () => {
    // Decline the call
    declineCall(call.id);
  }
});
```

### System Notifications

For system events (updates, errors, etc.):

```javascript
notificationManager.showSystem({
  title: 'Connection Lost',
  message: 'Reconnecting to Zalo servers...',
  urgency: 'normal'
});
```

## Troubleshooting

### Notifications Not Appearing

**Symptom**: No notifications appear

**Possible Causes**:
1. Notifications disabled in NotificationManager
2. Notifications disabled in KDE settings
3. Do Not Disturb mode enabled
4. Electron Notification API not supported

**Solutions**:
1. Check `notificationManager.isEnabled()`
2. Check KDE System Settings → Notifications
3. Disable Do Not Disturb mode
4. Check `notificationManager.isSupported()`

### Notification Actions Not Working

**Symptom**: Clicking action buttons does nothing

**Possible Causes**:
1. Action handlers not registered
2. Electron version issue
3. KDE Plasma version issue

**Solutions**:
1. Verify `onAction` handler is provided
2. Update Electron to v28+ or v31+
3. Update KDE Plasma to latest version

### Notification Icon Not Showing

**Symptom**: Notification appears without icon

**Possible Causes**:
1. Icon file not found
2. Icon path incorrect
3. Icon format not supported

**Solutions**:
1. Check console for `[NotificationManager] Icon found at: ...`
2. Verify `assets/Zalo.png` exists
3. Use PNG format for icons

### Urgency Level Not Respected

**Symptom**: All notifications have same priority

**Possible Causes**:
1. KDE Plasma version doesn't support urgency
2. Notification settings override urgency

**Solutions**:
1. Update KDE Plasma to latest version
2. Check KDE notification settings

## Requirements Satisfied

- ✅ **Requirement 5.2**: KDE Plasma notification system integration

## Future Enhancements

- [ ] Add notification sound customization
- [ ] Add notification badge count
- [ ] Add notification grouping
- [ ] Add notification persistence settings
- [ ] Add notification preview in settings
- [ ] Add notification templates
- [ ] Add notification scheduling
- [ ] Add notification history

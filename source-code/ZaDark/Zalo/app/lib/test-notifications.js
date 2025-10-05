/**
 * Notification Test Script
 * 
 * This script tests the NotificationManager implementation.
 * Run this from the Electron console or as a separate test.
 * 
 * Usage (from Electron DevTools console):
 *   require('./lib/test-notifications').runTests();
 */

const { getInstance } = require('./NotificationManager');

/**
 * Run notification tests
 */
function runTests() {
  console.log('=== Notification Manager Tests ===');
  
  const notificationManager = getInstance();

  // Test 1: Check if notifications are supported
  console.log('\n[Test 1] Checking notification support...');
  if (notificationManager.isSupported()) {
    console.log('✅ Notifications are supported');
  } else {
    console.log('❌ Notifications are NOT supported');
    return;
  }

  // Test 2: Show basic notification
  console.log('\n[Test 2] Showing basic notification...');
  setTimeout(() => {
    notificationManager.show({
      title: 'Test Notification',
      body: 'This is a test notification from Zalo',
      onClick: () => {
        console.log('✅ Basic notification clicked');
      }
    });
  }, 1000);

  // Test 3: Show message notification
  console.log('\n[Test 3] Showing message notification...');
  setTimeout(() => {
    notificationManager.showMessage({
      sender: 'John Doe',
      message: 'Hey! How are you doing?',
      onReply: () => {
        console.log('✅ Reply button clicked');
      },
      onView: () => {
        console.log('✅ View button clicked');
      }
    });
  }, 3000);

  // Test 4: Show call notification
  console.log('\n[Test 4] Showing call notification...');
  setTimeout(() => {
    notificationManager.showCall({
      caller: 'Jane Smith',
      type: 'video',
      onAccept: () => {
        console.log('✅ Accept button clicked');
      },
      onDecline: () => {
        console.log('✅ Decline button clicked');
      }
    });
  }, 5000);

  // Test 5: Show system notification
  console.log('\n[Test 5] Showing system notification...');
  setTimeout(() => {
    notificationManager.showSystem({
      title: 'System Update',
      message: 'Zalo has been updated to version 1.0.0',
      urgency: 'low'
    });
  }, 7000);

  // Test 6: Show urgent notification
  console.log('\n[Test 6] Showing urgent notification...');
  setTimeout(() => {
    notificationManager.show({
      title: 'Urgent Message',
      body: 'This is an urgent notification',
      urgency: 'critical'
    });
  }, 9000);

  console.log('\n✅ All tests scheduled. Watch for notifications!');
  console.log('Tests will run over the next 10 seconds.');
}

/**
 * Test notification enable/disable
 */
function testEnableDisable() {
  console.log('=== Testing Enable/Disable ===');
  
  const notificationManager = getInstance();

  console.log('\n[Test] Disabling notifications...');
  notificationManager.disable();
  
  console.log('[Test] Attempting to show notification (should be skipped)...');
  notificationManager.show({
    title: 'This should not appear',
    body: 'Notifications are disabled'
  });

  setTimeout(() => {
    console.log('\n[Test] Enabling notifications...');
    notificationManager.enable();
    
    console.log('[Test] Showing notification (should appear)...');
    notificationManager.show({
      title: 'Notifications Enabled',
      body: 'This notification should appear'
    });
  }, 2000);
}

module.exports = {
  runTests,
  testEnableDisable
};

// Auto-run tests if executed directly
if (require.main === module) {
  runTests();
}

# Notification System Architecture

## Overview
The notification system provides timely reminders and alerts to users about their workout progress and achievements.

## Components

### 1. Notification Settings Panel
```tsx
interface NotificationSettings {
  streakEnabled: boolean
  achievementEnabled: boolean
  achievementTime: string
}
```

### 2. Notification Service Core
```ts
class NotificationService {
  private checkInterval: NodeJS.Timeout
  
  initialize() {
    // Request browser permissions
    // Setup time-based checks
    this.checkInterval = setInterval(() => {
      this.checkStreakNotifications()
      this.checkAchievementNotifications()
    }, 60_000) // Check every minute
  }

  private checkStreakNotifications() {
    const currentTime = new Date().toTimeString().slice(0,5)
    const targetTimes = ['18:00', '21:00', '23:00', '23:55']
    
    if (targetTimes.includes(currentTime)) {
      this.sendStreakNotification()
    }
  }

  private checkAchievementNotifications() {
    // Check achievement state and scheduled time
  }
}
```

### 3. Integration Points
- Streak state tracking
- Achievement system
- Workout completion events

## Implementation Phases

1. **Phase 1 - Core Infrastructure**
   - Notification service skeleton
   - Permission management
   - Time checking logic

2. **Phase 2 - Streak Notifications**
   - Multi-time notifications
   - Dismiss functionality
   - Integration with streak state

3. **Phase 3 - Achievement Notifications**
   - Post-midnight achievement scan
   - Custom time scheduling
   - Notification templates

## Technical Considerations
- Time accuracy (UTC with local conversion)
- Browser compatibility
- Performance optimization
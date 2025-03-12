interface NotificationSettings {
  streakEnabled: boolean;
  achievementEnabled: boolean;
  notificationTimes: string[]; // Format: "HH:MM"
  daysEnabled: number[]; // 0-6 for Sunday-Saturday
}

const DEFAULT_SETTINGS: NotificationSettings = {
  streakEnabled: true,
  achievementEnabled: true,
  notificationTimes: ['18:00', '21:00'],
  daysEnabled: [0, 1, 2, 3, 4, 5, 6] // All days enabled by default
};

const SETTINGS_KEY = 'pushup-journey-notification-settings';

class NotificationService {
  private static instance: NotificationService
  private checkInterval: number | null = null
  private permission: NotificationPermission = 'default'
  private settings: NotificationSettings
  private lastNotificationDate: string | null = null

  private constructor() {
    // Load settings from localStorage or use defaults
    const savedSettings = localStorage.getItem(SETTINGS_KEY)
    this.settings = savedSettings 
      ? JSON.parse(savedSettings) 
      : DEFAULT_SETTINGS
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService()
    }
    return NotificationService.instance
  }

  /**
   * Check if browser supports notifications
   */
  supportsNotifications(): boolean {
    return 'Notification' in window
  }

  /**
   * Get current notification permission
   */
  getPermission(): NotificationPermission {
    return this.permission
  }

  /**
   * Get current notification settings
   */
  getSettings(): NotificationSettings {
    return { ...this.settings }
  }

  /**
   * Update notification settings
   */
  updateSettings(newSettings: Partial<NotificationSettings>): void {
    this.settings = { ...this.settings, ...newSettings }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings))
    
    // Restart notification service if enabled
    if (this.settings.streakEnabled) {
      this.cleanup()
      this.initialize()
    } else {
      this.cleanup()
    }
  }

  /**
   * Initialize the notification service
   */
  async initialize(): Promise<boolean> {
    if (!this.supportsNotifications()) {
      console.warn('Browser does not support notifications')
      return false
    }

    // Only request permission if not already granted or denied
    if (Notification.permission === 'default') {
      this.permission = await Notification.requestPermission()
    } else {
      this.permission = Notification.permission
    }

    if (this.permission !== 'granted') {
      console.warn('Notification permission not granted')
      return false
    }

    // Start checking for notifications if streak reminders are enabled
    if (this.settings.streakEnabled) {
      this.checkInterval = window.setInterval(() => {
        this.checkNotifications()
      }, 60_000) // Check every minute
    }

    return true
  }

  /**
   * Check if it's time to send a notification
   */
  private checkNotifications(): void {
    if (!this.settings.streakEnabled) return

    const now = new Date()
    const currentTime = now.toTimeString().slice(0, 5)
    const currentDay = now.getDay() // 0-6 for Sunday-Saturday
    const currentDate = now.toISOString().split('T')[0] // YYYY-MM-DD

    // Check if we already sent a notification today
    if (this.lastNotificationDate === currentDate) {
      return
    }

    // Check if current day is enabled for notifications
    if (!this.settings.daysEnabled.includes(currentDay)) {
      return
    }

    // Check if current time matches any of the notification times
    if (this.settings.notificationTimes.includes(currentTime)) {
      this.sendStreakNotification()
      this.lastNotificationDate = currentDate
    }
  }

  /**
   * Send a streak reminder notification
   */
  private sendStreakNotification(): void {
    if (this.permission !== 'granted') return
    
    new Notification('Push-up Journey Reminder', {
      body: 'Don\'t forget to complete your daily push-ups!',
      icon: '/public/vite.svg',
      badge: '/public/vite.svg',
      requireInteraction: true
    })
  }

  /**
   * Send an achievement notification
   */
  sendAchievementNotification(title: string, description: string): void {
    if (this.permission !== 'granted' || !this.settings.achievementEnabled) return
    
    new Notification(`Achievement Unlocked: ${title}`, {
      body: description,
      icon: '/public/vite.svg',
      badge: '/public/vite.svg',
      requireInteraction: true
    })
  }

  /**
   * Send a custom notification
   */
  sendCustomNotification(title: string, options: NotificationOptions = {}): void {
    if (this.permission !== 'granted') return
    
    new Notification(title, {
      icon: '/public/vite.svg',
      badge: '/public/vite.svg',
      ...options
    })
  }

  /**
   * Clean up notification service
   */
  cleanup(): void {
    if (this.checkInterval) {
      window.clearInterval(this.checkInterval)
      this.checkInterval = null
    }
  }
}

export const notificationService = NotificationService.getInstance()
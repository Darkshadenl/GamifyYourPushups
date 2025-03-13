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
   * Check if the device is running iOS
   */
  isIOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
           (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  }

  /**
   * Check if the app is running in standalone mode (installed as PWA)
   */
  isStandalone(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches || 
           (window.navigator as any).standalone === true
  }

  /**
   * Check if browser supports notifications
   */
  supportsNotifications(): boolean {
    // Standard web notifications support
    const hasNotificationAPI = 'Notification' in window
    
    // For iOS, we'll consider it "supported" if it's installed as a PWA
    // This is because iOS only supports notifications through PWAs
    if (this.isIOS()) {
      return this.isStandalone() || hasNotificationAPI
    }
    
    return hasNotificationAPI
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
    // For iOS, we'll allow settings to be configured even if notifications
    // aren't fully supported in the current context
    if (!this.supportsNotifications() && !this.isIOS()) {
      console.warn('Browser does not support notifications')
      return false
    }

    // Only request permission if not already granted or denied
    // and if the Notification API is available
    if ('Notification' in window) {
      if (Notification.permission === 'default') {
        this.permission = await Notification.requestPermission()
      } else {
        this.permission = Notification.permission
      }
    } else if (this.isIOS()) {
      // For iOS without Notification API, we'll set a default permission
      // This allows the UI to still work even though actual notifications won't
      this.permission = 'default'
    }

    if (this.permission !== 'granted' && !this.isIOS()) {
      console.warn('Notification permission not granted')
      return false
    }

    // Start checking for notifications if streak reminders are enabled
    // and if we're not on iOS (since iOS notifications work differently)
    if (this.settings.streakEnabled && !this.isIOS()) {
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
      icon: '/vite.svg',
      badge: '/vite.svg',
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
      icon: '/vite.svg',
      badge: '/vite.svg',
      requireInteraction: true
    })
  }

  /**
   * Send a custom notification
   */
  sendCustomNotification(title: string, options: NotificationOptions = {}): void {
    if (this.permission !== 'granted') return
    
    new Notification(title, {
      icon: '/vite.svg',
      badge: '/vite.svg',
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
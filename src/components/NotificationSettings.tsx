import React, { useState, useEffect } from 'react'
import { notificationService } from '../utils/notifications'

export function NotificationSettings() {
  const [streakEnabled, setStreakEnabled] = useState(true)
  const [achievementEnabled, setAchievementEnabled] = useState(true)
  const [notificationTimes, setNotificationTimes] = useState<string[]>(['18:00', '21:00'])
  const [newTime, setNewTime] = useState('18:00')
  const [daysEnabled, setDaysEnabled] = useState<number[]>([0, 1, 2, 3, 4, 5, 6])
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(true)

  // Load current settings on mount
  useEffect(() => {
    const settings = notificationService.getSettings()
    setStreakEnabled(settings.streakEnabled)
    setAchievementEnabled(settings.achievementEnabled)
    setNotificationTimes(settings.notificationTimes)
    setDaysEnabled(settings.daysEnabled)

    setPermissionStatus(notificationService.getPermission())
    setIsSupported(notificationService.supportsNotifications())
  }, [])

  // Save settings when they change
  useEffect(() => {
    notificationService.updateSettings({
      streakEnabled,
      achievementEnabled,
      notificationTimes,
      daysEnabled
    })
  }, [streakEnabled, achievementEnabled, notificationTimes, daysEnabled])

  const handleStreakToggle = async () => {
    // If enabling notifications and permission is not granted, request it
    if (!streakEnabled && permissionStatus !== 'granted') {
      const initialized = await notificationService.initialize()
      if (initialized) {
        setPermissionStatus(notificationService.getPermission())
        setStreakEnabled(true)
      }
    } else {
      setStreakEnabled(prev => !prev)
    }
  }

  const handleAddTime = () => {
    if (newTime && !notificationTimes.includes(newTime)) {
      setNotificationTimes(prev => [...prev, newTime].sort())
    }
  }

  const handleRemoveTime = (time: string) => {
    setNotificationTimes(prev => prev.filter(t => t !== time))
  }

  const handleDayToggle = (day: number) => {
    setDaysEnabled(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day].sort()
    )
  }

  if (!isSupported) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-yellow-50 text-yellow-800">
        <p>Your browser doesn't support notifications. Try using a modern browser like Chrome, Edge, or Firefox.</p>
      </div>
    )
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span>Streak Reminders</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={streakEnabled}
              onChange={handleStreakToggle}
              className="sr-only peer"
              aria-label={`${streakEnabled ? 'Disable' : 'Enable'} streak reminders`}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <span>Achievement Alerts</span>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={achievementEnabled}
              onChange={() => setAchievementEnabled(prev => !prev)}
              className="sr-only peer"
              aria-label={`${achievementEnabled ? 'Disable' : 'Enable'} achievement alerts`}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {permissionStatus === 'denied' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800">
            <p>Notifications are blocked. Please update your browser settings to allow notifications for this site.</p>
          </div>
        )}

        {streakEnabled && permissionStatus === 'granted' && (
          <>
            <div>
              <h3 className="font-medium mb-2">Notification Times</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {notificationTimes.map(time => (
                  <div key={time} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
                    <span>{time}</span>
                    <button
                      onClick={() => handleRemoveTime(time)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                      aria-label={`Remove ${time}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex">
                <input
                  type="time"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="border rounded-l-md px-2 py-1"
                  aria-label="Add notification time"
                  title="Select time for notification"
                />
                <button
                  onClick={handleAddTime}
                  className="ml-1 bg-blue-500 text-white px-3 py-1 rounded-r-md hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Notification Days</h3>
              <div className="flex flex-wrap gap-2">
                {dayNames.map((day, index) => (
                  <button
                    key={day}
                    onClick={() => handleDayToggle(index)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${daysEnabled.includes(index)
                      ? 'bg-green-700 text-white hover:bg-green-800'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        <div className="text-sm text-gray-600 mt-2">
          <p>Notifications will help you maintain your streak by reminding you to complete your daily push-ups.</p>
        </div>
      </div>
    </div>
  )
}
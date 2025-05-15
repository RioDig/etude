import React from 'react'
import { useNotificationStore } from '@/entities/notification'
import { Notification } from './Notification'

/**
 * Контейнер для рендера уведомлений
 * Размещается в корне приложения и отображает все активные уведомления
 */
export const NotificationContainer: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications)

  if (notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 items-end">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          {...notification}
          onClose={() => {
            if (!notification.isLeaving) {
              useNotificationStore.getState().markAsLeaving(notification.id)
            }
          }}
        />
      ))}
    </div>
  )
}

import { useNotificationStore, NotificationItem } from '@/entities/notification'

type NotificationOptions = Omit<NotificationItem, 'id' | 'startTime' | 'variant'> & { id?: string }

export const notification = {
  success: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'success' }),

  error: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'error' }),

  info: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'info' }),

  base: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'base' }),

  dismiss: (id: string) => useNotificationStore.getState().markAsLeaving(id),

  dismissAll: () => useNotificationStore.getState().dismissAll()
}

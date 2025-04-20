import { useNotificationStore, NotificationItem } from '@/entities/notification';

// Тип с дополнительным опциональным id
type NotificationOptions = Omit<NotificationItem, "id" | "startTime" | "variant"> & { id?: string };

// Предоставляем удобный API для работы с уведомлениями в приложении
export const notification = {
  success: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'success' }),

  error: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'error' }),

  info: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'info' }),

  base: (options: NotificationOptions) =>
    useNotificationStore.getState().show({ ...options, variant: 'base' }),

  dismiss: (id: string) =>
    useNotificationStore.getState().markAsLeaving(id),

  dismissAll: () =>
    useNotificationStore.getState().dismissAll(),
};
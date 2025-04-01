import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { NotificationVariant } from '@/shared/ui/notification/types'
import React from "react";

// Определение типов
export interface NotificationItem {
  id: string;
  variant?: NotificationVariant;
  title: string;
  description?: string;
  action?: React.ReactNode;
  autoClose?: number | null;
  showTimer?: boolean;
  isLeaving?: boolean;
  startTime: number;
  endTime?: number;
  className?: string;
  testId?: string;
}

interface NotificationStore {
  notifications: NotificationItem[];

  // Действия
  show: (notification: Omit<NotificationItem, 'id' | 'startTime'> & { id?: string }) => string;
  dismiss: (id: string) => void;
  dismissAll: () => void;
  markAsLeaving: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set, get) => ({
      notifications: [],

      show: (notification) => {
        const id = notification.id || `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();
        const endTime = notification.autoClose ? startTime + notification.autoClose : undefined;

        const { notifications } = get();

        // Проверка на существующий id
        const existingIndex = notifications.findIndex(n => n.id === id);
        if (existingIndex !== -1) {
          set(state => ({
            notifications: state.notifications.map((item, index) =>
              index === existingIndex
                ? { ...notification, id, startTime, endTime }
                : item
            )
          }), false, { type: 'notification/update', id });
          return id;
        }

        // Обработка случая, когда уже есть 3 уведомления
        if (notifications.length >= 3) {
          // Находим последнее уведомление, которое нужно удалить
          const lastNotification = notifications[notifications.length - 1];

          // Помечаем последнее как уходящее для анимации
          set(state => ({
            notifications: state.notifications.map(note =>
              note.id === lastNotification.id
                ? { ...note, isLeaving: true }
                : note
            )
          }), false, { type: 'notification/markLastAsLeaving', id: lastNotification.id });

          // Добавляем новое уведомление сразу, чтобы оно появилось вверху списка
          set(state => ({
            notifications: [
              { ...notification, id, startTime, endTime },
              ...state.notifications
            ]
          }), false, { type: 'notification/addNew', id });

          // Удаляем последнее уведомление после завершения анимации
          setTimeout(() => {
            set(state => ({
              notifications: state.notifications.filter(note => note.id !== lastNotification.id)
            }), false, { type: 'notification/removeAfterAnimation', id: lastNotification.id });
          }, 300);

        } else {
          // Просто добавляем новое уведомление, если у нас меньше 3-х
          set(state => ({
            notifications: [
              { ...notification, id, startTime, endTime },
              ...state.notifications
            ]
          }), false, { type: 'notification/add', id });
        }

        return id;
      },

      dismiss: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }), false, { type: 'notification/dismiss', id });
      },

      markAsLeaving: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, isLeaving: true } : n
          )
        }), false, { type: 'notification/markAsLeaving', id });

        // Удаление после анимации
        setTimeout(() => {
          set(state => ({
            notifications: state.notifications.filter(n => n.id !== id)
          }), false, { type: 'notification/removeAfterLeaving', id });
        }, 300);
      },

      dismissAll: () => {
        // Помечаем все как уходящие
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isLeaving: true }))
        }), false, { type: 'notification/markAllAsLeaving' });

        // Удаляем все после анимации
        setTimeout(() => {
          set({ notifications: [] }, false, { type: 'notification/dismissAll' });
        }, 300);
      }
    }),
    { name: 'notification-store' }
  )
);
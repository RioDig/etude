// src/entities/profile/ui/UserInitials.tsx
import React from 'react'

import { User } from '@/shared/types'

// Функция для генерации уникального цвета на основе имени пользователя
const generateUserColor = (name: string, surname: string): string => {
  // Создаем простой хеш на основе имени и фамилии
  const nameHash = [...(name + surname)].reduce((acc, char) => acc + char.charCodeAt(0), 0) % 5

  // Таблица цветов из палитры 500 (синий, зеленый, фиолетовый, красный, желтый)
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500']

  return colors[nameHash]
}

interface UserInitialsProps {
  user: User
  className?: string
}

export const UserInitials: React.FC<UserInitialsProps> = ({ user, className }) => {
  const colorClass = generateUserColor(user.name, user.surname)

  return (
    <div
      className={`${colorClass} text-white rounded-[9.6px] h-[64px] w-[64px] flex items-center justify-center text-h2 ${className}`}
    >
      {user.name.charAt(0).toUpperCase()}
      {user.surname.charAt(0).toUpperCase()}
    </div>
  )
}

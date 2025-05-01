import { useEffect, useRef } from 'react'
import { useAuth } from '@/entities/session'
import { useSessionStore } from '@/entities/session/model/store'

export const useSessionCheck = () => {
  const { isAuthenticated } = useSessionStore()
  const { user, isLoading, refreshSession } = useAuth()
  const sessionCheckPerformed = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) return // если юзер не залогинен — ничего не делаем

    // Проверяем сессию только один раз за жизненный цикл компонента
    if (!sessionCheckPerformed.current && !isLoading) {
      sessionCheckPerformed.current = true

      // Проверяем, есть ли данные пользователя
      if (!user) {
        refreshSession().catch(console.error)
      }
    }
  }, [isAuthenticated, user, isLoading, refreshSession])
}

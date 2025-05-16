import { useEffect, useRef } from 'react'
import { useAuth } from '@/entities/session'
import { useSessionStore } from '@/entities/session/model/store'

export const useSessionCheck = () => {
  const { isAuthenticated } = useSessionStore()
  const { user, isLoading, refreshSession } = useAuth()
  const sessionCheckPerformed = useRef(false)

  useEffect(() => {
    if (!isAuthenticated) return

    if (!sessionCheckPerformed.current && !isLoading) {
      sessionCheckPerformed.current = true

      if (!user) {
        refreshSession().catch(console.error)
      }
    }
  }, [isAuthenticated, user, isLoading, refreshSession])
}

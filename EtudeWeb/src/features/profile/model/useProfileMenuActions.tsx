import { useCallback } from 'react'
import { useAuth } from '@/entities/session'
import { useNavigate } from 'react-router-dom'
import { Logout, Person } from '@mui/icons-material'

export const useProfileMenuActions = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Действия для авторизованного пользователя
  const getAuthenticatedActions = useCallback(() => {
    return [
      {
        label: 'Личный кабинет',
        onClick: () => navigate('/profile'),
        icon: <Person />
      }
    ]
  }, [navigate])

  // Действия для неавторизованного пользователя
  const getGuestActions = useCallback(() => {
    return [
      {
        label: 'Выйти из системы',
        onClick: () => navigate('/login'),
        icon: <Logout />
      }
    ]
  }, [navigate])

  // Предупреждающие действия (например, выход из системы)
  const getWarningActions = useCallback(() => {
    if (!isAuthenticated) return []

    return [
      {
        label: 'Выйти из системы',
        onClick: () => logout(),
        icon: <Logout />
      }
    ]
  }, [isAuthenticated, logout])

  return {
    defaultItems: isAuthenticated ? getAuthenticatedActions() : getGuestActions(),
    warningItems: getWarningActions()
  }
}

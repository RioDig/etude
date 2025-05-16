import { useCallback } from 'react'
import { useAuth } from '@/entities/session'
import { useNavigate } from 'react-router-dom'
import { Logout, Person, Dashboard } from '@mui/icons-material'
import { USER_ROLES } from '@/entities/user'

export const useProfileMenuActions = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const getAuthenticatedActions = useCallback(() => {
    const actions = [
      {
        label: 'Личный кабинет',
        onClick: () => navigate('/profile'),
        icon: <Person />
      }
    ]

    if (user?.role === USER_ROLES.admin) {
      actions.push({
        label: 'Администрирование',
        onClick: () => navigate('/admin'),
        icon: <Dashboard />
      })
    }

    return actions
  }, [navigate, user?.role])

  const getGuestActions = useCallback(() => {
    return [
      {
        label: 'Войти',
        onClick: () => navigate('/login'),
        icon: <Person />
      }
    ]
  }, [navigate])

  const getWarningActions = useCallback(() => {
    if (!isAuthenticated) return []

    return [
      {
        label: 'Выйти из системы',
        onClick: () => {
          logout()
          navigate('/login')
        },
        icon: <Logout />
      }
    ]
  }, [isAuthenticated, logout, navigate])

  return {
    defaultItems: isAuthenticated ? getAuthenticatedActions() : getGuestActions(),
    warningItems: getWarningActions()
  }
}

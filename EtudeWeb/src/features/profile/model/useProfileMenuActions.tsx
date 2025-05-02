import { useCallback } from 'react'
import { useAuth } from '@/entities/session'
import { useNavigate } from 'react-router-dom'
import { Logout, Person, Settings, Dashboard } from '@mui/icons-material'
import { USER_ROLES } from '@/entities/user'

export const useProfileMenuActions = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Действия для авторизованного пользователя
  const getAuthenticatedActions = useCallback(() => {
    const actions = [
      {
        label: 'Личный кабинет',
        onClick: () => navigate('/profile'),
        icon: <Person />
      },
      // {
      //   label: 'Настройки',
      //   onClick: () => navigate('/settings'),
      //   icon: <Settings />
      // }
    ]

    // Если пользователь админ, добавляем ссылку на админ-панель
    if (user?.role === USER_ROLES.admin) {
      actions.push({
        label: 'Администрирование',
        onClick: () => navigate('/admin'),
        icon: <Dashboard />
      })
    }

    return actions
  }, [navigate, user?.role])

  // Действия для неавторизованного пользователя
  const getGuestActions = useCallback(() => {
    return [
      {
        label: 'Войти',
        onClick: () => navigate('/login'),
        icon: <Person />
      }
    ]
  }, [navigate])

  // Предупреждающие действия (например, выход из системы)
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

import React from 'react'
import { Navigate, Routes, Route, useLocation, NavLink } from 'react-router-dom'
import { Container } from '@/shared/ui/container'
import { Typography } from '@/shared/ui/typography'
import { TemplatesPage } from './TemplatesPage'
import { StatusesPage } from './StatusesPage'
import { ReportsPage } from './ReportsPage'
import clsx from 'clsx'

export const AdminPage: React.FC = () => {
  const location = useLocation()

  // Определяем активную вкладку на основе пути
  const activePath = location.pathname.split('/').pop()

  // Навигационные элементы
  const navItems = [
    { path: 'templates', label: 'Шаблоны курсов' },
    { path: 'statuses', label: 'Дополнительные статусы' },
    { path: 'reports', label: 'Отчетность' }
  ]

  return (
    <Container className="flex flex-col gap-6 h-full">
      {/* Заголовок */}
      <Typography variant="h2">Администрирование</Typography>

      {/* Навигация по вкладкам */}
      <div className="flex gap-1 border-b border-mono-300">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'px-4 py-2 text-b3-regular transition-colors',
                isActive || activePath === item.path
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-mono-700 hover:text-mono-900'
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {/* Содержимое страницы */}
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route index element={<Navigate to="templates" replace />} />
          <Route path="templates" element={<TemplatesPage />} />
          <Route path="statuses" element={<StatusesPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </Container>
  )
}
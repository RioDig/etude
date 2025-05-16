import React from 'react'
import { Navigate, Routes, Route, useLocation, Link } from 'react-router-dom'

import { TemplatesPage } from './TemplatesPage'
import { StatusesPage } from './StatusesPage'
import { ReportsPage } from './ReportsPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import clsx from 'clsx'

export const AdminPage: React.FC = () => {
  const location = useLocation()

  const activePath = location.pathname.split('/admin/')[1] || 'templates'

  const navItems = [
    { path: 'templates', label: 'Шаблоны курсов' },
    { path: 'statuses', label: 'Дополнительные статусы' },
    { path: 'reports', label: 'Отчетность' }
  ]

  return (
    <div className="flex h-full bg-mono-25 flex-1 overflow-hidden">
      <div className="flex flex-col gap-2 p-4 border-r-[1px] border-mono-300 min-w-[280px]">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={`/admin/${item.path}`}
            className={clsx(
              'px-4 py-3.5 rounded-md transition-colors w-full',
              activePath === item.path
                ? 'bg-mono-200 text-mono-950 text-b3-regular font-medium'
                : 'text-mono-950 text-b3-regular hover:bg-mono-100 font-medium'
            )}
          >
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col flex-1 min-h-0">
        <div className="w-full !bg-mono-25 p-8 max-h-full h-full">
          <Routes>
            <Route index element={<Navigate to="templates" replace />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="statuses" element={<StatusesPage />} />
            <Route path="reports" element={<ReportsPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import BaseLayout from '@/app/layouts/BaseLayout.tsx'

import { TestCalendarPage } from '@/pages/testCalendarPage'
import { TestButtonPage } from '@/pages/testButtonPage'
import { TestHintPage } from '@/pages/testHintPage'
import { TestTypographyPage } from '@/pages/testTypographyPage'
import { TestBadgePage } from '@/pages/testBadgePage'
import { TestControlPage } from '@/pages/testControlPage'
import { TestCheckboxPage } from '@/pages/testCheckboxPage'
import { TestDropdownMenuPage } from '@/pages/testDropdownmenuPage'
import { TestCounterPage } from '@/pages/testCounterPage'
import { TestSwitchPage } from '@/pages/testSwitchPage'
import { TestEmptyMessagePage } from '@/pages/testEmptyMessagePage'
import { TestStepperPage } from '@/pages/testStepperPage'
import { TestNotificationPage } from '@/pages/testNotificationPage'
import { TestFilterPage } from '@/pages/testFilterPage'
import { TestModalPage } from '@/pages/testModalPage'
import { TestTablePage } from '@/pages/testTablePage'
import { TestSidebarPage } from '@/pages/testSidebarPage'
import { TestEventCardPage } from '@/pages/testEventCardPage'
import { TestMainPage } from '@/pages/testMainPage'
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForbiddenPage } from '@/pages/errors/ForbiddenPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import { PublicRoute } from '@/shared/routes/PublicRoute'

const router = createBrowserRouter([
  // Публичные маршруты
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    )
  },
  {
    path: '/forbidden',
    element: <ForbiddenPage />
  },
  {
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <TestMainPage />
          </ProtectedRoute>
        )
      },
      { path: '/test-button', element: <TestButtonPage /> },
      { path: '/test-hint', element: <TestHintPage /> },
      { path: '/test-typography', element: <TestTypographyPage /> },
      { path: '/test-badge', element: <TestBadgePage /> },
      { path: '/test-control', element: <TestControlPage /> },
      { path: '/test-checkbox', element: <TestCheckboxPage /> },
      { path: '/test-dropdownmenu', element: <TestDropdownMenuPage /> },
      { path: '/test-counter', element: <TestCounterPage /> },
      { path: '/test-switch', element: <TestSwitchPage /> },
      { path: '/test-emptymessage', element: <TestEmptyMessagePage /> },
      { path: '/test-stepper', element: <TestStepperPage /> },
      { path: '/test-notification', element: <TestNotificationPage /> },
      { path: '/test-filter', element: <TestFilterPage /> },
      { path: '/test-modal', element: <TestModalPage /> },
      { path: '/test-table', element: <TestTablePage /> },
      { path: '/test-sidebar', element: <TestSidebarPage /> },
      { path: '/test-eventcard', element: <TestEventCardPage /> },
      { path: '/test-calendar', element: <TestCalendarPage /> }
    ]
  }
])

export const withRouter = () => () => {
  return <RouterProvider router={router} />
}

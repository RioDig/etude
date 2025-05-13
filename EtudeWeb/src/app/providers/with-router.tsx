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
import { MainPage } from '@/pages/main'
import { ProfilePage } from '@/pages/profile'
import { AdminRoute, ProtectedRoute } from '@/shared/routes/ProtectedRoute'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ApplicationCreatePage } from '@/pages/application/ApplicationCreatePage'

import { ForbiddenPage } from '@/pages/errors/ForbiddenPage'
import { NotFoundPage } from '@/pages/errors/NotFoundPage'
import { PublicRoute } from '@/shared/routes/PublicRoute'
import { EventsPage } from '@/pages/events'
import { AdminPage } from '@/pages/admin'

const router = createBrowserRouter([
  // Публичные маршруты
  {
    element: <BaseLayout isNotLayoutPage={true} />,
    errorElement: <NotFoundPage />,
    children: [
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
      }
    ]
  },

  {
    element: <BaseLayout isNotLayoutPage={true} isAdminPage={true} />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/admin/*',
        element: (
          // <AdminRoute>
          //   <AdminPage />
          // </AdminRoute>
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        )
      },
    ]
  },

  // Защищенные маршруты
  {
    element: <BaseLayout />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/profile',
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/applications/new',
        element: (
          <ProtectedRoute>
            <ApplicationCreatePage />
          </ProtectedRoute>
        )
      },
      {
        path: '/applications',
        element: (
          <ProtectedRoute>
            <EventsPage />
          </ProtectedRoute>
        )
      },
      {
        path: '/test-button',
        element: (
          <ProtectedRoute>
            <TestButtonPage />
          </ProtectedRoute>
        )
      },
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

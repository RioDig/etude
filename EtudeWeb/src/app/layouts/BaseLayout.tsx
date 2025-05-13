import '../styles/App.css'
import { Outlet } from 'react-router-dom'
import { NotificationContainer } from '@/shared/ui/notification'
import { Header } from '@/widgets/header'
import clsx from 'clsx'

type Props = {
  isNotLayoutPage?: boolean
  isAdminPage?: boolean
}

function BaseLayout({ isNotLayoutPage = false, isAdminPage = false }: Props) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {Boolean(!isNotLayoutPage || isAdminPage) && (
        <Header notificationsCount={5} className="sticky top-0 z-50 bg-white" />
      )}

      <main className={clsx('flex-1 overflow-auto bg-mono-100', !isNotLayoutPage && 'p-8')}>
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  )
}

export default BaseLayout

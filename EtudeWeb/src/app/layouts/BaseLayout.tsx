import '../styles/App.css'
import { Outlet } from 'react-router-dom'
import { NotificationContainer } from '@/shared/ui/notification'
import { Header } from '@/widgets/header'
import clsx from 'clsx'

type Props = {
  isAuthPage?: boolean
}

function BaseLayout({ isAuthPage = false }: Props) {
  return (
    <div className="flex flex-col min-h-screen w-full">
      {Boolean(!isAuthPage) && (
        <Header notificationsCount={5} className="sticky top-0 z-50 bg-white" />
      )}

      <main className={clsx('flex-1 overflow-auto bg-mono-100', !isAuthPage && 'p-8')}>
        <Outlet />
      </main>
      <NotificationContainer />
    </div>
  )
}

export default BaseLayout

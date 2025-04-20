import React from 'react'
import { Notifications } from '@mui/icons-material'
import { Button } from '@/shared/ui/button'

interface HeaderNotificationsProps {
  count: number
  onClick?: () => void
}

export const HeaderNotifications: React.FC<HeaderNotificationsProps> = ({ count, onClick }) => {
  return (
    <Button variant="third" onClick={onClick} className="">
      <Notifications />
    </Button>
  )
}

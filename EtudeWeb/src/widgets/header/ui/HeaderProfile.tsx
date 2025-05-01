import React, { useState, useRef } from 'react'
import { Button } from '@/shared/ui/button'
import { DropdownMenu } from '@/shared/ui/dropdownmenu'
import { KeyboardArrowDown, Person } from '@mui/icons-material'
import { useAuth } from '@/entities/session'
import { useProfileMenuActions } from '@/features/profile/model/useProfileMenuActions'

export const HeaderProfile: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Используем хук для получения данных о пользователе
  const { user, isAuthenticated } = useAuth()
  const { defaultItems, warningItems } = useProfileMenuActions()

  const fullName = isAuthenticated && user ? `${user.surname} ${user.name}` : 'Гость'

  const handleToggle = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen)
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div>
      <Button
        ref={buttonRef}
        variant="secondary"
        onClick={handleToggle}
        rightIcon={<KeyboardArrowDown />}
        leftIcon={<Person />}
        className="relative leading-none"
      >
        {fullName}
      </Button>

      <DropdownMenu
        open={isOpen}
        onClose={handleClose}
        anchorEl={buttonRef.current}
        position="bottom-right"
        defaultItems={defaultItems}
        warningItems={warningItems}
      />
    </div>
  )
}

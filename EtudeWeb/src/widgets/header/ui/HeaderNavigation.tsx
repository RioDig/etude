import React from 'react'
import { NavItem } from '../model/types'
import { Button } from '@/shared/ui/button'

interface HeaderNavigationProps {
  items: NavItem[]
  onItemClick?: (item: NavItem) => void
}

export const HeaderNavigation: React.FC<HeaderNavigationProps> = ({ items }) => {
  return (
    <nav className="flex gap-1">
      {items.map((item) => {
        return (
          <Button
            key={item.id}
            variant={item.variant}
            to={item.to}
            as="button"
            leftIcon={item.icon}
            className={'leading-none'}
          >
            {item.label}
          </Button>
        )
      })}
    </nav>
  )
}

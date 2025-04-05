import React from 'react';
import { HeaderLogo } from './HeaderLogo';
import { HeaderNavigation } from './HeaderNavigation';
import { HeaderNotifications } from './HeaderNotifications';
import { HeaderProfile } from './HeaderProfile';
import { NavItem } from '../model/types';
import { useNavItems } from "@/features/navigation";

export interface HeaderProps {
  onNavItemClick?: (item: NavItem) => void;
  notificationsCount?: number;
  onNotificationsClick?: () => void;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onNavItemClick,
  notificationsCount = 0,
  onNotificationsClick,
  className,
}) => {
  const navItems = useNavItems();

  return (
    <header className={`h-[72px] w-full border-b border-mono-300 px-4 flex items-center justify-between ${className || ''}`}>
      <div className="flex items-center gap-4">
        <HeaderLogo />
        <HeaderNavigation items={navItems} onItemClick={onNavItemClick} />
      </div>

      <div className="flex items-center gap-4">
        <HeaderNotifications count={notificationsCount} onClick={onNotificationsClick} />
        <HeaderProfile />
      </div>
    </header>
  );
};
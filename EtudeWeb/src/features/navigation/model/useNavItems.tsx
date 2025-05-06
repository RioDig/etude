import { NavItem } from '@/widgets/header';
import { USER_ROLES } from "@/entities/user";
import { AdminPanelSettings, School, Add, Folder } from '@mui/icons-material'
import { useAuth } from "@/entities/session";
import { useCallback } from "react";

export const useNavItems = (): NavItem[] => {
  const { user, isAuthenticated } = useAuth();

  const getNavItems = useCallback(() => {
    if (!isAuthenticated || !user) {
      return []; // Если пользователь не авторизован, не показываем кнопки
    }

    const items: NavItem[] = [];

    // Общие пункты для всех авторизованных пользователей
    items.push({
      id: 'new-application',
      label: 'Новое заявление',
      icon: <Add />,
      to: '/applications/new',
      variant: 'primary'
    });

    items.push({
      id: 'applications',
      label: 'Обучения',
      icon: <Folder />,
      to: '/applications',
      variant: 'third'
    });

    // Пункты только для администраторов
    if (user.role === USER_ROLES.admin) {
      items.push({
        id: 'admin',
        label: 'Администрирование',
        icon: <AdminPanelSettings />,
        to: '/admin',
        variant: 'third'
      });
    }

    return items;
  }, [isAuthenticated, user]);

  return getNavItems();
};
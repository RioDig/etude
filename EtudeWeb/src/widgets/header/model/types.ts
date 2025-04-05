import { ReactElement } from 'react';
import { SvgIconProps } from '@mui/material';

export interface NavItem {
  id: string;
  label: string;
  icon?: ReactElement<SvgIconProps>;
  to?: string;
  permissions?: string[]; // можно использовать для проверки прав доступа
  variant?: "primary" | "secondary" | "third";
}
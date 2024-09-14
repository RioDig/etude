import styles from "./styles.module.scss";
import React from "react";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import cn from "classnames";


export enum BadgeType {
  red = 'red',
  green = 'green',
  orange = 'orange',
  yellow = 'yellow',
  gray = 'gray',
}

interface IBadge {
  type?: BadgeType;
  color?: string;
  children?: React.ReactNode;
  BeforeBadgeIcon?: OverridableComponent<SvgIconTypeMap>;
  AfterBadgeIcon?: OverridableComponent<SvgIconTypeMap>;
}

export const Badge = ({
  type,
  color,
  children,
  BeforeBadgeIcon,
  AfterBadgeIcon,
}: IBadge) => {
  const badgeClassName = cn(
    styles.root,
    {
      'bg-red-200': type === BadgeType.red,
      'bg-green-300': type === BadgeType.green,
      'bg-orange-300': type === BadgeType.orange,
      'bg-yellow-250': type === BadgeType.yellow,
      'bg-gray-200': type === BadgeType.gray,
    },
  )

  return (
    <span
      className={badgeClassName}
      style={{ backgroundColor: color }}
    >
      {BeforeBadgeIcon && <BeforeBadgeIcon style={{ height: 12, width: 12 }} />}
      {children}
      {AfterBadgeIcon && <AfterBadgeIcon style={{ height: 12, width: 12 }} />}
    </span>
  )
}
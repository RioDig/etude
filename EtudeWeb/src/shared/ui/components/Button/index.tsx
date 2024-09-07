import cn from 'classnames';

import styles from './styles.module.scss';
import React from "react";
import { Link } from "react-router-dom";

export enum ButtonType {
  button = 'button',
  submit = 'submit',
}

export enum ButtonSize {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export enum DisplayMode {
  primary = 'primary',
  secondary = 'secondary',
  approve = 'approve',
  deny = 'deny',
  third = 'third',
}

interface IButton {
  type?: ButtonType;
  disabled?: boolean;
  className?: string;
  link?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  testId?: string;
  size?: ButtonSize;
  displayMode?: DisplayMode;
  BeforeButtonIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  AfterButtonIcon?: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
}

export const Button = ({
  type = ButtonType.button,
  disabled = false,
  className,
  link,
  onClick,
  children,
  testId,
  size = ButtonSize.large,
  displayMode = DisplayMode.primary,
  BeforeButtonIcon,
  AfterButtonIcon,
}: IButton) => {
  const buttonClassName = cn(
    styles.root,
    {
      [styles.large]: size === ButtonSize.large,
      [styles.medium]: size === ButtonSize.medium,
      [styles.small]: size === ButtonSize.small,
    },
    {
      [styles.primary]: displayMode === DisplayMode.primary,
      [styles.secondary]: displayMode === DisplayMode.secondary,
      [styles.approve]: displayMode === DisplayMode.approve,
      [styles.deny]: displayMode === DisplayMode.deny,
      [styles.third]: displayMode === DisplayMode.third,
    },
    className,
  );

  const button = (
    <button
      className={buttonClassName}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-testid={testId}
    >
      {BeforeButtonIcon && <BeforeButtonIcon />}
      {children}
      {AfterButtonIcon && <AfterButtonIcon />}
    </button>
  )

  if (link) {
    return (
      <Link to={link} className={styles.linkContainer}>
        {button}
      </Link>
    )
  }

  return button
}
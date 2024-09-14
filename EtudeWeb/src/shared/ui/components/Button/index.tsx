import cn from 'classnames';

import styles from './styles.module.scss';
import React from "react";
import { Link } from "react-router-dom";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material/SvgIcon/SvgIcon";
import { createTheme, ThemeProvider } from "@mui/material";

const theme = createTheme({
  components: {
    MuiSvgIcon: {
      styleOverrides: {
        fontSizeLarge: {
          fontSize: '2rem'
        }
      }
    }
  }
})

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
  BeforeButtonIcon?: OverridableComponent<SvgIconTypeMap>;
  AfterButtonIcon?: OverridableComponent<SvgIconTypeMap>;
}

export const Button = ({
  type = ButtonType.button,
  disabled = false,
  className,
  link,
  onClick,
  children,
  testId,
  size = ButtonSize.medium,
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
    <ThemeProvider theme={theme}>
      <button
        className={buttonClassName}
        type={type}
        onClick={onClick}
        disabled={disabled}
        data-testid={testId}
      >
        {BeforeButtonIcon && <BeforeButtonIcon fontSize={size} />}
        {children}
        {AfterButtonIcon && <AfterButtonIcon fontSize={size}/>}
      </button>
    </ThemeProvider>
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
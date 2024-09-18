import styles from './styles.module.scss';
import cn from "classnames";
import React, { FC, InputHTMLAttributes } from "react";
import { Tooltip } from "@mui/material";
import { Info } from "@mui/icons-material";

export enum CheckboxSize {
  large = 'large',
  small = 'small',
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  description?: React.ReactNode;
  disabled?: boolean;
  checkboxSize?: CheckboxSize;
  tooltipText?: string;
  className?: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  description,
  disabled = false,
  className,
  checkboxSize = CheckboxSize.large,
  tooltipText = '',
  ...rest
}) => {
  const checkboxClassName = cn(
    styles.root,
    {
      [styles.large]: checkboxSize === CheckboxSize.large,
      [styles.small]: checkboxSize === CheckboxSize.small,
    },
    disabled && styles.disabled,
    className,
  );

  return (
    <label className={checkboxClassName}>
      <input
        type="checkbox"
        disabled={disabled}
        {...rest}
      />
      <div className={styles.description}>{description || ""}</div>
      {tooltipText &&
        <Tooltip title={tooltipText} className={styles.tooltip}>
          <Info className={'tooltip-icon'} />
        </Tooltip>
      }
    </label>
  )
}
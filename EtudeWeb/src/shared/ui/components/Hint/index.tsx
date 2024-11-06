import React, { useEffect, useRef, useState } from 'react';
import { Button, IButton } from "../Button";
import cn from "classnames";
import styles from "../Hint/styles.module.scss";

const HOVER_DELAY = 200;

interface Badge {
  text: string;
}

interface IHint {
  className?: string;
  badges?: Badge[];
  title?: string,
  description?: string,
  button?: IButton;
  children?: React.ReactNode;
}


export const Hint = ({
  children,
  className,
  badges,
  title,
  description,
  button,
}: IHint) => {
  const [hover, setHover] = useState(false);
  const [isTooltipHovered, setIsTooltipHovered] = useState(false);
  const tooltipContentRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setTimeout(() => {
      setHover(true);
    }, HOVER_DELAY);
  };

  const handleMouseLeave = () => {
    setTimeout(()=> {
      setHover(false);
    }, HOVER_DELAY);
  };

  const handleTooltipEnter = () => {
    setIsTooltipHovered(true);
  };

  const handleTooltipLeave = () => {
    setIsTooltipHovered(false);
    setHover(false);
  };

  const updateTooltipPosition = () => {
    if (tooltipContentRef.current && tooltipRef.current) {
      const rect = tooltipContentRef.current.getBoundingClientRect();

      const { top, left, right } = rect;
      const padding = 40;

      // Overflow from left side
      if (left < padding) {
        const newLeft = Math.abs(left) + padding;
        tooltipContentRef.current.style.left = `${newLeft}px`;
      }
      // Overflow from right side
      else if (right + padding > window.innerWidth) {
        const newRight = right + padding - window.innerWidth;
        tooltipContentRef.current.style.right = `${newRight}px`;
      }

      // Overflow from top side
      if (top < 0) {
        tooltipRef.current.style.top = 'unset';
        tooltipRef.current.style.bottom = '0';
        tooltipRef.current.style.transform = 'translate(-50%, calc(100% + 10px))';
      }
    }
  };

  // Update position on hover
  useEffect(() => {
    if (hover || isTooltipHovered) {
      updateTooltipPosition();
    }
  }, [hover, isTooltipHovered]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (hover || isTooltipHovered) {
        updateTooltipPosition();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hover, isTooltipHovered]);

  const hintClassName = cn(
    styles.root,
    className
  )

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-flex flex-col items-center">
      {(hover || isTooltipHovered) && (
        <div
          ref={tooltipRef}
          // className='absolute left-0 top-0 mx-auto flex w-full items-center justify-center gap-0  [transform:translateY(calc(-100%-10px))] [z-index:999999];'
          className='absolute left-1/2 top-0 mx-auto flex items-center justify-center gap-0 w-max transform -translate-x-1/2 -translate-y-[calc(100%+10px)] z-[999999]'
          onMouseEnter={handleTooltipEnter}
          onMouseLeave={handleTooltipLeave}
        >
          <div
            className={hintClassName}
            ref={tooltipContentRef}
          >
            {badges ?
              <div className={'flex gap-2 flex-wrap [z-index:999999]'}>
                {badges?.map((badge, index) => (
                  <span key={index} className={'bg-gray-150 rounded-lg px-2 py-1 text-sm font-normal'}>
                    {badge.text}
                  </span>
                ))}
              </div> : ''
            }
            <div className={'flex gap-1 flex-col items-start text-sm'}>
              {title && <div className={'text-gray-900 text-start'}>{title}</div>}
              {description && <div className={'text-gray-300 text-start'}>{description}</div>}
            </div>
            {button && <Button {...button} />}
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import { CheckCircle, Error, Info, AccessTime, Close } from '@mui/icons-material'
import { SvgIconProps } from '@mui/material'
import { Button } from '@/shared/ui/button'
import { notification } from '@/shared/lib/notification'
import { NotificationProps } from './types'

/**
 * Компонент Notification - уведомление в верхнем углу экрана
 */
export const Notification: React.FC<NotificationProps> = ({
  variant = 'base',
  title,
  description,
  action,
  onClose,
  autoClose,
  showTimer = true,
  className,
  testId = 'notification',
  isLeaving = false,
  id,
  startTime: initialStartTime,
  endTime: initialEndTime
}) => {
  const defaultAutoClose = action ? 7000 : 3000
  const autoCloseTime = autoClose === undefined ? defaultAutoClose : autoClose

  const [timeLeft, setTimeLeft] = useState(
    initialEndTime && autoCloseTime !== null
      ? Math.max(0, initialEndTime - Date.now())
      : autoCloseTime
  )
  const [animateLeaving, setAnimateLeaving] = useState(isLeaving)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const startTimeRef = useRef<number>(initialStartTime || Date.now())
  const endTimeRef = useRef<number>(initialEndTime || startTimeRef.current + (autoCloseTime || 0))

  useEffect(() => {
    if (isLeaving !== animateLeaving) {
      setAnimateLeaving(isLeaving)
    }
  }, [isLeaving, animateLeaving])

  const getVariantConfig = (): { icon: React.ReactElement<SvgIconProps>; color: string } => {
    switch (variant) {
      case 'success':
        return {
          icon: <CheckCircle fontSize="small" className="text-green-600" />,
          color: 'bg-green-600'
        }
      case 'error':
        return {
          icon: <Error fontSize="small" className="text-red-500" />,
          color: 'bg-red-500'
        }
      case 'info':
        return {
          icon: <Info fontSize="small" className="text-blue-500" />,
          color: 'bg-blue-500'
        }
      case 'base':
      default:
        return {
          icon: <AccessTime fontSize="small" className="text-mono-950" />,
          color: 'bg-mono-950'
        }
    }
  }

  const { icon, color } = getVariantConfig()

  useEffect(() => {
    if (autoCloseTime === null || animateLeaving) return

    if (initialEndTime) {
      endTimeRef.current = initialEndTime
    } else {
      startTimeRef.current = Date.now()
      endTimeRef.current = startTimeRef.current + autoCloseTime
    }

    const remaining = Math.max(0, endTimeRef.current - Date.now())
    setTimeLeft(remaining)

    timerRef.current = setInterval(() => {
      const now = Date.now()
      const currentRemaining = Math.max(0, endTimeRef.current - now)

      setTimeLeft(currentRemaining)

      if (currentRemaining <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current)
          timerRef.current = null
        }

        if (id) {
          notification.dismiss(id)
        } else {
          setAnimateLeaving(true)
          setTimeout(() => {
            onClose()
          }, 300)
        }
      }
    }, 100)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  const handleClose = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (id) {
      notification.dismiss(id)
    } else {
      setAnimateLeaving(true)
      setTimeout(() => {
        onClose()
      }, 300)
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const timerWidth = autoCloseTime ? (timeLeft / autoCloseTime) * 100 : 0

  return (
    <div
      className={clsx(
        'bg-white rounded-[4px]',
        'shadow-[-5px_0px_35.5px_0px_rgba(0,0,0,0.10)]',
        'overflow-hidden',
        'transition-opacity duration-300',
        'w-fit max-w-[480px]',
        animateLeaving ? 'opacity-0' : 'opacity-100',
        className
      )}
      style={{
        transform: animateLeaving ? 'translateX(16px)' : 'translateX(0)',
        transition: 'transform 300ms, opacity 300ms'
      }}
      data-testid={testId}
    >
      <div className={clsx('h-[4px] w-full', color)}>
        {showTimer && autoCloseTime !== null && (
          <div
            className="h-full bg-white opacity-30"
            style={{
              width: `${100 - timerWidth}%`,
              float: 'right',
              transition: 'width 100ms linear'
            }}
          />
        )}
      </div>

      <div className="p-[16px_16px_20px_16px] flex">
        <div className="flex flex-col items-start flex-grow">
          <div className="flex flex-col w-full">
            {/* Иконка и заголовок */}
            <div className="flex items-start">
              <div className="mt-[-1px]">
                {React.cloneElement(icon, { sx: { width: 20, height: 20, flexShrink: 0 } })}
              </div>
              <h3 className="ml-3 text-b3-semibold text-mono-950 text-left">{title}</h3>
            </div>

            {description && (
              <div className="mt-3 text-b4-regular text-mono-950 max-w-[400px] text-left">
                {description}
              </div>
            )}
          </div>

          {action && <div className="mt-4">{action}</div>}
        </div>

        <Button
          variant="third"
          size="small"
          className="ml-2 hover:bg-transparent hover:border-transparent !px-0 !py-0 group h-fit flex-shrink-0"
          onClick={handleClose}
          aria-label="Закрыть уведомление"
        >
          <Close
            sx={{ width: 24, height: 24 }}
            className="text-mono-600 group-hover:text-mono-900"
          />
        </Button>
      </div>
    </div>
  )
}

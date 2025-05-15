import React from 'react'
import clsx from 'clsx'

export interface Step {
  /**
   * Название этапа
   */
  label: string
}

export interface StepperProps {
  /**
   * Массив этапов
   */
  steps: Step[]

  /**
   * Индекс текущего активного этапа (начиная с 0)
   */
  activeStep: number

  /**
   * Дополнительные CSS классы для контейнера
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент Stepper - отображает прогресс по этапам с визуальным индикатором текущего этапа
 */
export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  className,
  testId = 'stepper'
}) => {
  const safeActiveStep = Math.max(0, Math.min(activeStep, steps.length - 1))

  return (
    <div className={clsx('', className)} data-testid={testId}>
      <div className="flex items-center mb-2">
        <div className="text-b3-regular text-mono-600 font-medium">
          Этап {safeActiveStep + 1} из {steps.length}
        </div>
      </div>

      <div className="flex gap-4 flex-wrap">
        {steps.map((step, index) => {
          const isActive = index === safeActiveStep
          const isPast = index < safeActiveStep
          // const isFuture = index > safeActiveStep;

          const progressBarColor = isActive
            ? 'bg-blue-500'
            : isPast
              ? 'bg-green-500'
              : 'bg-mono-300'

          return (
            <div
              key={index}
              className="flex flex-col flex-1 text-left"
              data-testid={`${testId}-step-${index}`}
            >
              <div className={clsx('h-2 rounded-xl mb-1.5 w-36', progressBarColor)} />

              <div className="text-b4-regular text-mono-950">{step.label}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Stepper

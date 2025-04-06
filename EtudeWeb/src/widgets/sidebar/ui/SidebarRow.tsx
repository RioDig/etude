import React, { ReactNode } from 'react'
import clsx from 'clsx'

export interface SidebarRowProps {
  /**
   * Метка строки (левая часть)
   */
  label: string

  /**
   * Содержимое строки (правая часть)
   * Может быть текстом, тегом, кнопкой или другим компонентом
   */
  children: ReactNode

  /**
   * Дополнительные CSS классы
   */
  className?: string

  /**
   * ID для тестирования
   */
  testId?: string
}

/**
 * Компонент SidebarRow - строка внутри тела сайдбара с меткой слева и содержимым справа
 */
export const SidebarRow: React.FC<SidebarRowProps> = ({
  label,
  children,
  className,
  testId = 'sidebar-row'
}) => {
  return (
    <div className={clsx('flex items-start mb-4 max-w-full', className)} data-testid={testId}>
      <div className="w-[160px] min-w-[160px] text-b3-regular text-mono-600">{label}</div>
      <div className="ml-4 flex-1 text-b3-regular text-mono-950">{children}</div>
    </div>
  )
}

export default SidebarRow

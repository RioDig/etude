import React from 'react'
import clsx from 'clsx'

export interface ContainerProps {
  children: React.ReactNode
  className?: string
}

export const Container: React.FC<ContainerProps> = ({ children, className }) => {
  const containerClassNames = 'bg-white shadow-[0px_0px_10px_0px_rgba(0,_0,_0,_0.03)] p-6 rounded-lg overflow-visible'

  return <div className={clsx(className, containerClassNames)}>{children}</div>
}


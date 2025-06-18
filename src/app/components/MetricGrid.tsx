'use client'

import { ReactNode } from 'react'

interface MetricGridProps {
  children: ReactNode
  columns: 1 | 2 | 3
  gap?: 'sm' | 'md' | 'lg'
  className?: string
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-3',
}

const gapClasses = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
}

export default function MetricGrid({
  children,
  columns,
  gap = 'md',
  className = '',
}: MetricGridProps) {
  return (
    <div
      className={`
      grid ${columnClasses[columns]} ${gapClasses[gap]}
      ${className}
    `}
    >
      {children}
    </div>
  )
}

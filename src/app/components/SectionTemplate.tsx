'use client'

import { ReactNode } from 'react'

interface SectionTemplateProps {
  title: string
  subtitle?: string
  children: ReactNode
  isVisible: boolean
  className?: string
}

export default function SectionTemplate({
  title,
  subtitle,
  children,
  isVisible,
  className = '',
}: SectionTemplateProps) {
  return (
    <div
      className={`
      text-center space-y-6 transition-all duration-700 absolute inset-x-0
      ${
        isVisible
          ? 'opacity-100 transform translate-y-0 pointer-events-auto'
          : 'opacity-0 transform -translate-y-4 pointer-events-none'
      }
      ${className}
    `}
    >
      {/* Section Content */}
      <div className="space-y-6">{children}</div>
    </div>
  )
}

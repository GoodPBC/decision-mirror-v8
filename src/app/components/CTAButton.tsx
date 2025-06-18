'use client'

interface CTAButtonProps {
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  isVisible?: boolean
  pulse?: boolean
  className?: string
}

const variantClasses = {
  primary: 'bg-purple-600 hover:bg-purple-700 text-white',
  secondary: 'bg-gray-600 hover:bg-gray-700 text-white border border-gray-500',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

export default function CTAButton({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  isVisible = true,
  pulse = false,
  className = '',
}: CTAButtonProps) {
  return (
    <div
      className={`pt-6 transition-all duration-500 ${
        isVisible
          ? 'opacity-100 transform translate-y-0'
          : 'opacity-0 transform translate-y-4'
      }`}
    >
      <button
        onClick={onClick}
        className={`
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          rounded-lg font-normal transition-colors
          ${pulse ? 'animate-pulse' : ''}
          ${className}
        `}
      >
        {children}
      </button>
    </div>
  )
}

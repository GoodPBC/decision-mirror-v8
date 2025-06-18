'use client'

interface StatCardProps {
  value: number | string
  label: string
  subtitle?: string
  size: 'sm' | 'md' | 'lg' | 'xl'
  variant: 'blue' | 'purple' | 'orange' | 'yellow' | 'red' | 'gray'
  icon?: string
  pulse?: boolean
  animated?: boolean
  className?: string
}

const sizeClasses = {
  sm: {
    container: 'p-4',
    value: 'text-2xl',
    label: 'text-sm',
    subtitle: 'text-xs',
    icon: 'text-2xl mb-1',
  },
  md: {
    container: 'p-6',
    value: 'text-4xl',
    label: 'text-sm',
    subtitle: 'text-xs',
    icon: 'text-3xl mb-2',
  },
  lg: {
    container: 'p-8',
    value: 'text-5xl',
    label: 'text-base',
    subtitle: 'text-sm',
    icon: 'text-4xl mb-3',
  },
  xl: {
    container: 'p-10',
    value: 'text-7xl',
    label: 'text-2xl',
    subtitle: 'text-lg',
    icon: 'text-6xl mb-4',
  },
}

const variantClasses = {
  blue: {
    background: 'bg-gradient-to-br from-blue-600 to-blue-800',
    text: 'text-white',
    label: 'text-blue-200',
    subtitle: 'text-blue-300/70',
    glow: 'bg-blue-400',
    hover: 'hover:from-blue-500 hover:to-blue-700',
  },
  purple: {
    background: 'bg-gradient-to-br from-purple-600 to-purple-800',
    text: 'text-white',
    label: 'text-purple-200',
    subtitle: 'text-purple-300/70',
    glow: 'bg-purple-400',
    hover: 'hover:from-purple-500 hover:to-purple-700',
  },
  orange: {
    background: 'bg-gradient-to-br from-orange-600 to-orange-800',
    text: 'text-white',
    label: 'text-orange-200',
    subtitle: 'text-orange-300/70',
    glow: 'bg-orange-400',
    hover: 'hover:from-orange-500 hover:to-orange-700',
  },
  yellow: {
    background: 'bg-gradient-to-br from-yellow-500 to-amber-700',
    text: 'text-white',
    label: 'text-yellow-100',
    subtitle: 'text-yellow-200/80',
    glow: 'bg-yellow-300',
    hover: 'hover:from-yellow-400 hover:to-amber-600',
  },
  red: {
    background: 'bg-gradient-to-br from-red-500 to-rose-700',
    text: 'text-white',
    label: 'text-red-100',
    subtitle: 'text-red-200/80',
    glow: 'bg-red-300',
    hover: 'hover:from-red-400 hover:to-rose-600',
  },
  gray: {
    background: 'bg-gray-800/40',
    text: 'text-gray-300',
    label: 'text-gray-400',
    subtitle: 'text-gray-500',
    glow: 'bg-gray-600',
    hover: 'hover:bg-gray-700/40',
  },
}

export default function StatCard({
  value,
  label,
  subtitle,
  size,
  variant,
  icon,
  pulse = false,
  animated = true,
  className = '',
}: StatCardProps) {
  const sizeConfig = sizeClasses[size]
  const variantConfig = variantClasses[variant]

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl backdrop-blur-sm border border-white/10
        ${variantConfig.background}
        ${variantConfig.hover}
        ${sizeConfig.container}
        ${animated ? 'transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl' : ''}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {/* Glow effect */}
      <div
        className={`absolute -top-4 -right-4 w-32 h-32 ${variantConfig.glow} rounded-full filter blur-3xl opacity-20`}
      />

      {/* Content */}
      <div className="relative z-10">
        {icon && <div className={`${sizeConfig.icon}`}>{icon}</div>}

        <div
          className={`${sizeConfig.value} font-bold ${variantConfig.text} mb-1`}
        >
          {value}
        </div>

        <div
          className={`${sizeConfig.label} font-medium ${variantConfig.label}`}
        >
          {label}
        </div>

        {subtitle && (
          <div
            className={`${sizeConfig.subtitle} mt-1 ${variantConfig.subtitle}`}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  )
}

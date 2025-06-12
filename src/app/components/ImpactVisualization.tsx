'use client'

import { useState, useEffect } from 'react'

interface DecisionImpact {
  category: string
  dailyMinutes: number
  yearlyHours: number
  icon: string
  color: string
}

const DECISION_IMPACTS: DecisionImpact[] = [
  {
    category: 'What to watch',
    dailyMinutes: 23,
    yearlyHours: 140,
    icon: '📺',
    color: 'from-red-500 to-red-600',
  },
  {
    category: 'What to eat',
    dailyMinutes: 31,
    yearlyHours: 189,
    icon: '🍕',
    color: 'from-orange-500 to-orange-600',
  },
  {
    category: 'What to wear',
    dailyMinutes: 18,
    yearlyHours: 110,
    icon: '👕',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    category: 'What to buy',
    dailyMinutes: 27,
    yearlyHours: 164,
    icon: '🛒',
    color: 'from-green-500 to-green-600',
  },
  {
    category: 'Where to go',
    dailyMinutes: 15,
    yearlyHours: 91,
    icon: '🗺️',
    color: 'from-blue-500 to-blue-600',
  },
  {
    category: 'Other choices',
    dailyMinutes: 22,
    yearlyHours: 134,
    icon: '🤔',
    color: 'from-purple-500 to-purple-600',
  },
]

interface ImpactVisualizationProps {
  animationDelay?: number
  onComplete?: () => void
}

export default function ImpactVisualization({
  animationDelay = 0,
  onComplete,
}: ImpactVisualizationProps) {
  const [visibleCategories, setVisibleCategories] = useState<number>(0)
  const [showTotal, setShowTotal] = useState(false)
  const [currentNumbers, setCurrentNumbers] = useState<number[]>(
    new Array(DECISION_IMPACTS.length).fill(0)
  )

  const totalHours = DECISION_IMPACTS.reduce(
    (sum, impact) => sum + impact.yearlyHours,
    0
  )
  const totalDays = Math.round((totalHours / 24) * 10) / 10
  const totalWeeks = Math.round((totalHours / (24 * 7)) * 10) / 10

  useEffect(() => {
    const animateNumbers = () => {
      const duration = 2000 // 2 seconds
      const steps = 60 // 60 FPS
      const stepTime = duration / steps

      let currentStep = 0
      const numberInterval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps

        setCurrentNumbers((prev) =>
          DECISION_IMPACTS.map((impact, index) => {
            if (index < visibleCategories) {
              return Math.round(impact.yearlyHours * progress)
            }
            return 0
          })
        )

        if (currentStep >= steps) {
          clearInterval(numberInterval)
          // Show total after individual numbers finish
          setTimeout(() => {
            setShowTotal(true)
            setTimeout(() => {
              onComplete?.()
            }, 1500)
          }, 500)
        }
      }, stepTime)
    }

    const startAnimation = () => {
      // Reveal categories one by one
      const categoryInterval = setInterval(() => {
        setVisibleCategories((prev) => {
          if (prev < DECISION_IMPACTS.length) {
            return prev + 1
          } else {
            clearInterval(categoryInterval)

            // Start number counting animation
            setTimeout(() => {
              animateNumbers()
            }, 500)

            return prev
          }
        })
      }, 800)
    }

    const timer = setTimeout(startAnimation, animationDelay)
    return () => {
      clearTimeout(timer)
    }
  }, [animationDelay, visibleCategories, onComplete])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">
          The Hidden Cost of Your Decisions
        </h3>
        <p className="text-gray-300">
          Time you spend each year just deciding...
        </p>
      </div>

      {/* Decision Categories */}
      <div className="grid gap-4">
        {DECISION_IMPACTS.slice(0, visibleCategories).map((impact, index) => (
          <div
            key={impact.category}
            className={`
              bg-gradient-to-r ${impact.color} p-4 rounded-lg 
              transform transition-all duration-500 ease-out
              ${index < visibleCategories ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
            `}
          >
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{impact.icon}</span>
                <div>
                  <div className="font-semibold">{impact.category}</div>
                  <div className="text-sm opacity-90">
                    {impact.dailyMinutes} min/day
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">
                  {currentNumbers[index]}
                </div>
                <div className="text-sm opacity-90">hours/year</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total Impact */}
      {showTotal && (
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-xl border-2 border-red-500 transform transition-all duration-1000 ease-out opacity-100 scale-100">
          <div className="text-center">
            <div className="text-red-400 text-sm font-semibold mb-2">
              TOTAL DECISION FATIGUE
            </div>
            <div className="text-6xl font-bold text-white mb-4">
              {totalHours}
            </div>
            <div className="text-xl text-gray-300 mb-4">hours per year</div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-red-900/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {totalDays}
                </div>
                <div className="text-sm text-gray-400">full days</div>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {totalWeeks}
                </div>
                <div className="text-sm text-gray-400">work weeks</div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-200 text-sm">
                That&apos;s like spending{' '}
                <strong>{totalWeeks} full work weeks</strong> every year just
                deciding what to watch, eat, wear, and buy.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Context Stats */}
      {showTotal && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {Math.round(totalHours / 8)}
            </div>
            <div className="text-sm text-gray-400">8-hour workdays</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {Math.round(totalHours / 2)}
            </div>
            <div className="text-sm text-gray-400">movies you could watch</div>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">
              {Math.round(totalHours / 40)}
            </div>
            <div className="text-sm text-gray-400">full vacation days</div>
          </div>
        </div>
      )}
    </div>
  )
}

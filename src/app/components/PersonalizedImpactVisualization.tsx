'use client'

import { useState, useEffect } from 'react'

interface PersonalizedImpactVisualizationProps {
  userJourney: {
    startTime: number
    cameraEnabled: boolean
    visualizationTime: number
    simulationStats: {
      timeSpent: number
      clickCount: number
      optionsViewed: number
    }
    totalExperienceTime: number
  }
  animationDelay?: number
  onComplete?: () => void
}

export default function PersonalizedImpactVisualization({
  userJourney,
  animationDelay = 0,
  onComplete,
}: PersonalizedImpactVisualizationProps) {
  const [currentPhase, setCurrentPhase] = useState<
    'personal' | 'scaling' | 'annual'
  >('personal')
  const [showPersonalStats, setShowPersonalStats] = useState(false)
  const [showScaling, setShowScaling] = useState(false)
  const [showAnnualImpact, setShowAnnualImpact] = useState(false)

  const { simulationStats, totalExperienceTime, cameraEnabled } = userJourney

  // Calculate personalized projections
  const personalMetrics = {
    experienceMinutes: Math.round((totalExperienceTime / 60) * 10) / 10,
    decisionsPerMinute:
      simulationStats.timeSpent > 0
        ? Math.round(
            (simulationStats.clickCount / (simulationStats.timeSpent / 60)) * 10
          ) / 10
        : 0,
    dailyProjection: Math.round(simulationStats.timeSpent * 3), // Assuming 3 decision sessions per day
    weeklyProjection:
      Math.round(((simulationStats.timeSpent * 3 * 7) / 60) * 10) / 10, // Convert to hours
    yearlyProjection: Math.round((simulationStats.timeSpent * 3 * 365) / 60), // Hours per year
  }

  useEffect(() => {
    const sequence = setTimeout(() => {
      setShowPersonalStats(true)

      setTimeout(() => {
        setCurrentPhase('scaling')
        setShowScaling(true)
      }, 3000)

      setTimeout(() => {
        setCurrentPhase('annual')
        setShowAnnualImpact(true)

        setTimeout(() => {
          onComplete?.()
        }, 2000)
      }, 6000)
    }, animationDelay)

    return () => clearTimeout(sequence)
  }, [animationDelay, onComplete])

  return (
    <div className="space-y-8">
      {/* Personal Stats Phase */}
      {showPersonalStats && (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">
            Your Personal Decision Pattern
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg transform transition-all duration-1000 opacity-100 scale-100">
              <div className="text-3xl font-bold text-white">
                {personalMetrics.experienceMinutes}
              </div>
              <div className="text-blue-200 text-sm">minutes in this demo</div>
            </div>

            <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-lg transform transition-all duration-1000 opacity-100 scale-100">
              <div className="text-3xl font-bold text-white">
                {simulationStats.clickCount}
              </div>
              <div className="text-purple-200 text-sm">decisions attempted</div>
            </div>

            <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6 rounded-lg transform transition-all duration-1000 opacity-100 scale-100">
              <div className="text-3xl font-bold text-white">
                {simulationStats.optionsViewed}
              </div>
              <div className="text-orange-200 text-sm">options considered</div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <p className="text-gray-300 text-sm">
              {cameraEnabled
                ? 'You trusted us with your camera - now see how this scales to your real life...'
                : 'Even without the camera, your decision pattern is revealing...'}
            </p>
          </div>
        </div>
      )}

      {/* Scaling Phase */}
      {showScaling && currentPhase !== 'personal' && (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">
            If You Make Decisions Like This Every Day...
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 rounded-lg">
              <div className="text-4xl font-bold text-white">
                {personalMetrics.dailyProjection}
              </div>
              <div className="text-yellow-200 text-sm">
                seconds per day deciding what to watch
              </div>
              <div className="text-yellow-300 text-xs mt-2">
                ({Math.round(personalMetrics.dailyProjection / 60)} minutes
                daily)
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 rounded-lg">
              <div className="text-4xl font-bold text-white">
                {personalMetrics.weeklyProjection}
              </div>
              <div className="text-red-200 text-sm">hours per week</div>
              <div className="text-red-300 text-xs mt-2">
                Just on streaming decisions
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Annual Impact Phase */}
      {showAnnualImpact && currentPhase === 'annual' && (
        <div className="text-center space-y-6">
          <h3 className="text-2xl font-bold text-white">
            Your Annual Decision Tax
          </h3>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-xl border-2 border-red-500">
            <div className="text-6xl font-bold text-red-400 mb-4">
              {personalMetrics.yearlyProjection}
            </div>
            <div className="text-xl text-gray-300 mb-4">
              hours per year on streaming choices alone
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-red-900/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {Math.round(personalMetrics.yearlyProjection / 8)}
                </div>
                <div className="text-sm text-gray-400">work days lost</div>
              </div>
              <div className="bg-red-900/30 p-3 rounded-lg">
                <div className="text-2xl font-bold text-red-400">
                  {Math.round((personalMetrics.yearlyProjection / 24) * 10) /
                    10}
                </div>
                <div className="text-sm text-gray-400">full days</div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-red-900/20 rounded-lg border border-red-500/30">
              <p className="text-red-200 text-sm">
                Based on your behavior in this{' '}
                {personalMetrics.experienceMinutes}-minute demo, you could lose{' '}
                <strong>
                  {Math.round(personalMetrics.yearlyProjection / 8)} work days
                </strong>{' '}
                per year just deciding what to watch.
              </p>
              {personalMetrics.yearlyProjection > 50 && (
                <p className="text-red-300 text-xs mt-2">
                  That&apos;s more time than most people spend on vacation!
                </p>
              )}
            </div>
          </div>

          <div className="bg-gray-800/30 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">
              And this is just <em>one type</em> of decision. Add food, clothes,
              purchases, routes...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

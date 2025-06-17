'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

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
  const [animatedNumbers, setAnimatedNumbers] = useState({
    experienceMinutes: 0,
    clickCount: 0,
    optionsViewed: 0,
    dailyProjection: 0,
    weeklyProjection: 0,
    yearlyProjection: 0,
    workDaysLost: 0,
    fullDaysLost: 0,
  })
  const [showPhaseIndicator, setShowPhaseIndicator] = useState(false)

  const animationFrameRef = useRef<number>()
  const startTimeRef = useRef<number>()

  const { simulationStats, totalExperienceTime, cameraEnabled } = userJourney

  // Calculate personalized projections for display in JSX
  const personalMetrics = useMemo(
    () => ({
      experienceMinutes: Math.round((totalExperienceTime / 60) * 10) / 10,
      decisionsPerMinute:
        simulationStats.timeSpent > 0
          ? Math.round(
              (simulationStats.clickCount / (simulationStats.timeSpent / 60)) *
                10
            ) / 10
          : 0,
      dailyProjection: Math.round(simulationStats.timeSpent * 3),
      weeklyProjection:
        Math.round(((simulationStats.timeSpent * 3 * 7) / 60) * 10) / 10,
      yearlyProjection: Math.round((simulationStats.timeSpent * 3 * 365) / 60),
      workDaysLost: Math.round((simulationStats.timeSpent * 3 * 365) / 60 / 8),
      fullDaysLost:
        Math.round(((simulationStats.timeSpent * 3 * 365) / 60 / 24) * 10) / 10,
    }),
    [simulationStats, totalExperienceTime]
  )

  // Animated counter function
  const animateValue = (
    start: number,
    end: number,
    duration: number,
    key: string
  ) => {
    startTimeRef.current = Date.now()

    const updateValue = () => {
      const now = Date.now()
      const progress = Math.min((now - startTimeRef.current!) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = start + (end - start) * easeOutQuart

      setAnimatedNumbers((prev) => ({
        ...prev,
        [key]:
          key === 'clickCount' ||
          key === 'optionsViewed' ||
          key === 'dailyProjection' ||
          key === 'yearlyProjection' ||
          key === 'workDaysLost'
            ? Math.round(currentValue)
            : Math.round(currentValue * 10) / 10,
      }))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(updateValue)
      }
    }

    updateValue()
  }

  // Cleanup animation frames
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // Calculate personalized projections inside useEffect
    const personalMetrics = {
      experienceMinutes: Math.round((totalExperienceTime / 60) * 10) / 10,
      decisionsPerMinute:
        simulationStats.timeSpent > 0
          ? Math.round(
              (simulationStats.clickCount / (simulationStats.timeSpent / 60)) *
                10
            ) / 10
          : 0,
      dailyProjection: Math.round(simulationStats.timeSpent * 3), // Assuming 3 decision sessions per day
      weeklyProjection:
        Math.round(((simulationStats.timeSpent * 3 * 7) / 60) * 10) / 10, // Convert to hours
      yearlyProjection: Math.round((simulationStats.timeSpent * 3 * 365) / 60), // Hours per year
      workDaysLost: Math.round((simulationStats.timeSpent * 3 * 365) / 60 / 8),
      fullDaysLost:
        Math.round(((simulationStats.timeSpent * 3 * 365) / 60 / 24) * 10) / 10,
    }

    // Initial delay
    timeouts.push(
      setTimeout(() => {
        setShowPhaseIndicator(true)
        setShowPersonalStats(true)

        // Animate personal stats
        animateValue(
          0,
          personalMetrics.experienceMinutes,
          1200,
          'experienceMinutes'
        )
        setTimeout(
          () => animateValue(0, simulationStats.clickCount, 1200, 'clickCount'),
          200
        )
        setTimeout(
          () =>
            animateValue(
              0,
              simulationStats.optionsViewed,
              1200,
              'optionsViewed'
            ),
          400
        )

        // Transition to scaling phase
        timeouts.push(
          setTimeout(() => {
            setCurrentPhase('scaling')
            setShowScaling(true)

            // Animate scaling stats
            animateValue(
              0,
              personalMetrics.dailyProjection,
              1200,
              'dailyProjection'
            )
            setTimeout(
              () =>
                animateValue(
                  0,
                  personalMetrics.weeklyProjection,
                  1200,
                  'weeklyProjection'
                ),
              200
            )
          }, 3500)
        )

        // Transition to annual impact
        timeouts.push(
          setTimeout(() => {
            setCurrentPhase('annual')
            setShowAnnualImpact(true)

            // Animate annual stats with dramatic effect
            animateValue(
              0,
              personalMetrics.yearlyProjection,
              1800,
              'yearlyProjection'
            )
            setTimeout(
              () =>
                animateValue(
                  0,
                  personalMetrics.workDaysLost,
                  1500,
                  'workDaysLost'
                ),
              600
            )
            setTimeout(
              () =>
                animateValue(
                  0,
                  personalMetrics.fullDaysLost,
                  1500,
                  'fullDaysLost'
                ),
              800
            )

            // Complete callback
            timeouts.push(
              setTimeout(() => {
                onComplete?.()
              }, 3000)
            )
          }, 7000)
        )
      }, animationDelay)
    )

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [animationDelay, onComplete, simulationStats, totalExperienceTime])

  return (
    <div className="space-y-8 relative">
      {/* Phase Indicator */}
      {showPhaseIndicator && (
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-gray-800/30 rounded-full p-2">
            <div
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                currentPhase === 'personal' ? 'bg-blue-400 w-8' : 'bg-gray-600'
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                currentPhase === 'scaling' ? 'bg-yellow-400 w-8' : 'bg-gray-600'
              }`}
            ></div>
            <div
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                currentPhase === 'annual' ? 'bg-red-400 w-8' : 'bg-gray-600'
              }`}
            ></div>
          </div>
        </div>
      )}

      {/* Personal Stats Phase */}
      {showPersonalStats && (
        <div className="text-center space-y-6 animate-fade-in">
          <h3 className="text-3xl font-bold text-white">
            Your Personal Decision Pattern
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-xl transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white mb-1">
                  {animatedNumbers.experienceMinutes}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  minutes in this demo
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-xl transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl animation-delay-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white mb-1">
                  {animatedNumbers.clickCount}
                </div>
                <div className="text-purple-200 text-sm font-medium">
                  decisions attempted
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-orange-800 p-6 rounded-xl transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl animation-delay-400">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="text-4xl font-bold text-white mb-1">
                  {animatedNumbers.optionsViewed}
                </div>
                <div className="text-orange-200 text-sm font-medium">
                  options considered
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
            <p className="text-gray-300 text-sm">
              {cameraEnabled
                ? '✨ You trusted us with your camera - now see how this scales to your real life...'
                : '🔍 Even without the camera, your decision pattern is revealing...'}
            </p>
          </div>
        </div>
      )}

      {/* Scaling Phase */}
      {showScaling && currentPhase !== 'personal' && (
        <div className="text-center space-y-6 animate-fade-in">
          <h3 className="text-3xl font-bold text-white">
            If You Make Decisions Like This Every Day...
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-amber-700 p-8 rounded-xl transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-yellow-300 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-white mb-2">
                  {animatedNumbers.dailyProjection}
                </div>
                <div className="text-yellow-100 text-base font-medium">
                  seconds per day deciding what to watch
                </div>
                <div className="text-yellow-200/80 text-sm mt-3 font-bold">
                  ⏱️ {Math.round(animatedNumbers.dailyProjection / 60)} minutes
                  daily
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-red-500 to-rose-700 p-8 rounded-xl transform transition-all duration-1000 hover:scale-105 hover:shadow-2xl animation-delay-200">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-red-300 rounded-full filter blur-3xl opacity-20"></div>
              <div className="relative z-10">
                <div className="text-5xl font-bold text-white mb-2">
                  {animatedNumbers.weeklyProjection}
                </div>
                <div className="text-red-100 text-base font-medium">
                  hours per week
                </div>
                <div className="text-red-200/80 text-sm mt-3 font-bold">
                  📺 Just on streaming decisions
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-yellow-700/30">
            <p className="text-yellow-200 text-sm">
              ⚡ That&apos;s {Math.round(animatedNumbers.weeklyProjection * 52)}{' '}
              hours per year on just ONE type of decision
            </p>
          </div>
        </div>
      )}

      {/* Annual Impact Phase */}
      {showAnnualImpact && currentPhase === 'annual' && (
        <div className="text-center space-y-6 animate-fade-in">
          <h3 className="text-3xl font-bold text-white mb-2">
            Your Annual Decision Tax
          </h3>
          <p className="text-lg text-gray-400 -mt-2">
            The true cost of decision fatigue
          </p>

          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-red-900/20 to-gray-900 p-10 rounded-2xl border-2 border-red-500/50 shadow-2xl">
            <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
            <div className="relative z-10">
              <div className="text-7xl font-bold text-red-400 mb-4 animate-pulse">
                {animatedNumbers.yearlyProjection}
              </div>
              <div className="text-2xl text-gray-300 mb-6 font-medium">
                hours per year on streaming choices alone
              </div>

              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 p-6 rounded-xl backdrop-blur-sm border border-red-500/20">
                  <div className="text-4xl font-bold text-red-300 mb-1">
                    {animatedNumbers.workDaysLost}
                  </div>
                  <div className="text-base text-red-200 font-medium">
                    work days lost
                  </div>
                  <div className="text-xs text-red-300/70 mt-1">
                    @ 8 hours/day
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-900/40 to-red-950/40 p-6 rounded-xl backdrop-blur-sm border border-red-500/20">
                  <div className="text-4xl font-bold text-red-300 mb-1">
                    {animatedNumbers.fullDaysLost}
                  </div>
                  <div className="text-base text-red-200 font-medium">
                    full days
                  </div>
                  <div className="text-xs text-red-300/70 mt-1">
                    @ 24 hours/day
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-red-950/40 to-red-900/40 rounded-xl border border-red-400/30 backdrop-blur-sm">
                <p className="text-red-100 text-base leading-relaxed">
                  Based on your behavior in this{' '}
                  <span className="font-bold text-red-300">
                    {animatedNumbers.experienceMinutes}-minute
                  </span>{' '}
                  demo, you could lose{' '}
                  <strong className="text-xl text-red-300">
                    {animatedNumbers.workDaysLost} work days
                  </strong>{' '}
                  per year just deciding what to watch.
                </p>
                {animatedNumbers.yearlyProjection > 50 && (
                  <p className="text-red-200 text-sm mt-3 font-medium">
                    💔 That&apos;s more time than most people spend on vacation!
                  </p>
                )}
              </div>

              {/* Visual comparison */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl mb-1">🎬</div>
                  <div className="text-gray-300 font-medium">
                    {Math.round(animatedNumbers.yearlyProjection / 2)} movies
                  </div>
                  <div className="text-gray-500 text-xs">you could watch</div>
                </div>
                <div className="bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-gray-300 font-medium">
                    {Math.round(animatedNumbers.yearlyProjection / 10)} books
                  </div>
                  <div className="text-gray-500 text-xs">you could read</div>
                </div>
                <div className="bg-gray-800/40 p-4 rounded-lg backdrop-blur-sm">
                  <div className="text-2xl mb-1">🏃</div>
                  <div className="text-gray-300 font-medium">
                    {Math.round(animatedNumbers.yearlyProjection * 2)} workouts
                  </div>
                  <div className="text-gray-500 text-xs">
                    you could complete
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
            <p className="text-gray-300 text-base">
              😰 And this is just{' '}
              <em className="text-white font-medium">one type</em> of decision.
              Add food, clothes, purchases, routes...
            </p>
            <p className="text-gray-400 text-sm mt-2">
              The average person faces{' '}
              <span className="text-gray-200 font-medium">
                35,000 decisions
              </span>{' '}
              per day
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

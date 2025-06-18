'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import StatCard from './StatCard'
import SectionTemplate from './SectionTemplate'
import MetricGrid from './MetricGrid'
import CTAButton from './CTAButton'
import ImpactLayout from './ImpactLayout'

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
  const [showContinueButton, setShowContinueButton] = useState(false)

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

  // Animated counter function - memoized to prevent recreation
  const animateValue = useCallback(
    (start: number, end: number, duration: number, key: string) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      const startTime = Date.now()

      const updateValue = () => {
        const now = Date.now()
        const progress = Math.min((now - startTime) / duration, 1)

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
    },
    []
  )

  // Cleanup animation frames
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  // Separate function to handle phase-specific animations
  const animatePhaseValues = useCallback(
    (phase: 'personal' | 'scaling' | 'annual') => {
      switch (phase) {
        case 'personal':
          animateValue(
            0,
            personalMetrics.experienceMinutes,
            1200,
            'experienceMinutes'
          )
          setTimeout(
            () =>
              animateValue(0, simulationStats.clickCount, 1200, 'clickCount'),
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
          break
        case 'scaling':
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
          break
        case 'annual':
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
          break
      }
    },
    [animateValue, personalMetrics, simulationStats]
  )

  // Animation sequence effect - only runs once on mount
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    // Initial delay
    timeouts.push(
      setTimeout(() => {
        setShowPhaseIndicator(true)
        setShowPersonalStats(true)
        animatePhaseValues('personal')

        // Transition to scaling phase
        timeouts.push(
          setTimeout(() => {
            setCurrentPhase('scaling')
            setShowScaling(true)
            animatePhaseValues('scaling')
          }, 3500)
        )

        // Transition to annual impact
        timeouts.push(
          setTimeout(() => {
            setCurrentPhase('annual')
            setShowAnnualImpact(true)
            animatePhaseValues('annual')

            // Show continue button
            timeouts.push(
              setTimeout(() => {
                setShowContinueButton(true)
              }, 2000)
            )
          }, 7000)
        )
      }, animationDelay)
    )

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [animationDelay, onComplete, animatePhaseValues])

  // Handle manual phase navigation
  const handlePhaseClick = useCallback(
    (phase: 'personal' | 'scaling' | 'annual') => {
      setCurrentPhase(phase)

      // Show appropriate sections
      setShowPersonalStats(true)
      setShowScaling(true)
      setShowAnnualImpact(true)

      // Animate values for the selected phase
      animatePhaseValues(phase)
    },
    [animatePhaseValues]
  )

  return (
    <ImpactLayout
      currentPhase={currentPhase}
      onPhaseClick={handlePhaseClick}
      showPhaseIndicator={showPhaseIndicator}
      showContinueButton={showContinueButton}
      onContinue={() => onComplete?.()}
    >
      {/* Personal Stats Phase */}
      <SectionTemplate title="" isVisible={currentPhase === 'personal'}>
        <MetricGrid columns={3} gap="md">
          <StatCard
            value={animatedNumbers.experienceMinutes}
            label="minutes in this demo"
            size="md"
            variant="blue"
            animated={true}
          />

          <StatCard
            value={animatedNumbers.clickCount}
            label="decisions attempted"
            size="md"
            variant="purple"
            animated={true}
            className="animation-delay-200"
          />

          <StatCard
            value={animatedNumbers.optionsViewed}
            label="options considered"
            size="md"
            variant="orange"
            animated={true}
            className="animation-delay-400"
          />
        </MetricGrid>

        <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50">
          <p className="text-gray-300 text-sm">
            {cameraEnabled
              ? '✨ You trusted us with your camera - now see how this scales to your real life...'
              : '🔍 Even without the camera, your decision pattern is revealing...'}
          </p>
        </div>
      </SectionTemplate>

      {/* Scaling Phase */}
      <SectionTemplate title="" isVisible={currentPhase === 'scaling'}>
        <MetricGrid columns={2} gap="lg">
          <StatCard
            value={animatedNumbers.dailyProjection}
            label="seconds per day deciding what to watch"
            subtitle={`⏱️ ${Math.round(animatedNumbers.dailyProjection / 60)} minutes daily`}
            size="lg"
            variant="yellow"
            animated={true}
          />

          <StatCard
            value={animatedNumbers.weeklyProjection}
            label="hours per week"
            subtitle="📺 Just on streaming decisions"
            size="lg"
            variant="red"
            animated={true}
            className="animation-delay-200"
          />
        </MetricGrid>

        <div className="mt-6 bg-gradient-to-r from-yellow-900/20 to-red-900/20 backdrop-blur-sm p-4 rounded-xl border border-yellow-700/30">
          <p className="text-yellow-200 text-sm">
            ⚡ That&apos;s {Math.round(animatedNumbers.weeklyProjection * 52)}{' '}
            hours per year on just ONE type of decision
          </p>
        </div>
      </SectionTemplate>

      {/* Annual Impact Phase */}
      <SectionTemplate title="" isVisible={currentPhase === 'annual'}>
        {/* Main Annual Metric */}
        <StatCard
          value={animatedNumbers.yearlyProjection}
          label="hours per year on streaming choices alone"
          size="xl"
          variant="red"
          pulse={true}
          animated={true}
          className="border-2 border-red-500/50 shadow-2xl"
        />

        {/* Sub-metrics Grid */}
        <MetricGrid columns={2} gap="lg" className="mt-6">
          <StatCard
            value={animatedNumbers.workDaysLost}
            label="work days lost"
            subtitle="@ 8 hours/day"
            size="lg"
            variant="red"
            animated={true}
          />

          <StatCard
            value={animatedNumbers.fullDaysLost}
            label="full days"
            subtitle="@ 24 hours/day"
            size="lg"
            variant="red"
            animated={true}
          />
        </MetricGrid>

        {/* Impact Message */}
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

        {/* Comparison Cards */}
        <MetricGrid columns={3} gap="md" className="mt-8">
          <StatCard
            value={Math.round(animatedNumbers.yearlyProjection / 2)}
            label="movies"
            subtitle="you could watch"
            size="sm"
            variant="gray"
            icon="🎬"
            animated={true}
          />

          <StatCard
            value={Math.round(animatedNumbers.yearlyProjection / 10)}
            label="books"
            subtitle="you could read"
            size="sm"
            variant="gray"
            icon="📚"
            animated={true}
          />

          <StatCard
            value={Math.round(animatedNumbers.yearlyProjection * 2)}
            label="workouts"
            subtitle="you could complete"
            size="sm"
            variant="gray"
            icon="🏃"
            animated={true}
          />
        </MetricGrid>

        <div className="bg-gradient-to-r from-gray-800/30 to-gray-900/30 backdrop-blur-sm p-6 rounded-xl border border-gray-700/30">
          <p className="text-gray-300 text-base">
            😰 And this is just{' '}
            <em className="text-white font-medium">one type</em> of decision.
            Add food, clothes, purchases, routes...
          </p>
          <p className="text-gray-400 text-sm mt-2">
            The average person faces{' '}
            <span className="text-gray-200 font-medium">35,000 decisions</span>{' '}
            per day
          </p>
        </div>
      </SectionTemplate>
    </ImpactLayout>
  )
}

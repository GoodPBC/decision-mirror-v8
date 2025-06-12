'use client'

import { useState, useEffect } from 'react'

interface SolutionRevealProps {
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
}

export default function SolutionReveal({
  userJourney,
  animationDelay = 0,
}: SolutionRevealProps) {
  const [currentPhase, setCurrentPhase] = useState<
    'problem' | 'solution' | 'benefits' | 'cta'
  >('problem')
  const [showProblem, setShowProblem] = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [showBenefits, setShowBenefits] = useState(false)
  const [showCTA, setShowCTA] = useState(false)

  const { simulationStats, totalExperienceTime, cameraEnabled } = userJourney

  // Calculate time saved
  const yearlyHoursLost = Math.round((simulationStats.timeSpent * 3 * 365) / 60)
  const timeSavedWith90Percent = Math.round(yearlyHoursLost * 0.9)
  const workDaysSaved = Math.round(timeSavedWith90Percent / 8)

  useEffect(() => {
    const sequence = setTimeout(() => {
      setShowProblem(true)
      setCurrentPhase('problem')

      setTimeout(() => {
        setCurrentPhase('solution')
        setShowSolution(true)
      }, 3000)

      setTimeout(() => {
        setCurrentPhase('benefits')
        setShowBenefits(true)
      }, 6000)

      setTimeout(() => {
        setCurrentPhase('cta')
        setShowCTA(true)
      }, 9000)
    }, animationDelay)

    return () => clearTimeout(sequence)
  }, [animationDelay])

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Problem Recap */}
      {showProblem && (
        <div className="text-center space-y-4 transform transition-all duration-1000 opacity-100 translate-y-0">
          <h2 className="text-3xl font-bold text-white">
            You Just Experienced Decision Fatigue
          </h2>
          <div className="bg-red-900/30 border border-red-500/50 p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {Math.round((totalExperienceTime / 60) * 10) / 10}
                </div>
                <div className="text-red-200 text-sm">minutes of your life</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {simulationStats.clickCount}
                </div>
                <div className="text-red-200 text-sm">
                  frustrating decisions
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">
                  {yearlyHoursLost}
                </div>
                <div className="text-red-200 text-sm">hours lost annually</div>
              </div>
            </div>
            <p className="text-red-200 text-sm mt-4">
              And this was just a <em>demo</em>. Your real decision fatigue is
              100x worse.
            </p>
          </div>
        </div>
      )}

      {/* Solution Introduction */}
      {showSolution && currentPhase !== 'problem' && (
        <div className="text-center space-y-6 transform transition-all duration-1000 opacity-100 translate-y-0">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
            <div className="relative bg-gradient-to-r from-gray-900 to-black p-8 rounded-xl border border-blue-500/50">
              <h2 className="text-4xl font-bold text-white mb-4">
                Meet Your Decision Layer
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                An AI that learns exactly what you want and delivers perfect
                recommendations in seconds
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2">
                    🧠 Learns Your Taste
                  </h3>
                  <p className="text-gray-300 text-sm">
                    {cameraEnabled
                      ? 'We saw your reactions - imagine an AI that reads your mood and preferences'
                      : 'Understands your preferences from behavior, not endless surveys'}
                  </p>
                </div>

                <div className="bg-purple-900/30 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-300 mb-2">
                    ⚡ Instant Decisions
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Turns {simulationStats.timeSpent}-second browsing sessions
                    into 3-second perfect picks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Benefits */}
      {showBenefits &&
        currentPhase !== 'problem' &&
        currentPhase !== 'solution' && (
          <div className="space-y-6 transform transition-all duration-1000 opacity-100 translate-y-0">
            <h3 className="text-2xl font-bold text-white text-center">
              What You Get Back
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 rounded-lg">
                <div className="text-4xl font-bold text-white">
                  {timeSavedWith90Percent}
                </div>
                <div className="text-green-200 text-sm">
                  hours saved per year
                </div>
                <div className="text-green-100 text-xs mt-2">
                  90% reduction in decision time
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 rounded-lg">
                <div className="text-4xl font-bold text-white">
                  {workDaysSaved}
                </div>
                <div className="text-blue-200 text-sm">
                  work days returned to your life
                </div>
                <div className="text-blue-100 text-xs mt-2">
                  Time for what actually matters
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">🎯</div>
                <div className="text-white text-sm font-medium">
                  Perfect Matches
                </div>
                <div className="text-gray-400 text-xs">
                  No more &quot;meh&quot; choices
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">🧘</div>
                <div className="text-white text-sm font-medium">
                  Mental Peace
                </div>
                <div className="text-gray-400 text-xs">
                  End decision anxiety
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-white">🚀</div>
                <div className="text-white text-sm font-medium">
                  Effortless Life
                </div>
                <div className="text-gray-400 text-xs">
                  Decisions just happen
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Call to Action */}
      {showCTA && currentPhase === 'cta' && (
        <div className="text-center space-y-6 transform transition-all duration-1000 opacity-100 translate-y-0">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 rounded-xl border border-purple-400/50">
            <h3 className="text-3xl font-bold text-white mb-4">
              Be Among The First
            </h3>
            <p className="text-purple-100 mb-6 text-lg">
              Join the waitlist for early access to the Decision Layer
            </p>

            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-lg">
                <p className="text-white text-sm">
                  ✅ Early access to the platform
                  <br />
                  ✅ First to try new decision domains
                  <br />
                  ✅ Shape the future of decision-making
                  <br />✅ {workDaysSaved} days back in your life per year
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg transform hover:scale-105">
                  Join Waitlist - It&apos;s Free
                </button>
                <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-purple-600 transition-colors">
                  Learn More
                </button>
              </div>
            </div>

            <div className="mt-4 text-purple-200 text-sm">
              {cameraEnabled
                ? "Thanks for trusting us with your camera. We'll never share your data."
                : 'No spam, no sharing. Just early access to get your time back.'}
            </div>
          </div>

          <div className="bg-gray-800/30 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">
              <strong>Remember:</strong> You just spent{' '}
              {Math.round((totalExperienceTime / 60) * 10) / 10} minutes in this
              demo. Multiply that by every decision, every day. The Decision
              Layer gives you that time back.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

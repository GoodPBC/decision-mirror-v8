'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Webcam from 'react-webcam'
import DecisionBubbles from '../components/DecisionBubbles'
import DecisionOverloadSimulation from '../components/DecisionOverloadSimulation'
import PersonalizedImpactVisualization from '../components/PersonalizedImpactVisualization'
import SolutionReveal from '../components/SolutionReveal'

type MirrorStage =
  | 'intro'
  | 'camera'
  | 'visualization'
  | 'simulation'
  | 'realization'
  | 'solution'

interface UserJourney {
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

export default function DecisionMirror() {
  const [stage, setStage] = useState<MirrorStage>('intro')
  const [usingCamera, setUsingCamera] = useState(false)
  const [cameraError, setCameraError] = useState<string>('')
  const [showBubbles, setShowBubbles] = useState(false)
  const [bubbleIntensity, setBubbleIntensity] = useState<
    'low' | 'medium' | 'high'
  >('low')
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitionMessage, setTransitionMessage] = useState('')
  const [currentBubbleCount, setCurrentBubbleCount] = useState(0)
  const [overwhelmThreshold, setOverwhelmThreshold] = useState(0)
  const [userJourney, setUserJourney] = useState<UserJourney>({
    startTime: Date.now(),
    cameraEnabled: false,
    visualizationTime: 0,
    simulationStats: { timeSpent: 0, clickCount: 0, optionsViewed: 0 },
    totalExperienceTime: 0,
  })
  const webcamRef = useRef<Webcam>(null)
  const visualizationRef = useRef<HTMLDivElement>(null)
  const stageStartTime = useRef<number>(Date.now())

  const handleUserMedia = useCallback(() => {
    console.log('Camera access granted')
    setCameraError('')
    setUsingCamera(true)
    setUserJourney((prev) => ({ ...prev, cameraEnabled: true }))
    setStage('visualization')
  }, [])

  const handleUserMediaError = useCallback((error: any) => {
    console.error('Camera access error:', error)
    if (error.name === 'NotAllowedError') {
      setCameraError(
        'Camera access was denied. Please enable camera permissions and try again.'
      )
    } else if (error.name === 'NotFoundError') {
      setCameraError('No camera found on this device.')
    } else {
      setCameraError(
        'Failed to access camera. Please check your device settings.'
      )
    }
  }, [])

  const enableCamera = useCallback(() => {
    setCameraError('')
    setUsingCamera(true)
  }, [])

  const disableCamera = useCallback(() => {
    setUsingCamera(false)
    setCameraError('')
  }, [])

  // Handle smooth transition to next stage
  const transitionTimeouts = useRef<NodeJS.Timeout[]>([])

  const handleSmoothTransition = useCallback(
    (nextStage: MirrorStage, message: string) => {
      // Clear any existing timeouts to prevent memory leaks
      transitionTimeouts.current.forEach(clearTimeout)
      transitionTimeouts.current = []

      setIsTransitioning(true)
      setTransitionMessage(message)

      // Generate random delay between 4-6 seconds for better readability
      const randomDelay = Math.floor(Math.random() * (6000 - 4000 + 1)) + 4000 // 4000-6000ms

      // First phase: Show transition message
      const timeout1 = setTimeout(() => {
        setTransitionMessage('Taking you to the next experience...')
      }, randomDelay * 0.6) // Show secondary message at 60% of total time

      // Second phase: Actually transition
      const timeout2 = setTimeout(() => {
        setStage(nextStage)
        setIsTransitioning(false)
        setTransitionMessage('')
        // Clear timeouts after completion
        transitionTimeouts.current = []
      }, randomDelay)

      // Store timeouts for cleanup
      transitionTimeouts.current = [timeout1, timeout2]
    },
    []
  )

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      transitionTimeouts.current.forEach(clearTimeout)
      transitionTimeouts.current = []
    }
  }, [])

  // Track stage changes and timing
  useEffect(() => {
    stageStartTime.current = Date.now()

    if (stage === 'visualization') {
      setTimeout(() => setShowBubbles(true), 1000) // Start after 1 second
      setTimeout(() => setBubbleIntensity('medium'), 3000) // Increase intensity after 3 seconds
      setTimeout(() => setBubbleIntensity('high'), 6000) // Max intensity after 6 seconds
    } else {
      setShowBubbles(false)
      setBubbleIntensity('low')
    }

    // Reset continue button for realization stage
    if (stage === 'realization') {
      setShowContinueButton(false)
    }
  }, [stage])

  // Track visualization time when leaving that stage
  useEffect(() => {
    return () => {
      if (stage === 'visualization') {
        const timeSpent = Date.now() - stageStartTime.current
        setUserJourney((prev) => ({
          ...prev,
          visualizationTime: timeSpent / 1000, // Convert to seconds
        }))
      }
    }
  }, [stage])

  const renderStage = () => {
    switch (stage) {
      case 'intro':
        return (
          <div className="text-center space-y-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              The Decision Mirror
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience a first-of-its-kind visualization of how decision
              fatigue is affecting your daily life
            </p>
            <button
              onClick={() => setStage('camera')}
              className="bg-white text-black px-8 py-4 rounded-lg font-normal text-lg hover:bg-gray-100 transition-colors"
            >
              Begin Experience
            </button>
          </div>
        )

      case 'camera':
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Allow Camera Access
            </h2>
            <p className="text-lg text-gray-300 max-w-xl mx-auto">
              For the full mirror experience, we&apos;ll use your camera to
              create a personalized visualization of your decision fatigue
              <br />
              <span className="text-sm text-gray-400 mt-2 block">
                You&apos;ve been here for{' '}
                {Math.round((Date.now() - userJourney.startTime) / 1000)}{' '}
                seconds already...
              </span>
            </p>

            {cameraError && (
              <div className="bg-red-900 border border-red-600 p-4 rounded-lg max-w-xl mx-auto">
                <p className="text-red-200">{cameraError}</p>
              </div>
            )}

            {usingCamera && (
              <div className="hidden">
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={{
                    width: 1280,
                    height: 720,
                    facingMode: 'user',
                  }}
                  onUserMedia={handleUserMedia}
                  onUserMediaError={handleUserMediaError}
                />
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <button
                onClick={enableCamera}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Enable Camera
              </button>

              <button
                onClick={() => {
                  disableCamera()
                  setStage('visualization')
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Continue Without Camera
              </button>
            </div>
          </div>
        )

      case 'visualization':
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Your Daily Decisions
            </h2>
            <div
              ref={visualizationRef}
              className="relative h-96 border-2 border-gray-600 rounded-lg bg-gray-900 overflow-hidden"
            >
              {usingCamera ? (
                <>
                  <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                      width: 1280,
                      height: 720,
                      facingMode: 'user',
                    }}
                    className="w-full h-full object-cover"
                  />
                  {!showBubbles && (
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                      <p className="text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded">
                        Watch as your decisions surround you...
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto flex items-center justify-center">
                      <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                    </div>
                    {!showBubbles && (
                      <p className="text-gray-400">
                        Watch as your decisions surround you...
                      </p>
                    )}
                  </div>
                </div>
              )}

              <DecisionBubbles
                isActive={showBubbles}
                intensity={bubbleIntensity}
                containerRef={visualizationRef}
                onOverwhelm={() =>
                  handleSmoothTransition(
                    'simulation',
                    'You experienced decision fatigue in real-time...'
                  )
                }
                onBubbleCountChange={setCurrentBubbleCount}
                onThresholdSet={setOverwhelmThreshold}
              />
            </div>

            {/* Instruction text below video screen */}
            {showBubbles && (
              <div className="text-center animate-fade-in">
                <p className="text-lg font-medium gradient-text">
                  Click the bubbles that you identify with - see the impact of
                  each decision you make...
                </p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              {usingCamera && (
                <button
                  onClick={() => {
                    disableCamera()
                  }}
                  className="bg-transparent border-2 px-4 py-2 rounded-lg font-normal text-lg transition-all transform hover:scale-105"
                  style={{
                    borderColor: 'rgba(239, 68, 68, 0.8)',
                    color: 'rgba(239, 68, 68, 0.8)',
                  }}
                >
                  Stop Camera
                </button>
              )}
              {(() => {
                const minimumBubbles = Math.floor(overwhelmThreshold * 0.5) // 50% of threshold
                const canContinue = currentBubbleCount >= minimumBubbles

                return (
                  <button
                    onClick={() => canContinue && setStage('simulation')}
                    disabled={!canContinue}
                    className={`px-6 py-3 rounded-lg font-normal text-lg transition-all transform ${
                      canContinue
                        ? 'text-white border-2 border-white/20 hover:scale-105 cursor-pointer relative overflow-hidden'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
                    }`}
                    style={
                      canContinue
                        ? {
                            background:
                              'linear-gradient(90deg, rgba(96, 165, 250, 0.8), rgba(168, 85, 247, 0.8), rgba(244, 114, 182, 0.8), rgba(129, 140, 248, 0.8), rgba(34, 211, 238, 0.8), rgba(196, 181, 253, 0.8))',
                            backgroundSize: '200% 100%',
                            animation: 'gradientShift 3s ease-in-out infinite',
                          }
                        : {}
                    }
                  >
                    Continue
                  </button>
                )
              })()}
            </div>
          </div>
        )

      case 'simulation':
        return (
          <div className="text-center space-y-8">
            <h2 className="text-3xl font-bold text-white">
              Experience Decision Overload
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Let&apos;s simulate a simple decision: What to watch tonight?
              <br />
              <span className="text-sm text-gray-400">
                {usingCamera
                  ? "We saw you surrounded by decisions - now feel what it's like..."
                  : 'Browse through the options below and notice how you feel...'}
              </span>
            </p>
            <div className="max-w-4xl mx-auto">
              <DecisionOverloadSimulation
                onOverwhelmed={(stats) => {
                  setUserJourney((prev) => ({
                    ...prev,
                    simulationStats: stats,
                    totalExperienceTime: (Date.now() - prev.startTime) / 1000,
                  }))
                  setStage('realization')
                }}
              />
            </div>
          </div>
        )

      case 'realization':
        return (
          <div className="text-center space-y-8">
            <div className="max-w-4xl mx-auto">
              <PersonalizedImpactVisualization
                userJourney={userJourney}
                animationDelay={500}
                onComplete={() => setShowContinueButton(true)}
              />
            </div>

            {showContinueButton && (
              <div className="pt-4">
                <button
                  onClick={() => setStage('solution')}
                  className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-normal text-lg animate-pulse"
                >
                  Show Me The Solution
                </button>
              </div>
            )}
          </div>
        )

      case 'solution':
        return (
          <div className="space-y-8">
            <SolutionReveal userJourney={userJourney} animationDelay={500} />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">{renderStage()}</div>

      {/* Smooth transition overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm animate-fade-in">
          <div className="text-center space-y-6 max-w-lg px-8">
            <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="text-2xl font-bold text-white">
              {transitionMessage}
            </h3>
            <p className="text-gray-300 text-lg">
              Processing your experience...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

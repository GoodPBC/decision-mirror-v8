'use client'

import { useState, useEffect, useCallback } from 'react'
import { DECISION_TEXTS } from '../data/decisionTexts'

interface DecisionBubble {
  id: number
  text: string
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  color: string
  isPopping?: boolean
  scale?: number
}

interface DecisionBubblesProps {
  isActive: boolean
  intensity?: 'low' | 'medium' | 'high'
  containerRef?: React.RefObject<HTMLDivElement>
  onOverwhelm?: () => void
  onBubbleCountChange?: (count: number) => void
  onThresholdSet?: (threshold: number) => void
}

const BUBBLE_COLORS = [
  'bg-blue-500/80',
  'bg-purple-500/80',
  'bg-pink-500/80',
  'bg-indigo-500/80',
  'bg-cyan-500/80',
  'bg-violet-500/80',
]

export default function DecisionBubbles({
  isActive,
  intensity = 'medium',
  containerRef,
  onOverwhelm,
  onBubbleCountChange,
  onThresholdSet,
}: DecisionBubblesProps) {
  const [bubbles, setBubbles] = useState<DecisionBubble[]>([])
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 400,
  })
  const [autoSpawnTimer, setAutoSpawnTimer] = useState(0)
  const [manualIntensity, setManualIntensity] = useState<
    'low' | 'medium' | 'high'
  >(intensity)
  const [overwhelmThreshold] = useState(
    () => Math.floor(Math.random() * (92 - 74 + 1)) + 74
  ) // Random between 74-92
  const [hasTriggeredOverwhelm, setHasTriggeredOverwhelm] = useState(false)
  const [showOverwhelmButton, setShowOverwhelmButton] = useState(false)
  const [buttonTimeoutId, setButtonTimeoutId] = useState<NodeJS.Timeout | null>(
    null
  )

  // Create a single bubble
  const createBubble = useCallback(
    (index: number = 0) => {
      const bubble: DecisionBubble = {
        id: Date.now() + Math.random(),
        text: DECISION_TEXTS[Math.floor(Math.random() * DECISION_TEXTS.length)],
        x: Math.random() * (containerSize.width - 100),
        y: Math.random() * (containerSize.height - 50),
        size: Math.random() * 30 + 40, // 40-70px
        speed: Math.random() * 2 + 1, // 1-3px per frame
        opacity: Math.random() * 0.3 + 0.7, // 0.7-1.0
        color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
        scale: 1,
      }
      return bubble
    },
    [containerSize]
  )

  // Handle bubble click
  const handleBubbleClick = useCallback(
    (bubbleId: number) => {
      // Immediately remove clicked bubble and add 4-6 new ones (all in one synchronous operation)
      setBubbles((prevBubbles) => {
        const filteredBubbles = prevBubbles.filter((b) => b.id !== bubbleId)
        const newBubbleCount = Math.floor(Math.random() * 3) + 4 // 4-6 new bubbles
        const newBubbles = Array.from({ length: newBubbleCount }, (_, i) =>
          createBubble(i)
        )

        return [...filteredBubbles, ...newBubbles]
      })
    },
    [createBubble]
  )

  // Update container size
  useEffect(() => {
    const updateSize = () => {
      if (containerRef?.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerSize({ width: rect.width, height: rect.height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [containerRef])

  // Initialize bubbles only when component becomes active
  useEffect(() => {
    if (!isActive) {
      setBubbles([])
      setAutoSpawnTimer(0)
      return
    }

    // Only set initial bubbles if we don't have any yet
    setBubbles((prevBubbles) => {
      if (prevBubbles.length === 0) {
        const initialCount = 3 // Always start with 3 bubbles
        return Array.from({ length: initialCount }, (_, i) => createBubble(i))
      }
      return prevBubbles
    })
  }, [isActive, createBubble])

  // Update manual intensity from prop changes, but don't reset bubbles
  useEffect(() => {
    setManualIntensity(intensity)
  }, [intensity])

  // Report bubble count changes to parent
  useEffect(() => {
    if (onBubbleCountChange) {
      onBubbleCountChange(bubbles.length)
    }
  }, [bubbles.length, onBubbleCountChange])

  // Report threshold to parent on mount
  useEffect(() => {
    if (onThresholdSet) {
      onThresholdSet(overwhelmThreshold)
    }
  }, [overwhelmThreshold, onThresholdSet])

  // Auto-spawn bubbles over time
  useEffect(() => {
    if (!isActive) return

    const spawnInterval = setInterval(() => {
      setAutoSpawnTimer((prev) => prev + 1)

      // Spawn cluster of bubbles every 2-4 seconds based on intensity
      const spawnRate =
        manualIntensity === 'low'
          ? 4000
          : manualIntensity === 'medium'
            ? 3000
            : 2000
      if (autoSpawnTimer % (spawnRate / 1000) === 0) {
        // Add 3-7 bubbles in a cluster
        const clusterSize = Math.floor(Math.random() * 5) + 3 // 3-7 bubbles
        const newBubbles = Array.from({ length: clusterSize }, (_, i) =>
          createBubble(i)
        )
        setBubbles((prev) => [...prev, ...newBubbles])
      }
    }, 1000)

    return () => clearInterval(spawnInterval)
  }, [isActive, autoSpawnTimer, createBubble, manualIntensity])

  // Check for overwhelm threshold (auto-trigger as backup)
  useEffect(() => {
    if (
      bubbles.length >= overwhelmThreshold &&
      !hasTriggeredOverwhelm &&
      onOverwhelm
    ) {
      setHasTriggeredOverwhelm(true)
      onOverwhelm()
    }
  }, [bubbles.length, overwhelmThreshold, hasTriggeredOverwhelm, onOverwhelm])

  // Show overwhelm button and progressive warnings
  useEffect(() => {
    const currentCount = bubbles.length
    const buttonThreshold = Math.floor(overwhelmThreshold * 0.75) // 75% of overwhelm threshold

    // Show overwhelm button when we reach 75% of the overwhelm threshold
    if (
      currentCount >= buttonThreshold &&
      !showOverwhelmButton &&
      !hasTriggeredOverwhelm
    ) {
      setShowOverwhelmButton(true)

      // Start 10-second countdown for auto-transition
      const timeoutId = setTimeout(() => {
        if (!hasTriggeredOverwhelm && onOverwhelm) {
          setHasTriggeredOverwhelm(true)
          onOverwhelm()
        }
      }, 7500) // 7.5 seconds

      setButtonTimeoutId(timeoutId)
    }
  }, [
    bubbles.length,
    overwhelmThreshold,
    showOverwhelmButton,
    hasTriggeredOverwhelm,
    onOverwhelm,
  ])

  // Dynamically upgrade intensity based on bubble count and user engagement
  useEffect(() => {
    const currentCount = bubbles.length

    // Upgrade to medium intensity when we have 15+ bubbles and currently on low
    if (currentCount >= 15 && manualIntensity === 'low') {
      setManualIntensity('medium')
    }
    // Upgrade to high intensity when we have 30+ bubbles and currently on medium
    else if (currentCount >= 30 && manualIntensity === 'medium') {
      setManualIntensity('high')
    }
  }, [bubbles.length, manualIntensity])

  // Handle user-triggered overwhelm
  const handleUserOverwhelm = useCallback(() => {
    if (!hasTriggeredOverwhelm && onOverwhelm) {
      // Cancel the auto-transition timeout since user clicked
      if (buttonTimeoutId) {
        clearTimeout(buttonTimeoutId)
        setButtonTimeoutId(null)
      }

      setHasTriggeredOverwhelm(true)
      onOverwhelm()
    }
  }, [hasTriggeredOverwhelm, onOverwhelm, buttonTimeoutId])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (buttonTimeoutId) {
        clearTimeout(buttonTimeoutId)
      }
    }
  }, [buttonTimeoutId])

  // Calculate progressive visual effects based on bubble count
  const getProgressiveEffects = useCallback(() => {
    const count = bubbles.length
    const threshold = overwhelmThreshold

    // Progressive stages based on percentage of threshold
    const percentage = count / threshold

    if (percentage < 0.4) {
      return { stage: 'calm', intensity: 0 }
    } else if (percentage < 0.6) {
      return { stage: 'building', intensity: (percentage - 0.4) / 0.2 } // 0-1
    } else if (percentage < 0.8) {
      return { stage: 'pressure', intensity: (percentage - 0.6) / 0.2 } // 0-1
    } else {
      return {
        stage: 'overwhelming',
        intensity: Math.min((percentage - 0.8) / 0.2, 1),
      } // 0-1
    }
  }, [bubbles.length, overwhelmThreshold])

  // Animate bubbles
  useEffect(() => {
    if (!isActive || bubbles.length === 0) return

    const animationFrame = () => {
      setBubbles((prevBubbles) =>
        prevBubbles.map((bubble) => {
          let newX =
            bubble.x + Math.sin(Date.now() * 0.001 + bubble.id) * bubble.speed
          let newY =
            bubble.y +
            Math.cos(Date.now() * 0.001 + bubble.id) * bubble.speed * 0.5

          // Bounce off edges
          if (newX <= 0 || newX >= containerSize.width - 100) {
            newX = Math.max(0, Math.min(containerSize.width - 100, newX))
          }
          if (newY <= 0 || newY >= containerSize.height - 50) {
            newY = Math.max(0, Math.min(containerSize.height - 50, newY))
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
          }
        })
      )
    }

    const interval = setInterval(animationFrame, 50) // 20 FPS
    return () => clearInterval(interval)
  }, [isActive, bubbles.length, containerSize])

  if (!isActive) return null

  return (
    <div className="absolute inset-0 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          onClick={() => !bubble.isPopping && handleBubbleClick(bubble.id)}
          className={`absolute text-white font-semibold px-3 py-2 rounded-full border backdrop-blur-sm transition-all animate-pulse cursor-pointer bubble-hover
            ${bubble.color} 
            ${bubble.isPopping ? 'duration-300' : 'duration-200'}
            border-white/40 hover:border-white/90
            hover:shadow-lg hover:shadow-white/30
            hover:scale-105
          `}
          style={{
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            opacity: bubble.isPopping ? 0 : bubble.opacity,
            fontSize: `${bubble.size / 5}px`,
            transform: `scale(${bubble.isPopping ? 1.5 : (bubble.size / 50) * (bubble.scale || 1)})`,
            pointerEvents: bubble.isPopping ? 'none' : 'auto',
            textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}
        >
          <span className="relative z-10 drop-shadow-lg bubble-text">
            {bubble.text}
          </span>
        </div>
      ))}

      {/* Progressive visual effects overlay */}
      {(() => {
        const effects = getProgressiveEffects()
        if (effects.stage === 'calm') return null

        const overlayOpacity = effects.intensity * 0.3 // Max 30% opacity
        const pulseIntensity = effects.intensity

        return (
          <div
            className="absolute inset-0 pointer-events-none transition-all duration-1000"
            style={{
              background: `radial-gradient(circle at center, rgba(239, 68, 68, ${overlayOpacity}), transparent 70%)`,
              animation:
                effects.stage === 'overwhelming'
                  ? `pulse ${1 - pulseIntensity * 0.5}s infinite`
                  : 'none',
            }}
          />
        )
      })()}

      {/* Overwhelm button - user agency */}
      {showOverwhelmButton && !hasTriggeredOverwhelm && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <div className="text-center space-y-3 animate-fade-in">
            <div className="bg-red-900/90 backdrop-blur-sm border border-red-500 rounded-lg p-4 shadow-lg">
              <p className="text-red-200 text-sm mb-3">
                Feeling overwhelmed by all these decisions?
              </p>
              <button
                onClick={handleUserOverwhelm}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-normal text-lg transition-all transform hover:scale-105 animate-pulse"
              >
                I&apos;m Overwhelmed!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced bubble count indicator with progressive warnings */}
      {bubbles.length > 10 && (
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {bubbles.length} decisions swirling
          {(() => {
            const effects = getProgressiveEffects()
            if (effects.stage === 'building') {
              return (
                <span className="text-yellow-400 ml-1">
                  (building pressure...)
                </span>
              )
            } else if (effects.stage === 'pressure') {
              return (
                <span className="text-orange-400 ml-1">
                  (intense pressure!)
                </span>
              )
            } else if (effects.stage === 'overwhelming') {
              return (
                <span className="text-red-400 ml-1 animate-pulse">
                  (overwhelming!)
                </span>
              )
            }
            return null
          })()}
        </div>
      )}
    </div>
  )
}

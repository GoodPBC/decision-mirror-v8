'use client'

import { useState, useEffect, useRef } from 'react'
import {
  STREAMING_OPTIONS,
  type DecisionOption,
} from '../data/streamingOptions'
import StreamingCard from './StreamingCard'

interface DecisionOverloadSimulationProps {
  onOverwhelmed: (stats: {
    timeSpent: number
    clickCount: number
    optionsViewed: number
  }) => void
}

export default function DecisionOverloadSimulation({
  onOverwhelmed,
}: DecisionOverloadSimulationProps) {
  const [currentOptions, setCurrentOptions] = useState<DecisionOption[]>([])
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [clickedOptions, setClickedOptions] = useState<Set<number>>(new Set())
  const [timeSpent, setTimeSpent] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [overwhelmThreshold] = useState(15) // clicks before showing overwhelmed option
  const [isShuffling, setIsShuffling] = useState(false)
  const [cardRotations, setCardRotations] = useState<Record<number, number>>({})
  const [cardAnimations, setCardAnimations] = useState<Record<number, string>>(
    {}
  )
  const [cardPositions, setCardPositions] = useState<
    Record<number, { x: number; y: number }>
  >({})
  const [cardTargetPositions, setCardTargetPositions] = useState<
    Record<number, { x: number; y: number }>
  >({})
  const [viewportDimensions, setViewportDimensions] = useState({
    width: 0,
    height: 0,
  })
  const [availableGridSpace, setAvailableGridSpace] = useState({
    width: 0,
    height: 0,
  })
  const [lastClickTime, setLastClickTime] = useState(Date.now())
  const [showInactivityButton, setShowInactivityButton] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Calculate viewport dimensions and available space
    const updateDimensions = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      setViewportDimensions({ width: vw, height: vh })

      // Calculate exact available space for grid
      // Title + stats: ~100px, overwhelmed button: ~100px, padding: ~32px
      const reservedHeight = 232
      const availableHeight = vh - reservedHeight
      const availableWidth = vw - 32 // Full width minus padding
      setAvailableGridSpace({ width: availableWidth, height: availableHeight })
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // Start with 6 cards in a single row
    setCurrentOptions(STREAMING_OPTIONS.slice(0, 6))

    // Timer to track time spent
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Handle inactivity timer
  useEffect(() => {
    // Clear existing timeout
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current)
    }

    // Only start timer if we have at least 4 clicks and haven't reached 15 clicks yet
    if (clickCount >= 4 && clickCount < 15) {
      inactivityTimeoutRef.current = setTimeout(() => {
        setShowInactivityButton(true)
      }, 10000) // 10 seconds
    }

    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current)
      }
    }
  }, [clickCount, lastClickTime])

  // Shuffle array function
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Calculate optimal layout based on current viewport and card count
  const getOptimalGridLayout = (count: number) => {
    // Guard against SSR
    if (typeof window === 'undefined') {
      return { cols: 3, cardWidth: 120, cardHeight: 140, gap: 16 }
    }

    const vw = window.innerWidth
    const vh = window.innerHeight

    // Calculate available space on each call
    const headerHeight = 150 // Title + stats
    const buttonHeight = 100 // Overwhelmed button space
    const padding = 32
    const availableWidth = vw - padding
    const availableHeight = vh - headerHeight - buttonHeight - padding

    const baseCardWidth = 120
    const baseCardHeight = 140
    const baseGap = 16

    // Start with default sizing and see if it fits
    let cols = Math.ceil(Math.sqrt(count)) // Square-ish layout as starting point

    // Try to fit with base card size first
    let rows = Math.ceil(count / cols)
    let totalWidth = cols * baseCardWidth + (cols - 1) * baseGap
    let totalHeight = rows * baseCardHeight + (rows - 1) * baseGap

    // If doesn't fit vertically, add more columns
    while (totalHeight > availableHeight && cols < count) {
      cols++
      rows = Math.ceil(count / cols)
      totalWidth = cols * baseCardWidth + (cols - 1) * baseGap
      totalHeight = rows * baseCardHeight + (rows - 1) * baseGap
    }

    // If still doesn't fit horizontally, scale down cards
    let cardWidth = baseCardWidth
    let cardHeight = baseCardHeight
    let gap = baseGap

    if (totalWidth > availableWidth || totalHeight > availableHeight) {
      // Scale down to fit
      const widthScale = availableWidth / totalWidth
      const heightScale = availableHeight / totalHeight
      const scale = Math.min(widthScale, heightScale, 1) // Never scale up

      cardWidth = Math.max(80, baseCardWidth * scale) // Minimum 80px width
      cardHeight = Math.max(95, baseCardHeight * scale) // Maintain aspect ratio roughly
      gap = Math.max(8, baseGap * scale)
    }

    return { cols, cardWidth, cardHeight, gap }
  }

  // Calculate grid positions using layout
  const calculateGridPositions = (
    itemCount: number,
    layout: ReturnType<typeof getOptimalGridLayout>
  ) => {
    const positions: { x: number; y: number }[] = []
    const { cols, cardWidth, cardHeight, gap } = layout

    for (let i = 0; i < itemCount; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)
      positions.push({
        x: col * (cardWidth + gap),
        y: row * (cardHeight + gap),
      })
    }
    return positions
  }

  const handleOptionClick = (optionId: number) => {
    setSelectedOption(optionId)
    setClickedOptions((prev) => new Set(prev).add(optionId))
    setClickCount((prev) => prev + 1)
    setLastClickTime(Date.now())
    setShowInactivityButton(false) // Reset inactivity button when user clicks

    const newClickCount = clickCount + 1
    let targetTotal = 0

    // Maximum of 96 options total, stop adding after 15 clicks
    if (newClickCount > 15) {
      return // No more cards after 15 clicks
    }

    // Calculate target total to maintain complete grids
    if (newClickCount === 1) {
      targetTotal = 9 // 3x3 grid
    } else if (newClickCount === 2) {
      targetTotal = 12 // 3x4 grid
    } else if (newClickCount === 3) {
      targetTotal = 16 // 4x4 grid
    } else if (newClickCount === 4) {
      targetTotal = 20 // 4x5 grid
    } else if (newClickCount === 5) {
      targetTotal = 24 // 4x6 grid
    } else if (newClickCount === 6) {
      targetTotal = 30 // 5x6 grid
    } else if (newClickCount === 7) {
      targetTotal = 36 // 6x6 grid
    } else if (newClickCount === 8) {
      targetTotal = 42 // 6x7 grid
    } else if (newClickCount === 9) {
      targetTotal = 48 // 6x8 grid
    } else {
      // After click 9, add 8 cards per click up to maximum of 96
      targetTotal = Math.min(96, 48 + (newClickCount - 9) * 8)
    }

    const currentCount = currentOptions.length
    const toAdd = targetTotal - currentCount
    const remainingOptions = STREAMING_OPTIONS.length - currentCount

    if (remainingOptions > 0 && toAdd > 0) {
      const actualAdd = Math.min(toAdd, remainingOptions)

      // Add new cards
      const newOptions = [
        ...currentOptions,
        ...STREAMING_OPTIONS.slice(currentCount, currentCount + actualAdd),
      ]

      setCurrentOptions(newOptions)

      // Shuffle after a brief delay to let new cards render
      setTimeout(() => {
        setIsShuffling(true)

        // First, determine the shuffled order
        const shuffledOptions = shuffleArray(newOptions)
        const currentLayout = getOptimalGridLayout(shuffledOptions.length)
        const gridPositions = calculateGridPositions(
          shuffledOptions.length,
          currentLayout
        )

        // Generate animations for all cards
        const rotations: Record<number, number> = {}
        const animations: Record<number, string> = {}
        const positions: Record<number, { x: number; y: number }> = {}
        const targetPositions: Record<number, { x: number; y: number }> = {}

        // Create a map of where each card will end up
        const finalPositionMap = new Map<number, number>()
        shuffledOptions.forEach((option, newIndex) => {
          const oldIndex = newOptions.findIndex((o) => o.id === option.id)
          finalPositionMap.set(option.id, newIndex)
        })

        newOptions.forEach((option, currentIndex) => {
          const minRotation = 35
          const maxRotation = 1080
          const rotation =
            minRotation + Math.random() * (maxRotation - minRotation)
          const finalRotation = Math.random() > 0.5 ? rotation : -rotation
          rotations[option.id] = finalRotation

          // Current position in grid
          const currentLayout = getOptimalGridLayout(newOptions.length)
          const currentGridPos = calculateGridPositions(
            newOptions.length,
            currentLayout
          )[currentIndex]

          // Generate small scatter position relative to current position
          const scatterDistance = 20 + Math.random() * 40 // 20-60px scatter (much smaller)
          const scatterAngle = Math.random() * Math.PI * 2
          positions[option.id] = {
            x: Math.cos(scatterAngle) * scatterDistance,
            y: Math.sin(scatterAngle) * scatterDistance,
          }

          // Target position (where this card will end up)
          const targetIndex = finalPositionMap.get(option.id) || 0
          const targetGridPos = gridPositions[targetIndex]

          // Calculate relative movement needed
          targetPositions[option.id] = {
            x: targetGridPos.x - currentGridPos.x,
            y: targetGridPos.y - currentGridPos.y,
          }

          // Choose animation based on distance traveled
          const distance = Math.sqrt(
            Math.pow(targetPositions[option.id].x, 2) +
              Math.pow(targetPositions[option.id].y, 2)
          )

          if (distance < 200) {
            animations[option.id] = 'magic-travel-short'
          } else if (distance < 400) {
            animations[option.id] = 'magic-travel-medium'
          } else {
            animations[option.id] = 'magic-travel-long'
          }
        })

        setCardRotations(rotations)
        setCardAnimations(animations)
        setCardPositions(positions)
        setCardTargetPositions(targetPositions)

        // Update to shuffled order after animation completes
        setTimeout(() => {
          setCurrentOptions(shuffledOptions)
          setIsShuffling(false)
          setCardRotations({})
          setCardAnimations({})
          setCardPositions({})
          setCardTargetPositions({})
        }, 1300)
      }, 100)
    }

    // Deselect after a short time to simulate indecision
    setTimeout(() => {
      setSelectedOption(null)
    }, 800)
  }

  // Get grid styles based on calculated layout
  const getGridStyles = () => {
    const layout = getOptimalGridLayout(currentOptions.length)

    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${layout.cols}, ${layout.cardWidth}px)`,
      gap: `${layout.gap}px`,
      justifyContent: 'center',
      alignContent: 'start',
      width: '100%',
    }
  }

  // Get psychological hint based on click count
  const getPsychologicalHint = () => {
    if (clickCount >= 10) return 'Feeling overwhelmed yet?'
    if (clickCount >= 9) return 'So many choices...'
    if (clickCount >= 6) return 'Getting harder to choose?'
    if (clickCount >= 3) return 'More options appearing...'
    return null
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Prevent body scroll when component is active
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header with Progress */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-white mb-3">
          Choose Something to Watch
        </h2>

        {/* Subtle Progress Indicator */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-24 bg-gray-800 rounded-full h-1.5 relative overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((clickCount / overwhelmThreshold) * 100, 100)}%`,
                }}
              />
              {/* Pulse effect when getting close */}
              {clickCount > overwhelmThreshold * 0.7 && (
                <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
              )}
            </div>
            <span className="text-xs text-gray-500">
              {Math.round((clickCount / overwhelmThreshold) * 100)}%
            </span>
          </div>

          {/* Stats */}
          <div className="flex gap-3 text-xs text-gray-500">
            <span>{formatTime(timeSpent)}</span>
            <span>•</span>
            <span>{clickCount} attempts</span>
            <span>•</span>
            <span>{currentOptions.length} options</span>
          </div>
        </div>

        {/* Psychological Hint */}
        {getPsychologicalHint() && (
          <p className="text-sm text-gray-400 mt-2 animate-fade-in">
            {clickCount >= 10 ? (
              <button
                onClick={() =>
                  onOverwhelmed({
                    timeSpent,
                    clickCount,
                    optionsViewed: currentOptions.length,
                  })
                }
                className="text-red-500 hover:text-red-400 underline cursor-pointer transition-all duration-300 text-lg font-medium"
                style={{
                  textShadow: `0 0 ${Math.min(20, (clickCount - 9) * 2)}px rgba(239, 68, 68, ${Math.min(0.8, (clickCount - 9) * 0.1)})`,
                }}
              >
                Feeling overwhelmed yet?
              </button>
            ) : (
              getPsychologicalHint()
            )}
          </p>
        )}
      </div>

      {/* Options Grid - Dynamic layout */}
      <div
        ref={gridRef}
        className={`
          flex-1 p-4 transition-all duration-500 ease-out
          ${isShuffling ? 'shuffle-animation' : ''}
        `}
        style={getGridStyles()}
      >
        {currentOptions.map((option) => {
          const layout = getOptimalGridLayout(currentOptions.length)
          return (
            <div
              key={option.id}
              className={cardAnimations[option.id] ? 'card-magic' : ''}
              style={
                {
                  '--rotation-end': cardRotations[option.id]
                    ? `${cardRotations[option.id]}deg`
                    : '0deg',
                  '--scatter-x': cardPositions[option.id]
                    ? `${cardPositions[option.id].x}px`
                    : '0px',
                  '--scatter-y': cardPositions[option.id]
                    ? `${cardPositions[option.id].y}px`
                    : '0px',
                  '--target-x': cardTargetPositions[option.id]
                    ? `${cardTargetPositions[option.id].x}px`
                    : '0px',
                  '--target-y': cardTargetPositions[option.id]
                    ? `${cardTargetPositions[option.id].y}px`
                    : '0px',
                  animationName: cardAnimations[option.id] || 'none',
                } as React.CSSProperties
              }
            >
              <StreamingCard
                option={option}
                isSelected={selectedOption === option.id}
                isClicked={clickedOptions.has(option.id)}
                onClick={handleOptionClick}
                cardWidth={layout.cardWidth}
                cardHeight={layout.cardHeight}
              />
            </div>
          )
        })}
      </div>

      {/* Overwhelmed Option - Floating */}
      {(clickCount >= overwhelmThreshold ||
        (clickCount >= 4 && showInactivityButton)) && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-black/90 backdrop-blur-sm border border-red-500/50 rounded-lg p-6 shadow-2xl">
            <p className="text-red-200 text-sm mb-4">
              You&apos;ve been browsing for {formatTime(timeSpent)} and made{' '}
              {clickCount} attempts...
            </p>
            <button
              onClick={() =>
                onOverwhelmed({
                  timeSpent,
                  clickCount,
                  optionsViewed: currentOptions.length,
                })
              }
              className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-normal transition-all duration-200 transform hover:scale-105"
            >
              I&apos;m Overwhelmed!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

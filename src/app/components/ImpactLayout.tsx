'use client'

import { ReactNode } from 'react'

interface ImpactLayoutProps {
  children: ReactNode
  currentPhase: 'personal' | 'scaling' | 'annual'
  onPhaseClick: (phase: 'personal' | 'scaling' | 'annual') => void
  showPhaseIndicator: boolean
  showContinueButton: boolean
  onContinue: () => void
}

const phaseConfig = {
  personal: {
    title: 'Your Personal Decision Pattern',
    subtitle: 'Understanding your decision patterns',
    color: 'blue',
  },
  scaling: {
    title: 'If You Make Decisions Like This Every Day...',
    subtitle: 'Projecting to daily life impact',
    color: 'yellow',
  },
  annual: {
    title: 'Your Annual Decision Tax',
    subtitle: 'The true cost of decision fatigue',
    color: 'red',
  },
}

export default function ImpactLayout({
  children,
  currentPhase,
  onPhaseClick,
  showPhaseIndicator,
  showContinueButton,
  onContinue,
}: ImpactLayoutProps) {
  const config = phaseConfig[currentPhase]

  return (
    <div className="space-y-8 relative">
      {/* Clickable Phase Indicator */}
      <div
        className={`flex justify-center mb-6 transition-opacity duration-500 ${
          showPhaseIndicator ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center space-x-2 bg-gray-800/30 rounded-full p-2">
          <button
            onClick={() => onPhaseClick('personal')}
            className={`h-2 rounded-full transition-all duration-500 hover:scale-110 cursor-pointer ${
              currentPhase === 'personal'
                ? 'bg-blue-400 w-8'
                : 'bg-gray-600 w-2 hover:bg-blue-300'
            }`}
            aria-label="View personal stats"
          />
          <button
            onClick={() => onPhaseClick('scaling')}
            className={`h-2 rounded-full transition-all duration-500 hover:scale-110 cursor-pointer ${
              currentPhase === 'scaling'
                ? 'bg-yellow-400 w-8'
                : 'bg-gray-600 w-2 hover:bg-yellow-300'
            }`}
            aria-label="View scaling projection"
          />
          <button
            onClick={() => onPhaseClick('annual')}
            className={`h-2 rounded-full transition-all duration-500 hover:scale-110 cursor-pointer ${
              currentPhase === 'annual'
                ? 'bg-red-400 w-8'
                : 'bg-gray-600 w-2 hover:bg-red-300'
            }`}
            aria-label="View annual impact"
          />
        </div>
      </div>

      {/* Fixed Header Area - prevents shifting */}
      <div className="text-center mb-8 h-24 flex flex-col justify-center">
        <h3 className="text-3xl font-bold text-white transition-opacity duration-300">
          {config.title}
        </h3>
        <p className="text-lg text-gray-400 mt-1 h-7">{config.subtitle}</p>
      </div>

      {/* Content Container - Fixed positioning to prevent jumps */}
      <div className="relative min-h-[800px] pb-24">{children}</div>

      {/* Fixed CTA Button Area */}
      <div
        className={`text-center pt-4 transition-all duration-500 ${
          showContinueButton ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={onContinue}
          className="bg-purple-600 text-white px-8 py-4 rounded-lg hover:bg-purple-700 transition-colors font-normal text-lg animate-pulse"
        >
          Show Me The Solution
        </button>
      </div>
    </div>
  )
}

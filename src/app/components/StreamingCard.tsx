'use client'

import { DecisionOption } from '../data/streamingOptions'

interface StreamingCardProps {
  option: DecisionOption
  isSelected: boolean
  isClicked: boolean
  onClick: (id: number) => void
  cardWidth?: number
  cardHeight?: number
}

export default function StreamingCard({
  option,
  isSelected,
  isClicked,
  onClick,
  cardWidth = 120,
  cardHeight = 140,
}: StreamingCardProps) {
  const getRatingColor = (rating: string) => {
    if (rating === 'TV-MA' || rating === 'R' || rating === 'NC-17') {
      return 'bg-red-600 text-white'
    } else if (rating === 'TV-14' || rating === 'PG-13') {
      return 'bg-orange-600 text-white'
    } else if (rating === 'TV-PG' || rating === 'PG') {
      return 'bg-yellow-600 text-white'
    } else if (rating === 'TV-Y' || rating === 'TV-Y7' || rating === 'G') {
      return 'bg-green-600 text-white'
    }
    return 'bg-gray-600 text-white'
  }

  return (
    <div
      onClick={() => onClick(option.id)}
      className={`
        relative rounded-lg cursor-pointer 
        transition-all duration-200 hover:scale-105
        ${
          isClicked
            ? 'gradient-border'
            : isSelected
              ? 'border-blue-400 bg-blue-900/50 ring-2 ring-blue-400/50 border p-2'
              : 'border border-gray-600 bg-gray-800/80 hover:border-gray-500 p-2'
        }
      `}
      style={{
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        minWidth: `${cardWidth}px`,
        minHeight: `${cardHeight}px`,
      }}
    >
      {isClicked ? (
        <div className="gradient-border-inner p-1 flex flex-col h-full">
          <div className="text-lg mb-1 flex-shrink-0">
            {option.image || '📺'}
          </div>
          <div className="text-white text-xs font-medium line-clamp-2 flex-grow">
            {option.title || 'Untitled'}
          </div>
          <div className="text-gray-400 text-[10px] truncate mt-1">
            {option.genre || 'Unknown'}
          </div>

          {/* Rating Badge */}
          {option.rating && (
            <div
              className={`
              absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded
              ${getRatingColor(option.rating)}
            `}
            >
              {option.rating}
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="text-lg mb-1 flex-shrink-0">
            {option.image || '📺'}
          </div>
          <div className="text-white text-xs font-medium line-clamp-2 flex-grow">
            {option.title || 'Untitled'}
          </div>
          <div className="text-gray-400 text-[10px] truncate mt-1">
            {option.genre || 'Unknown'}
          </div>

          {/* Rating Badge */}
          {option.rating && (
            <div
              className={`
              absolute top-1 right-1 text-[8px] font-bold px-1 py-0.5 rounded
              ${getRatingColor(option.rating)}
            `}
            >
              {option.rating}
            </div>
          )}
        </>
      )}
    </div>
  )
}

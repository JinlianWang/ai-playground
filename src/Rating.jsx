import { useState } from 'react'

const Rating = ({ initialRating = 0, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  const handleClick = (value) => {
    setRating(value)
    if (onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value) => {
    setHoverRating(value)
  }

  const handleMouseLeave = () => {
    setHoverRating(0)
  }

  const getStarColor = (starValue) => {
    if (hoverRating >= starValue || (!hoverRating && rating >= starValue)) {
      return '#FFD700'
    }
    return '#E0E0E0'
  }

  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((starValue) => (
        <button
          key={starValue}
          onClick={() => handleClick(starValue)}
          onMouseEnter={() => handleMouseEnter(starValue)}
          onMouseLeave={handleMouseLeave}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            fontSize: '24px',
            color: getStarColor(starValue),
            transition: 'color 0.2s ease',
            outline: 'none'
          }}
          aria-label={`Rate ${starValue} star${starValue !== 1 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  )
}

export default Rating
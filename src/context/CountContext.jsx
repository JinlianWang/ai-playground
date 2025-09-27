import { createContext, useContext, useEffect, useMemo, useState } from 'react'

export const STORAGE_KEY = 'policy-portal-count'

const CountContext = createContext()

export function CountProvider({ children, initialCount }) {
  const [count, setCount] = useState(() => {
    if (typeof initialCount === 'number') {
      return initialCount
    }

    const savedCount = localStorage.getItem(STORAGE_KEY)
    return savedCount ? parseInt(savedCount, 10) : 0
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, count.toString())
  }, [count])

  const incrementCount = () => {
    setCount((prev) => prev + 1)
  }

  const setCountFromRating = (newRating) => {
    setCount(newRating)
  }

  const value = useMemo(
    () => ({
      count,
      incrementCount,
      setCountFromRating,
    }),
    [count]
  )

  return <CountContext.Provider value={value}>{children}</CountContext.Provider>
}

export function useCount() {
  const context = useContext(CountContext)

  if (!context) {
    throw new Error('useCount must be used within a CountProvider')
  }

  return context
}

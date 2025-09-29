/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react'
import { STORAGE_KEY } from '../constants'

export const CountContext = createContext()

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

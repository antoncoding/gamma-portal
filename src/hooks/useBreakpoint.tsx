import { useState, useEffect } from 'react'
import { BreakPoints } from '../constants'

const getDeviceConfig = (width: number) => {
  if (width < 320) {
    return BreakPoints.xs
  } else if (width >= 320 && width < 720) {
    return BreakPoints.sm
  } else if (width >= 720 && width < 1024) {
    return BreakPoints.md
  } else {
    // width > 1024
    return BreakPoints.lg
  }
}

export const useBreakpoint = () => {
  const [brkPnt, setBrkPnt] = useState(() => getDeviceConfig(window.innerWidth))

  useEffect(() => {
    const calcInnerWidth = function () {
      setBrkPnt(getDeviceConfig(window.innerWidth))
    }
    window.addEventListener('resize', calcInnerWidth)
    return () => window.removeEventListener('resize', calcInnerWidth)
  }, [])

  return brkPnt
}

import React, { useCallback } from 'react'
import { useToast, GU } from '@aragon/ui'

export function useCustomToast() {
  const showToast = useToast()

  const toast = useCallback(
    msg => {
      showToast(
        <div style={{ display: 'block', flex: 1 }}>
          <span
            style={{
              display: 'block',
              position: 'relative',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: `${0.5 * GU}px`,
            }}
          >
            {msg}
          </span>
        </div>,
      )
    },
    [showToast],
  )

  const error = useCallback(
    msg => {
      toast(`😥 ${msg}`)
    },
    [toast],
  )

  const info = useCallback(
    msg => {
      toast(`🤩 ${msg}`)
    },
    [toast],
  )

  const success = useCallback(
    msg => {
      toast(`🥂 ${msg}`)
    },
    [toast],
  )

  return {
    error,
    info,
    success,
  }
}

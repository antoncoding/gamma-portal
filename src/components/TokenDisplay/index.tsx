import React from 'react'

import { useTheme } from '@aragon/ui'

export function EmptyToken() {

  const theme = useTheme()
  
  return (
    <div style={{color: theme.contentSecondary}}>  
        Empty
    </div>
  )
} 
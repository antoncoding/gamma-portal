import React, { useEffect } from 'react'
import { Header as AragonHeader } from '@aragon/ui'

// set tab title while using Header
export function Header({ primary, secondary, title }: { primary?: any; secondary?: any; title?: string }) {
  useEffect(() => {
    if (title) {
      document.title = title
    } else if (typeof primary === 'string') {
      document.title = primary
    }
  }, [primary, title])

  return <AragonHeader primary={primary} secondary={secondary} />
}

export default Header

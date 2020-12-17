import React from 'react'

import { useTheme } from '@aragon/ui'

function LabelText({ label }: { label: string }) {
  const theme = useTheme()

  return <div style={{ fontSize: 15, color: theme.contentSecondary, paddingRight: '2%' }}>{label}</div>
}

export default LabelText

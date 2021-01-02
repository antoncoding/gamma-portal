import React from 'react'

import { useTheme } from '@aragon/ui'

function LabelText({ label, minWidth }: { label: string; minWidth?: string }) {
  const theme = useTheme()

  return <div style={{ fontSize: 15, color: theme.contentSecondary, paddingRight: '2%', minWidth }}>{label}</div>
}

export default LabelText

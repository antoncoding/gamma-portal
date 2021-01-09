import React from 'react'
import { useTheme } from '@aragon/ui'

function WarningText({ text, show = false }: { text: string; show: boolean }) {
  const theme = useTheme()
  return show ? <div style={{ color: theme.warning, fontSize: 12, paddingTop: '3px' }}>{text}</div> : <></>
}

export default WarningText

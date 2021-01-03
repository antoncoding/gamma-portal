import React from 'react'
import { useTheme } from '@aragon/ui'

function SectionTitle({ title, paddingTop }: { title: any; paddingTop?: number }) {
  const theme = useTheme()
  return (
    <div
      style={{
        paddingTop: paddingTop !== undefined ? paddingTop : 20,
        paddingBottom: 10,
        fontSize: 20,
        color: theme.contentSecondary,
      }}
    >
      {title}
    </div>
  )
}

export default SectionTitle

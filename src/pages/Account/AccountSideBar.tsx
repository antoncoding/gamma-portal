import React from 'react'
import { useTheme } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'

export default function AccountSideBar() {
  const theme = useTheme()
  return (
    <div style={{backgroundColor: theme.surface, height: '100%', width: '100%'}}>
      <SectionTitle title="Section Header" />
    </div>
  )
}
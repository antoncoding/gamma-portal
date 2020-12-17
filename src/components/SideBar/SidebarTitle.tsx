import React from 'react'
import { useTheme, LinkBase } from '@aragon/ui'

function SidebarTitle({
  title,
  icon,
  onClick,
  isSelected,
}: {
  title: any
  icon: any
  isSelected: boolean
  onClick: any
}) {
  const theme = useTheme()

  const backGroundColor = isSelected ? theme.background : theme.surface
  const hintColor = isSelected ? theme.focus : theme.surface
  return (
    <div style={{ backgroundColor: backGroundColor }}>
      <div style={{ paddingLeft: '10%', paddingTop: '5%', borderLeft: '3px solid', borderColor: hintColor }}>
        <LinkBase onClick={onClick} style={{ width: '100%', paddingBottom: 10 }}>
          <div style={{ display: 'flex' }}>
            <div style={{ verticalAlign: 'middle', height: '100%' }}>{icon}</div>
            <div style={{ verticalAlign: 'middle', paddingLeft: 5, color: theme.contentSecondary, fontSize: 18 }}>
              {title}{' '}
            </div>
          </div>
        </LinkBase>
      </div>
    </div>
  )
}

export default SidebarTitle

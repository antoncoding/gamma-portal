import React from 'react';
import { useTheme, LinkBase } from '@aragon/ui'

function SubButton({ title, onClick, isSelected, shown }: { title: any, icon: any, isSelected: boolean, onClick: any, shown: boolean }) {
  const theme = useTheme()
  
  const backGroundColor = isSelected ? theme.background : theme.surface
  const hintColor = isSelected ? theme.focus : theme.surface
  return (
    shown ? <div style={{ backgroundColor: backGroundColor }}>
      <div style={{ paddingLeft: '20%', paddingTop: '2%', borderLeft: '3px solid', borderColor: hintColor }} >
        <LinkBase onClick={onClick} style={{ width: '100%', paddingBottom: 10}} >
          <div style={{ display: 'flex' }}>
            <div style={{ verticalAlign: 'middle', paddingLeft: 5, color: theme.contentSecondary, fontSize: 15 }}>{title} </div>
          </div>
        </LinkBase>
      </div>
    </div> : <> </>
  );
}

export default SubButton;

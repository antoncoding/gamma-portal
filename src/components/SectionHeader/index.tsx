import React from 'react';
import {useTheme} from '@aragon/ui'

function SectionTitle({ title }:{title: string}) {
  const theme = useTheme()
  return <div style={{ paddingTop: 10, paddingBottom: 10, fontSize: 20, color: theme.contentSecondary }}>{title}</div>;
}

export default SectionTitle;

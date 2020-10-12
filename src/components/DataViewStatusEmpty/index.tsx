import React from 'react';

import {useTheme} from '@aragon/ui'

function Status({ label }:{label: string}) {
  const theme = useTheme()
  return <div style={{ fontSize: 16, color: theme.contentSecondary }}>{label}</div>;
}

export default Status;

import React from 'react';
import { Button, IconStarFilled, IconStar, useTheme } from '@aragon/ui';

type switchThemeProps = {
  theme: string,
  updateTheme: Function
}

function SwitchMode({ updateTheme }: switchThemeProps) {
  const theme = useTheme()
  const handleChangeTheme = () => {
    if (theme === 'light') updateTheme('dark');
    else updateTheme('light');
  };

  return (
    <Button
      label={'Theme'}
      display="icon"
      icon={theme === 'dark' ? <IconStar /> : <IconStarFilled />}
      onClick={handleChangeTheme}
    />
  );
}


export default SwitchMode;

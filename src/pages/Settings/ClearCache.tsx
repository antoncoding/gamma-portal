import React, { useCallback } from 'react';

import SectionTitle from '../../components/SectionHeader'

import { Button, useToast } from '@aragon/ui'

function ClearCache() {

  const toast = useToast()
  const clearCache = useCallback(() => {
    window.localStorage.clear()
    toast("Cache Cleared")
  }, [toast])

  return (
    <>
      <SectionTitle title="System Cache" />
      <div> This web app use browser storage to cache used accounts, address labels and system preference. </div> 
      <br/>
      <Button label="Clear Cache" onClick = {clearCache}/>
    </>
  );
}

export default ClearCache;

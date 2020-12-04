import React, { useCallback } from 'react';

import SectionTitle from '../../components/SectionHeader'

import { Button } from '@aragon/ui'

import { Controller } from '../../utils/contracts/controller'
import { useConnection } from '../../hooks/useConnection';

function Refresh() {

  const { networkId, web3, user:account } = useConnection()
  
  const refresh = useCallback(async() => {
    const controller = new Controller(web3, networkId, account)
    await controller.refreshConfig()
  }, [web3, networkId, account])

  return (
    <>
      <SectionTitle title="Refresh Config" />
      <div> Refresh system config in the Controller contract </div> 
      <br/>
      <Button label="Refresh Controller" onClick = {refresh}/>
    </>
  );
}

export default Refresh;

import React from 'react'

import SectionTitle from '../../components/SectionHeader'

import { Button } from '@aragon/ui'

import { useController } from '../../hooks/useController'

function Refresh() {
  const { refreshConfig } = useController()

  return (
    <>
      <SectionTitle title="Refresh Config" />
      <div> Refresh system config in the Controller contract </div>
      <br />
      <Button label="Refresh Controller" onClick={refreshConfig} />
    </>
  )
}

export default Refresh

import React, { useState } from 'react'

import SectionTitle from '../../components/SectionHeader'

import { Button, useToast } from '@aragon/ui'
import { storePreference, getPreference } from '../../utils/storage'

import { FeeTier } from '../../constants/enums'

const fee = getPreference('fee', FeeTier.Ten)

function SettlementFee() {

  const [feeTier, setFeeTier] = useState<FeeTier>(fee as FeeTier)
  const toast = useToast()

  return (
    <>
      <div style={{ display: 'flex' }}>
        <SectionTitle title="Fee" />
      </div>

      <div >
        <div style={{ paddingRight: 20 }}> Settlement Fee </div>
        
        <div style={{ paddingTop: 3 }}>
          {' '}
          <Button
            mode={feeTier === FeeTier.Two ? "strong" : "normal"}
            size="small"
            label="2%"
            onClick={() => {
              setFeeTier(FeeTier.Two)
              storePreference('fee', FeeTier.Two)
              toast('Fee set to 2%')
            }}
          />{' '}
          <Button
            mode={feeTier === FeeTier.Five ? "strong" : "normal"}
            size="small"
            label="5%"
            onClick={() => {
              setFeeTier(FeeTier.Five)
              storePreference('fee', FeeTier.Five)
              toast('Fee set to 5%')
            }}
          />{' '}
          <Button
            mode={feeTier === FeeTier.Ten ? "strong" : "normal"}
            size="small"
            label="10%"
            onClick={() => {
              setFeeTier(FeeTier.Ten)
              storePreference('fee', FeeTier.Ten)
              toast('Fee set to 10%')
            }}
          />{' '}
        </div>
      </div>
    </>
  )
}

export default SettlementFee

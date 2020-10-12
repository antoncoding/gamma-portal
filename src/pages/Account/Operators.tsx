import React, { useContext, useMemo, useState } from 'react'
import { Button, DataView, TextInput } from '@aragon/ui'


import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'

import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'

export default function OperatorSection({ account, operatorRelations, isLoading }: { account: string, isLoading: boolean, operatorRelations: { operator: { id: string } }[] }) {

  const { web3, networkId, user } = useContext(walletContext)

  const [newOperatorAddr, setNewOperatorAddr] = useState('')

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  async function revokeOperator(operator) {
    await controller.updateOperator(operator, false)
  }

  async function addOperator() {
    await controller.updateOperator(newOperatorAddr, true)
  }

  const addOperatorButton = <Button
    label="Add"
    onClick={() => addOperator()}
    disabled={account !== user}
  />

  return (
    <>
      <SectionTitle title="Operators" />
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['Authorized Operators', 'action']}
        statusEmpty={<Status label={"No operator set"} />}
        entries={operatorRelations.map(relation => relation.operator)}
        renderEntry={(operator) => {
          return [
            <CustomIdentityBadge shorten={false} entity={operator.id} />,
            <Button
              label="revoke"
              onClick={() => revokeOperator(operator.id)}
            />]
        }}
      />
      <SectionTitle title="Add Operator" />
      <TextInput
        type="text"
        wide
        value={newOperatorAddr}
        onChange={(e) => { setNewOperatorAddr(e.target.value) }}
        adornment={addOperatorButton}
        adornmentPosition="end"
        adornmentSettings={{ width: '200px' }}
        readOnly={user !== account}
      />
    </>
  )
}

import React, { useContext, useMemo, useState } from 'react'
import { Button, DataView, TextInput, Header, useToast } from '@aragon/ui'
import { useParams } from 'react-router-dom';

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'

import { getAccount } from '../../utils/graph'
import useAsyncMemo from '../../hooks/useAsyncMemo'

import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'

export default function OperatorSection() {

  const { account } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const { web3, networkId, user } = useContext(walletContext)

  const toast = useToast()

  const accountData = useAsyncMemo(async () => {
    if (!account) return
    const result = await getAccount(networkId, account, toast)
    setIsLoading(false)
    return result
  }, null, [networkId, account])

  const operatorRelations = useMemo(() => accountData && accountData.operators ? accountData.operators : [], [accountData])

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
      <Header primary="Operators" />
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
        readOnly={user !== account}
      />
    </>
  )
}

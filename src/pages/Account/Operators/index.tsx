import React, { useState } from 'react'
import { Button, DataView, TextInput, Header, useToast, Tag } from '@aragon/ui'
import { useParams } from 'react-router-dom'

import { useConnectedWallet } from '../../../contexts/wallet'
import { getAccount } from '../../../utils/graph'
import useAsyncMemo from '../../../hooks/useAsyncMemo'
import SectionTitle from '../../../components/SectionHeader'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'
import { knownOperators } from '../../../constants/addresses'
import { OPERATORS } from '../../../constants/dataviewContents'
import { isEOA } from '../../../utils/others'
import { useController } from '../../../hooks/useController'

export default function OperatorSection() {
  const { account } = useParams()

  const [isLoading, setIsLoading] = useState(true)
  const { networkId, user } = useConnectedWallet()

  const toast = useToast()

  // fetch account data, check if each operator is EOA
  const operators = useAsyncMemo(
    async () => {
      if (!account) return []
      const accountData = await getAccount(networkId, account, toast)
      const operatorsRelations = accountData ? accountData.operators : []
      const operatorsWithExtraInfo = await Promise.all(
        operatorsRelations.map(async relation => {
          const isEOAAddress = await isEOA(relation.operator.id, networkId)
          return {
            address: relation.operator.id,
            isEOA: isEOAAddress,
          }
        }),
      )
      setIsLoading(false)
      return operatorsWithExtraInfo
    },
    [],
    [networkId, account],
  )

  const [newOperatorAddr, setNewOperatorAddr] = useState('')

  const controller = useController()

  async function revokeOperator(operator) {
    await controller.updateOperator(operator, false)
  }

  async function addOperator() {
    await controller.updateOperator(newOperatorAddr, true)
  }

  const addOperatorButton = <Button label="Add" onClick={() => addOperator()} disabled={account !== user} />

  return (
    <>
      <Header primary="Operators" />
      Operators are addresses which can manipulate your vaults on your behalf.
      <SectionTitle title="Authorized Operators" />
      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['address', 'label', 'tag', '']}
        emptyState={OPERATORS}
        entries={operators}
        renderEntry={({ address, isEOA }) => {
          let tag = <> </>
          let label = ''
          const operatorInfo = knownOperators[networkId].find(info => info.address === address)
          if (operatorInfo) {
            if (!operatorInfo.audited) {
              label = operatorInfo.name
              tag = (
                <Tag color="#FFC300" background="#FFF8BC">
                  {' '}
                  unverified{' '}
                </Tag>
              )
            } else {
              tag = (
                <Tag color="#006600" background="#c2f0c2">
                  {' '}
                  audited{' '}
                </Tag>
              )
              label = operatorInfo.name
            }
          } else if (isEOA) {
            tag = (
              <Tag color="#800000" background="#ffb3b3">
                {' '}
                EOA{' '}
              </Tag>
            )
          } else {
            tag = (
              <Tag color="#FFC300" background="#FFF8BC">
                {' '}
                unknown{' '}
              </Tag>
            )
          }
          return [
            <CustomIdentityBadge shorten={false} entity={address} />,
            label,
            tag,
            <Button label="revoke" onClick={() => revokeOperator(address)} />,
          ]
        }}
      />
      <SectionTitle title="Add Operator" />
      <TextInput
        type="text"
        wide
        value={newOperatorAddr}
        onChange={e => {
          setNewOperatorAddr(e.target.value)
        }}
        adornment={addOperatorButton}
        adornmentPosition="end"
        readOnly={user !== account}
      />
    </>
  )
}

import React, { useContext, useMemo, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom';

import { TextInput, Button, DataView, useToast, Tag, Header, IconCirclePlus, IconCircleMinus, DropDown } from '@aragon/ui'
import BigNumber from 'bignumber.js'

import { walletContext } from '../../contexts/wallet'
import { Controller } from '../../utils/contracts/controller'
import { getVault, getOTokens } from '../../utils/graph'
import SectionTitle from '../../components/SectionHeader'
import CustomIdentityBadge from '../../components/CustomIdentityBadge'
import Status from '../../components/DataViewStatusEmpty'
import { ZERO_ADDR, tokens } from '../../constants/addresses'
import { useTokenByAddress } from '../../hooks/useToken'
import { toTokenAmount, fromTokenAmount } from '../../utils/math'

import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function VaultDetail() {

  const [isLoading, setIsLoading] = useState(true)

  const [changeCollateralAmount, setChangeCollateralAmount] = useState(new BigNumber(0))
  const [changeLongAmount, setChangeLongAmount] = useState(new BigNumber(0))
  const [changeShortAmount, setChangeShortAmount] = useState(new BigNumber(0))

  // for dropdown options
  const [selectedCollateralIndex, setSelectedCollateralIndex] = useState(0)
  const [selectedLongIndex, setSelectedLongIndex] = useState(-1)
  const [selectedShortIndex, setSelectedShortIndex] = useState(-1)

  const { web3, networkId, user } = useContext(walletContext)
  const { owner, vaultId } = useParams()
  const toast = useToast()

  const vaultDetail = useAsyncMemo(async () => {
    const result = await getVault(networkId, owner, vaultId, toast)
    setIsLoading(false)
    return result
  }, null, [networkId, owner, toast, vaultId])

  const allOtokens = useAsyncMemo(async () => {
    const result = await getOTokens(networkId, toast)
    return result
  }, [networkId, toast])

  const controller = useMemo(() => new Controller(web3, networkId, user), [networkId, user, web3])

  const isAuthorized = useMemo(() => {
    if (vaultDetail === null) return false
    else if (owner === user) return true
    else return vaultDetail.owner.operators.map(o => o.operator.id).includes(user)
  }, [vaultDetail, owner, user])

  const collateralToken = useTokenByAddress(vaultDetail && vaultDetail.collateralAsset ? vaultDetail.collateralAsset : tokens[networkId][selectedCollateralIndex].address, networkId)

  const simpleAddCollateral = useCallback(async () => {
    await controller.simpleAddCollateral(user, vaultId, user, collateralToken.address, fromTokenAmount(changeCollateralAmount, collateralToken.decimals))
    setChangeCollateralAmount(new BigNumber(0))
  }, [collateralToken, controller, user, vaultId, changeCollateralAmount])

  const simpleRemoveCollateral = useCallback(async () => {
    await controller.simpleRemoveCollateral(user, vaultId, user, collateralToken.address, fromTokenAmount(changeCollateralAmount, collateralToken.decimals))
    setChangeCollateralAmount(new BigNumber(0))
  }, [controller, user, vaultId, collateralToken.address, collateralToken.decimals, changeCollateralAmount])

  const simpleAddLong = useCallback(async () => {
    const oToken = vaultDetail && vaultDetail.longOToken ? vaultDetail.longOToken.id : allOtokens ? allOtokens[selectedLongIndex].id : ZERO_ADDR
    await controller.simpleAddLong(user, vaultId, user, oToken, fromTokenAmount(changeLongAmount, 8))
    setChangeCollateralAmount(new BigNumber(0))
  }, [vaultDetail, allOtokens, selectedLongIndex, controller, user, vaultId, changeLongAmount])

  const simpleRemoveLong = useCallback(async () => {
    const oToken = vaultDetail && vaultDetail.longOToken ? vaultDetail.longOToken.id : allOtokens ? allOtokens[selectedLongIndex].id : ZERO_ADDR
    await controller.simpleRemoveLong(user, vaultId, user, oToken, fromTokenAmount(changeLongAmount, 8))
    setChangeCollateralAmount(new BigNumber(0))
  }, [vaultDetail, allOtokens, selectedLongIndex, controller, user, vaultId, changeLongAmount])

  const simpleMint = useCallback(async () => {
    const oToken = vaultDetail && vaultDetail.shortOToken ? vaultDetail.shortOToken.id : allOtokens ? allOtokens[selectedShortIndex].id : ZERO_ADDR
    await controller.simpleMint(user, vaultId, user, oToken, fromTokenAmount(changeShortAmount, 8))
    setChangeCollateralAmount(new BigNumber(0))
  }, [vaultDetail, allOtokens, selectedShortIndex, controller, user, vaultId, changeShortAmount])

  const simpleBurn = useCallback(async () => {
    const oToken = vaultDetail && vaultDetail.shortOToken ? vaultDetail.shortOToken.id : allOtokens ? allOtokens[selectedShortIndex].id : ZERO_ADDR
    await controller.simpleBurn(user, vaultId, user, oToken, fromTokenAmount(changeShortAmount, 8))
    setChangeCollateralAmount(new BigNumber(0))
  }, [vaultDetail, allOtokens, selectedShortIndex, controller, user, vaultId, changeShortAmount])

  const renderRow = useCallback(({ label, symbol, asset, amount, decimals, onInputChange, inputValue, onClickAdd, onClickMinus, dropdownSelected, dropdownOnChange, dropdownItems }) => {
    return [
      <div style={{ opacity: 0.8 }}> {label} </div>,
      asset
        ? <CustomIdentityBadge shorten={true} entity={asset} label={symbol} />
        : <DropDown
          items={dropdownItems}
          selected={dropdownSelected}
          onChange={dropdownOnChange}
        />,
      amount
        ? toTokenAmount(new BigNumber(amount), decimals).toString()
        : 0,
      <>
        <TextInput type="number" onChange={onInputChange} value={inputValue} />
        <Button label="Add" display="icon" icon={<IconCirclePlus />} onClick={onClickAdd} />
        <Button label="Remove" display="icon" icon={<IconCircleMinus />} onClick={onClickMinus} />
      </>
    ]
  }, [])

  return (
    <>
      <Header primary="Vault Detail" secondary={isAuthorized && <Tag mode="new">My vault</Tag>} />
      <DataView
        mode="table"
        status={isLoading ? 'loading' : 'default'}
        fields={['type', 'asset', 'amount', '']}
        statusEmpty={<Status label={"No vaults"} />}
        entries={[
          {
            label: 'Collateral',
            decimals: collateralToken.decimals,
            symbol: collateralToken.symbol,
            asset: vaultDetail?.collateralAsset,
            amount: vaultDetail?.collateralAmount,
            inputValue: changeCollateralAmount,
            onInputChange: (e) => (e.target.value ? setChangeCollateralAmount(new BigNumber(e.target.value)) 
              : setChangeCollateralAmount(new BigNumber(0))
            ),
            onClickAdd: simpleAddCollateral,
            onClickMinus: simpleRemoveCollateral,
            dropdownSelected: selectedCollateralIndex,
            dropdownOnChange: setSelectedCollateralIndex,
            dropdownItems: tokens[networkId]?.map(o => o.symbol)
          },
          {
            label: 'Long',
            decimals: 8,
            symbol: vaultDetail?.longOToken?.symbol,
            asset: vaultDetail?.longOToken?.id,
            amount: vaultDetail?.longAmount,
            inputValue: changeLongAmount,
            onInputChange: (e) => ( e.target.value ? setChangeLongAmount(new BigNumber(e.target.value))
              : setChangeLongAmount(new BigNumber(0))
            ),
            onClickAdd: simpleAddLong,
            onClickMinus: simpleRemoveLong,
            dropdownSelected: selectedLongIndex,
            dropdownOnChange: setSelectedLongIndex,
            dropdownItems: allOtokens?.map(o => o.symbol)
          },
          {
            label: 'Short',
            decimals: 8,
            symbol: vaultDetail?.shortOToken?.symbol,
            asset: vaultDetail?.shortOToken?.id,
            amount: vaultDetail?.shortAmount,
            inputValue: changeShortAmount,
            onInputChange: (e) => ( e.target.value ? setChangeShortAmount(e.target.value) 
            : setChangeShortAmount(new BigNumber(0))
          ),
            onClickAdd: simpleMint,
            onClickMinus: simpleBurn,
            dropdownSelected: selectedShortIndex,
            dropdownOnChange: setSelectedShortIndex,
            dropdownItems: allOtokens?.map(o => o.symbol)
          }
        ]}
        renderEntry={renderRow}
      />
      <br /><br />
      <SectionTitle title={'History'} />

    </>
  )
}

import React, { useMemo, useState, useEffect } from 'react'
import BigNumber from 'bignumber.js'
import { Doughnut } from 'react-chartjs-2'

import ChartBox from '../../components/ChartBox'
import { useAllProducts, getTokenPriceCoingecko } from '../../hooks'
import { addresses, themeColors, networkIdToAddressUrl } from '../../constants'
import { useConnectedWallet } from '../../contexts/wallet'
import { SubgraphToken } from '../../types'
import { toTokenAmount } from '../../utils/math'

const erc20Abi = require('../../constants/abis/erc20.json')

export default function TotalAsset() {
  const { allProducts } = useAllProducts()

  const { networkId, web3 } = useConnectedWallet()

  const [assetBalances, setAssetBalances] = useState<{ token: SubgraphToken; balance: BigNumber; price: BigNumber }[]>(
    [],
  )

  const allCollaterals = useMemo(() => allProducts.map(p => p.collateral), [allProducts])

  const poolAddress = useMemo(() => addresses[networkId].pool, [networkId])

  const data = useMemo(() => {
    const labels = assetBalances.map(a => a.token.symbol)
    const value = assetBalances.map(a => a.balance.times(a.price).integerValue())
    // const weight = [1, 5] // assetBalances.map(a => Number(a.price.toFixed(0)))
    const backgroundColor = assetBalances.map((a, i) => themeColors[i])
    return {
      datasets: [
        {
          label: 'TVL',
          borderWidth: 1,
          data: value,
          backgroundColor: backgroundColor,
        },
      ],
      labels,
    }
  }, [assetBalances])

  const tvl = useMemo(
    () =>
      assetBalances.reduce((prev, curr) => {
        return prev.plus(curr.price.times(curr.balance))
      }, new BigNumber(0)),
    [assetBalances],
  )

  useEffect(() => {
    let cancel = false
    async function syncBalances() {
      if (!web3) return
      const balances = await Promise.all(
        allCollaterals.map(async collateral => {
          const token = new web3.eth.Contract(erc20Abi, collateral.id)
          const price = collateral.symbol === 'USDC' ? new BigNumber(1) : await getTokenPriceCoingecko(collateral.id)
          const rawBalance: string = await token.methods.balanceOf(poolAddress).call()
          const balance = toTokenAmount(rawBalance, collateral.decimals).integerValue()
          return { token: collateral, balance, price }
        }),
      )
      setAssetBalances(balances)
    }
    if (!cancel) syncBalances()

    return () => {
      cancel = true
    }
  }, [networkId, poolAddress, web3, allCollaterals])

  return (
    <ChartBox
      title="TVL"
      description={`${tvl.toFormat()} USD`}
      onClickDescription={() => window.open(`${networkIdToAddressUrl[networkId]}/${poolAddress}`)}
    >
      <Doughnut data={data} />
    </ChartBox>
  )
}

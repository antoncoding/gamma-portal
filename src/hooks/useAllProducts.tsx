import { useMemo } from 'react'
import { useToast } from '@aragon/ui'
import { useConnectedWallet } from '../contexts/wallet'
import { useAsyncMemo } from '../hooks/useAsyncMemo'
import { getWhitelistedProducts } from '../utils/graph'
import { SubgraphToken } from '../types'

type Product = {
  id: string
  strike: SubgraphToken
  collateral: SubgraphToken
  underlying: SubgraphToken
  isPut: boolean
  label: string
}

export function useAllProducts(): { allProducts: Product[] } {
  const { networkId } = useConnectedWallet()
  const toast = useToast()

  const allProducts = useAsyncMemo(
    async () => {
      const products = await getWhitelistedProducts(networkId, toast)
      if (products === null) return []

      return products.map(product => {
        const type = product.isPut ? 'Put' : 'Call'
        const optionName = `${product.underlying.symbol}-${product.strike.symbol} ${type} ${product.collateral.symbol} Collateral`
        return {
          label: optionName,
          ...product,
        }
      })
    },
    [],
    [networkId],
  )

  return { allProducts }
}

type Series = {
  underlying: SubgraphToken
  strike: SubgraphToken
}

export function useAllSeries() {
  const { allProducts } = useAllProducts()

  const allSeries = useMemo(() => {
    return allProducts.reduce((prev: Series[], curr) => {
      const included = prev.find(
        entry => entry.underlying.id === curr.underlying.id && entry.strike.id === curr.strike.id,
      )
      if (!included) return [...prev, { underlying: curr.underlying, strike: curr.strike }]
      return prev
    }, [])
  }, [allProducts])

  return { allSeries }
}

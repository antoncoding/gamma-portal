import BigNumber from 'bignumber.js'
import { subgraph as endpoints } from '../constants/endpoints'
import { blacklistOTokens } from '../constants/addresses'
import { SupportedNetworks } from '../constants/networks'
import { SubgraphVault, SubgraphToken, SubgraphOracleAsset, SubgraphOToken, OTokenBalance, OTokenTrade } from '../types'

/**
 * Get account info
 */
export async function getAccount(
  networkId: SupportedNetworks,
  account: string,
  errorCallback: Function,
): Promise<{
  operatorCount: string
  operators: { operator: { id: string } }[]
  vaultCount: string
  vaults: SubgraphVault[]
} | null> {
  const query = `
  {
    account(id: "${account}") {
      vaultCount
      vaults {
        vaultId
        collateralAsset {
          id
          symbol
          decimals
        }
        collateralAmount
        shortOToken{
          id
          symbol
          decimals
          expiryTimestamp
          underlyingAsset {
            symbol
            id
          }
        }
        shortAmount
        longOToken {
          id
          symbol
          decimals
          expiryTimestamp
          underlyingAsset {
            symbol
            id
          }
        }
        longAmount
      }
      operatorCount
      operators {
        operator {
          id
        }
      }
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.account
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export async function getOTokenTrades(
  networkId: SupportedNetworks,
  otoken: string,
  errorCallback: Function,
): Promise<OTokenTrade[]> {
  const query = `{
    otokenTrades(
      where: {
        oToken_contains: "${otoken}"
      }, 
      orderBy: timestamp, 
      orderDirection: desc
    ) {
      oTokenAmount
      paymentTokenAmount
      paymentToken {
        symbol
        decimals
        id
      }
      buyer
      seller
      timestamp
      transactionHash
    }
  }
  `
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.otokenTrades
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

export async function getERC20s(
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<SubgraphToken[] | null> {
  const query = `
  {
    erc20S{
      symbol
      id
      decimals
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.erc20S
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export async function getWhitelistedProducts(
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<
  | {
      id: string
      strike: SubgraphToken
      collateral: SubgraphToken
      underlying: SubgraphToken
      isPut: boolean
    }[]
  | null
> {
  const query = `
  {
    whitelistedProducts (where:{isWhitelisted: true}) {
      id
      strike {
        symbol
        id
        decimals
      }
      underlying {
        symbol
        id
        decimals
      }
      collateral {
        symbol
        id
        decimals
      }
      isPut
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.whitelistedProducts
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export async function getVault(
  networkId: SupportedNetworks,
  accountOwner: string,
  vaultId: number,
  errorCallback: Function,
): Promise<null | {
  collateralAmount: string | null
  collateralAsset: null | { id: string; symbol: string }
  longAmount: string | null
  longOToken: null | SubgraphOToken
  owner: {
    operators: {
      operator: {
        id: string
      }
    }[]
  }
  shortAmount: null | string
  shortOToken: null | SubgraphOToken
}> {
  const query = `{
    vault(id: "${accountOwner}-${vaultId}")
    {
      owner {
        operators {
          operator {
            id
          }
        }
      }
      shortOToken {
        id
        symbol
        decimals
        expiryTimestamp
        collateralAsset {
          id
          symbol
          decimals
        }
        underlyingAsset{
          id
          symbol
          decimals
        }
      }
      shortAmount
      collateralAsset {
        id
        symbol
        decimals
      }
      collateralAmount
      longOToken {
        id
        symbol
        decimals
        expiryTimestamp
        collateralAsset {
          id
          symbol
          decimals
        }
        underlyingAsset{
          id
          symbol
          decimals
        }
      }
      longAmount 
    }
  }
  `
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.vault
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

/**
 * Get all oTokens
 */
export async function getOTokens(networkId: SupportedNetworks, errorCallback: Function): Promise<SubgraphOToken[]> {
  const query = `
  {
    otokens (
      first: 1000, 
      orderBy: createdAt, 
      orderDirection: desc
    ) {
      id
      symbol
      name
      strikeAsset {
        id
        symbol
        decimals
      }
      underlyingAsset {
        id
        symbol
        decimals
      }
      collateralAsset {
        id
        symbol
        decimals
      }
      strikePrice
      isPut
      expiryTimestamp
      createdAt
      createdTx
      creator
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const oTokens = response.data.otokens.filter(
      (otoken: { id: string }) => !blacklistOTokens[networkId].includes(otoken.id),
    )
    return oTokens
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

export async function getNonEmptyPartialCollatVaults(
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<SubgraphVault[]> {
  const query = `
  { 
    vaults (
      where: {
        type:"1",
        shortAmount_gt: "0"
      },
      first: 1000
    ) {
      type
      owner {
        id
      }
      vaultId
      shortOToken {
        id
        symbol
        decimals
        expiryTimestamp
        strikePrice
        collateralAsset {
          id
          symbol
          decimals
        }
        underlyingAsset{
          id
          symbol
          decimals
        }
        strikeAsset{
          id
          symbol
          decimals
        }
        isPut
      }
      shortAmount
      collateralAsset {
        id
        symbol
        decimals
      }
      collateralAmount
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.vaults
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

/**
 * Get oTokens
 */
export async function getOToken(
  id: string,
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<SubgraphOToken | null> {
  const query = `
  {
    otoken (id: "${id}") {
      id
      symbol
      name
      decimals
      strikeAsset {
        id
        symbol
        decimals
      }
      underlyingAsset {
        id
        symbol
        decimals
      }
      collateralAsset {
        id
        symbol
        decimals
      }
      strikePrice
      isPut
      expiryTimestamp
      createdAt
      createdTx
      creator
      totalSupply
      decimals
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.otoken
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export async function getHolders(
  otoken: string,
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<{ account: string; balance: string }[]> {
  const query = `
  {
    accountBalances (where: {token: "${otoken.toLowerCase()}"}) {
      account
      balance
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const balances = response.data.accountBalances.filter(
      (balanceEntry: { account: string; balance: string }) => balanceEntry.balance !== '0',
    )
    return balances
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

export async function getMintersForOToken(
  otoken: string,
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<string[]> {
  const query = `
  {
    mintShortActions (first: 1000, where:{
      oToken: "${otoken.toLowerCase()}"
    }) {
      to
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const actions = response.data.mintShortActions
    const uniqueMinters = Array.from(new Set(actions.map((a: { to: string }) => a.to)))
    return uniqueMinters as string[]
  } catch (error) {
    errorCallback(error.toString())
    return []
  }
}

/**
 * Get all oTokens
 */
export async function getLiveOTokens(
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<SubgraphOToken[] | null> {
  const current = new BigNumber(Date.now()).div(1000).integerValue().toString()
  const query = `
  {
    otokens (where: {expiryTimestamp_gt: ${current}}) {
      id
      symbol
      name
      decimals
      strikeAsset {
        id
        symbol
        decimals
      }
      underlyingAsset {
        id
        symbol
        decimals
      }
      collateralAsset {
        id
        symbol
        decimals
      }
      strikePrice
      isPut
      expiryTimestamp
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const oTokens = response.data.otokens.filter(
      (otoken: { id: string }) => !blacklistOTokens[networkId].includes(otoken.id),
    )
    return oTokens
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

/**
 * Get all oTokens that's in the series
 */
export async function getLiveOTokensIsSeries(
  networkId: SupportedNetworks,
  underlyingAddr: string,
  strikeAddr: string,
  errorCallback: Function,
): Promise<SubgraphOToken[] | null> {
  const current = new BigNumber(Date.now()).div(1000).integerValue().toString()
  const query = `
  {
    otokens (where: {
      expiryTimestamp_gt: ${current},
      underlyingAsset: "${underlyingAddr}",
      strikeAsset: "${strikeAddr}",
    }) {
      id
      symbol
      name
      decimals
      strikeAsset {
        id
        symbol
        decimals
      }
      underlyingAsset {
        id
        symbol
        decimals
      }
      collateralAsset {
        id
        symbol
        decimals
      }
      strikePrice
      isPut
      expiryTimestamp
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const oTokens = response.data.otokens.filter(
      (otoken: { id: string }) => !blacklistOTokens[networkId].includes(otoken.id),
    )
    return oTokens
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export async function getBalances(
  networkId: SupportedNetworks,
  owner: string,
  errorCallback: Function,
): Promise<OTokenBalance[] | null> {
  const query = `
  {
    accountBalances (where: {account: "${owner}"}) {
      token {
        id
        name
        symbol
        decimals
        underlyingAsset{
          id
          symbol
          decimals
        }
        strikeAsset {
          id
          symbol
          decimals
        }
        collateralAsset {
          id
          symbol
          decimals
        }
        strikePrice
        expiryTimestamp
        isPut
      }
    balance
  }
}`
  try {
    const response = await postQuery(endpoints[networkId], query)
    const balances = response.data.accountBalances
    return balances
      .map((b: OTokenBalance) => {
        return {
          ...b,
          balance: new BigNumber(b.balance),
        }
      })
      .filter(b => !b.balance.isZero())
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export const getVaultHistory = async (
  networkId: SupportedNetworks,
  owner: string,
  vaultId: number,
  errorCallback: Function,
) => {
  const query = `{
    depositCollateralActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      asset {
        id
        symbol
        decimals
      }
      amount
      timestamp
      transactionHash
    }
    withdrawCollateralActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      asset {
        id
        symbol
        decimals
      }
      amount
      timestamp
      transactionHash
    }
    depositLongActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    withdrawLongActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    mintShortActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    burnShortActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    settleActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      id
      short {
        symbol
        id
        collateralAsset {
          id
          symbol
          decimals
        }
      }
      collateral
      amount
      timestamp
      transactionHash
    }
  }
  `
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

export const getOracleAssetsAndPricers = async (
  networkId: SupportedNetworks,
  errorCallback: Function,
): Promise<SubgraphOracleAsset[] | null> => {
  const query = `{
    oracleAssets {
     asset {
       id
       symbol
       decimals
     }
     pricer {
       id
       lockingPeriod
       disputePeriod
     }
     prices (first: 1000) {
      expiry
      reportedTimestamp
      isDisputed
      price
     }
   }
   }`
  try {
    const response = await postQuery(endpoints[networkId], query)
    return response.data.oracleAssets
  } catch (error) {
    errorCallback(error.toString())
    return null
  }
}

const postQuery = async (endpoint: string, query: string) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  }
  const url = endpoint
  const response = await fetch(url, options)
  const data = await response.json()
  if (data.errors) {
    throw new Error(data.errors[0].message)
  } else {
    return data
  }
}

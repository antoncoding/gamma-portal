import { subgraph as endpoints } from '../constants/endpoints';
import { blacklistOTokens } from '../constants/addresses'
import { SupportedNetworks } from '../constants/networks';
import { SubgraphVault, SubgraphToken } from '../types';

/**
 * Get all oTokens
 */
export async function getAccount(
  networkId: SupportedNetworks,
  account: string,
  errorCallback: Function
): Promise<{
  operatorCount: string;
  operators: { operator: { id: string } }[];
  vaultCount: string;
  vaults: SubgraphVault[];
} | null> {
  const query = `
  {
    account(id: "${account}") {
      vaultCount
      vaults {
        id
        collateralAsset {
          id
          symbol
        }
        collateralAmount
        shortOToken{
          id
          symbol
        }
        shortAmount
        longOToken {
          id
          symbol
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
  }`;
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data.account;
  } catch (error) {
    errorCallback(error.toString());
    return null;
  }
}

export async function getWhitelistedProducts(networkId: SupportedNetworks, errorCallback: Function) : Promise <{
  id: string,
  strike: SubgraphToken
  collateral: SubgraphToken
  underlying: SubgraphToken
  isPut: boolean
}[] | null> {
  const query = `
  {
    whitelistedProducts (where:{isWhitelisted: true}) {
      id
      strike {
        symbol
        id
      }
      underlying {
        symbol
        id
      }
      collateral {
        symbol
        id
      }
      isPut
    }
  }`
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data.whitelistedProducts;
  } catch (error) {
    errorCallback(error.toString());
    return null;
  }
} 

export async function getVault(
  networkId: SupportedNetworks,
  accountOwner: string,
  vaultId: number,
  errorCallback: Function
): Promise< null | {
  collateralAmount: string | null;
  collateralAsset: null | { id: string, symbol: string };
  longAmount: string | null;
  longOToken: null | { id: string, symbol: string };
  owner: {
    operators: {
      operator: {
        id: string;
      };
    }[];
  };
  shortAmount: null | string;
  shortOToken: null | { id: string, symbol: string };
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
      }
      longAmount 
    }
  }
  `;
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data.vault;
  } catch (error) {
    errorCallback(error.toString());
    return null;
  }
}

/**
 * Get all oTokens
 */
export async function getOTokens(
  networkId: SupportedNetworks,
  errorCallback: Function
): Promise<
  | {
      id: string;
      symbol: string,
      name: string;
      strikeAsset: {id:string, symbol:string};
      strikePrice: string
      underlyingAsset: {id:string, symbol:string};
      collateralAsset: {id:string, symbol:string};
      isPut: boolean;
      expiryTimestamp: string;
      createdAt: string;
      createdTx: string;
    }[]
  | null
> {
  const query = `
  {
    otokens {
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
    }
  }`;
  try {
    const response = await postQuery(endpoints[networkId], query);
    
    const oTokens = response.data.otokens.filter((otoken: {id: string}) => !blacklistOTokens[networkId].includes(otoken.id));
    return oTokens
  } catch (error) {
    errorCallback(error.toString());
    return null;
  }
}

export const getVaultHistory = async (networkId: SupportedNetworks,
  owner: string,
  vaultId: number,
  errorCallback: Function) => {
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
  }
  `
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data;
  } catch (error) {
    errorCallback(error.toString());
    return null;
  }
}

const postQuery = async (endpoint: string, query: string) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  };
  const url = endpoint;
  const response = await fetch(url, options);
  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  } else {
    return data;
  }
};

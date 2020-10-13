import { subgraph as endpoints } from '../constants/endpoints';
import { SupportedNetworks } from '../constants/networks';
import { SubgraphVault } from '../types';
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
        collateralAsset
        collateralAmount
        shortOToken{
          id
        }
        shortAmount
        longOToken {
          id
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

export async function getVault(
  networkId: SupportedNetworks,
  accountOwner: string,
  vaultId: number,
  errorCallback: Function
): Promise< null | {
  collateralAmount: string | null;
  collateralAsset: string | null;
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
      collateralAsset
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
      strikeAsset: string;
      underlyingAsset: string;
      collateralAsset: string;
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
      strikeAsset
      underlyingAsset
      collateralAsset
      isPut
      expiryTimestamp
      createdAt
      createdTx
    }
  }`;
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data.otokens;
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
      asset
      amount
      timestamp
      transactionHash
    }
    withdrawCollateralActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      asset
      amount
      timestamp
      transactionHash
    }
    depositLongActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    withdrawLongActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    mintShortActions (where: {vault_contains: "${owner}-${vaultId}"}) {
      oToken {
        symbol
        id
      }
      amount
      timestamp
      transactionHash
    }
    burnShortActions (where: {vault_contains: "${owner}-${vaultId}"}) {
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

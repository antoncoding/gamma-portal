import { subgraph as endpoints} from '../constants/endpoints'
import { SupportedNetworks } from '../constants/networks';
import { SubgraphVault } from '../types'
/**
 * Get all oTokens
 */
export async function getAccount(
  networkId: SupportedNetworks,
  account: string,
  errorCallback: Function
): Promise<
  {
    operatorCount: string;
    operators: string[];
    vaultCount: string;
    vaults: SubgraphVault[];
  } | null
> {
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
        id
      }
    }
  }`;
  try {
    const response = await postQuery(endpoints[networkId], query);
    return response.data.account;
  } catch (error) {
    errorCallback(error)
    return null
  }
  
}

/**
 * Get all oTokens
 */
export async function getOTokens(networkId: SupportedNetworks, errorCallback: Function): Promise<
  {
    id: string;
    strikeAsset: string;
    underlyingAsset: string;
    collateralAsset: string;
    isPut: boolean;
    expiryTimestamp: string;
    createdAt: string;
    createdTx: string
  }[] | null
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
    errorCallback(error)
    return null
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
  const data =  await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message)
  } else {
    return data
  }
};

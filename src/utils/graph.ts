import { subgraph as endpoints} from '../constants/endpoints'
import { SupportedNetworks } from '../constants/networks';

/**
 * Get vaults for one option
 */
export async function getOTokens(
  networkId: SupportedNetworks
): Promise<
  {
    id: string;
    strikeAsset: string;
    underlyingAsset: string;
    collateralAsset: string;
    isPut: boolean;
    expiryTimestamp: string;
    createdAt: string;
    createdTx: string
  }[]
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
  const response = await postQuery(endpoints[networkId], query);
  return response.data.otokens;
}

const postQuery = async (endpoint: string, query: string) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  };
  const url = endpoint;
  const res = await fetch(url, options);
  return res.json();
};

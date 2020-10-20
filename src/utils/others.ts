import Web3 from 'web3';
import ENS from 'ethereum-ens';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
const web3 = new Web3(`https://mainnet.infura.io/v3/${INFURA_KEY}`);
const ens = new ENS(web3);

// ENS
export const resolveENS = async (ensName) => {
  const address = await ens.resolver(ensName).addr();
  return address.toLowerCase();
};
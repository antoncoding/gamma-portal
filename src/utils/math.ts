import BigNumber from "bignumber.js";

const Web3 = require('web3')
const web3 = new Web3();

export function toTokenAmount(wei: BigNumber, decimals: number) {
  return wei.div(new BigNumber(10).pow(new BigNumber(decimals)))
}

export function fromTokenAmount(amount: BigNumber, decimals: number) {
  return amount.times(new BigNumber(10).pow(new BigNumber(decimals)))
}

export function timeSince(timeStamp) {
  const now = new Date();
  const secondsPast = (now.getTime() - timeStamp) / 1000;
  if (secondsPast < 60) {
    return `${parseInt(secondsPast.toString(), 10)}s ago`;
  }
  if (secondsPast < 3600) {
    return `${parseInt((secondsPast / 60).toString(), 10)}m ago`;
  }
  if (secondsPast <= 86400) {
    return `${parseInt((secondsPast / 3600).toString(), 10)}h ago`;
  }
  if (secondsPast > 86400) {
    const ts = new Date(timeStamp);
    const day = ts.getDate();
    const month = (ts
      .toDateString()
      .match(/ [a-zA-Z]*/) as RegExpMatchArray)[0] 
      .replace(' ', '');
    const year = ts.getFullYear() === now.getFullYear() ? '' : ` ${ts.getFullYear()}`;
    return `${day} ${month}${year}`;
  }

  return timeStamp;
}

export function expiryToDate(timestamp: number | string) {
  const timestampNum = Number(timestamp)
  return new Date(timestampNum * 1000).toDateString()
}

export const isAddress = web3.utils.isAddress;

/**
 * @returns {number} timestamp (in s)
 */
export function getNextFriday(): number {
  const date = new Date()
  date.setUTCDate(date.getUTCDate() + (7 + 5 - date.getUTCDay()) % 7);
  date.setMinutes(0)
  date.setSeconds(0)
  date.setMilliseconds(0)
  date.setUTCHours(8)
  return (date.getTime() / 1000);
}
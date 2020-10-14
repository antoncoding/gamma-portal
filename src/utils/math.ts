import BigNumber from "bignumber.js";

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
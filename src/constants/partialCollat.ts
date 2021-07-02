export const EthSpotShock = 0.6

export const timeLeftToPT = (timeLeft: number) => {
  if (timeLeft < 604800) return 0.1946
  if (timeLeft < 1209600) return 0.2738
  if (timeLeft < 2419200) return 0.3818
  if (timeLeft < 3628800) return 0.46
  if (timeLeft < 4838400) return 0.522
  if (timeLeft < 6048000) return 0.5735
  if (timeLeft < 7257600) return 0.6171
  if (timeLeft < 8467200) return 0.6548
  if (timeLeft < 9676800) return 0.6878
  if (timeLeft < 10886400) return 0.7168
  if (timeLeft < 12096000) return 0.7425
  if (timeLeft < 13305600) return 0.7654
  if (timeLeft < 14515200) return 0.7859
  if (timeLeft < 15724800) return 0.8044
  if (timeLeft < 16934400) return 0.821
  else return 1
}

export const AUCTION_TIME = 5400

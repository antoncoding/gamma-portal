import React, { useMemo, useEffect, useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { Col, Row } from 'react-grid-system'
import { useParams } from 'react-router-dom'
import { Box, AddressField, Button, DataView, IconExternal, Tag, TransactionBadge } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import SectionTitle from '../../../components/SectionHeader'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'

import { useCustomToast, useTokenPrice, useExpiryPriceData } from '../../../hooks'
import useAsyncMemo from '../../../hooks/useAsyncMemo'
import { getOToken, getHolders, getMintersForOToken, getOTokenTrades } from '../../../utils/graph'
import { simplifyOTokenSymbol, isExpired, getExpiryPayout } from '../../../utils/others'
import { toTokenAmount, fromTokenAmount, timeSince } from '../../../utils/math'
import { getTokenImg } from '../../../imgs/utils'
import { networkIdToAddressUrl } from '../../../constants'
import BigNumber from 'bignumber.js'
import { OTokenTrade } from '../../../types'

export default function VaultDetail() {
  useEffect(() => {
    ReactGA.pageview('account/otoken/')
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0)

  const { networkId } = useConnectedWallet()
  const { otoken } = useParams()

  const { allOracleAssets } = useExpiryPriceData()

  const toast = useCustomToast()

  const tokenDetails = useAsyncMemo(
    async () => {
      const result = await getOToken(otoken, networkId, toast.error)
      setIsLoading(false)
      return result
    },
    null,
    [otoken, networkId],
  )

  const holders = useAsyncMemo(
    async () => {
      return await getHolders(otoken, networkId, toast.error)
    },
    [],
    [otoken, networkId],
  )

  const sellers = useAsyncMemo(
    async () => {
      return await getMintersForOToken(otoken, networkId, toast.error)
    },
    [],
    [otoken, networkId],
  )

  const trades = useAsyncMemo(
    async () => {
      return await getOTokenTrades(networkId, otoken, toast.error)
    },
    [],
    [otoken, networkId, tokenDetails],
  )

  const volume = useMemo(() => {
    if (!tokenDetails) return new BigNumber(0)
    const totalOTokenRawAmt = trades.reduce((prev, curr) => {
      return prev.plus(curr.oTokenAmount)
    }, new BigNumber(0))
    const totalOTokenAmt = toTokenAmount(totalOTokenRawAmt, 8)
    const strikePrice = toTokenAmount(tokenDetails?.strikePrice, 8)
    return strikePrice.multipliedBy(totalOTokenAmt)
  }, [trades, tokenDetails])

  const underlyingPrice = useTokenPrice(tokenDetails?.underlyingAsset.id || undefined, 30)

  const tokenExpired = useMemo(() => (tokenDetails ? isExpired(tokenDetails) : false), [tokenDetails])

  const payOut = useMemo(() => {
    if (tokenDetails === null) return new BigNumber(0)
    const asset = allOracleAssets.find(a => a.asset.id === tokenDetails.underlyingAsset.id)
    if (!asset) return new BigNumber(0)
    const expiryPrice = asset.prices.find(p => p.expiry === tokenDetails.expiryTimestamp)?.price
    if (expiryPrice === undefined) return new BigNumber(-1)

    return getExpiryPayout(tokenDetails, '100000000', expiryPrice)
  }, [allOracleAssets, tokenDetails])

  const estPayOut = useMemo(() => {
    if (tokenDetails === null) return new BigNumber(0)
    return getExpiryPayout(tokenDetails, '100000000', fromTokenAmount(underlyingPrice, 8).toString())
  }, [underlyingPrice, tokenDetails])

  const renderTradeRow = useCallback(
    (trade: OTokenTrade) => {
      // amount', 'price', 'seller', 'buyer', 'timestamp', 'tx
      return [
        toTokenAmount(trade.oTokenAmount, 8).toFixed(2),
        toTokenAmount(trade.paymentTokenAmount, trade.paymentToken.decimals)
          .div(toTokenAmount(trade.oTokenAmount, 8))
          .toFixed(4),
        <CustomIdentityBadge entity={trade.seller} />,
        <CustomIdentityBadge entity={trade.buyer} />,
        timeSince(Number(trade.timestamp) * 1000),
        <TransactionBadge
          transaction={trade.transactionHash}
          networkType={networkId === 1 ? 'main' : networkId === 42 ? 'kovan' : 'rinkeby'}
        />,
      ]
    },
    [networkId],
  )

  return (
    <>
      {tokenDetails === null ? (
        <SectionTitle title="Token Not Found on this network. " />
      ) : (
        <>
          <Header
            primary={
              <div style={{ fontSize: 26 }}>
                {simplifyOTokenSymbol(tokenDetails.symbol)}
                {tokenExpired ? <Tag> Expired </Tag> : <Tag mode="new"> Live </Tag>}
                <Button
                  icon={<IconExternal />}
                  size="mini"
                  onClick={() => {
                    window.open(`${networkIdToAddressUrl[networkId]}/${tokenDetails.id}`)
                  }}
                />
              </div>
            }
            title={simplifyOTokenSymbol(tokenDetails.symbol)}
          />
          <Row>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Underlying">
                <AddressField
                  address={tokenDetails.underlyingAsset.id}
                  icon={
                    <img height={20} src={getTokenImg(tokenDetails.underlyingAsset) || undefined} alt={'underlying'} />
                  }
                />
              </Box>
            </Col>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Strike">
                <AddressField
                  address={tokenDetails.strikeAsset.id}
                  icon={<img height={20} src={getTokenImg(tokenDetails.strikeAsset) || undefined} alt={'strike'} />}
                />
              </Box>
            </Col>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Collateral">
                <AddressField
                  address={tokenDetails.collateralAsset.id}
                  icon={<img height={20} src={getTokenImg(tokenDetails.collateralAsset) || undefined} alt={'colla'} />}
                />
              </Box>
            </Col>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Open Interest">
                <div style={{ display: 'flex', height: 40 }}>
                  <div style={{ fontSize: 20, paddingRight: 10 }}>
                    {toTokenAmount(tokenDetails.totalSupply, 8).toFormat()}
                  </div>
                  <img
                    style={{ paddingTop: 3 }}
                    height={30}
                    src={getTokenImg(tokenDetails) || undefined}
                    alt={'colla'}
                  />
                </div>
              </Box>
            </Col>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Holders">
                <div style={{ display: 'flex', height: 40 }}>{holders?.length}</div>
              </Box>
            </Col>
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Sellers">
                <div style={{ display: 'flex', height: 40 }}>{sellers?.length}</div>
              </Box>
            </Col>
            {
              <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
                {tokenExpired ? (
                  <Box heading="Payout">
                    <div style={{ display: 'flex', height: 40 }}>
                      {`${payOut.toFixed(6)} ${tokenDetails.collateralAsset.symbol}`}
                    </div>
                  </Box>
                ) : (
                  <Box heading="Est. Payout">
                    <div style={{ display: 'flex', height: 40 }}>
                      {`${estPayOut.toFixed(6)} ${tokenDetails.collateralAsset.symbol}`}
                    </div>
                    {/* <Timer format="dhm" showIcon end={new Date(Number(tokenDetails.expiryTimestamp) * 1000)} /> */}
                  </Box>
                )}
              </Col>
            }
            <Col md={6} sm={12} lg={4} xl={3} style={{ paddingTop: 10 }}>
              <Box heading="Notional Volume">
                <div style={{ display: 'flex', height: 40 }}>${volume.toFormat()}</div>
              </Box>
            </Col>
          </Row>

          <Row style={{ paddingTop: 10 }}>
            <Col lg={12}>
              <DataView
                status={isLoading ? 'loading' : 'default'}
                heading="Recent Trades"
                fields={['amount', 'price', 'seller', 'buyer', 'timestamp', 'tx']}
                entries={trades}
                renderEntry={renderTradeRow}
                entriesPerPage={5}
                page={page}
                onPageChange={setPage}
              />
            </Col>
          </Row>
        </>
      )}
    </>
  )
}

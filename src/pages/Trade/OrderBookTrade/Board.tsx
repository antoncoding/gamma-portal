import React, { useMemo, useCallback } from 'react'

import { DataView, Radio, SyncIndicator } from '@aragon/ui'
import { SubgraphOToken } from '../../../types'
import { OTOKENS_BOARD } from '../../../constants/dataviewContents'
import { toTokenAmount } from '../../../utils/math'
import { useOrderbook } from '../../../contexts/orderbook'
import { getOrderBookDetail } from '../../../utils/0x-utils'

import { green, red, onclickWrapper, bold, secondary } from './StyleDiv'
import BigNumber from 'bignumber.js'

const iv = require('implied-volatility')

type BoardRow = {
  strikePrice: string
  expiry: string
  put?: SubgraphOToken
  call?: SubgraphOToken
}

type RowWithDetail = BoardRow & {
  callBid: string
  callBidSize: string
  callAsk: string
  callAskSize: string
  putBid: string
  putBidSize: string
  putAsk: string
  putAskSize: string
}

type RowWithGreeks = RowWithDetail & {
  putbidIV: string
  putAskIV: string
  callbidIV: string
  callAskIV: string
}

type BoardProps = {
  oTokens: SubgraphOToken[]
  selectedOToken: SubgraphOToken | null
  setSelectedOToken: any
  spotPrice: BigNumber
}

export default function Board({ oTokens, selectedOToken, setSelectedOToken, spotPrice }: BoardProps) {
  const { isLoading: isLoadingOrderbook, orderbooks } = useOrderbook()

  const rows = useMemo(() => {
    let _rows: BoardRow[] = []
    const _sortedOTokens = oTokens.sort((a, b) => (Number(a.strikePrice) > Number(b.strikePrice) ? 1 : -1))
    for (const otoken of _sortedOTokens) {
      const target = _rows.find(r => r.strikePrice === otoken.strikePrice)
      if (!target) {
        if (otoken.isPut) {
          _rows.push({ strikePrice: otoken.strikePrice, put: otoken, expiry: otoken.expiryTimestamp })
        } else {
          _rows.push({ strikePrice: otoken.strikePrice, call: otoken, expiry: otoken.expiryTimestamp })
        }
      } else {
        if (otoken.isPut) {
          target.put = otoken
        } else {
          target.call = otoken
        }
        _rows = [..._rows.filter(r => r.strikePrice !== target.strikePrice), target]
      }
    }
    return _rows
  }, [oTokens])

  const rowsWithDetail = useMemo(() => {
    return rows.map(row => {
      const callbook = orderbooks.find(b => b.id === row.call?.id)
      const putbook = row.put ? orderbooks.find(b => b.id === row.put?.id) : undefined
      const {
        bestBidPrice: callBid,
        totalBidAmt: callBidSize,
        bestAskPrice: callAsk,
        totalAskAmt: callAskSize,
      } = getOrderBookDetail(callbook)

      const {
        bestBidPrice: putBid,
        totalBidAmt: putBidSize,
        bestAskPrice: putAsk,
        totalAskAmt: putAskSize,
      } = getOrderBookDetail(putbook)

      return {
        ...row,
        callBid,
        callBidSize,
        callAsk,
        callAskSize,
        putBid,
        putBidSize,
        putAsk,
        putAskSize,
      }
    })
  }, [rows, orderbooks])

  const rowsWithGreeks = useMemo(() => {
    return rowsWithDetail.map(row => {
      const t = new BigNumber(Number(row.expiry) - Date.now() / 1000).div(86400).div(365).toNumber()
      const s = spotPrice.toNumber()
      const initEstimation = 1
      const interestRate = 0.05

      const k = parseInt(row.strikePrice) / 1e8

      const putbidIV = iv.getImpliedVolatility(Number(row.putBid), s, k, t, interestRate, 'put', initEstimation)
      const putAskIV = iv.getImpliedVolatility(Number(row.putAsk), s, k, t, interestRate, 'put', initEstimation)
      const callbidIV = iv.getImpliedVolatility(Number(row.callBid), s, k, t, interestRate, 'call', initEstimation)
      const callAskIV = iv.getImpliedVolatility(Number(row.callAsk), s, k, t, interestRate, 'call', initEstimation)

      return {
        ...row,
        callAsk: Number(row.callAsk) === 0 ? '-' : row.callAsk,
        callBid: Number(row.callBid) === 0 ? '-' : row.callBid,
        putAsk: Number(row.putAsk) === 0 ? '-' : row.putAsk,
        putBid: Number(row.putBid) === 0 ? '-' : row.putBid,
        putbidIV: Number(row.putBid) === 0 ? '-' : `${(putbidIV * 100).toFixed(2)}%`,
        putAskIV: Number(row.putAsk) === 0 ? '-' : `${(putAskIV * 100).toFixed(2)}%`,
        callbidIV: Number(row.callBid) === 0 ? '-' : `${(callbidIV * 100).toFixed(2)}%`,
        callAskIV: Number(row.callAsk) === 0 ? '-' : `${(callAskIV * 100).toFixed(2)}%`,
      }
    })
  }, [rowsWithDetail, spotPrice])

  const renderRow = useCallback(
    (row: RowWithGreeks) => {
      const callOnClick = () => {
        setSelectedOToken(row.call)
      }
      const putOnClick = () => {
        setSelectedOToken(row.put)
      }
      const callButton = (
        <Radio
          disabled={row.call === undefined}
          onChange={callOnClick}
          checked={selectedOToken && selectedOToken?.id === row.call?.id}
        />
      )
      const putButton = (
        <Radio
          disabled={row.put === undefined}
          onChange={putOnClick}
          checked={selectedOToken && selectedOToken?.id === row.put?.id}
        />
      )
      const callBidCell = row.call ? onclickWrapper(green(row.callBid), callOnClick) : '-'
      const callBidSizeCell = row.call ? onclickWrapper(row.callBidSize, callOnClick) : '-'
      const callBidIvCell = secondary(row.call ? onclickWrapper(row.callbidIV, callOnClick) : '-')

      const callAskCell = row.call ? onclickWrapper(red(row.callAsk), callOnClick) : '-'
      const callAskSizeCell = row.call ? onclickWrapper(row.callAskSize, callOnClick) : '-'
      const callAskIvCell = secondary(row.call ? onclickWrapper(row.callAskIV, callOnClick) : '-')

      const strike = bold(toTokenAmount(row.strikePrice, 8).toString())
      const putBidCell = row.put ? onclickWrapper(green(row.putBid), putOnClick) : '-'
      const putBidSizeCell = row.put ? onclickWrapper(row.putBidSize, putOnClick) : '-'
      const putBidIvCell = secondary(row.put ? onclickWrapper(row.putbidIV, putOnClick) : '-')

      const putAskCell = row.put ? onclickWrapper(red(row.putAsk), putOnClick) : '-'
      const putAskSizeCell = row.put ? onclickWrapper(row.putAskSize, putOnClick) : '-'
      const putAskIvCell = secondary(row.put ? onclickWrapper(row.putAskIV, putOnClick) : '-')

      return [
        callBidCell,
        callBidIvCell,
        callBidSizeCell,

        callAskCell,
        callAskIvCell,
        callAskSizeCell,

        callButton,
        strike,
        putButton,

        putBidCell,
        putBidIvCell,
        putBidSizeCell,

        putAskCell,
        putAskIvCell,
        putAskSizeCell,
      ]
    },
    [selectedOToken, setSelectedOToken],
  )

  return (
    <div style={{ minWidth: 600 }}>
      <SyncIndicator visible={isLoadingOrderbook} children={'Syncing order book... 🍕'} />
      <DataView
        tableRowHeight={35}
        status={isLoadingOrderbook ? 'loading' : 'default'}
        fields={[
          'bid ($)',
          'iv',
          'amt',
          'ask ($)',
          'iv',
          'amt',
          bold('call'),
          'strike',
          bold('put'),
          'bid ($)',
          'iv',
          'amt',
          'ask ($)',
          'iv',
          'amt',
        ]}
        emptyState={OTOKENS_BOARD}
        entries={rowsWithGreeks}
        renderEntry={renderRow}
      />
    </div>
  )
}

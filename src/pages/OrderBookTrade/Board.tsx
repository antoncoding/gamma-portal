import React, { useMemo, useCallback } from 'react'

import { DataView, Radio } from '@aragon/ui'
import { SubgraphOToken } from '../../types'
import { OTOKENS_BOARD } from '../../constants/dataviewContents'
import { toTokenAmount } from '../../utils/math'
import { useOrderbook } from '../../contexts/orderbook'
import { getOrderBookDetail } from '../../utils/0x-utils'

import { green, red, onclickWrapper, bold } from './StyleDiv'

type BoardRow = {
  strikePrice: string
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

type BoardProps = {
  oTokens: SubgraphOToken[]
  selectedOToken: SubgraphOToken | null
  setSelectedOToken: any
}

export default function Board({ oTokens, selectedOToken, setSelectedOToken }: BoardProps) {
  const { isLoading: isLoadingOrderbook, orderbooks } = useOrderbook()

  const rows = useMemo(() => {
    let _rows: BoardRow[] = []
    const _sortedOTokens = oTokens.sort((a, b) => (Number(a.strikePrice) > Number(b.strikePrice) ? 1 : -1))
    for (const otoken of _sortedOTokens) {
      const target = _rows.find(r => r.strikePrice === otoken.strikePrice)
      if (!target) {
        if (otoken.isPut) {
          _rows.push({ strikePrice: otoken.strikePrice, put: otoken })
        } else {
          _rows.push({ strikePrice: otoken.strikePrice, call: otoken })
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

  const renderRow = useCallback(
    (row: RowWithDetail) => {
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
      const callBidIvCell = row.call ? onclickWrapper('0', callOnClick) : '-'

      const callAskCell = row.call ? onclickWrapper(red(row.callAsk), callOnClick) : '-'
      const callAskSizeCell = row.call ? onclickWrapper(row.callAskSize, callOnClick) : '-'
      const callAskIvCell = row.call ? onclickWrapper('0', callOnClick) : '-'

      const strike = bold(toTokenAmount(row.strikePrice, 8).toString())
      const putBidCell = row.put ? onclickWrapper(green(row.putBid), putOnClick) : '-'
      const putBidSizeCell = row.put ? onclickWrapper(row.putBidSize, putOnClick) : '-'
      const putBidIvCell = row.put ? onclickWrapper('0', putOnClick) : '-'

      const putAskCell = row.put ? onclickWrapper(red(row.putAsk), putOnClick) : '-'
      const putAskSizeCell = row.put ? onclickWrapper(row.putAskSize, putOnClick) : '-'
      const putAskIvCell = row.put ? onclickWrapper('0', putOnClick) : '-'

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
      <DataView
        tableRowHeight={35}
        status={isLoadingOrderbook ? 'loading' : 'default'}
        fields={[
          'bid',
          'iv',
          'amt',
          'ask',
          'iv',
          'amt',
          bold('call'),
          'strike',
          bold('put'),
          'bid',
          'iv',
          'amt',
          'ask',
          'iv',
          'amt',
        ]}
        emptyState={OTOKENS_BOARD}
        entries={rowsWithDetail}
        renderEntry={renderRow}
      />
    </div>
  )
}

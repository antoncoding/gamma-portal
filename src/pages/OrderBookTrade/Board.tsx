import React, { useState, useMemo, useEffect, useCallback } from 'react'

import { DataView, Radio, LinkBase } from '@aragon/ui'
import { SubgraphOToken } from '../../types'
import { OTOKENS_BOARD } from '../../constants/dataviewContents'
import { toTokenAmount } from '../../utils/math'

type BoardRow = {
  strikePrice: string
  put?: SubgraphOToken
  call?: SubgraphOToken
}

type BoardProps = {
  oTokens: SubgraphOToken[]
  selectedOToken: SubgraphOToken | null
  setSelectedOToken: any
}

export default function Board({ oTokens, selectedOToken, setSelectedOToken }: BoardProps) {
  const [isLoadingOrderbook, setIsloadingOrderbook] = useState(false)

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

  const renderRow = useCallback(
    (row: BoardRow) => {
      const callOnClick = () => {
        setSelectedOToken(row.call)
      }
      const putOnClick = () => {
        setSelectedOToken(row.put)
      }
      const callButton = (
        <Radio
          disabled={!row.call}
          onChange={renderRow}
          checked={selectedOToken && selectedOToken?.id === row.call?.id}
        />
      )
      const putButton = (
        <Radio
          disabled={!row.put}
          onChange={putOnClick}
          checked={selectedOToken && selectedOToken?.id === row.put?.id}
        />
      )
      const callBid = row.call ? onclickWrapper(green('0'), callOnClick) : '-'
      const callBidSize = row.call ? onclickWrapper('0', callOnClick) : '-'
      const callAsk = row.call ? onclickWrapper(red('0'), callOnClick) : '-'
      const callAskSize = row.call ? onclickWrapper('0', callOnClick) : '-'
      const strike = strikePriceWrap(toTokenAmount(row.strikePrice, 8).toString())
      const putBid = row.put ? onclickWrapper(green('0'), putOnClick) : '-'
      const putBidSize = row.put ? onclickWrapper('0', putOnClick) : '-'
      const putAsk = row.put ? onclickWrapper(red('0'), putOnClick) : '-'
      const putAskSize = row.put ? onclickWrapper('0', putOnClick) : '-'

      return [
        callButton,
        callBid,
        callBidSize,
        callAsk,
        callAskSize,
        strike,
        putBid,
        putBidSize,
        putAsk,
        putAskSize,
        putButton,
      ]
    },
    [selectedOToken, setSelectedOToken],
  )

  return (
    <>
      <DataView
        tableRowHeight={40}
        status={isLoadingOrderbook ? 'loading' : 'default'}
        fields={['Call', 'bid', 'amt', 'ask', 'amt', 'strike', 'bid', 'amt', 'ask', 'amt', 'put']}
        emptyState={OTOKENS_BOARD}
        entries={rows}
        renderEntry={renderRow}
      />
    </>
  )
}

const strikePriceWrap = strikePrice => {
  return <div style={{ fontSize: 20, width: '40px', padding: '10px' }}>{strikePrice}</div>
}

const onclickWrapper = (child: any, onClick: any) => {
  return <LinkBase onClick={onClick}> {child} </LinkBase>
}

const green = text => {
  return <div style={{ color: '#7aae1a' }}> {text} </div>
}

const red = text => {
  return <div style={{ color: '#da5750' }}> {text} </div>
}

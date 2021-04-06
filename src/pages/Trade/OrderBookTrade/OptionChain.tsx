import React, { useMemo, useCallback, useState } from 'react'

import { DataView, Radio, SyncIndicator, Button, IconCirclePlus, IconCircleCheck } from '@aragon/ui'
import { SubgraphOToken } from '../../../types'
import { OTOKENS_BOARD, OTOKENS_BOARD_FILTERED } from '../../../constants/dataviewContents'
import { SHOW_EMPTY, OptionChainMode, BreakPoints } from '../../../constants'
import { toTokenAmount } from '../../../utils/math'
import { useOrderbook } from '../../../contexts/orderbook'
import { getOrderBookDetail } from '../../../utils/0x-utils'
import { getPreference } from '../../../utils/storage'
import CheckBoxWithLabel from '../../../components/CheckBoxWithLabel'
import { useBreakpoint } from '../../../hooks'
import { green, red, onclickWrapper, bold, secondary } from './StyleDiv'
import BigNumber from 'bignumber.js'
import './chain.css'

const iv = require('implied-volatility')

type SimpleRow = {
  strikePrice: string
  expiry: string
  option: SubgraphOToken
}

type SimpleRowWithDetail = SimpleRow & {
  bid: string
  bidSize: string
  ask: string
  askSize: string
}

type SimpleRowWithGreeks = SimpleRowWithDetail & {
  bidIV: string
  askIV: string
}

type CompleteRow = {
  strikePrice: string
  expiry: string
  put?: SubgraphOToken
  call?: SubgraphOToken
}

type CompleteRowWithDetail = CompleteRow & {
  callBid: string
  callBidSize: string
  callAsk: string
  callAskSize: string
  putBid: string
  putBidSize: string
  putAsk: string
  putAskSize: string
}

type CompleteRowWithGreeks = CompleteRowWithDetail & {
  putbidIV: string
  putAskIV: string
  callbidIV: string
  callAskIV: string
}

type OptionChainProps = {
  oTokens: SubgraphOToken[]
  selectedOToken: SubgraphOToken | null
  setSelectedOToken: any
  spotPrice: BigNumber
  mode: OptionChainMode
}

export default function OptionChain({ oTokens, selectedOToken, setSelectedOToken, spotPrice, mode }: OptionChainProps) {
  const [page, setPage] = useState(0)
  const { isLoading: isLoadingOrderbook, orderbooks } = useOrderbook()

  const [showEmpty, setShowEmpty] = useState(getPreference(SHOW_EMPTY, 'false') === 'true')

  const breakpoint = useBreakpoint()

  const completeRows = useMemo(() => {
    // only return items when "All" is selected.
    if (mode !== OptionChainMode.All) return []
    let _rows: CompleteRow[] = []
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
  }, [mode, oTokens])

  // only contain items when "All is selected"
  const rowsWithDetail = useMemo(() => {
    return completeRows
      .map(row => {
        const callbook = orderbooks.find(b => b.id === row.call?.id)
        const putbook = orderbooks.find(b => b.id === row.put?.id)
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

        const isEmpty =
          (putbook === undefined || (putbook.asks.length === 0 && putbook.bids.length === 0)) &&
          (callbook === undefined || (callbook.asks.length === 0 && callbook.bids.length === 0))

        return {
          ...row,
          isEmpty,
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
      .filter(row => (showEmpty ? true : !row.isEmpty))
  }, [completeRows, orderbooks, showEmpty])

  // only contain items when "All" is selected
  const completeRowsWithGreeks = useMemo(() => {
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

  const renderCompleteRow = useCallback(
    (row: CompleteRowWithGreeks) => {
      const callOnClick = () => {
        setSelectedOToken(row.call)
      }
      const putOnClick = () => {
        setSelectedOToken(row.put)
      }

      const callSelected = selectedOToken !== null && selectedOToken?.id === row.call?.id
      const putSelected = selectedOToken !== null && selectedOToken?.id === row.put?.id

      const callButton = <Radio disabled={row.call === undefined} onChange={callOnClick} checked={callSelected} />
      const putButton = <Radio disabled={row.put === undefined} onChange={putOnClick} checked={putSelected} />

      const callBidCell = (
        <PriceButton
          option={row.call}
          onClick={callOnClick}
          isBid={true}
          isSelected={callSelected}
          text={row.callBid}
        />
      )
      const callBidSizeCell = row.callBidSize ? onclickWrapper(row.callBidSize, callOnClick) : '-'
      const callBidIvCell = secondary(row.call ? onclickWrapper(row.callbidIV, callOnClick) : '-')

      const callAskCell = (
        <PriceButton
          option={row.call}
          onClick={callOnClick}
          isBid={false}
          isSelected={callSelected}
          text={row.callAsk}
        />
      )
      const callAskSizeCell = row.call ? onclickWrapper(row.callAskSize, callOnClick) : '-'
      const callAskIvCell = secondary(row.call ? onclickWrapper(row.callAskIV, callOnClick) : '-')

      const strike = bold(toTokenAmount(row.strikePrice, 8).toString())
      const putBidCell = (
        <PriceButton option={row.put} onClick={putOnClick} isBid={true} isSelected={putSelected} text={row.putBid} />
      )
      const putBidSizeCell = row.put ? onclickWrapper(row.putBidSize, putOnClick) : '-'
      const putBidIvCell = secondary(row.put ? onclickWrapper(row.putbidIV, putOnClick) : '-')

      const putAskCell = (
        <PriceButton option={row.put} onClick={putOnClick} isBid={false} isSelected={putSelected} text={row.putAsk} />
      )
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

  // =====================================================
  // Rows information when mode "Put or Call" is selected
  // =====================================================

  const simpleRows = useMemo(() => {
    // only return items when "Put or Call" is selected.
    if (mode === OptionChainMode.All) return []
    const _sortedOTokens = oTokens
      .filter(o => o.isPut === (mode === OptionChainMode.Put))
      .sort((a, b) => (Number(a.strikePrice) > Number(b.strikePrice) ? 1 : -1))

    return _sortedOTokens.map(otoken => {
      return {
        strikePrice: otoken.strikePrice,
        option: otoken,
        expiry: otoken.expiryTimestamp,
      } as SimpleRow
    })
  }, [mode, oTokens])

  // only contain items when "Put or Call" is selected
  const simpleRowsWithDetail = useMemo(() => {
    return simpleRows
      .map(row => {
        const book = orderbooks.find(b => b.id === row.option.id)

        const { bestBidPrice: bid, totalBidAmt: bidSize, bestAskPrice: ask, totalAskAmt: askSize } = getOrderBookDetail(
          book,
        )

        const isEmpty = book === undefined || (book.asks.length === 0 && book.bids.length === 0)

        return {
          ...row,
          isEmpty,
          bid,
          bidSize,
          ask,
          askSize,
        }
      })
      .filter(row => (showEmpty ? true : !row.isEmpty))
  }, [simpleRows, orderbooks, showEmpty])

  // only contain items when "Put or Call" is selected
  const simpleRowsWithGreeks = useMemo(() => {
    const optiontype = mode.toLowerCase() // 'put' or 'call'

    return simpleRowsWithDetail.map(row => {
      const t = new BigNumber(Number(row.expiry) - Date.now() / 1000).div(86400).div(365).toNumber()
      const s = spotPrice.toNumber()
      const initEstimation = 1
      const interestRate = 0.05

      const k = parseInt(row.strikePrice) / 1e8

      const bidIV = iv.getImpliedVolatility(Number(row.bid), s, k, t, interestRate, optiontype, initEstimation)
      const askIV = iv.getImpliedVolatility(Number(row.ask), s, k, t, interestRate, optiontype, initEstimation)

      return {
        ...row,
        ask: Number(row.ask) === 0 ? '-' : row.ask,
        bid: Number(row.bid) === 0 ? '-' : row.bid,
        bidIV: Number(row.bid) === 0 ? '-' : `${(bidIV * 100).toFixed(2)}%`,
        askIV: Number(row.ask) === 0 ? '-' : `${(askIV * 100).toFixed(2)}%`,
      }
    })
  }, [simpleRowsWithDetail, spotPrice, mode])

  const renderSimpleRow = useCallback(
    (row: SimpleRowWithGreeks, idx) => {
      const selected = selectedOToken?.id === row.option.id
      const onClick = () => {
        if (selected) {
          setSelectedOToken(null)
        } else {
          setSelectedOToken(row.option)
        }
      }

      const bidCell = (
        <PriceButton option={row.option} onClick={onClick} isBid={true} isSelected={selected} text={row.bid} />
      )
      //  onclickWrapper(green(row.bid), onClick)
      const bidSizeCell = onclickWrapper(row.bidSize, onClick)
      const bidIvCell = secondary(onclickWrapper(row.bidIV, onClick))

      const askCell = (
        <PriceButton option={row.option} onClick={onClick} isBid={false} isSelected={selected} text={row.ask} />
      )

      const askSizeCell = onclickWrapper(row.askSize, onClick)
      const askIvCell = secondary(onclickWrapper(row.askIV, onClick))

      const strike = bold(toTokenAmount(row.strikePrice, 8).toString())

      return [strike, bidCell, bidIvCell, bidSizeCell, askCell, askIvCell, askSizeCell]
    },
    [setSelectedOToken, selectedOToken],
  )

  const selectedIdxs = useMemo(() => {
    const idx = simpleRowsWithGreeks.findIndex(o => o.option.id === selectedOToken?.id)
    return idx === -1 ? [] : [idx]
  }, [simpleRowsWithGreeks, selectedOToken])

  return (
    <div style={{ minWidth: 600 }}>
      <SyncIndicator visible={isLoadingOrderbook} children={'Syncing order book... 🍕'} />
      <CheckBoxWithLabel checked={showEmpty} setChecked={setShowEmpty} storageKey={SHOW_EMPTY} label={'Show Empty'} />
      {mode === OptionChainMode.All ? (
        // complete data table: shows whole option chain
        <DataView
          page={page}
          onPageChange={setPage}
          mode={breakpoint > BreakPoints.md ? 'table' : 'list'}
          entriesPerPage={8}
          tableRowHeight={35}
          status={isLoadingOrderbook ? 'loading' : 'default'}
          fields={[
            'bid($)',
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
          emptyState={showEmpty ? OTOKENS_BOARD : OTOKENS_BOARD_FILTERED}
          entries={completeRowsWithGreeks}
          renderEntry={renderCompleteRow}
        />
      ) : (
        // simplidied data table: only shows puts or call
        <DataView
          mode={breakpoint > BreakPoints.md ? 'table' : 'list'}
          page={page}
          onPageChange={setPage}
          entriesPerPage={8}
          tableRowHeight={35}
          status={isLoadingOrderbook ? 'loading' : 'default'}
          fields={['strike', 'bid ($)', 'iv', 'amt', 'ask ($)', 'iv', 'amt']}
          emptyState={showEmpty ? OTOKENS_BOARD : OTOKENS_BOARD_FILTERED}
          entries={simpleRowsWithGreeks}
          renderEntry={renderSimpleRow}
          renderSelectionCount={entry => ``}
          selection={selectedIdxs}
        />
      )}
    </div>
  )
}

function PriceButton({
  option,
  text,
  isBid,
  isSelected,
  onClick,
}: {
  option: any
  text: string
  isBid: boolean
  isSelected: boolean
  onClick: any
}) {
  const mode = isSelected ? (isBid ? 'positive' : 'negative') : 'normal'

  const content = !isSelected ? isBid ? green(text) : red(text) : <div style={{ fontSize: 14 }}>{text}</div>

  const icon = text !== '-' ? isSelected ? <IconCircleCheck size="small" /> : <IconCirclePlus size="small" /> : null

  return option === undefined ? (
    <> - </>
  ) : (
    <Button className="priceButton" size="mini" onClick={onClick} mode={mode}>
      {<div style={{ padding: 5 }}>{content}</div>} {icon}
    </Button>
  )
}

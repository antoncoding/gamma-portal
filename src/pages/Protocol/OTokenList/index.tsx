import React, { useMemo, useEffect, useState, useCallback } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { Col, Container, Row } from 'react-grid-system'
import { Button, TextInput, DataView, IconSearch, Timer, Tag, IconGraph } from '@aragon/ui'

import { useConnectedWallet } from '../../../contexts/wallet'
import Header from '../../../components/Header'
import CustomIdentityBadge from '../../../components/CustomIdentityBadge'

import { SubgraphOToken } from '../../../types'

import { simplifyOTokenSymbol } from '../../../utils/others'
import { getOTokens } from '../../../utils/graph'
import { toTokenAmount, timeSince } from '../../../utils/math'

import useAsyncMemo from '../../../hooks/useAsyncMemo'
import { useCustomToast } from '../../../hooks'

export default function OtokenList() {
  useEffect(() => {
    ReactGA.pageview('protocol/otokens/')
  }, [])

  const [isLoading, setIsLoading] = useState(true)

  const { networkId } = useConnectedWallet()

  const toast = useCustomToast()

  const [page, setPage] = useState(0)

  const [searchStr, setSearchStr] = useState('')

  const onChangeSearch = useCallback(event => {
    setSearchStr(event.target.value)
  }, [])

  useEffect(() => {
    setPage(0)
  }, [searchStr])

  const oTokens = useAsyncMemo(
    async () => {
      const result = await getOTokens(networkId, toast.error)
      setIsLoading(false)
      return result
    },
    [],
    [networkId, toast.error],
  )

  const oTokensToShow = useMemo(() => {
    return oTokens.filter(o => !searchStr || o.symbol.includes(searchStr) || o.name.includes(searchStr))
  }, [searchStr, oTokens])

  const history = useHistory()

  const renderOTokenRow = useCallback(
    (otoken: SubgraphOToken) => {
      // 'oToken', 'strike', 'expiry', 'type', 'creator', 'created'
      console.log(otoken)
      return [
        simplifyOTokenSymbol(otoken.symbol),
        toTokenAmount(otoken.strikePrice, 8).toFixed(0),
        <Timer end={Number(otoken.expiryTimestamp) * 1000} />,
        otoken.isPut ? (
          <Tag color="#800000" background="#ffb3b3">
            {' '}
            Put{' '}
          </Tag>
        ) : (
          <Tag color="#006600" background="#c2f0c2">
            {' '}
            Call{' '}
          </Tag>
        ),
        <CustomIdentityBadge entity={otoken.creator} />,
        timeSince(Number(otoken.createdAt) * 1000),
        <Button icon={<IconGraph />} onClick={() => history.push(`/otoken/${otoken.id}`)} />,
      ]
    },
    [history],
  )

  return (
    <Container>
      <Header primary={'OTokens'} />
      <Row style={{ paddingBottom: 30 }}>
        <Col>
          <TextInput
            value={searchStr}
            onChange={onChangeSearch}
            wide
            adornmentPosition="end"
            adornment={<IconSearch />}
          />
        </Col>
        <Col>{/* <DropDown></DropDown> */}</Col>
      </Row>

      <DataView
        status={isLoading ? 'loading' : 'default'}
        fields={['oToken', 'strike', 'expiry', 'type', 'creator', 'created', '']}
        entries={oTokensToShow}
        renderEntry={renderOTokenRow}
        entriesPerPage={8}
        page={page}
        onPageChange={setPage}
      />
    </Container>
  )
}

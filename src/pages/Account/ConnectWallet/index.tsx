import React, { useState, useEffect, useMemo } from 'react'
import ReactGA from 'react-ga'
import { useHistory } from 'react-router-dom'
import { TextInput, DataView, Button, LinkBase, EthIdenticon, Header } from '@aragon/ui'
import { getPreference, checkAddressAndAddToStorage } from '../../../utils/storage'

import Comment from '../../../components/Comment'
import { useConnectedWallet } from '../../../contexts/wallet'
import { isAddress } from '../../../utils/math'
import { resolveENS } from '../../../utils/others'
import { useCustomToast } from '../../../hooks'

function Login() {
  const { user, setUser, networkId } = useConnectedWallet()
  const history = useHistory()
  const toast = useCustomToast()
  const [InAddress, setAddress] = useState('')
  const [addrs, setAddrLisrt] = useState([])

  useEffect(() => {
    ReactGA.modalview('watch-address')
  }, [])

  const goToAccount = useMemo(
    () => account => {
      history.push(`/account/${account}`)
    },
    [history],
  )

  useEffect(() => {
    if (user) {
      goToAccount(user)
    }
  }, [goToAccount, user])

  useEffect(() => {
    const watch_addrs = getPreference('watch_addresses', '[]')
    const usedAddresses = JSON.parse(watch_addrs)
    setAddrLisrt(usedAddresses)
  }, [])

  return (
    <>
      <Header primary="Account" />
      <p style={{ fontSize: 20 }}> Connect Wallet </p>
      <Comment text="Please connect wallet to proceed or enter an address to use Watch Mode." />
      <br />
      <br />
      <p style={{ fontSize: 20 }}> Watch Mode </p>
      <Comment text="You won't be able to interact with any smart contract under Watch Mode." />
      <div style={{ display: 'flex' }}>
        <div style={{ width: '50%' }}>
          <TextInput
            placeholder="Ethereum address or ENS"
            value={InAddress}
            onChange={e => {
              setAddress(e.target.value.toLowerCase())
            }}
            wide
          />

          {addrs.length > 0 ? (
            <div style={{ paddingTop: '3%' }}>
              <DataView
                entries={addrs.reverse()}
                fields={['used']}
                entriesPerPage={5}
                renderEntry={(address: string) => [
                  <LinkBase
                    onClick={() => {
                      checkAddressAndAddToStorage(address)
                      setUser(address)
                      // goToAccount(address)
                    }}
                  >
                    {/* <IdentityBadge entity={address} /> */}
                    <EthIdenticon address={address} scale={1.3} radius={5} />
                    <span style={{ paddingLeft: 8, fontSize: 15, fontFamily: 'aragon-ui-monospace' }}>{address}</span>
                  </LinkBase>,
                ]}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <div style={{ width: '8%', paddingLeft: '1%', paddingRight: '1%' }}>
          <Button
            label="Watch Address"
            onClick={async () => {
              if (isAddress(InAddress)) {
                checkAddressAndAddToStorage(InAddress)
                setUser(InAddress)
                // goToAccount(InAddress)
              } else {
                try {
                  const address = await resolveENS(InAddress, networkId)
                  checkAddressAndAddToStorage(address)
                  setUser(address)
                  // goToAccount(address)
                } catch (error) {
                  toast.error('Invalid Address')
                }
              }
            }}
          />
        </div>
      </div>
    </>
  )
}

export default Login

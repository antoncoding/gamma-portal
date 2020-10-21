import React from 'react'
import { Header } from '@aragon/ui'
import SectionTitle from '../../components/SectionHeader'
// import { useParams } from 'react-router-dom';
// import { walletContext } from '../../contexts/wallet'

// import { getAccount } from '../../utils/graph'

// import useAsyncMemo from '../../hooks/useAsyncMemo';

export default function Account() {

  // const { account } = useParams()
  // const { networkId } = useContext(walletContext)

  // const [isLoading, setIsLoading] = useState(true)

  // const toast = useToast()

  // const balances = useAsyncMemo(async () => {
  //   if (!account) return []
  //   const result = await getAccount(networkId, account, toast)
  //   setIsLoading(false)
  //   return result
  // }, null, [networkId, account])

  return (
    <>
      <Header primary="Account Overview" />
      <SectionTitle title="Badges"/>
      coming soon 
    </>
  )
}
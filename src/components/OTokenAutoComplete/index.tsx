import React, { useState } from 'react'
import { _AutoComplete as AutoComplete } from '@aragon/ui'

import { simplifyOTokenSymbol } from '../../utils/others'
import { SubgraphOToken } from '../../types'

type AutoCompleteProps = {
  oTokens: SubgraphOToken[]
  selectedOToken: SubgraphOToken | null
  setSelectedOToken: React.Dispatch<React.SetStateAction<SubgraphOToken | null>>
}

export default function OTokenAutoComplete({ selectedOToken, setSelectedOToken, oTokens }: AutoCompleteProps) {
  const [searchTerm, setSearchTerm] = useState<undefined | string>('')

  return (
    <AutoComplete
      items={oTokens.filter((o: SubgraphOToken) => {
        return (
          searchTerm &&
          (simplifyOTokenSymbol(o.symbol).toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 || o.id === searchTerm)
        )
      })}
      renderItem={(o: SubgraphOToken) => simplifyOTokenSymbol(o.symbol)}
      onChange={setSearchTerm}
      onSelect={(o: SubgraphOToken) => {
        setSearchTerm('')
        setSelectedOToken(o)
      }}
      wide
      value={searchTerm ? searchTerm : selectedOToken ? simplifyOTokenSymbol(selectedOToken?.symbol) : ''}
      placeholder="Search 01JAN21, 800P, or address"
    />
  )
}

import React from 'react'

const emptyStateRedSrc = require('../imgs/aragon/empty-state-illustration-red.png')
const EmptyState = <img src={emptyStateRedSrc} alt="" width="185" />

export const VAULTS = {
  default: {
    title: "No vaults", 
    subtitle: 'Click on Open Vault to start minting oTokens!',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching user vaults...'
  }
}

export const VAULT_HISTORY = {
  default: {
    title: "No entry", 
    subtitle: 'No operation has been done on this vault.',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching vault history'
  }
}

export const OPERATORS = {
  default: {
    title: "No Operators", 
    subtitle: 'You can add operators to act on your behave',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching operators...'
  }
}

export const PRICE_SUBMISSION = {
  default: {
    title: "No Submissions", 
    subtitle: 'no price submission history on this asset',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching historical price'
  }
}

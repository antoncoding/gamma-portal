import React from 'react'

const emptyStateRedSrc = require('../imgs/aragon/empty-state-illustration-red.png')
const EmptyState = <img src={emptyStateRedSrc} alt="" width="185" />

export const NO_TOKEN_SELECTED = {
  default: {
    title: '🧑‍🚀',
    subtitle: 'select an oToken to proceed',
    illustration: null,
  },
}

export const generateNoUserOrderContent = (symbol: string) => {
  return {
    default: {
      title: `No Orders`,
      subtitle: `You have no active orders for ${symbol}`,
      illustration: null,
    },
  }
}

export const generateNoOrderContent = (symbol: string) => {
  return {
    default: {
      title: `No orders 🥺`,
      subtitle: `No orders for ${symbol}`,
      illustration: null,
    },
    loading: {
      title: 'Loading',
      subtitle: `Fetching 0x orders`,
      illustration: null,
    },
  }
}

export const OTOKENS_BOARD = {
  default: {
    title: 'No oTokens',
    subtitle: 'No oTokens available',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching oTokens ',
  },
}

export const OTOKENS = {
  default: {
    title: 'No oTokens',
    subtitle: "You don't have any oToken in your wallet ",
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching user oToken ',
  },
}

export const VAULTS = {
  default: {
    title: 'No vaults',
    subtitle: 'Click on Open Vault to start minting oTokens!',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching user vaults...',
  },
}

export const VAULT_HISTORY = {
  default: {
    title: 'No entry',
    subtitle: 'No operation has been done on this vault.',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching vault history',
  },
}

export const OPERATORS = {
  default: {
    title: 'No Operators',
    subtitle: 'You can add operators to act on your behalf',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching operators...',
  },
}

export const PRICE_SUBMISSION = {
  default: {
    title: 'No Submissions',
    subtitle: 'no price submission history on this asset',
    illustration: EmptyState,
  },
  loading: {
    title: 'Loading',
    subtitle: 'Fetching historical price',
  },
}

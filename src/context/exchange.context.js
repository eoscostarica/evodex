import React from 'react'

import { exchangeConfig } from '../config'
import { get } from '../utils/request'

const ExchangeContext = React.createContext()

const exchangeReducer = (state, action) => {
  switch (action.type) {
    case 'set': {
      return {
        ...state,
        ...action.payload
      }
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const initialValue = {
  tokenPairs: []
}

export const ExchangeProvider = (props) => {
  const [state, dispatch] = React.useReducer(exchangeReducer, initialValue)
  const value = React.useMemo(() => [state, dispatch], [state])

  return <ExchangeContext.Provider value={value} {...props} />
}

export const useExchange = () => {
  const context = React.useContext(ExchangeContext)

  if (!context) {
    throw new Error(`useExchange must be used within a ExchangeContext`)
  }

  const [state, dispatch] = context
  const fetchTokenPairs = async () => {
    let tokenPairs = await get(`${exchangeConfig.url}/list`)
    tokenPairs = await Promise.all(
      tokenPairs.map(async (tokenPair) => {
        const {
          Fee: fee,
          Pool1: pool1,
          Pool2: pool2,
          Price: price
        } = await get(`${exchangeConfig.url}/info?pair=${tokenPair}`)

        return {
          tokenPair,
          token1: pool1.split(' ')[1],
          token2: pool2.split(' ')[1],
          fee: fee / 100,
          pool1,
          pool2,
          price
        }
      })
    )
    dispatch({ type: 'set', payload: { tokenPairs } })
  }

  return [
    state,
    {
      fetchTokenPairs
    }
  ]
}

import React from 'react'
import axios from 'axios'
import { asset } from 'eos-common'

import { exchangeConfig } from '../config'

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
  tokenPairs: [],
  tokenOptions: []
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
    const { data } = await axios.get(`${exchangeConfig.url}/list`)
    const tokenPairs = await Promise.all(
      data.map(async (tokenPair) => {
        const {
          data: {
            Fee: fee,
            Pool1: pool1,
            Pool2: pool2,
            Price: price,
            Supply: supply
          }
        } = await axios.get(`${exchangeConfig.url}/info`, {
          params: {
            pair: tokenPair
          }
        })

        return {
          tokenPair,
          price,
          fee,
          supply: asset(supply),
          pool1: asset(pool1),
          pool2: asset(pool2)
        }
      })
    )
    const tokens = tokenPairs.reduce(
      (temp, item) => ({
        ...temp,
        [item.pool1.symbol
          .code()
          .to_string()]: item.pool1.symbol.code().to_string(),
        [item.pool2.symbol
          .code()
          .to_string()]: item.pool2.symbol.code().to_string()
      }),
      {}
    )
    const tokenOptions = Object.keys(tokens).map((token) => ({
      value: token,
      label: token
    }))
    dispatch({ type: 'set', payload: { tokenPairs, tokenOptions } })
  }
  const getValidOptionsForToken = (token) => {
    if (!token) {
      return state.tokenOptions
    }

    const validPairs = state.tokenPairs.filter(
      (item) =>
        item.pool1.symbol.code().to_string() === token ||
        item.pool2.symbol.code().to_string() === token
    )
    const validTokens = Object.keys(
      validPairs.reduce(
        (temp, item) => ({
          ...temp,
          [item.pool1.symbol.code().to_string() === token
            ? item.pool2.symbol.code().to_string()
            : item.pool1.symbol.code().to_string()]:
            item.pool1.symbol.code().to_string() === token
              ? item.pool2.symbol.code().to_string()
              : item.pool1.symbol.code().to_string()
        }),
        {}
      )
    )

    return state.tokenOptions.filter((option) =>
      validTokens.includes(option.value)
    )
  }
  const getTokenPair = (token1, token2) => {
    return state.tokenPairs.find(
      (item) =>
        (item.pool1.symbol.code().to_string() === token1 &&
          item.pool2.symbol.code().to_string() === token2) ||
        (item.pool2.symbol.code().to_string() === token1 &&
          item.pool1.symbol.code().to_string() === token2)
    )
  }
  const computeForward = (x, y, z, fee) => {
    const prod = x.multiply(y)
    let tmp, tmp_fee

    if (x > 0) {
      tmp = prod.minus(1).divide(z).plus(1)
      tmp_fee = tmp.multiply(fee).plus(9999).divide(10000)
    } else {
      tmp = prod.divide(z)
      tmp_fee = tmp.multiply(-1).multiply(fee).plus(9999).divide(10000)
    }

    return tmp.plus(tmp_fee)
  }
  const computeBackward = (x, y, z, fee) => {
    const fee_amount = x.multiply(fee).plus(9999).divide(10000)
    x = x.minus(fee_amount)
    x = x.multiply(y).divide(z)

    return x
  }

  return [
    state,
    {
      fetchTokenPairs,
      getValidOptionsForToken,
      getTokenPair,
      computeForward,
      computeBackward
    }
  ]
}

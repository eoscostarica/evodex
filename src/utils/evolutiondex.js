import axios from 'axios'
import { asset, number_to_asset } from 'eos-common'

import { exchangeConfig } from '../config'

import { getScatterError } from './getScatterError'

const defaultState = { pairs: [], tokens: [] }

const getInfo = async () => {
  const { data } = await axios.get(`${exchangeConfig.api}/list`)
  const pairs = await Promise.all(
    data.map(async (tokenPair) => {
      const {
        data: {
          Fee: fee,
          Pool1: pool1,
          Pool2: pool2,
          Price: price,
          Supply: supply
        }
      } = await axios.get(`${exchangeConfig.api}/info`, {
        params: {
          pair: tokenPair
        }
      })

      return {
        token: tokenPair,
        price,
        fee,
        supply: asset(supply),
        pool1: asset(pool1),
        pool2: asset(pool2)
      }
    })
  )
  const tokens = Object.keys(
    pairs.reduce(
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
  )

  return { pairs, tokens }
}
const getTokensFor = (token, exchangeState = defaultState) => {
  if (!token) {
    return exchangeState.tokens
  }

  const validPairs = exchangeState.pairs.filter(
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

  return exchangeState.tokens.filter((token) => validTokens.includes(token))
}
const getPair = (token1, token2, exchangeState = defaultState) => {
  const pair = exchangeState.pairs.find(
    (pair) =>
      (pair.pool1.symbol.code().to_string() === token1 &&
        pair.pool2.symbol.code().to_string() === token2) ||
      (pair.pool2.symbol.code().to_string() === token1 &&
        pair.pool1.symbol.code().to_string() === token2)
  )

  if (!pair) {
    return
  }

  const isPool1 = pair.pool1.symbol.code().to_string() === token1

  return {
    ...pair,
    from: {
      pool: isPool1 ? pair.pool1 : pair.pool2,
      contract: 'eosio.token'
    },
    to: {
      pool: isPool1 ? pair.pool2 : pair.pool1,
      contract: 'eosio.token'
    }
  }
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
const getMinExpectedAmount = (pair, amount) => {
  const assetToGive = asset(
    `${(parseFloat(amount) || 0).toFixed(
      pair.from.pool.symbol.precision()
    )} ${pair.from.pool.symbol.code().to_string()}`
  )
  const assetToReceive = number_to_asset(0, pair.to.pool.symbol)
  const computeForwardAmount = computeForward(
    assetToGive.amount.multiply(-1),
    pair.to.pool.amount,
    pair.from.pool.amount.plus(assetToGive.amount),
    pair.fee
  ).abs()

  assetToReceive.set_amount(computeForwardAmount)

  return assetToReceive.to_string().split(' ')[0]
}
const exchange = async (pair, giveAmount, receiveAmount, ual) => {
  try {
    const toGive = {
      amount: parseFloat(giveAmount).toFixed(pair.from.pool.symbol.precision()),
      token: pair.from.pool.symbol.code().to_string()
    }
    const toReceive = {
      amount: parseFloat(receiveAmount).toFixed(
        pair.to.pool.symbol.precision()
      ),
      token: pair.to.pool.symbol.code().to_string()
    }
    const result = await ual.activeUser.signTransaction(
      {
        actions: [
          {
            authorization: [
              {
                actor: ual.activeUser.accountName,
                permission: 'active'
              }
            ],
            account: pair.from.contract,
            name: 'transfer',
            data: {
              from: ual.activeUser.accountName,
              to: exchangeConfig.contract,
              quantity: `${toGive.amount} ${toGive.token}`,
              memo: `exchange: ${pair.token},${toReceive.amount} ${toReceive.token},send using evodex.netlify.app`
            }
          }
        ]
      },
      {
        broadcast: true
      }
    )

    return result
  } catch (error) {
    throw new Error(getScatterError(error))
  }
}

export const exchangeUtil = {
  getInfo,
  getTokensFor,
  getPair,
  getMinExpectedAmount,
  exchange
}

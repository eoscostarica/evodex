import axios from 'axios'
import { asset, number_to_asset } from 'eos-common'

import { exchangeConfig } from '../config'

import { getScatterError } from './getScatterError'

const defaultState = { pairs: [], tokens: [] }

const getInfo = async (ual) => {
  const { data } = await axios.get(`${exchangeConfig.api}/list`)
  let userPools = []

  if (ual?.activeUser) {
    userPools = await getUserPools(ual)
  }

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

      const balance = userPools.find(
        (item) => item.symbol.code().toString() === tokenPair
      )

      return {
        price,
        fee,
        balance,
        token: tokenPair,
        supply: asset(supply),
        pool1: {
          asset: asset(pool1),
          contract: 'eosio.token'
        },
        pool2: {
          asset: asset(pool2),
          contract: 'eosio.token'
        }
      }
    })
  )
  const tokens = Object.keys(
    pairs.reduce(
      (temp, item) => ({
        ...temp,
        [item.pool1.asset.symbol
          .code()
          .toString()]: item.pool1.asset.symbol.code().toString(),
        [item.pool2.asset.symbol
          .code()
          .toString()]: item.pool2.asset.symbol.code().toString()
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
      item.pool1.asset.symbol.code().toString() === token ||
      item.pool2.asset.symbol.code().toString() === token
  )
  const validTokens = Object.keys(
    validPairs.reduce(
      (temp, item) => ({
        ...temp,
        [item.pool1.asset.symbol.code().toString() === token
          ? item.pool2.asset.symbol.code().toString()
          : item.pool1.asset.symbol.code().toString()]:
          item.pool1.asset.symbol.code().toString() === token
            ? item.pool2.asset.symbol.code().toString()
            : item.pool1.asset.symbol.code().toString()
      }),
      {}
    )
  )

  return exchangeState.tokens.filter((token) => validTokens.includes(token))
}
const getPair = (token1, token2, exchangeState = defaultState) => {
  const pair = exchangeState.pairs.find(
    (pair) =>
      (pair.pool1.asset.symbol.code().toString() === token1 &&
        pair.pool2.asset.symbol.code().toString() === token2) ||
      (pair.pool2.asset.symbol.code().toString() === token1 &&
        pair.pool1.asset.symbol.code().toString() === token2)
  )

  if (!pair) {
    return
  }

  const isPool1 = pair.pool1.asset.symbol.code().toString() === token1

  return {
    ...pair,
    from: isPool1 ? pair.pool1 : pair.pool2,
    to: isPool1 ? pair.pool2 : pair.pool1
  }
}
const computeBackward = (x, y, z, fee) => {
  const fee_amount = x.multiply(fee).plus(9999).divide(10000)
  x = x.minus(fee_amount)
  x = x.multiply(y).divide(z)

  return x
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
const getExchangeAssets = (amount, pair) => {
  const assetToGive = asset(
    `${(parseFloat(amount) || 0).toFixed(
      pair.from.asset.symbol.precision()
    )} ${pair.from.asset.symbol.code().toString()}`
  )
  const assetToReceive = number_to_asset(0, pair.to.asset.symbol)
  const computeForwardAmount = computeForward(
    assetToGive.amount.multiply(-1),
    pair.to.asset.amount,
    pair.from.asset.amount.plus(assetToGive.amount),
    pair.fee
  ).abs()

  assetToReceive.set_amount(computeForwardAmount)

  return {
    assetToGive,
    assetToReceive
  }
}
const exchange = async (amount, pair, ual) => {
  try {
    const { assetToGive, assetToReceive } = getExchangeAssets(amount, pair)
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
              quantity: assetToGive.toString(),
              memo: `exchange: ${
                pair.token
              },${assetToReceive.toString()},send using evodex.netlify.app`
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
const getUserPools = async (ual) => {
  const { rows } = await ual.activeUser.rpc.get_table_rows({
    json: true,
    code: exchangeConfig.contract,
    scope: ual.activeUser.accountName,
    table: 'accounts'
  })

  return rows.map((row) => asset(row.balance))
}
const getAddLiquidityAssets = (amount, pair) => {
  const assetToBuy = number_to_asset(0, pair.supply.symbol)
  const asset1 = asset(
    `${parseFloat(amount).toFixed(
      pair.pool1.asset.symbol.precision()
    )} ${pair.pool1.asset.symbol.code().toString()}`
  )
  const asset2 = number_to_asset(0, pair.pool2.asset.symbol)

  assetToBuy.set_amount(
    computeBackward(
      asset1.amount,
      pair.supply.amount,
      pair.pool1.asset.amount,
      pair.fee
    )
  )
  asset2.set_amount(
    computeForward(
      assetToBuy.amount,
      pair.pool2.asset.amount,
      pair.supply.amount,
      pair.fee
    )
  )

  return {
    assetToBuy,
    asset1,
    asset2
  }
}
const addLiquidity = async (amount, pair, ual) => {
  try {
    const { assetToBuy, asset1, asset2 } = getAddLiquidityAssets(amount, pair)
    const authorization = [
      {
        actor: ual.activeUser.accountName,
        permission: 'active'
      }
    ]
    const result = await ual.activeUser.signTransaction(
      {
        actions: [
          {
            account: exchangeConfig.contract,
            name: 'openext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              payer: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool1.contract,
                sym: pair.pool1.asset.symbol.toString()
              }
            }
          },
          {
            account: exchangeConfig.contract,
            name: 'openext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              payer: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool2.contract,
                sym: pair.pool2.asset.symbol.toString()
              }
            }
          },
          {
            account: pair.pool1.contract,
            name: 'transfer',
            authorization,
            data: {
              from: ual.activeUser.accountName,
              to: exchangeConfig.contract,
              quantity: asset1.toString(),
              memo: ''
            }
          },
          {
            account: pair.pool2.contract,
            name: 'transfer',
            authorization,
            data: {
              from: ual.activeUser.accountName,
              to: exchangeConfig.contract,
              quantity: asset2.toString(),
              memo: ''
            }
          },
          {
            account: exchangeConfig.contract,
            name: 'addliquidity',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to_buy: assetToBuy.toString(),
              max_asset1: asset1.toString(),
              max_asset2: asset2.toString()
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
  getExchangeAssets,
  exchange,
  getUserPools,
  getAddLiquidityAssets,
  addLiquidity
}

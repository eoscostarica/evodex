import axios from 'axios'
import * as eosCommon from 'eos-common'

import { evodexConfig } from '../config'

import { getScatterError } from './getScatterError'

const { asset, number_to_asset: numberToAsset } = eosCommon
const defaultState = { pairs: [], tokens: [] }

const amountToAsset = (amount = '0', currentAsset) => {
  if (isNaN(amount)) {
    return asset(`0 ${currentAsset.symbol.code().toString()}`)
  }

  const chunks = amount.split('.')
  const integer = chunks[0].substring(0, 10)
  const decimal = chunks[1] || '0'
  const validAmount = parseFloat(`${integer}.${decimal}`).toFixed(
    currentAsset.symbol.precision()
  )

  return asset(`${validAmount} ${currentAsset.symbol.code().toString()}`)
}
const getInfo = async (ual) => {
  const { data } = await axios.get(`${evodexConfig.api}/list`)
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
          Supply: supply,
          Pool1contract: pool1Contract,
          Pool2contract: pool2Contract
        }
      } = await axios.get(`${evodexConfig.api}/info`, {
        params: {
          pair: tokenPair
        }
      })

      const balance = userPools.find(
        (item) => item.symbol.code().toString() === tokenPair
      )

      return {
        price,
        fee: isNaN(fee) ? 0 : fee,
        balance,
        token: tokenPair,
        supply: asset(supply),
        pool1: {
          asset: asset(pool1),
          contract: pool1Contract
        },
        pool2: {
          asset: asset(pool2),
          contract: pool2Contract
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
const computeForward = (x, y, z, fee) => {
  const prod = x.multiply(y)
  let tmp, tmpFee

  if (x > 0) {
    tmp = prod.minus(1).divide(z).plus(1)
    tmpFee = tmp.multiply(fee).plus(9999).divide(10000)
  } else {
    tmp = prod.divide(z)
    tmpFee = tmp.multiply(-1).multiply(fee).plus(9999).divide(10000)
  }

  return tmp.plus(tmpFee)
}
const getExchangeAssets = (amount, pair) => {
  const assetToGive = amountToAsset(amount, pair.from.asset)
  const assetToReceive = numberToAsset(0, pair.to.asset.symbol)
  const computeForwardAmount = computeForward(
    assetToGive.amount.multiply(-1),
    pair.to.asset.amount,
    pair.from.asset.amount.plus(assetToGive.amount),
    pair.fee
  ).abs()

  assetToReceive.set_amount(computeForwardAmount)
  return {
    assetToGive,
    assetToReceive,
    price: amountToAsset(
      (
        parseFloat(assetToReceive.toString().split(' ')[0]) /
        parseFloat(assetToGive.toString().split(' ')[0])
      ).toFixed(assetToReceive.symbol.precision()),
      assetToReceive
    ).toString()
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
              to: evodexConfig.contract,
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
    code: evodexConfig.contract,
    scope: ual.activeUser.accountName,
    table: 'accounts'
  })

  return rows.map((row) => asset(row.balance))
}
const getAddLiquidityAssets = (amount, pair) => {
  const baseAsset = amountToAsset(amount, pair.supply)
  const asset1 = numberToAsset(0, pair.pool1.asset.symbol)
  const asset2 = numberToAsset(0, pair.pool2.asset.symbol)

  console.log({ baseAsset, asset1, asset2 })

  asset1.set_amount(
    computeForward(
      baseAsset.amount,
      pair.pool1.asset.amount,
      pair.supply.amount,
      pair.fee
    )
  )
  asset2.set_amount(
    computeForward(
      baseAsset.amount,
      pair.pool2.asset.amount,
      pair.supply.amount,
      pair.fee
    )
  )

  return {
    baseAsset,
    asset1,
    asset2
  }
}
const addLiquidity = async (amount, pair, ual) => {
  try {
    const { baseAsset, asset1, asset2 } = getAddLiquidityAssets(amount, pair)
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
            account: evodexConfig.contract,
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
            account: evodexConfig.contract,
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
              to: evodexConfig.contract,
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
              to: evodexConfig.contract,
              quantity: asset2.toString(),
              memo: ''
            }
          },
          {
            account: evodexConfig.contract,
            name: 'addliquidity',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to_buy: baseAsset.toString(),
              max_asset1: asset1.toString(),
              max_asset2: asset2.toString()
            }
          },
          {
            account: evodexConfig.contract,
            name: 'closeext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool1.contract,
                sym: pair.pool1.asset.symbol.toString()
              },
              memo: ''
            }
          },
          {
            account: evodexConfig.contract,
            name: 'closeext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool2.contract,
                sym: pair.pool2.asset.symbol.toString()
              },
              memo: ''
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
const getRemoveLiquidityAssets = (amount, pair) => {
  const baseAsset = amountToAsset(amount, pair.supply)
  const asset1 = numberToAsset(0, pair.pool1.asset.symbol)
  const asset2 = numberToAsset(0, pair.pool2.asset.symbol)

  asset1.set_amount(
    computeForward(
      baseAsset.amount.multiply(-1),
      pair.pool1.asset.amount,
      pair.supply.amount,
      0
    ).abs()
  )
  asset2.set_amount(
    computeForward(
      baseAsset.amount.multiply(-1),
      pair.pool2.asset.amount,
      pair.supply.amount,
      0
    ).abs()
  )

  return {
    baseAsset,
    asset1,
    asset2
  }
}
const removeLiquidity = async (amount, pair, ual) => {
  try {
    const { baseAsset, asset1, asset2 } = getRemoveLiquidityAssets(amount, pair)
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
            account: evodexConfig.contract,
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
            account: evodexConfig.contract,
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
            account: evodexConfig.contract,
            name: 'remliquidity',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to_sell: baseAsset.toString(),
              min_asset1: asset1.toString(),
              min_asset2: asset2.toString()
            }
          },
          {
            account: evodexConfig.contract,
            name: 'closeext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool1.contract,
                sym: pair.pool1.asset.symbol.toString()
              },
              memo: ''
            }
          },
          {
            account: evodexConfig.contract,
            name: 'closeext',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              to: ual.activeUser.accountName,
              ext_symbol: {
                contract: pair.pool2.contract,
                sym: pair.pool2.asset.symbol.toString()
              },
              memo: ''
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
const voteFee = async (amount, pair, ual) => {
  try {
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
            account: evodexConfig.voteContract,
            name: 'votefee',
            authorization,
            data: {
              user: ual.activeUser.accountName,
              pair_token: pair.supply.symbol.code().toString(),
              fee_voted: parseInt(parseFloat(amount) * 100)
            }
          },
          {
            account: evodexConfig.voteContract,
            name: 'updatefee',
            authorization,
            data: {
              pair_token: pair.supply.symbol.code().toString()
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

export const evolutiondex = {
  getInfo,
  getTokensFor,
  getPair,
  getExchangeAssets,
  exchange,
  getUserPools,
  getAddLiquidityAssets,
  addLiquidity,
  getRemoveLiquidityAssets,
  removeLiquidity,
  voteFee
}

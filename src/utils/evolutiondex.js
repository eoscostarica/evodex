import * as eosCommon from 'eos-common'

import { evodexConfig } from '../config'

import { getScatterError } from './getScatterError'
import axiosUtil from './axios.util'

import { JsonRpc } from 'eosjs'

const { asset, number_to_asset: numberToAsset } = eosCommon
const defaultState = { pairs: [], tokens: [] }
const axios = axiosUtil(evodexConfig.api, evodexConfig.apiFailover)

const getRpc = (ual) => {
  const endpoint = ual.chains[0].rpcEndpoints[0]

  const rpcEndpoint = ual.activeUser.buildRpcEndpoint(endpoint)

  return new JsonRpc(rpcEndpoint)
}

const getAccountName = async (ual) => {
  return await ual.activeUser.getAccountName(ual)
}

const amountToAsset = (amount = '0', currentAsset) => {
  if (isNaN(amount)) {
    return asset(`0 ${currentAsset.symbol.code().toString()}`)
  }

  const strAmount = typeof amount !== 'string' ? amount.toString() : amount
  const chunks = strAmount.split('.')
  const integer = chunks[0]
  const decimal = chunks[1] || '0'
  const validAmount = parseFloat(`${integer}.${decimal}`).toFixed(
    currentAsset.symbol.precision()
  )

  return asset(`${validAmount} ${currentAsset.symbol.code().toString()}`)
}
const getInfo = async (ual) => {
  const { data } = await axios.get('/list')
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
          Pool2contract: pool2Contract,
          error
        }
      } = await axios.get('/info', {
        params: {
          pair: tokenPair
        }
      })

      const balance = userPools.find(
        (item) => item.symbol.code().toString() === tokenPair
      )
      const assetPool1 = asset(pool1)
      const [amountPool1] = assetPool1.toString().split(' ')
      const assetPool2 = asset(pool2)
      const [amountPool2] = assetPool2.toString().split(' ')

      return {
        error,
        price,
        fee: isNaN(fee) ? 0 : fee,
        balance: !balance || balance.amount.isZero() ? undefined : balance,
        token: tokenPair,
        supply: asset(supply),
        pool1: {
          asset: assetPool1,
          contract: pool1Contract,
          amount: parseFloat(amountPool1)
        },
        pool2: {
          asset: assetPool2,
          contract: pool2Contract,
          amount: parseFloat(amountPool2)
        }
      }
    })
  )

  const pairsFiltered = pairs.filter((item) => !item.error)

  const tokens = Object.keys(
    pairsFiltered.reduce(
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

  return { pairs: pairsFiltered, tokens }
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
const getPriceInfo = (assetToGive, assetToReceive, pair) => {
  const price =
    parseFloat(assetToReceive.toString().split(' ')[0]) /
    parseFloat(assetToGive.toString().split(' ')[0])
  const spotPrice = pair.pool2.amount / pair.pool1.amount
  const priceImpact = Math.abs(
    parseFloat(((spotPrice / price - 1) * 100).toFixed(2))
  )
  const token1 = `1 ${assetToGive.symbol.code().toString()}`
  const token2 = `${price.toFixed(
    4
  )} ${assetToReceive.symbol.code().toString()}`

  return {
    price,
    spotPrice,
    priceImpact,
    rate: `${token1} = ${token2}`
  }
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
    ...getPriceInfo(assetToGive, assetToReceive, pair),
    assetToGive,
    assetToReceive
  }
}
const getExchangeAssetsFromToken2 = (amount, pair) => {
  const assetToGive = numberToAsset(0, pair.from.asset.symbol)
  const assetToReceive = amountToAsset(amount, pair.to.asset)
  const amountToReceive = assetToReceive.amount
    .multiply(10000)
    .plus(9999 - pair.fee)
    .divide(10000 - pair.fee)
  const computeForwardAmount = computeForward(
    amountToReceive,
    pair.from.asset.amount,
    pair.to.asset.amount.minus(amountToReceive),
    0
  ).abs()
  assetToGive.set_amount(computeForwardAmount)

  return {
    ...getPriceInfo(assetToGive, assetToReceive, pair),
    assetToGive,
    assetToReceive
  }
}
const getUserTokenBalance = async (ual, pool) => {
  if (!ual.activeUser) {
    return
  }

  const rpc = getRpc(ual)

  const response = await rpc.get_currency_balance(
    pool.contract,
    await getAccountName(ual),
    pool.asset.symbol.code().toString()
  )

  return response.length > 0 ? response[0] : null
}
const exchange = async (amount, pair, ual) => {
  try {
    const { assetToGive, assetToReceive } = getExchangeAssets(amount, pair)
    const authorization = [
      {
        actor: await getAccountName(ual),
        permission: 'active'
      }
    ]
    let aditionalActions = []
    const balance = await getUserTokenBalance(ual, pair.pool2)

    if (!balance) {
      aditionalActions = [
        ...aditionalActions,
        {
          authorization,
          account: pair.pool2.contract,
          name: 'open',
          data: {
            owner: await getAccountName(ual),
            symbol: pair.pool2.asset.symbol.toString(),
            ram_payer: await getAccountName(ual)
          }
        }
      ]
    }

    const result = await ual.activeUser.signTransaction(
      {
        actions: [
          ...aditionalActions,
          {
            authorization,
            account: pair.from.contract,
            name: 'transfer',
            data: {
              from: await getAccountName(ual),
              to: evodexConfig.contract,
              quantity: assetToGive.toString(),
              memo: `exchange: ${
                pair.token
              },${assetToReceive.toString()},sent using evodex.io`
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
  const rpc = getRpc(ual)

  const { rows } = await rpc.get_table_rows({
    json: true,
    code: evodexConfig.contract,
    scope: await getAccountName(ual),
    table: 'accounts'
  })

  return rows.map((row) => asset(row.balance))
}
const getAddLiquidityAssets = (amount, pair) => {
  const baseAsset = amountToAsset(amount, pair.supply)
  const asset1 = numberToAsset(0, pair.pool1.asset.symbol)
  const asset2 = numberToAsset(0, pair.pool2.asset.symbol)

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
        actor: await getAccountName(ual),
        permission: 'active'
      }
    ]
    const poolObject = {
      account: evodexConfig.contract,
      name: 'closeext',
      authorization,
      data: {
        user: await getAccountName(ual),
        to: await getAccountName(ual),
        memo: ''
      }
    }
    const result = await ual.activeUser.signTransaction(
      {
        actions: [
          {
            account: evodexConfig.contract,
            name: 'openext',
            authorization,
            data: {
              user: await getAccountName(ual),
              payer: await getAccountName(ual),
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
              user: await getAccountName(ual),
              payer: await getAccountName(ual),
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
              from: await getAccountName(ual),
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
              from: await getAccountName(ual),
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
              user: await getAccountName(ual),
              to_buy: baseAsset.toString(),
              max_asset1: asset1.toString(),
              max_asset2: asset2.toString()
            }
          },
          {
            ...poolObject,
            data: {
              ...poolObject.data,
              ext_symbol: {
                contract: pair.pool1.contract,
                sym: pair.pool1.asset.symbol.toString()
              }
            }
          },
          {
            ...poolObject,
            data: {
              ...poolObject.data,
              ext_symbol: {
                contract: pair.pool2.contract,
                sym: pair.pool2.asset.symbol.toString()
              }
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
        actor: await getAccountName(ual),
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
              user: await getAccountName(ual),
              payer: await getAccountName(ual),
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
              user: await getAccountName(ual),
              payer: await getAccountName(ual),
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
              user: await getAccountName(ual),
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
              user: await getAccountName(ual),
              to: await getAccountName(ual),
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
              user: await getAccountName(ual),
              to: await getAccountName(ual),
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
        actor: await getAccountName(ual),
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
              user: await getAccountName(ual),
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
  getExchangeAssetsFromToken2,
  getUserTokenBalance,
  exchange,
  getUserPools,
  getAddLiquidityAssets,
  addLiquidity,
  getRemoveLiquidityAssets,
  removeLiquidity,
  voteFee
}

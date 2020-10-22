import { TokenPocket } from 'ual-token-pocket'
import { Anchor } from 'ual-anchor'

import { ualConfig } from './config'

const timeout = (ms, promise) => {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      reject(new Error('timeout'))
    }, ms)
    promise.then(resolve, reject)
  })
}

export default {
  useFailover: false,
  init: async function () {
    try {
      const response = await timeout(
        ualConfig.timeout,
        fetch(
          `${ualConfig.api.protocol}://${ualConfig.api.host}/v1/chain/get_info`
        )
      )
      this.useFailover = response.status !== 200
    } catch (error) {
      this.useFailover = true
      console.error(error)
    }
  },
  get appName() {
    return ualConfig.appName
  },
  get chainId() {
    return ualConfig.chainId
  },
  get network() {
    return {
      chainId: this.chainId,
      rpcEndpoints: [this.useFailover ? ualConfig.apiFailover : ualConfig.api]
    }
  },
  get chains() {
    return [this.network]
  },
  get authenticators() {
    return [
      new TokenPocket([this.network]),
      new Anchor([this.network], { appName: this.appName })
    ]
  }
}

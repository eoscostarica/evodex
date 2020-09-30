import { TokenPocket } from 'ual-token-pocket'
import { Anchor } from 'ual-anchor'

import { ualConfig } from './config'

export default {
  useFailover: false,
  init: async function () {
    try {
      const response = await fetch(
        `${ualConfig.api.protocol}://${ualConfig.api.host}/v1/chain/get_info`
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

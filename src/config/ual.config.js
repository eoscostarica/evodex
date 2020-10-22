export const ualConfig = {
  timeout: parseInt(process.env.REACT_APP_EOS_API_TIMEOUT || 2500),
  appName: process.env.REACT_APP_EOS_APP_NAME || 'evodex.io',
  blockExplorerUrl: process.env.REACT_APP_EOS_BLOCK_EXPLORER_URL,
  chainId:
    process.env.REACT_APP_EOS_CHAIN_ID ||
    '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
  api: {
    blockchain: 'eos',
    protocol: process.env.REACT_APP_EOS_API_PROTOCOL || 'https',
    host: process.env.REACT_APP_EOS_API_HOST || 'jungle.eosio.cr',
    port: parseInt(process.env.REACT_APP_EOS_API_PORT || '443')
  },
  apiFailover: {
    blockchain: 'eos',
    protocol: process.env.REACT_APP_EOS_API_PROTOCOL_FAILOVER || 'https',
    host:
      process.env.REACT_APP_EOS_API_HOST_FAILOVER || 'jungle.eosargentina.io',
    port: parseInt(process.env.REACT_APP_EOS_API_PORT_FAILOVER || '443')
  }
}

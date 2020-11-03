import EosApi from 'eosjs-api'

const eosApi = EosApi({
  httpEndpoint: `${process.env.REACT_APP_EOS_API_PROTOCOL}://${process.env.REACT_APP_EOS_API_HOST}:${process.env.REACT_APP_EOS_API_PORT}`,
  verbose: false,
  fetchConfiguration: {}
})

export default eosApi

console.log(
  {
    account: contactName,
    name: 'openext',
    authorization: [
      {
        actor: ual.activeUser.accountName,
        permission: 'active'
      }
    ],
    data: {
      user: ual.activeUser.accountName,
      payer: ual.activeUser.accountName,
      ext_symbol: {
        contract: 'eosio.token',
        sym: `${currentPair.pool1.symbol.precision()},${youGive.selectValue}`
      }
    }
  },
  {
    account: contactName,
    name: 'exchange',
    authorization: [
      {
        actor: ual.activeUser.accountName,
        permission: 'active'
      }
    ],
    data: {
      user: ual.activeUser.accountName,
      pair_token: currentPair.tokenPair,
      ext_asset_in: {
        contract: 'eosio.token',
        quantity: `${parseFloat(youGive.inputValue).toFixed(
          currentPair.pool1.symbol.precision()
        )} ${youGive.selectValue}`
      },
      min_expected: `${youReceive.inputValue} ${youReceive.selectValue}`
    }
  }
)

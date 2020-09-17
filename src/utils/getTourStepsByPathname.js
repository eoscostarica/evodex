export const getTourStepsByPathname = (pathname) => {
  switch (pathname) {
    case 'exchange':
      return [
        {
          selector: '#youGive',
          content:
            'Enter a valid amount and use the dropdown menu to select the token you own and want to exchange.'
        },
        {
          selector: '#youReceive',
          content:
            'Select the token you wish to receive. We will calculate this amount for you. You can use the reverse icon anytime.'
        }
      ]

    case 'liquidity':
      return [
        {
          selector: '#youGive',
          content:
            'Here you can look up the current exchange fee for each token using the dropdown menu.'
        }
      ]

    case 'fee':
      return [
        {
          selector: '#youGive',
          content:
            'Here you may vote for the fee you consider to be the fairest for each token. Please, use a percentage with one decimal format. For example: 0.1%.'
        }
      ]

    default:
      return []
  }
}

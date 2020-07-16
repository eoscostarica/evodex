export const getValidTokens = (tokenPairs, token) => {
  const validPairs = tokenPairs.filter(
    (item) => item.token1 === token || item.token2 === token
  )
  const validTokens = validPairs.reduce(
    (temp, item) => ({
      ...temp,
      [item.token1 === token ? item.token2 : item.token1]:
        item.token1 === token ? item.token2 : item.token1
    }),
    {}
  )

  return Object.keys(validTokens)
}

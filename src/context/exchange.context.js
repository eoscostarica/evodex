import React from 'react'

const ExchangeContext = React.createContext()

const exchangeReducer = (state, action) => {
  switch (action.type) {
    case 'update': {
      return {
        ...state,
        ...action.payload
      }
    }

    default: {
      throw new Error(`Unsupported action type: ${action.type}`)
    }
  }
}

const initialValue = {
  pairs: [],
  tokens: []
}

export const ExchangeProvider = ({ info, ...props }) => {
  const [state, dispatch] = React.useReducer(exchangeReducer, initialValue)
  const value = React.useMemo(() => [state, dispatch], [state])

  React.useEffect(() => {
    if (!info) return

    dispatch({
      type: 'update',
      payload: info
    })
  }, [info])

  return <ExchangeContext.Provider value={value} {...props} />
}

export const useExchange = () => {
  const context = React.useContext(ExchangeContext)

  if (!context) {
    throw new Error(`useExchange must be used within a ExchangeContext`)
  }

  const [state, dispatch] = context
  const update = (payload) => dispatch({ type: 'update', payload })

  return [
    state,
    {
      update
    }
  ]
}

import React from 'react'
import PropTypes from 'prop-types'

import ExchangeBackLayer from './ExchangeBackLayer'
import FeeBackLayer from './FeeBackLayer'
import LiquidityBackLayer from './LiquidityBackLayer'

const BackLayers = ({ pathname }) => {
  switch (pathname) {
    case '/evodex/liquidity':
      return <LiquidityBackLayer />

    case '/evodex/exchange':
      return <ExchangeBackLayer />

    case '/evodex/fee':
      return <FeeBackLayer />

    default:
      return <ExchangeBackLayer />
  }
}

BackLayers.propTypes = {
  pathname: PropTypes.string
}

export default BackLayers

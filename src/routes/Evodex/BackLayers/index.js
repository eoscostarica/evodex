import React from 'react'
import PropTypes from 'prop-types'

import ExchangeBackLayer from './ExchangeBackLayer'
import FeeBackLayer from './FeeBackLayer'
import LiquidityBackLayer from './LiquidityBackLayer'

const BackLayers = ({ ual, pathname }) => {
  switch (pathname) {
    case '/evodex/liquidity':
      return <LiquidityBackLayer ual={ual} />

    case '/evodex/exchange':
      return <ExchangeBackLayer ual={ual} />

    case '/evodex/fee':
      return <FeeBackLayer ual={ual} />

    default:
      return <ExchangeBackLayer ual={ual} />
  }
}

BackLayers.propTypes = {
  pathname: PropTypes.string,
  ual: PropTypes.object
}

export default BackLayers

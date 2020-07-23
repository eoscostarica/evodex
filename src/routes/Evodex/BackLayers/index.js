import React from 'react'
import PropTypes from 'prop-types'

import ExchangeBackLayer from './ExchangeBackLayer'
import FeeBackLayer from './FeeBackLayer'
import LiquidityBackLayer from './LiquidityBackLayer'

const BackLayers = ({ pathname, onReload, ual }) => {
  switch (pathname) {
    case '/evodex/liquidity':
      return <LiquidityBackLayer ual={ual} onReload={onReload} />

    case '/evodex/exchange':
      return <ExchangeBackLayer ual={ual} onReload={onReload} />

    case '/evodex/fee':
      return <FeeBackLayer ual={ual} onReload={onReload} />

    default:
      return <ExchangeBackLayer ual={ual} onReload={onReload} />
  }
}

BackLayers.propTypes = {
  pathname: PropTypes.string,
  ual: PropTypes.object,
  onReload: PropTypes.func
}

export default BackLayers

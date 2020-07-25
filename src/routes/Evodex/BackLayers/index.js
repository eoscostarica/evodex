import React from 'react'
import PropTypes from 'prop-types'

import ExchangeBackLayer from './ExchangeBackLayer'
import FeeBackLayer from './FeeBackLayer'
import LiquidityBackLayer from './LiquidityBackLayer'

const BackLayers = ({ pathname, onReload, ual, isLightMode }) => {
  switch (pathname) {
    case '/evodex/liquidity':
      return (
        <LiquidityBackLayer
          ual={ual}
          onReload={onReload}
          isLightMode={isLightMode}
        />
      )

    case '/evodex/exchange':
      return (
        <ExchangeBackLayer
          ual={ual}
          onReload={onReload}
          isLightMode={isLightMode}
        />
      )

    case '/evodex/fee':
      return (
        <FeeBackLayer ual={ual} onReload={onReload} isLightMode={isLightMode} />
      )

    default:
      return (
        <ExchangeBackLayer
          ual={ual}
          onReload={onReload}
          isLightMode={isLightMode}
        />
      )
  }
}

BackLayers.propTypes = {
  pathname: PropTypes.string,
  ual: PropTypes.object,
  onReload: PropTypes.func,
  isLightMode: PropTypes.bool
}

export default BackLayers

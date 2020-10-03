import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

const PAGES_URL = {
  faq: 'htmlTitleFaq',
  about: 'htmlTitleAbout',
  'ricardian-contract': 'htmlTitleContract',
  liquidity: 'htmlTitleLiquidity',
  exchange: 'htmlTitleExchange',
  fee: 'htmlTitleFee'
}

const HelmetMetaData = () => {
  const location = useLocation()
  const { t } = useTranslation('translations')
  const [navigationTabTitle, setNavigationTabTitle] = useState(
    'htmlTitleExchange'
  )

  useEffect(() => {
    const path = location.pathname.replace(/\//g, '')

    setNavigationTabTitle(t(PAGES_URL[path]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <Helmet>
      <title>{navigationTabTitle}</title>
    </Helmet>
  )
}

export default HelmetMetaData

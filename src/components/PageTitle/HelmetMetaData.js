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
      {/* <meta charset="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta name="csrf_token" content="" />
      <meta property="type" content="website" />
      <meta property="url" content="https://evodex.io/" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#ffffff" />
      <meta name="_token" content="" />
      <meta name="robots" content="noodp" />
      <meta
        name="title"
        content="Evolution DEX - Decentralized Exchange on EOS"
      />
      <meta
        name="description"
        content="Evodex is a decentralized exchange that promotes the use of EOS for DeFi. The project is completely open source and free for developers to build on the protocol"
      />
      <meta
        property="image"
        content="https://evodex.io/social-preview-image.png"
      />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="Evolution DEX - Decentralized Exchange on EOS"
      />
      <meta
        property="og:image"
        content="https://evodex.io/social-preview-image.png"
      />
      <meta content="image/*" property="og:image:type" />
      <meta property="og:url" content="https://evodex.io/" />
      <meta property="og:site_name" content="Evolution DEX" />
      <meta
        property="og:description"
        content="Evodex is a decentralized exchange that promotes the use of EOS for DeFi. The project is completely open source and free for developers to build on the protocol"
      />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content="https://evodex.io/" /> */}
    </Helmet>
  )
}

export default HelmetMetaData

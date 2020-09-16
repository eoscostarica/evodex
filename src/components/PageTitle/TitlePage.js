import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

const TitlePage = ({ title }) => (
  <Helmet>
    <title>{title}</title>
    <meta
      name="title"
      content="Evolution DEX - Decentralized Exchange on EOS"
    />
    <meta
      name="description"
      content="Evodex is a decentralized exchange that promotes the use of EOS for DeFi. The project is completely open source and free for developers to build on the protocol"
    />
    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://evodex.io/" />
    <meta
      property="og:title"
      content="Evolution DEX - Decentralized Exchange on EOS"
    />
    <meta
      property="og:description"
      content="Evodex is a decentralized exchange that promotes the use of EOS for DeFi. The project is completely open source and free for developers to build on the protocol"
    />
    <meta property="og:image" content="https://evodex.io/imag.png" />
    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://evodex.io/" />
    <meta
      property="twitter:title"
      content="Evolution DEX - Decentralized Exchange on EOS"
    />
    <meta
      property="twitter:description"
      content="Evodex is a decentralized exchange that promotes the use of EOS for DeFi. The project is completely open source and free for developers to build on the protocol"
    />
    <meta property="twitter:image" content="https://evodex.io/imag.png" />
  </Helmet>
)

TitlePage.propTypes = {
  title: PropTypes.string
}

TitlePage.defaultProps = {
  title: 'Evolution DEX - Decentralized Exchange on EOS'
}

export default TitlePage

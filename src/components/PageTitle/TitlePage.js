import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'

const TitlePage = ({ title }) => (
  <Helmet>
    <title>{title}</title>
    <meta name="title" content="" />
    <meta name="description" content="" />
    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://metatags.io/" />
    <meta property="og:title" content="" />
    <meta property="og:description" content="" />
    <meta
      property="og:image"
      content="https://user-images.githubusercontent.com/5632966/92547334-e3e4a600-f211-11ea-864e-a4cfee7ebba8.png"
    />
    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://metatags.io/" />
    <meta property="twitter:title" content="" />
    <meta property="twitter:description" content="" />
    <meta
      property="twitter:image"
      content="https://user-images.githubusercontent.com/5632966/92547334-e3e4a600-f211-11ea-864e-a4cfee7ebba8.png"
    />
  </Helmet>
)

TitlePage.propTypes = {
  title: PropTypes.string
}

TitlePage.defaultProps = {
  title: 'Evodex - EOS decentralized exchange'
}

export default TitlePage

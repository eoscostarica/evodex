import React from 'react'
import PropTypes from 'prop-types'
import Link from '@material-ui/core/Link'

const MessageLink = ({ href, transactionId, text }) => (
  <span>
    {text}
    <Link href={href} target="_blank" rel="noopener noreferrer">
      {transactionId}
    </Link>
  </span>
)

MessageLink.propTypes = {
  href: PropTypes.string,
  transactionId: PropTypes.any,
  text: PropTypes.string
}

export default MessageLink

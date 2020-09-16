import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const EmptyMessage = ({
  isActiveUser,
  isEmptyData,
  classes,
  onLogin,
  onClickLink,
  useLink
}) => {
  if (!isActiveUser)
    return (
      <Box className={classes.boxMessage}>
        <Typography onClick={onLogin} className={classes.link}>
          Login
        </Typography>
        <Typography>to view your pools.</Typography>
      </Box>
    )

  if (isEmptyData)
    return (
      <Box className={classes.boxMessage}>
        <Typography>No token pairs found.</Typography>
        {useLink && (
          <Typography onClick={onClickLink} className={classes.link}>
            Add liquidity now.
          </Typography>
        )}
      </Box>
    )

  return null
}

EmptyMessage.propTypes = {
  isActiveUser: PropTypes.bool,
  isEmptyData: PropTypes.bool,
  classes: PropTypes.object,
  onLogin: PropTypes.func,
  onClickLink: PropTypes.func,
  useLink: PropTypes.bool
}

export default EmptyMessage

import React from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation('translations')

  if (!isActiveUser)
    return (
      <Box className={classes.boxMessage}>
        <Typography onClick={onLogin} className={classes.link}>
          {t('login')}
        </Typography>
        <Typography>{t('noUserPools')}</Typography>
      </Box>
    )

  if (isEmptyData)
    return (
      <Box className={classes.boxMessage}>
        <Typography>{t('noTokensFound')}</Typography>
        {useLink && (
          <Typography onClick={onClickLink} className={classes.link}>
            {t('addLiquidity')}
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

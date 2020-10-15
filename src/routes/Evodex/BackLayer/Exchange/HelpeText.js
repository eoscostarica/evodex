import React, { memo } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/styles'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { useTranslation } from 'react-i18next'

import { ualConfig } from 'config'

const useStyles = makeStyles((theme) => ({
  poolContractLink: {
    color: theme.palette.primary.contrastText,
    textDecoration: 'none',
    marginLeft: theme.spacing(1)
  },
  textInfo: {
    fontSize: 16.2,
    fontWeight: 500,
    letterSpacing: '0.5px',
    lineHeight: 1.73,
    color: '#fff'
  },
  helperText: {
    fontSize: 12,
    marginLeft: theme.spacing(1),
    minHeight: 20
  },
  error: {
    color: theme.palette.error.main
  }
}))

const HelpeText = ({ balance, inputsData, inputsError, activeUser, name }) => {
  const classes = useStyles()
  const { t } = useTranslation('exchange')
  const token = inputsData[name].selectValue

  return (
    <>
      {inputsError[name] && (
        <Typography
          variant="body1"
          className={clsx([
            classes.textInfo,
            classes.helperText,
            classes.error
          ])}
        >
          <span>{t(inputsError[name])}</span>
        </Typography>
      )}
      {balance[token] && (
        <Typography
          variant="body1"
          className={clsx([classes.textInfo, classes.helperText])}
        >
          <span>
            {t('pool')}: {balance[token].poolAsset}
          </span>
          <Link
            className={classes.poolContractLink}
            href={`${ualConfig.blockExplorerUrl}/account/${balance[token].contract}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            ({balance[token].contract})
          </Link>
        </Typography>
      )}
      {activeUser && balance[token] && (
        <Typography
          variant="body1"
          className={clsx([classes.textInfo, classes.helperText])}
        >
          <span>
            {t('yourWallet')}: {balance[token].userAsset}
          </span>
        </Typography>
      )}
    </>
  )
}

HelpeText.propTypes = {
  balance: PropTypes.object,
  inputsData: PropTypes.object,
  inputsError: PropTypes.object,
  activeUser: PropTypes.bool,
  name: PropTypes.string
}

export default memo(HelpeText)

import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'

import CustomRouterLink from '../../components/CustomRouterLink'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
    display: 'flex',
    height: '100vh'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  centerText: {
    textAlign: 'center'
  }
}))

const NotFound = (props) => {
  const classes = useStyles()
  const { t } = useTranslation('notFound')

  return (
    <div className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} className={classes.content}>
          <div className={classes.centerText}>
            <Typography variant="h1">{t('primaryMessage')}</Typography>
            <Typography variant="subtitle2">{t('secondaryMessage')}</Typography>
            <Button
              variant="contained"
              color="primary"
              activeClassName={classes.active}
              component={CustomRouterLink}
              to="/"
            >
              {t('buttonLabel')}
            </Button>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default NotFound

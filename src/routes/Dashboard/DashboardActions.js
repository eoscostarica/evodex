import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Alert from '@material-ui/lab/Alert'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Link from '@material-ui/core/Link'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    marginBottom: theme.spacing(2)
  },
  button: {
    marginBottom: theme.spacing(2)
  }
}))

const contactName = 'evolutiondex'

const Actions = ({ ual }) => {
  const { t } = useTranslation('translations')
  const classes = useStyles()
  const [openextData, setOpenextData] = useState({
    extSymbol: { contract: 'eosio.token', sym: '4,EOS' }
  })

  const handleOpenextAction = async () => {
    setOpenextData((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
      transactionId: null
    }))
    try {
      const { extSymbol } = openextData
      const result = await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: contactName,
              name: 'openext',
              authorization: [
                {
                  actor: ual?.activeUser?.accountName,
                  permission: 'active'
                }
              ],
              data: {
                ext_symbol: extSymbol,
                user: ual?.activeUser?.accountName,
                payer: ual?.activeUser?.accountName
              }
            }
          ]
        },
        {
          broadcast: true
        }
      )
      setOpenextData((prevState) => ({
        ...prevState,
        transactionId: result.transactionId
      }))
    } catch (error) {
      setOpenextData((prevState) => ({
        ...prevState,
        error: error.message
      }))
    }
    setOpenextData((prevState) => ({
      ...prevState,
      loading: false
    }))
    setTimeout(
      () =>
        setOpenextData((prevState) => ({
          ...prevState,
          error: null,
          transactionId: null
        })),
      10000
    )
  }

  return (
    <Grid item xs={12} lg={4}>
      <Card>
        <CardContent>
          <form className={classes.form} noValidate autoComplete="off">
            <Typography variant="h1">{t('openext')}</Typography>
            <TextField
              className={classes.input}
              label="contract"
              value={openextData?.extSymbol?.contract || ''}
              onChange={(e) =>
                setOpenextData({
                  ...openextData,
                  extSymbol: {
                    ...(openextData.extSymbol || {}),
                    contract: e.target.value
                  }
                })
              }
            />
            <TextField
              className={classes.input}
              label="sym"
              value={openextData?.extSymbol?.sym || ''}
              onChange={(e) =>
                setOpenextData({
                  ...openextData,
                  extSymbol: {
                    ...(openextData.extSymbol || {}),
                    sym: e.target.value
                  }
                })
              }
            />
            <Button
              className={classes.button}
              disabled={openextData.loading}
              variant="contained"
              color="primary"
              onClick={handleOpenextAction}
            >
              Send
            </Button>
            {openextData.loading && <LinearProgress />}
            {openextData.transactionId && (
              <Alert
                severity="info"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenextData({ ...openextData, transactionId: null })
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                <Link
                  href={`https://jungle.bloks.io/transaction/${openextData.transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Executed
                </Link>
              </Alert>
            )}
            {openextData.error && (
              <Alert
                severity="error"
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => {
                      setOpenextData({ ...openextData, error: null })
                    }}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                Error {openextData.error}
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </Grid>
  )
}

Actions.propTypes = {
  ual: PropTypes.object
}

export default Actions

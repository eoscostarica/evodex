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

import { getScatterError } from '../../utils'

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
    extSymbol: { contract: 'eosio.token', sym: '4,EVO' }
  })
  const [inittokenData, setInittokenData] = useState({
    newSymbol: '4,EVO',
    initialPool1: { contract: 'eosio.token', quantity: '10 EOS' },
    initialPool2: { contract: 'eosio.token', quantity: '10 JUNGLE' },
    initialFee: 1
  })
  const [addliquidityData, setAddliquidityData] = useState({
    toBuy: '80.0000 EVO',
    maxAsset1: '10 EOS',
    maxAsset2: '10 JUNGLE'
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
        error: getScatterError(error)
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

  const handleInittokenAction = async () => {
    setInittokenData((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
      transactionId: null
    }))
    try {
      const {
        newSymbol,
        initialPool1,
        initialPool2,
        initialFee
      } = inittokenData
      const result = await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: contactName,
              name: 'inittoken',
              authorization: [
                {
                  actor: ual?.activeUser?.accountName,
                  permission: 'active'
                }
              ],
              data: {
                user: ual?.activeUser?.accountName,
                fee_contract: ual?.activeUser?.accountName,
                new_symbol: newSymbol,
                initial_pool1: initialPool1,
                initial_pool2: initialPool2,
                initial_fee: parseInt(initialFee)
              }
            }
          ]
        },
        {
          broadcast: true
        }
      )
      setInittokenData((prevState) => ({
        ...prevState,
        transactionId: result.transactionId
      }))
    } catch (error) {
      setInittokenData((prevState) => ({
        ...prevState,
        error: getScatterError(error)
      }))
    }
    setInittokenData((prevState) => ({
      ...prevState,
      loading: false
    }))
    setTimeout(
      () =>
        setInittokenData((prevState) => ({
          ...prevState,
          error: null,
          transactionId: null
        })),
      10000
    )
  }

  const handleAddliquidityAction = async () => {
    setAddliquidityData((prevState) => ({
      ...prevState,
      loading: true,
      error: null,
      transactionId: null
    }))
    try {
      const { toBuy, maxAsset1, maxAsset2 } = addliquidityData
      const result = await ual.activeUser.signTransaction(
        {
          actions: [
            {
              account: contactName,
              name: 'addliquidity',
              authorization: [
                {
                  actor: ual?.activeUser?.accountName,
                  permission: 'active'
                }
              ],
              data: {
                user: ual?.activeUser?.accountName,
                to_buy: toBuy,
                max_asset1: maxAsset1,
                max_asset2: maxAsset2
              }
            }
          ]
        },
        {
          broadcast: true
        }
      )
      setAddliquidityData((prevState) => ({
        ...prevState,
        transactionId: result.transactionId
      }))
    } catch (error) {
      setAddliquidityData((prevState) => ({
        ...prevState,
        error: getScatterError(error)
      }))
    }
    setAddliquidityData((prevState) => ({
      ...prevState,
      loading: false
    }))
    setTimeout(
      () =>
        setAddliquidityData((prevState) => ({
          ...prevState,
          error: null,
          transactionId: null
        })),
      10000
    )
  }

  return (
    <Grid item xs={12}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4} lg={3}>
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
                          setOpenextData({
                            ...openextData,
                            transactionId: null
                          })
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
        <Grid item xs={12} md={4} lg={3}>
          <Card>
            <CardContent>
              <form className={classes.form} noValidate autoComplete="off">
                <Typography variant="h1">{t('inittoken')}</Typography>
                <TextField
                  className={classes.input}
                  label="new_symbol"
                  value={inittokenData?.newSymbol || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      newSymbol: e.target.value
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="initial_pool1.contract"
                  value={inittokenData?.initialPool1?.contract || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      initialPool1: {
                        ...(inittokenData.initialPool1 || {}),
                        contract: e.target.value
                      }
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="initial_pool1.quantity"
                  value={inittokenData?.initialPool1?.quantity || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      initialPool1: {
                        ...(inittokenData.initialPool1 || {}),
                        quantity: e.target.value
                      }
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="initial_pool2.contract"
                  value={inittokenData?.initialPool2?.contract || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      initialPool2: {
                        ...(inittokenData.initialPool2 || {}),
                        contract: e.target.value
                      }
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="initial_pool2.quantity"
                  value={inittokenData?.initialPool2?.quantity || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      initialPool2: {
                        ...(inittokenData.initialPool2 || {}),
                        quantity: e.target.value
                      }
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="initial_fee"
                  value={inittokenData?.initialFee || ''}
                  onChange={(e) =>
                    setInittokenData({
                      ...inittokenData,
                      initialFee: e.target.value
                    })
                  }
                />
                <Button
                  className={classes.button}
                  disabled={inittokenData.loading}
                  variant="contained"
                  color="primary"
                  onClick={handleInittokenAction}
                >
                  Send
                </Button>
                {inittokenData.loading && <LinearProgress />}
                {inittokenData.transactionId && (
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenextData({
                            ...inittokenData,
                            transactionId: null
                          })
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <Link
                      href={`https://jungle.bloks.io/transaction/${inittokenData.transactionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Executed
                    </Link>
                  </Alert>
                )}
                {inittokenData.error && (
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenextData({ ...inittokenData, error: null })
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    Error {inittokenData.error}
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Card>
            <CardContent>
              <form className={classes.form} noValidate autoComplete="off">
                <Typography variant="h1">{t('addliquidity')}</Typography>
                <TextField
                  className={classes.input}
                  label="to_buy"
                  value={addliquidityData?.toBuy || ''}
                  onChange={(e) =>
                    setAddliquidityData({
                      ...addliquidityData,
                      addliquidityData: e.target.value
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="max_asset1"
                  value={addliquidityData?.maxAsset1 || ''}
                  onChange={(e) =>
                    setAddliquidityData({
                      ...addliquidityData,
                      maxAsset1: e.target.value
                    })
                  }
                />
                <TextField
                  className={classes.input}
                  label="max_asset2"
                  value={addliquidityData?.maxAsset2 || ''}
                  onChange={(e) =>
                    setAddliquidityData({
                      ...addliquidityData,
                      maxAsset2: e.target.value
                    })
                  }
                />
                <Button
                  className={classes.button}
                  disabled={addliquidityData.loading}
                  variant="contained"
                  color="primary"
                  onClick={handleAddliquidityAction}
                >
                  Send
                </Button>
                {addliquidityData.loading && <LinearProgress />}
                {addliquidityData.transactionId && (
                  <Alert
                    severity="info"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenextData({
                            ...inittokenData,
                            transactionId: null
                          })
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    <Link
                      href={`https://jungle.bloks.io/transaction/${inittokenData.transactionId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Executed
                    </Link>
                  </Alert>
                )}
                {addliquidityData.error && (
                  <Alert
                    severity="error"
                    action={
                      <IconButton
                        aria-label="close"
                        color="inherit"
                        size="small"
                        onClick={() => {
                          setOpenextData({ ...inittokenData, error: null })
                        }}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                  >
                    Error {addliquidityData.error}
                  </Alert>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Grid>
  )
}

Actions.propTypes = {
  ual: PropTypes.object
}

export default Actions

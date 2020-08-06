import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Link from '@material-ui/core/Link'
import Divider from '@material-ui/core/Divider'
import LinearProgress from '@material-ui/core/LinearProgress'
import { makeStyles } from '@material-ui/core/styles'
import EosApi from 'eosjs-api'

const defaultIcon =
  'https://icons.iconarchive.com/icons/custom-icon-design/mono-general-2/512/document-icon.png'

const useStyles = makeStyles((theme) => ({
  ricardianContractContainer: {
    '& h3': {
      fontSize: 38
    },
    [theme.breakpoints.up('sm')]: {
      '& h3': {
        fontSize: 50
      }
    }
  },
  boxTitle: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(1),
    '& img': {
      width: 50
    }
  },
  boxText: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing(1),
    '& h6': {
      fontStyle: 'italic',
      lineHeight: 1
    },
    '& h4': {
      lineHeight: 1
    }
  },
  defaultIcon: {
    fontSize: 65,
    color: '#484158'
  },
  divider: {
    marginBottom: theme.spacing(2)
  }
}))

const RicardianContract = ({
  name,
  url,
  httpEndpoint,
  contractName,
  actionName,
  showClauses,
  loadingMessage,
  LinearProgressColor,
  errorMessage,
  LinearProgressOverrideClasses
}) => {
  const classes = useStyles()
  const [hash, setHash] = useState('')
  const [action, setAction] = useState([])
  const [clauses, setClauses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState({ isError: false, message: '' })

  const eosApi = useCallback(
    EosApi({
      httpEndpoint: httpEndpoint,
      verbose: false,
      fetchConfiguration: {}
    }),
    [httpEndpoint]
  )

  const useDefaultLogo = (ev) => {
    ev.target.src = defaultIcon
  }

  const formatRicardianClause = useCallback(
    (text = '') => {
      const [_version, content1] = text.split('\ntitle: ')
      const version = _version.replace(/---\n/g, '')
      const [_title, content2] = (content1 || '').split('\nsummary: ')
      const [summary, _icon] = (content2 || '').split('\nicon: ')

      return (
        <Box>
          <Box className={classes.boxTitle}>
            <img
              alt="icon"
              src={_icon || defaultIcon}
              onError={useDefaultLogo}
            />
            <Box className={classes.boxText}>
              <Typography color="primary" variant="h4">
                {_title}
              </Typography>
              <Typography color="primary" variant="subtitle2">
                {version}
              </Typography>
            </Box>
          </Box>
          <Divider className={classes.divider} />
          <Typography variant="body1">{summary}</Typography>
        </Box>
      )
    },
    [classes]
  )

  useEffect(() => {
    const getData = async () => {
      try {
        const { abi = {} } = await eosApi.getAbi(contractName || name)
        const { code_hash: hash = '' } = await eosApi.getCodeHash(
          contractName || name
        )

        if (!abi || !abi.actions.length) return

        let actions = abi.actions.filter(
          ({ ricardian_contract: ricardianContract }) => !!ricardianContract
        )

        if (actionName) {
          actions = actions.filter(({ name }) => name === actionName)
        }

        if (actions.lenght < 1) return

        actions = actions.map(({ ricardian_contract: ricardianContract }) =>
          formatRicardianClause(ricardianContract)
        )

        let clauses = []

        if (showClauses) {
          clauses = abi.ricardian_clauses.map(({ body }) =>
            formatRicardianClause(body)
          )
        }

        setAction(actions)
        setClauses(clauses)
        setHash(hash)
        setLoading(false)
        setError({ isError: false, message: '' })
      } catch (error) {
        setLoading(false)
        setError({
          isError: true,
          message: errorMessage
        })
      }
    }

    setLoading(true)
    getData()
  }, [
    name,
    eosApi,
    contractName,
    actionName,
    showClauses,
    formatRicardianClause,
    errorMessage
  ])

  if (error.isError) {
    return (
      <Box className={classes.ricardianContractContainer}>
        <Typography variant="h3">{error.message}</Typography>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box className={classes.ricardianContractContainer}>
        <Box mt={5}>
          <Typography variant="h5" align="center">
            {(loadingMessage || '').toUpperCase()}
          </Typography>
          <LinearProgress
            color={LinearProgressColor}
            classes={LinearProgressOverrideClasses}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box className={classes.ricardianContractContainer}>
      <Typography variant="h3">Ricardian contract</Typography>
      <Typography variant="body1">
        {'Name: '}
        <Link
          href={`${url}/account/${
            contractName || name
          }?loadContract=true&tab=Actions`}
          variant="body2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {contractName || name}
        </Link>
      </Typography>

      <Typography variant="body1">
        {'Hash: '}
        <Link
          href={`${url}/account/${
            contractName || name
          }?loadContract=true&tab=ABI`}
          variant="body2"
          target="_blank"
          rel="noopener noreferrer"
        >
          {hash || ''}
        </Link>
      </Typography>

      {action.map((item) => item)}
      {clauses.map((clause) => clause)}
    </Box>
  )
}

RicardianContract.propTypes = {
  httpEndpoint: PropTypes.string,
  contractName: PropTypes.string,
  actionName: PropTypes.string,
  showClauses: PropTypes.bool,
  name: PropTypes.string,
  url: PropTypes.string,
  loadingMessage: PropTypes.string,
  LinearProgressColor: PropTypes.string,
  errorMessage: PropTypes.string,
  LinearProgressOverrideClasses: PropTypes.object
}

RicardianContract.defaultProps = {
  httpEndpoint: 'https://jungle.eosio.cr',
  url: 'https://bloks.io',
  showClauses: true,
  loadingMessage: 'Fetching ricardian clauses from blockchain',
  LinearProgressColor: 'secondary',
  errorMessage: 'Error getting Ricardian Contract Data',
  LinearProgressOverrideClasses: {}
}

export default RicardianContract

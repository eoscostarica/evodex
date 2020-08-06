import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { RicardianContract } from '@eoscostarica/eoscr-components'

const useStyles = makeStyles((theme) => ({
  wrapper: {
    height: '95vh',
    overflow: 'scroll',
    padding: theme.spacing(2, 1, 0, 1),
    '& img': {
      width: '30px !important'
    },
    '& h4': {
      fontSize: '15px !important',
      fontWeight: '600'
    },
    '& a': {
      lineBreak: 'anywhere'
    },
    [theme.breakpoints.up('sm')]: {
      '& img': {
        width: '40px !important'
      },

      '& h4': {
        fontSize: '30px !important',
        fontWeight: 'normal'
      }
    }
  },
  selectorTab: {
    backgroundColor: '#272863'
  },
  overrideLinearColor: {
    backgroundColor: '#27286380'
  },
  overrideFrontLinearColor: {
    backgroundColor: '#272863'
  }
}))

const TermsOfUse = () => {
  const classes = useStyles()
  const [tab, setTab] = useState(0)

  return (
    <>
      <Tabs
        value={tab}
        onChange={(event, newValue) => setTab(newValue)}
        classes={{ indicator: classes.selectorTab }}
      >
        <Tab label="evolutiondex" />
        <Tab label="wevotethefee" />
      </Tabs>
      {tab === 0 && (
        <Box className={classes.wrapper}>
          <RicardianContract
            contractName="evolutiondex"
            httpEndpoint="https://jungle.eosio.cr"
            LinearProgressOverrideClasses={{
              barColorPrimary: classes.overrideFrontLinearColor,
              colorPrimary: classes.overrideLinearColor
            }}
            LinearProgressColor="primary"
          />
        </Box>
      )}
      {tab === 1 && (
        <Box className={classes.wrapper}>
          <RicardianContract
            contractName="wevotethefee"
            httpEndpoint="https://jungle.eosio.cr"
            LinearProgressOverrideClasses={{
              barColorPrimary: classes.overrideFrontLinearColor,
              colorPrimary: classes.overrideLinearColor
            }}
            LinearProgressColor="primary"
          />
        </Box>
      )}
    </>
  )
}

export default TermsOfUse

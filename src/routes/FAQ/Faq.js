import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import ReactMarkdown from 'react-markdown'

import CustomRouterLink from '../../components/CustomRouterLink'
import FaqContent from './Faq.md'

const useStyles = makeStyles((theme) => ({
  root: {
    // padding: theme.spacing(4),
    display: 'flex',
    height: '100vh'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column'
  }
}))

const FAQ = () => {
  const classes = useStyles()
  const [content, setContent] = useState(null)

  useEffect(() => {
    const getContent = async () => {
      fetch(FaqContent)
        .then((res) => res.text())
        .then((text) => setContent(text))
    }

    getContent()
  }, [])

  return (
    <Box className={classes.root}>
      <Grid container spacing={4}>
        <Grid item xs={12} className={classes.content}>
          <ReactMarkdown source={content} />
          <Button
            variant="contained"
            color="primary"
            activeClassName={classes.active}
            component={CustomRouterLink}
            to="/"
          >
            Take me home
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default FAQ

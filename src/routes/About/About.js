import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Box from '@material-ui/core/Box'
import ReactMarkdown from 'react-markdown'

import CustomRouterLink from '../../components/CustomRouterLink'
import AboutContent from './About.md'

const useStyles = makeStyles((theme) => ({
  root: {
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

const About = () => {
  const classes = useStyles()
  const [content, setContent] = useState(null)

  useEffect(() => {
    const getContent = async () => {
      fetch(AboutContent)
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

export default About

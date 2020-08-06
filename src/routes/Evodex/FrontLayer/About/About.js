import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import ReactMarkdown from 'react-markdown'

import AboutContent from './About.md'

const useStyles = makeStyles((theme) => ({
  aboutRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh'
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
    <Box className={classes.aboutRoot}>
      <ReactMarkdown source={content} />
    </Box>
  )
}

export default About

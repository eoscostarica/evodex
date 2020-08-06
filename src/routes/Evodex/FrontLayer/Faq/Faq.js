import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import Box from '@material-ui/core/Box'
import ReactMarkdown from 'react-markdown'

import FaqContent from './Faq.md'

const useStyles = makeStyles((theme) => ({
  faqRoot: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    '& blockquote': {
      margin: 0,
      '& h2': {
        marginBottom: 0
      }
    }
  }
}))

const Faq = () => {
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
    <Box className={classes.faqRoot}>
      <ReactMarkdown source={content} />
    </Box>
  )
}

export default Faq

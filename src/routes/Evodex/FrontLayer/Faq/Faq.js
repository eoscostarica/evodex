import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import { useTranslation } from 'react-i18next'
import Box from '@material-ui/core/Box'
import ReactMarkdown from 'react-markdown'

import getMarkdownByLanguage from 'utils/getMarkdownByLanguage'

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
  const { i18n } = useTranslation()

  useEffect(() => {
    const getContent = async () => {
      const contentMD = getMarkdownByLanguage(
        `${(i18n.language || '').toLocaleLowerCase().substring(0, 2)}/faq`
      )

      fetch(contentMD)
        .then((res) => res.text())
        .then((text) => setContent(text))
    }

    getContent()
  }, [i18n.language])

  return (
    <Box className={classes.faqRoot}>
      <ReactMarkdown source={content} />
    </Box>
  )
}

export default Faq

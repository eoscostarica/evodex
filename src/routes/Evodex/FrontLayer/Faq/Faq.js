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
    paddingBottom: theme.spacing(2),
    '& h1': {
      fontSize: '30px !important',
      fontWeight: 'normal',
      marginBottom: theme.spacing(0)
    },
    '& h2': {
      margin: theme.spacing(1, 0),
      fontWeight: 'normal',
      marginTop: theme.spacing(4)
    },
    '& p': {
      margin: 0,
      color: '#212121',
      fontSize: 15.8,
      fontWeight: 'normal',
      lineHeight: 1.77,
      letterSpacing: 0.5,
      fontFamily: '"rawline", sans-serif'
    },
    [theme.breakpoints.up('lg')]: {
      '& h1': {
        fontSize: '50px !important'
      }
    }
  },
  boxContent: {
    height: '100%',
    overflowY: 'scroll',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
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
        `${(i18n.language || 'en').toLocaleLowerCase().substring(0, 2)}/faq`
      )

      fetch(contentMD)
        .then((res) => res.text())
        .then((text) => setContent(text))
    }

    getContent()
  }, [i18n.language])

  return (
    <Box className={classes.boxContent}>
      <Box className={classes.faqRoot}>
        <ReactMarkdown source={content} />
      </Box>
    </Box>
  )
}

export default Faq

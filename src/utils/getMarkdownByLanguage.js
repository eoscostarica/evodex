import aboutES from 'language/es/about.md'
import faqES from 'language/es/faq.md'
import aboutEN from 'language/en/about.md'
import faqEN from 'language/en/faq.md'

const getMarkdownByLanguage = (page) => {
  let result = null

  switch (page) {
    case 'es/about':
      result = aboutES
      break

    case 'es/faq':
      result = faqES
      break

    case 'en/about':
      result = aboutEN
      break

    case 'en/faq':
      result = faqEN
      break

    default:
      break
  }

  return result
}

export default getMarkdownByLanguage

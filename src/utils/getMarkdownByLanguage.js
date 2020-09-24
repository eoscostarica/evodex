import aboutES from 'language/es/about.md'
import faqES from 'language/es/faq.md'
import aboutEN from 'language/en/about.md'
import faqEN from 'language/en/faq.md'
import aboutZH from 'language/zh/about.md'
import faqZH from 'language/zh/faq.md'

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

    case 'zh/about':
      result = aboutZH
      break

    case 'zh/faq':
      result = faqZH
      break

    default:
      break
  }

  return result
}

export default getMarkdownByLanguage

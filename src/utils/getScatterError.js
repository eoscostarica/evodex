export const getScatterError = (excpetion) => {
  if (!excpetion?.cause?.json?.error?.details?.length) {
    return excpetion.message
  }

  return excpetion.cause.json.error.details[0].message.replace(
    'assertion failure with message: ',
    ''
  )
}

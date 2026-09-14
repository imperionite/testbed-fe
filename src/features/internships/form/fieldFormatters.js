export function formatUserDate(value) {
  if (!value && value !== 0) return null
  try {
    const dateObj = new Date(value)

    if (isNaN(dateObj.getTime())) return null

    return new Intl.DateTimeFormat('en-US', {
      month: 'numeric',
      day: '2-digit',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(dateObj)
  } catch (error) {
    console.error('Date formatting error:', error)
    return null
  }
}

export function formatAccountStatus(value) {
  return value === true ? 'Active' : 'Inactive'
}

export function formatSentenceCase(value) {
  if (!value) return ''

  return value
    .toLowerCase()
    .replace(/(^\s*|[.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase())
}

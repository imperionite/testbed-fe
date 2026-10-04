export function formatDate(value) {
  if (!value && value !== 0) return null
  try {
    const dateObj = new Date(value)

    if (isNaN(dateObj.getTime())) return null

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
      timeZone: 'UTC',
    }).format(dateObj)
  } catch (error) {
    console.error('Date formatting error:', error)
    return null
  }
}

export function formatDateOnly(value) {
  if (!value && value !== 0) return null
  try {
    const dateObj = new Date(value)

    if (isNaN(dateObj.getTime())) return null

    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(dateObj)
  } catch (error) {
    console.error('Date formatting error:', error)
    return null
  }
}

export const defaultEmptyCellValue = '–'

export function formatAccountStatus(value) {
  return value === true ? 'Active' : 'Inactive'
}

export function formatSentenceCase(value) {
  if (!value) return ''

  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export function formatPersonName(person = {}) {
  const firstName = (person.firstName ?? person.first_name ?? '').trim()
  const middleName = (person.middleName ?? person.middle_name ?? '').trim()
  const lastName = (person.lastName ?? person.last_name ?? '').trim()
  const suffix = (person.suffix ?? '').trim()

  const middleInitial = middleName ? `${middleName[0].toUpperCase()}.` : ''

  return [firstName, middleInitial, lastName, suffix].filter(Boolean).join(' ')
}

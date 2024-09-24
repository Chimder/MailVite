import dayjs from 'dayjs'

export const formatDate = (dateString: string): string => {
  const date = dayjs(dateString, 'ddd, D MMM YYYY HH:mm:ss ZZ')

  if (dayjs().isSame(date, 'day')) {
    return date.format('HH:mm')
  } else if (dayjs().isSame(date, 'week')) {
    return date.format('ddd')
  } else if (dayjs().isSame(date, 'year')) {
    return date.format('MMM D')
  } else {
    return date.format('MMM YYYY')
  }
}

export const formatTempDate = (dateString: string): string => {
  const date = dayjs(dateString)

  if (dayjs().isSame(date, 'day')) {
    return date.format('HH:mm')
  } else if (dayjs().isSame(dayjs().subtract(1, 'day'), 'day')) {
    return date.format('ddd HH:mm')
  } else {
    return date.format('MMM D, YYYY HH:mm')
  }
}

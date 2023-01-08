/**
 * Makes 'YYYY-MM-DD hh:mm:ss' from 'hh:mm:ss DD.MM.YY'
 * @param {string} rawDateTime Date as 'hh:mm:ss DD.MM.YY'.
 * @returns {string} Date as 'YYYY-MM-DD hh:mm:ss'.
 */
function normalizeDate(rawDateTime) {
  let rawTime = rawDateTime.split(' ')[0]
  let rawDate = rawDateTime.split(' ')[1]

  let dateParts = rawDate.split('.')

  let year = `20${dateParts[2]}`
  let month = dateParts[1]
  let day = dateParts[0]

  let newDateTime = `${year}-${month}-${day} ${rawTime}`
  
  return newDateTime
}

function normalizeDateAlt(rawDateTime) {
  let rawTime = rawDateTime.split(' ')[1]
  let rawDate = rawDateTime.split(' ')[0]

  let dateParts = rawDate.split('.')

  let year = dateParts[2]
  let month = dateParts[1]
  let day = dateParts[0]

  let newDateTime = `${year}-${month}-${day} ${rawTime}:00`
  
  return newDateTime
}

function getDateStart(rawDateTime) {
  let date = rawDateTime.split(' ')[0]
  let newDateTime = `${date} 00:00:00`

  return newDateTime
}

function getModifiedTime(rawDateTime, value=1, unit='m',type = 'plus', round=false) {
  let dateUTC = `${rawDateTime.replace(' ', 'T')}.000Z`
  let date = new Date(dateUTC)
  let multiplier = 1000
  if (unit == 'm') multiplier = 60000
  if (unit == 'h') multiplier = 3600000
  if (unit == 'd') multiplier = 86400000

  let newDate = type == 'plus' ? new Date(date.getTime() + (value * multiplier)) : new Date(date.getTime() - (value * multiplier))
  let stringDate = newDate.toISOString().split('.')[0].replace('T', ' ')

  if (round) stringDate = stringDate.substring(0, 17) + '00'

  return stringDate
}
/**
 * Makes 'YYYY-MM-DD hh:mm:ss' from 'hh:mm:ss DD.MM.YY'
 * @param {string} rawDateTime Date as 'hh:mm:ss DD.MM.YY'.
 * @returns {string} Date as 'YYYY-MM-DD hh:mm:ss'.
 */
function normalizeDate (rawDateTime) {
  let rawTime = rawDateTime.split(' ')[0]
  let rawDate = rawDateTime.split(' ')[1]

  // let timeParts = rawTime.split(':')
  let dateParts = rawDate.split('.')

  let year = `20${dateParts[2]}`
  let month = dateParts[1]
  let day = dateParts[0]

  let newDateTime = `${year}-${month}-${day} ${rawTime}`
  
  return newDateTime
}

function getDateStart(rawDateTime) {
  let date = rawDateTime.split(' ')[0]
  let newDateTime = `${date} 00:00:00`

  return newDateTime
}
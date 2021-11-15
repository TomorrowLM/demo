import {
  B3DisplayParse,
  B3ExtendsDisplayParse,
} from '../../lib/B3DateFormat'

const getStoreZoneDate = date => {
  const {
    store_time_zone: storeTimeZone,
  } = window.jsContext.settings

  // local date
  const localDate = date || new Date()
  const localTime = localDate.getTime()
  // local offset
  const localOffset = localDate.getTimezoneOffset() * 60000
  // 8*60*60*1000
  // UTC Time
  const utcTime = localTime + localOffset
  // store setting time zone
  const timeZone = storeTimeZone
  // store setting time
  const zonetime = utcTime + (3600000 * timeZone)
  // store setting date
  const zoneDate = new Date(zonetime)
  return zoneDate
}

const formateTimestampToLocal = timestamp => new Date(parseInt(timestamp, 10) * 1000).toLocaleDateString().replace(/\//g, '/')

const getMonthDayYear = timestamp => {
  const y = new Date(parseInt(timestamp, 10) * 1000).getFullYear()
  const m = new Date(parseInt(timestamp, 10) * 1000).getMonth() + 1
  const d = new Date(parseInt(timestamp, 10) * 1000).getDate()
  return `${m}/${d}/${y}`
}

const displayParse = displayDate => (displayDate ? getMonthDayYear(B3DisplayParse(displayDate).getTime() / 1000) : displayDate)

const extendsDisplayParse = extendsDisplayDate => (extendsDisplayDate ? getMonthDayYear(B3ExtendsDisplayParse(extendsDisplayDate).getTime() / 1000) : extendsDisplayDate)

export default {
  formateTimestampToLocal,
  getMonthDayYear,
  displayParse,
  extendsDisplayParse,
  getStoreZoneDate,
}

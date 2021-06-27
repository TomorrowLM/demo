import DateFormatter from './php-date-format'

const {
  extended_display_date_format,
  display_date_format,
} = window.jsContext.settings

const fmt = new DateFormatter()

const B3DisplayFormat = (date) => fmt.formatDate(date, display_date_format) || ''
const B3DisplayParse = (date) => fmt.parseDate(date, display_date_format) || ''
const B3ExtendsDisplayFormat = (date) => fmt.formatDate(date, extended_display_date_format) || ''
const B3ExtendsDisplayParse = (date) => fmt.parseDate(date, extended_display_date_format) || ''

window.DateFormatter = DateFormatter
window.B3DisplayFormat = B3DisplayFormat
window.B3ExtendsDisplayFormat = B3ExtendsDisplayFormat
window.B3DisplayParse = B3DisplayParse
window.B3ExtendsDisplayParse = B3ExtendsDisplayParse

export {
  B3DisplayFormat,
  B3ExtendsDisplayFormat,
  B3DisplayParse,
  B3ExtendsDisplayParse,
}


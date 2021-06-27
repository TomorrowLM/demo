import dayjs from 'dayjs'

export default (timeStamp) => {
  return dayjs.unix(timeStamp).format('YYYY-MM-DD HH:mm:ss')
}

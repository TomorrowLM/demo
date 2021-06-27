import urlHelper from './UrlHelper'

export const getCurrency = () => {
  const currencyId = urlHelper.searchParams.get('setCurrencyId')

  if (currencyId) {
    const currencies = window.currencyInfo?.currencies ?? []
    const matchCurrency = currencies.find(currency => currency.id === +currencyId)

    localStorage.setItem('b3_current_currency', JSON.stringify(matchCurrency))
  }

  const b3StorageCurrentCurrency = localStorage.getItem('b3_current_currency')
  const b3CurrentCurrency = b3StorageCurrentCurrency ? JSON.parse(b3StorageCurrentCurrency) : {}

  const { money } = window.jsContext.settings

  return {
    ...b3CurrentCurrency,
    thousands_token: b3CurrentCurrency?.['thousands_token'] ?? money.thousands_token,
    decimal_places: b3CurrentCurrency?.['decimal_places'] ?? money.decimal_places,
    decimal_token: b3CurrentCurrency?.['decimal_token'] ?? money.decimal_token,
    token_location: b3CurrentCurrency?.['token_location'] ?? money.currency_location,
    token: b3CurrentCurrency?.token ?? money.currency_token,
    currency_exchange_rate: b3CurrentCurrency?.['currency_exchange_rate'] ?? 1,
  }
}

/**
 * formate current by BigCommerce's default setting from page context
 * @param {object} money BigCommerce's default currency settings
 * money object example
 *    {
 *      "currency_token": "$",
 *      "currency_location": "left",
 *      "decimal_token": ".",
 *      "decimal_places": 2,
 *      "thousands_token": ","
 *    }
 */

export default function (value, useRate = true, prevMoney) {
  // default format config
  const {
    token,
    currency_exchange_rate: rate,
    token_location: currencyLocation,
    decimal_token: decimalToken,
    decimal_places: decimalPlaces,
    thousands_token: thousandsToken,
  } = getCurrency()

  // parse value to float
  let price = value
  if (useRate) price = prevMoney ? (value / prevMoney.currency_exchange_rate) * rate : value * rate

  const number = parseFloat(price)

  // need to return `Invlaid Number` is the value cannot be parse to float.
  if (Number.isNaN(number)) return 'Invalid Number'

  // deal with zero
  if (number === 0) return number.toFixed(2)

  // define negative sign
  const negativeSign = number < 0 ? '-' : ''

  /**
     * 1. get absolute value
     * 2. deal with decimal palace
     * 3. split value to left and right by '.'
     */
  const [left, right] = (Math.abs(number) || 0).toFixed(decimalPlaces).split('.')

  // get start length by left length
  const startLength = left.length > 3 ? left.length % 3 : 0

  /**
     * 1. formate left split by startLength
     * 2. add thousands token
     */
  const formatedLeft = (startLength ? left.substr(0, startLength) + thousandsToken : '')
        + left.substr(startLength).replace(/(\d{3})(?=\d)/g, `$1${thousandsToken}`)

  // result
  return negativeSign // negative sign
        + (currencyLocation === 'right' ? '' : token) // if current location is set to `right` will not show currency token
        + formatedLeft // left part
        + decimalToken // decimal token
        + right // right part
        + (currencyLocation !== 'right' ? '' : token) // if current location is set to `right` will show currency token
}

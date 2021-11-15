import stencilUtils from '@bigcommerce/stencil-utils'

export default function (productId, options) {
  return new Promise((resolve, reject) => {
    const csrfToken = window.BCData.csrf_token
    const optionsFrage = options.map(option => `${option.option_id}=${option.option_value}`).join('&')
    const serializeData = `authenticity_token=${csrfToken}&action=add&product_id=${productId}&${optionsFrage}&qty%5B%5D=1`

    stencilUtils.api.productAttributes.optionChange(productId, serializeData, (err, result) => {
      if (result) {
        resolve(result.data)
      } else {
        reject()
      }
    })
  })
}

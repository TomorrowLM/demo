import stencilUtils from '@bigcommerce/stencil-utils'
import Alert from '../../common/utils/Alert'
import * as api from '../../common/api'
import * as utils from '../../common/utils'
import {
  tips,
} from '../../common/locales'

export default function () {
  stencilUtils.hooks.on('product-option-change', e => {
    const { target } = e
    window.target = target
    const serialize = form => {
      const arr = {}
      for (let i = 0; i < form.elements.length; i += 1) {
        const file = form.elements[i]
        switch (file.type) {
          case undefined:
          case 'button':
          case 'file':
          case 'reset':
          case 'submit':
            break
          case 'checkbox':
          case 'radio':
            if (!file.checked) {
              break
            } else {
              if (arr[file.name]) {
                arr[file.name] = `${arr[file.name]},${file.value}`
              } else {
                arr[file.name] = file.value
              }
              break
            }
          default:
            if (arr[file.name]) {
              arr[file.name] = `${arr[file.name]},${file.value}`
            } else {
              arr[file.name] = file.value
            }
        }
      }
      return arr
    }
    let frage = ''
    const searchTable = target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
    const form = searchTable.querySelector('[data-option-form]')
    const productId = searchTable.querySelector('[name="product_id"]').value
    const optionChangeData = serialize(form)
    const skuConatainer = searchTable.querySelector('[data-product-sku]')
    const tr = searchTable.querySelector('tr')
    Object.keys(optionChangeData).forEach(key => {
      frage += `${encodeURIComponent(key)}=${encodeURIComponent(optionChangeData[key])}&`
    })

    stencilUtils.api.productAttributes.optionChange(productId, frage, async (err, result) => {
      if (err) {
        window.B3Spinner.hide()
        return Alert.error(err)
      }

      const { data = {} } = result
      const variantId = data.v3_variant_id
      if (!variantId) {
        const item = tr.querySelector('input[type=checkbox]')
        item.setAttribute('disabled', 'true')
        item.checked = false
        window.B3Spinner.hide()
        return false
      }

      const priceB2b = data.price.with_tax ? data.price.with_tax.formatted : data.price.without_tax.formatted
      const priceValue = data.price.with_tax ? data.price.with_tax.value : data.price.without_tax.value
      const priceContainer = document.querySelector('[product-search-result-table] .product-options .product-price')

      priceContainer.innerHTML = priceB2b
      searchTable.querySelector('[data-product-price-value]').setAttribute('data-product-price-value', priceValue)
      if (data.sku) {
        skuConatainer.innerHTML = `<b>SKU: </b>${data.sku}`
        searchTable.querySelector('[data-product-base-sku]').setAttribute('data-product-base-sku', data.sku)
      }
      // page right option change

      if (variantId) {
        tr.setAttribute('data-variant-id', variantId)

        const products = [{
          productId,
          variantId,
        }]
        const { list } = await api.getInventory({ products })
        if (list.purchasingDisabled) {
          utils.Alert.error(tips.buyAgainFailedNoLongerForSale)
        }
      }

      tr.querySelector('input[type=checkbox]').removeAttribute('disabled')
      window.B3Spinner.hide()
      return true
    })
  })
}

import utils from '@bigcommerce/stencil-utils'
import Alert from './Alert'

export default function () {
  utils.hooks.on('product-option-change', e => {
    window.B3Spinner.show()
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

    const getParent = (el, {
      nodeName,
      className,
    }) => {
      const { parentNode } = el
      const isNodeNameMatch = nodeName ? parentNode.nodeName === nodeName : true
      const isClassNameMatch = className ? parentNode.classList.contains(className) : true
      if (!parentNode) return false
      if (isNodeNameMatch && isClassNameMatch) return parentNode
      return getParent(parentNode, { nodeName, className })
    }

    let frag = ''

    const form = getParent(e.target, { nodeName: 'FORM', className: 'option-form' })
    const productId = form.querySelector('[name="product_id"]').value
    const optionChangeData = serialize(form)
    const tr = getParent(form, { nodeName: 'TR' })
    const skuContainer = tr.querySelector('[data-product-sku]')

    Object.keys(optionChangeData).forEach(key => {
      frag += `${encodeURIComponent(key)}=${encodeURIComponent(optionChangeData[key])}&`
    })

    utils.api.productAttributes.optionChange(productId, frag, (err, result) => {
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
      tr.querySelector('[data-product-price-value]').setAttribute('data-product-price-value', priceValue)
      if (data.sku) {
        skuContainer.innerHTML = `<b>SKU: </b>${data.sku}`
        tr.setAttribute('data-product-base-sku', data.sku)
      }
      // page right option change

      if (variantId) {
        tr.setAttribute('data-variant-id', variantId)
      }

      tr.querySelector('input[type=checkbox]').removeAttribute('disabled')
      window.B3Spinner.hide()
      return true
    })
  })
}

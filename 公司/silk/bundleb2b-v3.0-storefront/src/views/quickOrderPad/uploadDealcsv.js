import BasePage from '../../common/BasePage'
import quickOrderCsvTable from './quickOrderCsvTable.html'
import quickOrderPadCSVRow from './quickOrderPadCSVRow.html'

class UploadDealcsv extends BasePage {
  get checkLodingHtml() {
    return '<p class="checking-tips">Checking file...</p>'
  }

  async validation(content) {
    const $filesInput = document.querySelector('#customer_sku_csv')
    const $csvCheckInfoContainer = document.querySelector('#csv_check_info')
    const checkInformationSerlector = '#csv_check_info .checking-tips'
    $csvCheckInfoContainer.innerHTML = this.checkLodingHtml
    const parsedata = []
    let originArr = []
    let errorCounter = 0
    let columns = 0

    if (content) {
      originArr = content.split('\n')
    }

    const unEmptyArr = this.removeEmptyRow(originArr)

    if (unEmptyArr && unEmptyArr.length > 0) {
      const headerRow = unEmptyArr[0]
      const headerArr = headerRow.split(',')

      this.removeEmptyRow(headerArr)
      columns = headerArr.length
    } else {
      $csvCheckInfoContainer.innerHTML = `<div class="checking-info-box">${this.locales.validation.emptyFiles}</div>`
    }

    for (let i = 1; i < unEmptyArr.length; i += 1) {
      const productIdsArr = ''
      const dataItem = unEmptyArr[i].split(',')

      if (dataItem.length > 1) {
        this.removeEmptyRow(dataItem)
        let errorInfo = ''

        if (dataItem.length > columns) {
          errorInfo += 'redundant data; '
        } else {
          dataItem.length = columns
        }
        if (!dataItem[0]) {
          errorInfo += 'variant_sku can\'t be empty; '
        }
        if (!(dataItem[1]).replace(/[\r\n]/g, '')) {
          errorInfo += 'qty can\'t be empty; '
        }
        if (/\./.test(dataItem[1]) || /\\-/.test(dataItem[1])) {
          errorInfo += 'qty must be an integer; '
        }

        if ((dataItem[1]).replace(/[\r\n]/g, '') === '0') {
          errorInfo += '0 qty will be ignored;'
          this.insertMessage('#csv_check_info', `<div>#ROW ${i + 1}: ${errorInfo}</div>`)
        } else if (errorInfo.trim() !== '') {
          errorCounter += 1
          this.insertMessage('#csv_check_info', `<div>#ROW ${i + 1}: ${errorInfo}</div>`)
        }
        const productDataArr = productIdsArr.concat(dataItem)
        parsedata.push(productDataArr)
      }
    }

    if (errorCounter === 0) {
      // advQty check
      const csvdataArr = parsedata.map(item => ({
        sku: item.split(',')[0],
        qty: Number.parseInt(item.split(',')[1], 10),
      }))

      const keywords = []
      parsedata.forEach(item => {
        keywords.push(item.split(',')[0])
      })

      const variantSku = []
      const newData = []
      csvdataArr.forEach(item => {
        variantSku.push((item.sku).toUpperCase())
      })

      const variantSkus = Array.from(new Set(variantSku))
      const products = await this.getProductsBySkuQuickByPost(variantSkus)

      const { isEnabled } = await this.api.getAdvQtyState()
      csvdataArr.forEach(cItem => {
        const hasSku = products.some(dataItem => (cItem.sku).toUpperCase() === (dataItem.variantSku).toUpperCase())
        if (hasSku) {
          const item = products.find(i => (cItem.sku).toUpperCase() === (i.variantSku).toUpperCase())
          if (item.isStock === '0' || (item.isStock === '1' && item.stock !== 0 && cItem.qty <= item.stock)) {
            newData.push([
              item.productId,
              item.variantId,
              item.variantSku,
              cItem.qty,
              item.option ? JSON.stringify(item.option) : '',
            ])
          } else {
            this.insertMessage('#csv_err_message', `<div>${cItem.sku} is out of stock</div>`)
            $filesInput.value = ''
          }
        } else {
          this.insertMessage('#csv_err_message', `<div>${cItem.sku} is not a valid SKU</div>`)
          $filesInput.value = ''
        }
      })

      if (newData.length > 0) {
        if (isEnabled === '1') {
          const qtyProducts = await this.getAdvQtyBySkusNew(variantSkus)
          const data = qtyProducts.productQuantityList
          const csvNewData = []

          newData.forEach(newDataItem => {
            const newDataSku = newDataItem[2]
            const newDataQty = newDataItem[3]
            const respItem = data.find(dataItem => dataItem.variantSku === newDataSku)
            const reQty = /^(0|\+?[1-9][0-9]*)$/

            if (reQty.test(newDataQty)) {
              if (respItem) {
                const minQty = respItem.minOrderQty
                if (newDataQty >= minQty) {
                  csvNewData.push(newDataItem)
                } else {
                  this.insertMessage('#csv_err_message', `The quantity for ${newDataSku} is not valid`)
                  $filesInput.value = ''
                }
              } else {
                csvNewData.push(newDataItem)
              }
            } else {
              this.insertMessage('#csv_err_message', `The quantity for ${newDataSku} is not valid</div>`)
              $filesInput.value = ''
            }
          })

          if (csvNewData.length > 0) {
            this.displayCsvProducts(csvNewData)
          }
        } else {
          this.displayCsvProducts(newData)
        }
      }
    } else {
      $filesInput.value = ''
    }
    if (document.querySelector(checkInformationSerlector)) document.querySelector(checkInformationSerlector).remove()
  }

  insertMessage(selector, text) {
    const el = document.createElement('div')
    el.innerHTML = text
    document.querySelector(selector).append(el)
  }

  getAdvQtyBySkusNew(variantSkus) {
    return this.api.getAdvQtyBySkusNew({ variantSkus })
  }

  displayCsvProducts(products) {
    document.querySelector('#add_to_cart_csv').setAttribute('disabled', true)
    const $csvCheckInfoContainer = document.querySelector('#csv_check_info')
    $csvCheckInfoContainer.innerHTML = 'Loading products...'

    this.utils.renderTemplate({
      hbsTemplate: quickOrderCsvTable,
      containerSelector: '#csv_products_list',
      insertType: 'beforeend',
    })

    products.forEach((item, idx) => {
      const configData = {
        vrarintId: item[1],
        productId: item[0],
        options: item[4] ? item[4] : '',
        productSku: item[2],
        qty: item[3],
        idx,
      }

      this.utils.renderTemplate({
        hbsTemplate: quickOrderPadCSVRow,
        containerSelector: '#quick_order_pad_table_csv tbody',
        templateConfig: configData,
        insertType: 'beforeend',
      })
    })

    document.querySelector('#add_to_cart_csv').removeAttribute('disabled')
    $csvCheckInfoContainer.innerHTML = ''
  }

  getProductsBySkuQuickByPost(variantSkus) {
    return this.api.getProductsBySkuQuickByPost({ variantSkus })
  }

  removeEmptyRow(arr) {
    const tmpArr = arr
    if (this.isEmptyRow(tmpArr[tmpArr.length - 1])) {
      tmpArr.pop()
      return this.removeEmptyRow(tmpArr)
    }
    return tmpArr
  }

  isEmptyRow(arr) {
    const tmpArr = arr.split(',')
    for (let k = 0; k < tmpArr.length; k += 1) {
      if (tmpArr[k]) {
        return false
      }
    }
    return true
  }
}
export default new UploadDealcsv()

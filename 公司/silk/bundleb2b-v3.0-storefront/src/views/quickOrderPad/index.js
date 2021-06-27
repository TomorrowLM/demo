import utils from '@bigcommerce/stencil-utils'
import BasePage from '../../common/BasePage'
import {
  B3CompanyStatus,
} from '../../common/utils/constants'
import quickOrderPad from './quickOrderPad.html'
import { leftIncludes } from '../../common/utils/util'
import row from './row.html'
import parseCsv from './uploadDealcsv'
import triggerCartNumber from '../../common/api/triggerCartNumber'
import trim from '../../common/utils/trim'

export default class QuickOrderPad extends BasePage {
  constructor() {
    super()
    this.name = 'QuickOrderPad'
    this.state = {
      drapSelector: 'drag_upload_csv',
      upLoadFileSelector: 'file_name',
      uploadSelectors: ['csv_check_info', 'csv_products_list', 'customer_sku_csv', 'file_name', 'csv_err_message'],
      addNewRowSelector: '#add_new_row',
      addTocartCsvSelector: 'add_to_cart_csv',
      addToCartSelector: '#add_to_cart',
      successNumber: 0,
    }
  }

  get isInpage() {
    return leftIncludes(window.location.pathname, this.doms.quickOrderPad.url)
  }

  async init() {
    const {
      B3RoleId,
      B3CompanyStatus: B3CompanyStatu,
    } = this.utils.B3Storage

    if (!this.isB2BUser) return

    if (!this.isInpage) return

    if ((!B3RoleId.value || B3CompanyStatu.value !== B3CompanyStatus.APPROVED) && this.isInpage) {
      this.utils.Alert.error(this.locales.tips.cannotEnrtyPage)
      this.utils.urlHelper.redirect('/')
    }

    window.B3Spinner.show()

    this.render()
    this.handleEvents()
    this.dragToUploadCsv()
    window.B3Spinner.hide()
  }

  handleEvents() {
    document.querySelector('body').addEventListener('click', e => {
      if (e.target.hasAttribute('data-remove-cell')) {
        e.target.parentNode.parentNode.remove()
      }

      if (e.target.id === this.state.addTocartCsvSelector) {
        const productsData = this.getCSVProductsData()
        if (!productsData) return
        document.querySelector('#csv_err_message').innerHTML = ''
        this.addQuickOrderToCart(productsData)
      }
    })

    document.querySelector('body').addEventListener('change', e => {
      const item = e.target.parentNode.parentNode.parentNode
      const itemTr = e.target.parentNode.parentNode
      const Arry = [item, itemTr]

      Arry.forEach(el => {
        if (el.classList.contains('err-data')) {
          el.className = ''
          el.querySelector('.th-col-message').innerHTML = ''
        }
      })
    })

    document.querySelector(`${this.state.addNewRowSelector}`).addEventListener('click', () => {
      this.utils.renderTemplate({
        hbsTemplate: row,
        containerSelector: '#quick_order_pad_table',
        insertType: 'beforeend',
      })
    })

    document.querySelector(this.state.addToCartSelector).addEventListener('click', async e => {
      e.preventDefault()
      const $table = document.querySelector('#quick_order_pad_table')
      const skus = $table.querySelectorAll('[data-sku]')
      const variantSkus = this.getProductsData(skus)

      if (!variantSkus) return window.B3Spinner.hide()

      window.B3Spinner.show()
      const products = await this.api.getProductsBySkuQuickByPost({ variantSkus })
      const { isEnabled } = await this.api.getAdvQtyState()

      this.fiterProductsBysku(products, skus)

      if (isEnabled === '1') {
        const qtyProcuts = await this.api.getAdvQtyBySkusNew({ variantSkus })
        this.filterQty(qtyProcuts.productQuantityList, skus, products)
      } else {
        this.filterQty([], skus, products)
      }

      const elements = document.querySelectorAll('#quick_order_pad_table tbody tr:not(.err-qty):not(.err-data):not(.err-sku)')
      if (elements.length === 0) return window.B3Spinner.hide()
      this.addToCartCotent(elements)

      return window.B3Spinner.hide()
    })

    document.querySelector('#drag_upload_csv').addEventListener('click', () => {
      document.querySelector('#customer_sku_csv').click()
    })

    document.querySelector('#customer_sku_csv').addEventListener('change', e => {
      const that = e.target
      if (that.files && that.files[0]) {
        const uploadFile = that.files[0]

        this.createNewReader(uploadFile)
      }
    })
  }

  addToCartCotent(elements) {
    if (elements.length === 0) {
      return
    }
    const itemArr = []

    elements.forEach(item => {
      const productObj = {}
      productObj.elementId = item.getAttribute('data-element-id')
      productObj.productId = item.getAttribute('data-product-id')
      productObj.quantity = item.querySelector('[data-qty]').value
      const optionList = JSON.parse(item.getAttribute('data-product-options') || '[]')

      if (optionList.length > 0) {
        productObj.optionList = optionList
      }

      if (productObj.elementId && productObj.productId && productObj.quantity) {
        itemArr.push(productObj)
      }
    })
    this.initAddData()
    if (itemArr.length === 0) return
    this.addQuickOrderToCart(itemArr, true)
  }

  initAddData = () => {
    this.state.successNumber = 0
    document.querySelector('.result-message').innerHTML = ''
  }

  filterQty(data, skus, products) {
    skus.forEach(item => {
      const value = trim(item.value.toUpperCase())
      const qtyItem = data.find(v => trim(v.variantSku).toUpperCase() === value)
      const $inputQty = item.parentNode.parentNode.parentNode.querySelector('[data-qty]')
      const inputQtyValue = parseInt($inputQty.value, 10)
      if (value) {
        if (!inputQtyValue || !(/(^[1-9]\d*$)/.test($inputQty.value))) {
          this.addErro(item, 'Invalid Quantity', 'err-qty err-data')
        }
        if (qtyItem) {
          const minQty = parseInt(qtyItem.minOrderQty, 10)
          if (minQty > inputQtyValue || !inputQtyValue) {
            this.addErro(item, `Min Quantity ${minQty}`, 'err-qty err-data')
          }
        }
      }
      const itemSku = item.parentNode.parentNode.parentNode.querySelector('.col-sku [data-sku]').value
      const product = products.find(v => trim(v.variantSku).toUpperCase() === itemSku.toUpperCase())
      if (product && product.isStock === '1' && product.stock === 0) {
        this.addErro(item, 'Out of stock', 'err-qty err-data')
      }
    })
  }

  addErro(item, message, styleClass) {
    if (!item.classList.contains('err-data')) {
      item.parentNode.parentNode.parentNode.className += ` ${styleClass}`
    }
    item.parentNode.parentNode.parentNode.querySelector('.th-col-message').innerHTML = message
  }

  fiterProductsBysku(data, skus) {
    skus.forEach((item, index) => {
      const value = trim(item.value.toUpperCase())
      if (!(data.some(items => trim(items.variantSku.toUpperCase()) === value)) && value) {
        this.addErro(item, 'Invalid Sku', 'err-sku err-data')
      } else if (data.some(items => trim(items.variantSku.toUpperCase()) === value)) {
        const itemData = data.filter(v => trim(v.variantSku.toUpperCase()) === value)[0]
        const $tr = item.parentNode.parentNode.parentNode
        $tr.setAttribute('data-product-id', itemData.productId)
        $tr.setAttribute('data-element-id', `${itemData.productId}-${index}`)
        $tr.setAttribute('data-product-options', JSON.stringify(itemData.option))
      } else if (!value) {
        this.addErro(item, '', 'err-data')
      }
    })
  }

  addQuickOrderToCart(itemArr, _default) {
    window.B3Spinner.show()

    const item = itemArr[itemArr.length - 1]
    const formData = new FormData()

    let optionList

    if (_default) {
      optionList = item.optionList ? item.optionList : []
    } else {
      optionList = item.optionList ? item.optionList[0] : []
    }

    formData.append('action', 'add')
    formData.append('product_id', item.productId)
    formData.append('qty[]', item.quantity)

    for (let i = 0; i < optionList.length; i += 1) {
      if (_default) {
        formData.append(`attribute[${optionList[i].option_id}]`, optionList[i].id)
      } else {
        formData.append(`attribute[${optionList[i].option_id}]`, optionList[i].option_value)
      }
    }

    utils.api.cart.itemAdd(formData, (err, response) => {
      if (err || response?.data?.error) {
        window.B3Spinner.hide()
        if (_default) {
          document.querySelector(`[data-element-id='${item.elementId}'] .th-col-message`).innerHTML = 'Out of Stock'
        } else {
          document.querySelector('#csv_err_message').append(`${item.sku || item.variantSku} error `)
        }
      } else {
        this.state.successNumber += 1
        if (_default) document.querySelector(`[data-element-id='${item.elementId}']`).remove()
      }

      itemArr.pop()
      if (itemArr.length > 0) {
        if (_default) {
          this.addQuickOrderToCart(itemArr, true)
        } else {
          this.addQuickOrderToCart(itemArr)
        }
      } else {
        if (this.state.successNumber === 0) return
        triggerCartNumber()
        this.utils.Alert.success(this.locales.tips.addProductsSucess)
        window.B3Spinner.hide()
        if (_default) {
          document.querySelector('.result-message').innerHTML = `${this.state.successNumber} Line Items has been added to cart`
        }
      }
    })
  }

  getProductsData(skus) {
    const skuArry = []
    document.querySelector('.result-message').innerHTML = ''

    skus.forEach((item, index) => {
      const value = trim(item.value)
      if (value) {
        item.setAttribute('data-id', `${value}-${index}`)
        skuArry.push(value.toUpperCase())
      }
    })
    const variantSkus = Array.from(new Set(skuArry))
    return variantSkus
  }

  getCSVProductsData() {
    const items = document.querySelectorAll('#quick_order_pad_table_csv tbody tr')
    const data = []
    if (items.length === 0) return ''
    items.forEach(item => {
      const op = JSON.parse(item.getAttribute('data-product-options'))
      const options = []
      options.push((op).map(data => ({ option_id: data.option_id, option_value: data.id })))
      data.push({
        productId: item.getAttribute('data-product-id'),
        variantId: item.getAttribute('data-variant-id'),
        variantSku: item.getAttribute('data-product-sku'),
        quantity: item.getAttribute('data-qty'),
        optionList: options,
      })
    })
    return data
  }

  render() {
    const {
      quickOrderPad: {
        container,
      },
    } = this.doms

    const b2bWraper = document.querySelector('.page-conten')
    if (b2bWraper) b2bWraper.remove()

    this.utils.renderTemplate({
      hbsTemplate: quickOrderPad,
      containerSelector: container,
      templateConfig: {
        ...this.state,
      },
      insertType: 'beforeend',
    })
  }

  dragToUploadCsv() {
    const dragArea = document.getElementById(this.state.drapSelector)
    dragArea.ondragenter = e => {
      const { target } = e
      e.preventDefault()
      target.style.borderColor = '#000'
    }

    dragArea.ondragover = e => {
      const { target } = e
      e.preventDefault()
      target.style.borderColor = '#000'
    }

    dragArea.ondragleave = e => {
      const { target } = e
      e.preventDefault()
      target.style.borderColor = 'transparent'
    }

    dragArea.ondrop = e => {
      const { target } = e
      e.preventDefault()
      target.style.borderColor = 'transparent'
      const uploadFile = e.dataTransfer.files[0]

      this.createNewReader(uploadFile)
    }
  }

  resetCsvFileUpload() {
    this.state.uploadSelectors.forEach(item => {
      document.getElementById(item).innerHTML = ''
    })
  }

  createNewReader(uploadFile) {
    // chech file extension
    const reg = new RegExp('[.](csv)$')
    if (!reg.test(uploadFile.name)) {
      document.querySelector('#csv_check_info  .checking-tips').remove()
      return this.utils.Alert.error(this.locales.validation.uploadNotCsv)
    }

    const reader = new FileReader()
    reader.addEventListener('load', b => {
      this.resetCsvFileUpload()
      document.getElementById(this.state.upLoadFileSelector).innerHTML = uploadFile.name
      const csvdata = b.target.result
      parseCsv.validation(csvdata)
    })

    return reader.readAsBinaryString(uploadFile)
  }
}

import stencilUtils from '@bigcommerce/stencil-utils'
import BasePage from '../../common/BasePage'
import bottomCartTemplate from './bottomCart.html'
import shoppingListTemplate from './shoppingList.html'
import tbodyTemplate from './tbody.html'
import {
  B3Role,
  B3ShoppListStatus,
} from '../../common/utils/constants'
import {
  tips,
  validation,
} from '../../common/locales'
import getPrice from '../../common/api/getPrice'
import searchResultContainerTemplate from './searchResultContainer.html'
import searchResultItemTemplate from './searchResultItem.html'
import editOptionsModalTemplate from './editOptionsModal.html'
import skuSearchResultTemplate from './skuSearchResult.html'
import addProducts from '../../common/api/addProducts'
import clearCart from '../../common/api/clearCart'
import renameModalTemplate from './renameModal.html'

import setRectangle from '../createQuote/options/set-rectangle.html'
import swatch from '../createQuote/options/swatch.html'
import date from '../createQuote/options/date.html'
import inputCheckbox from '../createQuote/options/input-checkbox.html'
import inputFile from '../createQuote/options/input-file.html'
import inputNumbers from '../createQuote/options/input-numbers.html'
import inputText from '../createQuote/options/input-text.html'
import productList from '../createQuote/options/product-list.html'
import textarea from '../createQuote/options/textarea.html'
import setSelect from '../createQuote/options/set-select.html'
import setRadio from '../createQuote/options/set-radio.html'
import listenOptionChange from './listenOptionChange'
import getCorrectProductImage from '../../common/utils/getCorrectProductImage'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class ShoppingList extends BasePage {
  constructor() {
    super()
    this.name = 'ShoppingList'
    this.state = {
      cart: {},
      statusSelectOptions: [],
      statusTitle: [],
      products: [],
      pagination: {
        offset: 0,
        limit: 100,
        totalCount: 0,
      },
      customerInfo: {
        firstName: '',
        lastName: '',
      },
      description: '',
      isOwner: '',
      name: '',
      status: '',
      gTierPrice: {},
      isAppendStyle: false,
      shopingListItemId: '',
      editOptionsModal: new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      }),
      renameModal: new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      }),
      baseGrangTotal: '',
    }

    this.searchResultContainerTemplate = searchResultContainerTemplate
    this.searchResultItemTemplate = searchResultItemTemplate
  }

  get isShowEdit() {
    const {
      isOwner,
      status,
    } = this.state
    const {
      B3RoleId,
    } = this.utils.B3Storage
    return (
      !(
        B3RoleId.value === B3Role.SALESREP
        && isOwner !== '1'
      )
      && +status !== 40
    )
  }

  get isShowUpdateStatus() {
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      status,
    } = this.state

    const {
      ADMIN,
      SENIOR,
      SALESREP,
    } = B3Role

    const roleId = B3RoleId.value

    return (
      (
        [ADMIN, SENIOR].includes(roleId)
          || (roleId === SALESREP && B3CompanyId.value)
      )
        && +status === 40
    )
  }

  get optionTemplateMap() {
    return {
      'set-rectangle': setRectangle,
      swatch,
      date,
      'input-checkbox': inputCheckbox,
      'input-file': inputFile,
      'input-numbers': inputNumbers,
      'input-text': inputText,
      'product-list': productList,
      'set-radio': setRadio,
      'set-select': setSelect,
      textarea,
    }
  }

  get isShowSelectAll() {
    const {
      B3RoleId,
    } = this.utils.B3Storage
    const {
      status,
    } = this.state

    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role

    const roleId = B3RoleId.value

    return (
      (roleId === JUNIOR
        && +status === 30)
      || ([ADMIN, SENIOR].includes(roleId)
        && +status !== 40)
      || (roleId === SALESREP && +status !== 40)
    )
  }

  get isShowAddToCart() {
    const {
      status,
    } = this.state
    const {
      B3RoleId,
    } = this.utils.B3Storage

    const roleId = B3RoleId.value

    const {
      JUNIOR,
    } = B3Role

    return (
      roleId !== JUNIOR
      && +status !== 40
    )
  }

  get isShowAddToList() {
    const {
      status,
    } = this.state

    return +status !== 40
  }

  get isShowSubmitToApproval() {
    const {
      status,
    } = this.state
    const {
      B3RoleId,
    } = this.utils.B3Storage

    const roleId = B3RoleId.value
    const {
      JUNIOR,
    } = B3Role

    return (
      roleId === JUNIOR
      && +status === 30
    )
  }

  async init() {
    const {
      urlHelper,
      Alert,
    } = this.utils

    if (!this.isB2BUser) return

    const shoppingListId = urlHelper.searchParams.get('list_id')
    if (!shoppingListId) {
      await Alert.error(tips.shoppingListExist)
      urlHelper.redirect('/shopping-lists/')
    }

    this.setState({
      shoppingListId,
    })

    await this.getShoppingListExtension()
    this.renderBottomCart()
    // this.setStatusSelector()
    this.getStatus()
    this.render()
    themeStyleFix.editModalBoxStyleFix()
  }

  renderBottomCart() {
    const options = {
      template: {
        content: 'b3/b3json',
        totals: 'cart/totals',
        pageTitle: 'cart/page-title',
        statusMessages: 'cart/status-messages',
      },
    }

    window.B3Spinner.show()
    stencilUtils.api.cart.getContent(options, (err, response) => {
      if (err) {
        window.B3Spinner.hide()
        return
      }

      const {
        cart,
      } = JSON.parse(response.content) || {}

      this.setState({
        cart,
      })

      const $bottomCart = document.querySelector('.bottom-cart-container')
      if ($bottomCart) $bottomCart.remove()

      this.utils.renderTemplate({
        hbsTemplate: bottomCartTemplate,
        containerSelector: 'footer',
        templateConfig: {
          cart,
          isShowAddToCart: this.isShowAddToCart,
        },
        insertType: 'beforeend',
      })

      window.B3Spinner.hide()

      this.bindCartEvents()
    })
  }

  async getShoppingListExtension() {
    const {
      shoppingListId: id,
      pagination: {
        offset,
        limit,
      },
    } = this.state

    window.B3Spinner.show()
    try {
      const resp = await this.api.getShoppingListItemsExtension({
        id,
        offset,
        limit,
      })

      const {
        createdAt,
        updatedAt,
        description,
        products,
        grandTotal,
      } = resp
      const {
        currencyFormat,
      } = this.utils

      const timeConvert = timestamp => new Date(parseInt(timestamp, 10)).toLocaleDateString().replace(/\//g, '/')

      const createdAtTime = createdAt ? timeConvert(createdAt) : ''
      const updatedAtTime = updatedAt ? timeConvert(updatedAt) : ''
      const formatGrandTotal = currencyFormat(parseFloat(grandTotal).toFixed(2))

      this.setState({
        ...resp,
        createdAtTime,
        updatedAtTime,
        description: description.trim(),
        products: products.map(product => ({
          ...product,
          checked: '',
        })),
        baseGrangTotal: formatGrandTotal,
      })
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  render() {
    const {
      state,
      doms: {
        shoppinglist: {
          container,
        },
      },
      utils: {
        renderTemplate,
      },
      isShowEdit,
      isShowUpdateStatus,
      isShowSelectAll,
      isShowAddToList,
      isShowSubmitToApproval,
    } = this

    const $b2bWrap = document.querySelector('.b2b-wrap')
    if ($b2bWrap) $b2bWrap.remove()

    renderTemplate({
      hbsTemplate: shoppingListTemplate,
      containerSelector: container,
      templateConfig: {
        ...state,
        isShowEdit,
        isShowUpdateStatus,
        isShowSelectAll,
        isShowAddToList,
        isShowSubmitToApproval,
      },
      insertType: 'beforeend',
    })

    this.renderShoppingList()

    this.bindEvents()
    listenOptionChange()
  }

  setStatusSelector() {
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      status,
    } = this.state
    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role

    const roleId = B3RoleId.value

    let options = []
    const getStatusSelecttOptions = (keys = [], selectedKey) => keys.reduce((result, key) => {
      result.push({
        value: key,
        title: B3ShoppListStatus[key],
        selected: +key === +selectedKey ? 'selected' : '',
      })
      return result
    }, [])

    if (roleId === JUNIOR && +status === 30) {
      options = getStatusSelecttOptions([status, 40], 30)
    } else if (
      +status === 40
        && (
          [ADMIN, SENIOR].includes(roleId)
          || (roleId === SALESREP && B3CompanyId.value)
        )
    ) {
      options = getStatusSelecttOptions([status, 0, 30], status)
    } else options = getStatusSelecttOptions([status])

    this.setState({
      statusSelectOptions: options,
    })
  }

  getStatus() {
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      status,
    } = this.state
    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role
    const roleId = B3RoleId.value
    let options = []
    const getStatusTitle = (keys = [], title) => keys.reduce((result, key) => {
      result.push({
        value: key,
        title: title || B3ShoppListStatus[key],
      })
      return result
    }, [])
    if (roleId === JUNIOR && +status === 30) {
      options = getStatusTitle([status])
    } else if (+status === 0
        && (
          [ADMIN, SENIOR].includes(roleId)
            || (roleId === SALESREP && B3CompanyId.value)
        )
    ) {
      options = getStatusTitle([status], 'Approved')
    } else options = getStatusTitle([status])

    this.setState({
      statusTitle: options,
    })
  }

  afterRender() {
    const {
      B3RoleId,
    } = this.utils.B3Storage
    const {
      status,
      renameModal,
    } = this.state
    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role
    const roleId = B3RoleId.value

    const $updates = document.querySelectorAll('[update-list-items')
    const $deleteAll = document.querySelector('[data-delete-items]')
    const $rightLayout = document.querySelector('.b2b-column-right')

    if (
      (roleId === JUNIOR && +status !== 30)
      || ([ADMIN, SENIOR].includes(roleId) && +status === 40)
      || (roleId === SALESREP && +status === 40)
    ) {
      $deleteAll.remove()
      $updates.forEach($update => $update.remove)
      $rightLayout.style.width = '100%'
    }

    this.hideReadyApprovalBtn()

    const $quickAdd = document.querySelector('#quick_add_section')
    const $rename = document.querySelector('[data-rename-list]')

    if (
      ([ADMIN, SENIOR, SALESREP].includes(roleId) && +status === 40)
      || (roleId === JUNIOR && +status !== 30)
    ) {
      if ($quickAdd) $quickAdd.remove()
      if ($rename) $rename.remove()
    }

    if ($rename) {
      $rename.addEventListener('click', () => {
        renameModal.open()

        const renameModalContent = renameModalTemplate(this.state)

        renameModal.setContent(renameModalContent)
        this.bindRename()
      })
    }
  }

  hideReadyApprovalBtn() {
    const {
      isAppendStyle,
      status,
    } = this.state

    const frageStyle = `
        <style>
        [update-list-items],.action-lists{
            display:none!important;
        }
        .col-checkbox{
            opacity:0;
        }
        </style>
    `

    if (+status === 40 && !isAppendStyle) {
      this.utils.renderTemplate({
        template: frageStyle,
        containerSelector: 'head',
      })
      this.setState({
        isAppendStyle: true,
      })
    }
  }

  renderShoppingList() {
    const {
      products,
      status,
    } = this.state
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      JUNIOR,
      ADMIN,
      SENIOR,
      SALESREP,
    } = B3Role
    const roleId = B3RoleId.value

    const isShowAction = (
      (
        [ADMIN, SENIOR].includes(roleId)
        || (roleId === SALESREP && B3CompanyId.value)
      )
      && +status === 0
    ) || (roleId === JUNIOR && +status === 30)
    const inputDisabled = isShowAction ? '' : 'disabled'

    const productIds = []

    const list = products.map((product, idx) => {
      const {
        optionsList,
        variantSku,
        baseSku,
        basePrice,
        productId,
        qty,
      } = product

      const productImage = product?.primaryImage?.urlThumbnail ?? ''
      const productSku = variantSku ?? baseSku
      const productPrice = parseFloat(basePrice).toFixed(2)
      const options = JSON.stringify(optionsList)

      productIds.push({
        productId,
        idx,
        options,
        qty,
        optionsList,
      })

      return {
        ...product,
        productImage,
        productSku,
        productPrice,
        idx,
        options,
        isShowAction,
        inputDisabled,
      }
    })

    document.querySelector('#shopping_list_table tbody').innerHTML = tbodyTemplate({
      list,
    })

    this.utils.on('#shopping_list_table tbody tr', 'input', 'qty', () => {
      // if (target.classList.contains('disabled')) return
    })

    this.renderProductDetail(productIds)
    this.setPrices(productIds, '#shopping_list_table [data-variant-id]', true)

    this.afterRender()
    this.renderPaginator()
    this.bindUpdateItem()
    this.bindDeleteItem()
    this.bindEditOptions()
    this.bindCheckBox()
  }

  renderProductDetail(productIds) {
    const {
      status,
    } = this.state
    const {
      B3RoleId,
    } = this.utils.B3Storage

    productIds.forEach(({
      productId,
      qty,
      optionsList,
      idx,
    }) => {
      stencilUtils.api.product.getById(productId, {
        template: 'b3/b3json',
      }, (err, response) => {
        if (err) return
        const {
          product,
        } = JSON.parse(response)

        const $product = document.querySelector(`[data-product-${productId}]`)
        const $tr = document.querySelector(`[data-index-${idx}]`)
        const $price = $tr.querySelector('.product-price')

        const {
          url: productUrl,
          options,
        } = product

        $product.querySelectorAll('[product-url]').forEach(a => {
          a.href = productUrl
        })

        let optionHtml = ''
        const pickListArr = []
        const productIds = []

        if (!options.length) return
        options.forEach(option => {
          const {
            id,
            required,
            partial,
            display_name: displayName,
            values,
          } = option

          let optionExist = false

          optionsList.forEach(({
            option_id: optionId,
            option_value: optionValue,
          }) => {
            const attrId = `attribute[${id}]`
            if (attrId === optionId) {
              optionExist = true

              if (partial === 'input-text') {
                optionHtml += `<span class="option-name">${displayName}:</span> ${optionValue} </br>`
              } else if (partial === 'input-checkbox') {
                optionHtml += `<span class="option-name">${displayName}:</span> Yes </br>`
              } else if (values) {
                values.forEach(value => {
                  if (value.id === optionValue) {
                    optionHtml += `<span class="option-name">${displayName}:</span> ${value.label} </br>`
                    // pick list option
                    if (partial === 'product-list') {
                      const pickedProductId = value.data
                      pickListArr.push({
                        pickedOptionId: id,
                        pickedOptionValue: value.id,
                        pickedProductId,
                      })
                      productIds.push(pickedProductId)
                    }
                  }
                })
              }
            }
          })

          if (required && !optionExist) {
            optionHtml += `<span class="option-name">${displayName}:</span> <i class="no-option-value-tip" no-option-value>Click 'Edit Options' to set a value for this option.</i> </br>`
          }
        })

        if (productIds && productIds.length > 0) {
          this.getTierPriceByProductIdMulti(productIds, qty, () => {
            this.getVariantOptions($tr, $price, pickListArr, optionsList)
          })
        }

        $tr.querySelector('.product-options').innerHTML = optionHtml

        if (
          (+status !== 40 && B3RoleId.value !== B3Role.JUNIOR)
          || (+status === 30 && B3RoleId.value === B3Role.JUNIOR)
        ) {
          $tr.querySelector('.action-lists .list-button-remove').insertAdjacentHTML('beforebegin', `<a class="button button--primary button--small edit-option ${this.classes['shoppinglist.right.button.editOption']}" href="#"><i class="fa fa-edit edit-option ${this.classes['shoppinglist.right.button.editOption.icon']}"></i>${this.text['shopping.list.button.editOptions']}</a>`)
        }
      })
    })
  }

  getTierPriceByProductIdMulti(productIds, qty, cb) {
    const {
      gTierPrice,
    } = this.state

    const productId = productIds[productIds.length - 1]

    if (gTierPrice[productId]) {
      productIds.pop()
      if (productIds.length === 0) {
        if (cb) {
          cb()
        }
      } else {
        this.getTierPriceByProductIdMulti(productIds, qty, cb)
      }
    } else {
      stencilUtils.api.product.getById(productId, {
        template: 'b3/b3json',
      }, (err, response) => {
        if (err) return
        const {
          product,
        } = JSON.parse(response)
        const priceContainer = product.price.without_tax || product.price.with_tax
        const basePrice = priceContainer.formatted

        this.state({
          gTierPrice: {
            ...gTierPrice,
            [productId]: basePrice,
          },
        })

        productIds.pop()
        if (productIds.length === 0) {
          if (cb) {
            cb()
          }
        } else {
          this.getTierPriceByProductIdMulti(productIds, qty, cb)
        }
      })
    }
  }

  getVariantOptions($tr, $priceSpan, pickListArr, options) {
    const {
      currencyFormat,
    } = this.utils

    const gMasterPrcie = $priceSpan.dataset.mainPrice

    let productPrice = parseFloat(gMasterPrcie).toFixed(2)
    if (options) {
      pickListArr.forEach(({
        pickedOptionId,
        pickedOptionValue,
        pickedProductId,
      }) => {
        let showCustomPrice = true

        options.forEach(({
          option_id: optionId,
          option_value: optionValue,
        }) => {
          if (pickedOptionId === optionId && pickedOptionValue === optionValue) {
            showCustomPrice = false
          }
        })

        if (showCustomPrice) {
          const pickListProductPrice = this.state.gTierPrice[pickedProductId] || 0
          productPrice = parseFloat(parseFloat(productPrice) + parseFloat(pickListProductPrice)).toFixed(2)
        }
      })
    }

    $priceSpan.innerHTML = (`${currencyFormat(parseFloat(productPrice))}`)
    // for list
    if ($tr.querySelectorAll('.product-subtotal-span').length > 0) {
      const qty = $tr.querySelector('input.qty').value
      const totlePriceValue = currencyFormat(parseFloat(qty * productPrice).toFixed(2))
      $tr.querySelector('.product-subtotal-span').text = totlePriceValue
    }
  }

  setPrices(productIds, selector, isSetQty) {
    const {
      currencyFormat,
    } = this.utils

    productIds.forEach(({
      productId,
      optionsList,
      qty,
    }) => {
      getPrice(productId, optionsList).then(data => {
        if (data) {
          const $trs = Array.from(document.querySelectorAll(selector))
          const $products = $trs.find($tr => +$tr.dataset.variantId === +data.v3_variant_id)
          const priceContainer = data.price.without_tax || data.price.with_tax

          const price = priceContainer.formatted
          const { value } = priceContainer

          if (!$products) return
          const $price = $products.querySelector('[data-product-price-value]')

          $price.setAttribute('data-product-price-value', value)
          $price.innerHTML = `<span class="product-price">${price}</span>`

          if (isSetQty) {
            const productSubTotalValue = value * qty
            const productSubTotal = `${currencyFormat(productSubTotalValue)}`
            $products.querySelector('.product-subtotal').innerHTML = productSubTotal
            // $products.querySelector('.qty').removeAttribute('disabled')
          }
        }
      })
    })
  }

  renderPaginator() {
    const {
      pagination: {
        offset,
        limit,
        totalCount,
      },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#shopping-list-pagination',
      currentPage,
      totalPages,
      onPageChange: this.handleShoppingListPaginationChange,
    })
  }

  handleShoppingListPaginationChange = async page => {
    const {
      pagination,
      pagination: {
        limit,
      },
    } = this.state

    this.setState({
      pagination: {
        ...pagination,
        offset: (page - 1) * limit,
      },
    })

    await this.getShoppingListExtension()
    this.renderShoppingList()
  }

  bindEvents() {
    this.bindSignleSearch()
    this.bindSelectAll()
    this.bindSubmitAll()
    this.bindDeleteAll()
    this.bindSkuSearch()
    this.bindStatusChange()
    this.bindAddToShoppingList()
    this.bindUploadCSV()
  }

  bindCheckBox() {
    document.querySelectorAll('.col-checkbox input').forEach(item => {
      item.addEventListener('change', () => {
        const allCheked = this.isAllChecked()
        const selectAll = document.querySelector('#select_all')

        if (allCheked) {
          return selectAll.checked = true
        }
        selectAll.checked = false
      })
    })
  }

  isAllChecked() {
    const items = document.querySelectorAll('.col-checkbox input')
    let status = true
    items.forEach(item => {
      if (!item.checked) status = false
    })
    return status
  }

  bindUploadCSV() {
    const $CSV = document.querySelector('#customer_sku_csv')
    if ($CSV) {
      $CSV.addEventListener('change', e => {
        const { target } = e
        const reg = new RegExp('[.](csv)$')
        let uploadFile
        let originArr = []
        let errorCounter = 0
        const parsedata = []
        const $csvCheckInfoContainer = document.querySelector('#csv_check_info')

        if (target.files && target.files[0]) {
          [uploadFile] = target.files
        } else {
          return false
        }

        if (!reg.test(uploadFile.name)) {
          return this.utils.Alert.error(this.locales.validation.uploadNotCsv)
        }

        const reader = new FileReader()

        reader.addEventListener('load', b => {
          const csvdata = b.target.result
          $csvCheckInfoContainer.innerHTML = '<p class="checking-tips">Checking file...</p>'

          // window.B3Spinner.show()

          if (csvdata) {
            originArr = csvdata.split('\n')
          }

          this.removeEmptyRow(originArr)
          const unEmptyArr = originArr

          let columns = 0

          if (unEmptyArr && unEmptyArr.length > 0) {
            const headerRow = unEmptyArr[0]
            const headerArr = headerRow.split(',')
            // ["variant_sku", "qty", "options", "", ""]
            this.removeEmptyRow(headerArr)
            columns = headerArr.length
          } else {
            $csvCheckInfoContainer.innerHTML = '<div class="checking-info-box">Empty file, please upload another.</div>'
            return null
          }
          for (let i = 1; i < unEmptyArr.length; i += 1) {
            const productIdsArr = ''
            const dataItem = unEmptyArr[i].split(',')

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
            if (!(dataItem[1]).replace(/[\r\n]/g, '') || (dataItem[1]).replace(/[\r\n]/g, '') === '0') {
              errorInfo += 'qty can\'t be empty; '
            }
            if (/\./.test(dataItem[1]) || /\\-/.test(dataItem[1])) {
              errorInfo += 'qty must be an integer; '
            }

            if (errorInfo.trim() !== '') {
              errorCounter += 1
              const el = document.createElement('div')
              el.innerHTML = `#ROW ${i + 1}: ${errorInfo}`
              $csvCheckInfoContainer.append(el)
            }
            const productDataArr = productIdsArr.concat(dataItem)
            parsedata.push(productDataArr)
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
            let variantSkus = []
            const newData = []
            csvdataArr.forEach(item => {
              variantSkus.push(item.sku)
            })
            variantSkus = Array.from(new Set(variantSkus))

            this.api.getProductsBySkuQuickByPost({ variantSkus }).then(res => {
              res.forEach(item => {
                csvdataArr.forEach(cItem => {
                  if (item.variantSku === cItem.sku) {
                    newData.push([
                      item.productId,
                      item.variantId,
                      item.variantSku,
                      cItem.qty,
                      item.option ? item.option : '',
                    ])
                  }
                })
              })
              if (newData.length > 0) {
                const itemArr = csvdataArr
                const variantSkus = itemArr.map(item => item.sku)
                const qtyArr = itemArr.map(item => item.qty)

                this.api.getAdvQtyState().then(() => this.api.getAdvQtyBySkusNew({ variantSkus }), () => {
                  $csvCheckInfoContainer.innerHTML = '<div>File has been processed</div>'
                  this.addCsvProductsToList(newData)
                  return []
                }).then(res => {
                  let invalideQtyCount = 0
                  variantSkus.forEach((sku, idx) => {
                    if (!res.data) {
                      return
                    }
                    const match = res.data.productQuantityList.filter(row => row.variantSku === sku)
                    if (match.length === 0) return
                    const qtyInfo = match[0]
                    const qty = Number.parseInt(qtyArr[idx], 10) || 0
                    const qtyMin = this.getMinQty(qtyInfo.minOrderQty, qtyInfo.qtyIncrement)

                    const qtyIncrement = Number.parseInt(qtyInfo.qtyIncrement, 10) || 1

                    if (qty < qtyMin || (qty % qtyIncrement) !== 0) {
                      invalideQtyCount += 1
                    }
                  })

                  if (invalideQtyCount > 0) {
                    const el = document.createElement('div')
                    el.innerHTML = '<div style="font-weight:600;">Your file doesn\'t pass our "Advance Quantity" check, please correct them and upload the file again.</div>'
                    $csvCheckInfoContainer.append(el)
                    $csvCheckInfoContainer.querySelector('.checking-tips').remove()
                  } else {
                    $csvCheckInfoContainer.innerHTML = '<div>File has been processed</div>'
                    this.addCsvProductsToList(newData)
                  }
                }, () => {
                  const el = document.createElement('div')
                  el.innerHTML = '<div style="font-weight:600;">Your file doesn\'t pass our "Advance Quantity" check, please correct them and upload the file again.</div>'
                  $csvCheckInfoContainer.append(el)
                  $csvCheckInfoContainer.querySelector('.checking-tips').remove()
                }).catch(error => {
                  this.utils.Alert.error(error)
                })
              } else {
                $csvCheckInfoContainer.innerHTML = '<div class="checking-info-box">File could not be processed. Please re-upload with correct data.</div>'
              }
              return newData
            })
          } else {
            const el = document.createElement('div')
            el.innerHTML = `Your file has ${errorCounter} errors, please correct them and upload the file again.`
            $csvCheckInfoContainer.append(el)
            $csvCheckInfoContainer.querySelector('.checking-tips').remove()
            window.B3Spinner.hide()
            return parsedata
          }
        })

        return reader.readAsBinaryString(uploadFile)
      })
    }
  }

  addCsvProductsToList(products) {
    const {
      shoppingListId,
    } = this.state
    const data = {
      id: shoppingListId,
      items: [],
    }
    products.forEach(item => {
      const optionList = []
      item[4].forEach(optionListItem => {
        optionList.push({
          option_id: `attribute[${optionListItem.option_id}]`,
          option_value: `${optionListItem.id}`,
        })
      })
      data.items.push({
        productId: item[0],
        variantId: item[1],
        qty: item[3],
        optionList,
      })
    })
    this.addToShoppingListByCSV(data, true)
  }

  async addToShoppingListByCSV(item, last) {
    const {
      pagination,
    } = this.state
    try {
      await this.api.addProductToShoppingList(item)
      if (last) {
        this.utils.Alert.success(tips.addToShoppingListSuccess)
        this.setState({
          pagination: {
            ...pagination,
            offset: 0,
          },
        })
        await this.getShoppingListExtension()
        this.render()
      }
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  getMinQty(minOrder, increment) {
    let minQty
    if (minOrder === 0 || increment === 0) {
      minQty = minOrder || increment
    } else {
      minQty = minOrder % increment === 0 ? minOrder : (Number.parseInt(minOrder / increment, 10) + 1) * increment
    }
    return minQty
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

  removeEmptyRow(arr) {
    const tmpArr = arr
    if (this.isEmptyRow(tmpArr[tmpArr.length - 1])) {
      tmpArr.pop()
      return this.removeEmptyRow(tmpArr)
    }
    return tmpArr
  }

  bindSignleSearch() {
    const $btn = document.querySelector('#search_single_sku')
    const $input = document.querySelector('#product_search_input')
    const $results = document.querySelector('#product_search_results')

    const setNotFound = () => $results.innerHTML = ('<div style="margin-bottom:1.5rem;">No products found.</div>')

    const handleSearch = () => {
      const searchQuery = $input.value

      if (searchQuery.length >= 2) {
        this.handleInputSearch(() => {
          if (searchQuery.length < 2) return null
          window.B3Spinner.show()
          $results.innerHTML = ''

          stencilUtils.api.search.search(searchQuery, {
            template: 'b3/b3json',
          }, async (err, response) => {
            window.B3Spinner.hide()
            if (err) return setNotFound()
            const {
              product_results: {
                products = [],
              },
            } = JSON.parse(response)
            const signleIds = []
            const optionIds = []
            products.forEach(({
              id,
              has_options: hasOptions,
            }) => (hasOptions ? optionIds.push(id) : signleIds.push(id)))

            const { list } = await this.api.getInventory({
              products: signleIds.map(productId => ({
                productId,
              })),
            })

            const productIds = list.filter(({ purchasingDisabled }) => !purchasingDisabled).map(({ productId }) => productId)
            productIds.push(...optionIds)

            if (!productIds.length) return setNotFound()

            const limit = 3
            const totalPages = Math.ceil(productIds.length / limit)
            const currentPage = 1

            const searchProduct = productId => new Promise(resolve => {
              const resultContainer = this.searchResultContainerTemplate({
                productId,
              })
              $results.insertAdjacentHTML('beforeend', resultContainer)

              stencilUtils.api.product.getById(productId, {
                template: 'b3/b3json',
              }, (error, res) => {
                const $productId = $results.querySelector(`#product-${productId}`)
                $productId.classList.remove('loading-span')
                let optionsHTML = ''
                if (error) return
                const {
                  product,
                } = JSON.parse(res)

                const options = product.options.map(option => {
                  const values = option.values.map(value => ({
                    ...value,
                    checked: false,
                    selected: false,
                  }))
                  return {
                    ...option,
                    checked: false,
                    values,
                  }
                })
                optionsHTML = this.renderOptions(options)

                const resultHtml = this.searchResultItemTemplate({
                  product: {
                    ...product,
                    ...getCorrectProductImage(product, 'main_image'),
                    optionsHTML,
                  },
                })

                $productId.innerHTML = resultHtml
                // const {
                //   sku
                // } = response

                // const $qtyInput = $results.querySelector(`input[name=${ productId }]`)
                // const $optionLabels = $productId.querySelectorAll('label[data-product-attribute-value]')

                // $.each($optionLabels, (index, item) => {
                //   const $optionLabel = $(item)
                //   const $optionInput = $optionLabel.prev()
                //   const optionId = $optionLabel.attr('for')
                //   const newOptionId = `s_${ index }_${ optionId }`
                //   $optionLabel.attr('for', newOptionId)
                //   $optionInput.attr('id', newOptionId)
                // })

                // $qtyInput.attr('data-advqty-sku', sku)
                // this.setUpSearchResultsAdvQty($qtyInput)
                resolve()
              })
            })
            const showProduct = page => {
              $results.innerHTML = ''
              const $active = document.querySelector('#more-results .pagination-item--current')
              const $pageItems = document.querySelectorAll('#more-results .pagination-item')
              const $prev = document.querySelector('#more-results .pagination-item--previous')
              const $next = document.querySelector('#more-results .pagination-item--next')
              $active && $active.classList.remove('pagination-item--current')
              $pageItems.length && $pageItems[page].classList.add('pagination-item--current')
              $prev && ($prev.setAttribute('data-page', +page - 1), +page === 1 ? $prev.classList.add('disabled') : $prev.classList.remove('disabled'))
              $next && ($next.setAttribute('data-page', +page + 1), +page === totalPages ? $next.classList.add('disabled') : $next.classList.remove('disabled'))

              productIds
                .filter((id, i) => i >= (page - 1) * limit && i < page * limit)
                .map(item => searchProduct(item))
            }

            showProduct(1)

            window.B3Paginator.init({
              container: '#more-results',
              currentPage,
              totalPages,
              onPageChange: showProduct,
            })
          })
        })
      } else if (searchQuery.length === 0) {
        $results.innerHTML = ''
      }
    }
    if ($btn) $btn.addEventListener('click', handleSearch)
    if ($input) {
      $input.addEventListener('keydown', e => {
        if (e.keyCode === 13) {
          handleSearch()
        }
      })
    }
  }

  renderOptions(options) {
    return options.reduce((html, currentOption) => {
      html += this.optionTemplateMap[currentOption.partial](currentOption)
      return html
    }, '')
  }

  bindRename() {
    const {
      shoppingListId,
      status,
      renameModal,
    } = this.state

    const $content = renameModal.getContent()

    const $rename = $content.querySelector('#rename_list')
    const $closes = document.querySelectorAll('.modal-close')

    $closes.forEach($close => $close.addEventListener('click', () => renameModal.close()))

    $rename.addEventListener('click', async () => {
      const $form = $content.querySelector('form')
      const name = $form.querySelector('#list_name').value
      const description = $form.querySelector('#list_comment').value || ''

      if (name === '') {
        this.utils.Alert.error(validation.emptyShoppingListName)
        return
      }

      renameModal.close()
      window.B3Spinner.show()
      try {
        await this.api.updateShoppingList({
          name,
          description,
          status,
          id: shoppingListId,
        })
        this.utils.Alert.success(tips.shoppingListUpdateSuccess)

        this.setState({
          name,
          description,
        })
        this.render()
      } catch {
        this.utils.Alert.error(tips.globalError)
      }
      window.B3Spinner.hide()
    })
  }

  bindSelectAll() {
    const $selectAll = document.querySelector('#select_all')
    const $shoppingListTable = document.querySelector('#shopping_list_table')

    if ($selectAll) {
      $selectAll.addEventListener('click', () => {
        const $selects = $shoppingListTable.querySelectorAll('.col-checkbox input[type=checkbox]')
        const isChecked = $selectAll.checked
        $selects.forEach(checkbox => checkbox.checked = isChecked)
        $shoppingListTable.querySelectorAll('.col-checkbox input[type=checkbox]:disabled').forEach(checkbox => checkbox.checked = false)
      })
    }
  }

  bindEditOptions() {
    const {
      editOptionsModal,
    } = this.state

    this.utils.on('#shopping_list_table tbody tr', 'click', 'edit-option', ($tr, target, e) => {
      e.preventDefault()
      e.stopPropagation()
      const {
        productId,
        variantId,
        index: itemIndex,
        productOptions: itemOptions,
        itemId,
      } = $tr.dataset

      const skuHtml = $tr.querySelector('.product-sku').innerHTML
      this.setState({
        shopingListItemId: itemId,
      })

      window.B3Spinner.show()

      stencilUtils.api.product.getById(productId, {
        template: 'b3/b3json',
      }, (err, response) => {
        window.B3Spinner.hide()
        if (err) return
        let optionsHTML = ''

        const {
          product = {},
        } = JSON.parse(response) || {}
        optionsHTML = this.renderOptions(product.options)

        const modalContent = editOptionsModalTemplate({
          product: {
            ...product,
            ...getCorrectProductImage(product, 'main_image'),
            optionsHTML,
          },
        })

        editOptionsModal.open()
        editOptionsModal.setContent(modalContent)
        const $modalContent = editOptionsModal.getContent()

        $modalContent.querySelector('#index_container').dataset.index = itemIndex
        $modalContent.querySelector('#variant_id_container').dataset.variantId = variantId
        $modalContent.querySelector('[data-product-sku]').innerHTML = skuHtml

        const $close = $modalContent.querySelector('.modal-close')
        if ($close) {
          $close.addEventListener('click', () => {
            editOptionsModal.close()
          })
        }
        listenOptionChange()

        const options = JSON.parse(itemOptions)

        options.forEach(option => {
          const {
            // option_id: optionId,
            // option_value: optionValue
          } = option

          // const $option = $modalContent.querySelectorAll(`[type!="hidden"][name="${ option_id }"]`)
          // if ($option.length > 0) {
          // To Do
          // if ($option.attr('type') === 'radio') {
          //   $option.each((index, item) => {
          //     if ($(item).val() === option_value) {
          //       $(item).prop('checked', true)
          //     }
          //   })
          // } else if ($option.attr('type') === 'checkbox') {
          //   $option.prop('checked', true)
          // } else {
          //   $option.val(option_value)
          // }
          // }
        })
      })
    })
  }

  bindDeleteAll() {
    const $shoppingListTable = document.querySelector('#shopping_list_table')
    const $deleteAll = document.querySelector('[data-delete-items]')

    const handleDelete = async () => {
      const $checkedInputs = $shoppingListTable.querySelectorAll('tbody tr input[type=checkbox]:checked')

      if ($checkedInputs.length === 0) {
        this.utils.Alert.error(validation.emptyShoppingListSelect)
        return
      }

      const {
        dismiss,
      } = await this.utils.Alert.warning(tips.confirmDeleteShoppingListItem, {
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#ff0000',
      })

      if (dismiss) return

      $checkedInputs.forEach(($checked, index) => {
        const { itemId } = $checked.dataset
        const isLast = $checkedInputs.length === (index + 1)
        this.deletItem(itemId, isLast)
      })
    }

    if ($deleteAll) {
      $deleteAll.removeEventListener('click', handleDelete)
      $deleteAll.addEventListener('click', handleDelete)
    }
  }

  bindSubmitAll() {
    const $shoppingListTable = document.querySelector('#shopping_list_table')
    const $SubmitAll = document.querySelector('[data-submit-approval]')
    const handleSubmit = async () => {
      const $checkedInputs = $shoppingListTable.querySelectorAll('tbody tr input[type=checkbox]')
      if ($checkedInputs.length === 0) {
        this.utils.Alert.error(validation.emptyShoppingListSubmit)
        return
      }
      this.bindStatusChange()
    }
    if ($SubmitAll) {
      $SubmitAll.addEventListener('click', handleSubmit)
    }
  }

  bindUpdateItem() {
    const {
      shoppingListId: shoppinglistId,
      pagination,
    } = this.state

    this.utils.updateQty('#shopping_list_table tbody tr', 'blur', 'update-list-item', async ($tr, target, e) => {
      e.preventDefault()
      e.stopPropagation()
      const {
        itemId,
      } = $tr.dataset

      const qty = $tr.querySelector('input.qty').value

      window.B3Spinner.show()
      try {
        await this.api.updateShoppingListItme({
          shoppinglistId,
          itemId,
          qty,
        })
        this.setState({
          pagination: {
            ...pagination,
            offset: 0,
          },
        })
        await this.getShoppingListExtension()
        await this.utils.Alert.success(tips.updateQtySuccess)
        this.render()
      } catch (err) {
        this.utils.Alert.error(tips.globalError)
      }
      window.B3Spinner.hide()
    })
    // this.utils.on('#shopping_list_table tbody tr', 'click', 'update-list-item', async ($tr, target, e) => {
    //   e.preventDefault()
    //   e.stopPropagation()
    //   const {
    //     itemId,
    //   } = $tr.dataset

    //   const qty = $tr.querySelector('input.qty').value

    //   window.B3Spinner.show()
    //   try {
    //     await this.api.updateShoppingListItme({
    //       shoppinglistId,
    //       itemId,
    //       qty,
    //     })
    //     this.setState({
    //       pagination: {
    //         ...pagination,
    //         offset: 0,
    //       },
    //     })
    //     await this.getShoppingListExtension()
    //     await this.utils.Alert.success(tips.updateQtySuccess)
    //     this.render()
    //   } catch (err) {
    //     this.utils.Alert.error(tips.globalError)
    //   }
    //   window.B3Spinner.hide()
    // })
  }

  bindDeleteItem() {
    this.utils.on('#shopping_list_table tbody tr', 'click', 'data-delete-item', async ($tr, target, e) => {
      e.preventDefault()
      e.stopPropagation()
      const {
        itemId,
      } = $tr.dataset

      try {
        const {
          dismiss,
        } = await this.utils.Alert.warning(tips.confirmDeleteShoppingListItem, {
          showCancelButton: true,
          confirmButtonText: 'Delete',
          confirmButtonColor: '#ff0000',
        })

        if (dismiss) return

        this.deletItem(itemId, true)
      } catch {
        this.utils.Alert.error(tips.globalError)
      }
    })
  }

  filterEmptyFilesFromForm(formData) {
    for (let i = 0; i < formData.length; i += 1) {
      const [key, val] = formData[i]
      if (val instanceof File && !val.name && !val.size) {
        formData.delete(key)
      }
    }
    return formData
  }

  saveUpdate(e) {
    // update items
    window.B3Spinner.show()
    const {
      editOptionsModal,
    } = this.state
    const optionList = []
    const $target = e.target
    const $modal = document.querySelector('#option-modal')
    const form = $modal.querySelector('form')

    const tr = $modal.querySelector('tr')
    const { shopingListItemId } = this.state
    $target.setAttribute('disabled', 'true')
    let options = {}
    options = this.getFormInputs(form)
    Object.getOwnPropertyNames(options).forEach(key => {
      if (key.indexOf('attribute[') > -1) {
        optionList.push({
          option_id: key,
          option_value: options[key],
        })
      }
    })

    const variantId = tr.getAttribute('data-variant-id')

    if (!variantId) {
      return this.utils.Alert.error('No variant Id')
    }

    const data = {
      shoppinglistId: this.utils.urlHelper.searchParams.get('list_id'),
      itemId: shopingListItemId,
      optionList,
      variantId,
    }
    this.api.updateShoppingListItme(data).then(async () => {
      editOptionsModal.close()
      await this.utils.Alert.success(tips.updateOptionsSuccess)
      await this.getShoppingListExtension()
      this.renderShoppingList()
    })
    $target.removeAttribute('disabled')
  }

  async deletItem(itemId, isLast) {
    const {
      shoppingListId,
      pagination,
    } = this.state

    window.B3Spinner.show()
    try {
      await this.api.deleteShopingListItme(shoppingListId, itemId)
      if (isLast) {
        await this.utils.Alert.success(tips.deleteShopingListItemSuccess)
        this.setState({
          pagination: {
            ...pagination,
            offset: 0,
          },
        })
        await this.getShoppingListExtension()
        this.render()
      }
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  bindCartEvents() {
    const $shoppingListTable = document.querySelector('#shopping_list_table')
    const $trs = $shoppingListTable.querySelectorAll('tr')
    const $toggle = document.querySelector('.bottom-cart-toggle')
    const $addToCart = document.querySelector('#add_to_cart')
    const $clearCart = document.querySelector('#clear_cart')
    const $bottomCart = document.querySelector('.bottom-cart-container')

    $toggle.addEventListener('click', () => {
      $toggle.classList.toggle('is-open')
      $bottomCart.classList.toggle('is-open')
    })

    if ($addToCart) {
      $addToCart.addEventListener('click', async () => {
        const disabled = $addToCart.classList.contains('disabled')
        if (disabled) return

        const itemArr = []
        let allOptionsValid = true
        let invalidAdvQtyCount = 0
        const $checkedItems = document.querySelector('#shopping_list_table').querySelectorAll('.col-checkbox input[type=checkbox]:checked')
        $checkedItems.forEach($checkedItem => {
          const $tr = $checkedItem.parentNode.parentNode

          const notValidMin = $tr.querySelectorAll('.not-valid-min')
          const notValidInc = $tr.querySelectorAll('.not-valid-inc')
          const noOptionValue = $tr.querySelectorAll('[no-option-value]')

          if (notValidMin.length > 0 || notValidInc.length > 0) {
            invalidAdvQtyCount += 1
          }

          const {
            productId,
            variantId,
            productOptions,
          } = $tr.dataset

          const quantity = $tr.querySelector('[data-product-quantity] input').value
          const optionList = productOptions ? JSON.parse(productOptions) : []

          if (noOptionValue.length) {
            allOptionsValid = false
          }

          itemArr.push({
            productId,
            variantId,
            optionList,
            quantity,
          })
        })

        if (invalidAdvQtyCount > 0) {
          this.utils.Alert.error(validation.shoppingListQtyValidError)
          return
        }

        if ($trs.length === 0) {
          this.utils.Alert.error(validation.emptyShoppingList)
          return
        }

        if (itemArr.length === 0) {
          this.utils.Alert.error(validation.emptySelectedShoppingList)
          return
        }

        if (!allOptionsValid) {
          this.utils.Alert.error(validation.incompleteOptions)
          return
        }

        const lineItems = itemArr.map(item => ({
          quantity: item.quantity,
          productId: item.productId,
          variantId: item.variantId,
        }))

        window.B3Spinner.show()
        try {
          await addProducts({
            lineItems,
          })
          await this.utils.Alert.success('success')
          this.renderBottomCart()
        } catch {
          this.utils.Alert.error(tips.globalError)
        }
        window.B3Spinner.hide()
      })
    }

    $clearCart.addEventListener('click', async () => {
      window.B3Spinner.show()
      try {
        await clearCart()
        this.renderBottomCart()
      } catch {
        this.utils.Alert.error(tips.globalError)
      }
      window.B3Spinner.hide()
    })
  }

  bindSkuSearch() {
    const $skuSearch = document.querySelector('#search_skus')
    const $input = document.querySelector('#product_search_skus')
    const $resultContainer = document.querySelector('#skus_search_results')

    if ($skuSearch) {
      $skuSearch.addEventListener('click', async () => {
        const searchValue = $input.value
        const variantSku = searchValue.split(',').map(sku => (sku.replace(/^\s*|\s*$/g, '')))

        window.B3Spinner.show()
        try {
          const resp = await this.api.getProductsBySkuQuick({
            variantSku,
          })

          const productIds = []

          const result = resp.map((product, idx) => {
            const {
              option,
              productId,
            } = product
            const optionsList = option.map(({
              option_id: optionId,
              id,
            }) => ({
              option_id: `attribute[${optionId}]`,
              option_value: id,
            }))

            const imgId = `img_id_${productId}_${idx}`

            productIds.push({
              productId,
              optionsList,
              imgId,
            })

            return {
              ...product,
              optionsList: JSON.stringify(optionsList),
              idx,
            }
          })

          const resultContent = skuSearchResultTemplate({
            result,
            searchValue,
          })

          $resultContainer.innerHTML = resultContent

          productIds.forEach(({
            productId,
            imgId,
          }) => {
            this.setImage(productId, imgId)
          })

          this.setPrices(productIds, '#skus_search_results [data-variant-id]')
        // const $qtyInputs = $resultContainer.querySelectorAll('.form-input')
        // this.setUpSearchResultsAdvQty($qtyInputs)
        } catch {
          this.utils.Alert.error(tips.globalError)
        }
        window.B3Spinner.hide()
      })
    }
    if ($input) {
      $input.addEventListener('keydown', async e => {
        if (e.keyCode === 13) {
          const searchValue = $input.value
          const variantSku = searchValue.split(',').map(sku => (sku.replace(/^\s*|\s*$/g, '')))

          window.B3Spinner.show()
          try {
            const resp = await this.api.getProductsBySkuQuick({
              variantSku,
            })

            const productIds = []

            const result = resp.map((product, idx) => {
              const {
                option,
                productId,
              } = product
              const optionsList = option.map(({
                option_id: optionId,
                id,
              }) => ({
                option_id: `attribute[${optionId}]`,
                option_value: id,
              }))

              const imgId = `img_id_${productId}_${idx}`

              productIds.push({
                productId,
                optionsList,
                imgId,
              })
              return {
                ...product,
                optionsList: JSON.stringify(optionsList),
                idx,
              }
            })

            const resultContent = skuSearchResultTemplate({
              result,
              searchValue,
            })

            $resultContainer.innerHTML = resultContent

            productIds.forEach(({
              productId,
              imgId,
            }) => {
              this.setImage(productId, imgId)
            })

            this.setPrices(productIds, '#skus_search_results [data-variant-id]')
            // const $qtyInputs = $resultContainer.querySelectorAll('.form-input')
            // this.setUpSearchResultsAdvQty($qtyInputs)
          } catch {
            this.utils.Alert.error(tips.globalError)
          }
          window.B3Spinner.hide()
        }
      })
    }
  }

  async bindStatusChange() {
    const $shoppingListTable = document.querySelector('#shopping_list_table')
    const $updateStatus = document.querySelectorAll('[data-update-status]')
    const $juniorUpdateStatus = document.querySelector('[data-submit-approval]')
    const $checkedInputs = $shoppingListTable.querySelectorAll('tbody tr input[type=checkbox]')
    const {
      B3RoleId,
    } = this.utils.B3Storage
    const {
      shoppingListId,
      status,
    } = this.state
    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role
    const roleId = B3RoleId.value

    if ($checkedInputs.length !== 0) {
      if ($juniorUpdateStatus) {
        const selectedStatus = 40
        window.B3Spinner.show()
        try {
          await this.api.updateShoppingList({
            status: selectedStatus,
            id: shoppingListId,
          })
          await this.utils.Alert.success(tips.updateShoppingListSuccess)
          if (
            (roleId === JUNIOR && +selectedStatus === 40)
              || ([ADMIN, SENIOR, SALESREP].includes(roleId) && +selectedStatus === 0)
          ) {
            window.location.reload()
          }
          if ([ADMIN, SENIOR, SALESREP].includes(roleId) && +selectedStatus === 30) {
            window.location.href = '/shopping-lists/'
          }
        } catch {
          this.utils.Alert.error(tips.globalError)
        }
        window.B3Spinner.hide()
      }
    }

    if ($updateStatus) {
      if ($updateStatus.length !== 0) {
        [0, 1].forEach(i => {
          $updateStatus[i].addEventListener('click', async () => {
            // const $trs = $shoppingListTable.querySelectorAll('tbody tr')
            // const selectedStatus = document.querySelector('#shopping_list_status').value
            let selectedStatus = $updateStatus[i].getAttribute('name')
            if (selectedStatus === 'Approved') {
              selectedStatus = 0
            } else if (selectedStatus === 'Draft') {
              selectedStatus = 30
            }
            if (roleId === JUNIOR) {
              this.utils.Alert.error(tips.noItemList)
              return
            }

            if (+status === +selectedStatus) return

            window.B3Spinner.show()
            try {
              await this.api.updateShoppingList({
                status: selectedStatus,
                id: shoppingListId,
              })
              await this.utils.Alert.success(tips.updateShoppingListSuccess)
              if (
                (roleId === JUNIOR && +selectedStatus === 40)
              || ([ADMIN, SENIOR, SALESREP].includes(roleId) && +selectedStatus === 0)
              ) {
                window.location.reload()
              }
              if ([ADMIN, SENIOR, SALESREP].includes(roleId) && +selectedStatus === 30) {
                window.location.href = '/shopping-lists/'
              }
            } catch {
              this.utils.Alert.error(tips.globalError)
            }
            window.B3Spinner.hide()
          })
        })
      }
    }
  }

  bindAddToShoppingList() {
    const {
      shoppingListId,
    } = this.state

    const $add = document.querySelector('#add_items_to_list')
    if ($add) {
      $add.addEventListener('click', async () => {
        const $resultTables = document.querySelectorAll('[product-search-result-table]')
        const $checkedProducts = []
        const $trs = []
        const seachInPuts = document.querySelectorAll('#product_search_results [product-search-result-table] [data-results-check-box]:checked')
        const searchSkusInputs = document.querySelectorAll('#skus_search_results [product-search-result-table] [data-results-check-box]:checked')
        let searchSkusArry = []

        $resultTables.forEach($resultTable => {
          const $checkeds = $resultTable.querySelectorAll('[data-results-check-box]:checked')
          const $tableTrs = $resultTable.querySelectorAll('tr')
          $checkedProducts.push(...$checkeds)
          $trs.push(...$tableTrs)
        })
        await this.checkInputNull()
        if (!$trs.length) {
          this.utils.Alert.error(tips.searchProducts)
          return
        }
        if (!$checkedProducts.length) {
          this.utils.Alert.error(tips.selectProducts)
          return
        }

        const checkNum = /^[1-9]\d*$/
        const addToShoppingListData = []
        const searchBynameProducts = [...seachInPuts]

        for (let i = 0; i < searchBynameProducts.length; i += 1) {
          const $checked = searchBynameProducts[i]
          const singleProductQuantity = $checked.parentNode.parentNode.querySelector('.form-input').value

          if (!checkNum.test(singleProductQuantity)) {
            $checked.focus()
            this.utils.Alert.error(tips.unvalidQty)
            return
          }

          // check top search
          const form = $checked.parentNode.parentNode.querySelector('form')
          let checkAddStatus = true
          if (form) checkAddStatus = this.checkRequireInputs(form)

          if (checkAddStatus) {
            const optionList = []
            const $checkedTr = $checked.parentNode.parentNode
            let options = {}
            if (form) options = this.getFormInputs(form)
            Object.getOwnPropertyNames(options).forEach(key => {
              if (key.indexOf('attribute[') > -1) {
                optionList.push({
                  option_id: key,
                  option_value: options[key],
                })
              }
            })

            const qty = $checkedTr.querySelector('.product-qty-col input').value
            const { productId } = $checkedTr.dataset
            let { variantId } = $checkedTr.dataset

            if (
              !productId
            || (
              !variantId
              && $checkedTr.querySelectorAll('[data-product-attribute]').length > 0
            )
            ) {
              this.utils.Alert.error(validation.unvalidProduct)
              return
            }

            if (!variantId) {
              variantId = productId
            }

            const productItem = {
              id: shoppingListId,
              items: [
                {
                  productId,
                  variantId,
                  qty,
                  optionList,
                },
              ],
              checkAddStatus: true,
            }
            addToShoppingListData.push(productItem)
          }
        }

        if (searchSkusInputs) searchSkusArry = [...searchSkusInputs]

        searchSkusArry.forEach(item => {
          const $checkedTr = item.parentNode.parentNode
          const optionList = $checkedTr.getAttribute('data-product-options')
          const productId = $checkedTr.getAttribute('data-product-id')
          const variantId = $checkedTr.getAttribute('data-variant-id')
          const qty = $checkedTr.querySelector('.product-qty-col input').value

          addToShoppingListData.push({
            id: shoppingListId,
            items: [
              {
                productId,
                variantId,
                qty,
                optionList: JSON.parse(optionList),
              },
            ],
            checkAddStatus: true,
          })
        })

        addToShoppingListData.forEach((item, index) => {
          const last = (addToShoppingListData.length === index + 1)
          if (item.checkAddStatus) this.addToShoppingList(item, last)
        })
      })
    }
  }

  checkInputNull() {
    const $inputs = document.querySelector('#quick_add_section #product_search_results').querySelectorAll('[data-results-check-box]:checked')
    return new Promise((resolve, reject) => {
      for (let i = 0; i < $inputs.length; i += 1) {
        const $input = $inputs[i]
        const $qty = $input.parentNode.parentNode.querySelector('.product-qty-col .form-input')
        const val = $qty.value

        if (!val || val === '') {
          this.utils.Alert.error(validation.emptyQty)
          reject()
          return
        }
      }
      resolve()
    })
  }

  checkRequireInputs(form) {
    let status = true
    const requireInputsArry = this.getRequireInputs(form)
    const formInputsArry = this.getFormInputs(form)
    for (let i = 0; i < requireInputsArry.length; i += 1) {
      const item = requireInputsArry[i]
      if (!formInputsArry[item]) {
        status = false
      }
    }
    return status
  }

  getRequireInputs(form) {
    const $requireInputs = form.querySelectorAll('[required]')
    const attrArry = []
    if (!$requireInputs.length) return false

    $requireInputs.forEach($requireInput => {
      if ($requireInput.hasAttribute('required')) {
        const attr = $requireInput.getAttribute('name')
        attrArry.push(attr)
      }
    })

    return Array.from(new Set(attrArry))
  }

  getFormInputs(form) {
    const attributeArry = this.serialize(form)
    return attributeArry
  }

  serialize(form) {
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

  async addToShoppingList(item, last) {
    const {
      pagination,
    } = this.state

    window.B3Spinner.show()
    try {
      await this.api.addProductToShoppingList(item)
      if (last) {
        this.utils.Alert.success(tips.addToShoppingListSuccess)
        this.setState({
          pagination: {
            ...pagination,
            offset: 0,
          },
        })
        await this.getShoppingListExtension()
        document.querySelector('#shopping_list_grand_total').innerHTML = this.text['shopping.list.item.grand.total'] + this.state.baseGrangTotal
        this.renderShoppingList()
      }
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  setImage(productId, imgId) {
    stencilUtils.api.product.getById(productId, {
      template: 'b3/b3json',
    }, (err, response) => {
      const {
        product,
      } = JSON.parse(response)

      document.querySelector(`[data-img-id=${imgId}]`).src = getCorrectProductImage(product, 'main_image')?.['main_image']
    })
  }

  initBtn() {
    // save option click
    // $('body').on('click', '[data-update-option]', event => {
    //   // update items
    //   window.b2b.$overlay.show()
    //   const optionList = []
    //   const $target = $(event.target)
    //   const $modal = $target.parents('.modal')
    //   const form = $('form', $modal)[0]
    //   const formData = filterEmptyFilesFromForm(new FormData(form))
    //   $target.prop('disabled', true)
    //   for (const item of formData) {
    //     if (item[0].indexOf('attribute') !== -1 && item[1] !== '') {
    //       const optionObj = {
    //         option_id: item[0],
    //         option_value: item[1],
    //       }
    //       optionList.push(optionObj)
    //     }
    //   }
    //   const variantId = $('#variant_id_container').attr('data-variant-id')

    //   if (!variantId) {
    //     return swal({
    //       text: 'No variant Id',
    //       type: 'error',
    //     })
    //   }
    //   const data = {
    //     shoppinglistId: window.b2b.shoppingListId,
    //     itemId: window.b2b.shopingListItemId,
    //     optionList,
    //     variantId,
    //   }

    //   b2bAjax.updateShoppingListItme(data).then(() => {
    //     defaultModal().close()
    //     swal({
    //       type: 'success',
    //       text: 'Product options updated successfully',
    //     })
    //     this.reloadTable()
    //   })
    // })

    // option change
    // utils.hooks.on('product-option-change', (event, option) => {
    //   const $changedOption = $(option)
    //   const $form = $changedOption.parents('form')
    //   const $messageBox = $('.alertMessageBox')
    //   const productId = $('[name="product_id"]', $form).attr('value')
    //   const priceContainer = $(event.target).parents('.product-options').find('.product-price')
    //   // for edit options
    //   const $submit = $('#btn_option_update', $form)
    //   const $skuModal = $form.parents('.modal-body').find('[data-product-sku]')

    //   // for search results
    //   const $tr = $changedOption.parents('tr')
    //   const $sku = $('[data-product-sku]', $tr)
    //   const $checkbox = $('input[type=checkbox]', $tr)

    //   $submit.prop('disabled', true)
    //   $checkbox.prop('disabled', true)
    //   utils.api.productAttributes.optionChange(productId, $form.serialize(), (err, result) => {
    //     const data = result.data || {}
    //     const variantId = data.v3_variant_id
    //     const hasActiveModal = $('body').hasClass('has-activeModal')
    //     let priceB2b
    //     if (data.price.with_tax) {
    //       priceB2b = data.price.with_tax.value
    //     }

    //     if (data.price.without_tax) {
    //       priceB2b = data.price.without_tax.value
    //     }
    //     priceContainer.text(currencyFormat(priceB2b, window.money))
    //     if (err) {
    //       return swal({
    //         text: err,
    //         type: 'error',
    //       })
    //     }
    //     if (data.sku) {
    //       $sku.html(`<b>SKU: </b>${ data.sku }`)
    //       $skuModal.html(`SKU: ${ data.sku }`)
    //     }
    //     // page right option change
    //     if (hasActiveModal) {
    //       if (variantId) {
    //         $('#variant_id_container').attr('data-variant-id', variantId)
    //       }
    //       let allValid = true
    //       let validInput = true
    //       if (data.purchasing_message) {
    //         $('p.alertBox-message', $messageBox).text(data.purchasing_message)
    //         allValid = false
    //         $messageBox.show()
    //       } else {
    //         $messageBox.hide()
    //       }
    //       if (!data.purchasable || !data.instock) {
    //         allValid = false
    //       }
    //       // required text field
    //       const $textInputs = $form.find('input.form-input[required]')
    //       $textInputs.each((index, item) => {
    //         const $textInput = $(item)
    //         if ($textInput.val().trim() === '') {
    //           validInput = false
    //         }
    //       })
    //       if (allValid && validInput) {
    //         $submit.prop('disabled', false)
    //       } else {
    //         $submit.prop('disabled', true)
    //       }
    //       $textInputs.bind('keyup', (e) => {
    //         if ($(e.target).val() && allValid) {
    //           $submit.prop('disabled', false)
    //         } else {
    //           $submit.prop('disabled', true)
    //         }
    //       })
    //     } else {
    //       if (variantId) {
    //         $(`#product_search_result_table.${ productId } tr`).attr('data-variant-id', variantId)
    //       }
    //       // page left option change
    //       // set up advqty
    //       const $qtyInputSingle = $(`input[name=${ productId }]`, $tr)
    //       const $qtyInputMulti = $(`input[name=${ productId }]`, $tr)

    //       if ($form.parents('#product_search_results').length > 0) {
    //         $qtyInputSingle.attr('data-advqty-sku', data.sku)
    //         this.setUpSearchResultsAdvQty($qtyInputSingle, true)
    //       } else {
    //         $qtyInputMulti.attr('data-advqty-sku', data.sku)
    //         this.setUpSearchResultsAdvQty($qtyInputMulti, true)
    //       }
    //       // from search results
    //       $checkbox.prop('disabled', true)
    //       let allValid = true
    //       if (data.purchasing_message) {
    //         $('p.alertBox-message', $messageBox).text(data.purchasing_message)
    //         allValid = false
    //         $messageBox.show()
    //       } else {
    //         $messageBox.hide()
    //       }

    //       if (!data.purchasable || !data.instock) {
    //         allValid = false
    //       }

    //       // required text field
    //       const $textInputs = $tr.find('input.form-input[required]')
    //       let validInput = true
    //       $textInputs.each((index, item) => {
    //         const $textInput = $(item)
    //         if (!$textInput.val() || $textInput.val().trim() === '') {
    //           validInput = false
    //         }
    //       })
    //       if (allValid && validInput) {
    //         $checkbox.prop('disabled', false)
    //       } else {
    //         $checkbox.prop('checked', false)
    //         $checkbox.prop('disabled', true)
    //       }

    //       $textInputs.bind('keyup', (e) => {
    //         const $tableCheckbox = $(e.target).parents('tr').find('input[type=checkbox]')
    //         if ($(this).val() && allValid) {
    //           $tableCheckbox.prop('disabled', false)
    //         } else {
    //           $tableCheckbox.prop('disabled', true)
    //           $tableCheckbox.prop('checked', false)
    //         }
    //       })
    //     }
    //   })
    // })
  }
}

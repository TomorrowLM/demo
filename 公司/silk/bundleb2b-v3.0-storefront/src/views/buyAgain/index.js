import BasePage from '../../common/BasePage'
import buyAgainTemplate from './buyAgain.html'
import orderListTemplate from './orderList.html'
import getPrice from '../../common/api/getPrice'
import {
  tips,
  validation,
} from '../../common/locales'
import {
  B3Role,
} from '../../common/utils/constants'
import addProducts from '../../common/api/addProducts'
import shoppingListModalContent from './shoppingListModalContent.html'
import createShoppingListModalContent from './createShoppingListModalContent.html'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class BuyAgain extends BasePage {
  constructor() {
    super()
    this.name = 'BuyAgain'
    this.state = {
      isShowAll: '0',
      orderList: [],
      filters: {
        q: '',
        beginDateAt: '',
        endDateAt: '',
      },
      orderPagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      qtyEnabled: '',
      itemAddToshoppingList: null,
      shoppingListModal: null,
      shouldUpdateShoppingList: true,
      shoppingListPagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      shoppingList: [],
      shoppingListSelectedId: '',
      createShopingListModal: null,
    }
  }

  async init() {
    if (!this.isB2BUser || !this.isCompanyApproved) return
    await this.getOrderedList()

    this.render()
    this.initMobileTable([5])
    themeStyleFix.editModalBoxStyleFix()
  }

  async getOrderedList() {
    const { DateTime } = this.utils
    const {
      filters,
      filters: {
        beginDateAt,
        endDateAt,
      },
      orderPagination,
      orderPagination: {
        offset,
        limit,
      },
    } = this.state

    window.B3Spinner.show()
    try {
      const {
        pagination,
        list,
      } = await this.api.getOrderedList({
        ...filters,
        offset,
        limit,
        beginDateAt: DateTime.displayParse(beginDateAt),
        endDateAt: DateTime.displayParse(endDateAt),
      })

      const baseList = await this.getBasePrices(list)
      const orderList = await this.initOrderListQty(baseList)

      this.setState({
        orderList,
        orderPagination: {
          ...orderPagination,
          ...pagination,
        },
      })
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async getBasePrices(list) {
    const getBasePriceResults = []
    let result = []

    list.forEach(item => {
      getBasePriceResults.push(this.getBasePrice(item))
    })

    window.B3Spinner.show()
    try {
      result = await Promise.all(getBasePriceResults)
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()

    return result.map(result => {
      let basePrice = 0
      let basePriceValue = 0
      const listItem = list.find(item => (item.productId === result.productId) && (item.variantId === result.variantId))
      if (result.data.price) {
        const priceContainer = result.data.price.without_tax || result.data.price.with_tax
        basePrice = priceContainer.formatted
        basePriceValue = priceContainer.value
      }
      return {
        ...listItem,
        basePrice,
        basePriceValue,
        qty: 0,
        minOrderQty: 0,
        qtyIncrement: 1,
      }
    })
  }

  async getBasePrice(item) {
    return new Promise((resolve, reject) => {
      const optionList = item.optionList.map(option => {
        const { product_option_id: optionId, value } = option
        return {
          option_id: `attribute[${optionId}]`,
          option_value: value,
        }
      })
      getPrice(item.productId, optionList).then(response => {
        resolve({
          productId: item.productId,
          variantId: item.variantId,
          data: response,
        })
      }).catch(reject)
    })
  }

  async initOrderListQty(list) {
    const {
      qtyEnabled,
    } = this.state

    let qtyList = [...list]

    const getQtys = async () => {
      const skus = qtyList.map(item => item.sku)

      let productQuantityList = []
      try {
        const resp = await this.api.getAdvQtyBySkus({ variantSkus: skus.join('|').toString() })
        productQuantityList = resp.productQuantityList
      } catch (error) {
        this.utils.Alert.error(error.message)
      }
      return productQuantityList
    }

    const setListQty = qtys => {
      const qtyList = list.map(listItem => {
        let qtyObj = {}
        for (let i = 0; i < qtys.length; i += 1) {
          const qty = qtys[i]

          if (listItem.sku === qty.variantSku) {
            qtyObj = qty
            qtyObj.qty = +qty.minOrderQty
            break
          }
        }
        return {
          ...listItem,
          ...qtyObj,
        }
      })
      return qtyList
    }

    window.B3Spinner.show()
    try {
      if (qtyEnabled !== '1') {
        const { isEnabled } = await this.api.getAdvQtyState() ?? {}

        if (isEnabled === '1') {
          this.setState({
            qtyEnabled: isEnabled,
          })
          const resp = await getQtys()
          qtyList = setListQty(resp)
        }
      } else {
        const resp = await getQtys()
        qtyList = setListQty(resp)
      }
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()

    return qtyList
  }

  render() {
    const {
      buyAgain: {
        container,
      },
    } = this.doms

    const {
      orderList,
      filters,
    } = this.state

    const b2bWraper = document.querySelector('.buyAgain')
    if (b2bWraper) b2bWraper.remove()

    this.utils.renderTemplate({
      hbsTemplate: buyAgainTemplate,
      containerSelector: container,
      templateConfig: {
        filters,
        itemsLength: orderList.length,
      },
      insertType: 'beforeend',
    })

    this.renderOrderList()
    this.renderOrdersPaginator()
    this.bindSearch()
    this.bindDatePicker()
  }

  renderOrderList() {
    const {
      orderList,
    } = this.state

    const {
      currencyFormat,
    } = this.utils

    const {
      B3RoleId,
    } = this.utils.B3Storage

    const cartBtnDisabled = B3RoleId.value === B3Role.JUNIOR ? 'disabled' : ''

    const orders = orderList.map(order => {
      const formativeCurrency = currencyFormat(order.basePriceValue)
      const lastOrderedDate = new Date(order.lastOrdered * 1000)

      return {
        ...order,
        cartBtnDisabled,
        formativeCurrency,
        lastOrderedDate,
      }
    })

    document.querySelector('.buy-again-lists-table tbody').innerHTML = orderListTemplate({
      orders,
    })

    this.bindQtyEvents()
    this.bindActionEvents()
  }

  renderOrdersPaginator() {
    const {
      orderPagination: {
        offset,
        limit,
        totalCount,
      },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#orders-pagination',
      currentPage,
      totalPages,
      onPageChange: this.handleOrdersPaginationChange,
    })
  }

  handleOrdersPaginationChange = async page => {
    const {
      orderPagination,
      orderPagination: {
        limit,
      },
    } = this.state

    this.setState({
      orderPagination: {
        ...orderPagination,
        offset: (page - 1) * limit,
      },
    })

    await this.getOrderedList()
    this.render()
  }

  bindSearch() {
    const $searchInput = document.querySelector('.buy-again-search input')
    if ($searchInput) {
      $searchInput.addEventListener('keyup', e => this.handleInputSearch(async () => {
        const {
          orderPagination,
          filters,
        } = this.state
        this.setState({
          orderPagination: {
            ...orderPagination,
            offset: 0,
          },
          filters: {
            ...filters,
            q: e.target.value,
          },
        })

        await this.getOrderedList()
        this.render()
      }))
    }
  }

  bindDatePicker() {
    const { DateTime } = this.utils
    const defaultEndDate = this.getStoreZoneDate()

    const $start = document.querySelector('#orderFromDate')
    const $end = document.querySelector('#orderToDate')

    const handleDateChange = async () => {
      const {
        filters,
        filters: {
          beginDateAt,
          endDateAt,
        },
      } = this.state

      // judge the date order if need exchange

      if (endDateAt && beginDateAt && new Date(DateTime.displayParse(beginDateAt)) > new Date(DateTime.displayParse(endDateAt))) {
        this.setState({
          filters: {
            ...filters,
            beginDateAt: endDateAt,
            endDateAt: beginDateAt,
          },
        })
        $start.value = endDateAt
        $end.value = beginDateAt
      }
      await this.getOrderedList()
      this.render()
    }

    const setDatePicker = ($el, field) => {
      window.B3DatePicker($el, {
        mode: 'dp-modal',
        max: defaultEndDate,
        format(date) {
          return window.B3DisplayFormat(date)
        },
        parse(dateStr) {
          const date = new Date(DateTime.displayParse(dateStr))
          return isNaN(date) ? new Date() : date
        },
      }).on({
        select: () => {
          const {
            orderPagination,
            filters,
          } = this.state

          this.setState({
            orderPagination: {
              ...orderPagination,
              offset: 0,
            },
            filters: {
              ...filters,
              [field]: $el.value,
            },
          })

          handleDateChange()
        },
        close: () => {
          $el.blur()
        },
      })
    }

    setDatePicker($start, 'beginDateAt')
    setDatePicker($end, 'endDateAt')
  }

  getStoreZoneDate(date) {
    const {
      store_time_zone: storeTimeZone,
    } = this.context.settings

    const localDate = date ? new Date(date) : new Date()
    const localTime = localDate.getTime()
    const localOffset = localDate.getTimezoneOffset() * 60000
    const utcTime = localTime + localOffset
    const timeZone = storeTimeZone
    const zonetime = utcTime + (3600000 * timeZone)
    const zoneDate = new Date(zonetime)

    return zoneDate
  }

  getListItem($tr) {
    const {
      orderList,
    } = this.state

    const {
      productId,
      variantId,
    } = $tr.dataset

    return orderList.find(item => (item.productId === productId) && (item.variantId === variantId))
  }

  bindQtyEvents() {
    const setListItem = item => {
      const {
        orderList,
      } = this.state

      this.setState({
        orderList: orderList.map(listItem => {
          let itemObj = {}
          if ((item.productId === listItem.productId) && (item.variantId === listItem.variantId)) {
            itemObj = item
          }
          return {
            ...listItem,
            ...itemObj,
          }
        }),
      })
    }

    this.utils.on('[data-product-id]', 'click', 'btn-qty-decrease', $tr => {
      const listItem = this.getListItem($tr)
      listItem.qty -= listItem.qtyIncrement
      if (listItem.qty <= listItem.minOrderQty) {
        listItem.qty = +listItem.minOrderQty
      }

      setListItem(listItem)
      this.renderOrderList()
    })

    this.utils.on('[data-product-id]', 'click', 'btn-qty-increase', $tr => {
      const listItem = this.getListItem($tr)
      listItem.qty += +listItem.qtyIncrement

      setListItem(listItem)
      this.renderOrderList()
    })

    this.utils.on('[data-product-id]', 'change', 'qty-input', ($tr, target) => {
      const listItem = this.getListItem($tr)
      const value = +target.value
      if (typeof value === 'number' && String(value) !== 'NaN') {
        if (value <= listItem.minOrderQty) {
          listItem.qty = +listItem.minOrderQty
        } else listItem.qty = value
      } else {
        listItem.qty = +listItem.minOrderQty
      }

      setListItem(listItem)
      // this.renderOrderList()
    })
  }

  bindActionEvents() {
    const {
      B3RoleId,
    } = this.utils.B3Storage

    this.utils.on('[data-product-id]', 'click', 'add-to-cart', async $tr => {
      const listItem = this.getListItem($tr)
      if (B3RoleId.value === B3Role.JUNIOR) return

      if (!listItem.qty) {
        this.utils.Alert.error(validation.emptyQty)
        return
      }

      const {
        qty: quantity,
        productId,
        variantId,
      } = listItem

      window.B3Spinner.show()
      try {
        await addProducts({
          lineItems: [{
            quantity,
            productId,
            variantId,
          }],
        })
        this.utils.Alert.success('success')
      } catch {
        const { productId, variantId } = listItem
        const products = [{
          productId,
          variantId,
        }]
        const { list } = await this.api.getInventory({ products })

        if (!list.length) {
          this.utils.Alert.error(tips.buyAgainFailedNoLongerForSale)
          window.B3Spinner.hide()
          return
        }

        const hasOutStock = list[0].productInventoryLevel
        const hasUnVisible = list[0].isVisible
        const isShowStorefront = list[0].purchasingDisabled

        if (!hasOutStock || listItem.qty > hasOutStock) this.utils.Alert.error(tips.buyAgainFailedOutOfStock)
        else if (!hasUnVisible || isShowStorefront) this.utils.Alert.error(tips.buyAgainFailedNoLongerForSale)
      }
      window.B3Spinner.hide()
    })

    this.utils.on('[data-product-id]', 'click', 'add-shopping-list', $tr => {
      const listItem = this.getListItem($tr)
      if (!listItem.qty) {
        this.utils.Alert.error(validation.emptyQty)
        return
      }

      this.setState({
        itemAddToshoppingList: listItem,
      })

      this.openShoppingListModal()
    })
  }

  async openShoppingListModal() {
    const {
      shoppingListModal,
      shouldUpdateShoppingList,
    } = this.state

    let $modal = shoppingListModal

    if (!shoppingListModal) {
      $modal = new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      })

      this.setState({
        shoppingListModal: $modal,
      })
    }

    if (shouldUpdateShoppingList) await this.getShoppingList()

    $modal.open()
    this.renderShoppingListModalContent()
  }

  async getShoppingList() {
    const {
      shoppingListPagination,
      shoppingListPagination: {
        offset,
        limit,
      },
      shoppingListSelectedId,
      isShowAll,
    } = this.state

    window.B3Spinner.show()
    try {
      const {
        list,
        pagination,
      } = await this.api.getShoppingListsInfo({
        offset,
        limit,
        isShowAll,
      })

      this.setState({
        shouldUpdateShoppingList: false,
        shoppingListPagination: {
          ...shoppingListPagination,
          ...pagination,
        },
        shoppingList: list.map(item => {
          const obj = item
          if (obj.id === shoppingListSelectedId) {
            obj.active = true
          }
          return obj
        }),
      })
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  renderShoppingListModalContent() {
    const {
      shoppingListModal,
      shoppingList,
    } = this.state

    const list = shoppingList.map(item => {
      let className = ''
      if (item.active) className = 'active'

      return {
        ...item,
        className,
      }
    })

    const modalContent = shoppingListModalContent({
      list,
    })

    shoppingListModal.setContent(modalContent)
    this.renderShoppingListPaginator()

    const handleClose = () => shoppingListModal.close()

    const $closes = document.querySelectorAll('.modal-close')
    const $add = document.querySelector('.modal-body #add_to_shoppingList')
    const $lis = document.querySelectorAll('.shopping-list-wraper li')
    const $addNew = document.querySelector('#add-new-shopping-list')

    $add.addEventListener('click', this.addToShoppingList)
    $addNew.addEventListener('click', this.openCreateShoppingListModal)
    $closes.forEach($close => $close.addEventListener('click', handleClose))
    $lis.forEach($li => {
      $li.addEventListener('click', () => {
        const shoppingListSelectedId = +$li.dataset.listId
        const selectediList = shoppingList.map(item => {
          item.active = false
          if (item.id === shoppingListSelectedId) {
            item.active = true
          }
          return item
        })

        this.setState({
          shoppingListSelectedId,
          shoppingList: selectediList,
        })

        this.renderShoppingListModalContent()
      })
    })
  }

  renderShoppingListPaginator() {
    const {
      shoppingListPagination: {
        offset,
        limit,
        totalCount,
      },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#shoppingList-pagination',
      currentPage,
      totalPages,
      onPageChange: this.handleShoppingListPaginationChange,
    })
  }

  handleShoppingListPaginationChange = async page => {
    const {
      shoppingListPagination,
      shoppingListPagination: {
        limit,
      },
    } = this.state

    this.setState({
      shoppingListPagination: {
        ...shoppingListPagination,
        offset: (page - 1) * limit,
      },
    })

    const overlayClass = 'loadingOverlay'
    this.utils.renderTemplate({
      containerSelector: '.modal-body',
      template: `<div class='${overlayClass}' style='display: block;'/>`,
    })

    await this.getShoppingList()
    this.renderShoppingListModalContent()
  }

  addToShoppingList = async () => {
    const {
      Alert,
    } = this.utils

    const {
      shoppingListSelectedId,
      itemAddToshoppingList,
      shoppingListModal,
    } = this.state

    if (!shoppingListSelectedId || !itemAddToshoppingList) {
      Alert.error(tips.choiceShopppingList)
      return
    }

    shoppingListModal.close()

    const {
      productId,
      variantId,
      qty,
      optionList,
    } = itemAddToshoppingList

    const convertOptionList = optionList.map(option => {
      const { product_option_id: optionId, value } = option
      return {
        option_id: `attribute[${optionId}]`,
        option_value: value,
      }
    })

    window.B3Spinner.show()
    try {
      await this.api.addProductToShoppingList({
        id: shoppingListSelectedId,
        items: [{
          productId,
          variantId,
          qty,
          optionList: convertOptionList,
        }],
      })
      Alert.success(tips.addToShoppingListSuccess)
    } catch (error) {
      Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  openCreateShoppingListModal = () => {
    const {
      shoppingListModal,
      createShopingListModal,
    } = this.state

    shoppingListModal.close()

    let $modal = createShopingListModal

    if (!createShopingListModal) {
      $modal = new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      })

      this.setState({
        createShopingListModal: $modal,
      })
    }

    $modal.open()
    this.renderCreateShoppingListModalContent()
  }

  renderCreateShoppingListModalContent() {
    const {
      createShopingListModal,
    } = this.state

    const modalContent = createShoppingListModalContent()
    createShopingListModal.setContent(modalContent)

    const handleClose = () => createShopingListModal.close()

    const $closes = document.querySelectorAll('.modal-close')
    const $listName = document.querySelector('#list_name')
    const $addNew = document.querySelector('#add_new_shoppingList')

    $closes.forEach($close => $close.addEventListener('click', handleClose))
    $listName.addEventListener('input', e => {
      if (!e.target.value) {
        $listName.nextElementSibling.style.setProperty('display', 'block')
      } else {
        $listName.nextElementSibling.style.setProperty('display', 'none')
      }
    })

    $addNew.addEventListener('click', async e => {
      const name = $listName.value
      const description = document.querySelector('#list_comment').value

      e.preventDefault()

      if (!name) {
        this.utils.Alert.error(this.locales.validation.emptyShoppingListName)
        return
      }
      $addNew.setAttribute('disabled', true)

      await this.createShopingList(name, description)

      $addNew.setAttribute('disabled', false)
    })
  }

  async createShopingList(name, description) {
    const {
      createShopingListModal,
    } = this.state

    const {
      B3RoleId,
    } = this.utils.B3Storage

    let status = '30'

    const {
      ADMIN,
      SENIOR,
      SALESREP,
    } = B3Role

    if ([ADMIN, SENIOR, SALESREP].includes(B3RoleId.value)) {
      status = '0'
    }

    createShopingListModal.close()

    window.B3Spinner.show()
    try {
      const {
        shopplistId,
      } = await this.api.createShopingList({
        name,
        description,
        status,
      })

      this.setState({
        shoppingListSelectedId: shopplistId,
        shouldUpdateShoppingList: true,
      })

      await this.addToShoppingList()
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }
}

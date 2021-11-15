import BasePage from '../../common/BasePage'
import { tips } from '../../common/locales'
import { B3Role, B3CompanyStatus } from '../../common/utils/constants'
import addProducts from '../../common/api/addProducts'
import createShoppingListModalContent from '../buyAgain/createShoppingListModalContent.html'
import shoppingListModalContent from '../buyAgain/shoppingListModalContent.html'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class Orders extends BasePage {
  constructor() {
    super()
    this.name = 'Orders'
    this.state = {
      isShowAll: '0',
      orderList: [],
      isShowFilter: false,
      filterBoxEl: null,
      filters: {
        orderNumber: '',
        companyName: '',
        poNumber: '',
        createdBy: '',
        beginDateAt: '',
        endDateAt: '',
      },
      orderBy: 'bcOrderId',
      sortBy: 'DESC',
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
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
      productDatas: [],
      shopplistId: '',
    }
  }

  get tableToolBar() {
    return `${this.tableToolbar}${this.companySearchInput}${this.dataFromComponent}`
  }

  get tableToolbar() {
    return `
    <div class="table-toolbar top">
        <div class="action-links ${this.classes['orders.statusActions.container']}" data-value="0">
            <a class="action-link button button--small ${this.classes['orders.button.showAll']}" href="javascript:void(0);" filter-user data-user-value="0" style="display:none;">${this.text['orders.show.all.button']}</a>
            <a class="action-link button button--small ${this.classes['orders.button.showMy']}" href="javascript:void(0);" filter-user data-user-value="1">${this.text['orders.show.my.button']}</a>
        </div>
    </div>
    `
  }

  get companySearchInput() {
    return `
    <div class="orders-search-company ${this.classes['orders.search.container']}">
        <div class="form-field">
            <input class="form-input ${this.classes['orders.search.input']}" type="text" id="search-company-input" name="search-company-input" placeholder="${this.text['orders.search.placeholder']}">
        </div>
        <div class="form-field">
            <button class="button button--search ${this.classes['orders.search.button']}" type="button" id="search-company" name="search-company"><i class="fa fa-search ${this.classes['orders.search.button.icon']}"></i></button>
        </div>
    </div>
    <a class="button button--small button-filter ${this.classes['orders.search.filters.button']}" href="javascript:void(0);" style='margin: 0 1rem; float: left; height: 36px;line-height: 20px; margin-top: 10px;'><i class="fa fa-filter ${this.classes['orders.search.filters.button']}"></i>${this.text['orders.filters.label']}</a>
    `
  }

  get dataFromComponent() {
    return `
    <div class="filter-by-date ${this.classes['orders.dateFilter.container']}">
        ${this.text['buyAgain.datePicker.from.label']}
        <input class="${this.classes['orders.dateFilter.from.input']}" type="text" id="orderFromDate" readOnly />
        ${this.text['buyAgain.datePicker.to.label']}
        <input class="${this.classes['orders.dateFilter.to.input']}" type="text" id="orderToDate" readOnly />
    </div>
    `
  }

  get selerRepHasCompnay() {
    return `${this.tableToolbar} ${this.companySearchInput}${this.dataFromComponent}`
  }

  get selerRepNoCompnay() {
    return `${this.companySearchInput} ${this.dataFromComponent}`
  }

  async init() {
    if (!this.isB2BUser) return

    this.initPage()
    this.bindDatePicker()
    this.initBtn()
    this.initMobileTable([0])
    themeStyleFix.editModalBoxStyleFix()
  }

  initPage() {
    const { B3RoleId } = this.utils.B3Storage
    const {
      orders: { container },
    } = this.doms
    const { ADMIN, SENIOR, JUNIOR } = B3Role
    const roleId = B3RoleId.value
    const $container = document.querySelector(container)

    $container.className = `b2b-wrap order-lists-wrap ${this.classes.b2bWrap}`

    if ([ADMIN, SENIOR, JUNIOR].includes(roleId)) {
      this.initAdminSenior()
      this.initConment()
    } else {
      this.initSelerRep()
    }

    this.hidebtn()
  }

  initAdminSenior() {
    const $content = document.querySelector('.account-content')
    $content.innerHTML = ''
    $content.insertAdjacentHTML('afterbegin', this.tableToolBar)
  }

  initConment() {
    const $content = document.querySelector('.account-content')
    $content.insertAdjacentHTML(
      'beforeend',
      `
      <div class="table-wrap ${this.classes.Orders}">
            <table class="responsive-table order-lists-table">
                <thead class="sort-thead">
                    <tr>
                        <th></th>
                        <th class="t-align-c" data-sort-th data-sort-filter="bcOrderId">
                        ${this.text['orders.thead.orderNumber']}
                        <span class="filter-icon" data-sort-th data-sort-filter="bcOrderId"></span></th>
                        <th class="t-align-c" data-sort-th data-sort-filter="totalIncTax">
                        ${this.text['orders.thead.total']}
                        <span class="filter-icon" data-sort-th data-sort-filter="totalIncTax"></span></th>
                        <th class="t-align-c">
                        ${this.text['orders.thead.po']}
                        </th>
                        <th class="t-align-c" data-sort-th data-sort-filter="createdAt">
                        ${this.text['orders.thead.placed']}
                        <span class="filter-icon" data-sort-th data-sort-filter="createdAt"></span></th>
                        <th class="t-align-c">
                        ${this.text['orders.thead.updated']}
                        </th>
                        <th class="t-align-c">
                        ${this.text['orders.thead.created']}
                        </th>
                        <th class="t-align-c">
                        ${this.text['orders.thead.status']}
                        </th>
                        <th class="t-align-c">
                        ${this.text['orders.thead.action']}
                        </th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
            </div>
            <div class="pagination">
    <ul class="pagination-list" id="orders-pagination"></ul>
    </div>
    `,
    )
  }

  hidebtn() {
    const { B3RoleId, B3CompanyStatus: B3CompanyState } = this.utils.B3Storage
    const roleId = B3RoleId.value
    const companyStatus = B3CompanyState.value

    const { JUNIOR, SALESREP } = B3Role

    if (
      roleId === JUNIOR
      || (roleId === SALESREP && companyStatus !== B3CompanyStatus.APPROVED)
    ) {
      const $reorderItems = document.querySelectorAll('[reorder-items]')
      const $addShoppingItems = document.querySelectorAll(
        '[add-shopping-items]',
      )
      const $actions = [...$reorderItems, ...$addShoppingItems]

      $actions.forEach($action => $action.setAttribute('disabled', true))
    }
  }

  initSelerRep() {
    const { B3CompanyStatus: B3CompanyState } = this.utils.B3Storage
    const companyStatus = B3CompanyState.value
    const $content = document.querySelector('.account-content')

    $content.innerHTML = ''

    if (companyStatus === B3CompanyStatus.APPROVED) {
      $content.insertAdjacentHTML('beforeend', this.selerRepHasCompnay)

      $content.insertAdjacentHTML(
        'beforeend',
        `
      <div class="table-wrap ${this.classes.Orders}">
        <table class="responsive-table order-lists-table">
            <thead class="sort-thead">
                <tr>
                  <th></th>
                  <th class="t-align-c" data-sort-th data-sort-filter="bcOrderId">${this.text['orders.thead.orderNumber']}<span class="filter-icon" data-sort-th data-sort-filter="bcOrderId"></span></th>
                  <th class="t-align-c" data-sort-th data-sort-filter="totalIncTax">${this.text['orders.thead.total']}<span class="filter-icon" data-sort-th data-sort-filter="totalIncTax"></span></th>
                  <th class="t-align-c">${this.text['orders.thead.po']}</th>
                  <th class="t-align-c" data-sort-th data-sort-filter="createdAt">${this.text['orders.thead.placed']}<span class="filter-icon" data-sort-th data-sort-filter="createdAt"></span></th>
                  <th class="t-align-c">${this.text['orders.thead.updated']}</th>
                  <th class="t-align-c">${this.text['orders.thead.created']}</th>
                  <th class="t-align-c">${this.text['orders.thead.status']}</th>
                  <th class="t-align-c">${this.text['orders.thead.action']}</th>
                </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="pagination">
          <ul class="pagination-list" id="orders-pagination"></ul>
        </div>
    `,
      )
    } else {
      $content.insertAdjacentHTML('beforeend', this.selerRepNoCompnay)
      $content.insertAdjacentHTML(
        'beforeend',
        `
      <div class="table-wrap ${this.classes.Orders}">
        <table class="responsive-table order-lists-table">
            <thead class="sort-thead">
                <tr>
                  <th></th>
                  <th class="t-align-c" data-sort-th data-sort-filter="bcOrderId">${this.text['orders.thead.orderNumber']}<span class="filter-icon" data-sort-th data-sort-filter="bcOrderId"></span></th>
                  <th class="t-align-c" data-sort-th data-sort-filter="totalIncTax">${this.text['orders.thead.grandTotal']}<span class="filter-icon" data-sort-th data-sort-filter="totalIncTax"></span></th>
                  <th class="t-align-c">${this.text['orders.thead.po']}</th>
                  <th class="t-align-c" data-sort-th data-sort-filter="createdAt">${this.text['orders.thead.purchaseDate']}<span class="filter-icon" data-sort-th data-sort-filter="createdAt"></span></th>
                  <th class="t-align-c">${this.text['orders.thead.status']}</th>
                  <th class="t-align-c">${this.text['orders.thead.companyName']}</th>
                  <th class="t-align-c">${this.text['orders.thead.placedBy']}</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
        </div>
        <div class="pagination">
    <ul class="pagination-list" id="orders-pagination"></ul>
    </div>
    `,
      )
    }
  }

  bindDatePicker() {
    const { DateTime } = this.utils
    const defaultEndDate = this.getStoreZoneDate()
    const defaultStartDate = this.getStoreZoneDate()
    defaultStartDate.setMonth(defaultStartDate.getMonth() - 1)

    const $start = document.querySelector('#orderFromDate')
    const $end = document.querySelector('#orderToDate')

    // $start.value = DateTime.getMonthDayYear(defaultStartDate.getTime() / 1000)
    // $end.value = DateTime.getMonthDayYear(defaultEndDate.getTime() / 1000)

    $start.value = window.B3DisplayFormat(defaultStartDate)
    $end.value = window.B3DisplayFormat(defaultEndDate)

    const handleDateChange = () => {
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

      if ($end.value && $start.value) {
        document.querySelectorAll('th.asc').forEach($th => {
          $th.classList.remove('asc')
        })
        this.renderTable()
      }
    }

    const setDatePicker = ($el, field) => {
      this.state.filters[field] = $el.value
      window.B3DatePicker($el, {
        mode: 'dp-modal',
        max: defaultEndDate,
        clear: false,
        format(date) {
          // return DateTime.getMonthDayYear(date.getTime() / 1000)
          return window.B3DisplayFormat(date)
        },
        parse(dateStr) {
          const date = new Date(DateTime.displayParse(dateStr))
          return isNaN(date) ? new Date() : date
        },
      }).on({
        select: () => {
          const {
            filters,
            pagination,
          } = this.state

          this.setState({
            pagination: {
              ...pagination,
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
    this.observeToHideClear()

    this.renderTable()
  }

  observeToHideClear() {
    const hideClear = () => {
      const $clear = document.querySelector('.dp-cal-footer .dp-clear')
      if ($clear) $clear.remove()
    }

    const bodyObserver = new MutationObserver(() => {
      hideClear()
    })

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
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

  async renderTable() {
    const {
      B3RoleId,
      B3CompanyStatus: B3CompanyState,
    } = this.utils.B3Storage
    const {
      currencyFormat,
      DateTime,
    } = this.utils

    const roleId = B3RoleId.value
    const companyStatus = B3CompanyState.value

    const $orderListsTbody = document.querySelector('.order-lists-table tbody')

    window.B3Spinner.show()

    try {
      const {
        list,
        paginator,
      } = await this.getOrderList()

      this.setState({
        orderList: list,
        pagination: paginator,
      })

      const idList = []
      let frage = ''

      list.forEach(item => {
        const id = String(item.orderId)
        idList.push(id)
        const createTime = DateTime.getStoreZoneDate(new Date(parseInt(item.createdAt, 10) * 1000))
        const updateTime = DateTime.getStoreZoneDate(new Date(parseInt(item.updatedAt, 10) * 1000))
        if (roleId === B3Role.SALESREP && companyStatus !== B3CompanyStatus.APPROVED) {
          frage += `
                  <tr data-order-id="${item.orderId}" data-order-status="${item.customOrderStatus}">
                  <td class="col-thumbnail"><img src="" alt=""></td>
                    <td class="t-align-c"><a href="/order-detail/?id=${item.orderId}">#${item.orderId}</a></td>
                    <td class="t-align-c">${currencyFormat(item.totalIncTax)}</td>
                    <td class="t-align-c">${item.poNumber}</td>
                    <td class="t-align-c">${window.B3DisplayFormat(createTime)}</td>
                    <td class=" t-align-c"><span class="account-orderStatus-label order-status-text">${item.customOrderStatus}</span></td>
                    <td class="t-align-c">${item.companyName}</td>
                    <td class="t-align-c">${item.firstName}  ${item.lastName}</td>
                  </tr>
                  `
        } else {
          frage += `
                <tr data-order-id="${item.orderId}" data-order-status="${item.customOrderStatus}">
                <td class="col-thumbnail"><img src="" alt=""></td>
                <td class="t-align-c"><a href="/order-detail/?id=${item.orderId}">#${item.orderId}</a></td>
                <td class="t-align-c">${currencyFormat(item.totalIncTax)}</td>
                <td class="t-align-c">${item.poNumber}</td>
                <td class="t-align-c">${window.B3DisplayFormat(createTime)}</td>
                <td class="t-align-c">${window.B3DisplayFormat(updateTime)}</td>
                <td class="t-align-c">${item.firstName}  ${item.lastName}</td>
                <td class=" t-align-c"><span class="account-orderStatus-label order-status-text">${item.customOrderStatus}</span></td>
                <td class="actions-field">
                  <a href="javascript:void(0);" class="reorder-button button button--primary button--small reorder-items" reorder-items  ${roleId === B3Role.JUNIOR ? 'disabled' : ''}>${this.text['orders.reorder.button']}</a>
                  <a href="javascript:void(0);" class="shoppinglist-button button button--small add-shopping-items" add-shopping-items>${this.text['orders.add.to.new.shopping.list.button']}</a>
                </td>
              </tr>
                    `
        }
      })

      $orderListsTbody.innerHTML = frage
      this.renderPaginator()
      this.bindItemEvents()
      // this.renderImage(idList)
    } catch (error) {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  getOrderList() {
    const { DateTime } = this.utils
    let q = ''
    let isShowMy = '0'
    const $input = document.querySelector('#search-company-input')
    const $iShowMy = document.querySelector('.action-links')
    if ($input) q = $input.value.trim()
    if ($iShowMy) isShowMy = $iShowMy.dataset.value

    const {
      filters,
      filters: {
        beginDateAt,
        endDateAt,
      },
      pagination: {
        offset,
        limit,
      },
      orderBy,
      sortBy,
    } = this.state

    const data = {
      ...filters,
      limit,
      offset,
      orderBy,
      sortBy,
      isShowMy,
      q,
      beginDateAt: DateTime.displayParse(beginDateAt),
      endDateAt: DateTime.displayParse(endDateAt),
    }

    return new Promise(resolve => {
      this.api.getOrderList(data).then(res => {
        resolve(res)
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
      container: '#orders-pagination',
      currentPage,
      totalPages,
      onPageChange: page => {
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

        this.renderTable()
      },
    })
  }

  async renderImage(orderIds) {
    if (!orderIds.length) return

    window.B3Spinner.show()
    try {
      const products = await this.api.getOrderListImage({ orderIds })
      const $items = document.querySelectorAll('tr[data-order-id]')
      $items.forEach($item => {
        const id = $item.dataset.orderId
        products.forEach(product => {
          const {
            imageUrl,
            orderId,
          } = product
          if (id === orderId) {
            $item.querySelector('.col-thumbnail img').src = imageUrl
          }
        })
      })
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  initBtn() {
    const $userFilters = document.querySelectorAll('[filter-user]')
    const $searchBtn = document.querySelector('#search-company')
    const $searchInput = document.querySelector('#search-company-input')
    const $filterSwitchBtn = document.querySelector('.button-filter')
    const $sortThs = document.querySelectorAll('th[data-sort-th]')
    const $sortThsParent = document.querySelector('.order-lists-table thead tr')

    const search = () => {
      const {
        pagination,
      } = this.state
      this.setState({
        pagination: {
          ...pagination,
          offset: 0,
        },
      })
      this.renderTable()
    }

    $sortThs.forEach($sortTh => {
      $sortTh.addEventListener('click', () => {
        const isAsc = $sortTh.classList.contains('asc')
        const orderBy = $sortTh.dataset.sortFilter
        const $asc = $sortThsParent.querySelector('.asc')

        let sortBy

        if (isAsc) {
          $sortTh.classList.remove('asc')
          sortBy = 'DESC'
        } else {
          sortBy = 'ASC'
          if ($asc) $asc.classList.remove('asc')
          $sortTh.classList.add('asc')
        }

        this.setState({
          orderBy,
          sortBy,
        })

        search()
      })
    })

    $userFilters.forEach($userFilter => {
      $userFilter.addEventListener('click', () => {
        const value = $userFilter.dataset.userValue
        $userFilter.parentNode.dataset.value = value
        $userFilters.forEach($f => $f.style.display = 'inline-block')
        $userFilter.style.display = 'none'

        search()
      })
    })

    $searchBtn.addEventListener('click', () => this.handleInputSearch(() => {
      search()
    }))
    $searchInput.addEventListener('input', () => this.handleInputSearch(() => {
      search()
    }))

    $filterSwitchBtn.addEventListener('click', e => {
      e.stopPropagation()
      this.toggleFilters()
    })
  }

  bindItemEvents() {
    this.utils.on('.order-lists-table tbody tr', 'click', 'reorder-items', async ($tr, $target) => {
      const cartId = $tr.dataset.orderId

      if ($target.getAttribute('disabled') !== null) return

      window.B3Spinner.show()
      const data = await this.api.getOrderProducts(cartId)
      const addProductsData = {
        lineItems: [],
      }
      addProductsData.lineItems = data.map(item => ({
        quantity: item.quantity,
        productId: item.productId,
        variantId: item.variantId,
      }))
      try {
        await addProducts(addProductsData)
        this.utils.Alert.success('success')
      } catch {
        const products = addProductsData.lineItems

        const { list } = await this.api.getInventory({ products })

        const messages = []

        const hasOutStock = list.some(item => item.productInventoryLevel < item.quantity)
        const hasUnVisible = list.some(item => !item.isVisible)
        const isShowStorefront = list.some(item => item.purchasingDisabled)

        if (hasOutStock) messages.push(tips.reorderFailedOutOfStock)
        if (hasUnVisible || (list.length !== products.length) || isShowStorefront) messages.push(tips.reorderFailedNoLongerForSale)

        this.utils.Alert.error(messages.join('. '))
      }

      window.B3Spinner.hide()
    })

    this.utils.on('.order-lists-table tbody tr', 'click', 'add-shopping-items', async ($tr, $target) => {
      const cartId = $tr.dataset.orderId

      if ($target.getAttribute('disabled') !== null) return

      window.B3Spinner.show()
      try {
        const productDatas = await this.api.getOrderProducts(cartId)
        this.setState({
          itemAddToshoppingList: productDatas,
        })

        // this.openCreateShoppingListModal()
        this.openShoppingListModal()
      } catch {
        this.utils.Alert.error(tips.globalError)
      }
      window.B3Spinner.hide()
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

  addToShoppingList = async () => {
    const {
      Alert,
    } = this.utils

    const {
      shoppingListSelectedId,
      itemAddToshoppingList,
      shoppingListModal,
    } = this.state

    const items = itemAddToshoppingList.map(item => {
      const { optionList } = item
      item.qty = item.quantity
      return {
        ...item,
        optionList: optionList.map(({ option_id: optionId, option_value: optionValue }) => ({
          option_id: `attribute[${optionId}]`,
          option_value: optionValue,
        })),
      }
    })

    this.setState({
      itemAddToshoppingList: items,
    })

    if (!shoppingListSelectedId || !itemAddToshoppingList) {
      Alert.error(tips.choiceShopppingList)
      return
    }

    shoppingListModal.close()

    window.B3Spinner.show()
    try {
      await this.api.addProductToShoppingList({
        id: shoppingListSelectedId,
        items,
      })
      Alert.success(tips.addToShoppingListSuccess)
    } catch (error) {
      Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  openCreateShoppingListModal = () => {
    const {
      createShopingListModal,
    } = this.state

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
      shoppingListModal,
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
    shoppingListModal.close()

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
        shopplistId,
        shoppingListSelectedId: shopplistId,
      })

      await this.addToShoppingList()
    } catch (error) {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  toggleFilters() {
    const {
      isShowFilter,
      filterBoxEl,
    } = this.state
    const isShow = !isShowFilter

    if (!filterBoxEl) {
      return this.renderFilterBox()
    }
    if (isShow) filterBoxEl.style.display = 'flex'
    else filterBoxEl.style.display = 'none'

    this.setState({
      isShowFilter: isShow,
    })
  }

  renderFilterBox() {
    const boxTemplate = `<div class="orders filter-box ${this.classes.Orders} ${this.classes['orders.search.filters.container']}"></div>`
    document.querySelector('.table-wrap').insertAdjacentHTML('beforebegin', boxTemplate)

    const filterBoxEl = document.querySelector('.filter-box')
    this.setState({
      filterBoxEl,
    })
    this.renderFilters()
  }

  renderFilters() {
    const {
      filters: {
        orderNumber,
        companyName,
        poNumber,
        createdBy,
      },
      filterBoxEl,
    } = this.state
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage

    const roleId = B3RoleId.value
    const companyId = B3CompanyId.value

    let filtersInputParams = Object.keys({
      orderNumber,
      companyName,
      poNumber,
      createdBy,
    })

    const getInputGroup = (content, extraClass = '') => `
      <div class="filter-items ${extraClass} ${this.classes['orders.search.filters.items.container']}">
       ${content}
      </div>
    `

    const buttonGroup = getInputGroup(`
      <a class="button button--small ${this.classes['orders.search.filters.button.clear']}" id="filter_cancel_button" href="javascript:void(0);">${this.text['orders.filters.clear']}</a>
      <a class="button button--primary button--small ${this.classes['orders.search.filters.button.apply']}" id="filter_apply_button" href="javascript:void(0);">${this.text['orders.filters.apply']}</a>
    `, `filter-btn-items ${this.classes['orders.search.filters.actions.container']}`)

    const getInputFieldsTemplate = inputParams => inputParams.reduce((result, item) => {
      const text = `
        <div class="form-field ${this.classes['orders.search.filters.item.container']}" style='margin-right: 12px;margin-bottom: 1em;'>
          <label class="form-label ${this.classes['orders.search.filters.item.label']}" for="filter-${item}">${this.text[`orders.filters.${item}.label`]}</label>
          <input class="form-input--small form-input ${this.classes['orders.search.filters.item.input']}" type="text" name="filter-${item}" data-key='${item}'>
        </div>
        `
      return result + text
    }, '')

    if (roleId === B3Role.SALESREP && !companyId) {
      filtersInputParams = filtersInputParams.filter(item => item !== 'createdBy')
    } else {
      filtersInputParams = filtersInputParams.filter(item => item !== 'companyName')
    }

    const filtersInputContent = getInputFieldsTemplate(filtersInputParams)
    const filterInputsGroup = getInputGroup(filtersInputContent)

    filterBoxEl.insertAdjacentHTML('beforeend', filterInputsGroup)

    filterBoxEl.insertAdjacentHTML('beforeend', buttonGroup)

    document.querySelector('#filter_cancel_button').addEventListener('click', () => {
      const {
        filters,
        filterBoxEl,
        pagination,
      } = this.state

      this.setState({
        filters: {
          ...filters,
          orderNumber: '',
          companyName: '',
          poNumber: '',
          createdBy: '',
        },
        pagination: {
          ...pagination,
          offset: 0,
        },
      })

      filterBoxEl.innerHTML = ''
      this.renderFilters()
      this.renderTable()
    })

    const $inputFilters = document.querySelectorAll('input[name^="filter-')
    $inputFilters.forEach($inputFilter => {
      $inputFilter.addEventListener('input', () => {
        const {
          filters,
        } = this.state
        const { key } = $inputFilter.dataset
        const { value } = $inputFilter

        this.setState({
          filters: {
            ...filters,
            [key]: value,
          },
        })
      })
    })

    document.querySelector('#filter_apply_button').addEventListener('click', () => {
      const {
        pagination,
      } = this.state

      this.setState({
        pagination: {
          ...pagination,
          offset: 0,
        },
      })

      this.renderTable()
    })
  }
}

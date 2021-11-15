import BasePage from '../../common/BasePage'
import orderDetailTemplate from './orderDetail.html'
import createShoppingListModalContent from '../buyAgain/createShoppingListModalContent.html'
import shoppingListModalContent from '../buyAgain/shoppingListModalContent.html'
import { tips } from '../../common/locales'
import { B3Role } from '../../common/utils/constants'
import addProducts from '../../common/api/addProducts'
import DateTime from '../../common/utils/DateTime'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class Orderdetail extends BasePage {
  constructor() {
    super()
    this.name = 'Orderdetail'
    this.state = {
      isShowAll: '0',
      id: '',
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

  async init() {
    const id = this.utils.urlHelper.searchParams.get('id')
    if (!this.isB2BUser || !id) return window.location.href = '/account.php?action=order_status'

    this.setState({
      id,
    })

    this.initPage()

    this.render()
    themeStyleFix.editModalBoxStyleFix()
  }

  initPage() {
    const {
      orderDetail: {
        container,
      },
    } = this.doms

    this.utils.renderTemplate({
      hbsTemplate: orderDetailTemplate,
      containerSelector: container,
      insertType: 'beforeend',
    })
  }

  async render() {
    const {
      currencyFormat,
    } = this.utils

    const bypassCustomerId = this.context.customer.id
    // fix a url bug
    document.querySelector('head').insertAdjacentHTML('beforeend', `<style>.navBar-item.is-active{
        cursor: pointer;
    }</style>`)

    // for init date picker, new Date()

    const dateStyle = data => {
      const date = new Date(data)
      const year = date.getFullYear()
      const month = new Array(12)
      month[0] = 'January'
      month[1] = 'February'
      month[2] = 'March'
      month[3] = 'April'
      month[4] = 'May'
      month[5] = 'June'
      month[6] = 'July'
      month[7] = 'August'
      month[8] = 'September'
      month[9] = 'October'
      month[10] = 'November'
      month[11] = 'December'
      const currentMonth = month[date.getMonth()]
      const day = date.getDate()
      return (`${day}th ${currentMonth} ${year}`)
    }

    const loadData = async () => {
      const {
        id: orderID,
      } = this.state
      const {
        B3CompanyStatus,
      } = this.utils.B3Storage

      window.B3Spinner.show()
      try {
        const data = await this.api.getOrderDetail(orderID)

        const order = data
        const orderId = order.id
        const orderTotal = order.total_inc_tax
        const orderStatus = order.custom_status

        const orderCreatedDate = DateTime.getStoreZoneDate(new Date(order.date_created))
        const orderCreatedDateFormatted = window.B3DisplayFormat(orderCreatedDate)

        let isOwn = false
        if (order.customer_info && order.customer_info.id === bypassCustomerId) {
          isOwn = true
        }

        document.querySelector('.page-heading').innerHTML = `Order # ${orderId}`
        const orderTitle = `
                <h3 class="account-heading ${this.classes['order.content.title']}">
                  ${this.text['order.contents']}
                </h3>
                <ul class="account-list order-list-container ${this.classes['order.content.list.container']}"></ul>`
        document.querySelector('.account-content').insertAdjacentHTML('afterbegin', `${orderTitle}`)

        const orderItemsHtml = ''
        if (data.products) {
          const addProductsData = {
            lineItems: [],
          }
          addProductsData.lineItems = data.products.map(item => ({
            productId: item.product_id,
            variantId: item.variant_id,
          }))

          const products = addProductsData.lineItems
          const { list } = await this.api.getInventory({ products })
          const tempVisbleMap = {}

          list.forEach(item => {
            const { productId } = item
            tempVisbleMap[productId] = { ...item }
          })

          data.products.forEach(item => {
            const { product_id: id } = item
            const mergeData = tempVisbleMap[id]
            if (mergeData) {
              const { productInventoryLevel, isVisible, purchasingDisabled } = mergeData
              item.productInventoryLevel = productInventoryLevel
              item.isVisible = isVisible
              item.purchasingDisabled = !purchasingDisabled
            }
          })

          data.products.forEach(async (item, i) => {
            const productId = item.product_id

            let frage = ''
            const variantId = item.variant_id
            const { productInventoryLevel } = item
            let optionHtml = ''
            const optionsArr = []

            if (item.product_options) {
              optionHtml += '<dl class="definitionList">'

              item.product_options.forEach(op => {
                optionsArr.push({
                  option_id: `attribute[${op.product_option_id}]`,
                  option_value: op.value,
                })

                optionHtml += `<dt class="definitionList-key">${op.display_name}</dt>
                                                       <dd class="definitionList-value">${op.display_value}</dd>`
              })
              optionHtml += '</dl>'
            }
            let checkIputHtml = ''
            if (variantId && item.isVisible && item.purchasingDisabled) {
              checkIputHtml = `<div class="account-product-checkItem ${this.classes['order.checkbox.container']}">
                                        <input class="form-checkbox" type="checkbox"
                                        id="account-product-id-${variantId}-${i}"
                                        value="${variantId}"
                                        data-variant-id="${variantId}"
                                        data-product-id="${productId}"
                                        data-product-inventory-level="${productInventoryLevel}"
                                        data-qty="${item.quantity}"
                                        data-options='${JSON.stringify(optionsArr)}'
                                        >
                                        <label for="account-product-id-${variantId}-${i}" class="form-label">
                                            <span class="is-srOnly">Checkbox ${variantId} label</span>
                                        </label>
                                    </div>`
            } else {
              checkIputHtml = '<div class="account-product-checkItem"></div>'
            }

            let brandHtml = ''
            if (item.brand) {
              brandHtml += `<h6>${item.brand}</h6>`
            }

            let giftHtml = ''
            if (item.gift_wrapping_name) {
              giftHtml += '<dl class="definitionList">'
              item.product_options.forEach(op => {
                optionHtml += `<dt class="definitionList-key">{{lang 'account.orders.gift_wrapping'}}</dt>
                                                   <dd class="definitionList-value">${op.gift_wrapping_name}</dd>`
              })
              giftHtml += '</dl>'
            }
            let eventDateHtml = ''
            if (item.event_date) {
              eventDateHtml += `
                                <dl class="definitionList">
                                    <dt class="definitionList-key">${item.event_date.name}</dt>
                                    <dd class="definitionList-value">${item.event_date.date}</dd>
                                </dl>`
            }
            frage += `
                            <li class="account-listItem">
                                <div class="account-product account-product--alignMiddle ${this.classes['order.content.list.item.product.container']}">
                                    ${checkIputHtml}
                                    <div class="account-product-body ${this.classes['order.content.list.item.container']}">
                                        <span class="account-product-price ${this.classes['order.content.list.item.price']}">${currencyFormat(item.base_price, true)}</span>
                                        <h5 class="account-product-title ${this.classes['order.content.list.item.title']}">${item.quantity} &#215; ${item.name}</h5>

                                        ${brandHtml}
                                        ${optionHtml}
                                        ${giftHtml}
                                        ${eventDateHtml}
                                    </div>
                                </div>
                                ${!(variantId && item.isVisible && item.purchasingDisabled) ? '<dd>Unfortunately this product is no longer for sale so it cannot be reordered</dd>' : ''}
                            </li>`
            document.querySelector('.order-list-container').insertAdjacentHTML('afterbegin', `${frage}`)
          })
        }

        let orderTotalHtml = `<dl class="account-orderTotal ${this.classes['order.checkInfo.container']}">`
        if (order.subtotal_ex_tax) {
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">Subtotal:</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(order.subtotal_ex_tax, true)}`
        }
        if (order.discount_amount && order.discount_amount > 0) {
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">Discount:</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(order.discount_amount, true)}`
        }
        if (order.coupons && order.coupons.length > 0) {
          const { coupons } = order
          const couponCode = coupons[0].code
          const couponAmount = coupons[0].discount
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">${this.text['order.coupon.code.label']} (${couponCode}):</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(couponAmount, true)}`
        }
        if (order.shipping_cost_inc_tax && order.shipping_cost_inc_tax > 0) {
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">${this.text['order.coupon.shipping.label']}</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(order.shipping_cost_inc_tax, true)}`
        }
        if (order.total_tax && order.total_tax > 0) {
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">${this.text['order.coupon.tax.label']}</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(order.total_tax, true)}`
        }
        if (order.total_inc_tax) {
          orderTotalHtml += `<dt class="account-orderTotal-key ${this.classes['order.checkInfo.dt']}">${this.text['order.coupon.grandTotal.label']}</dt>
                        <dd class="account-orderTotal-value ${this.classes['order.checkInfo.dd']}">${currencyFormat(order.total_inc_tax, true)}`
        }
        orderTotalHtml += '</dl>'
        document.querySelector('.account-content').insertAdjacentHTML('beforeend', `${orderItemsHtml}${orderTotalHtml}`)

        let sideBarHtml = `
                            <section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                                <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.title']}</h3>
                                <dl class="definitionList ${this.classes['order.aside.item.orderInfo.container']}">
                                    <dt class="definitionList-key ${this.classes['order.aside.item.orderInfo.item.label']}">${this.text['order.info.status']}</dt>
                                    <dd class="definitionList-value ${this.classes['order.aside.item.orderInfo.item.value']}">${orderStatus}</dd>
                                    <dt class="definitionList-key ${this.classes['order.aside.item.orderInfo.item.label']}">${this.text['order.info.date']}</dt>
                                    <dd class="definitionList-value ${this.classes['order.aside.item.orderInfo.item.value']}">${orderCreatedDateFormatted}</dd>
                                    <dt class="definitionList-key ${this.classes['order.aside.item.orderInfo.item.label']}">${this.text['order.info.total']}</dt>
                                    <dd class="definitionList-value ${this.classes['order.aside.item.orderInfo.item.value']}">${currencyFormat(orderTotal, true)}</dd>
                                    <dt class="definitionList-key ${this.classes['order.aside.item.orderInfo.item.label']}">${this.text['order.info.payment']}</dt>
                                    <dd class="definitionList-value ${this.classes['order.aside.item.orderInfo.item.label']}">${(order.payment_method === 'PO') ? this.text['order.info.purchase'] : order.payment_method}</dd>
                                </dl>`
        if (isOwn) {
          sideBarHtml += `<button data-print-invoice="/account.php?action=print_invoice&order_id=${orderId}" class="button ${this.classes['order.aside.button.print']}">${this.text['order.print.invoice.button']}</button>
                            </section>`
        }

        sideBarHtml += '</section>'

        let shippingAddress
        let shippingString = ''

        if (data.shippingAddress) {
          if (data.shippingAddress instanceof Array) {
            data.shippingAddress.forEach(addressItem => {
              shippingString += `<ul class="account-order-address ${this.classes['order.aside.address.list.container']}">
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.first_name} ${addressItem.last_name}</li>
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.company}</li>
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.street_1}</li>
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.street_2}</li>
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.city}, ${addressItem.state} ${addressItem.zip}</li>
                                <li class="${this.classes['order.aside.address.list.item']}">${addressItem.country}</li>
                            </ul>`
            })
          } else {
            shippingString = `<ul class="account-order-address ${this.classes['order.aside.address.list.container']}">
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.first_name} ${shippingAddress.last_name}</li>
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.company}</li>
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.street_1}</li>
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.street_2}</li>
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.city}, ${shippingAddress.state} ${shippingAddress.zip}</li>
                            <li class="${this.classes['order.aside.address.list.item']}">${shippingAddress.country}</li>
                        </ul>`
          }
        }
        sideBarHtml += `<section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                                <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.sidebar.shipto']}</h3>
                                ${shippingString}
                            </section>`

        if (data.billing_address) {
          sideBarHtml += `
                            <section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                                <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.sidebar.billto']}</h3>
                                <ul class="account-order-address ${this.classes['order.aside.address.list.container']}">
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.first_name} ${data.billing_address.last_name}</li>
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.company}</li>
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.street_1}</li>
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.street_2}</li>
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.city}, ${data.billing_address.state} ${data.billing_address.zip}</li>
                                    <li class="${this.classes['order.aside.address.list.item']}">${data.billing_address.country}</li>
                                </ul>
                            </section>`
        }

        if (data.shipments && data.shipments.length > 0) {
          let frage = ''
          const { shipments } = data
          shipments.forEach(item => {
            frage += `
                        <dl class="definitionList">
                            <dt class="definitionList-key">${item.date_created ? this.text['order.shipping.date'] : ''}</dt>
                            <dd class="definitionList-value">${dateStyle(item.date_created)}</dd>
                            <dt class="definitionList-key">${item.shipping_provider ? this.text['order.shipping.provider'] : ''}</dt>
                            <dd class="definitionList-value">${item.shipping_provider}</dd>
                            <dt class="definitionList-key">${item.shipping_method ? this.text['order.shipping.method'] : ''}</dt>
                            <dd class="definitionList-value">${item.shipping_method}</dd>
                            <dt class="definitionList-key">${item.tracking_number ? this.text['order.shipping.tracking'] : ''}</dt>
                            <dd class="definitionList-value">
                                ${item.tracking_number}
                            </dd>
                        </dl>`
          })
          sideBarHtml += `
                        <section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                            <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.shipping.title']}</h3>
                            ${frage}
                        </section>
                        `
        }

        if (data.customer_message) {
          let frage = ''
          const items = data.customer_message.split('                   ')
          frage += `
                        <p>${items[0] ? items[0] : ''}</p>
                        <p>${items[1] ? items[1] : ''}</p>
                        `

          sideBarHtml += `
                        <section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                            <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.comment.title']}</h3>
                            ${frage}
                        </section>
                        `
        }
        if (data.poNumber) {
          sideBarHtml += `
                        <section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                            <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.po.title']}</h3>
                            ${data.poNumber}
                        </section>
                        `
        }

        sideBarHtml += `<section class="account-sidebar-block ${this.classes['order.aside.item.container']}">
                            <h3 class="account-heading ${this.classes['order.aside.item.title']}">${this.text['order.actions.title']}</h3>
                            <div class="order-details-info ${this.classes['order.aside.actions.container']}">

                                <button ${this.utils.B3Storage.B3RoleId.value === B3Role.JUNIOR ? 'disabled' : ''} reorder-items type="button" class="button ${this.classes['order.aside.button.reorder']}">${this.text['orders.reorder.button']}</button>
                                <button add-to-shopping-list type="button" class="button ${B3CompanyStatus.value !== '1' ? 'b2b-hide' : ''} ${this.classes['order.aside.button.addToNewShoppingList']}">${this.text['orders.add.to.new.shopping.list.button']}</button>

                            </div>
                        </section>`
        document.querySelector('.account-sidebar').innerHTML = sideBarHtml
      } catch (error) {
        this.utilrs.Alert.error(tips.globalError)
      }
      window.B3Spinner.hide()
    }

    await loadData()

    //   // bind events
    document.querySelectorAll('[data-print-invoice]').forEach($print => {
      $print.addEventListener('click', () => {
        const left = window.screen.availWidth / 2 - 450
        const top = window.screen.availHeight / 2 - 320
        const printUrl = $print.dataset.printInvoice

        window.open(printUrl, 'orderInvoice', `width=900,height=650,left=${left},top=${top},scrollbars=1`)
      })
    })

    document.querySelectorAll('[reorder-items]').forEach($reorder => {
      $reorder.addEventListener('click', async () => {
        const $checkedItems = [...document.querySelectorAll('input.form-checkbox')].filter($checkbox => !!$checkbox.checked)

        if (!$checkedItems.length) {
          this.utils.Alert.error('Please select one or more items to reorder.')
          return
        }

        const itemArr = []
        $checkedItems.forEach($checkbox => {
          const { variantId } = $checkbox.dataset
          const { productId } = $checkbox.dataset
          const { productInventoryLevel } = $checkbox.dataset
          const qty = parseInt($checkbox.dataset.qty, 10)
          const { options } = $checkbox.dataset
          let optionList = []
          if (options) {
            optionList = JSON.parse(options)
          }

          itemArr.push({
            productId,
            variantId,
            quantity: qty,
            optionList,
            productInventoryLevel: Number(productInventoryLevel),
          })
        })

        const addProductsData = {
          lineItems: [],
        }
        addProductsData.lineItems = itemArr.map(item => ({
          quantity: item.quantity,
          productId: item.productId,
          variantId: item.variantId,
          productInventoryLevel: item.productInventoryLevel,
        }))

        window.B3Spinner.show()
        try {
          const hasOutStock = itemArr.some(item => item.productInventoryLevel < item.quantity)
          if (hasOutStock) {
            this.utils.Alert.error(tips.productOutOfStock)
            window.B3Spinner.hide()
            return
          }
          await addProducts(addProductsData)
          this.utils.Alert.success('success')
        } catch {
          //
        }
        window.B3Spinner.hide()
      })
    })

    document.querySelectorAll('[add-to-shopping-list]').forEach($addShoppingList => {
      $addShoppingList.addEventListener('click', () => {
        const $checkedItems = [...document.querySelectorAll('input.form-checkbox')].filter($checkbox => !!$checkbox.checked)

        if (!$checkedItems.length) {
          this.utils.Alert.error('Please select one or more items.')
          return
        }

        const productDatas = []
        $checkedItems.forEach($checkbox => {
          const { variantId } = $checkbox.dataset
          const { productId } = $checkbox.dataset
          const qty = parseInt($checkbox.dataset.qty, 10)
          const { options } = $checkbox.dataset
          let optionList = []
          if (options) {
            optionList = JSON.parse(options)
          }

          productDatas.push({
            productId,
            variantId,
            quantity: qty,
            optionList,
          })
        })

        this.setState({
          itemAddToshoppingList: productDatas,
        })

        // openCreateShoppingListModal()
        this.openShoppingListModal()
      })
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

    this.setState({
      itemAddToshoppingList: itemAddToshoppingList.map(item => item.qty = item.quantity),
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
        items: itemAddToshoppingList,
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
}

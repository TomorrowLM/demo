import BasePage from '../../common/BasePage'

// import buttonGroup from './button-group.html'
import quoteDetail from './quoteDetail.html'
import trackingHistory from './trackingHistory.html'
import sendMessage from './sendMessage.html'
import header from './header.html'

export default class RfqQuote extends BasePage {
  name = 'RfqQuote'

  state = {
    storeInfo: {
      storeName: '',
      storeAddress: '',
      storeCountry: '',
    },
    quoteNumber: '123',
    referenceNumber: '',
    createdAt: '',
    expiredAt: '',
    salesRepInfo: {
      salesRepName: '',
    },
    contactInfo: {
      name: '',
      email: '',
      companyName: '',
    },
    shippingAddress: {
      address: '',
      country: '',
    },
    productList: {
      productName: '',
      imageUrl: '',
      quantity: '',
      basePrice: '',
      offeredPrice: '',
    },
    currency: {
      token: '',
      location: '',
    },
    trackingHistory,
    quoteIdKey: 'quote-id',
  }

  originalTotal = 0

  discount = 0

  offeredTotal = 0

  quoteIdKey = 'quote-id'

  isBackendUser = {}

  quoteStatus = ''

  isShowCreateBtn = false

  async init() {
    const userId = this.context.customer.id
    const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
    this.isBackendUser = await this.api.getUserInfo(userId, { user_id: userId })
    const quoteInfo = await this.api.getQuote(quoteId)
    const quoteStatus = quoteInfo.quoteInfo.status
    const status = ['new', 'open', 'in process', 'updated by customer', 'expired', 'ordered', 'expired']
    status.forEach((value, index) => {
      if (index === Number(quoteStatus)) {
        this.quoteStatus = value
      }
    })
    const basicInfo = {
      storeHash: this.context.settings.store_hash,
      isBackendUser: this.isBackendUser.status,
    }
    const res = await this.api.getRfqDetail(quoteId, basicInfo)
    this.state = res
    this.render()
    this.renderTable()
    this.renderTotal()
    this.renderMessage()
    this.submitBtn()
  }

  async render() {
    const {
      quote: {
        container,
      },
    } = this.doms
    const { quoteStatus, isShowCreateBtn } = this
    this.utils.renderTemplate({
      hbsTemplate: header,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        quoteStatus,
      },
      insertType: 'beforeend',
    })
    this.utils.renderTemplate({
      hbsTemplate: quoteDetail,
      containerSelector: container,
      templateConfig: {
        ...this.state,
      },
      insertType: 'beforeend',
    })
    this.utils.renderTemplate({
      hbsTemplate: trackingHistory,
      containerSelector: container,
      templateConfig: {
        ...this.state,
      },
      insertType: 'beforeend',
    })
    this.utils.renderTemplate({
      hbsTemplate: sendMessage,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        isShowCreateBtn,
      },
      insertType: 'beforeend',
    })
  }

  printPDF() {
    const styleContent = `
    @page {
        size: auto;  /* auto is the initial value */
        margin: 0mm; /* this affects the margin in the printer settings */
    }
    @media (min-width: 801px) {
        .body {
            margin-top: 0;
        }
    }
    .body {
        margin-top: 0;
    }
    body > :not(.body) {
        display: none;
    }
    .body > :not(.container) {
        display: none;
    }
    .account > :not(.b2b-wrap) {
        display: none;
    }
    .b2b-wrap > :not(.quote-detail) {
        display: none;
    }
    .page-heading,.breadcrumbs{
      display:none;
    }
    .navBar--account {
      display: none;
    }
`
    const style = document.createElement('style')
    style.media = 'print'
    style.innerHTML = styleContent
    document.head.appendChild(style)
    window.print()
  }

  async exportPDF() {
    window.B3Spinner.show()
    const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
    const basicInfo = {
      storeHash: this.context.settings.store_hash,
      isBackendUser: this.isBackendUser.status,
    }
    const res = await this.api.exportRfqPDF(quoteId, basicInfo)
    window.B3Spinner.hide()
    window.open(res.url, '_blank')
  }

  async renderTable() {
    const { productList } = this.state
    let frage = ''
    productList.forEach(item => {
      let subTotal = item.quantity * item.basePrice
      let offeredSubtotal = item.quantity * item.offeredPrice
      this.originalTotal += subTotal
      this.offeredTotal += offeredSubtotal
      item.basePrice = this.formatCurrency(item.basePrice)
      item.offeredPrice = this.formatCurrency(item.offeredPrice)
      subTotal = this.formatCurrency(subTotal)
      offeredSubtotal = this.formatCurrency(offeredSubtotal)
      frage += `
      <tr>
          <td>
            <div>
              <div>
                <img src="${item.imageUrl}" alt="" class="rfq-table-img">
              </div>
              <div>
                 <p>${item.productName}</p>
                 <div>${this.text['rfq.sku']}${item.sku}</div>
              </div>
            </div>
          </td>
          <td>${item.quantity}</td>
          <td>${this.state.currency.token}${item.basePrice}</td>
          <td>${this.state.currency.token}${item.offeredPrice}</td>
          <td>${this.state.currency.token}${subTotal}</td>
          <td>${this.state.currency.token}${offeredSubtotal}</td>
      </tr>
      `
    })
    document.querySelector('.rfq-table-body').innerHTML = frage
    this.discount = this.originalTotal - this.offeredTotal
    this.discount = this.formatCurrency(this.discount)
    this.originalTotal = this.formatCurrency(this.originalTotal)
    this.offeredTotal = this.formatCurrency(this.offeredTotal)
  }

  async renderTotal() {
    let frage = ''
    frage += `
      <tr>
        <td class="rfq-total-td">${this.text['rfq.orginal.total']}</td>
        <td>${this.state.currency.token} ${this.originalTotal}</td>
      </tr>
      <tr>
        <td class="rfq-total-td">${this.text['rfq.discount']}</td>
        <td>-${this.state.currency.token} ${this.discount}</td>
      </tr>
      <tr>
        <td class="rfq-total-td">${this.text['rfq.offered.Total']}</td>
        <td>${this.state.currency.token} ${this.offeredTotal}</td>
      </tr>
      `
    document.querySelector('.rfq-total table').innerHTML = frage
  }

  formatCurrency(num) {
    num = num.toString().replace(/\$|,/g, '')
    if (isNaN(num)) num = '0'
    const sign = (num === (num = Math.abs(num)))
    num = Math.floor(num * 100 + 0.50000000001)
    let cents = num % 100
    num = Math.floor(num / 100).toString()
    if (cents < 10) cents = `0${cents}`
    for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i += 1) {
      num = `${num.substring(0, num.length - (4 * i + 3))},${
        num.substring(num.length - (4 * i + 3))}`
    }
    return (`${((sign) ? '-' : '') + num}.${cents}`)
  }

  async renderMessage() {
    const $rfqMessageInfo = document.querySelector('.rfq-message-info-detail')
    const { trackingHistory } = this.state
    let frage = ''
    trackingHistory.forEach(item => {
      frage += `
      <div>
        <div>${item.date} - </div>
        <div>${item.message}</div>
      </div>
      `
    })
    $rfqMessageInfo.innerHTML = frage
  }

  submitBtn() {
    const $sendMessageBtn = document.querySelector('.rfq-submit-btn input:nth-of-type(1)')
    const $toCheckoutBtn = document.querySelector('.rfq-submit-btn input:nth-of-type(2)')
    $sendMessageBtn.addEventListener('click', async () => {
      const $rfqInputInfo = document.querySelector('.rfq-message-input input').value
      const basicInfo = {
        storeHash: this.context.settings.store_hash,
        isBackendUser: this.isBackendUser.status,
        userEmail: this.context.customer.email,
        message: $rfqInputInfo,
      }
      const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
      window.B3Spinner.show()
      try {
        await this.api.sendRfqMessage(quoteId, basicInfo)
      } catch (error) {
        this.utils.Alert.error(error.message)
      }
      window.B3Spinner.hide()
    })

    $toCheckoutBtn.addEventListener('click', async () => {
      const basicInfo = {
        storeHash: this.context.settings.store_hash,
      }
      const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
      let res
      window.B3Spinner.show()
      try {
        res = await this.api.CheckoutRfqQuote(quoteId, basicInfo)
      } catch (error) {
        this.utils.Alert.error(error.message)
      }
      window.B3Spinner.hide()
      window.open(res.checkoutUrl, '_blank')
    })
  }
}

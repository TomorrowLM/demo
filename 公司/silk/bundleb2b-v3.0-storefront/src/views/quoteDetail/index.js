import BasePage from '../../common/BasePage'

import { leftIncludes } from '../../common/utils/util'
import quoteDetailHtml from './quoteDetail.html'
import currencyFormat, { getCurrency } from '../../common/utils/currencyFormat'
import trim from '../../common/utils/trim'
import dataTime from '../../common/utils/DateTime'
import {
  QuoteStatus,
  B3Role,
  B3CompanyStatus,
} from '../../common/utils/constants'

export default class QuoteDetail extends BasePage {
  constructor() {
    super()
    this.name = 'QuoteDetail'
    this.state = {}
    this.quoteIdKey = 'quote-id'
    this.statusMap = {
      0: 'New',
      1: 'Sent',
      2: 'Ordered',
      3: 'Expired',
      4: 'Opened',
      5: 'Draft',
      6: 'Awaiting Approval',
      7: 'Rejected',
    }
    this.emailPagination = {
      limit: 3,
      offset: 0,
      totalCount: 1,
    }
  }

  get isInpage() {
    return leftIncludes(window.location.pathname, this.doms.quoteDetail.url)
  }

  get fromEdit() {
    return this.utils.urlHelper.searchParams.has('edit')
  }

  get hasQuoteId() {
    return this.utils.urlHelper.searchParams.has(this.quoteIdKey) && !!this.utils.urlHelper.searchParams.get(this.quoteIdKey)
  }

  checkSendEmailBtnDisabled() {
    const email = document.querySelector('#quote_eamil_input')
    const value = email?.value
    const isEmail = this.utils.re.email.test(value)
    return !isEmail
  }

  async searchEmail() {
    const { companyId } = this.state
    const q = document.querySelector('#address_search_input').value
    const data = {
      ...this.emailPagination,
      role: ['0', '1', '2'],
      q,
    }
    const { list, pagination } = await this.api.getCompanyUser(companyId, data)
    this.emailPagination = pagination
    const {
      emailPagination: {
        offset,
        limit,
        totalCount,
      },
    } = this

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#email-search-pagination',
      currentPage,
      totalPages,
      onPageChange: this.handleEmailPaginationChange,
    })
    this.renderEmailList(list)
  }

  handleEmailPaginationChange = async page => {
    const {
      emailPagination,
      emailPagination: {
        limit,
      },
    } = this

    this.emailPagination = {
      ...emailPagination,
      offset: (page - 1) * limit,
    }

    this.searchEmail()
  }

  renderEmailList(list) {
    const emails = list.map(list => `
    <a href="javascript:void(0)" class="address_item"
    data-select-email
    >
        <div data-click="selectEmailItem">
           ${list.email}
        </div>
    </a>
    `).join('')
    document.querySelector('#select_email_container .modal-body').innerHTML = emails
  }

  selectEmailItem(e) {
    const value = e.target.textContent
    document.querySelector('#quote_eamil_input').value = trim(value)
    this.handleEmailEnabled()
    this.closeModle()
  }

  async sendEmail() {
    const email = document.querySelector('#quote_eamil_input')
    const emailContainer = email.parentNode.parentNode
    const { value } = email
    const isEmail = this.utils.re.email.test(value)
    const quoteId = this.utils.urlHelper.searchParams.get('quote-id')

    if (!isEmail) {
      emailContainer.classList.add('b2b-erro')
      emailContainer.querySelector('.err-tips').innerHTML = 'Please enter a valid email address.'
      document.querySelector('#email-send-btn').setAttribute('disabled', 'true')
      return false
    }

    const data = {
      email: value,
      quoteId,
      quoteUrl: window.location.href,
    }

    window.B3Spinner.show()
    await this.api.sendEmail(data)
    emailContainer.classList.remove('b2b-erro')
    document.querySelector('.modal-close').click()
    window.B3Spinner.hide()
    this.utils.urlHelper.redirect('/quote-list')
  }

  async checkout() {
    const quoteId = this.utils.urlHelper.searchParams.get('quote-id')
    window.B3Spinner.show()
    const res = await this.api.quoteCheckout(quoteId)
    window.B3Spinner.hide()
    localStorage.setItem('quoteCheckoutId', quoteId)
    this.utils.urlHelper.redirect(res.checkoutUrl)
  }

  async init() {
    let quotePreviewData = {}
    if (!this.isB2BUser) return

    if (!this.isInpage) return

    if (!this.hasQuoteId) {
      quotePreviewData = sessionStorage.getItem('quotePreviewData')
    } else {
      const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
      const {
        companyInfo, quoteInfo, salesRepInfo, storeInfo,
      } = await this.api.getQuote(quoteId)
      this.state = {
        ...companyInfo, ...quoteInfo, ...salesRepInfo, ...storeInfo,
      }
      this.formatData()
    }

    if (quotePreviewData && !this.hasQuoteId) {
      this.state = JSON.parse(quotePreviewData)
      this.formatData()
    }

    this.render()
    this.initMobileTable([1])
  }

  formatData() {
    let {
      grandTotal,
      subtotal,
      money,
    } = this.state
    const currency = JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency()

    if (money.id !== currency.id || !money.id) {
      const rateRatio = money.currency_exchange_rate ? currency.currency_exchange_rate / money.currency_exchange_rate : currency.currency_exchange_rate
      subtotal *= rateRatio
      grandTotal *= rateRatio
      money = currency
      this.setState({
        subtotal,
        grandTotal,
        money,
        productList: this.state.productList.map(item => {
          item.newPrice *= rateRatio
          item.basePrice *= rateRatio

          return item
        }),
      })
    }

    this.state.productList = this.state.productList.map(item => {
      item.totlePrice = currencyFormat(item.newPrice * item.quantity, false)
      item.newPrice = currencyFormat(item.newPrice, false)
      item.basePrice = currencyFormat(item.basePrice, false)
      return item
    })
    const sum = subtotal - grandTotal
    this.state.subtotalFomate = currencyFormat(subtotal, false)
    this.state.grandTotalFomate = currencyFormat(grandTotal, false)
    this.state.discountFomate = `${sum > 0 ? '-' : ''}${currencyFormat(sum, false)}`
  }

  selectEmail() {
    const selectEmailContainer = document.querySelector('#select_email_container')
    selectEmailContainer.classList.remove('b2b-hide')
    this.searchEmail()
  }

  closeModle() {
    document.querySelector('#select_email_container').classList.add('b2b-hide')
  }

  render() {
    const {
      B3RoleId,
      B3CompanyStatus: B3Status,
    } = this.utils.B3Storage

    const {
      quoteDetail: {
        container,
      },
    } = this.doms
    const { status } = this.state

    this.setState({
      sendEmail: true,
      saveDrafBtn: true,
      updateQuote: true,
      saveBtn: true,
      publishDfrat: true,
    })

    const hasPreviewId = this.utils.urlHelper.searchParams.has('preview-id')

    const {
      New,
      Ordered,
      Expired,
      Opened,
      Draft,
      AwaitingApproval,
      Rejected,
      Sent,
    } = QuoteStatus

    const {
      ADMIN,
      SENIOR,
      SALESREP,
    } = B3Role

    if (
      [Draft, Ordered, Expired, AwaitingApproval, Rejected].includes(status)
      || (B3RoleId.value === SALESREP && B3Status.value === B3CompanyStatus.APPROVED)
      || B3RoleId.value !== SALESREP
    ) {
      this.state.sendEmail = false
    }

    if (hasPreviewId || this.hasQuoteId) {
      this.state.saveDrafBtn = false
    }

    if (!this.fromEdit) {
      this.state.updateQuote = false
    }

    if (status === Ordered || this.fromEdit) {
      this.state.saveBtn = false
    }

    if (status !== Draft || !this.fromEdit) {
      this.state.publishDfrat = false
    }

    if (status === Draft && hasPreviewId) {
      this.state.updateQuote = true
      this.state.saveDrafBtn = false
    }

    if (this.hasQuoteId && !this.fromEdit) {
      this.setState({
        expiredAt: dataTime.getMonthDayYear(this.state.expiredAt),
        createdAt: dataTime.getMonthDayYear(this.state.createdAt),
        backText: 'Back to all Quotes',
      })
    }

    if (
      [Opened, New, Sent].includes(status)
      && (
        [ADMIN, SENIOR].includes(B3RoleId.value)
        || (B3RoleId.value === SALESREP && B3Status.value === B3CompanyStatus.APPROVED)
      )
    ) {
      this.state.showCheckout = true
    }

    const b2bWraper = document.querySelector('.b2b-wrap')
    if (b2bWraper) b2bWraper.remove()
    this.utils.renderTemplate({
      hbsTemplate: quoteDetailHtml,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        hasQuoteId: this.hasQuoteId,
        storeName: this.context.settings.store_name,
        storeAddress: this.context.settings.address,
        stateName: this.statusMap[this.state.status],
        showQuoteStatus: this.hasQuoteId && !hasPreviewId,
        sendEmailBtnDisabled: this.checkSendEmailBtnDisabled(),
      },
      insertType: 'beforeend',
    })

    if (hasPreviewId && status !== QuoteStatus.Draft) {
      const items = document.querySelectorAll('#save')
      items.forEach(item => {
        item.innerHTML = 'Update'
      })
    }

    this.bindInputEvent()
  }

  handleEmailEnabled() {
    const isSendEmailBtnDisabled = this.checkSendEmailBtnDisabled()
    const $sendBtn = document.querySelector('#email-send-btn')
    if (isSendEmailBtnDisabled) $sendBtn.setAttribute('disabled', 'true')
    else $sendBtn.removeAttribute('disabled')
  }

  bindInputEvent() {
    document.body.addEventListener('keyup', e => {
      if (e.target.id === 'quote_eamil_input') {
        this.handleEmailEnabled()
      }
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
    const currency = JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency()
    window.B3Spinner.show()
    const quoteId = this.utils.urlHelper.searchParams.get(this.quoteIdKey)
    const res = await this.api.exportPDF(quoteId, currency)
    window.B3Spinner.hide()
    window.open(res.url, '_blank')
  }

  async publishQuote() {
    const data = JSON.parse(sessionStorage.getItem('quotePreviewData'))
    const hasQuoteId = this.utils.urlHelper.searchParams.has('preview-id')
    const quoteId = this.utils.urlHelper.searchParams.get('preview-id')

    window.B3Spinner.show()
    data.status = '6'
    if (!hasQuoteId) {
      await this.api.createQuote(data)
    } else {
      await this.api.updateQuote(quoteId, data)
    }

    window.B3Spinner.hide()
    await this.handleEndMasqueradeCompany(false)
    this.utils.urlHelper.redirect('/quote-list')
  }

  async updateQuote() {
    const data = JSON.parse(sessionStorage.getItem('quotePreviewData'))
    const quoteId = this.utils.urlHelper.searchParams.get('preview-id')
    const { status } = data
    window.B3Spinner.show()

    data.status = status === '5' ? status : '6'

    await this.api.updateQuote(quoteId, data)
    window.B3Spinner.hide()
    await this.handleEndMasqueradeCompany(false)
    this.utils.urlHelper.redirect('/quote-list')
  }

  async saveDraft() {
    const data = JSON.parse(sessionStorage.getItem('quotePreviewData'))
    window.B3Spinner.show()
    await this.api.createQuote(data)
    sessionStorage.removeItem('quotePreviewData')
    sessionStorage.removeItem('B3CompanyInfo')
    window.B3Spinner.hide()
    await this.handleEndMasqueradeCompany(false)
    return this.utils.urlHelper.redirect('/quote-list')
  }
}

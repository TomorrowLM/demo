import BasePage from '../../common/BasePage'
import { leftIncludes } from '../../common/utils/util'
import DateTime from '../../common/utils/DateTime'
import quoteListHtml from './quoteLists.html'
import listHtml from './list.html'
import {
  B3Role,
} from '../../common/utils/constants'

export default class QuoteList extends BasePage {
  constructor() {
    super()
    this.name = 'QuoteList'
    this.state = {
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      userInfo: {},
      lists: [],
    }
  }

  get isInpage() {
    return leftIncludes(window.location.pathname, this.doms.quotes.url)
  }

  get isShowCreateBtn() {
    return Boolean(this.state.userInfo.B3RoleId.value === '3' && this.state.userInfo.B3CompanyStatus.value !== '1')
  }

  async init() {
    await this.initCompanyMsq()
    this.state.userInfo = { ...this.utils.B3Storage }

    if (!this.isB2BUser) return

    if (!this.isInpage) return

    this.render()
    this.hideQuoteActions()
    this.initMobileTable([5])
  }

  async initCompanyMsq() {
    const beginInCreateQuote = sessionStorage.getItem('beginInCreateQuote') && sessionStorage.getItem('B3CompanyId')

    if (!beginInCreateQuote) return

    await this.handleEndMasqueradeCompany(false)
  }

  renderQuoteCount() {
    const { totalCount = 0 } = this.state?.pagination
    document.getElementById('quote_count').innerHTML = totalCount
  }

  toggleDropdown(e) {
    const item = e.target.nextElementSibling

    if (item.classList.contains('show-action')) {
      item.classList.remove('show-action')
    } else {
      const hasShowItem = document.querySelector('.show-action')
      if (hasShowItem) document.querySelector('.show-action').classList.remove('show-action')
      item.classList.add('show-action')
    }
  }

  async checkout(e) {
    const { quoteId } = e.target.dataset
    window.B3Spinner.show()
    const res = await this.api.quoteCheckout(quoteId)
    window.B3Spinner.hide()
    localStorage.setItem('quoteCheckoutId', quoteId)
    this.utils.urlHelper.redirect(res.checkoutUrl)
  }

  async handleDeleteQuote(e) {
    const { quoteId } = e.target.dataset

    window.B3Spinner.show()
    await this.api.deleteQuoteList(quoteId)
    await this.renderLists()
    window.B3Spinner.hide()
  }

  hideQuoteActions() {
    document.querySelector('body').addEventListener('click', e => {
      if (e.target.hasAttribute('quote-list-action')) return
      if (document.querySelector('.show-action')) {
        document.querySelector('.show-action').classList.remove('show-action')
      }
    })
  }

  async render() {
    const {
      quotes: {
        container,
      },
    } = this.doms

    this.utils.renderTemplate({
      hbsTemplate: quoteListHtml,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        isShowCreateBtn: this.isShowCreateBtn,
      },
      insertType: 'beforeend',
    })

    await this.renderLists()
  }

  initPagination() {
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
      container: '#B3pagination',
      currentPage,
      totalPages,
      visiblePages: limit,
      onPageChange: this.handlePaginationChange.bind(this),
    })
  }

  async renderLists() {
    const {
      JUNIOR,
      SALESREP,
    } = B3Role

    window.B3Spinner.show()
    const { list, pagination } = await this.getQuoteList()
    const { B3CompanyStatus, B3RoleId } = this.state.userInfo
    this.state.pagination = pagination
    this.state.lists = list

    this.state.lists = list.map(item => {
      item.status = this.getQuoteStatus(item.status)
      item.createdAt = DateTime.formateTimestampToLocal(item.createdAt)
      item.isShowCheckOut = (B3CompanyStatus.value === '1' && B3RoleId.value !== JUNIOR && item.status !== 'Ordered' && item.status !== 'Expired')
      item.isShowDeleteBtn = (B3CompanyStatus.value !== '1' && B3RoleId.value === SALESREP) || (this.state.userInfo.B3RoleId.value === SALESREP && !sessionStorage.getItem('B3CompanyId'))
      item.isShowEditBtn = B3CompanyStatus.value !== '1' && B3RoleId.value === SALESREP && item.status !== 'Ordered'
      item.isShowCreateBtn = this.isShowCreateBtn
      return item
    })

    document.querySelector('#quote-list-container').innerHTML = ''

    this.renderQuoteCount()

    this.utils.renderTemplate({
      hbsTemplate: listHtml,
      containerSelector: '#quote-list-container',
      templateConfig: {
        ...this.state,
        classes: this.classes,
        isShowCompany: true,
        isShowCreateBtn: this.isShowCreateBtn,
      },
      insertType: 'beforeend',
    })

    this.initPagination()
    window.B3Spinner.hide()
  }

  async handlePaginationChange(page) {
    const { limit } = this.state.pagination
    this.state.pagination.offset = (page - 1) * limit
    await this.renderLists()
  }

  getQuoteStatus(code) {
    const status = {
      0: 'New',
      1: 'Sent',
      2: 'Ordered',
      3: 'Expired',
      4: 'Opened',
      5: 'Draft',
      6: 'Awaiting Approval',
      7: 'Rejected',
    }
    return status[code]
  }

  getQuoteList() {
    return this.api.getQuoteList({ ...this.state.pagination })
  }
}

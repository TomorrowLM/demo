import utils from '@bigcommerce/stencil-utils'
import BasePage from '../../common/BasePage'

import { leftIncludes } from '../../common/utils/util'
import DateTime from '../../common/utils/DateTime'
import createQuoteHtml from './createQuote.html'
import ListModalContent from './ListModalContent.html'
import searchResult from './searchResult.html'
import setRectangle from './options/set-rectangle.html'
import swatch from './options/swatch.html'
import date from './options/date.html'
import inputCheckbox from './options/input-checkbox.html'
import inputFile from './options/input-file.html'
import inputNumbers from './options/input-numbers.html'
import inputText from './options/input-text.html'
import productList from './options/product-list.html'
import textarea from './options/textarea.html'
import setSelect from './options/set-select.html'
import setRadio from './options/set-radio.html'
import discountProduct from './discountProduct.html'
import listenOptionChange from '../../common/utils/listenOptionChange'
import currencyFormat, { getCurrency } from '../../common/utils/currencyFormat'
import { getCorrectProductImages } from '../../common/utils/getCorrectProductImage'
import uploadReportTemplate from './uploadReport.html'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class CreateQuote extends BasePage {
  constructor() {
    super()
    this.name = 'CreateQuote'
    const companyListSelectedId = this.utils.B3Storage?.B3CompanyId?.value ?? ''
    this.state = {
      qtyEnabled: '',
      createQuoteListModal: null,
      shouldUpdateQuoteList: true,
      quoteListPagination: {
        offset: 0,
        limit: 6,
        perCount: 0,
        q: '',
      },
      companyList: [],
      companyListSelectedId,
      selectCompanyListModal: null,
      userInfo: {},
      quoteInfo: {},
      productList: [],
      resultContainer: document.querySelector(
        '#product_search_result_table tbody',
      ),
      searchProducts: [],
      addressPagination: {
        offset: 0,
        limit: 4,
        totalCount: 0,
      },
      summaryData: {},
      salesRepInformation: {},
      expiredAt: '',
    }
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

  get isInpage() {
    return (
      leftIncludes(window.location.pathname, this.doms.createQuote.url)
      || leftIncludes(window.location.pathname, this.doms.editQuote.url)
    )
  }

  get hasPermission() {
    return Boolean(this.state.userInfo.B3RoleId.value === '3')
  }

  get fromEdit() {
    return this.utils.urlHelper.path.has('quote-edit')
  }

  get pageTitlePrefix() {
    return this.fromEdit ? 'Edit' : 'New'
  }

  async init() {
    this.state.userInfo = { ...this.utils.B3Storage }
    if (!this.isB2BUser || !this.isInpage || !this.hasPermission) return
    let quotePreviewData = JSON.parse(
      sessionStorage.getItem('quotePreviewData'),
    )

    if (this.fromEdit) {
      const quoteId = this.utils.urlHelper.searchParams.get('quote-id')
      window.B3Spinner.show()
      // should be end masquerade before get quoInfo for salesRep
      try {
        await this.handleEndMasqueradeCompany(false)
      } catch {
        //
      }
      const { companyInfo, quoteInfo } = await this.api.getQuote(quoteId)
      await this.putMasqueradeCompany(companyInfo?.companyId)
      await this.initCompanyInfo()
      BasePage.notify('beginMasqueradeCompany')

      const { money, productList } = quoteInfo
      const currencyMoney = JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency()

      quotePreviewData = {
        ...quotePreviewData,
        ...companyInfo,
        ...{
          ...quoteInfo,
          productList: productList.map(product => {
            const formatBasePrice = money.currency_exchange_rate ? (product.basePrice / money.currency_exchange_rate) * currencyMoney.currency_exchange_rate : product.basePrice * currencyMoney.currency_exchange_rate
            const formatNewPrice = money.currency_exchange_rate ? (product.newPrice / money.currency_exchange_rate) * currencyMoney.currency_exchange_rate : product.newPrice * currencyMoney.currency_exchange_rate

            return {
              ...product,
              basePrice: formatBasePrice.toFixed(2),
              newPrice: formatNewPrice.toFixed(2),
            }
          }),
        },
      }
      sessionStorage.setItem('beginInCreateQuote', 'true')

      const { status } = quoteInfo
      this.setState({
        status,
      })
    }
    this.setState({
      ...quotePreviewData,
      fromEdit: this.fromEdit,
    })
    this.render()
    if (this.fromEdit || quotePreviewData) {
      this.renderCountProduct()
      this.renderSummary()
    }

    this.initAddressInfo()
    this.initMobileTable([1, 7])
    themeStyleFix.editModalBoxStyleFix()
  }

  async searchProduct() {
    const inputItem = document.querySelector('#quote_search_input')
    if (!inputItem) return

    const { B3CompanyId } = this.state.userInfo

    if (!B3CompanyId.value) {
      return this.utils.Alert.error('Please choose a company!')
    }

    window.B3Spinner.show()

    const searchQuery = document.querySelector('#quote_search_input').value
    const tableBody = document.querySelector(
      '#product_search_result_table tbody',
    )
    utils.api.search.search(
      searchQuery,
      {
        template: 'b3/b3json',
      },
      (err, response) => {
        const { products } = JSON.parse(response).product_results
        if (tableBody) {
          tableBody.innerHTML = ''
        }

        if (products.length === 0) {
          tableBody.innerHTML = '<tr><td>No products found.</td></tr>'
          window.B3Spinner.hide()
          return
        }

        this.setState({
          searchProducts: getCorrectProductImages(products),
        })

        this.handleShowMoreProduct()
      },
    )
  }

  async handleShowMoreProduct() {
    const { searchProducts } = this.state
    const $more = document.querySelector('.show-more-results')

    if (searchProducts.length) for (const product of searchProducts.splice(0, 3)) await this.renderSearchProduct(product)

    if (searchProducts.length) {
      $more.style.display = 'inline-block'
    } else $more.style.display = 'none'

    this.setState({ searchProducts: [...searchProducts] })

    listenOptionChange()
  }

  async renderSearchProduct(productItem) {
    let options = ''

    const render = () => new Promise(resolve => {
      if (productItem.has_options) {
        utils.api.product.getById(
          productItem.id,
          {
            template: 'b3/b3json',
          },
          (error, res) => {
            resolve()
            const { product } = JSON.parse(res)

            product.options = product.options.map(option => {
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

            options = this.renderOptions(product.options)

            const hasOptions = productItem.has_options && product.options.length
            this.renderProductTemplate(options, productItem, hasOptions)
            window.B3Spinner.hide()
          },
        )
      } else {
        resolve()
        this.renderProductTemplate(options, productItem)
      }
    })

    window.B3Spinner.show()
    await render()
    window.B3Spinner.hide()
  }

  renderProductTemplate(options, product, hasOption) {
    this.utils.renderTemplate({
      hbsTemplate: searchResult,
      containerSelector: '#product_search_result_table tbody',
      templateConfig: {
        product,
        options,
        hasOption,
      },
      insertType: 'beforeend',
    })
  }

  renderOptions(options) {
    return options.reduce((html, currentOption) => {
      html += this.optionTemplateMap[currentOption.partial](currentOption)
      return html
    }, '')
  }

  getStoreZoneDate(date) {
    const { store_time_zone: storeTimeZone } = this.context.settings

    const localDate = date ? new Date(date) : new Date()
    const localTime = localDate.getTime()
    const localOffset = localDate.getTimezoneOffset() * 60000
    const utcTime = localTime + localOffset
    const timeZone = storeTimeZone
    const zonetime = utcTime + 3600000 * timeZone
    const zoneDate = new Date(zonetime)

    return zoneDate
  }

  bindDatePicker() {
    const defaultEndDate = this.getStoreZoneDate()
    const { quoteInfo } = this.state
    const expiration = quoteInfo.expirationData
      ? quoteInfo.expirationData
      : defaultEndDate
    const $end = document.querySelector('#quote_date')

    const setDatePicker = $el => {
      window
        .B3DatePicker($el, {
          min: expiration,
          mode: 'dp-modal',
          format(date) {
            return window.B3DisplayFormat(date)
          },
          parse(dateStr) {
            const date = new Date(DateTime.displayParse(dateStr))
            return isNaN(date) ? new Date() : date
          },
        })
        .on({
          select: () => {
            this.setState({
              quoteInfo: {
                ...this.getQuoteData(),
              },
            })
          },
          close: () => {
            $el.blur()
          },
        })
    }

    setDatePicker($end, 'endDateAt')
  }

  async searchCompany() {
    this.setState({
      ...this.state,
      quoteListPagination: {
        offset: 0,
        limit: 6,
        perCount: 0,
        q: document.querySelector('#search_company').value,
      },
    })

    const overlayClass = 'loadingOverlay'
    this.utils.renderTemplate({
      containerSelector: '.modal-body',
      template: `<div class='${overlayClass}' style='display: block;'/>`,
    })

    await this.getCompanyList()

    const { createQuoteListModal, companyList } = this.state
    document.querySelector('#modle-pagination').innerHTML = ''

    const modalContent = ListModalContent({
      companyList,
    })

    createQuoteListModal.setContent(modalContent)
    this.renderCompanyListModalContent()
    this.renderCompanyListPaginator()
  }

  showCompanyList() {
    this.openCompanyListModal()
  }

  async openCompanyListModal() {
    const { createQuoteListModal, shouldUpdateQuoteList } = this.state

    let $modal = createQuoteListModal

    if (!createQuoteListModal) {
      $modal = new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      })

      this.setState({
        createQuoteListModal: $modal,
      })
    }

    if (shouldUpdateQuoteList) await this.getCompanyList()

    $modal.open()
    this.renderCompanyListModalContent()
  }

  async getCompanyList() {
    const {
      quoteListPagination,
      quoteListPagination: { offset, limit, q },
    } = this.state
    const { B3UserId } = this.utils.B3Storage
    const userId = B3UserId.value

    try {
      const { list, pagination } = await this.api.getCompanyList(userId, {
        offset,
        limit,
        q,
      })

      this.setState({
        shouldUpdateQuoteList: false,
        quoteListPagination: {
          ...quoteListPagination,
          ...pagination,
        },
        companyList: list,
      })
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  renderCompanyListModalContent() {
    const {
      createQuoteListModal,
      companyList,
      userInfo,
      companyListSelectedId,
    } = this.state

    const list = companyList.map(item => {
      const isActive = item.companyId === companyListSelectedId
      const className = isActive ? 'active' : ''
      return {
        ...item,
        className,
      }
    })

    const modalContent = ListModalContent({
      list,
      isSaveCompanyBtnDisabled: !companyListSelectedId,
    })

    createQuoteListModal.setContent(modalContent)
    this.renderCompanyListPaginator()

    const handleClose = () => {
      this.setState({
        companyListSelectedId: userInfo.B3CompanyId.value,
      })
      createQuoteListModal.close()
    }

    const $closes = document.querySelectorAll('.modal-close')
    const $lis = document.querySelectorAll('.company-list-wraper li')
    const $searchInput = document.querySelector('#search_company')
    $searchInput.value = this.state.quoteListPagination.q

    $closes.forEach($close => $close.addEventListener('click', handleClose))
    $lis.forEach($li => {
      $li.addEventListener('click', () => {
        const companyListSelectedId = $li.dataset.companyId
        this.setState({
          companyListSelectedId,
        })

        this.renderCompanyListModalContent()
      })
    })
  }

  async putMasqueradeCompany(companyId) {
    const { B3UserId } = this.utils.B3Storage
    const userId = B3UserId.value

    window.B3Spinner.show()
    try {
      const resp = await this.api.beginMasqueradeCompany(companyId, userId)

      sessionStorage.setItem('B3CompanyInfo', JSON.stringify(resp))
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async saveComapny(e) {
    const { createQuoteListModal, companyListSelectedId } = this.state

    const { companyId = companyListSelectedId } = document.querySelector('.company-list-wraper .active')?.dataset ?? {}
    const overlayClass = 'loadingOverlay'
    this.utils.renderTemplate({
      containerSelector: '#companyModalBody',
      template: `<div class='${overlayClass}' style='display: block;'/>`,
    })

    await this.putMasqueradeCompany(companyId)
    await this.initCompanyInfo()

    BasePage.notify('beginMasqueradeCompany')
    sessionStorage.setItem('beginInCreateQuote', 'true')
    if (!companyId) {
      e.target.removeAttribute('disabled')
    }
    createQuoteListModal.close()
  }

  async initCompanyInfo() {
    const { id: customerId } = this.context.customer

    const {
      B3CompanyId,
      B3CompanyStatus,
      B3CompanyName,
    } = this.utils.B3Storage

    window.B3Spinner.show()
    try {
      const salesRepInformation = await this.api.getSelerep(customerId)
      const { companyId, companyName, companyStatus } = salesRepInformation

      if (companyId) {
        B3CompanyId.setValue(companyId)
        B3CompanyName.setValue(companyName)
        B3CompanyStatus.setValue(companyStatus)
      }

      sessionStorage.setItem(
        'salesRepInformation',
        JSON.stringify(salesRepInformation),
      )
      await this.getCompanyList()
      this.render()

      this.initAddressInfo()
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async initAddressInfo(q) {
    const { B3CompanyId } = this.utils.B3Storage
    const companyId = B3CompanyId.value

    const {
      addressPagination: { offset, limit },
    } = this.state

    if (!companyId) return

    window.B3Spinner.show()
    try {
      const resp = await this.api.getQuoteAdress(companyId, {
        offset,
        limit,
        q,
      })

      this.setState({
        addressPagination: resp.pagination,
      })
      const isInit = String(q) === 'undefined'
      this.renderAddress(resp, isInit)
    } catch {
      this.utils.Alert.error(this.locales.tips.globalError)
    }
    window.B3Spinner.hide()
  }

  renderAddress(data, isInit) {
    const hasPreivewData = sessionStorage.getItem('quotePreviewData')
    const { addressBookStatus, list } = data
    let defaultAddress

    if (hasPreivewData) {
      const preivewData = JSON.parse(hasPreivewData)
      defaultAddress = preivewData.addressInfo
    } else {
      defaultAddress = this.state.addressInfo || data.defaultAddress
    }
    const defaultAddressLabel = defaultAddress.label
      ? defaultAddress.label
      : ''
    const selectStatus = list.length > 0 && addressBookStatus === '1'
    const defaultAddressFrage = `
    <span class="form-label">${this.text['quote.form.address.label']}</span>
    <div class="quote_adress_container
    ${selectStatus ? 'quote_select_address' : 'address_book_none'}"
    ${selectStatus ? "data-reveal-id='modal-quote-address-form'" : ''}>
        <div id="label">${defaultAddressLabel}</div>
        <div>
            <span id="quote_adreess_first">${defaultAddress.firstName}</span>
            <span id="quote_adreess_last">${defaultAddress.lastName}</span>
         </div>
         <div>
            <span id="default_company_name">${
  defaultAddress.companyName
} </span>
            <span id="quote_phone">${defaultAddress.phoneNumber}</span>
         </div>
        <div id="default_company_address">${defaultAddress.companyAddress}</div>
        <div>
            <span id="default_company_city">${defaultAddress.companyCity}</span>
            <span id="default_company_state">${
  defaultAddress.companyState
}</span>
            <span id="default_company_zipcode">${
  defaultAddress.companyZipCode
}</span>
        </div>
        <div>
            <span id="default_company_country">${
  defaultAddress.companyCountry
}</span>
        </div>
    </div>
    `

    const addresses = this.renderSelectAddress(list)
    document.querySelector(
      '#modal-quote-address-form .modal-body',
    ).innerHTML = addresses

    if (isInit) document.querySelector('#quote_address').innerHTML = defaultAddressFrage
    this.bindSelectAddress()
    this.bindSearchAddress()
    this.renderQuoteAddressPaginatior()
  }

  bindSelectAddress() {
    const $selects = document.querySelectorAll(
      '#modal-quote-address-form .modal-body [data-select-address]',
    )
    $selects.forEach($select => {
      $select.addEventListener('click', () => {
        const {
          companyCity,
          companyCountry,
          companyAddress,
          companyName,
          label,
          companyState,
          companyZipcode,
          firstName,
          lastName,
          phone,
        } = $select.dataset

        document.querySelector(
          '#default_company_address',
        ).innerHTML = companyAddress
        document.querySelector('#default_company_city').innerHTML = companyCity
        document.querySelector(
          '#default_company_country',
        ).innerHTML = companyCountry
        document.querySelector('#default_company_name').innerHTML = companyName
        document.querySelector('#label').innerHTML = label
        document.querySelector(
          '#default_company_state',
        ).innerHTML = companyState
        document.querySelector(
          '#default_company_zipcode',
        ).innerHTML = companyZipcode
        document.querySelector('#quote_adreess_first').innerHTML = firstName
        document.querySelector('#quote_adreess_last').innerHTML = lastName
        document.querySelector('#quote_phone').innerHTML = phone
        document
          .querySelector('#modal-quote-address-form .modal-close')
          .click()
      })
    })
  }

  bindSearchAddress() {
    const $input = document.querySelector('#address_search_input')
    const $btn = document.querySelector('#address_search_btn')
    $btn.addEventListener('click', () => this.handleInputSearch(async () => {
      this.handleAddressPaginationChange(1, $input.value)
    }))
  }

  renderQuoteAddressPaginatior() {
    const {
      addressPagination: { offset, limit, totalCount },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#quoteAddressPagination',
      currentPage,
      totalPages,
      visiblePages: limit,
      onPageChange: this.handleAddressPaginationChange,
    })
  }

  handleAddressPaginationChange = async (page, q = '') => {
    const {
      addressPagination,
      addressPagination: { limit },
    } = this.state

    this.setState({
      addressPagination: {
        ...addressPagination,
        offset: (page - 1) * limit,
      },
    })

    const overlayClass = 'loadingOverlay'

    this.utils.renderTemplate({
      containerSelector: '.modal-body',
      template: `<div class='${overlayClass}' style='display: block;'/>`,
    })

    this.initAddressInfo(q)
  };

  renderSelectAddress(data) {
    const lists = data
      .map(
        list => `
    <div class="address_item ${
  this.classes['createQuote.addressModal.list.item']
}"
    data-company-name="${list.companyName}"
    data-label="${list.label}"
    data-company-address="${list.companyAddress}"
    data-company-city="${list.companyCity}"
    data-company-country="${list.companyCountry}"
    data-company-name="${list.companyName}"
    data-company-state="${list.companyState}"
    data-company-zipcode="${list.companyZipCode}"
    data-first-name="${list.firstName}"
    data-last-name="${list.lastName}"
    data-phone="${list.phoneNumber}"
    data-select-address
    >
    <div>
    ${list.label}
    </div>
        <div>
            <span class="${list.firstName ? '' : 'b2b-hide'}">${
  list.firstName
}</span>
            <span class="${list.lastName ? '' : 'b2b-hide'}">${
  list.lastName
}</span>
        </div>
        <div>
        ${list.companyName} ${list.phoneNumber || ''}
        </div>
        <div>
        ${list.companyAddress || ''}
        </div>
        <div>
            <span>${list.companyCity || ''}</span>
            <span>${list.companyState || ''}</span>
            <span>${list.companyZipCode || ''}</span>
        </div>
        <div>${list.companyCountry || ''}</div>
    </div>
    `,
      )
      .join('')
    return lists
  }

  async updateQuote() {
    const quoteId = this.utils.urlHelper.searchParams.get('quote-id')
    this.setState({
      quoteInfo: {
        ...this.getQuoteData(),
      },
      addressInfo: this.getAdressInfoData(),
      money: JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency(),
    })
    let data = { ...this.state }
    const { status } = data
    if (this.state.quoteInfo) {
      data = {
        ...this.state,
        ...this.state.quoteInfo,
        title: this.state.quoteInfo.quoteTitle,
        description: this.state.quoteInfo.quoteDescription,
        expiredAt: DateTime.displayParse(this.state.quoteInfo.quoteDate),
        status: status === '5' ? status : '6',
      }
    }

    window.B3Spinner.show()
    await this.api.updateQuote(quoteId, data)
    await this.handleEndMasqueradeCompany(false)
    this.utils.Alert.success('Success')
    window.B3Spinner.hide()
    this.utils.urlHelper.redirect('/quote-list')
  }

  openSelectCompanyModal = () => {
    const { createQuoteListModal, selectCompanyListModal } = this.state

    createQuoteListModal.close()

    let $modal = selectCompanyListModal

    if (!selectCompanyListModal) {
      $modal = new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      })

      this.setState({
        selectCompanyListModal: $modal,
      })
    }

    $modal.open()
    this.renderCreateModalContent()
  };

  renderCreateModalContent() {
    const $listName = document.querySelector('#list_name')
    const $addNew = document.querySelector('#add_new_companyList')

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

      if (!name) return
      $addNew.setAttribute('disabled', true)

      await this.createShopingList(name, description)

      $addNew.setAttribute('disabled', false)
    })
  }

  renderCompanyListPaginator() {
    const {
      quoteListPagination: { offset, limit, perCount },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(perCount / limit)

    window.B3Paginator.init({
      container: '#modle-pagination',
      currentPage,
      totalPages,
      visiblePages: limit,
      onPageChange: this.handleCompanyListPaginationChange,
    })
  }

  handleCompanyListPaginationChange = async page => {
    const {
      quoteListPagination,
      quoteListPagination: { limit },
    } = this.state

    this.setState({
      quoteListPagination: {
        ...quoteListPagination,
        offset: (page - 1) * limit,
      },
    })

    const overlayClass = 'loadingOverlay'
    this.utils.renderTemplate({
      containerSelector: '.tingle-modal--visible .modal-body',
      template: `<div class='${overlayClass}' style='display: block;'/>`,
    })

    await this.getCompanyList()
    this.renderCompanyListModalContent()
  };

  async render() {
    const {
      createQuote: { container },
    } = this.doms
    const { userInfo } = this.state
    const b2bWraper = document.querySelector('.b2b-wrap ')
    if (b2bWraper) b2bWraper.remove()
    const companyName = userInfo.B3CompanyStatus.value === '1'
      ? userInfo.B3CompanyName.value
      : 'choose company'

    const { expiredAt } = this.state

    // this.state.expiredAt = this.state.expiredAt ? DateTime.getMonthDayYear(this.state.expiredAt) : ''
    this.utils.renderTemplate({
      hbsTemplate: createQuoteHtml,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        companyName,
        pageTitlePrefix: this.pageTitlePrefix,
        expiredAt:
          isNaN(expiredAt) || !expiredAt
            ? expiredAt
            : new Date(expiredAt * 1000),
      },
      insertType: 'beforeend',
    })
    this.bindDatePicker()
    this.bindEvents()
  }

  getQuoteData() {
    return {
      referenceNumber: document.querySelector('#reference_number').value,
      quoteTitle: document.querySelector('#quote_title').value,
      quoteDescription: document.querySelector('#quote_description').value,
      quoteDate: document.querySelector('#quote_date').value,
      additionalInfo: document.querySelector('#additional_infor').value,
    }
  }

  bindEvents() {
    const selectors = [
      '#reference_number',
      '#quote_title',
      '#quote_description',
      '#quote_date',
      '#additional_infor',
    ]
    selectors.forEach(item => {
      const el = document.querySelector(item)
      if (el) {
        el.addEventListener('change', () => {
          this.setState({
            quoteInfo: {
              ...this.getQuoteData(),
            },
          })
        })
      }
    })

    this.bindUploadCSV()
  }

  handleProductAdd() {
    let { productList } = this.state
    let hasItem
    const checkedInputs = document.querySelectorAll(
      '#product_search_result_table [data-results-check-box]:checked',
    )
    if (!checkedInputs.length) return
    const products = this.getProductAddData()

    checkedInputs.forEach(checkedInput => checkedInput.checked = false)

    products.forEach(product => {
      if (product.hasOption) {
        hasItem = productList.filter(item => +item.variantId === +product.variantId)
          .length > 0
      } else {
        hasItem = productList.filter(item => +item.productId === +product.productId)
          .length > 0
      }
      if (hasItem) {
        productList = productList.map(item => {
          if (
            (item.variantId && +item.variantId === +product.variantId)
            || (item.productId && +item.productId === +product.productId)
          ) {
            item.quantity += 1
          }
          return item
        })
      } else {
        productList.unshift(product)
      }
    })

    this.setState({
      productList,
    })
    this.renderCountProduct()
    this.renderSummary()
  }

  handleInput(e) {
    let { productList } = this.state
    const { dataset } = e.target
    const {
      productId, variantId, name, max, min, initData,
    } = dataset
    const targetValue = parseFloat(e.target.value).toFixed(2) || initData
    const id = variantId || productId
    const key = variantId ? 'variantId' : 'productId'
    productList = productList.map(item => {
      if (+item[key] === +id) {
        const disItem = item.basePrice
          * (100 - Math.max(Math.min(targetValue, max), initData))
        switch (name) {
          case 'discount':
            item.discount = Math.max(Math.min(targetValue, max), initData)
            item.newPrice = (disItem / 100).toFixed(2)
            break
          case 'newPrice':
            item.newPrice = Math.max(Math.min(targetValue, max), min)
            item.discount = (
              ((item.basePrice - item.newPrice) / item.basePrice)
                * 100
            ).toFixed(2) || 0
            break
          case 'quantity':
            item.quantity = Math.max(targetValue, 1)
            break
          default:
            break
        }
      }
      return item
    })

    this.setState({
      productList,
    })
    this.updateItem(productId, variantId)
    this.renderSummary()
  }

  handleProductDelete(e) {
    const { productList } = this.state
    const newproductList = productList.filter(item => {
      const id = e.target.dataset.variantId || e.target.dataset.productId
      const key = item.variantId ? 'variantId' : 'productId'
      return +item[key] !== +id
    })
    this.setState({
      productList: newproductList,
    })
    this.renderCountProduct()
    this.renderSummary()
  }

  async saveDraft() {
    // check
    const valid = this.validationQuote()
    if (!valid) return false

    window.B3Spinner.show()
    await this.api.createQuote(valid)
    sessionStorage.removeItem('quotePreviewData')
    await this.handleEndMasqueradeCompany(false)
    window.B3Spinner.hide()
    return this.utils.urlHelper.redirect('/quote-list')
  }

  validationQuote() {
    const { B3CompanyInfo, B3CompanyName } = this.utils.B3Storage
    const { quoteInfo, productList, summaryData } = this.state

    let quoteInfoCheck = true
    if (!quoteInfo) {
      this.utils.Alert.error('Reference Number cannot be empty')
      return false
    }

    if (productList.length === 0) {
      this.utils.Alert.error('Please Add a product')
      return false
    }

    Object.keys(quoteInfo).forEach(key => {
      if (
        !quoteInfo[key]
        && key !== 'additionalInfo'
        && key !== 'quoteDescription'
      ) {
        this.utils.Alert.error(`${key} cannot be empty`)
        quoteInfoCheck = false
      }
    })

    if (!quoteInfoCheck) return false
    const data = {
      status: this.fromEdit ? this.state.status : '5',
      companyId: sessionStorage.getItem('B3CompanyId'),
      referenceNumber: document.querySelector('#reference_number').value,
      title: document.querySelector('#quote_title').value,
      description: document.querySelector('#quote_description').value,
      expiredAt: DateTime.displayParse(
        document.querySelector('#quote_date').value,
      ),
      money: JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency(),
      productList,
      additionalInfo: document.querySelector('#additional_infor').value,
      discount: summaryData.discount,
      discountFomate: document.querySelector('#discount').textContent,
      grandTotal: summaryData.grandTotal,
      grandTotalFomate: document.querySelector('#grand_total').textContent,
      subtotal: summaryData.subtotal,
      subtotalFomate: document.querySelector('#subtotal').textContent,
      addressInfo: this.getAdressInfoData(),
      B3CompanyInfo: JSON.parse(B3CompanyInfo.value),
      companyName: B3CompanyName.value,
      salesRepInformation: JSON.parse(
        sessionStorage.getItem('salesRepInformation'),
      ),
    }
    return data
  }

  getAdressInfoData() {
    return {
      companyAddress: document.querySelector('#default_company_address')
        .textContent,
      companyCity: document.querySelector('#default_company_city').textContent,
      companyCountry: document.querySelector('#default_company_country')
        .textContent,
      companyName: document.querySelector('#default_company_name').textContent,
      label: document.querySelector('#label').textContent,
      companyZipCode: document.querySelector('#default_company_zipcode')
        .textContent,
      companyState: document.querySelector('#default_company_state')
        .textContent,
      firstName: document.querySelector('#quote_adreess_first').textContent,
      lastName: document.querySelector('#quote_adreess_last').textContent,
      phoneNumber: document.querySelector('#quote_phone').textContent,
    }
  }

  renderSummary() {
    const { productList } = this.state

    const summaryData = productList.reduce(
      (result, currentProduct) => {
        result.subtotal += currentProduct.basePrice * currentProduct.quantity
        result.grandTotal += currentProduct.newPrice * currentProduct.quantity
        return result
      },
      {
        subtotal: 0,
        grandTotal: 0,
      },
    )

    const sum = summaryData.subtotal - summaryData.grandTotal
    const discount = sum || 0
    document.querySelector('#subtotal').innerHTML = currencyFormat(
      summaryData.subtotal,
      false,
    )
    document.querySelector('#discount').innerHTML = `${
      sum > 0 ? '-' : ''
    }${currencyFormat(sum, false)}`
    document.querySelector('#grand_total').innerHTML = currencyFormat(
      summaryData.grandTotal,
      false,
    )
    summaryData.discount = discount
    this.state.summaryData = summaryData
  }

  updateItem(productId, variantId) {
    const row = document.querySelector(`[data-id="${productId}-${variantId}"]`)
    const id = variantId || productId
    const key = variantId ? 'variantId' : 'productId'
    const rowData = this.state.productList.find(
      product => +product[key] === +id,
    )

    if (!row || !rowData) return;
    ['discount', 'newPrice', 'quantity'].forEach(name => {
      row.querySelector(`[name="${name}"]`).value = rowData[name]
    })
    const lineTotal = row.querySelector('.line-total')
    lineTotal.innerHTML = currencyFormat(
      rowData.newPrice * rowData.quantity,
      false,
    )
  }

  renderCountProduct() {
    const { productList } = this.state
    const money = JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency()
    const currencyLocationRight = money.token_location === 'right'
    document.querySelector('#product_list_table tbody').innerHTML = ''

    this.utils.renderTemplate({
      hbsTemplate: discountProduct,
      containerSelector: '#product_list_table tbody',
      templateConfig: {
        productList: productList.map(item => {
          item.totlePrice = currencyFormat(
            item.newPrice * item.quantity,
            false,
          )
          item.formatedBasePrice = currencyFormat(
            item.basePrice,
            false,
          )
          return item
        }),
        currencyLocationRight,
        money,
      },
      insertType: 'beforeend',
    })
  }

  getProductAddData() {
    const table = document.querySelector('#product_search_result_table')
    const form = table.querySelector('form')
    const trs = Array.from(table.querySelectorAll('tr')).filter(tr => tr.querySelector('[data-results-check-box]:checked'))

    const getData = tr => {
      const sku = tr.getAttribute('data-product-base-sku')
      const basePrice = tr
        .querySelector('.product-price')
        .getAttribute('data-product-price-value')
      const productId = tr.getAttribute('data-product-id')
      const variantId = tr.getAttribute('data-variant-id')
      const imageUrl = tr
        .querySelector('.col-product-figure img')
        .getAttribute('src')
      const productName = tr
        .querySelector('.col-product-info')
        .getAttribute('data-name')
      const formData = this.serialize(form)
      const minQty = tr.getAttribute('data-min') === '0' ? '1' : tr.getAttribute('data-min')
      const maxQty = tr.getAttribute('data-max')
      const hasOption = tr.getAttribute('data-has-option')
      const formate = tr.querySelector('.product-price').textContent
      return {
        sku,
        basePrice,
        discount: 0,
        newPrice: basePrice,
        quantity: 1,
        productId,
        variantId,
        imageUrl,
        productName,
        minQty,
        maxQty,
        formData,
        formate,
        hasOption,
      }
    }
    return trs.map(getData)
  }

  getRequireInputs(form) {
    const $requireInputs = form.querySelectorAll('[required]')
    const attrArry = []
    if ($requireInputs.length === 0) {
      return false
    }
    $requireInputs.forEach(item => {
      if (item.hasAttribute('required')) {
        const attr = item.getAttribute('name')
        attrArry.push(attr)
      }
    })

    const productAttr = Array.from(new Set(attrArry))
    return productAttr
  }

  getProductData(itemName, value) {
    const $item = document.querySelector(
      `[name='${itemName}'][value='${value}']`,
    )
    const dispalyName = $item.getAttribute('data-label-name')
    const title = $item.getAttribute('data-title')

    return {
      [dispalyName]: title,
    }
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

  getOptions(form) {
    let requireInputs = this.getRequireInputs(form)

    if (!requireInputs) {
      requireInputs = []
    }

    const formInputs = form.elements
    let options = {}
    if (formInputs.length <= 2) {
      return options
    }

    for (let i = 0; i < formInputs.length; i += 1) {
      const item = formInputs[i]
      const itemName = item.name
      const hasAttr = requireInputs.includes(itemName)
      if (hasAttr) {
        const { value } = item
        options = { ...options, ...this.getProductData(itemName, value) }
      }
    }
    return options
  }

  preview() {
    const valid = this.validationQuote()
    const { B3CompanyInfo } = this.utils.B3Storage
    const companyInfor = JSON.parse(B3CompanyInfo.value)
    if (!valid) return

    const quotePreviewData = {
      ...valid,
      email: companyInfor.email,
      phone: companyInfor.phone,
    }

    sessionStorage.setItem(
      'quotePreviewData',
      JSON.stringify(quotePreviewData),
    )
    const url = this.fromEdit
      ? `/quote-detail?preview-id=${this.utils.urlHelper.searchParams.get(
        'quote-id',
      )}`
      : '/quote-detail'
    return this.utils.urlHelper.redirect(url)
  }

  bindUploadCSV() {
    const $CSV = document.querySelector('#customer_sku_csv')
    if ($CSV) {
      $CSV.addEventListener('click', e => {
        const { B3CompanyId } = this.state.userInfo

        if (!B3CompanyId.value) {
          this.utils.Alert.error('Please choose a company!')
          e.preventDefault()
        }
      })

      $CSV.addEventListener('change', async e => {
        const [file] = e.target.files
        const reg = new RegExp('[.](csv)$')
        if (!file) return

        if (!reg.test(file.name)) {
          return this.utils.Alert.error(this.locales.validation.uploadNotCsv)
        }

        const companyId = this.state.userInfo.B3CompanyId.value
        const formData = new FormData()
        formData.append('companyId', companyId)
        formData.append('quoteFile', file)

        await this.searchQuoteCSV(formData)
        $CSV.value = ''
      })
    }
  }

  async searchQuoteCSV(formData) {
    const { productList } = this.state

    window.B3Spinner.show()
    try {
      const { productList: list, report } = await this.api.uploadQuoteCSV(
        formData,
      )

      const newList = [
        ...productList,
        ...getCorrectProductImages(list, 'imageUrl'),
      ].reduce((result, item) => {
        const hasOptions = Object.keys(item).length
        const { productId, variantId } = item
        const preIndex = result.findIndex(preItem => (hasOptions
          ? +preItem.variantId === +variantId
          : +preItem.productId === +productId))
        if (preIndex !== -1) result.splice(preIndex, 1)
        result.unshift(item)

        return result
      }, [])
      this.setState({
        productList: newList,
      })

      this.renderCountProduct()
      this.renderSummary()
      const $report = uploadReportTemplate(report)
      document.querySelector('.upload-report-container').innerHTML = $report
    } catch {
      //
    }
    window.B3Spinner.hide()
  }
}

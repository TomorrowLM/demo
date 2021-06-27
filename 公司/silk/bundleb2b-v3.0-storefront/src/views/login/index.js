import _ from 'lodash'
import axios from 'axios'
import BasePage from '../../common/BasePage'
import getBCToken from '../../common/api/getBCToken'
import {
  B3CompanyStatus,
  B3Role,
} from '../../common/utils/constants'
import navigation from './navigation.html'
import navItem from './navItem.html'
import themeConfig from '../../themeConfig'
import lang from '../../common/lang/en.json'
import endMasquerade from './endMasquerade.html'
import mobileQuickOrderButton from './mobileQuickOrderButton.html'
import pcQuickOrderButton from './pcQuickOrderButton.html'
import triggerCartNumber from '../../common/api/triggerCartNumber'
import pdp from '../pdp'
import containers from '../../containers'

_.templateSettings.interpolate = /{([\s\S]+?)}/g

export default class Login extends BasePage {
  constructor() {
    super()
    this.name = 'Login'
    this.state = {
      endMasqueradeContainerSelector: '.salerep-infobox',
      endMasqueradeSelector: '.salerep-infobox [end-masquerade]',
      isShowAddressBook: false,
      isShowQuotes: false,
      templatesWithoutNav: [
        'pages/category',
        'pages/blog',
        'pages/brand',
        'pages/brands',
        'pages/contact-us',
        'pages/product',
      ],
    }
  }

  get navBarEls() {
    return document.querySelectorAll('.navBar.navBar--sub.navBar--account .navBar-section')
  }

  get shouldGetUserInfo() {
    const {
      email: customEmail,
    } = this.context.customer
    const {
      B3RoleId,
      B3CompanyStatus: customCompanyStatus,
      B3Email,
    } = this.utils.B3Storage

    return !(
      (
        (B3RoleId.value
          && customCompanyStatus.value === B3CompanyStatus.APPROVED
        )
        || B3RoleId.value === B3Role.SALESREP
      )
      && customEmail === B3Email.value
    )
  }

  get shouldGetCompnayInfo() {
    const {
      B3CompanyId,
      B3RoleId,
      B3CompanyStatus,
      B3Email,
    } = this.utils.B3Storage

    const {
      email,
    } = this.context.customer

    return !!(
      email !== B3Email.value
      || (
        (
          !B3CompanyStatus.value
          || B3CompanyId.value
        )
        && B3RoleId.value !== B3Role.SALESREP
      )
    )
  }

  get isHideMasqueradedB3Navs() {
    const {
      SALESREP,
    } = B3Role
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage
    const isMasqueraded = (SALESREP === B3RoleId.value) && B3CompanyId.value

    const { pathname } = window.location

    const isQuoteDetail = this.utils.urlHelper.searchParams.has('quote-id')
    const isMasqueradedEdit = this.utils.urlHelper.searchParams.has('preview-id')

    return [
      '/create-quote/',
      '/quote-edit/',
    ].includes(pathname) || (
      pathname === '/quote-detail/' && (
        isMasqueraded
        && (
          !isQuoteDetail
          || isMasqueradedEdit
        )
      )
    )
  }

  get isInsearch() {
    return this.context.template === 'pages/search'
  }

  async init() {
    if (this.isB2CUser) return

    if (this.shouldGetUserInfo) {
      try {
        this.utils.B3Storage.clear()

        const bcToken = await getBCToken()
        const b2bToken = await this.setB3Token(bcToken)

        if (!b2bToken) return
        await this.setUserRole()
        await this.getCompaniesQuotesStatus()
      } catch {
        const errorMessage = this.locales.tips.globalError
        this.utils.Alert.error(errorMessage)
      }
    }

    const {
      B3RoleId,
      B3isSetSalesRep,
      B3UserId,
    } = this.utils.B3Storage

    const roleId = B3RoleId.value
    const userId = B3UserId.value
    // if begain in create quote
    this.initSelerRep()
    await this.getCompaniesQuotesStatus()

    if (this.shouldGetCompnayInfo) await this.getCompanyInfo(userId)

    if (roleId === B3Role.JUNIOR) {
      const hideAddBtnStyle = document.createElement('style')

      hideAddBtnStyle.innerHTML = `#form-action-addToCart,#add_to_cart,#add_to_cart_csv,[advqty-card-addtocart],[href*='/cart.php?action=add'],[href='/user-management/'],[href='/cart.php']
      {display:none!important}`

      if (document.querySelector('head')) document.querySelector('head').append(hideAddBtnStyle)
    }

    if (roleId === B3Role.SALESREP && !B3isSetSalesRep.value) {
      // end company msq
      await this.setSalesRep(userId)
    }

    if (this.shouldShowAddressBook) {
      await this.getIsShowAddressBook()
    }

    this.renderNavs()

    pdp.mount()

    // try {
    //   triggerCartNumber()
    // } catch (error) {
    //   // console.log(error)
    // }

    this.clearQuoteCart(this.context.cartId)
  }

  initSelerRep() {
    const {
      B3RoleId,
    } = this.utils.B3Storage
    const beginInCreateQuote = sessionStorage.getItem('beginInCreateQuote')
    const quotePagesArry = [
      '/create-quote/',
      '/quote-detail/',
      '/quote-edit/',
    ]
    const notInQuotePage = !quotePagesArry.includes(window.location.pathname)
    const shouldEndCompany = B3RoleId.value === '3' && beginInCreateQuote && notInQuotePage
    if (!shouldEndCompany) return
    this.handleEndMasqueradeCompany()
  }

  renderNavs() {
    const { pathname } = window.location

    if (!this.isHideMasqueradedB3Navs) {
      this.renderEndMasquerade()

      this.renderQuickOrderPadBtn()
    }

    if ([
      '/',
      '/trade-professional-application/',
      '/rss-syndication/',
      '/shipping-returns/',
    ].includes(pathname) && !this.isMobile) return

    if (this.state.templatesWithoutNav.includes(this.context.template)) return

    const accountPageType = themeConfig.accountPages[this.context.template] ?? ''
    const templateLang = _.cloneDeep(lang)
    const {
      customer,
    } = this.context
    const {
      messages,
      wishlists,
    } = lang.account.nav

    templateLang.account.nav = {
      ...lang.account.nav,
      messages: _.template(messages)({
        num_new_messages: customer.num_new_messages ?? 0,
      }),
      wishlists: _.template(wishlists)({
        num_wishlists: customer.num_wishlists ?? 0,
      }),
    }

    if (this.navBarEls) this.navBarEls.forEach(navBarEl => navBarEl.parentNode.remove())

    if (!this.isInsearch || this.isMobile) {
      this.utils.renderTemplate({
        hbsTemplate: navigation,
        templateConfig: {
          ...this.context,
          accountPage: {
            [accountPageType]: true,
          },
          accountOrder: this.context.page_type === 'account_order',
          lang: templateLang,
        },
        containerSelector: '.page-heading',
        insertType: 'afterend',
      })
    }
    if (!this.isInsearch || this.isMobile) this.renderB3Navs()
  }

  renderB3Navs({
    containerSelector = '',
    navItemClassName = '',
    navActionClassName = '',
    insertType = '',
  } = {}) {
    const {
      B3RoleId,
    } = this.utils.B3Storage
    const {
      isShowAddressBook,
      isShowQuotes,
    } = this.state

    const {
      JUNIOR,
      SALESREP,
    } = B3Role

    const roleId = B3RoleId.value

    const {
      'nav.button.dashboard': Dashboard,
      'nav.button.quotes': Quotes,
      'nav.button.userManagement': UserManagement,
      'nav.button.addressBook': Addresses,
    } = this.text

    let B3Navigations = Object.values(this.doms).filter(dom => dom.isNav)

    const getNavigations = (names, isEqual = true) => B3Navigations.filter(({ name }) => (isEqual ? names.includes(name) : !names.includes(name)))

    if (!this.isCompanyApproved || this.isHideMasqueradedB3Navs) {
      const filters = roleId === SALESREP ? [Dashboard, Quotes] : [Dashboard]
      B3Navigations = getNavigations(filters)
    }
    if (roleId !== SALESREP) B3Navigations = getNavigations([Dashboard], false)
    if (!isShowAddressBook) B3Navigations = getNavigations([Addresses], false)
    if (!isShowQuotes) B3Navigations = getNavigations([Quotes], false)
    if (roleId === SALESREP || roleId === JUNIOR) B3Navigations = getNavigations([UserManagement], false)

    const defaultNavItemClassName = this.isMobile ? 'navPage-subMenu-item b3-navs' : 'navBar-item'
    const defaultNavActionClassName = this.isMobile ? 'navPages-action' : 'navBar-action'
    const defaultInsertType = this.isMobile ? 'afterbegin' : 'beforeend'

    document.querySelectorAll('.b3-navs').forEach(b3Nav => {
      b3Nav.remove()
    })

    B3Navigations.forEach(({
      name,
      url,
      buttonContainer,
      mobileContainer,
    }) => {
      const defaultContainerSelector = this.isMobile ? mobileContainer : buttonContainer

      this.utils.renderTemplate({
        hbsTemplate: navItem,
        templateConfig: {
          url,
          name,
          navItemClassName: navItemClassName || defaultNavItemClassName,
          navActionClassName: navActionClassName || defaultNavActionClassName,
          isActive: window.location.pathname.includes(url) ? 'is-active' : '',
        },
        containerSelector: containerSelector || defaultContainerSelector,
        insertType: insertType || defaultInsertType,
      })
    })

    this.removeBCMenus()
  }

  removeBCMenus() {
    const {
      isShowAddressBook,
    } = this.state

    const wishlistsEls = document.querySelectorAll('[href^="/wishlist.php"]')
    const addressesEls = document.querySelectorAll('[href^="/account.php?action=address_book"]')
    const actionWishlists = document.querySelectorAll('[action^="/wishlist.php"]')
    wishlistsEls.forEach(wishlistsEl => {
      if (wishlistsEl.parentNode.children.length > 1) wishlistsEl.remove()
      else wishlistsEl.parentNode.remove()
    })
    if (isShowAddressBook) {
      addressesEls.forEach(addressesEl => {
        addressesEl.parentNode.remove()
      })
    }
    actionWishlists.forEach(actionWishlist => {
      actionWishlist.remove()
    })
  }

  renderEndMasquerade() {
    const {
      B3RoleId,
      B3CompanyName,
      B3CompanyId,
    } = this.utils.B3Storage

    const {
      endMasqueradeContainerSelector,
      endMasqueradeSelector,
    } = this.state

    if (!(B3RoleId.value === B3Role.SALESREP && B3CompanyId.value)) return

    const prevEndMasqueradeContainer = document.querySelector(endMasqueradeContainerSelector)
    if (prevEndMasqueradeContainer) prevEndMasqueradeContainer.remove()

    this.utils.renderTemplate({
      hbsTemplate: endMasquerade,
      templateConfig: {
        companyName: B3CompanyName.value,
      },
      containerSelector: containers['dashboard.endMasquerade.container'],
      insertType: 'afterend',
    })

    const $endMasqueradeContainer = document.querySelector(endMasqueradeContainerSelector)

    $endMasqueradeContainer.addEventListener('click', function handleClickEndMasqueradeContainer(e) {
      if (!e.target.classList.contains('button--primary')) this.classList.toggle('saler-extends')
    })

    document.querySelector(endMasqueradeSelector).addEventListener('click', () => {
      this.handleEndMasqueradeCompany()
    })
  }

  renderQuickOrderPadBtn() {
    if (!this.isCompanyApproved) return
    const {
      B3RoleId,
    } = this.utils.B3Storage

    const {
      quickOrderPad: {
        buttonContainer,
        mobileContainer,
        url,
        name,
      },
    } = this.doms

    const btnConfig = {
      // style,
      isVisible: B3RoleId.value !== '2',
      url,
      ButtonText: name,
    }

    this.removeQuickOrderPadBtn()

    this.utils.renderTemplate({
      hbsTemplate: this.isMobile ? mobileQuickOrderButton : pcQuickOrderButton,
      templateConfig: btnConfig,
      containerSelector: this.isMobile ? mobileContainer : buttonContainer,
    })
  }

  removeQuickOrderPadBtn() {
    const mobileButton = document.querySelector('#m-quickorderpad-entry')
    const pcButton = document.querySelector('#pc-quickorderpad-entry')

    if (mobileButton) {
      mobileButton.remove()
    }

    if (pcButton) {
      pcButton.remove()
    }
  }

  async clearQuoteCart(cartId) {
    const quoteCheckoutId = localStorage.getItem('quoteCheckoutId')
    if (quoteCheckoutId) {
      try {
        window.B3Spinner.show()
        await this.api.deleteCheckoutInfo(quoteCheckoutId)
        localStorage.removeItem('quoteCheckoutId')
        await axios.delete(`/api/storefront/carts/${cartId}`)
        triggerCartNumber()
        window.B3Spinner.hide()
      } catch (error) {
        localStorage.removeItem('quoteCheckoutId')
        window.B3Spinner.hide()
      }
    }
  }

  async getIsShowAddressBook() {
    const {
      B3AddressBook,
    } = this.utils.B3Storage

    if (B3AddressBook.isAllow.value) {
      this.setState({
        isShowAddressBook: true,
      })
      return
    }

    try {
      await this.getAddressBookPermission()
      if (B3AddressBook.isAllow.value) {
        this.setState({
          isShowAddressBook: true,
        })
      }
    } catch {
      const errorMessage = this.locales.tips.globalError
      this.utils.Alert.error(errorMessage)
    }
  }

  async getCompaniesQuotesStatus() {
    try {
      const { status } = await this.api.getCompaniesQuotesStatus()
      this.setState({
        isShowQuotes: status === '1',
      })
    } catch {
      //
    }
  }

  watch = {
    endMasqueradeCompany: () => {
      // remove the global endMasqueradeContainer
      const {
        endMasqueradeContainerSelector,
      } = this.state
      if (document.querySelector(endMasqueradeContainerSelector)) {
        document.querySelector(endMasqueradeContainerSelector).remove()
      }

      this.removeQuickOrderPadBtn()
      this.renderNavs()
    },
    beginMasqueradeCompany: async () => {
      await this.getIsShowAddressBook()
      this.renderNavs()
    },
  }
}

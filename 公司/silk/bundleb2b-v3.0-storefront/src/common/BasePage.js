import axios from 'axios'
import {
  debounce,
  noop,
} from 'lodash'
import ResponsiveTable from '@uidax/responsive-table'
import classes from './jss'
import doms from './doms'
import text from './text'
import * as api from './api'
import * as utils from './utils'
import * as locales from './locales'
import themeConfig from '../themeConfig'
import { leftIncludes } from './utils/util'
import { B3Role } from './utils/constants'

export default class BasePage {
  static notify(dispatch) {
    const callee = key => {
      window.B2BPages.forEach(instance => {
        const callback = instance.watch?.[key]
        if (callback instanceof Function) callback.call(instance)
      })
    }
    if (typeof dispatch === 'string') callee(dispatch)
  }

  constructor() {
    this.api = api || {}
    this.utils = utils || {}
    this.context = window.jsContext || {}
    this.classes = classes || {}
    this.doms = doms || {}
    this.text = text || {}
    this.locales = locales
    this.state = {}
    this.watch = {}
    this.mobileTable = null
  }

  setState(state) {
    this.state = {
      ...this.state,
      ...state,
    }
  }

  get shouldMount() {
    return true
  }

  get isMobile() {
    return 'ontouchstart' in document
  }

  get isLogin() {
    return !!this.context.customer
  }

  get isB2CUser() {
    return !!this.utils.B3Storage.B3IsB2CUser.value
  }

  get isB2BUser() {
    const {
      B3CompanyId,
      B3CompanyStatus,
      B3RoleId,
    } = this.utils.B3Storage

    return !!(
      (
        B3CompanyId.value
        && B3CompanyStatus.value === '1'
      )
      || B3RoleId.value === '3'
    )
  }

  get isCompanyApproved() {
    const {
      B3CompanyStatus: B3CompanyState,
    } = this.utils.B3Storage

    return Boolean(B3CompanyState.value === '1')
  }

  get shouldShowAddressBook() {
    const {
      B3RoleId,
      B3CompanyStatus,
    } = this.utils.B3Storage
    const {
      ADMIN,
      SENIOR,
      JUNIOR,
      SALESREP,
    } = B3Role

    const roleId = B3RoleId.value
    const companyStatus = B3CompanyStatus.value

    return (
      [ADMIN, SENIOR, JUNIOR].includes(roleId)
      || (roleId === SALESREP && !!companyStatus)
    )
  }

  static async mount() {
    // TODO: public logic
    const instance = new this()

    const jsRewrites = themeConfig.js ?? {}
    const jsRewrite = jsRewrites[instance.name.toLowerCase()]
    const forbidden = jsRewrite ?.overwrite ?? false
    const callback = jsRewrite ?.callback ?? noop
    const beforeMount = jsRewrite ?.beforeMount ?? noop
    const mounted = jsRewrite ?.mounted ?? noop

    try {
      if (instance.shouldMount && !forbidden) {
        await beforeMount(instance)
        await instance.init()
        window.B2BPages = window.B2BPages ?? []
        window.B2BPages.push(instance)
        instance.clickDelegate()
        mounted(instance)
      }
    } catch {
      //
    }

    callback(instance)
  }

  initMobileTable(hiddenLabels) {
    if (!this.mobileTable) {
      this.mobileTable = new ResponsiveTable({
        tableSelector: '.responsive-table',
        breakPoint: '551',
        hiddenLabels,
      })
    }
  }

  async setB3Token(bcToken) {
    const {
      B3B2BToken,
      B3IsB2CUser,
    } = this.utils.B3Storage
    let token

    try {
      const {
        customer: {
          id: customerId,
        },
        store_hash: storeHash,
      } = this.context

      const {
        data: resp,
      } = await axios.post(`${themeConfig.apiBaseUrl}/api/v2/login`, {
        bcToken,
        customerId,
        storeHash,
      })
      if (resp.code === 200) {
        token = resp.data.token
        B3B2BToken.setValue(token)
      } else B3IsB2CUser.setValue(true)
    } catch (error) {
      //
    }

    return token
  }

  async setUserRole() {
    const {
      B3RoleId,
      B3UserId,
      B3Email,
    } = this.utils.B3Storage
    const customerId = this.context.customer.id
    const {
      roleId,
      userId,
      email,
    } = await this.api.getUserRole(customerId)

    if (!roleId) return

    B3RoleId.setValue(roleId)
    B3UserId.setValue(userId)
    B3Email.setValue(email)
  }

  async getCompanyInfo(userId) {
    const {
      B3CompanyId,
      B3CompanyStatus,
      B3CompanyName,
    } = this.utils.B3Storage
    const resp = await this.api.getCompany(userId)

    B3CompanyId.setValue(resp.companyId)
    B3CompanyStatus.setValue(resp.companyStatus)
    B3CompanyName.setValue(resp.companyName)
    return resp
  }

  async setSalesRep(userId) {
    const customerId = this.context.customer.id

    try {
      const salesRepInformation = await this.api.getSelerep(customerId)
      sessionStorage.setItem('salesRepInformation', JSON.stringify(salesRepInformation))
      const {
        companyId: masqueradeCompanyId,
      } = salesRepInformation
      if (masqueradeCompanyId) await this.api.endMasqueradeCompany(userId, masqueradeCompanyId)
    } catch {
      //
    } finally {
      this.utils.B3Storage.B3isSetSalesRep.setValue('1')
      this.utils.urlHelper.redirect(this.doms.dashboard.url)
    }
  }

  handleInputSearch = debounce((callback = noop) => callback(), 800)

  handleEndMasqueradeCompany = async (isRedirect = true) => {
    const {
      B3Storage: {
        B3CompanyId,
        B3UserId,
        B3CompanyStatus,
        B3CompanyName,
      },
      urlHelper,
    } = this.utils

    const {
      dashboard: {
        url: dashboardUrl,
      },
    } = this.doms

    if (!B3CompanyId.value) return

    window.B3Spinner.show()
    try {
      await this.api.endMasqueradeCompany(B3UserId.value, B3CompanyId.value)

      B3CompanyId.removeValue()
      B3CompanyStatus.removeValue()
      B3CompanyName.removeValue()

      sessionStorage.removeItem('B3CompanyInfo')
      sessionStorage.removeItem('quotePreviewData')
      sessionStorage.removeItem('salesRepInformation')
      sessionStorage.removeItem('beginInCreateQuote')
      const isInDashboard = leftIncludes(window.location.pathname, dashboardUrl)
      if (!isInDashboard && isRedirect) urlHelper.redirect(dashboardUrl)

      BasePage.notify('endMasqueradeCompany')
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  clickDelegate() {
    ['click', 'input', 'change', 'keyup'].forEach(item => {
      document.querySelector('body').addEventListener(item, e => {
        const { stop } = e.target.dataset
        const ev = e.target.dataset[item]
        let shouldRun = true

        if (item === 'keyup' && e.target.dataset.enter && e.keyCode !== 13) shouldRun = false

        if (ev && typeof this[ev] === 'function' && shouldRun) {
          this[ev](e)
          return !stop
        }
        return true
      })
    })
  }

  async getAddressBookPermission() {
    const {
      B3AddressBook,
    } = this.utils.B3Storage

    window.B3Spinner.show()
    try {
      const {
        isAllow,
        isEnabled,
      } = await this.api.getAddressPermission()

      B3AddressBook.isAllow.setValue(isAllow)
      B3AddressBook.isEnabled.setValue(isEnabled)
    } catch {
      this.utils.Alert.error(locales.tips.globalError)
    }
    window.B3Spinner.hide()
  }
}

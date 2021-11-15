import BasePage from '../../common/BasePage'
import files from './files.html'

export default class AccountSetting extends BasePage {
  constructor() {
    super()
    this.name = 'AccountSetting'
    this.state = {
      path: 'pages/account/edit',
    }
  }

  get inPage() {
    return this.context.template === this.state.path || this.context.template === this.state.path
  }

  getRole(type) {
    const gRoleDefine = {
      0: 'Admin',
      1: 'Senior Buyer',
      2: 'Junior Buyer ',
      3: 'Sale Representative',
    }
    return gRoleDefine[type]
  }

  async init() {
    if (this.inPage) {
      const {
        B3RoleId,
        B3CompanyName,
      } = this.utils.B3Storage

      if (!this.isB2BUser) {
        return
      }

      const companyEl = document.querySelector('#account_companyname')

      this.setState({
        companyName: B3CompanyName?.value,
        B3Role: this.getRole(B3RoleId.value),
      })

      if (B3CompanyName) {
        companyEl.value = this.state.companyName
        companyEl.setAttribute('disabled', 'true')
      }

      this.utils.renderTemplate({
        hbsTemplate: files,
        containerSelector: '.form[data-edit-account-form] [data-type="EmailAddress"]',
        templateConfig: {
          ...this.state,
        },
        insertType: 'beforebegin',
      })
    }
  }
}

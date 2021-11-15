import swal from 'sweetalert2'
import BasePage from '../../common/BasePage'
import {
  B3CompanyStatus,
  B3Role,
} from '../../common/utils/constants'
import userManagement from './userManagement.html'
import listsHtml from './lists.html'
import editUserForm from './editUserForm.html'
import { leftIncludes } from '../../common/utils/util'
import lang from '../../common/lang/en.json'
import nod from '../../lib/nod'

export default class UserManagement extends BasePage {
  constructor() {
    super()
    this.name = 'UserManagement'
    this.state = {
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      userLists: [],
      userInfo: {},
      editUserSelector: '#edit-user-container',
      updateUserFormSelector: '#modal-user-management-edit-form form',
      createUserFormSelector: '#modal-user-management-new-form form',
      roleOptions: [
        { value: '0', title: this.text['global.user.admin.label'] },
        { value: '1', title: this.text['global.user.senior.label'] },
        { value: '2', title: this.text['global.user.junior.label'] },
      ],
    }
  }

  get isInpage() {
    return leftIncludes(window.location.pathname, this.doms.userManagement.url)
  }

  async init() {
    this.state.userInfo = { ...this.utils.B3Storage }

    if (!this.isB2BUser) return

    if (!this.isInpage) return

    const forbiden = Boolean((!this.state.userInfo.B3RoleId?.value || this.state.userInfo.B3CompanyStatus?.value !== B3CompanyStatus.APPROVED || this.state.userInfo.B3RoleId?.value === B3Role.JUNIOR))

    if (forbiden && this.isInpage) {
      this.utils.Alert.error(this.locales.tips.cannotEnrtyPage)
      this.utils.urlHelper.redirect('/')
      return
    }

    this.render()
    this.handleEvents()
  }

  handleEvents() {
    const {
      roleOptions,
    } = this.state
    document.querySelector('body').addEventListener('click', async e => {
      if (e.target.hasAttribute('data-edit-user')) {
        document.querySelector(this.state.editUserSelector).innerHTML = ''
        const userInfo = {}
        userInfo.email = e.target.getAttribute('data-email') || ''
        userInfo.lastName = e.target.getAttribute('data-last-name') || ''
        userInfo.firstName = e.target.getAttribute('data-first-name') || ''
        userInfo.phone = e.target.getAttribute('data-phone') || ''
        userInfo.userId = e.target.getAttribute('data-user-id') || ''
        userInfo.role = e.target.getAttribute('data-role') || ''

        this.utils.renderTemplate({
          hbsTemplate: editUserForm,
          containerSelector: this.state.editUserSelector,
          templateConfig: {
            ...userInfo,
            classes: this.classes,
            roleOptions: roleOptions.map(item => {
              let selected = ''
              if (item.value === userInfo.role) selected = 'selected'
              return {
                ...item,
                selected,
              }
            }),
            lang,
          },
          insertType: 'beforeend',
        })
        this.addVlidation(this.state.updateUserFormSelector)
      }

      if (e.target.hasAttribute('data-delete-user')) {
        const userId = e.target.getAttribute('data-user-id')
        swal({
          text: this.locales.tips.confireDeleteUser,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sure',
          closeOnConfirm: false,
        }).then(async result => {
          if (!result.value) return
          window.B3Spinner.show()
          await this.api.deleteUser(userId)
          this.utils.Alert.success(this.locales.tips.deleteUser)
          await this.renderLists()
        })
      }

      if (e.target.id === 'update_user') {
        try {
          this.updateUserValidator.performCheck()
          if (!this.updateUserValidator.areAll('valid')) return
          const userId = e.target.getAttribute('data-user-id')
          this.handleUser(this.state.updateUserFormSelector, '#update_user', false, userId)
        } catch {
          window.B3Spinner.hide()
        }
      }

      if (e.target.id === 'save_new_user') {
        try {
          this.createUserValidator.performCheck()
          if (!this.createUserValidator.areAll('valid')) return
          this.handleUser(this.state.createUserFormSelector, '#save_new_user', true)
        } catch {
          window.B3Spinner.hide()
        }
      }
    })
  }

  async handleUser(selector, BtnSelector, create, userId) {
    const userData = this.getUserData(selector)

    document.querySelector(BtnSelector).setAttribute('disabled', 'true')
    try {
      if (create) {
        await this.api.saveNewUser(userData)
      } else {
        await this.api.updateUserInfo(userId, userData)
      }
      document.querySelector(`${selector} .modal-close`).click()
      this.state.pagination.offset = 0
      await this.renderLists()
    } finally {
      document.querySelector(BtnSelector).removeAttribute('disabled')
    }
  }

  getUserData(selector) {
    return {
      companyId: this.state.userInfo.B3CompanyId?.value,
      firstName: document.querySelector(`${selector} #first_name`).value,
      lastName: document.querySelector(`${selector} #last_name`).value,
      email: document.querySelector(`${selector} #email`).value,
      phoneNumber: document.querySelector(`${selector} #phone`).value,
      role: document.querySelector(`${selector} #role_id`).value,
    }
  }

  addVlidation(selector, create) {
    const {
      utils: {
        re,
      },
    } = this
    const updateUserValidator = nod({
      button: `${selector} input[type="button"]`,
    })
    updateUserValidator.add([
      {
        selector: `${selector} input[name="first_name"]`,
        validate: (cb, val) => {
          const result = val.length
          cb(result)
        },
        errorMessage: this.locales.validation.fistNameIncorrect,
      }, {
        selector: `${selector} input[name="last_name"]`,
        validate: (cb, val) => {
          const result = val.length
          cb(result)
        },
        errorMessage: this.locales.validation.lastNameIncorrect,
      }, {
        selector: `${selector} input[name="email"]`,
        validate: (cb, val) => {
          cb(re.email.test(val))
        },
        errorMessage: this.locales.validation.emailIncorrect,
      },
      {
        selector: `${selector} input[name="phone"]`,
        validate: (cb, val) => {
          if (val === '') {
            cb(true)
          } else {
            cb(re.phone.test(val))
          }
        },
        errorMessage: this.locales.validation.phoneIncorrect,
      },
    ])

    if (create) {
      this.createUserValidator = updateUserValidator
      return
    }

    this.updateUserValidator = updateUserValidator
  }

  async render() {
    const {
      userManagement: {
        container,
      },
    } = this.doms

    const {
      B3RoleId,
    } = this.utils.B3Storage
    const showAddBtn = B3RoleId.value === '0'
    this.utils.renderTemplate({
      hbsTemplate: userManagement,
      containerSelector: container,
      templateConfig: {
        ...this.state,
        showAddBtn,
        classes: this.classes,
        lang,
      },
      insertType: 'beforeend',
    })

    await this.renderLists()
    this.addVlidation(this.state.createUserFormSelector, true)
    this.initMobileTable()
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
      onPageChange: this.handlePaginationChange.bind(this),
    })
  }

  resetForm() {
    const inputs = ['#email', '#first_name', '#last_name', '#phone']
    const container = document.querySelector('#modal-user-management-new-form')

    container.querySelector('#role_id').options[0].selected = true
    inputs.forEach(selector => {
      const item = container.querySelector(selector)
      item.value = ''

      if (!item.nextElementSibling) return
      const siblingSpan = item.nextElementSibling
      siblingSpan.innerHTML = ''
      siblingSpan.className = ''
      siblingSpan.style.display = 'none'
      const inintSpan = document.createElement('span')
      inintSpan.style.display = 'none'
      item.parentNode.append(inintSpan)
      item.parentNode.classList.remove('form-field--error')
      item.parentNode.classList.remove('form-field--success')
    })
  }

  async renderLists() {
    window.B3Spinner.show()
    const { list, pagination } = await this.getUsers()
    const showAction = this.state.userInfo.B3RoleId.value === B3Role.ADMIN
    this.state.pagination = pagination

    this.state.userLists = list.map(item => {
      if (item.role === '0') {
        item.roleName = this.text['global.user.admin.label']
      } else if (item.role === '1') {
        item.roleName = this.text['global.user.senior.label']
      } else if (item.role === '2') {
        item.roleName = this.text['global.user.junior.label']
      }
      return item
    })

    document.querySelector('#table-container').innerHTML = ''

    this.utils.renderTemplate({
      hbsTemplate: listsHtml,
      containerSelector: '#table-container',
      templateConfig: {
        ...this.state,
        classes: this.classes,
        lang,
        showAction,
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

  getUsers() {
    return this.api.getCompanyUser(this.state.userInfo.B3CompanyId?.value, { ...this.state.pagination, role: ['0', '1', '2'] })
  }
}

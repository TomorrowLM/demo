import BasePage from '../../common/BasePage'
import formFiles from './formFiles.html'
import tpaButton from './tpaButton.html'
import tpaMobileButton from './tpaMobileButton.html'
import tpaForm from './tpaForm.html'
import createCompany from './createCompany'
import message from './message.html'
import getBCToken from '../../common/api/getBCToken'
import nod from '../../lib/nod'
import {
  B3CompanyStatus,
  getB3ConstantLabel,
  b3ExtraFieldTypes,
} from '../../common/utils/constants'
import checkboxTemplate from './forms/checkbox.html'
import dateTemplate from './forms/date.html'
import multilineTemplate from './forms/multiline.html'
import numberTemplate from './forms/number.html'
import passwordTemplate from './forms/password.html'
import radioTemplate from './forms/radio.html'
import selectTemplate from './forms/select.html'
import selectorTextTemplate from './forms/selectortext.html'
import textTemplate from './forms/text.html'
import themeConfig from '../../themeConfig'

const {
  tpa,
} = themeConfig.js

export default class Tpa extends BasePage {
  constructor() {
    super()
    this.name = 'Tpa'
    const tpaContainerSelector = this.doms.tpa.container.default
    this.state = {
      isShowTpaQuery: 'show_tpa',
      createFormSelector: '.form[data-create-account-form]',
      tpaSubmitBtnId: 'tpa_submit_btn',
      isTpaFormVisibel: true,
      isTpaFormHide: true,
      companyFormSelector: '[data-create-company-form]',
      tpaContainerSelector,
      tpaPageContainer: document.querySelector(tpaContainerSelector),
      extraFields: [],
      companyExtraFields: [],
      customFields: [],
    }
  }

  get formPartials() {
    return {
      checkbox: checkboxTemplate,
      date: dateTemplate,
      multiline: multilineTemplate,
      number: numberTemplate,
      password: passwordTemplate,
      radio: radioTemplate,
      select: selectTemplate,
      selectorText: selectorTextTemplate,
      text: textTemplate,
    }
  }

  get isInpage() {
    return window.location.href.indexOf(this.doms.tpa.url.default) > -1
  }

  get shouldUpdateCompanyInfo() {
    return !!(document.querySelector('[data-create-company-form] input[type=submit]').getAttribute('data-submit-type') === 'resubmit')
  }

  async init() {
    const {
      isShowTpaQuery,
    } = this.state

    const isShowTpa = this.utils.urlHelper.searchParams.has(isShowTpaQuery)
    const isRegisterFail = this.checkRegisterFail(this.context)

    this.initTpaBtn()
    if (!this.isLogin) this.guestInit()
    else await this.userInit()

    if (isShowTpa || this.isInpage || isRegisterFail) {
      await this.setExtraFields()
      this.renderExtraFields()
      this.renderCustomFields()
    }
  }

  guestInit() {
    const {
      isShowTpaQuery,
    } = this.state

    const isShowTpa = this.utils.urlHelper.searchParams.has(isShowTpaQuery)
    const isRegisterFail = this.checkRegisterFail(this.context)

    this.utils.B3Storage.clear()

    if (!isShowTpa && !isRegisterFail) {
      window.B3Spinner.hide()
      return
    }

    this.initCreatePageUI()
    this.bindGuestEvent()
    this.initGuestValidation()

    if (isRegisterFail) {
      this.handleRegisterFailed()
    }

    window.B3Spinner.hide()
    document.querySelector('#tpa_submit_btn').value = this.text['tpa.form.submit.button']
  }

  async userInit() {
    const container = this.doms?.tpa?.buttonContainer
    await this.initTAPSessionStorageData()
    if (!container || !document.querySelector(container)) return
    if (!this.isInpage) return
    this.initUserValidation()
    await this.initPage()
  }

  initTpaBtn() {
    let url
    const {
      tpa: {
        buttonContainer,
        mobileContainer,
        url: {
          default: tapUrl,
          guest: guestTpaUrl,
        },
      },
    } = this.doms

    if (this.isLogin) {
      if (this.isB2BUser) return
      url = tapUrl
    } else {
      url = guestTpaUrl
    }

    const btnConfig = {
      isVisible: true,
      url,
    }

    this.utils.renderTemplate({
      hbsTemplate: this.isMobile ? tpaMobileButton : tpaButton,
      templateConfig: btnConfig,
      containerSelector: this.isMobile ? mobileContainer : buttonContainer,
    })
  }

  checkRegisterFail() {
    const template = this.context.template_file ? this.context.template_file : this.context.template
    const TPAData = this.utils.B3Storage.TPACompanyInfo.value
    const registerStatus = (template === 'pages/auth/create-account') && TPAData && !this.isLogin
    return registerStatus
  }

  initCreatePageUI() {
    const {
      createFormSelector,
      tpaSubmitBtnId,
      isTpaFormVisibel: isVisible,
      isTpaFormHide: hide,
    } = this.state

    const {
      tpa: {
        container: {
          guest: tpaContainer,
        },
      },
    } = this.doms

    const templates = [
      {
        containerSelector: `${createFormSelector} .form-row`,
        insertType: 'beforeend',
        hbsTemplate: formFiles,
      },
      {
        containerSelector: '[data-type=\'CompanyName\'] label',
        insertType: 'beforeend',
        template: `<small>${this.text['global.required.label']}</small>`,
      },
      {
        containerSelector: tpaContainer,
        insertType: 'beforeend',
        hbsTemplate: tpaForm,
        templateConfig: {
          isVisible,
          hide,
          tpaSubmitBtnId,
        },
      },
    ]

    const removeDefaultCompanyNameRequired = () => {
      const $small = document.querySelector('[data-type=\'CompanyName\'] label small')
      if ($small) $small.remove()
    }
    removeDefaultCompanyNameRequired()

    templates.forEach(template => this.utils.renderTemplate(template))

    document.querySelector('.page-heading').innerHTML = this.text['tpa.button']
    document.querySelector(".form[data-create-account-form] input[type='submit']").parentElement.style.display = 'none'

    const validation = {
      type: 'singleline', label: '', required: true, maxlength: 0,
    }
    const addAttributes = ["[data-type='CompanyName']", '#tpa-email-filed', '#tpa-phone-filed']

    addAttributes.forEach(addAttribute => document.querySelector(addAttribute).setAttribute('data-validation', JSON.stringify(validation)))
  }

  bindGuestEvent() {
    const {
      tpaSubmitBtnId,
      createFormSelector,
    } = this.state

    document.querySelector('body').addEventListener('click', async e => {
      if (e.target.id === tpaSubmitBtnId) {
        e.preventDefault()
        e.stopPropagation()

        window.createAccountValidator.performCheck()
        const canSubmit = window.createAccountValidator.areAll('valid')

        if (!canSubmit) return
        let isDuplicate = true
        try {
          await this.checkExistCompany()
          isDuplicate = false
        } finally {
          this.toggleCompanyDuplicate(isDuplicate)
        }
        if (isDuplicate) return

        if (typeof tpa.beforeSubmit === 'function') await tpa.beforeSubmit(this)

        this.setFormSessionStorage()

        document.querySelector(createFormSelector).submit()
      }
    })
  }

  get companyDuplicateTip() {
    const $tip = document.querySelector('.company-duplicate-tip') ?? document.createElement('span')
    $tip.innerHTML = 'company name duplicated'
    $tip.className = 'company-duplicate-tip form-inlineMessage'
    return $tip
  }

  toggleCompanyDuplicate(isDuplicate) {
    const $companyContainer = this.isLogin ? document.querySelector('#company_name').parentNode : document.querySelector("[data-type='CompanyName']")
    const classes = ['form-field--error', 'form-field--success']
    const classAdd = isDuplicate ? classes[0] : classes[1]
    const classRemove = isDuplicate ? classes[1] : classes[0]

    $companyContainer.classList.add(classAdd)
    $companyContainer.classList.remove(classRemove)

    if (isDuplicate) {
      $companyContainer.append(this.companyDuplicateTip)
    } else {
      $companyContainer.querySelector('.company-duplicate-tip')?.remove()
    }
  }

  getCompanyExtraFields() {
    const {
      extraFields,
    } = this.state

    return extraFields.map(({ name }) => {
      const fieldValue = document.querySelector(`[name=${name}]`).value
      return {
        fieldName: name,
        fieldValue,
      }
    })
  }

  setFormSessionStorage() {
    const basicInfo = {
      storeHash: this.context.settings.store_hash,
    }

    const companyInfoFields = {
      companyName: "[data-field-type='CompanyName']",
      city: "[data-field-type='City']",
      state: "[data-field-type='State']",
      zipCode: "[data-field-type='Zip']",
      addressLine1: "[data-field-type='AddressLine1']",
      addressLine2: "[data-field-type='AddressLine2']",
      companyEmail: '#company_user_email',
      companyPhoneNumber: '#company_user_phone',
      country: "[data-field-type='Country']",
    }
    const companyInfo = Object.entries(companyInfoFields).reduce((result, [key, selector]) => {
      const value = document.querySelector(selector)?.value ?? ''
      result[key] = value
      return result
    }, {})
    this.utils.B3Storage.TPACompanyInfo.setValue(JSON.stringify({
      ...basicInfo,
      ...companyInfo,
      extraFields: this.getCompanyExtraFields(),
    }))
  }

  initGuestValidation() {
    const {
      state: {
        createFormSelector,
      },
      utils: {
        re,
      },
      locales: {
        validation,
      },
    } = this

    const validationSchema = [{
      selector: `${createFormSelector} [data-field-type='CompanyName']`,
      errorMessage: validation.companyNameVoid,
    }, {
      selector: `${createFormSelector} [data-field-type='TpaEmailFiled']`,
      errorMessage: validation.emailIncorrect,
      re: re.email,
    }, {
      selector: `${createFormSelector} [data-field-type='TpaPhoneFiled']`,
      errorMessage: validation.phoneIncorrect,
      re: re.phone,
    }]
    validationSchema.forEach(({
      selector,
      errorMessage,
      re,
    }) => {
      if (document.querySelectorAll(selector).length > 0) {
        window.createAccountValidator.remove(selector)
        window.createAccountValidator.add({
          selector,
          validate: (cb, val) => {
            if (re) return cb(re.test(val))
            if (val) {
              return cb(true)
            }
            return cb(false)
          },
          errorMessage,
        })
      }
    })
  }

  handleRegisterFailed() {
    this.renderTPAFrom()
    this.utils.B3Storage.TPACompanyInfo.removeValue()
  }

  renderTPAFrom() {
    const TPAData = this.utils.B3Storage.TPACompanyInfo.value
    const companyFields = JSON.parse(TPAData)

    document.querySelector("[data-field-type='TpaEmailFiled']").value = companyFields.companyEmail
    document.querySelector("[data-field-type='TpaPhoneFiled']").value = companyFields.companyPhoneNumber
  }

  async initTAPSessionStorageData() {
    const {
      TPACompanyInfo,
    } = this.utils.B3Storage
    const TPAData = TPACompanyInfo.value
    const customerId = this.context.customer.id

    const shouldSendTPAData = customerId && TPAData

    if (!shouldSendTPAData) {
      TPACompanyInfo.removeValue()
      return
    }

    window.B3Spinner.show()
    await createCompany({
      ...JSON.parse(TPAData),
      customerId,
    }, true)
  }

  async initPage() {
    const {
      tpaPageContainer,
      companyFormSelector,
    } = this.state

    try {
      const bcToken = await getBCToken()
      const b2bToken = await this.setB3Token(bcToken)

      if (!b2bToken) {
        this.renderFormHtml()
        this.bindUserEvent()
      } else {
        await this.setUserRole()
        const userId = this.utils.B3Storage.B3UserId.value
        const companyData = await this.getCompanyInfo(userId)
        const { companyStatus, extraFields } = companyData
        this.setState({
          companyExtraFields: extraFields,
        })

        const fieldsMap = [
          { selector: '#company_name', value: companyData.companyName },
          { selector: '#company_address_street', value: companyData.addressLine1 },
          { selector: '#company_address_street2', value: companyData.addressLine2 },
          { selector: '#company_address_country', value: companyData.country },
          { selector: '#company_address_city', value: companyData.city },
          { selector: '#company_address_state', value: companyData.state },
          { selector: '#company_address_zip', value: companyData.zipCode },
          { selector: '#company_user_phone', value: companyData.phone },
          { selector: '#company_user_email', value: companyData.email },
        ]

        const companyStatusLabel = getB3ConstantLabel(B3CompanyStatus, companyStatus).toLowerCase()

        const messageText = {
          hasCompany: 'You are already in company',
          pending: `Company application status: ${companyStatusLabel}.
          Your application is under review, please wait...`,
          reject: `Company application status: ${companyStatusLabel}.Your application has been rejected, you can resubmit your application.`,
          others: 'Your Company cannot be used, please wait...',
        }

        switch (companyStatus) {
          case '0':
            tpaPageContainer.innerHTML = message({ message: messageText.pending })
            break
          case '1':
            this.utils.B3Storage.clear()
            tpaPageContainer.innerHTML = message({ message: messageText.hasCompany })
            window.location.href = '/'
            break
          case '2':
            this.renderFormHtml('RESUBMIT')
            this.bindUserEvent()
            tpaPageContainer.insertAdjacentHTML('afterbegin', message({ message: messageText.reject }))

            for (let i = 0; i < fieldsMap.length; i += 1) {
              if (fieldsMap[i].value) {
                document.querySelector(`${companyFormSelector} ${fieldsMap[i].selector}`).value = fieldsMap[i].value
              }
            }
            break
          // improvement: need to discuss about the solution for dealing with the code `3` and `4`
          case '3':
            tpaPageContainer.innerHTML = message({ message: messageText.others })
            break
          case '4':
            tpaPageContainer.innerHTML = message({ message: messageText.others })
            break
          default:
            this.renderFormHtml()
            this.bindUserEvent()
            break
        }
      }
    } catch {
      this.utils.Alert.error(this.locales.tips.notPermission)
    }

    this.initUserValidation()
  }

  renderFormHtml(type) {
    const {
      B3CompanyId,
    } = this.utils.B3Storage
    const { customer } = this.context
    const [userFirstName, userLastName] = customer.name.split(' ')
    const companyId = B3CompanyId.value

    const pageConfig = {
      isVisible: true,
      userFirstName,
      userLastName,
      customer,
      companyId,
      type,
    }

    const tpaFormHtml = tpaForm(pageConfig)
    this.state.tpaPageContainer.innerHTML = tpaFormHtml
  }

  bindUserEvent() {
    const {
      companyFormSelector,
    } = this.state

    document.querySelector(companyFormSelector).addEventListener('submit', async e => {
      e.preventDefault()
      this.newCompanyValidator.performCheck()
      const allValidStatus = this.newCompanyValidator.areAll('valid')

      if (!allValidStatus) return

      let isDuplicate = true
      try {
        await this.checkExistCompany()
        isDuplicate = false
      } finally {
        this.toggleCompanyDuplicate(isDuplicate)
      }
      if (isDuplicate) return

      if (typeof tpa.beforeSubmit === 'function') await tpa.beforeSubmit(this)

      window.B3Spinner.show()
      this.utils.B3Storage.clear()

      try {
        if (this.shouldUpdateCompanyInfo) {
          this.updateCompany()
        } else {
          const companyInfo = this.getFormData()
          await createCompany(companyInfo)
        }
      } catch (error) {
        this.utils.Alert.error(this.locales.tips.globalError)
      }

      window.B3Spinner.hide()
    })
  }

  initUserValidation() {
    const {
      state: {
        companyFormSelector,
      },
      utils: {
        re,
      },
      locales: {
        validation,
      },
    } = this

    this.newCompanyValidator = nod({
      button: `${companyFormSelector} input[type="submit"]`,
    })
    this.newCompanyValidator.add([{
      selector: `${companyFormSelector} input[name="company_name"]`,
      validate: (cb, val) => {
        cb(val.length)
      },
      errorMessage: validation.companyNameVoid,
    },
    {
      selector: `${companyFormSelector} input[name="company_user_phone"]`,
      validate: (cb, val) => {
        cb(re.phone.test(val))
      },
      errorMessage: validation.phoneIncorrect,
    },
    {
      selector: `${companyFormSelector} input[name="company_user_email"]`,
      validate: (cb, val) => {
        cb(re.email.test(val))
      },
      errorMessage: validation.emailIncorrect,
    }])
  }

  updateCompany() {
    const updateCompanyInfoData = this.getFormData()
    const companyId = document.querySelector('#company_id').value
    this.api.updateCompanyInfo(companyId, updateCompanyInfoData).then(() => {
      this.utils.Alert.success(this.locales.tips.createCompanyChecking)
      window.location.reload()
    })
  }

  getFormData() {
    return {
      storeHash: this.context.settings.store_hash,
      companyName: document.querySelector('#company_name').value,
      country: document.querySelector('#company_address_country').value,
      city: document.querySelector('#company_address_city').value,
      state: document.querySelector('#company_address_state').value,
      zipCode: document.querySelector('#company_address_zip').value,
      addressLine1: document.querySelector('#company_address_street').value,
      addressLine2: document.querySelector('#company_address_street2').value,
      companyEmail: document.querySelector('#company_user_email').value,
      companyPhoneNumber: document.querySelector('#company_user_phone').value,
      customerId: document.querySelector('#company_customer_id').value,
      extraFields: this.getCompanyExtraFields(),
    }
  }

  async setExtraFields() {
    const {
      store_hash: storeHash,
    } = this.context.settings
    const {
      B3ExtraFields,
    } = this.utils.B3Storage

    if (this.state.extraFields.length) return

    if (B3ExtraFields.value) {
      this.setState({
        extraFields: JSON.parse(B3ExtraFields.value),
      })
      return
    }

    window.B3Spinner.show()
    try {
      const res = await this.api.getExtraFields({ storeHash })

      const extraFields = res.map(field => {
        const required = field.isRequired !== '0'
        const partial = b3ExtraFieldTypes[field.dataType]
        const label = field.labelName

        let validation = {
          type: 'singleline',
          label,
          required,
          value: field.value || '',
        }

        switch (partial) {
          case 'number': {
            validation = {
              ...validation,
              type: 'numberonly',
              limitfrom: 0,
              limitto: 10000000,
              value: field.value || 0,
            }
            break
          }
          case 'multiline': {
            validation = { ...validation, rows: field.rows || 3 }
            break
          }
          default:
        }

        return {
          ...field,
          name: field.fieldName,
          partial,
          required,
          label,
          visible: true,
          disabled: false,
          validation,
        }
      })

      this.setState({ extraFields })
      B3ExtraFields.setValue(JSON.stringify(extraFields))
    } finally {
      window.B3Spinner.hide()
    }
  }

  renderFields(fields, patchFields) {
    const {
      createFormSelector,
      tpaContainerSelector,
    } = this.state

    const template = fields.reduce((result, field) => {
      const { render } = field

      if (patchFields) {
        const { fieldValue } = patchFields.find(item => item.fieldName === field.name) || {}
        field.value = fieldValue || field.value
      }

      if (typeof render === 'function') return result += render.call(field)

      field.visible = field.visible === undefined ? true : field.visible

      const filedHtml = this.formPartials[field.partial](field)
      result += filedHtml
      return result
    }, '')

    const containerSelector = this.isLogin ? `${tpaContainerSelector} .form-actions` : `${createFormSelector} .form-row`

    this.utils.renderTemplate({
      containerSelector,
      insertType: this.isLogin ? 'beforeBegin' : 'beforeEnd',
      template,
    })
  }

  bindFieldsValidation(fields) {
    const validationSchema = fields.map(({
      validation = {},
      name,
      required,
      label,
      requiredError,
      errorMessage,
      selector,
    }) => {
      selector = selector || `[name=${name}]`
      const validate = []
      const errorMessages = []

      if (validation.required || required) {
        validate.push((cb, val) => {
          cb(val.length > 0)
        })
        errorMessages.push(requiredError || `The '${validation.label || label}' field cannot be blank.`)
      }

      if (validation.type === 'numberonly') {
        const invalidMessage = `The value for ${validation.label || label} is not valid.`
        const min = Number(validation.limitfrom)
        const max = Number(validation.limitto)
        validate.push((cb, val) => {
          const numberVal = Number(val)

          cb(numberVal >= min && numberVal <= max)
        })
        errorMessages.push(errorMessage || invalidMessage)
      }

      if (typeof validation === 'function') {
        validate.push((cb, val) => {
          const isValid = validation(val)

          cb(isValid)
        })
        errorMessages.push(errorMessage)
      }

      return {
        selector,
        validate,
        errorMessage: errorMessages,
      }
    })

    const validations = validationSchema.filter(validator => !!validator.validate.length)

    if (this.isLogin) this.newCompanyValidator.add(validations)
    else window.createAccountValidator.add(validations)
  }

  renderExtraFields() {
    const {
      extraFields,
      companyExtraFields,
    } = this.state

    this.renderFields(extraFields, companyExtraFields)
    this.bindFieldsValidation(extraFields)
  }

  renderCustomFields() {
    const {
      customFields,
    } = this.state

    this.renderFields(customFields)
    this.bindFieldsValidation(customFields)
  }

  async checkExistCompany() {
    const {
      store_hash: storeHash,
    } = this.context.settings
    const {
      state: {
        createFormSelector,
        companyFormSelector,
      },
    } = this

    const selector = this.isLogin ? `${companyFormSelector} input[name="company_name"]` : `${createFormSelector} [data-field-type='CompanyName']`
    const companyName = document.querySelector(selector).value

    let isValid = false
    window.B3Spinner.show()
    try {
      await this.api.checkExistCompany({ storeHash, companyName })
      isValid = true
    } finally {
      window.B3Spinner.hide()
    }

    return isValid
  }
}

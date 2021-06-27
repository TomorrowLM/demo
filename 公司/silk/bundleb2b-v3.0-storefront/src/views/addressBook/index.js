import BasePage from '../../common/BasePage'
import {
  tips,
  validation,
} from '../../common/locales'
import {
  B3Role,
} from '../../common/utils/constants'
import addressBookTemplate from './addressBook.html'
import defaultAddressContent from './defaultAddressContent.html'
import addressesTable from './addressesTable.html'
import addressFormModalContent from './addressFormModalContent.html'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class AddressBook extends BasePage {
  constructor() {
    super()
    this.name = 'AddressBook'
    this.state = {
      countries: [],
      addresses: [],
      defaultAddressIds: {},
      defaultAddresses: {
        billing: {},
        shipping: {},
      },
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      basicAddressFormFieldsSchema: {
        firstName: {
          value: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[firstName]'],
        },
        lastName: {
          value: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[lastName]'],
        },
        addressLine1: {
          value: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[addressLine1]'],
        },
        addressLine2: {
          value: '',
        },
        label: {
          value: '',
        },
        city: {
          value: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[city]'],
        },
        country: {
          countryName: '',
          countryCode: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[country]'],
        },
        zipCode: {
          value: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[country]'],
        },
        state: {
          value: '',
          stateName: '',
          stateCode: '',
          rule: val => !!val.length,
          errorMessage: validation['addressForm[state]'],
        },
        phoneNumber: {
          value: '',
          rule: val => !val.length || this.utils.re.phone.test(val),
          errorMessage: validation['addressForm[phoneNumber]'],
        },
        isShipping: {
          checked: '',
        },
        isDefaultShipping: {
          checked: '',
        },
        isDefaultBilling: {
          checked: '',
        },
        isBilling: {
          checked: '',
        },
      },
      $modal: null,
      modalType: 'ADD',
      addressId: '',
    }
  }

  get tipStringMap() {
    return {
      add: 'Address add',
      edit: 'Address editing',
      action: 'Address action',
      delete: 'Address delete',
      setDefaultShipping: 'Set default shipping address',
      setDefaultBilling: 'Set default billing address',
    }
  }

  get modalTypeMap() {
    return {
      ADD: {
        title: 'Add Address',
        request: 'createAddressBook',
      },
      EDIT: {
        title: 'Update Address',
        request: 'updateAddressBook',
      },
    }
  }

  async init() {
    if (!this.isB2BUser || !this.shouldShowAddressBook) return
    const {
      B3RoleId,
      B3AddressBook,
    } = this.utils.B3Storage

    if (!B3AddressBook.isEnabled.value === '1') {
      await this.utils.Alert.error(tips.notPermission)
      const href = B3RoleId.value === B3Role.SALESREP ? '/dashboard/' : '/'
      window.location.href = href
    }

    await this.getDefaultAddresses()
    await this.getCountries()
    await this.getAddresses()

    this.render()
    this.initMobileTable([12])
    themeStyleFix.editModalBoxStyleFix()
  }

  async getCountries() {
    window.B3Spinner.show()
    try {
      const {
        list,
      } = await this.api.getCountries()
      this.setState({
        countries: list.map(item => ({
          ...item,
          countryData: JSON.stringify(item),
        })),
      })
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  async getDefaultAddresses() {
    const {
      B3CompanyId,
    } = this.utils.B3Storage
    const companyId = B3CompanyId.value

    window.B3Spinner.show()
    try {
      const {
        billing,
        shipping,
      } = await this.api.getDefaultAddressesByCompanyId(companyId)

      this.setState({
        defaultAddresses: {
          billing: {
            ...billing,
            isShow: !!Object.keys(billing).length,
            addressTypeName: 'Billing',
          },
          shipping: {
            ...shipping,
            isShow: !!Object.keys(shipping).length,
            addressTypeName: 'Shipping',
          },
        },
      })
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  async getAddresses() {
    const {
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      pagination: {
        offset,
        limit,
      },
    } = this.state
    const companyId = B3CompanyId.value
    const {
      q,
      'addressType.isBilling': isBilling,
      'addressType.isShipping': isShipping,
      ...filters
    } = this.getFilters()

    window.B3Spinner.show()
    try {
      const {
        pagination,
        defaultAddressIds,
        list,
      } = await this.api.getAddressBookBySearch(companyId, {
        filters: {
          ...filters,
          addressType: {
            isBilling,
            isShipping,
          },
        },
        offset,
        limit,
        q,
      })

      this.setState({
        pagination: {
          ...pagination,
        },
        defaultAddressIds,
        addresses: list,
      })
    } catch (error) {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  getFilters() {
    const $filters = document.querySelectorAll('[data-filters-field]')
    const filters = {}

    $filters.forEach($filter => {
      const {
        filtersField,
      } = $filter.dataset
      const isHide = $filter.classList.contains('hide')
      if (!isHide) {
        if ($filter.type === 'checkbox') {
          filters[filtersField] = $filter.checked === true ? '1' : ''
        } else {
          filters[filtersField] = $filter.value
        }
      }
    })

    return filters
  }

  render() {
    const {
      addressBook: {
        container,
      },
    } = this.doms

    const b2bWraper = document.querySelector('.addressBook')
    if (b2bWraper) b2bWraper.remove()

    this.utils.renderTemplate({
      hbsTemplate: addressBookTemplate,
      containerSelector: container,
      templateConfig: {
        ...this.state,
      },
      insertType: 'beforeend',
    })

    this.renderDefaultAddresses()
    this.renderAddresses()

    this.bindSearchEvents()
  }

  renderDefaultAddresses() {
    const {
      defaultAddresses,
    } = this.state

    const $defaultAddresses = document.querySelector('.addressList')
    if ($defaultAddresses) $defaultAddresses.innerHTML = ''

    const defaultAddressesContent = Object.values(defaultAddresses).reduce((result, defaultAddress) => {
      result += defaultAddressContent(defaultAddress)
      return result
    }, '')

    $defaultAddresses.innerHTML = defaultAddressesContent
  }

  renderAddresses() {
    const {
      addresses,
    } = this.state

    const $table = document.querySelector('.address-lists-table tbody')

    const addressList = addresses.map(address => {
      const {
        isShipping,
        isBilling,
        isDefaultBilling,
        isDefaultShipping,
      } = address

      return {
        ...address,
        address: JSON.stringify(address),
        isDefaultBillingShow: +isDefaultBilling === 0,
        isDefaultShippingShow: +isDefaultShipping === 0,
        isBillingShow: +isBilling === 1,
        isShippingShow: +isShipping === 1,
      }
    })

    $table.innerHTML = addressesTable({
      addresses: addressList,
    })

    this.renderPaginator()
    this.bindListEvents()
    this.bindModalEvents()
  }

  renderPaginator() {
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
      container: '#pagination',
      currentPage,
      totalPages,
      onPageChange: this.handlePaginationChange,
    })
  }

  handlePaginationChange = async page => {
    const {
      pagination,
      pagination: {
        limit,
      },
    } = this.state

    this.setState({
      pagination: {
        ...pagination,
        offset: (page - 1) * limit,
      },
    })

    await this.getAddresses()
    this.renderAddresses()
  }

  bindSearchEvents() {
    const $filterSwitch = document.querySelector('#filter_open_button')
    const $filterBox = document.querySelector('.filter-box')
    const $filterCancel = document.querySelector('#filter_cancel_button')
    const $filterStateSelect = $filterBox.querySelector('#state_filter_select')
    const $filterSearchBtn = document.querySelector('#search_button')
    const $filterApply = document.querySelector('#filter_apply_button')
    const $filterCountry = document.querySelector('#country_filter')
    const $filterSearchInput = document.querySelector('#keyword')
    const $searchInputClear = document.querySelector('#search_clear')

    const searchAddress = async () => {
      const {
        pagination,
      } = this.state

      this.setState({
        pagination: {
          ...pagination,
          offset: 0,
        },
      })
      await this.getAddresses()
      this.renderAddresses()
    }

    $filterSwitch.addEventListener('click', e => {
      e.stopPropagation()
      $filterBox.classList.toggle('hide')
    })

    $filterCancel.addEventListener('click', e => {
      e.stopPropagation()
      $filterStateSelect.classList.add('hide')
      $filterStateSelect.previousElementSibling.classList.remove('hide')
      $filterBox.reset()

      searchAddress()
    })

    $filterSearchBtn.addEventListener('click', () => {
      searchAddress()
    })

    $filterApply.addEventListener('click', () => {
      searchAddress()
    })

    $filterCountry.addEventListener('click', () => {
      this.renderStateSelect($filterCountry, $filterBox)
    })

    $filterSearchInput.addEventListener('keyup', e => this.handleInputSearch(() => {
      if (e.target.value) {
        $searchInputClear.classList.remove('hide')
      } else {
        $searchInputClear.classList.add('hide')
      }
      if (e.keyCode === 13) {
        searchAddress()
      }
    }))

    $searchInputClear.addEventListener('click', () => {
      $searchInputClear.classList.add('hide')
      $filterSearchInput.value = ''
      searchAddress()
    })
  }

  renderStateSelect(target, element, formFields) {
    const $options = target.querySelectorAll('option')
    const $select = element.querySelector('.state_select')
    const $input = $select.previousElementSibling
    const $parent = $select.parentNode
    const $spans = $parent.querySelectorAll('span')

    let countryData = {}
    $options.forEach($option => {
      const { country } = $option.dataset
      if ($option.selected && country) countryData = JSON.parse(country)
    })

    if (countryData.states && countryData.states.length > 0) {
      let frage = ''
      frage += countryData.states.map(item => `<option value="${item.stateName}" data-states='${JSON.stringify(item)}'>${item.stateName}</option>`)
      $select.innerHTML = frage
      $select.classList.remove('hide')
      $input.classList.add('hide')

      if (formFields && formFields.state) {
        $select.value = formFields.state.stateName
      } else {
        $select.value = countryData.states[0].stateName
      }

      const event = new Event('change')
      $select.dispatchEvent(event)
    } else {
      $select.classList.add('hide')
      $input.classList.remove('hide')
      if (this.state.modalType !== 'EDIT') $input.value = ''
    }

    $spans.forEach($span => {
      $span.remove()
    })
    $parent.classList.remove('form-field--success')
    $parent.classList.remove('form-field--error')
  }

  checkActionPermission(checkType) {
    const {
      B3AddressBook,
    } = this.utils.B3Storage

    if (checkType === undefined || !checkType) return false
    if (+B3AddressBook.isAllow.value !== 1) {
      const tip = `${this.tipStringMap[checkType]} has been disabled by the system administrators.`
      this.utils.Alert.error(tip)
      return false
    }
    return true
  }

  bindListEvents() {
    const {
      B3CompanyId,
    } = this.utils.B3Storage
    const {
      pagination,
    } = this.state

    const $table = document.querySelector('.address-lists-table')
    const $actions = $table.querySelectorAll('.td-action-dropdown')
    const $deletes = $table.querySelectorAll('[data-delete-address]')
    const $shippings = $table.querySelectorAll('[data-set-shipping]')
    const $billings = $table.querySelectorAll('[data-set-billing]')

    const hideMenus = () => document.querySelector('.show-action')?.classList?.remove('show-action')
    const actionClick = e => {
      const item = e.target.nextElementSibling
      if (item.classList.contains('show-action')) {
        item.classList.remove('show-action')
      } else {
        if (document.querySelector('.show-action')) {
          document.querySelector('.show-action').classList.remove('show-action')
        }
        if (this.checkActionPermission('add')) item.classList.add('show-action')
      }
    }

    document.querySelector('body').addEventListener('click', () => {
      hideMenus()
    })

    $actions.forEach($action => {
      $action.addEventListener('click', e => {
        e.stopPropagation()
        actionClick(e)
      })
    })

    $deletes.forEach($delete => {
      $delete.addEventListener('click', async e => {
        e.stopPropagation()
        if (this.checkActionPermission('delete')) {
          const {
            dismiss,
          } = await this.utils.Alert.warning(tips.confirmDeleteAddress, {
            showCancelButton: true,
            confirmButtonText: 'Sure',
          })
          if (dismiss) return false
          const addressId = $delete.dataset.id

          window.B3Spinner.show()
          try {
            await this.api.deleteAddressBook(B3CompanyId.value, addressId, {
              isActive: 0,
            })
            this.utils.Alert.success(tips.deleteAddressSuccess)
            this.setState({
              pagination: {
                ...pagination,
                offset: 0,
              },
            })
            await this.getAddresses()
            this.renderAddresses()
          } catch {
            this.utils.Alert.error(tips.globalError)
          }
          window.B3Spinner.hide()
        }
      })
    })

    $shippings.forEach($shipping => {
      $shipping.addEventListener('click', async e => {
        e.stopPropagation()
        if (this.checkActionPermission('setDefaultShipping')) {
          const {
            dismiss,
          } = await this.utils.Alert.warning(tips.confirmSetShippingAddress, {
            showCancelButton: true,
            confirmButtonText: 'Sure',
          })
          if (dismiss) return false
          const addressId = $shipping.dataset.id
          const addressData = JSON.parse($shipping.dataset.address)

          window.B3Spinner.show()
          try {
            await this.api.updateAddressBook(B3CompanyId.value, addressId, {
              ...addressData,
              isShipping: '1',
              isDefaultShipping: '1',
            })
            this.utils.Alert.success(tips.setShippingAddressSuccess)
            this.setState({
              pagination: {
                ...pagination,
                offset: 0,
              },
            })
            await this.getDefaultAddresses()
            await this.getAddresses()
            this.render()
          } catch {
            this.utils.Alert.error(tips.globalError)
          }
          window.B3Spinner.hide()
        }
      })
    })

    $billings.forEach($billing => {
      $billing.addEventListener('click', async e => {
        e.stopPropagation()
        if (this.checkActionPermission('setDefaultBilling')) {
          const {
            dismiss,
          } = await this.utils.Alert.warning(tips.confirmSetBillingAddress, {
            showCancelButton: true,
            confirmButtonText: 'Sure',
          })
          if (dismiss) return false
          const addressId = $billing.dataset.id
          const addressData = JSON.parse($billing.dataset.address)

          window.B3Spinner.show()
          try {
            await this.api.updateAddressBook(B3CompanyId.value, addressId, {
              ...addressData,
              isBilling: '1',
              isDefaultBilling: '1',
            })
            this.utils.Alert.success(tips.setBillingAddressSuccess)
            this.setState({
              pagination: {
                ...pagination,
                offset: 0,
              },
            })
            await this.getDefaultAddresses()
            await this.getAddresses()
            this.render()
          } catch {
            this.utils.Alert.error(tips.globalError)
          }
          window.B3Spinner.hide()
        }
      })
    })
  }

  openAddressModal(formFields = {}) {
    // TODO:to cancle new modle
    if (document.querySelector('.tingle-modal')) {
      document.querySelector('.tingle-modal').remove()
    }

    const $modal = new window.B3Modal.modal({
      stickyFooter: true,
      closeMethods: ['overlay', 'escape'],
      closeLabel: 'Close',
    })

    this.setState({
      $modal,
    })

    $modal.open()
    this.renderModal(formFields)
  }

  bindModalEvents() {
    const $addAddress = document.querySelector('#add_new_address_button')

    const handleAddress = () => {
      if (!this.checkActionPermission('add')) return

      this.setState({
        modalType: 'ADD',
      })

      this.openAddressModal()
    }

    $addAddress.removeEventListener('click', handleAddress)
    $addAddress.addEventListener('click', handleAddress)

    this.utils.on('.address-lists-table tbody tr', 'click', 'edit-address', $tr => {
      if (this.checkActionPermission('edit')) {
        this.setState({
          modalType: 'EDIT',
        })
        const addressData = JSON.parse($tr.dataset.address)
        const formFields = Object.entries(addressData).reduce((result, [key, value]) => {
          let obj = {}
          if (key === 'addressId') {
            this.setState({
              addressId: value,
            })
            return result
          }

          if (['isShipping', 'isDefaultShipping', 'isBilling', 'isDefaultBilling'].includes(key)) {
            const checked = value === '1' ? 'checked' : ''
            obj.checked = checked
          } else if (['country', 'state'].includes(key)) {
            obj = value
          } else {
            obj.value = value
          }

          result[key] = obj
          return result
        }, {})

        this.openAddressModal(formFields)
      }
    })
  }

  renderModal(data = {}) {
    const {
      basicAddressFormFieldsSchema,
      countries,
      $modal,
      modalType,
    } = this.state

    const formFields = Object.entries(basicAddressFormFieldsSchema).reduce((result, [key, value]) => {
      const dataField = data[key] ?? {}
      result[key] = {
        ...value,
        ...dataField,
      }

      return result
    }, {})

    const {
      title,
    } = this.modalTypeMap[modalType]

    const modalFields = {
      formFields,
      countries: countries.map(country => {
        const selected = country.countryName === formFields.country.countryName ? 'selected' : ''
        return {
          ...country,
          selected,
        }
      }),
    }
    const $content = addressFormModalContent({
      title,
      ...modalFields,
    })
    $modal.setContent($content)

    const $modalContent = $modal.getContent()
    const $save = $modalContent.querySelector('#save_new_address')
    const $country = $modalContent.querySelector('#new_country')
    const $fields = $modalContent.querySelectorAll('[data-field]')

    $fields.forEach($field => {
      const {
        field,
      } = $field.dataset

      const $childCheckbox = $field.parentNode.querySelector('.children_checkbox')
      if (['isShipping', 'isBilling'].includes(field)) {
        if (formFields[field].checked) {
          $childCheckbox.classList.remove('hide')
        } else {
          $childCheckbox.classList.add('hide')
        }
      }
    })

    this.renderStateSelect($country, $modalContent, formFields)
    this.bindHandleClose()
    this.bindFieldsEvent(formFields)
    $save.addEventListener('click', () => {
      const validations = Array.from($fields).filter($field => !$field.classList.contains('hide')).map($field => {
        const {
          field,
        } = $field.dataset
        const isValid = this.filedValidation($field, formFields, field)
        return isValid
      })

      const isAllValid = validations.every(valide => !!valide)
      if (!isAllValid) return

      this.addressAction(formFields)
    })
  }

  bindFieldsEvent(formFields) {
    const {
      $modal,
    } = this.state

    const $modalContent = $modal.getContent()
    const $fields = $modalContent.querySelectorAll('[data-field]')
    $fields.forEach($field => {
      switch ($field.type) {
        case 'checkbox': {
          this.bindCheckboxEvent($field, formFields)
          break
        }
        case 'select-one': {
          this.bindSelectEvent($field, formFields)
          break
        }
        default: {
          this.bindInputEvent($field, formFields)
        }
      }
    })
  }

  bindInputEvent($field, formFields) {
    $field.addEventListener('input', () => {
      const {
        field,
      } = $field.dataset

      const { value } = $field

      const formField = formFields[field]

      formField.value = value

      if (field === 'state') {
        formFields[field] = {
          ...formField,
          stateName: value,
          stateCode: '',
        }
      }

      this.filedValidation($field, formFields, field)
    })
  }

  bindSelectEvent($field, formFields) {
    const {
      $modal,
    } = this.state
    const $modalContent = $modal.getContent()
    const $country = $modalContent.querySelector('#new_country')

    $field.addEventListener('change', () => {
      const {
        field,
      } = $field.dataset
      const $options = $field.querySelectorAll('option')

      let selectData = {}
      $options.forEach($option => {
        const { states } = $option.dataset
        if ($option.selected && states) selectData = JSON.parse(states)
      })

      const formField = formFields[field]

      switch (field) {
        case 'country': {
          const {
            countryName = '',
            countryCode = '',
          } = selectData
          formFields[field] = {
            ...formField,
            countryName,
            countryCode,
          }
          this.renderStateSelect($country, $modalContent)
          break
        }
        default: {
          const {
            stateName = '',
            stateCode = '',
          } = selectData
          formFields[field] = {
            ...formField,
            value: '',
            stateName,
            stateCode,
          }
        }
      }

      this.filedValidation($field, formFields, field)
    })
  }

  bindCheckboxEvent($field, formFields) {
    $field.addEventListener('click', () => {
      const {
        field,
      } = $field.dataset
      const { checked } = $field

      formFields[field].checked = checked ? 'checked' : ''

      if (field === 'isShipping' && !checked) formFields.isDefaultShipping.checked = ''
      if (field === 'isBilling' && !checked) formFields.isDefaultBilling.checked = ''

      const $childCheckbox = $field.parentNode.querySelector('.children_checkbox')
      if (['isShipping', 'isBilling'].includes(field)) {
        if (checked) {
          $childCheckbox.classList.remove('hide')
        } else {
          $childCheckbox.classList.add('hide')
        }
      }
    })
  }

  bindHandleClose() {
    const {
      $modal,
    } = this.state

    const $content = $modal.getContent()
    $content.querySelectorAll('.modal-close').forEach($close => {
      $close.addEventListener('click', () => {
        $modal.close()
        $modal.destroy()
      })
    })
  }

  filedValidation = ($field, formFields, field) => {
    const $parent = $field.parentNode
    const {
      errorMessage,
      rule,
      value,
      countryName,
      stateName,
    } = formFields[field]

    const $error = `<span class="form-inlineMessage">${errorMessage}</span>`
    let val
    const span = $parent.querySelector('.form-inlineMessage')
    if (span) span.remove()

    switch (field) {
      case 'country': {
        val = countryName
        break
      }
      case 'state': {
        val = stateName
        break
      }
      default: {
        val = value
      }
    }

    let isShowError
    if (rule instanceof Function) {
      isShowError = !rule(val, $field)
      if (isShowError) {
        $parent.classList.add('form-field--error')
        $parent.classList.remove('form-field--success')
        $parent.insertAdjacentHTML('beforeend', $error)
      } else {
        $parent.classList.add('form-field--success')
        $parent.classList.remove('form-field--error')
      }
    }

    return !isShowError
  }

  async addressAction(formFields) {
    const {
      modalType,
      $modal,
      pagination,
      addressId,
    } = this.state
    const {
      B3CompanyId,
    } = this.utils.B3Storage
    const companyId = B3CompanyId.value

    const { request } = this.modalTypeMap[modalType]

    const params = Object.entries(formFields).reduce((result, [field, fieldValue]) => {
      if (['isShipping', 'isDefaultShipping', 'isBilling', 'isDefaultBilling'].includes(field)) {
        result[field] = fieldValue.checked ? '1' : '0'
      } else {
        switch (field) {
          case 'country': {
            const {
              countryName,
              countryCode,
            } = fieldValue
            result[field] = {
              countryName,
              countryCode,
            }
            break
          }
          case 'state': {
            const {
              stateName,
              stateCode,
            } = fieldValue
            result[field] = {
              stateName,
              stateCode,
            }
            break
          }
          default: {
            result[field] = fieldValue.value
          }
        }
      }

      return result
    }, {})

    $modal.close()
    $modal.destroy()
    window.B3Spinner.show()
    try {
      if (modalType === 'ADD') {
        await this.api[request](companyId, params)
      } else {
        await this.api[request](companyId, addressId, params)
      }
      this.setState({
        pagination: {
          ...pagination,
          offset: 0,
        },
      })
      await this.getDefaultAddresses()
      await this.getAddresses()
      this.render()
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }
}

import stencilUtils from '@bigcommerce/stencil-utils'
import BasePage from '../../common/BasePage';
import getPrice from '../../common/api/getPrice'
import trim from '../../common/utils/trim';
import {
  validation,
  tips,
} from '../../common/locales'
import { getCurrency } from '../../common/utils/currencyFormat'

import buttonGroup from './button-group.html';
import quoteForm from './quote-form.html';
import formBody from './form-body.html';
import formProducts from './form-products.html';
import formMessage from './form-message.html'

class Rfq extends BasePage {
  name = 'Rfq';

  constructor() {
    super()
    const stagedProductList = localStorage.getItem('B3CreateQuoteProductList')
    const stagedFormData = localStorage.getItem('B3CreateQuoteFormData')

    this.state = {
      timer: null,
      isAdded: false,
      isAdding: false,
      productList: stagedProductList ? JSON.parse(stagedProductList) : [],
      formData: stagedFormData ? JSON.parse(stagedFormData) : this.basicFormData,
      $ref: null,
      isBackendUser: false,
      subtotal: '',
      discount: '',
      grandTotal: '',
      quoteFormStatus: 0,
      switchStatus: [],
    };
  }

  async init() {
    await this.getQuoteConfig()

    if (this.isLogin) {
      if (this.isB2BUser && !this.isSwitchStatusEnabled('quote_customer')) return 
      if (this.isB2CUser && !this.isSwitchStatusEnabled('quote_for_individual_customer')) return 
    }
    if (!this.isLogin && !this.isSwitchStatusEnabled('quote_for_guest')) return

    if (!this.isCart && !this.isPDP) this.checkingQuickViewRender()
    else this.renderButton();

    stencilUtils.hooks.on('product-option-change', (e) => {
      this.setState({
        isAdded: false,
      })
      this.renderButton()
    })
  }

  get isCart() {
    const { template } = this.context;

    return template === 'pages/cart';
  }

  get isPDP() {
    const { template } = this.context;

    return template === 'pages/product';
  }

  get actionWarper() {
    return this.isCart
      ? '.cart-actions'
      : this.isPDP
      ? '#add-to-cart-wrapper'
      : '.productView--quickView #add-to-cart-wrapper';
  }

  get basicFormData() {
    const {
      B3Storage: {
        B3CompanyName
      }
    } = this.utils

    let name = '',email = '', companyName = '', phoneNumber = ''
    if (this.isLogin) {
      const {
        customer
      } = this.context
      name = customer.name
      email = customer.email
      phoneNumber = customer.phone
      companyName = this.isB2BUser ? B3CompanyName.value : customer.shippingAddress.company
    }

    return {
      referenceNumber: '',
      contactInfo: {
        name,
        email,
        companyName,
        phoneNumber,
      },
      shippingAddress: {
        country: '',
        state: '',
        city: '',
        zipCode: '',
        address: '',
        apartment: '',
      },
      expiredAt: '',
      message: '',
    }
  }

  get rfqForm() {
    const {
      $ref,
      formData,
      productList,
    } = this.state
    const {
      B3Storage: {
        B3Email,
        B3CompanyId,
      }
    } = this.utils
    const storeHash = this.context.settings.store_hash
    const userEmail = B3Email.value ?? ''
    const companyId = B3CompanyId.value
    const subtotal = productList.reduce((result, { basePrice }) => result += +basePrice,0).toFixed(2)
    const grandTotal = productList.reduce((result, { offeredPrice }) => result += +offeredPrice,0).toFixed(2)
    const discount = (subtotal - grandTotal).toFixed(2)
    const currency = JSON.parse(localStorage.getItem('b3_current_currency')) || getCurrency()

    return {
      $ref,
      data: {
        isBackendUser: 0,
        storeHash,
        userEmail,
        companyId,
        subtotal,
        grandTotal,
        discount,
        currency,
        productList,
        ...formData,
      },
    }
  }

  async getQuoteConfig() {
    const {
      store_hash: storeHash,
    } = this.context.settings
    const { switchStatus } = await this.api.getQuoteConfig({ storeHash })
    this.setState({ switchStatus })
  }

  isSwitchStatusEnabled(key) {
    const { switchStatus } = this.state
    return switchStatus.find((item) => key === item.key)?.isEnabled === '1'
  }

  renderButton() {
    const { 
      utils: {
        renderTemplate 
      },
      state: {
        isAdded,
        isAdding,
      },
      actionWarper,
      isCart,
    } = this

    if (this.isPDP && !this.isSwitchStatusEnabled('quote_on_product_page')) return
    if (this.isCart && !this.isSwitchStatusEnabled('quote_on_cart_page')) return


    const $buttonGroup = document.querySelector(`${actionWarper} .rfq-button-container`)
    if ($buttonGroup) $buttonGroup.remove()

    renderTemplate({
      hbsTemplate: buttonGroup,
      containerSelector: actionWarper,
      templateConfig: {
        isAdded,
        isAdding,
        isCart,
      },
      insertType: 'beforeend',
    })

  }

  checkingQuickViewRender() {
    const checkIsQuickView = node => {
      if (node.nodeName === 'BODY') return false
      if (node.classList.contains('quickview')) return true
      return checkIsQuickView(node.parentNode)
    }
    document.body.addEventListener('click', (e) => {
      clearInterval(this.state.timer)
      if (checkIsQuickView(e.target)) {
        this.state.timer = setInterval(() => {
          const $actionWarper = document.querySelector(this.actionWarper)
          if ($actionWarper) {
            this.setState({
              isAdded: false,
            })
            this.renderButton()
            clearInterval(this.state.timer)
          }
        }, 200)
      }
    })
  }

  async handleAddAll(e) {    
    e.preventDefault()
    const products = await this.getProducts()

    products.forEach(this.assignProductToList.bind(this))

    this.setState({
      isAdded: true
    })
    this.renderButton()
    this.utils.Alert.success(tips['addToQuoteSuccess'])
  }

  async handleAdd(e) {
    e.preventDefault()
    const product = await this.getProduct()
    
    this.assignProductToList(product)

    this.setState({
      isAdded: true
    })
    this.renderButton()
    this.utils.Alert.success(tips['addToQuoteSuccess'])
  }

  assignProductToList(product) {
    const {
      productList
    } = this.state

    const stagedIndex = productList.findIndex(({
      variantId: stagedVariantId,
      productId: stagedProductId
    }) => {
      const {
        variantId,
        productId,
      } = product

      if (variantId) return stagedVariantId === variantId
      return productId === stagedProductId && !stagedVariantId
    })

    if (~stagedIndex) {
      const [stagedProduct] = productList.splice(stagedIndex, 1)
      product.quantity += stagedProduct.quantity
    }

    productList.push(product)

    this.setState({
      productList: [...productList],
    })
    localStorage.setItem('B3CreateQuoteProductList',JSON.stringify(productList))
  }
  
  async getProduct() {
    const {
      utils: {
        normalizeFormData,
        Alert,
      },
      isPDP,
    } = this
    const container = isPDP ? '' : '#modal '

    const $form = document.querySelector(this.actionWarper)?.parentNode
    const sku = trim(document.querySelector(`${container}[data-product-sku]`)?.innerHTML ?? '')
    const formData = Array.from(normalizeFormData(new FormData($form)))
    const optionsLength = $form.querySelectorAll('[data-product-attribute]').length

    const product = {
      sku,
      basePrice: 0,
      discount: 0,
      offeredPrice: 0,
      quantity: 0,
      productId: '',
      variantId: '',
      imageUrl: '',
      productName: '',
      options: [],
    }

    const optionList = []

    formData.map(([key, value]) => {
      switch (key) {
        case 'product_id': {
          product.productId = value
          break
        }
        case 'qty[]': product.quantity = +value
        default: {
          if (key.includes('attribute')) optionList.push({
            option_id: key,
            option_value: value,
          })
        }
      }
    })

    if (optionsLength !== optionList.length) {
      Alert.error(validation['cannotAddToQuote'])
      return
    }

    this.setState({
      isAdding: true
    })
    this.renderButton()

    const productPromise = this.getProductInfo(product.productId)
    const pricePromise = getPrice(product.productId, optionList)

    const [
      productPromiseResult,
      pricePromiseResult
    ] = await Promise.allSettled([productPromise, pricePromise])

    this.setState({
      isAdding: false
    })
    this.renderButton()

    const {
      title: productName = '',
      main_image = {
        data: ''
      },
      options: baseOptions,
    } = productPromiseResult.value ?? {}
    const imageUrl = main_image.data.replace('{:size}', 'original')

    const {
      v3_variant_id: variantId,
      price: {
        without_tax: {
          value: basePrice,
        } = {}
      } = {}
    } = pricePromiseResult.value ?? {}

    const options = optionList.map(({
      option_id,
      option_value: optionValue,
    }) => {
      const optionId = option_id.replace(/\[(\d*)\]/).replace((exp, $1) => $1)
      const {
        display_name: optionName = '',
        values = [],
      } = baseOptions.find(option => option.id == optionId) ?? {}

      const {
        label: optionLabel
      } = values.find(value => value.id == optionValue) ?? {}
      
      return {
        optionId,
        optionValue,
        optionName,
        optionLabel
      }
    })

    return {
      ...product,
      variantId,
      basePrice,
      offeredPrice: basePrice,
      productName,
      imageUrl,
      options,
    }
  }

  getProductInfo(productId) {
    return new Promise((resolve, reject) => {
      stencilUtils.api.product.getById(productId, {
        template: 'b3/b3json',
      }, (err, response) => {
        if (err) reject(err);
        resolve(JSON.parse(response)?.product ?? {})
      })
    })
  }

  getCart() {
    return new Promise((resolve, reject) => {
      stencilUtils.api.cart.getCart({
        includeOptions: true,
      }, (err, response) => {
        if (err) reject(err)
        resolve(response)
      })
    })
  }

  async getProducts() {
    this.setState({
      isAdding: true
    })
    this.renderButton()

    const cart = await this.getCart()

    this.setState({
      isAdding: false
    })
    this.renderButton()

    return cart.lineItems.physicalItems.map(({
      sku,
      salePrice: basePrice,
      imageUrl,
      productId,
      name: productName,
      quantity,
      variantId,
      options,
    }) => ({
      sku,
      basePrice,
      discount: 0,
      offeredPrice: basePrice,
      quantity,
      productId,
      variantId,
      imageUrl,
      productName,
      options: options.map(({
        name: optionName,
        nameId: optionId,
        value: optionLabel,
        valueId: optionValue,
      }) => ({
        optionId,
        optionValue,
        optionName,
        optionLabel
      })),
    }))
  }

  toggleClasses = (el, showClass, hideClass) => {
    el.classList.add(showClass)
    el.classList.remove(hideClass)
  }

  renderForm() {
    const {
      renderTemplate
    } = this.utils

    if (this.rfqForm.$ref) {
      this.rfqForm.$ref.show()
      return
    }

    renderTemplate({
      hbsTemplate: quoteForm,
      containerSelector: 'body',
      templateConfig: {},
      insertType: 'beforeend',
    })

    const $ref = document.querySelector('.rfq-form-wrapper')
    if ($ref && !$ref.show) {
      const [$mask, $content] = $ref.children
      const $body = document.body
      const $editContainer = $ref.querySelector('.quote-edit-container')
      const $successContainer = $ref.querySelector('.quote-success-container')

      $ref.show = () => {
        this.toggleClasses($mask, 'fadeIn', 'fadeOut')
        this.toggleClasses($content, 'slideInRight', 'slideOutRight')
        this.toggleClasses($editContainer, 'show', 'hide')
        this.toggleClasses($successContainer, 'hide', 'show')
        $body.style.overflowY = 'hidden'
        
        this.renderFormBody()
        this.renderProductList()
        this.renderMessage()
      }

      $ref.hide = () => {
        this.toggleClasses($mask, 'fadeOut', 'fadeIn')
        this.toggleClasses($content, 'slideOutRight', 'slideInRight')
        $body.style.overflowY = 'auto'
      }
    }

    this.setState({
      $ref,
    })
    $ref.show()
  }

  hideForm() {
    const { quoteFormStatus } = this.state
    this.rfqForm.$ref.hide()

    if (quoteFormStatus === 1) {
      this.setState({
        productList: [],
        formData: this.basicFormData,
        quoteFormStatus: 0,
      })

      localStorage.removeItem('B3CreateQuoteProductList')
      localStorage.removeItem('B3CreateQuoteFormData')
    }
  }

  renderFormBody() {
    const {
      formData: {
        referenceNumber,
        contactInfo: {
          name,
          email,
          companyName,
          phoneNumber,
        },
        shippingAddress: {
          country,
          state,
          city,
          zipCode,
          address,
          apartment,
        },
        expiredAt,
      },
    } = this.state

    const $bodyContainer = this.rfqForm.$ref.querySelector('.body-container')

    const formFields = [
      { label: this.text['rfq.form.field.contactEmail'], name: 'contactInfo.email', required: true, value: email},
      { label: this.text['rfq.form.field.contactName'], name: 'contactInfo.name', required: true, value: name},
      { type: 'tip', tip: this.text['rfq.form.field.tips.notice']},
      { label: this.text['rfq.form.field.companyName'], name: 'contactInfo.companyName', value: companyName},
      { label: this.text['rfq.form.field.phoneNumber'], name: 'contactInfo.phoneNumber', value: phoneNumber},
      { label: this.text['rfq.form.field.referenceNumber'], name: 'referenceNumber', value: referenceNumber},
      { label: this.text['rfq.form.field.address'], name: 'shippingAddress.address', value: address},
      { label: this.text['rfq.form.field.apartment'], name: 'shippingAddress.apartment', value: apartment},
      { label: this.text['rfq.form.field.city'], name: 'shippingAddress.city', value: city},
      { label: this.text['rfq.form.field.country'], name: 'shippingAddress.country', value: country},
      { label: this.text['rfq.form.field.state'], name: 'shippingAddress.state', value: state},
      { label: this.text['rfq.form.field.zipCode'], name: 'shippingAddress.zipCode', value: zipCode},
      { label: this.text['rfq.form.field.expiredAt'], name: 'expiredAt', value: window.B3DisplayFormat(expiredAt)},
    ]

    const $formBody = formBody({
      formFields,
    })

    $bodyContainer.innerHTML = $formBody
    this.bindDatePicker($bodyContainer)

    $bodyContainer.querySelectorAll('[data-blur]').forEach(el => el.addEventListener('blur', this.handleInputFieldBlur))
  }

  handleInputFieldBlur = async (e) => {
    const {
      name: field,
      value,
      dataset: {
        required,
        label,
      }
    } = e.target 
    
    const {
      formData,
    } = this.state

    const isFieldValid = await this.validateField({
      field,
      label,
      value,
      required,
      el: e.target,
    })

    if (!isFieldValid) return 

    const fieldKeys = field.includes('.') ? field.split('.') : [field]
    
    let fieldValue = formData
    fieldKeys.forEach((key, i) => {
      if (i === fieldKeys.length - 1) fieldValue[key] = value
      else fieldValue = fieldValue[key]
    })

    this.setState({
      formData: {
        ...formData,
      }
    })
    localStorage.setItem('B3CreateQuoteFormData',JSON.stringify(formData))
  }

  async validateField({
    field,
    label,
    value,
    required,
    el,
  }) {
    const {
      re
    } = this.utils
    const {
      store_hash: storeHash,
    } = this.context.settings

    let isFieldValid = true

    const validationSchema = {
      'contactInfo.email': async (email) => {
        if (!re.email.test(email)) return validation['emailIncorrect']
        if (!this.isLogin) {
          let isEmailExist = true
          try {
            await this.api.detectUserEmailExist({ 
              email,
              storeHash,
              SHOWERROR: false,
            })
          } catch ({ code }) {
            if (code === 40010) isEmailExist = false
          }
          return isEmailExist ? validation['emailExist'] : null
        }
        return null
      },
      'contactInfo.phoneNumber': (value) => {
        if (!re.phone.test(value)) return validation['phoneIncorrect']
        return null
      },
    }

    const requiredErrorMessage = `${label} is required`

    if (required && !validationSchema[field]) {
      this.toggleFieldStatus(el, !!value, requiredErrorMessage)
      isFieldValid = !!value
    } else {
      const validate = validationSchema[field] ?? (() => null)
      const unValidMessage = await validate(value)
      this.toggleFieldStatus(el, !unValidMessage, unValidMessage)
      isFieldValid = !unValidMessage
    }

    return isFieldValid
  }

  toggleFieldStatus(el, status, errorMessage) {
    const $parent = el.parentNode
    const $error = `<span class="form-inlineMessage">${errorMessage}</span>`

    $parent.querySelector('.form-inlineMessage')?.remove()
    if (status) {
      this.toggleClasses($parent, 'form-field--success', 'form-field--error')
    } else {
      this.toggleClasses($parent, 'form-field--error', 'form-field--success')
      $parent.insertAdjacentHTML('beforeend', $error)
    }
  }

  bindDatePicker($container) {
    const { 
      DateTime,
      getStoreZoneDate,
    } = this.utils
    const $end = $container.querySelector('[name="expiredAt"]')

    const setDatePicker = $el => {
      window
        .B3DatePicker($el, {
          min: getStoreZoneDate(),
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
          close: () => {
            $el.blur()
          },
        })
    }

    setDatePicker($end, 'endDateAt')
  }

  renderProductList() {
    const {
      productList
    } = this.state
    const {
      currencyFormat
    } = this.utils

    const $productsContainer = this.rfqForm.$ref.querySelector('.products-container')
    const $formProducts = formProducts({
      productList: productList.map(({
        basePrice,
        ...others
      }) => ({
        formatBasePrice: currencyFormat(basePrice, false),
        ...others 
      }))
    })

    $productsContainer.innerHTML = $formProducts
  }

  handleOfferedPriceInput(e) {
    // todo
  }

  handleQuantityChange(e) {
    const {
      dataset: {
        productId,
        variantId
      },
      value,
    } = e.target
    const {
      productList
    } = this.state

    const productIndex = productList.findIndex(({
      productId: sourceProductId,
      variantId: sourceVariantId,
    }) => variantId ? variantId == sourceVariantId : productId == sourceProductId && !sourceVariantId)

    if (/^\d+$/.test(value)) {
      const product = productList[productIndex]
      productList.splice(productIndex, 1, {
        ...product,
        quantity: Math.max(0, value)
      })

      this.setState({
        productList: [...productList],
      })
      localStorage.setItem('B3CreateQuoteProductList',JSON.stringify(productList))
    }

    this.renderProductList()
  }

  handleDeleteProduct(e) {
    const $input = e.target.previousElementSibling
    const {
      dataset: {
        productId,
        variantId
      },
    } = $input
    const {
      productList
    } = this.state

    const productIndex = productList.findIndex(({
      productId: sourceProductId,
      variantId: sourceVariantId,
    }) => variantId ? variantId == sourceVariantId : productId == sourceProductId && !sourceVariantId)

    productList.splice(productIndex, 1)

    this.setState({
      productList: [...productList],
    })
    localStorage.setItem('B3CreateQuoteProductList',JSON.stringify(productList))

    this.renderProductList()
  }

  renderMessage() {
    const {
      formData: {
        message
      }
    } = this.state

    const $messageContainer = this.rfqForm.$ref.querySelector('.message-container')

    $messageContainer.innerHTML = formMessage({
      message
    })
  }

  handleMessageChange(e) {
    const {
      formData
    } = this.state
    const newFormData = {
      ...formData,
      message: e.target.value,
    }

    this.setState({
      formData: newFormData,
    })
    localStorage.setItem('B3CreateQuoteFormData',JSON.stringify(newFormData))
  }

  async handleSubmit() {
    const { $ref } = this.rfqForm
    const $formFields = $ref.querySelectorAll('.body-container .form-field [name]')
    const $loading = $ref.querySelector('.loadingOverlay')

    const visibleFields = Array.from($formFields).filter(el => el.getAttribute('disabled') === null)
    visibleFields.forEach((el) => el.dispatchEvent(new Event('blur')))

    const isRequiredFilled = visibleFields.filter(({ 
      dataset: {
        required
      },
    }) => required).every(({ value }) => !!value)

    if (!isRequiredFilled) return
    if (!this.rfqForm.data.productList.length) return
    
    const  height = $ref.querySelector('.form-container').scrollHeight
    $loading.style.height = `${height}px`
    $loading.classList.add('show')
    await this.api.createRfq(this.rfqForm.data)
    $loading.classList.remove('show')

    this.setState({
      quoteFormStatus: 1,
    })

    const $editContainer = $ref.querySelector('.quote-edit-container')
    const $successContainer = $ref.querySelector('.quote-success-container')

    this.toggleClasses($editContainer, 'hide', 'show')
    this.toggleClasses($successContainer, 'show', 'hide')
  }

}

export default Rfq;
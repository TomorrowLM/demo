import BasePage from '../../common/BasePage'
import { leftIncludes } from '../../common/utils/util'
import trim from '../../common/utils/trim'
import {
  tips,
  validation,
} from '../../common/locales'
import containers from '../../containers'
import {
  B3Role,
} from '../../common/utils/constants'

class B2Bpdp extends BasePage {
  constructor() {
    super()
    this.name = 'B2Bpdp'
    this.state = {
      status: '0',
    }
  }

  get isInpage() {
    return leftIncludes(this.context.template, 'pages/product')
  }

  shoppingListBtn(quickView) {
    return `<form action="" class="form form-wishlist form-action" data-shoppinglist-add method="post">
    <a aria-controls="${quickView ? 'quick-shoppinglist-dropdown' : 'shoppinglist-dropdown'}"
    aria-expanded="false" class="button dropdown-menu-button ${this.classes['pdp.button.addToShoppingList']}"
    data-dropdown="${quickView ? 'quick-shoppinglist-dropdown' : 'shoppinglist-dropdown'}">
        <span>Add to Shopping List</span>
        <i aria-hidden="true" class="icon ${this.classes['pdp.button.addToShoppingList.icon']}">
            <svg>
                <use xlink:href="#icon-chevron-down" />
            </svg>
        </i>
    </a>
    <ul aria-hidden="true" class="dropdown-menu" data-dropdown-content id="${quickView ? 'quick-shoppinglist-dropdown' : 'shoppinglist-dropdown'}" tabindex="-1">
    </ul>
    </form>`
  }

  async init() {
    const {
      B3CompanyStatus,
    } = this.utils.B3Storage

    if (this.isB2BUser) {
      this.quickview()
    }

    if (!this.isB2BUser || B3CompanyStatus.value !== '1' || !this.isInpage) return

    this.initPage()
  }

  initPage() {
    this.hideWishlist()
    this.addShoppingListBtn()
    this.showShoppingList()
    this.bindEvents()
  }

  quickview() {
    const {
      B3CompanyStatus,
    } = this.utils.B3Storage
    const quickviewItems = document.querySelectorAll('.quickview')
    if (quickviewItems.length === 0) return

    document.querySelector('body').addEventListener('click', e => {
      let interval
      if (interval) clearInterval(interval)

      const checkQuickview = node => {
        if (node.nodeName === 'BODY') return false
        if (node.classList.contains('quickview')) return true
        return checkQuickview(node.parentNode)
      }

      if (checkQuickview(e.target)) {
        interval = setInterval(() => {
          const quickView = document.querySelectorAll('#modal .productView--quickView')
          if (quickView.length > 0) {
            this.hideWishlist()
            if (B3CompanyStatus.value === '1') {
              this.addShoppingListBtn(true)
              this.showShoppingList(true)
            }
            clearInterval(interval)
          }
        }, 200)
      }
    })
  }

  hideWishlist() {
    const wishListBtn = document.querySelector('[action^="/wishlist.php"]')
    if (wishListBtn) wishListBtn.remove()
  }

  addShoppingListBtn(quickView) {
    const el = quickView ? document.querySelector('#modal').querySelector(containers['pdp.shoppinglist.container']) : document.querySelector(containers['pdp.shoppinglist.container'])
    const shoppingListContainer = document.createElement('div')

    shoppingListContainer.classList.add('form-action')
    shoppingListContainer.innerHTML = this.shoppingListBtn(quickView || null)
    el.append(shoppingListContainer)
  }

  async showShoppingList(quickView) {
    const { status } = this.state
    const lists = await this.api.getShoppingLists({ status })
    let frag = ''

    lists.list.forEach(item => {
      frag += `<li><button data-click='addToShoppingList' data-stop type="button" class="button" add-to-list
      data-list-id="${item.id}" data-list-status="${item.status}" >Add to ${item.name}</button></li>`
    })
    frag += `<li data-list-id>
              <a id="createShoppingList" class="button">ADD TO A NEW LIST</a>
              <div class="creat-list-group" style="display: none; padding: 1rem;align-items: center;">
                <input class="form-input" style="flex: 1;"/>
                <div style="display: flex;flex-flow: column; margin-left: 10px;">
                  <span class="button button--small cancel">Cancel</span>
                  <span class="button button--small button--primary confirm" add-to-list style="margin-left: 0;">Confirm</span>
                </div>
              </div>
            </li>`
    const dropDownContainer = quickView ? document.querySelector('#modal #quick-shoppinglist-dropdown') : document.querySelector('#shoppinglist-dropdown')
    dropDownContainer.innerHTML = frag

    const createBtn = document.querySelector('#createShoppingList')
    const $createListGroup = document.querySelector('.creat-list-group')
    const $cancelCreateBtn = $createListGroup.querySelector('.creat-list-group .cancel')
    const $confirm = $createListGroup.querySelector('.creat-list-group .confirm')
    const $input = $createListGroup.querySelector('.form-input')

    createBtn.addEventListener('click', e => {
      e.stopPropagation()
      createBtn.style.display = 'none'
      $createListGroup.style.display = 'flex'
    })

    $input.addEventListener('click', e => e.stopPropagation())

    const handleCancel = () => {
      createBtn.style.display = 'block'
      $createListGroup.style.display = 'none'
      $input.value = ''
    }

    $cancelCreateBtn.addEventListener('click', handleCancel)

    $confirm.addEventListener('click', async e => {
      e.stopPropagation()
      if (!$input.value) {
        this.utils.Alert.error(this.locales.validation.emptyShoppingListName)
        return
      }

      const createShopingList = async (hasVariants, status) => {
        if (hasVariants && !status) return
        const shopplistId = await this.createShopingList($input.value)

        $confirm.setAttribute('data-list-id', shopplistId)
        return shopplistId
      }

      await this.addToShoppingList(e, quickView, createShopingList)
      $confirm.removeAttribute('data-list-id')
      dropDownContainer.classList.remove('is-open')
      handleCancel()
    })

    if (quickView) {
      const $container = document.querySelector('.productView--quickView')
      const addToShoppingBtn = $container.querySelectorAll('[add-to-list]')

      addToShoppingBtn.forEach(item => {
        item.addEventListener('click', e => {
          if (!e.target.dataset.listId) return
          this.addToShoppingList(e, true)
        })
      })
    }
  }

  async createShopingList(name) {
    const {
      B3RoleId,
    } = this.utils.B3Storage

    let status = '30'

    const {
      ADMIN,
      SENIOR,
      SALESREP,
    } = B3Role

    if ([ADMIN, SENIOR, SALESREP].includes(B3RoleId.value)) {
      status = '0'
    }

    const {
      shopplistId,
    } = await this.api.createShopingList({
      name,
      description: '',
      status,
    })

    return shopplistId
  }

  filterEmptyFilesFromForm(formData) {
    try {
      Array.from(formData).forEach(item => {
        const key = item[0]
        const val = item[1]
        if (val instanceof File && !val.name && !val.size) {
          formData.delete(key)
        }
      })
    } catch (e) {
      // console.error(e)
    }
    return formData
  }

  bindEvents() {
    document.querySelector('body').addEventListener('click', e => {
      this.addToShoppingList(e)
    })
  }

  async addToShoppingList(e, quickView, beforeAdd) {
    if (e.target.hasAttribute('add-to-list')) {
      e.preventDefault()
      window.B3Spinner.show()
      const container = quickView ? '#modal ' : ''
      let status = false
      let shoppingListId = e.target.getAttribute('data-list-id')
      let hasVariants = false
      try {
        const productId = document.querySelector(`${container}input[name=product_id]`).value
        const qty = document.querySelector(`${container}[name='qty[]']`)?.value ?? 1
        const sku = trim(document.querySelector(`${container}[data-product-sku]`)?.innerHTML ?? '')

        if (!shoppingListId && !beforeAdd) return
        const data = await this.api.getVariantsByProductId({ productId })
        hasVariants = (data.length > 0)

        let variantId

        if (hasVariants) {
          data.forEach(item => {
            if (item.sku === sku) {
              variantId = item.variantId
              status = true
            }
          })
        }

        if (beforeAdd instanceof Function) shoppingListId = await beforeAdd(hasVariants, status)

        if (!shoppingListId) return

        if (!hasVariants || status) {
          const form = document.querySelector(`${container}form[data-cart-item-add]`)
          const formData = this.filterEmptyFilesFromForm(new FormData(form))
          const optionList = []
          Array.from(formData).forEach(item => {
            if (item[0].indexOf('attribute') !== -1 && item[1] !== '') {
              const optionObj = {
                option_id: item[0],
                option_value: item[1],
              }
              optionList.push(optionObj)
            }
          })
          const params = {
            id: shoppingListId,
            items: [
              {
                productId,
                variantId,
                qty,
                optionList,
              },
            ],

          }
          try {
            const { list } = await this.api.getInventory({ products: [{ productId, variantId }] })
            if (list[0].purchasingDisabled) {
              this.utils.Alert.error(tips.buyAgainFailedNoLongerForSale)
              window.B3Spinner.hide()
              return
            }
            await this.api.addProductToShoppingList(params)
            this.utils.Alert.success(tips.addToShoppingListSuccess)
            location.reload()
          } catch {
            //
          }
        }
      } catch (error) {
        this.utils.Alert.error(tips.globalError)
      } finally {
        window.B3Spinner.hide()
        if (hasVariants && !status) {
          this.utils.Alert.error(validation.cannotAddToShoppingList)
        }
      }
      window.B3Spinner.hide()
    }
  }
}
export default B2Bpdp

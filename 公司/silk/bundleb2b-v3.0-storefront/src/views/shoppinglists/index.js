import BasePage from '../../common/BasePage'
import shoppingListsTemplate from './shoppingLists.html'
import listTemplate from './list.html'
import {
  B3Role,
  shoppingListStatusDefaultOptions,
} from '../../common/utils/constants'
import getShoppingListStatusByCode from '../../common/utils/getShoppingListStatusByCode'
import {
  tips,
} from '../../common/locales'
import createShoppingListModalContent from '../buyAgain/createShoppingListModalContent.html'
import themeStyleFix from '../../common/utils/themeStyleFix'

export default class ShoppingLists extends BasePage {
  constructor() {
    super()
    this.name = 'ShoppingLists'
    this.state = {
      isShowAll: '1',
      isShowDraftBtn: false,
      isShowCreatedBy: true,
      shoppingListsPagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
      },
      shoppingLists: [],
      cssStatus: 'all',
      statusOptions: shoppingListStatusDefaultOptions,
      createShopingListModal: null,
      shoppingListDuplicateInfo: null,
    }
    this.getShoppingListStatusByCode = getShoppingListStatusByCode
    this.B3Role = B3Role
    this.listTemplate = listTemplate
    this.createShoppingListModalContent = createShoppingListModalContent
    this.shoppingListsTemplate = shoppingListsTemplate
  }

  async init() {
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage

    const {
      ADMIN,
      SENIOR,
      SALESREP,
      JUNIOR,
    } = B3Role

    const roleId = B3RoleId.value
    const companyId = B3CompanyId.value

    const isUnMasquerade = roleId === SALESREP && !companyId
    const isShowCreatedBy = [ADMIN, SENIOR, SALESREP].includes(roleId)

    if (isUnMasquerade || !this.isB2BUser) return
    if (roleId === JUNIOR) {
      this.setState({
        isShowDraftBtn: true,
      })
    }
    this.setStatusOptions('all', false)
    this.setState({
      isShowCreatedBy,
    })

    await this.getShoppingLists()
    this.render()
    this.initMobileTable()
    this.bindBodyEvents()
    themeStyleFix.editModalBoxStyleFix()
  }

  setStatusOptions(status, value) {
    let {
      isShowAll,
    } = this.state
    const {
      statusOptions,
    } = this.state

    const options = statusOptions.map(option => {
      const {
        extraIsShowField,
        id,
      } = option

      let isShow = true
      if (
        status
        && option.status === status
      ) {
        isShow = value
        isShowAll = id
      }
      if (extraIsShowField) isShow = this.state[extraIsShowField] && isShow

      return {
        ...option,
        isShow,
      }
    })

    this.setState({
      isShowAll,
      statusOptions: options,
    })
  }

  async getShoppingLists() {
    const {
      shoppingListsPagination,
      shoppingListsPagination: {
        offset,
        limit,
      },
      isShowAll,
    } = this.state
    const {
      B3UserId,
      B3RoleId,
    } = this.utils.B3Storage

    window.B3Spinner.show()
    try {
      const {
        list,
        pagination,
      } = await this.api.getShoppingListsInfo({
        offset,
        limit,
        isShowAll,
      })

      const shoppingLists = list.reduce((result, shoppingList) => {
        const latestDate = new Date(parseInt(shoppingList.createdAt, 10) * 1000)
        const isOwn = +shoppingList.customerInfo.userId === +B3UserId.value
        const isDraft = +shoppingList.status === 30

        let deleteDisabled

        if (
          (
            isOwn
            && +shoppingList.status !== 40
            && B3RoleId.value !== this.B3Role.JUNIOR
          )
          || (
            isOwn
            && isDraft
            && B3RoleId.value === this.B3Role.JUNIOR
          )
        ) deleteDisabled = ''
        else deleteDisabled = 'disabled'

        const statusName = this.getShoppingListStatusByCode(shoppingList.status) ?? ''

        if (isDraft && B3RoleId.value !== this.B3Role.JUNIOR) return result

        result.push({
          ...shoppingList,
          latestDate,
          statusName,
          deleteDisabled,
          isDraft,
        })

        return result
      }, [])

      this.setState({
        shoppingLists,
        shoppingListsPagination: {
          ...shoppingListsPagination,
          ...pagination,
        },
      })
    } catch {
      this.utils.Alert.error(tips.globalError)
    }
    window.B3Spinner.hide()
  }

  toggleDropdown(e) {
    this.hideShoppingListActions()
    const item = e.target.nextElementSibling
    this.utils.toggleClass(item, 'show-action')
  }

  hideShoppingListActions() {
    document.querySelector('.show-action')?.classList?.remove('show-action')
  }

  bindBodyEvents() {
    document.querySelector('body').addEventListener('click', e => {
      if (e.target.hasAttribute('shopping-list-action')) return
      this.hideShoppingListActions()
    })
  }

  renderShoppingLists() {
    const {
      shoppingLists,
      isShowCreatedBy,
    } = this.state

    this.state.shoppingLists = shoppingLists.map(shoppingList => {
      shoppingList.isShowDelete = shoppingList.deleteDisabled === ''
      shoppingList.isShowDuplicate = this.isB2BUser
      return shoppingList
    })

    const listContent = this.listTemplate({
      isShowCreatedBy,
      list: shoppingLists,
    })
    document.querySelector('#shopping_lists_table tbody').innerHTML = listContent
  }

  render() {
    const {
      shoppinglists: {
        container,
      },
    } = this.doms

    const {
      isShowCreatedBy,
      cssStatus,
      shoppingLists,
      statusOptions,
    } = this.state

    const b2bWraper = document.querySelector('.b2b-wrap')
    if (b2bWraper) b2bWraper.remove()

    this.utils.renderTemplate({
      hbsTemplate: this.shoppingListsTemplate,
      containerSelector: container,
      templateConfig: {
        isShowCreatedBy,
        shoppingLists,
        cssStatus,
        statusOptions,
      },
      insertType: 'beforeend',
    })

    this.renderPaginator()
    this.renderShoppingLists()
    this.bindAddNewShoppingList()
    this.bindSwitchStatus()
  }

  async handleDeleteShoppingList(e) {
    const shoppingListId = e.target.dataset.listId
    const disabledDelete = e.target.innerHTML

    if (disabledDelete === '') return

    const {
      dismiss,
    } = await this.utils.Alert.warning(tips.confirmDeleteShoppingList, {
      showCancelButton: true,
      confirmButtonText: 'Sure',
    })

    if (dismiss) return

    window.B3Spinner.show()
    try {
      await this.api.deleteShopingList(shoppingListId)
      await this.getShoppingLists()
      this.render()
    } catch {
      this.utils.Alert.error(tips.deleteShopingListFailed)
    }
    window.B3Spinner.hide()
  }

  handleDuplicateShoppingList(e) {
    const shoppingListId = e.target.dataset.listId
    const { shoppingLists } = this.state

    const shoppingListDuplicateInfo = shoppingLists.find(item => item.id === parseInt(shoppingListId, 10))
    this.setState({
      shoppingListDuplicateInfo,
    })
    this.openCreateShoppingListModal()
  }

  renderPaginator() {
    const {
      shoppingListsPagination: {
        offset,
        limit,
        totalCount,
      },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(totalCount / limit)

    window.B3Paginator.init({
      container: '#shoppingLists-pagination',
      currentPage,
      totalPages,
      onPageChange: this.handlePaginationChange,
    })
  }

  handlePaginationChange = async page => {
    const {
      shoppingListsPagination,
      shoppingListsPagination: {
        limit,
      },
    } = this.state

    this.setState({
      shoppingListsPagination: {
        ...shoppingListsPagination,
        offset: (page - 1) * limit,
      },
    })

    await this.getShoppingLists()
    this.render()
  }

  bindAddNewShoppingList() {
    const $btn = document.querySelector('#shopping_list_new')

    $btn.addEventListener('click', this.openCreateShoppingListModal)
  }

  bindSwitchStatus() {
    const $switchStatusBtns = document.querySelectorAll('[filter-status]')

    $switchStatusBtns.forEach($btn => {
      $btn.addEventListener('click', async e => {
        const {
          shoppingListsPagination,
        } = this.state

        e.preventDefault()
        const status = $btn.dataset.statusValue
        this.setStatusOptions(status, false)

        this.setState({
          cssStatus: status,
          shoppingListsPagination: {
            ...shoppingListsPagination,
            offset: 0,
          },
        })

        await this.getShoppingLists()
        this.render()
      })
    })
  }

  openCreateShoppingListModal = () => {
    const {
      createShopingListModal,
    } = this.state

    let $modal = createShopingListModal

    if (!createShopingListModal) {
      $modal = new window.B3Modal.modal({
        stickyFooter: true,
        closeMethods: ['overlay', 'escape'],
        closeLabel: 'Close',
      })

      this.setState({
        createShopingListModal: $modal,
      })
    }

    $modal.open()
    this.renderCreateShoppingListModalContent()
  }

  renderCreateShoppingListModalContent() {
    const {
      createShopingListModal,
      shoppingListDuplicateInfo,
    } = this.state

    const modalContent = this.createShoppingListModalContent()
    createShopingListModal.setContent(modalContent)

    const handleClose = () => {
      createShopingListModal.close()
      this.setState({
        shoppingListDuplicateInfo: null,
      })
    }

    const $closes = document.querySelectorAll('.modal-close')
    const $listName = document.querySelector('#list_name')
    const $addNew = document.querySelector('#add_new_shoppingList')
    const $listComment = document.querySelector('#list_comment')
    const duplicateModalTitle = this.text['shopping.list.createModal.title.label']
    const $modalTitle = document.querySelector('.modal-header-title')

    if (shoppingListDuplicateInfo) {
      $modalTitle.innerHTML = duplicateModalTitle
      const { name, description } = shoppingListDuplicateInfo

      $listName.value = `${name}${new Date().getTime()}`
      $listComment.value = description
    }

    $closes.forEach($close => $close.addEventListener('click', handleClose))
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

      if (!name) {
        this.utils.Alert.error(this.locales.validation.emptyShoppingListName)
        return
      }
      $addNew.setAttribute('disabled', true)

      if (shoppingListDuplicateInfo) {
        const {
          id: sampleShoppingListId,
        } = shoppingListDuplicateInfo
        await this.duplicateShopingList(sampleShoppingListId, name, description)
        this.setState({
          shoppingListDuplicateInfo: null,
        })
      } else {
        await this.createShopingList(name, description)
      }

      $addNew.setAttribute('disabled', false)
    })
  }

  async createShopingList(name, description) {
    const {
      createShopingListModal,
    } = this.state

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

    createShopingListModal.close()

    window.B3Spinner.show()
    try {
      await this.api.createShopingList({
        name,
        description,
        status,
      })

      await this.getShoppingLists()
      this.render()
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async duplicateShopingList(sampleShoppingListId, name, description) {
    const {
      createShopingListModal,
    } = this.state

    createShopingListModal.close()
    window.B3Spinner.show()
    try {
      await this.api.duplicateShopingList({
        sampleShoppingListId,
        name,
        description,
      })

      await this.getShoppingLists()
      this.render()
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }
}

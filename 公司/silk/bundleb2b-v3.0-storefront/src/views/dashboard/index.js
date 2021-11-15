import BasePage from '../../common/BasePage'
import {
  B3Role,
} from '../../common/utils/constants'
import dashboard from './dashboard.html'
import companyList from './companyList.html'

export default class Dashboard extends BasePage {
  constructor() {
    super()
    this.name = 'Dashboard'
    const companyNameLabel = this.text['dashboard.filter.companyName']
    const adminNameLabel = this.text['dashboard.filter.adminName']
    const companyEmailLabel = this.text['global.user.companyEmail.label']

    this.state = {
      userInfo: {},
      pagination: {
        offset: 0,
        limit: 10,
        totalCount: 0,
        perCount: 0,
      },
      companies: [],
      isShowEndMasquerade: false,
      filters: {
        orderBy: 'companyName',
        sortBy: 'DESC',
        q: '',
      },
      filterMaps: [
        { orderBy: 'companyName', sortBy: '', title: companyNameLabel },
        { orderBy: 'companyAdminName', sortBy: '', title: adminNameLabel },
        { orderBy: 'companyEmail', sortBy: '', title: companyEmailLabel },
      ],
    }
  }

  async init() {
    const {
      B3RoleId,
    } = this.utils.B3Storage

    if (B3RoleId.value !== B3Role.SALESREP) return

    await this.getUserInfo()
    await this.getCompanyList()

    this.render()
    this.initMobileTable()
  }

  async getUserInfo() {
    const {
      customer: {
        id: customerId,
      },
    } = this.context

    window.B3Spinner.show()
    try {
      const resp = await this.api.getUserRole(customerId)
      this.setState({
        userInfo: {
          ...resp,
        },
      })
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async getCompanyList() {
    const {
      pagination: {
        offset,
        limit,
      },
      filters: {
        orderBy,
        sortBy,
        q,
      },
    } = this.state

    const userId = this.utils.B3Storage.B3UserId.value

    window.B3Spinner.show()
    try {
      const {
        pagination,
        list: companies,
      } = await this.api.getCompanyList(userId, {
        offset,
        limit,
        orderBy,
        sortBy,
        q,
      })
      this.setState({
        pagination,
        companies,
      })
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  render() {
    const {
      dashboard: {
        container,
      },
    } = this.doms

    const b2bWraper = document.querySelector('.saleRep')
    if (b2bWraper) b2bWraper.remove()

    this.setEndMasqueradeVisiable()
    this.utils.renderTemplate({
      hbsTemplate: dashboard,
      containerSelector: container,
      templateConfig: {
        ...this.state,
      },
      insertType: 'beforeend',
    })

    this.renderCompanies()
    this.renderPaginator()
    this.bindEndMasquerade()
    this.bindSearch()
  }

  renderCompanies() {
    const {
      companies,
    } = this.state
    const companyId = this.utils.B3Storage.B3CompanyId.value

    const computedCompanies = companies.map(item => {
      item.isSelected = false
      if (companyId === item.companyId) item.isSelected = true
      return item
    })

    document.querySelector('#sale-rep-table tbody').innerHTML = companyList({
      companies: computedCompanies,
    })

    this.beginMasqueradeCompany()
    this.bindFilters()
  }

  renderPaginator() {
    const {
      pagination: {
        offset,
        limit,
        perCount,
      },
    } = this.state

    const currentPage = Math.ceil((offset + 1) / limit)
    const totalPages = Math.ceil(perCount / limit)

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

    window.B3Spinner.show()
    await this.getCompanyList()
    this.render()
    window.B3Spinner.hide()
  }

  beginMasqueradeCompany() {
    document.querySelectorAll('[action-begin-masquerade]').forEach($action => {
      $action.addEventListener('click', async e => {
        const { companyId } = e.target.dataset
        await this.putMasqueradeCompany(companyId)
        await this.initCompanyInfo()

        BasePage.notify('beginMasqueradeCompany')
      })
    })
  }

  async putMasqueradeCompany(companyId) {
    const {
      B3UserId,
    } = this.utils.B3Storage
    const userId = B3UserId.value

    window.B3Spinner.show()
    try {
      await this.api.beginMasqueradeCompany(companyId, userId)
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  async initCompanyInfo() {
    const {
      id: customerId,
    } = this.context.customer

    const {
      B3CompanyId,
      B3CompanyStatus,
      B3CompanyName,
    } = this.utils.B3Storage

    window.B3Spinner.show()
    try {
      const {
        companyId,
        companyName,
        companyStatus,
      } = await this.api.getSelerep(customerId)

      B3CompanyId.setValue(companyId)
      B3CompanyName.setValue(companyName)
      B3CompanyStatus.setValue(companyStatus)

      await this.getCompanyList()
      this.render()
    } catch (error) {
      this.utils.Alert.error(error.message)
    }
    window.B3Spinner.hide()
  }

  setEndMasqueradeVisiable() {
    const {
      B3RoleId,
      B3CompanyId,
    } = this.utils.B3Storage

    if (B3RoleId.value === B3Role.SALESREP && B3CompanyId.value) {
      this.setState({
        isShowEndMasquerade: true,
      })
    } else {
      this.setState({
        isShowEndMasquerade: false,
      })
    }
  }

  bindEndMasquerade() {
    const $endMasquerade = document.querySelector('.saleRep [end-masquerade]')
    if ($endMasquerade) {
      $endMasquerade.addEventListener('click', () => this.handleEndMasqueradeCompany())
    }
  }

  bindFilters() {
    const self = this
    document.querySelectorAll('th[data-sort-th]').forEach($filter => {
      $filter.addEventListener('click', async function handleFilterChange() {
        const {
          filters,
          filterMaps,
        } = self.state

        const {
          orderBy,
        } = this.dataset
        const activeFilter = filterMaps.find(filterMap => filterMap.orderBy === orderBy)
        const { sortBy } = activeFilter

        self.setState({
          filters: {
            ...filters,
            orderBy,
            sortBy: sortBy === '' ? 'ASC' : 'DESC',
          },
          filterMaps: filterMaps.map(filterMap => {
            if (orderBy === filterMap.orderBy) {
              filterMap.sortBy = sortBy === '' ? 'asc' : ''
            } else {
              filterMap.sortBy = ''
            }
            return filterMap
          }),
        })
        await self.getCompanyList()
        self.render()
      })
    })
  }

  bindSearch() {
    const $searchInput = document.querySelector('.search>input')
    if ($searchInput) {
      $searchInput.addEventListener('keyup', e => this.handleInputSearch(async () => {
        const {
          pagination,
          filters,
        } = this.state
        this.setState({
          pagination: {
            ...pagination,
            offset: 0,
          },
          filters: {
            ...filters,
            q: e.target.value,
          },
        })

        await this.getCompanyList()
        this.render()
      }))
    }
  }

  watch = {
    endMasqueradeCompany: async () => {
      const {
        pagination,
      } = this.state

      this.setState({
        pagination: {
          ...pagination,
          offset: 0,
        },
      })
      window.B3Spinner.show()
      await this.getCompanyList()
      this.render()
      window.B3Spinner.hide()
    },
  }
}

export default class B3Paginator {
  static defaultOptions = {
    totalPages: 0,
    totalCounts: 0,
    pageSize: 0,
    currentPage: 1,
    visiblePages: 10,
    onPageChange: null,
    container: '',
    disabledClass: 'disabled',
    activeClass: 'pagination-item--current',
  }

  init(options) {
    this.$container = document.querySelector(options.container)
    this.options = {
      ...B3Paginator.defaultOptions,
      ...options,
    }
    this.render()
    this.bindEvents()
    return this
  }

  render() {
    const {
      totalPages,
      disabledClass,
      activeClass,
      currentPage,
    } = this.options

    const html = []

    const isPrevDisabled = currentPage === 1
    const isNextDisabled = currentPage >= totalPages

    const $prev = `<li class="pagination-item pagination-item--previous ${isPrevDisabled ? disabledClass : ''}" data-page="${currentPage - 1}"><a class="pagination-link" href="javascript:;">Previous</a></li>`
    const $next = `<li class="pagination-item pagination-item--next ${isNextDisabled ? disabledClass : ''}" data-page="${currentPage + 1}"><a class="pagination-link" href="javascript:;">Next</a></li>`
    const getPageTemplate = page => `<li class="pagination-item ${currentPage === page ? activeClass : ''}" data-page="${page}"><a class="pagination-link" href="javascript:;">${page}</a></li>`

    const pages = this.getPages()

    for (let i = 0; i < pages.length; i += 1) {
      html.push(getPageTemplate(pages[i]))
    }
    html.unshift($prev)
    html.push($next)

    this.$container.innerHTML = html.join('')
  }

  getPages() {
    let { visiblePages } = this.options
    const {
      totalPages,
      currentPage,
    } = this.options

    const pages = []

    if (visiblePages > totalPages) {
      visiblePages = totalPages
    }

    const half = Math.floor(visiblePages / 2)
    let start = (currentPage - half + 1) - (visiblePages % 2)
    let end = currentPage + half

    if (start < 1) {
      start = 1
      end = visiblePages
    }
    if (end > totalPages) {
      end = totalPages
      start = 1 + totalPages - visiblePages
    }

    let itPage = start
    while (itPage <= end) {
      pages.push(itPage)
      itPage += 1
    }

    return pages
  }

  bindEvents() {
    const {
      disabledClass,
      activeClass,
      onPageChange,
    } = this.options

    this.$container.querySelectorAll('.pagination-item').forEach(paginationItem => {
      paginationItem.addEventListener('click', function handleClick() {
        const isDisabled = this.classList.contains(disabledClass)
        const isActive = this.classList.contains(activeClass)
        if (isDisabled || isActive) return

        const { page } = this.dataset
        if (onPageChange instanceof Function) onPageChange(page)
      })
    })
  }
}

window.B3Paginator = new B3Paginator()

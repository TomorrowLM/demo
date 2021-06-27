class UrlHelper {
  redirect(url) {
    window.location.href = url
  }

  get path() {
    const { pathname } = window.location
    const segements = pathname.split('/')
    return {
      get() {
        return segements
      },
      has(pathString) {
        return segements.includes(pathString)
      },
    }
  }

  get searchParams() {
    const search = window.location.search.substring(1)
    let searchParams = {}
    if (search) {
      searchParams = search.split('&').reduce((result, currentItem) => {
        const newResult = result
        const [k, v] = currentItem.split('=')
        newResult[k] = v
        return newResult
      }, {})
    }
    return {
      get(name) {
        return searchParams[name] ? searchParams[name] : null
      },
      getAll() {
        return searchParams
      },
      has(name) {
        return name in searchParams
      },
    }
  }
}
export default new UrlHelper()

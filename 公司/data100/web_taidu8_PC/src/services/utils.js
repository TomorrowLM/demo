export const createElement = (marker, tag) => {
    var el = document.createElement(tag || 'div')
    el.setAttribute(marker, '')
    document.body.appendChild(el)
}

export const removeElement = (marker) => {
    var el = document.querySelector(marker) || document.querySelector(`[${marker}]`)
    if (el)
        document.body.removeChild(el)
}

export const timeout = (duration = 0) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    })
}
export function pageContentScrollTop(scrollTop) {
    var root = document.querySelectorAll('.page .page-content')
    root = root && root.length > 0 && root[root.length - 1]

    // 还原滚动的位置
    if (typeof scrollTop == 'number') {
        const pages = root && root.querySelectorAll('.scroll')
        console.log('pages', pages)
        const content = pages[pages.length - 1]
        if (content) {
            content.scrollTop = scrollTop
        }
    } else {
        // 获得滚动的位置
        return root && root.querySelector('.scroll') ?
            root.querySelector('.scroll').scrollTop :
            0
    }
}
/**
 * sessionStorage 相关方法
 *
 * @export
 * @param {any} name
 * @returns
 */
export function get(name) {
    var value = sessionStorage.getItem(name)
    if (/^\{.*\}$/.test(value)) value = JSON.parse(value)
    return value
}
export function set(name, value) {
    if (typeof value === typeof {}) value = JSON.stringify(value)
    return sessionStorage.setItem(name, value)
}
export function remove(name) {
    return sessionStorage.removeItem(name)
}


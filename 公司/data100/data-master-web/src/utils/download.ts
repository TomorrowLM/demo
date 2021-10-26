/**
 *
 * @param url 下载链接
 * @param name 文件名称
 */
function fileDownload(url: string, name: string) {
  const isPdf = /\.(pdf)$/.test(url)
  if (isPdf) {
    window.open(url)
  } else {
    const element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('target', '_parent')
    element.setAttribute('download', name)
    document.body.appendChild(element)
    element.click()
    element.remove()
  }

}

export {fileDownload}

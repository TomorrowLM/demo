export default {
  editModalBoxStyleFix: () => {
    const {
      'body-bg': bodyBg,
      'button--default-borderColor': borderColor,
    } = window.jsContext.themeSettings ?? {}

    const isBold = bodyBg === '#444444'
    const style = document.createElement('style')
    style.innerHTML = `.tingle-modal-box {
      background: ${isBold ? 'none' : '#fff'};
      ${isBold ? `border: 1px solid ${borderColor}` : 'none'}
    }`
    document.head.appendChild(style)
  },
}

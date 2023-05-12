
function checkPermission(el, binding) {
  el.addEventListener('click', () => {
    if (!el.disabled) {
      el.disabled = true
      setTimeout(() => {
        el.disabled = false
      }, binding.value || 2000)
    }
  })
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}

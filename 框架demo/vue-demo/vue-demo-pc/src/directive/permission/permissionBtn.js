import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.role
  // 模拟权限按钮
  const mockButton = store.getters && store.getters.mockButton
  if (mockButton[value] === 'disabled') {
    el.disabled = true
    el.setAttribute('disabled', true)
  }

  if (mockButton[value] === 'hidden') {
    el.style.display = 'none'
  }
  if (mockButton[value] === 'show') {
    el.style.display = 'block'
    el.disabled = false
  }
  // throw new Error(`need roles! Like v-permission="['admin','editor']"`)
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}

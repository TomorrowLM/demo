import store from '@/store'

function checkPermission(el, binding) {
  const { value } = binding
  const roles = store.getters && store.getters.roles
  // 模拟权限按钮
  const mockButton = {
    'btn:access:createUser': 'hidden',
    'btn:access:editUser': 'disable'
  }
  if (mockButton[value] === 'disable') {
    el.disabled = true
    el.setAttribute.add('disabled', 'disabled')
  }
  if (mockButton[value] === 'hidden') {
    el.parentNode && el.parentNode.removeChild(el)
  }
  throw new Error(`need roles! Like v-permission="['admin','editor']"`)
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding)
  },
  update(el, binding) {
    checkPermission(el, binding)
  }
}

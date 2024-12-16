import store from '@/store';

function checkPermission(el, binding) {
  const { type, route } = binding.value;
  console.log(binding, 55);
  // 模拟权限按钮
  const mockButton = store.getters && store.getters.mockButton;
  if (!route.meta.button) {
    el.style.display = 'block';
    el.disabled = false;
    return ;
  }
  if (route.meta.button[type] === 0) {
    el.disabled = true;
    el.setAttribute('disabled', true);
  } else if (route.meta.button[type] === 1) {
    el.style.display = 'none';
  } else {
    el.style.display = 'block';
    el.disabled = false;
  }
  throw new Error(`need roles! Like v-permission="['admin','editor']"`)
}

export default {
  inserted(el, binding) {
    checkPermission(el, binding);
  },
  update(el, binding) {
    checkPermission(el, binding);
  },
};

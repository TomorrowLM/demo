// permission.ts
import router from '@/router'

export default {
  install: (app) => {
    app.directive('permission', {
      // 当被绑定的元素插入到 DOM 中时……
      mounted: function (el, binding) {
        const { value } = binding
        const permissions = router.currentRoute.value.meta.permissions
        // 按钮权限数组是否包含当前按钮，不包含代表隐藏当前按钮，DOM移除元素
        if (!permissions.includes(value)) {
          el.parentNode.removeChild(el)
        }
      }
    })
  }
}
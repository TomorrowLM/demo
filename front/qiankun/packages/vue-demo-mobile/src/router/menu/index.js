export default [
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/frame/index'),
    children: [
      {
        path: 'jumpApp',
        name: 'jumpApp',
        component: () => import('@/views/menu/case/jumpApp')
      },
      {
        path: 'eCharts',
        name: 'eCharts',
        component: () => import('@/views/menu/eCharts')
      },
      {
        path: 'sdk',
        name: 'sdk',
        component: () => import('@/views/menu/index'),
        children: [
          {
            path: 'sdk-message',
            name: 'sdk-message',
            title: '',
            component: () => import('@/views/menu/sdk/sdk-message.vue')
          }
        ]
      },
      {
        path: 'custom-com',
        name: 'customCom',
        title: '自定义组件',
        component: () => import('@/views/menu/index'),
        children: [
          {
            path: 'customCom-form',
            name: 'customCom-form',
            title: '',
            component: () => import('@/views/menu/custom-com/form.vue')
          }
        ]
      }
    ]
  }
]

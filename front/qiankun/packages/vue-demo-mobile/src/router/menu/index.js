export default [
  {
    path: '/menu',
    name: 'menu',
    component: () => import('@/views/frame/index'),
    children: [
      {
        path: 'sdk',
        name: 'sdk',
        component: () => import('@/views/menu/index'),
        children: [
          {
            path: 'sdk-message',
            name: 'sdk-message',
            title: '',
            component: () => import('@/views/menu/sdk/sdk-message.vue'),
          }
        ]
      },
      {
        path: 'custom-com',
        name: 'customCom',
        title:'自定义组件',
        component: () => import('@/views/menu/index'),
        children: [
          {
            path: 'customCom-form',
            name: 'customCom-form',
            title: '',
            component: () => import('@/views/menu/custom-com/form.vue'),
          }
        ]
      }
    ]
  }
]
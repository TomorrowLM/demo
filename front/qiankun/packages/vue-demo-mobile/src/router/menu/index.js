export default [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/frame/index'),
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
      }
    ]
  }
]
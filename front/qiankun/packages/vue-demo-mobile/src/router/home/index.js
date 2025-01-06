export default [
  {
    path: '/',
    name: '',
    component: () => import('@/views/frame/index'),
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
      },
      {
        path: 'learn',
        name: 'learn',
        component: () => import('@/views/home/index'),
      }
    ]
  }
]

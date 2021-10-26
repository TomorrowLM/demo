/**
 * 金币商城路由配置
 */
export default [
  {
    path: '/error/:data',
    name: 'Error',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/public/Error.vue'),
  },
  {
    path: '/unqualified',
    name: 'Unqualified',
    component: () => import(/* webpackChunkName: "survey" */ '@/views/public/Unqualified.vue'),
  },
]
/**
 * 金币商城路由配置
 */
export default [
  {
    path: '/market',
    name: 'Market',
    component: () => import(/* webpackChunkName: "market" */ '@/views/market/Index.vue'),
  },
  {
    path: '/prize',
    name: 'Prize',
    component: () => import(/* webpackChunkName: "prize" */ '@/views/market/Prize.vue'),
  },
  {
    path: '/integral',
    name: 'Integral',
    component: () => import(/* webpackChunkName: "integral" */ '@/views/market/Integral.vue'),
  },
  {
    path: '/goodsDetail/:id',
    name: 'GoodsDetail',
    component: () => import(/* webpackChunkName: "goodsDetail" */ '@/views/market/GoodsDetail.vue'),
  },
  {
    path: '/goodsList/:type',
    name: 'GoodsList',
    component: () => import(/* webpackChunkName: "goodsList" */ '@/views/market/GoodsList.vue'),
  },
  {
    path: '/withdrawal/:id',
    name: 'Withdrawal',
    component: () => import(/* webpackChunkName: "withdrawal" */ '@/views/market/Withdrawal.vue'),
  },
  {
    path: '/withdrawalSuccess',
    name: 'WithdrawalSuccess',
    component: () => import(/* webpackChunkName: "withdrawalSuccess" */ '@/views/market/WithdrawalSuccess.vue'),
  }
]
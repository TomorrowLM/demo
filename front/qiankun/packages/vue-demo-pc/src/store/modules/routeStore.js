import { menuApi } from '@/api'
import lodash from 'lodash'
//网上说后端给的动态路由组件地址不能包含@/views/
export const loadView = (view) => {
  return () => import(`@/views/${view}`)
}
/**
 * 合并静态路和动态路由，并构建最终的路由列表。
 * @param {*} whiteRoutes 静态路由
 * @param {*} asyncRoutes 动态路由
 * @param {*} flatAsyncRoutes 扁平化动态路由
 * @param {*} routes 静态路由+动态路由
 * @param {*} path 扁平化动态路由父级路径
 * @returns
 */
export function filterAsyncRoutes(whiteRoutes, asyncRoutes, flatAsyncRoutes, routes, path) {
  asyncRoutes.forEach((element, index) => {
    let pos = -1 // 静态和动态路由匹配索引
    const whiteRoutesItem = whiteRoutes.find((item, index) => {
      if (item.path === element.path) {
        pos = index
      }
      return item.path === element.path
    })
    if (pos === -1) {
      // TODO: 优化element还可能有children
      const componentPath = element.component
      const urlPath = `${path}/${element.path}`.replace('//', '') // 处理路径
      routes.push({ ...element, component: loadView(componentPath) })
      flatAsyncRoutes.push({ ...element, path: urlPath, component: loadView(componentPath) })
    } else if (whiteRoutesItem && whiteRoutesItem.children && element.children) {
      filterAsyncRoutes(whiteRoutesItem.children, element.children, flatAsyncRoutes, routes[pos].children, `${path}/${element.path}`)
    }
  })
  return routes
}
// 白名单
export const whiteRoutes = [
  {
    path: '/',
    name: '',
    redirect: 'dashboard',
    component: () => import('@/views/index.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          sidebar: true,
          menuName: '主页'
        },
        component: () => import('@/views/dashboard/index.vue')
      },
      {
        path: 'mainApp',
        name: 'mainApp',
        meta: {
          sidebar: true,
          menuName: '主应用页面组件'
        },
        component: () => import('@/views/mainApp/index.vue'),
        children: [
          {
            path: 'page1',
            name: 'page1',
            meta: {
              sidebar: true,
              menuName: '主应用页面组件'
            }
          }, {
            path: 'page2',
            name: 'page2',
            meta: {
              sidebar: true,
              menuName: '主应用页面组件'
            }
          },
        ]
      },
      {
        path: 'demo',
        name: 'demo',
        meta: {
          sidebar: true,
          menuName: 'demo'
        },
        component: () => import('@/views/demo/index.vue'),
        children: [
          // {
          //   path: 'access',
          //   name: '权限',
          //   component: () => import('@/views/demo/Access/index.vue'),
          //   meta: {
          //     sidebar: true,
          //   menuName: '权限',
          //   },
          // },
          {
            path: 'grammar',
            name: 'grammar',
            component: () => import('@/views/demo/grammar/index.vue'),
            meta: {
              menuName: '语法',
              sidebar: true
            }
          },
          {
            path: 'skin',
            name: 'skin',
            component: () => import('@/views/demo/Skin/index.vue'),
            meta: {
              menuName: '皮肤',
              sidebar: true
            }
          },
          {
            path: 'repeatReq',
            name: 'repeatReq',
            component: () => import('@/views/demo/repeatReq/index.vue'),
            meta: {
              menuName: '重复请求',
              sidebar: true
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login'),
    meta: { sidebar: false }
  },
  {
    path: '*',
    name: 'NotFound',
    component: () => import('@/views/common/404.vue'),
    meta: { sidebar: false }
  }
]
export const commonMenu = []
const routeStore = {
  state: {
    commonMenu: [], // 菜单栏
    whiteRoutes, // 静态路由
    asyncRoutes: [], // 动态路由
    flatAsyncRoutes: [], // 扁平化动态路由
    routes: whiteRoutes, // 静态路由+动态路由
    registerRouteFresh: true, // 动态路由注册状态，账号切换，路由需要更新
    currentRouteInfo: {},
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      console.log('SET_ROUTES：', routes)
      state.routes = routes
    },
    // SET_PERMISSION会在登录成功的时候触发，更新路由表
    SET_PERMISSION: (state, data) => {
      state[data.type] = data.data
    },
    setCurrentRouteInfo(state, data) {
      state.currentRouteInfo = data;
    },
  },
  actions: {
    async generateRoutes({ commit, state }) {
      const { data: { routes: asyncRoutes } } = await menuApi()
      state.routes = lodash.cloneDeep(state.whiteRoutes) // 初始化routes为静态路由，同时深拷贝防止影响静态路由
      filterAsyncRoutes(whiteRoutes, asyncRoutes, state.flatAsyncRoutes, state.routes, '')
      state.asyncRoutes = asyncRoutes
      state.commonMenu = state.routes[0].children; // 配置菜单栏
      console.log('routes----', state.routes, state.whiteRoutes, asyncRoutes, commonMenu)
      return state.routes
    }
  }
}
export default routeStore

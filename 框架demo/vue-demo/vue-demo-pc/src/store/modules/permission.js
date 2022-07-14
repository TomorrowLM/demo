import { routes as constantRoutes } from '@/router'

// 根据角色判断路由权限
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.some(val => val === roles)
  }
  return true
}

/**
 * 递归动态路由
 * @param routes 动态路由
 * @param roles 角色
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        //后台传来的路由字符串，转换为组件对象
        //       let a = `../views/${route.component}`;
        //       route.component = () => import(a); // 导入组件
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

//模拟后端传过来的路由
export const asyncRoutes = [
  {
    path: '/',
    name: 'home',
    redirect: '/dashboard',
    meta: {
      title: '首页',
      //纯前端去做动态路由
      roles: ['admin']
    },
    component: () => import('@/views/HomeView.vue'),
    children: [
      {
        path: 'PickupTask',
        name: 'PickupTask',
        meta: {
          title: 'PickupTask',
        },
        component: () => import('@/views/Sd/PickupTask.vue'),
      },
      {
        path: 'access',
        hidden: true,
        component: () => import('@/views/demo/Access.vue'),
        meta: {
          title: 'access',
          roles: ['admin'],
          button: {
            'btn:access:createUser': 'hidden',
            'btn:access:editUser': 'disabled'
          },
        },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        meta: {
          title: 'dashboard',
        },
        component: () => import('@/views/dashboard'),
      },
    ],
  }
]

const permisssion = {
  // namespaced: true, -> store.dispatch('permisssion/generateRoutes', 'admin');
  state: {
    //静态路由+动态路由
    routes: [],
    //动态路由
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export default permisssion

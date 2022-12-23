import routes from '@/router'

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
    path: '/dashboard',
    name: '主页',
    menuName: '主页',
    meta: {
      sidebar: true,
      title: 'dashboard',
    },
    component: () => import('@/views/dashboard'),
  },
  {
    path: '/demo',
    name: 'demo',
    menuName: 'demo',
    meta: {
      sidebar: true,
      title: 'demo',
    },
    component: () => import('@/views/demo/index.vue'),
    children: [
      {
        path: 'access',
        menuName: 'access',
        component: () => import('@/views/demo/Access/index.vue'),
        meta: {
          sidebar: true,
          roles: ['admin'],
          button: {
            'btn:access:createUser': 'hidden',
            'btn:access:editUser': 'disabled'
          },
        },
      },
    ],
  },
  {
    path: '/task',
    name: '案例',
    menuName: '案例',
    redirect: 'dashboard',
    meta: {
      sidebar: true,
      title: '首页',
      //纯前端去做动态路由
      roles: ['admin']
    },
    component: () => import('@/views/task/index.vue'),
    children: [
      {
        path: 'PickupTask',
        name: '物流智能管控应用',
        menuName: '物流智能管控应用',
        meta: {
          sidebar: true,
          title: 'PickupTask',
        },
        component: () => import('@/views/task/Sd/index.vue'),
      },
    ],
  }
]

const permission = {
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
      state.routes = state.routes.concat(routes)
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

export default permission

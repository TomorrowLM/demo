import routes from '@/router'
import { userInfo } from '@/api/index';
import store from '..';


/**
 * 递归动态路由
 * @param routes 前端动态路由
 * @param permissionRoutes 后端权限路由
 * @param role 角色
 */
export function filterAsyncRoutes(asyncRoutes, permissionRoutes, role) {
  // console.log(asyncRoutes, permissionRoutes, role);
  asyncRoutes.forEach((element, index) => {
    // console.log(element);
    if (permissionRoutes[index]?.meta) {
      //默认没有roles或者包含role时拼接meta
      console.log(123, permissionRoutes[index], permissionRoutes[index]?.meta?.roles && permissionRoutes[index]?.meta?.roles.includes(role), role);
      if (permissionRoutes[index]?.meta?.roles && permissionRoutes[index]?.meta?.roles.includes(role)) {
        element.meta = { ...element.meta, ...permissionRoutes[index]?.meta }
      } else {
        console.log(994, asyncRoutes[index]);
        asyncRoutes.splice(index, 1)
      }
    }
    if (element.children && permissionRoutes[index]) {
      filterAsyncRoutes(element.children, permissionRoutes[index].children, role)
    }
  });
  console.log(asyncRoutes);
  return asyncRoutes
}

export const asyncRoutes = [
  {
    path: '/',
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
        name: '权限',
        menuName: '权限',
        component: () => import('@/views/demo/Access/index.vue'),
        meta: {
          sidebar: true,
          title: 'access',
        },
      },
      {
        path: 'skin',
        name: '皮肤',
        menuName: '皮肤',
        component: () => import('@/views/demo/Skin/index.vue'),
        meta: {
          sidebar: true,
          title: '皮肤',
        },
      },
    ],
  },
  {
    path: '/task',
    name: '案例',
    menuName: '案例',
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
    //静态路由
    commonMenu: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { sidebar: false },
      },
    ],
    //动态路由
    asyncRoutes: [],
    //静态路由+动态路由
    routes: [],
    //动态路由注册状态，账号切换，路由需要更新
    registerRouteFresh: true
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      console.log('SET_ROUTES：', routes);
      state.routes = routes
    },
    SET_PERMISSION: (state, data) => {
      state[data.type] = data.data
    }
  },
  actions: {
    async generateRoutes({ commit, state }, roles) {
      let permissionRoutes = []
      let role = ''
      await userInfo()
        .then(res => {
          console.log(res.data);
          commit('change_role', {
            role: res.data.role,
          });
          permissionRoutes = res.data.routes
          role = res.data.role
        })
      return new Promise(resolve => {
        let accessedRoutes = filterAsyncRoutes(asyncRoutes, permissionRoutes, role)   
        //设置静态路由+动态路由
        commit('SET_ROUTES', [...accessedRoutes, ...state.commonMenu, {
          path: '*',
          name: 'NotFound',
          component: () => import('@/views/common/404.vue'),
          meta: { sidebar: false },
        }])
        resolve(accessedRoutes)
      })
    }
  }
}

export default permission

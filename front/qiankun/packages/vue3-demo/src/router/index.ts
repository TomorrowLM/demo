import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const isProd = process.env.NODE_ENV === 'production'
// 运行在 qiankun 中时使用微应用的基座路径，否则按单体应用/开发环境配置
const isQiankun = !!(qiankunWindow as any)?.__POWERED_BY_QIANKUN__
console.log(isQiankun, 'isQiankun');
// 运行在 qiankun 中时使用微应用的基座路径，否则按单体应用/开发环境配置
const base =
  isQiankun
    ? '/qiankun/vue3/'
    : isProd
      ? '/vue3/'
      : import.meta.env.BASE_URL

// const base = isQiankun ? '/qiankun/vue3' : isProd ? '/vue3/' : import.meta.env.BASE_URL
export const history = createWebHistory(base)

export const routes = [
  {
    path: '/',
    name: 'home',
    //重定向
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/qiankun-vue3-page',
    name: 'qiankun-vue3-page',
    component: () => import('../views/qiankun/index.vue')
  },
  {
    path: '/vue-grammar',
    name: 'vue-grammar',
    component: () => import('../views/vue-grammar/index.vue')
  },
  {
    path: '/3D',
    name: '3D',
    component: () => import('../views/3D/index.vue'),
    redirect: { name: 'moon' },
    children: [
      {
        path: 'canvas/moon',
        name: 'moon',
        component: () => import('../views/3D/canvas/01-moon.vue')
      },
      {
        path: 'canvas/screenshot',
        name: 'screenshot',
        component: () => import('../views/3D/canvas/02-screenshot.vue')
      },
      {
        path: 'webgl/basic',
        name: 'one',
        component: () => import('../views/3D/webgl/01-one.vue')
      },
      {
        path: 'webgl/attribute',
        name: 'attribute',
        component: () => import('../views/3D/webgl/02-attribute.vue')
      },
      {
        path: 'webgl/uniform',
        name: 'uniform',
        component: () => import('../views/3D/webgl/03-uniform.vue')
      },
      {
        path: 'three/camera',
        name: 'camera',
        component: () => import('../views/3D/three/00-camera.vue')
      },
      {
        path: 'three/axis',
        name: '坐标轴-01',
        component: () => import('../views/3D/three/01-axis.vue')
      },
      {
        path: 'three/helper',
        name: '坐标轴+OrbitControls+gui',
        component: () => import('../views/3D/three/01-helper.vue')
      },
      {
        path: 'three/cube',
        name: 'cube',
        component: () => import('../views/3D/three/02-geometry-cube.vue')
      },
      {
        path: 'three/buffer',
        name: 'buffer',
        component: () => import('../views/3D/three/02-geometry-buffer.vue')
      },
      {
        path: 'three/line',
        name: 'line',
        component: () => import('../views/3D/three/02-geometry-line.vue')
      },
      {
        path: 'three/text',
        name: 'text',
        component: () => import('../views/3D/three/02-geometry-text.vue')
      },
      {
        path: 'three/light',
        name: 'light',
        component: () => import('../views/3D/three/03-light-OrbitControls.vue')
      }, {
        path: 'three/group',
        name: 'group',
        component: () => import('../views/3D/three/04-group.vue')
      }, {
        path: 'three/texture',
        name: 'texture',
        component: () => import('../views/3D/three/05-texture.vue')
      }, {
        path: 'three/gltf',
        name: 'gltf',
        component: () => import('../views/3D/three/06-gltf.vue')
      },
      {
        path: 'three/demo/array',
        name: 'light+OrbitControls',
        component: () => import('../views/3D/three/demo/array.vue')
      },
      {
        path: 'three/demo/people',
        name: '',
        component: () => import('../views/3D/three/demo/people.vue')
      }
    ]
  },
  {
    path: '/editor',
    name: 'editor',
    component: () => import('../views/editor/index.vue')
  },
  {
    path: '/media',
    name: 'media',
    component: () => import('../views/media/index.vue')
  },
  // // qiankun 下如果基座/子应用路径有轻微差异，兜底到首页避免 RouterView 空白
  // {
  //   path: '/:pathMatch(.*)*',
  //   redirect: '/'
  // }
]

const router = createRouter({
  history,
  routes
})

export default router

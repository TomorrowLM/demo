import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
const isProd = process.env.NODE_ENV === 'production'
export const history = createWebHistory(
  qiankunWindow.__POWERED_BY_QIANKUN__
    ? '/qiankun/vue3' //配置子应用的路由根路径
    : isProd
      ? '/vue3/' //单一项目下的访问路径
      : process.env.BASE_URL
)

export const routes = [
  {
    path: '/',
    name: 'home',
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
  }
]

const router = createRouter({
  history,
  routes
})

export default router

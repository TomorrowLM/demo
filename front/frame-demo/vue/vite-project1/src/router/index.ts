import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/index.vue')
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
          path: 'three/坐标轴',
          name: '坐标轴',
          component: () => import('../views/3D/three/01-zhuobiaozhou.vue')
        },
        {
          path: 'three/cube',
          name: 'cube',
          component: () => import('../views/3D/three/02-cube.vue')
        }
      ]
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('../views/editor/index.vue')
    }
  ]
})

export default router
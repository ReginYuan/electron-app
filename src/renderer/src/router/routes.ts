export const routes = [
  {
    path: '/',
    name: '首页',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: '关于我们',
    component: () => import('../views/About.vue')
  },
  {
    path: '/list',
    component: () => import('../views/List.vue')
  }
]
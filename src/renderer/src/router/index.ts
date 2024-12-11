import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes'
import { beforeEach, afterEach } from './guards'
const router = createRouter({
  history: createWebHashHistory(), //hash模式
  routes
})

// 全局前置导航守卫
router.beforeEach(beforeEach)

// 全局后置导航守卫
router.afterEach(afterEach)

export default router

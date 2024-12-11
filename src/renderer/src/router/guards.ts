// 全局前置导航守卫
export const beforeEach = () => {
  console.log('前置守卫')
  return true
}

//全局后置导航守卫
export const afterEach = () => {
  console.log('后置守卫')
  return true
}

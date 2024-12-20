import { defineStore } from 'pinia'
// 用户信息
import { useUserStore } from './useUserStore'
export const useStore = defineStore('storeId', {
  state: () => {
    return {
      user: useUserStore() //用户
    }
  },
  getters: {},
  actions: {}
})

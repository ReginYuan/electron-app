import { defineStore } from "pinia";

export const useUserStore = defineStore('userId',{
  state: () => {
    return {
      userName: '张三',
      token: '原始值'
    }
  },
  getters: {},
  actions: {}
})

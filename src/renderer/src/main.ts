import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'
const app = createApp(App)
const pinia = createPinia()
// 持久化存储
pinia.use(piniaPluginPersist)
app.use(router)
app.use(pinia)
app.mount('#app')

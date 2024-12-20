<template>
<div class="home">
    <h2>home page</h2>
    <button @click="btn">按钮</button>
    <button @click="goList">跳转</button>
    <button @click="msg">消息提醒</button>
    <button @click="downLoad">下载任务</button>
    <el-button type="primary">登录</el-button>
    {{ store.user.userName }}
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from '@store/index'
const router = useRouter()
const store = useStore()

const btn = () => {
  store.user.userName = '李四'
  console.log('userName', store.user.userName)
}

const goList = () =>{
  router.push('/list')
}

const msg = () => {
  electron.ipcRenderer.invoke('webMsg', { name: '打开新窗口' })
}

const downLoad = () => {
  electron.ipcRenderer.invoke('webMsg', { name: '下载' })
}
</script>

<style>
.home {
  -webkit-app-region: no-drag;
}
</style>

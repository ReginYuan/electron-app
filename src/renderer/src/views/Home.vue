<template>
<div class="home">
    <h2>home page</h2>
    <button @click="btn">按钮</button>
    <button @click="msg">消息提醒</button>
    <button @click="downLoad">下载任务</button>
</div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from '@store/index'
const router = useRouter()
const use = useStore()

const btn = () => {
  router.push('/list')
  console.log('num', use.$state.num)
}

const msg = () => {
  electron.ipcRenderer.invoke('webMsg', {name:'打开新窗口'})
}

const downLoad = () => {
  electron.ipcRenderer.invoke('webMsg', {name:'下载'})
}

</script>

<style>
.home {
  -webkit-app-region: no-drag;
}
</style>

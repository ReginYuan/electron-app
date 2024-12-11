<template>
    <div>
        about page
        <div @click="back">返回</div>
    </div>
    </template>
    
    <script setup lang="ts">
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const back = () =>{
        router.back()
    }
    </script>
    
    <style scoped>
    
    </style>
    
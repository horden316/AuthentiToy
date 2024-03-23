<template>
  <header>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item>
        <router-link to="/" class="router-link">home</router-link>
      </el-menu-item>
      <el-menu-item>
        <router-link to="/vertify" class="router-link">verify</router-link>
      </el-menu-item>
    </el-menu>
  </header>

  <br />
  <RouterView />
</template>

<style>
/* 去除 router-link 的下划线 */
.el-menu-item a.router-link {
  text-decoration: none;
}
</style>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

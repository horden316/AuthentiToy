<style>
  /* 去除 router-link 的下划线 */
  .el-menu-item a.router-link {
    text-decoration: none;
  }
</style>
<template>
  <header>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item>stock</el-menu-item>
      <el-menu-item>
        <router-link to="/v" class="router-link">verify</router-link>
      </el-menu-item>

    </el-menu>
  </header>

  <br />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <el-menu class="el-menu-demo" mode="horizontal">
      <el-menu-item>stock</el-menu-item>
      <el-menu-item>vertify</el-menu-item>
    </el-menu>
  </header>

  <br />
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

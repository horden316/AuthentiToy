<template>
  <div>
    <el-card style="max-width: 480px">
      <template #header>
        <div class="card-header">
          <span>item name</span>
        </div>
      </template>
      <p v-for="o in 4" :key="o" class="text item">{{ 'List item ' + o }}</p>
      <template #footer>
        <el-button plain>Plain</el-button>
      </template>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
// import { reactive } from 'vue'

// const form = reactive({
//   name: '',
//   region: '',
//   date1: '',
//   date2: '',
//   delivery: false,
//   type: [],
//   resource: '',
//   desc: '',
//   number: 0
// })

// const onSubmit = () => {
//   console.log('submit!')
// }
</script>

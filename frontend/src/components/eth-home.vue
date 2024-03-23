<template>
  <el-row :gutter="300">
    <el-col v-for="item in items" :key="item.id" :span="4">
      <el-card style="width: 300px">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
          </div>
        </template>
        <img :src="item.image" alt="Image Description" style="width: 100%; height: 100%" @click="showToyInfo = true" />
        <template #footer>
          <div class="card-footer">
            <el-button plain @click="dialogFormVisible = true">Buy It</el-button>
          </div>
        </template>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog v-model="dialogFormVisible" title="Warning" width="500">
    <div>
      <p>Are you sure you want to buy this toy?</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <router-link to="/confirm">
          <el-button type="primary">Confirm</el-button>
        </router-link>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="showToyInfo" title="Toy Information" width="500">
    <div>
      <img :src="toy1" alt="toy1" />
      <p>Toy1</p>
      <p>price</p>
      <p>description</p>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="showToyInfo = false">Cancel</el-button>
        <el-button type="primary" @click="showToyInfo = false"> Confirm </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import toy1 from '@/assets/image/toy1.jpg'
import toy2 from '@/assets/image/toy2.jpg'
import toy3 from '@/assets/image/toy3.jpg'
import toy4 from '@/assets/image/toy4.jpg'
import toy5 from '@/assets/image/toy5.jpg'

const dialogFormVisible = ref(false)
const showToyInfo = ref(false)

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

const items = [
  {
    id: 1,
    name: 'Item 1',
    image: toy1
  },
  {
    id: 2,
    name: 'Item 2',
    image: toy2
  },
  {
    id: 3,
    name: 'Item 3',
    image: toy3
  },
  {
    id: 4,
    name: 'Item 4',
    image: toy4
  },
  {
    id: 5,
    name: 'Item 5',
    image: toy5
  }
  // Add more items as needed
]
</script>

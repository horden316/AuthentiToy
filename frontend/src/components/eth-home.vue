<template>
  <el-row :gutter="300">
    <el-col v-for="item in items" :key="item.id" :span="4">
      <el-card style="width: 300px">
        <template #header>
          <div class="card-header">
            <span>{{ item.name }}</span>
          </div>
        </template>
        <img :src="item.image" alt="Image Description" style="width: 100% height: 100%" @click="showToyInfo = true" />
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
  <el-button @click="test">Start receiving messages</el-button>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
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

import Web3 from 'web3'

onMounted(async () => {
  const web3 = new Web3('https://eth.llamarpc.com')
  const key = await web3.eth.ens.getPubkey('xyz.eth')
  console.log(key)
})
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
let serialPort

async function test() {
  if (navigator.serial) {
    console.log('Web Serial API supported')
  } else {
    console.error('Web Serial API is not supported in this browser')
    return
  }

  try {
    serialPort = await navigator.serial.requestPort()
    await serialPort.open({ baudRate: 9600 })
    startReceivingMessages(serialPort)
  } catch (err) {
    console.error('Error:', err)
  }
}

let receivedData = ''

async function startReceivingMessages(serialPort) {
  try {
    while (serialPort.readable) {
      const reader = serialPort.readable.getReader()
      try {
        let fullText = '' // 用來存放所有接收到的文字
        while (true) {
          const { value, done } = await reader.read()
          if (done) {
            break
          }

          const text = new TextDecoder().decode(value)
          fullText += text
          console.log(fullText)

          // 檢查是否符合條件，如果符合則跳出迴圈
          if (fullText.includes('block3:') && fullText.length >= fullText.indexOf('block3:') + 22) {
            break
          }
        }

        // 從完整文字中提取出符合特定格式的部分，並組合成一段完整的訊息
        const blocks = fullText.match(/block\d+:[^\s]+/g)
        if (blocks) {
          const combinedMessage = blocks.map(block => block.split(':')[1]).join('')
          receivedData = combinedMessage // 將組合後的訊息存入 receivedData 變數
          console.log(receivedData)
          // messageContainer.innerText = receivedData // 顯示在畫面上
        }
      } finally {
        reader.releaseLock()
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
</script>

<template>
  <div class="container">
    <el-card style="max-width: 480px">
      <template #header>
        <h2 class="header-title ">Verify our Toy</h2>
      </template>
      <div class="input-container">
        <label for="idNumber" >Your toy key:</label>
        <input type="text" id="idNumber" v-model="idNumber" class="input-field">
        <el-button color="#7D7DFF"  @click="verify" class="verify-button  ">Verify</el-button>
      </div>
    </el-card>
  </div>
</template>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 修改这里，使容器垂直居上 */
  height: 100vh;
  margin-top: 20px; /* 调整容器距离顶部的间距 */
}

.header-title {
  font-size: 1.5rem;
  margin: 0;
}

.input-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.input-container label {
  margin-right: 10px;
  font-weight: bold;
}

.input-field {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.verify-button {
  margin-left: 10px;
  border-radius: 4px;
  font-weight: bold;
}
</style>

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

async function verify() {
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

<template>
  <div class="container">
    <el-card style="max-width: 480px">
      <template #header>
        <h2 class="header-title ">Verify our Toy</h2>
      </template>
      <div class="input-container">
        <label for="inputKey" >Your toy key:</label>
        <input type="text" id="inputKey" v-model="inputKey" class="input-field">
        <el-button color="#7D7DFF"  @click="verify" class="verify-button  ">Verify</el-button>
      </div>
    </el-card>
    <el-dialog v-model="dialogErrorVisible" title="Warning" width="500">
      <p style="color: red;">Fake Toy</p>
      <div slot="footer">
        <el-button type="primary" @click="dialogErrorVisible = false">Close</el-button>
      </div>
    </el-dialog>
    <el-dialog v-model="dialogCorrectVisible" title="Toy Name" width="500">
    <div>
      <input type="text" id="inputName" v-model="inputName" class="input-field">
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogCorrectVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogCorrectVisible = false"> submit </el-button>
      </div>
    </template>
  </el-dialog>
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
import { ElDialog  } from 'element-plus'
const dialogErrorVisible = ref(false)
const dialogCorrectVisible = ref(false)
const showToyInfo = ref(false)
const inputKey = ref<string>('');
const inputName = ref<string>('');
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
onMounted(() => {
  const web3 = new Web3('https://eth.llamarpc.com')
  const publicKey = web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709')
  console.log(publicKey)
})
// Passing in the eth or web3 package is necessary to allow retrieving chainId, gasPrice and nonce automatically
// for accounts.signTransaction().
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
          if (fullText.includes('block3:') && fullText.length >= fullText.indexOf('block3:') + 23) {
            break
          }
        }

        // 從完整文字中提取出符合特定格式的部分，並組合成一段完整的訊息
        const blocks = fullText.match(/block\d+:[^\s]+/g)
        if (blocks) {
          const web3 = new Web3('https://eth.llamarpc.com')
          const combinedMessage = blocks.map(block => block.split(':')[1]).join('')
          const privatekey = "0x" + combinedMessage
          const publicKey = web3.eth.accounts.privateKeyToAccount(privatekey)
          console.log(publicKey.address)
          if (inputKey.value !== publicKey.address) {
            dialogErrorVisible.value = true
          }
          if (inputKey.value === publicKey.address) {
            dialogCorrectVisible.value = true
          }
          // messageContainer.innerText = receivedData // 顯示在畫面上&& inputKey.value.length==publicKey.length
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

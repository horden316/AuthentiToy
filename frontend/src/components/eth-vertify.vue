<template>
  <div class="container">
    <el-card style="max-width: 480px">
      <template #header>
        <h2 class="header-title">Verify our Toy</h2>
      </template>
      <div class="input-container">
        <label for="inputKey">Your toy key:</label>
        <input id="inputKey" v-model="inputKey" type="text" class="input-field" />
        <el-button color="#7D7DFF" class="verify-button" @click="verify">Verify</el-button>
      </div>
    </el-card>
    <el-dialog v-model="dialogErrorVisible" title="Warning" width="500">
      <p style="color: red">Fake Toy</p>
      <template #footer>
        <div>
          <el-button type="primary" @click="dialogErrorVisible = false">Close</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogCorrectVisible" title="Toy Name" width="500">
      <div>
        <label for="inputName">Your toy Name:</label>
        <input id="inputName" v-model="inputName" type="text" class="input-field" />
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
import { ElDialog } from 'element-plus'
const dialogErrorVisible = ref(false)
const dialogCorrectVisible = ref(false)
const inputKey = ref<string>('')
const inputName = ref<string>('')

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

// onMounted(() => {
//   const web3 = new Web3('https://eth.llamarpc.com')
//   const publicKey = web3.eth.accounts.privateKeyToAccount(
//     '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
//   )
//   console.log(publicKey)
// })
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

const receivedData = ''

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
          const privatekey = '0x' + combinedMessage
          const publicKey = web3.eth.accounts.privateKeyToAccount(privatekey)
          console.log(publicKey.address, inputKey.value)
          if (inputKey.value !== publicKey.address) {
            dialogErrorVisible.value = true
            console.log('different key')
            return
          }

          // messageContainer.innerText = receivedData // 顯示在畫面上&& inputKey.value.length==publicKey.length
          if ((await getTokenID(publicKey.address)) >= 1) {
            dialogCorrectVisible.value = true
          } else {
            dialogErrorVisible.value = true
            console.log('different key 2')
          }
        }
      } finally {
        reader.releaseLock()
      }
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

const getTokenID = async (address: string): Promise<number> => {
  const web3 = new Web3('https://optimism-sepolia.infura.io/v3/aea79c382e204cf487e173b3df285ccc')

  const contractAddress = '0xaAB651fCf230eb0c06f30283145DD83876990B2c'
  // contract obje
  let returnValue = 0
  try {
    const abi = JSON.parse(jsonstring)
    console.log(abi)
    const contract = new web3.eth.Contract(abi, contractAddress)
    contract.handleRevert = true
    await contract.methods.getTokenID(address)
      .call()
      .then(ID => {
        console.log(`User's TokenID: ${ID}`)
        returnValue = Number(ID)
  
      })
      .catch(error => {
        console.error('Error calling balanceOf function:', error)
      })
    console.log()
  } catch (error) {
    console.error('Error reading JSON file:', error)
  }
  // Add your code her
  console.log(returnValue)
  return returnValue
}

onMounted(async () => {
  console.log(await getTokenID('0x3A3487a2c88235f528D191B9bf8dA761CF2f4aBa'))
})

const jsonstring = `[
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721IncorrectOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721InsufficientApproval",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "approver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidApprover",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOperator",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "receiver",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidReceiver",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        }
      ],
      "name": "ERC721InvalidSender",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ERC721NonexistentToken",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "OwnableInvalidOwner",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "OwnableUnauthorizedAccount",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "approved",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "ApprovalForAll",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getApproved",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "getTokenID",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "getToyInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "_type",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "ownerName",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "toyName",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        }
      ],
      "name": "isApprovedForAll",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_type",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "toyName",
          "type": "string"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "ownerOf",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "data",
          "type": "bytes"
        }
      ],
      "name": "safeTransferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "operator",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "approved",
          "type": "bool"
        }
      ],
      "name": "setApprovalForAll",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "ownerName",
          "type": "string"
        }
      ],
      "name": "setOwnerName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "toyName",
          "type": "string"
        }
      ],
      "name": "setToyName",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes4",
          "name": "interfaceId",
          "type": "bytes4"
        }
      ],
      "name": "supportsInterface",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "tokenURI",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
  `
</script>

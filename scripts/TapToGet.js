const startButton = document.getElementById('startButton');
const messageContainer = document.getElementById('messageContainer');
let serialPort;

startButton.addEventListener('click', async () => {
  if (navigator.serial) {
    console.log('Web Serial API supported');
  } else {
    console.error('Web Serial API is not supported in this browser');
    return;
  }

  try {
    serialPort = await navigator.serial.requestPort();
    await serialPort.open({ baudRate: 9600 });
    startReceivingMessages(messageContainer, serialPort);
  } catch (err) {
    console.error('Error:', err);
  }
});

let receivedData = '';

async function startReceivingMessages(messageContainer, serialPort) {
  try {
    while (serialPort.readable) {
      const reader = serialPort.readable.getReader();
      try {
        let fullText = ''; // 用來存放所有接收到的文字
        while (true) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }

          const text = new TextDecoder().decode(value);
          fullText += text;
          console.log(fullText);

          // 檢查是否符合條件，如果符合則跳出迴圈
          if (fullText.includes('block3:') && fullText.length >= 15) {
            break;
          }
        }

        // 從完整文字中提取出符合特定格式的部分，並組合成一段完整的訊息
        const blocks = fullText.match(/block\d+:[^\s]+/g);
        if (blocks) {
          const combinedMessage = blocks.map(block => block.split(':')[1]).join('');
          receivedData = combinedMessage; // 將組合後的訊息存入 receivedData 變數
          messageContainer.innerText = receivedData; // 顯示在畫面上
        }
      } finally {
        reader.releaseLock();
      }
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

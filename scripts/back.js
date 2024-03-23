const express = require('express');
const { spawn } = require('child_process');
const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/', (req, res) => {
  const { type, method } = req.body;
  console.log(req.body);
  
  if (type && method === 'mint') {
    const scriptPath = "./genWallet.js"; // 替換為你要執行的另一個 script 的路徑
    const script = spawn('node', [scriptPath]);

    script.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    script.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    script.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });

    res.send('Script execution initiated');
  } else {
    res.status(400).send('Bad request');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

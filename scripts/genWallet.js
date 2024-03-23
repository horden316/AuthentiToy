const {Web3} = require("web3");
const fs = require("fs");

const web3 = new Web3("https://eth-goerli.blockscout.com");
// const web3 = new Web3("HTTP://127.0.0.1:7545");


// generate wallet
function generateWallet() {
  const account = web3.eth.accounts.create();
  return account
}
var output = generateWallet();
fs.writeFileSync("acc.txt", JSON.stringify(output));


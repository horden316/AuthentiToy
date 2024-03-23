const {Web3} = require("web3");
const fs = require("fs");
const interact = require("./interact.js")

const web3 = new Web3("https://optimism-sepolia.infura.io/v3/aea79c382e204cf487e173b3df285ccc");
// const web3 = new Web3("HTTP://127.0.0.1:7545");

// TESTDATA
const _type = "John";
// const _to = "0x8A23c3a07D1c1b100E5C2b24044FCE6913347838";
const _toyName = 'test';

// generate wallet
function generateWallet() {
  const account = web3.eth.accounts.create();
  return account
}
const output = generateWallet();
fs.writeFileSync("acc.txt", JSON.stringify(output));

const _toAddr = output.address; 

interact.initContract();
interact.contractMethod(_type, _toAddr, _toyName);


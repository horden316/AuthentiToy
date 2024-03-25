const {Web3} = require("web3");
const fs = require("fs");
const interact = require("./interact.js");
const { constants } = require("buffer");

const web3 = new Web3("https://optimism-sepolia.infura.io/v3/aea79c382e204cf487e173b3df285ccc");
// const web3 = new Web3("HTTP://127.0.0.1:7545");


// generate wallet
function generateWallet() {
  const _type = process.argv[2];
  const _toyName = "test";
  const account = web3.eth.accounts.create();
  fs.writeFileSync("acc.txt", JSON.stringify(account));
  const _toAddr = account.address;
  const pubKey = web3.eth.accounts.privateKeyToPublicKey(account.privateKey);

  interact.initContract();
  interact.contractMethod(_type, _toAddr, _toyName);
  return pubKey;
}

const pubKey = generateWallet();

process.stdout.write(pubKey);
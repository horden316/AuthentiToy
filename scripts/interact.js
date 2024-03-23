const { Web3 } = require("web3");
const fs = require("fs");
let account, contract;

const web3 = new Web3("https://optimism-sepolia.infura.io/v3/1d84243ed4c346b29061392eaaef7917");
// const web3 = new Web3("HTTP://127.0.0.1:7545");

function initContract(){
  // smartcontract interact
  const contractAddress = "0xaAB651fCf230eb0c06f30283145DD83876990B2c";
  // pkey
  const privateKeyPath = "./pkey.txt";
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  account = web3.eth.accounts.privateKeyToAccount(privateKey);
  // Read the contract address, ABI
  const abi = require("./ContractAbi.json");
  // contract object
  contract = new web3.eth.Contract(abi, contractAddress);
  contract.handleRevert = true;
}


// contract methods
async function contractMethod(_type, _to, _toyName) {
  contract.methods
    .mint(_type, _to, _toyName)
    .send({
      from: account.address,
      gas: 1000000,
      gasPrice: "20 gwei",
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
}

// initContract();
// contractMethod(_type, _to, _toyName);
module.exports = { initContract, contractMethod}; 

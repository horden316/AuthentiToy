const { Web3 } = require("web3");
const fs = require("fs");


//TEST DATA

const _type = "John";
const _to = "0x8A23c3a07D1c1b100E5C2b24044FCE6913347838";
const _toyName = 'test';

const web3 = new Web3("https://goerli.optimism.io");
// const web3 = new Web3("HTTP://127.0.0.1:7545");

// smartcontract interact
const contractAddress = "0xaAB651fCf230eb0c06f30283145DD83876990B2c";

// pkey
const privateKeyPath = "./pkey.txt";
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
// Read the contract address, ABI
const abi = require("./ContractAbi.json");
// contract object
const contract = new web3.eth.Contract(abi, contractAddress);
contract.handleRevert = true;

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

contractMethod(_type, _to, _toyName);

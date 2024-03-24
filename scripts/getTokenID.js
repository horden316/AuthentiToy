const { Web3 } = require("web3");
const fs = require("fs");
const { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require("web3");
let account, contract, contractAddress;

const web3 = new Web3("https://optimism-sepolia.infura.io/v3/aea79c382e204cf487e173b3df285ccc");
// const web3 = new Web3("HTTP://127.0.0.1:7545");

function initContract() {
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

async function getTokenID(_address) {
    contract.methods.getTokenID(_address).call()
    .then(ID => {
        console.log(`User's TokenID: ${ID}`);
        return ID;
    })
    .catch(error => {
        console.error('Error calling balanceOf function:', error);
    });
    
}

// initContract();
// contractMethod(_type, _to, _toyName);
module.exports = { initContract, getTokenID };
const { Web3 } = require("web3");
const fs = require("fs");
const { ETH_DATA_FORMAT, DEFAULT_RETURN_FORMAT } = require("web3");
let account, contract;

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

// contract methods
// async function contractMethod(_type, _to, _toyName) {
//   contract.methods
//     .mint(_type, _to, _toyName)
//     .send({
//       from: account.address,
//       gas: 1000000,
//       gasPrice: "20 gwei",
//     })
//     .then((result) => {
//       console.log(result);
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// }


async function contractMethod(_type, _toAddr, _toyName) {
  // get gas limit
  await web3.eth
    .estimateGas(
      {
        from: account.address,
        to: _toAddr,
        value: web3.utils.toWei("0.0001", "ether"),
      },
      "latest",
      ETH_DATA_FORMAT,
    )
    .then((value) => {
      limit = value;
    });
  // tx
  const tx = {
    from: account.address,
    to: _toAddr,
    value: web3.utils.toWei("0.0001", "ether"),
    gas: limit,
    nonce: await web3.eth.getTransactionCount(account.address),
    maxPriorityFeePerGas: web3.utils.toWei("3", "gwei"),
    maxFeePerGas: web3.utils.toWei("3", "gwei"),
    chainId: 11155420,
    type: 0x2,
  };
  signedTx = await web3.eth.accounts.signTransaction(tx, account.privateKey);
  console.log("Raw transaction data: " + signedTx.rawTransaction);
  // Sending the transaction to the network
  const receipt = await web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .once("transactionHash", (txhash) => {
      console.log(`Mining transaction ...`);
      // console.log(`https://${network}.etherscan.io/tx/${txhash}`);
    });
  // The transaction is now on chain!
  console.log(`Mined in block ${receipt.blockNumber}`);
}

// initContract();
// contractMethod(_type, _to, _toyName);
module.exports = { initContract, contractMethod };

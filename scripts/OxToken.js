// ===========================================================================
// functions used by other scripts
// ===========================================================================

const fs = require('fs');
const Web3 = require('web3');

var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

exports.getWeb3 = function() { return web3; }

exports.getABI = function(pathtojson) {
  var contents = fs.readFileSync(pathtojson).toString();
  abiObj = JSON.parse(contents)["abi"];
  return web3.eth.contract(abiObj);
}

exports.getContract = function(pathtojson,sca) {
  return exports.getABI(pathtojson).at(sca);
}

exports.getBinary = function(pathtojson) {
  var contents = fs.readFileSync(pathtojson).toString();
  return JSON.parse(contents)["unlinked_binary"];
}

exports.getCoinbase = function() {
  return web3.eth.accounts[0];
}

exports.getGasPrice = function() {
  return web3.eth.gasPrice;
}

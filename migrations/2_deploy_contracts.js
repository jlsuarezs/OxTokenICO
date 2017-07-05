var OxToken = artifacts.require("./OxToken.sol");
// var OxTokenMock = artifacts.require("./test/OxTokenMock.sol");
var SafeMath = artifacts.require("../installed_contracts/zeppelin/contracts/SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, OxToken);
  deployer.deploy(OxToken);
  //Just for testing - comment out for real deployment
  // deployer.deploy(OxTokenMock);
};

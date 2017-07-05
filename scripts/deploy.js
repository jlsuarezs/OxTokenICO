// ===========================================================================
//
// $ node deploy.js <path-to-json>
//
// deploy contract from unlinked_binary found in JSON
//
// NOTES:
//   > admin.startRPC("127.0.0.1", 8545, "*", "web3,db,net,eth")
//
//   > web3.personal.unlockAccount(web3.personal.listAccounts[0],
//                                 "password",
//                                 15000)
//
// ===========================================================================

var OxData = require('./OxToken');

var OxTokenABI = OxData.getABI( process.argv[2] );
var OxTokenBinary = OxData.getBinary( process.argv[2] );

var OxToken = OxTokenABI.new( {from: OxData.getCoinbase(), data: OxTokenBinary, gas:  1900000}, function(err,instance){
  if (err) console.log( "Error: ", err );

  if (!err && instance.address) console.log( "Contract Address: ", instance.address );
});

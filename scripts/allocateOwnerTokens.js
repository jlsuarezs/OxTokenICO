// ===========================================================================
//
// $ node allocateOwnerTokens.js <path-to-json> <contract_address>
//
// allocate team & bounty tokens. can only be run when sale completes
//
// ===========================================================================

var OxData = require('./OxToken');

var OxToken = OxData.getContract( process.argv[2], process.argv[3] );

OxToken.allocateOwnerTokens({from: OxData.getCoinbase(), gas:  800000}, function(err,instance) {
  if (err) {
    console.log( "Error: ", err );
  } else {
    console.log( "Team and bounty tokens allocated");
  }
});

//testrpc --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e1c, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e11, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e12, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e13, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e14, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e15, 1000000000000000000000000" --account="0xf84e9b54634b7a970ea64e11443b466758d33ae7ef3f9066b52457fc27a37e16, 1000000000000000000000000" -p 8547


const OxTokenMock = artifacts.require("./OxTokenMock.sol");

contract('OxToken', function (accounts) {

  console.log("Coinbase Account: ", accounts[0]);
  const ONEETHER  = 1000000000000000000;
  const MULTIPLIER = 10**3;
  const CORPORATE_SUPPLY = 200000000 * MULTIPLIER; //20%

  // =========================================================================
  it("0. initialize contract", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    console.log("Token Address: ", instance.address);

    var owner = await instance.owner();
    assert.equal(owner, accounts[0], "owner is set correctly");

    var totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), 0, "Initial totalSupply should be 0");

    //init
    await instance.initializeBalances();
    totalSupply = await instance.totalSupply();
    assert.equal(totalSupply.toNumber(), CORPORATE_SUPPLY, "Initial totalSupply should be CORPORATE_SUPPLY");

    var saleStartTime = await instance.saleStartTime();

    assert.equal(saleStartTime.toNumber(), 0, "saleStartTime should be 0");

    var accountBalance = await instance.balanceOf(owner);
    assert.equal(accountBalance.toNumber(), CORPORATE_SUPPLY, "CORPORATE_SUPPLY should be owners initial balance")

  });

});

const OxTokenMock = artifacts.require("./OxTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('OxToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;

  it("1. start and end sale", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    //Check sale hasn't started
    var canBuyTokens = await instance.canBuyTokens();
    assert.equal(canBuyTokens, false, "Sale should not have started");

    //Check that tokens can't be purchased before start
    await assertFail(async () => {
      await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER});
    })

    //Check that only owner can start contract
    await assertFail(async () => {
      await instance.startSale({from: accounts[1]});
    })

    await instance.setMockedNow(1);

    await instance.initializeBalances();

    await instance.startSale({from: accounts[0]});

    // //Check that sale can be started
    var saleStartTime = await instance.saleStartTime();
    assert.equal(saleStartTime.toNumber(), 1, "Sale should have started");

    canBuyTokens = await instance.canBuyTokens();
    assert.equal(canBuyTokens, true, "Sale should have started");

    await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER});

    await instance.setMockedNow(3456000);
    canBuyTokens = await instance.canBuyTokens();
    assert.equal(canBuyTokens, false, "Sale should now have completed");

    //Check that tokens can't be purchased after end
    await assertFail(async () => {
      await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER});
    })

  });

});

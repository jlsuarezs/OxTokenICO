const OxTokenMock = artifacts.require("./OxTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('OxToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const HALFETHER = 500000000000000000;
  const ETHERRATIO = ONEETHER / 10**3;
  const MULTIPLIER = 10**3;

  const ONEDAY = 86400;

  const ONEWEEK = 604800;

  it("5. check limits", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    await instance.setMockedNow(1);

    await instance.initializeBalances();

    await instance.startSale({from: accounts[0]});

    // < 1 day bonus

    await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER * 100000});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 3750 * MULTIPLIER * 100000, "Balance should be 375000000");

    await assertFail(async () => {
      await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER * 100000});
    })

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 3750 * MULTIPLIER * 100000, "Balance should be 375000000");


  });
});

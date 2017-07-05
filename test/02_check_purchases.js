const OxTokenMock = artifacts.require("./OxTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('OxToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const HALFETHER = 500000000000000000;
  const ETHERRATIO = ONEETHER / 10**3;
  const MULTIPLIER = 10**3;

  const ONEDAY = 86400;

  const ONEWEEK = 604800;

  it("2. checks amounts and bonuses", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    await instance.setMockedNow(1);

    await instance.initializeBalances();

    await instance.startSale({from: accounts[0]});

    // < 1 day bonus

    await instance.createTokens(accounts[1], {from: accounts[1], value: ONEETHER});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 3750 * MULTIPLIER, "Balance should be 3750");

    // < 1 week bonus

    await instance.setMockedNow(1 + ONEDAY);

    await instance.createTokens(accounts[2], {from: accounts[2], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[2]);

    assert.equal(accountBalance.toNumber(), 3600 * MULTIPLIER, "Balance should be 3600");

    // < 2 week bonus

    await instance.setMockedNow(1 + ONEWEEK);

    await instance.createTokens(accounts[3], {from: accounts[3], value: HALFETHER});

    accountBalance = await instance.balanceOf(accounts[3]);

    assert.equal(accountBalance.toNumber(), 1725 * MULTIPLIER, "Balance should be 1725");

    // < 3 week bonus

    await instance.setMockedNow(1 + 2 * ONEWEEK);

    await instance.createTokens(accounts[4], {from: accounts[4], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[4]);

    assert.equal(accountBalance.toNumber(), 3300 * MULTIPLIER, "Balance should be 3300");

    // < 4 week bonus

    await instance.setMockedNow(1 + 3 * ONEWEEK);

    await instance.createTokens(accounts[5], {from: accounts[5], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[5]);

    assert.equal(accountBalance.toNumber(), 3150 * MULTIPLIER, "Balance should be 3150");

    // no bonus

    await instance.setMockedNow(1 + 4 * ONEWEEK);

    await instance.createTokens(accounts[6], {from: accounts[6], value: ONEETHER});

    accountBalance = await instance.balanceOf(accounts[6]);

    assert.equal(accountBalance.toNumber(), 3000 * MULTIPLIER, "Balance should be 3000");

  });
});

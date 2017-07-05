const OxTokenMock = artifacts.require("./OxTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('OxToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const ETHERRATIO = ONEETHER / 10**3;
  const MULTIPLIER = 10**3;

  const ONEDAY = 86400;

  const ONEWEEK = 604800;

  it("3. check transfers", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    //fail before initial balances
    await assertFail(async () => {
      await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});
    })

    await instance.initializeBalances();

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    var accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 100 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-owner can't transfer funds
    await assertFail(async () => {
      await instance.transfer(accounts[2], 100 * MULTIPLIER, {from: accounts[1]});
    })

    //Start sale
    await instance.setMockedNow(1);

    await instance.startSale({from: accounts[0]});

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 200 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-owner can't transfer funds
    await assertFail(async () => {
      await instance.transfer(accounts[2], 100 * MULTIPLIER, {from: accounts[1]});
    })

    //Finish sale
    await instance.setMockedNow(3456000);

    //Check owner can transfer funds
    await instance.transfer(accounts[1], 100 * MULTIPLIER, {from: accounts[0]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 300 * MULTIPLIER, "100 tokens should be transferred");

    //Check non-owner can transfer funds
    await instance.transfer(accounts[2], 100 * MULTIPLIER, {from: accounts[1]});

    accountBalance = await instance.balanceOf(accounts[1]);

    assert.equal(accountBalance.toNumber(), 200 * MULTIPLIER, "100 tokens should be transferred");

    accountBalance = await instance.balanceOf(accounts[2]);

    assert.equal(accountBalance.toNumber(), 100 * MULTIPLIER, "100 tokens should be transferred");

  });
});

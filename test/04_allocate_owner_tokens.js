const OxTokenMock = artifacts.require("./OxTokenMock.sol");
const assertFail = require("./helpers/assertFail");

contract('OxToken', function (accounts) {

  const ONEETHER  = 1000000000000000000;
  const ETHERRATIO = ONEETHER / 10**3;
  const MULTIPLIER = 10**3;

  it("4. allocate owner tokens", async () => {

    var instance = await OxTokenMock.new({from: accounts[0]});

    //Check can't allocate before sale
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })

    await instance.setMockedNow(1);

    await instance.initializeBalances();

    await instance.startSale({from: accounts[0]});

    //Check can't allocate during sale
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })

    await instance.setMockedNow(3456000);

    //Check can allocate after sale
    await instance.allocateOwnerTokens({from: accounts[0]});

    var accountBalance = await instance.balanceOf(accounts[0]);

    assert.equal(accountBalance.toNumber(), 500000000 * MULTIPLIER, "owner account should have all allocations");

    //Check can't allocate twice
    await assertFail(async () => {
      await instance.allocateOwnerTokens({from: accounts[0]});
    })


  });

});

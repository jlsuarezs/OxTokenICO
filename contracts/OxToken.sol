//Start sale
//Chamnge ownership
//Init balances


pragma solidity ^0.4.11;

import '../installed_contracts/zeppelin/contracts/SafeMath.sol';
import '../installed_contracts/zeppelin/contracts/token/StandardToken.sol';
import '../installed_contracts/zeppelin/contracts/token/LimitedTransferToken.sol';
import '../installed_contracts/zeppelin/contracts/ownership/Ownable.sol';

contract OxToken is StandardToken, LimitedTransferToken, Ownable {
  using SafeMath for uint;

  event OxTokenInitialized(address _owner);
  event InitialTokensAllocated(uint _amount);
  event OwnerTokensAllocated(uint _amount);
  event SaleStarted(uint _saleStartime);

  string public name = "OxToken";
  string public symbol = "OX";

  uint public decimals = 3;
  uint public multiplier = 10**decimals;
  uint public etherRatio = SafeMath.div(1 ether, multiplier);

  uint public MAX_SUPPLY = SafeMath.mul(700000000, multiplier); //50% (public) + 20% (corporate)
  uint public CORPORATE_SUPPLY = SafeMath.mul(200000000, multiplier); //20%
  uint public BOUNTY_SUPPLY = SafeMath.mul(200000000, multiplier); //20%
  uint public TEAM_SUPPLY = SafeMath.mul(100000000, multiplier); //10%
  uint public PRICE = 3000; //1 Ether buys 3000 OX
  uint public MIN_PURCHASE = 10**17; // 0.1 Ether

  uint256 public saleStartTime = 0;
  bool public ownerTokensAllocated = false;
  bool public balancesInitialized = false;

  function OxToken() {
    OxTokenInitialized(msg.sender);
  }

  function initializeBalances() public {
    if (balancesInitialized) {
      throw;
    }
    balances[owner] = CORPORATE_SUPPLY;
    totalSupply = CORPORATE_SUPPLY;
    balancesInitialized = true;
    Transfer(0x0, owner, CORPORATE_SUPPLY);
    InitialTokensAllocated(CORPORATE_SUPPLY);
  }

  function canBuyTokens() constant public returns (bool) {
    //Sale runs for 31 days
    if (saleStartTime == 0) {
      return false;
    }
    if (getNow() > SafeMath.add(saleStartTime, 31 days)) {
      return false;
    }
    return true;
  }

  function transferableTokens(address holder, uint64 time) constant public returns (uint256) {
    //Owner can always transfer balance
    //If sale has completed, everyone can transfer full balance
    if (holder == owner) {
      return balanceOf(holder);
    }
    if ((saleStartTime == 0) || canBuyTokens()) {
      return 0;
    }
    return balanceOf(holder);
  }

  function startSale() onlyOwner {
    //Can only start once
    if (saleStartTime != 0) {
      throw;
    }
    saleStartTime = getNow();
    SaleStarted(saleStartTime);
  }

  function () payable {
    createTokens(msg.sender);
  }

  function createTokens(address recipient) payable {

    //Only allow purchases over the MIN_PURCHASE
    if (msg.value < MIN_PURCHASE) {
      throw;
    }

    //Reject if sale has completed
    if (!canBuyTokens()) {
      throw;
    }

    //Otherwise generate tokens
    uint tokens = msg.value.mul(PRICE);

    //Add on any bonus
    uint bonusPercentage = SafeMath.add(100, bonus());
    if (bonusPercentage != 100) {
      tokens = tokens.mul(percent(bonusPercentage)).div(percent(100));
    }

    tokens = tokens.div(etherRatio);

    totalSupply = totalSupply.add(tokens);

    //Don't allow totalSupply to be larger than MAX_SUPPLY
    if (totalSupply > MAX_SUPPLY) {
      throw;
    }

    balances[recipient] = balances[recipient].add(tokens);

    //Transfer Ether to owner
    owner.transfer(msg.value);

  }

  //Function to assign team & bounty tokens to owner
  function allocateOwnerTokens() public {

    //Can only be called once
    if (ownerTokensAllocated) {
      throw;
    }

    //Can only be called after sale has completed
    if ((saleStartTime == 0) || canBuyTokens()) {
      throw;
    }

    ownerTokensAllocated = true;

    uint amountToAllocate = SafeMath.add(BOUNTY_SUPPLY, TEAM_SUPPLY);
    balances[owner] = balances[owner].add(amountToAllocate);
    totalSupply = totalSupply.add(amountToAllocate);

    Transfer(0x0, owner, amountToAllocate);
    OwnerTokensAllocated(amountToAllocate);

  }

  function bonus() constant returns(uint) {

    uint elapsed = SafeMath.sub(getNow(), saleStartTime);

    if (elapsed < 1 days) return 25;
    if (elapsed < 1 weeks) return 20;
    if (elapsed < 2 weeks) return 15;
    if (elapsed < 3 weeks) return 10;
    if (elapsed < 4 weeks) return 5;

    return 0;
  }

  function percent(uint256 p) internal returns (uint256) {
    return p.mul(10**16);
  }

  //Function is mocked for tests
  function getNow() internal constant returns (uint256) {
    return now;
  }

}

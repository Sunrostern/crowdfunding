// Software Package Data Exchange License Identifier: Massachusetts Institute of Technology.
// SPDX-License-Identifier: MIT.
// https://opensource.org/license/mit.
/*
Copyright 2023 Sunrostern

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

pragma solidity ^0.8.19;

import "./Token.sol";

contract Crowdfunding {
  address public owner;
  Token public token;
  uint256 public price;
  uint256 public maxTokens;
  uint256 public tokensSold;

  event Buy(
    uint256 amount,
    address buyer
  );

  event Finalize(
    uint256 tokensSold,
    uint256 ethRaised
  );

  constructor(Token _token, uint256 _price, uint256 _maxTokens) {
    owner = msg.sender;
    token = _token;
    price = _price;
    maxTokens = _maxTokens;
  }

    modifier onlyOwner() {
      require(msg.sender == owner, "Caller is not the Owner.");
      _;
    }

  receive() external payable {
    uint256 amount = msg.value / price;
    buyTokens(amount * 1e18);
  }

  function buyTokens(uint256 _amount) public payable {
    require(msg.value == (_amount / 1e18) * price);
    require(token.balanceOf(address(this)) >= _amount);
    require(token.transfer(msg.sender, _amount));
    tokensSold += _amount;
    emit Buy(_amount, msg.sender);
  }

  function setPrice(uint256 _price) public onlyOwner {
    price = _price;
  }

  function finalize() public onlyOwner {
    // Sending Ethers to the Crowdfunding Creator.
    require(token.transfer(owner, token.balanceOf(address(this))));

    // Sending any other remaining Tokens to the Crowdfunding Creator.
    uint256 value = address(this).balance;
    (bool sent, ) = owner.call{ value: value }("");
    require(sent);
    emit Finalize(tokensSold, value);
  }
}
// Software Package Data Exchange License Identifier: Massachusetts Institute of Technology.
// SPDX-License-Identifier: MIT.
// https://opensource.org/license/mit.
/*
Copyright 2023 Sunrostern

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
  string public name;
  string public symbol;
  uint256 public decimals = 18;
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;
  mapping(address => mapping(address => uint256)) public allowance;

  event Transfer(
    address indexed from,
    address indexed to,
    uint256 value
  );

  event Approval(
    address indexed owner,
    address indexed spender,
    uint256 value
  );

  constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
    name = _name;
    symbol = _symbol;
    totalSupply = _totalSupply * (10**decimals);
    balanceOf[msg.sender] = totalSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value, "Insufficient Token balance.");
    
    _transfer(msg.sender, _to, _value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {
    require(_spender != address(0));

    allowance[msg.sender][_spender] = _value;

    emit Approval(msg.sender, _spender, _value);
    return true;
  }

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    // Checking the approval.
    require(_value <= balanceOf[_from]);
    require(_value <= allowance[_from][msg.sender]);

    // Resetting the allowance.
    allowance[_from][msg.sender] -= _value;

    _transfer(_from, _to, _value);

    return true;
  }

  function _transfer(address _from, address _to, uint256 _value) internal {
    require(_to != address(0));

    balanceOf[_from] = balanceOf[_from] - _value;
    balanceOf[_to] = balanceOf[_to] + _value;

    emit Transfer(_from, _to, _value);
  }
}

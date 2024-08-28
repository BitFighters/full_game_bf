// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestBits is ERC20 {
    constructor() ERC20("TestBits", "TBTS8") {
        _mint(msg.sender, 10000000000000);
    }

    function decimals() public view virtual override returns (uint8) {
        return 8;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockToken is ERC20 {
    constructor() ERC20("Airdrop Token", "AIR") {
        _mint(msg.sender, 1000000 * 10 ** 18);
    }
}

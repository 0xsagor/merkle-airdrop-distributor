// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MerkleDistributor is Ownable {
    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;

    // Bitmap to track claimed addresses (0 = not claimed, 1 = claimed)
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed account, uint256 amount);

    constructor(address _token, bytes32 _merkleRoot) Ownable(msg.sender) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata proof) external {
        require(!hasClaimed[msg.sender], "Already claimed");

        // Verify the merkle proof
        // The leaf is formed by hashing the address and the amount
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));
        
        require(MerkleProof.verify(proof, merkleRoot, leaf), "Invalid proof");

        // Mark as claimed
        hasClaimed[msg.sender] = true;

        // Transfer tokens
        require(token.transfer(msg.sender, amount), "Transfer failed");

        emit Claimed(msg.sender, amount);
    }

    // Allow owner to withdraw remaining tokens after airdrop ends
    function withdrawRemaining() external onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        token.transfer(msg.sender, balance);
    }
}

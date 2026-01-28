const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { ethers } = require('ethers');

// 1. The Whitelist: Address and Amount (in Wei)
const whitelist = [
    { address: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", amount: "1000000000000000000" }, // Hardhat Account 0 (1 Token)
    { address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", amount: "2000000000000000000" }, // Hardhat Account 1 (2 Tokens)
    { address: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC", amount: "3000000000000000000" }  // Hardhat Account 2 (3 Tokens)
];

// 2. Hash the entries to create leaves
const leafNodes = whitelist.map(entry => {
    // Solidity: keccak256(abi.encode(address, amount))
    // We double hash inside the contract to prevent second preimage attacks, 
    // but typically standard trees hash the content first.
    // Here we replicate the contract logic: keccak256(abi.encode(addr, amount))
    const coder = new ethers.AbiCoder();
    return keccak256(coder.encode(['address', 'uint256'], [entry.address, entry.amount]));
});

// 3. Create Tree
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });

// 4. Get Root
const root = merkleTree.getHexRoot();

console.log("-----------------------------------------");
console.log("MERKLE ROOT:", root);
console.log("-----------------------------------------");

// 5. Generate Proofs for testing
console.log("Proofs for Deployment:");
whitelist.forEach((entry, index) => {
    const proof = merkleTree.getHexProof(leafNodes[index]);
    console.log(`\nAddress: ${entry.address}`);
    console.log(`Amount: ${entry.amount}`);
    console.log(`Proof: ${JSON.stringify(proof)}`);
});

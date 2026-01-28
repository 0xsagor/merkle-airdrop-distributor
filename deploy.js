const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // 1. Deploy Token
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const token = await MockToken.deploy();
  await token.waitForDeployment();
  console.log(`Token deployed to: ${token.target}`);

  // 2. Deploy Distributor
  // REPLACE THIS ROOT with the one generated from 'node generate-root.js'
  // This is a placeholder root for empty tree or test
  const merkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000"; 
  
  const MerkleDistributor = await hre.ethers.getContractFactory("MerkleDistributor");
  const distributor = await MerkleDistributor.deploy(token.target, merkleRoot);
  await distributor.waitForDeployment();
  console.log(`Distributor deployed to: ${distributor.target}`);

  // 3. Fund the Distributor
  await token.transfer(distributor.target, hre.ethers.parseEther("500"));
  console.log("Transferred 500 tokens to distributor");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

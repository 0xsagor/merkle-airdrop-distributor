# Merkle Airdrop Distributor

This repository implements a Merkle Airdrop mechanism. Instead of pushing tokens to thousands of users (expensive), users claim tokens by providing a cryptographic proof that their address is in the "Merkle Tree" of allowed recipients.

## How it Works
1. **Off-Chain**: You generate a list of eligible addresses and amounts. A `Merkle Root` (a single 32-byte hash) is created from this list.
2. **On-Chain**: You deploy the contract with this `Merkle Root`.
3. **Claiming**: Users call `claim()` with their specific `Merkle Proof`. The contract verifies the proof against the stored Root.

## Prerequisites
- Node.js & NPM
- Hardhat

## Setup
1. Install dependencies:
   ```bash
   npm install

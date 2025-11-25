# Quick Deployment Guide - Story Aeneid

## 1. Fund Your Wallet

- Get Story Aeneid testnet IP from https://faucet.story.foundation/
- Target deployer: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`

## 2. Deploy Contracts

```bash
# Deploy entire suite
npm run deploy:story

# Deploy individually if needed
CONTRACT_NAME=WorldToken npx hardhat run scripts/deployIndividual.ts --network storyAeneid
```

## 3. Update Environment Variables

```env
VITE_CHARACTER_TOKEN_ADDRESS=<character_address>
VITE_WORLD_TOKEN_ADDRESS=<world_address>
VITE_PLOT_TOKEN_ADDRESS=<plot_address>
VITE_CONTRIBUTION_MANAGER_ADDRESS=<contribution_manager_address>
```

## 4. Verify & Test

- Verify on https://aeneid.storyscan.xyz if desired
- Test minting and contributions once addresses are in `.env`


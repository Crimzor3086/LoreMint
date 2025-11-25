# Deployment Status - Story Aeneid Testnet

## Current State

Contracts must be redeployed to the Story Aeneid testnet. No Story-native deployments have been recorded yet.

## Next Steps

### Option 1: Deploy Full Suite
```bash
npm run deploy:story
```

### Option 2: Deploy Individually
```bash
# Deploy CharacterToken / WorldToken / etc.
CONTRACT_NAME=WorldToken npx hardhat run scripts/deployIndividual.ts --network storyAeneid
```

## Update Frontend Environment

Once contracts are deployed, update your `.env` file:

```env
VITE_CHARACTER_TOKEN_ADDRESS=<character_address>
VITE_WORLD_TOKEN_ADDRESS=<world_address>
VITE_PLOT_TOKEN_ADDRESS=<plot_address>
VITE_CONTRIBUTION_MANAGER_ADDRESS=<contribution_manager_address>
```

## Account Information

- **Deployer Address**: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`
- **Network**: Story Aeneid Testnet (Chain ID: 1315)
- **RPC URL**: https://aeneid.storyrpc.io
- **Explorer**: https://aeneid.storyscan.xyz

Ensure the deployer wallet holds sufficient IP (Story's native token) before running the scripts.

## Verification

```bash
npx hardhat verify --network storyAeneid <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```


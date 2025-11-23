# Quick Deployment Guide - Mantle Sepolia

## ✅ CharacterToken Deployed!

**Address**: `0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95`

## ⚠️ Insufficient Funds

Your account has **~2.11 MNT** remaining, but needs approximately **5+ MNT** per contract for deployment.

## Get More Testnet MNT

1. Visit: https://faucet.sepolia.mantle.xyz
2. Enter your address: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`
3. Request testnet tokens

## Deploy Remaining Contracts

Once you have sufficient funds, run:

```bash
# Deploy all remaining contracts
npm run deploy:mantle-sepolia

# OR deploy individually:
CONTRACT_NAME=WorldToken npx hardhat run scripts/deployIndividual.ts --network mantleSepolia
CONTRACT_NAME=PlotToken npx hardhat run scripts/deployIndividual.ts --network mantleSepolia
CONTRACT_NAME=ContributionManager npx hardhat run scripts/deployIndividual.ts --network mantleSepolia
```

## Update Environment Variables

After all contracts are deployed, add to your `.env`:

```env
VITE_CHARACTER_TOKEN_ADDRESS=0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95
VITE_WORLD_TOKEN_ADDRESS=<will be deployed>
VITE_PLOT_TOKEN_ADDRESS=<will be deployed>
VITE_CONTRIBUTION_MANAGER_ADDRESS=<will be deployed>
```

## Check Deployment Status

View `deployments/mantleSepolia.json` for all deployed contract addresses.


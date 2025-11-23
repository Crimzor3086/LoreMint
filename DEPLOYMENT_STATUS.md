# Deployment Status - Mantle Sepolia Testnet

## Deployed Contracts

### ✅ CharacterToken
- **Address**: `0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95`
- **Status**: ✅ Deployed Successfully
- **Explorer**: https://explorer.sepolia.mantle.xyz/address/0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95

### ⏳ Pending Deployment

The following contracts need to be deployed. Your account currently has **2.11 MNT** which may not be sufficient for all deployments.

#### WorldToken
- **Estimated Gas**: ~5.15 MNT
- **Status**: ⏳ Pending (insufficient funds)

#### PlotToken
- **Status**: ⏳ Pending

#### ContributionManager
- **Status**: ⏳ Pending

## Next Steps

### Option 1: Get More Testnet MNT
1. Visit Mantle Sepolia Faucet: https://faucet.sepolia.mantle.xyz
2. Request more testnet MNT tokens
3. Continue deployment with:
   ```bash
   npm run deploy:mantle-sepolia
   ```

### Option 2: Deploy Contracts Individually
Deploy each contract one at a time to monitor gas usage:

```bash
# Deploy WorldToken
CONTRACT_NAME=WorldToken npx hardhat run scripts/deployIndividual.ts --network mantleSepolia

# Deploy PlotToken
CONTRACT_NAME=PlotToken npx hardhat run scripts/deployIndividual.ts --network mantleSepolia

# Deploy ContributionManager
CONTRACT_NAME=ContributionManager npx hardhat run scripts/deployIndividual.ts --network mantleSepolia
```

## Update Frontend Environment

After all contracts are deployed, update your `.env` file:

```env
VITE_CHARACTER_TOKEN_ADDRESS=0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95
VITE_WORLD_TOKEN_ADDRESS=<deployed_address>
VITE_PLOT_TOKEN_ADDRESS=<deployed_address>
VITE_CONTRIBUTION_MANAGER_ADDRESS=<deployed_address>
```

## Account Information

- **Deployer Address**: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`
- **Network**: Mantle Sepolia Testnet (Chain ID: 5003)
- **Current Balance**: ~2.11 MNT
- **RPC URL**: https://rpc.sepolia.mantle.xyz

## Verification

To verify contracts on the explorer (optional):
```bash
npx hardhat verify --network mantleSepolia <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Example for CharacterToken:
```bash
npx hardhat verify --network mantleSepolia 0x72a214F0Ddf9a9b96Fa1F19f35e019f41fC42f95 "https://api.loremint.com/metadata/character/"
```


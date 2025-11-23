# Contract Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** or another wallet with MNT for gas fees
3. **Private Key** of the deployment wallet (keep this secure!)

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install Hardhat and all necessary dependencies.

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.deployment .env
```

Edit `.env` and add your values:

```env
# Your private key (NEVER commit this!)
PRIVATE_KEY=your_private_key_here

# Network RPC URLs
MANTLE_RPC_URL=https://rpc.mantle.xyz
MANTLE_TESTNET_RPC_URL=https://rpc.testnet.mantle.xyz

# Optional: Alchemy API for better performance
ALCHEMY_API_KEY=lcF6DkZJO7XkvTzCM4U97

# Base URI for metadata
BASE_URI=https://api.loremint.com/metadata/

# Optional: Explorer API key for contract verification
MANTLE_EXPLORER_API_KEY=
```

### 3. Get Testnet MNT (for testing)

For Mantle Testnet:
- Visit: https://faucet.testnet.mantle.xyz
- Request testnet MNT tokens

## Deployment

### Deploy to Mantle Testnet (Recommended First)

```bash
npx hardhat run scripts/deployMantle.ts --network mantleTestnet
```

### Deploy to Mantle Mainnet

```bash
npx hardhat run scripts/deployMantle.ts --network mantle
```

## What Gets Deployed

The script deploys 4 contracts:

1. **CharacterToken** - ERC721 for character IP tokens
2. **WorldToken** - ERC721 for world IP tokens
3. **PlotToken** - ERC721 for plot arc IP tokens
4. **ContributionManager** - Manages fan contributions and voting

## After Deployment

### 1. Update Frontend Environment Variables

After deployment, update your `.env` file with the deployed addresses:

```env
VITE_CHARACTER_TOKEN_ADDRESS=0x...
VITE_WORLD_TOKEN_ADDRESS=0x...
VITE_PLOT_TOKEN_ADDRESS=0x...
VITE_CONTRIBUTION_MANAGER_ADDRESS=0x...
```

The deployment script will output these addresses automatically.

### 2. Verify Contracts (Optional)

If you have an explorer API key, contracts will be automatically verified. Otherwise, you can verify manually:

```bash
npx hardhat verify --network mantle <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 3. Check Deployment Info

Deployment information is saved to `deployments/<network>.json` for reference.

## Security Best Practices

1. **Never commit `.env` file** - It contains your private key
2. **Use a dedicated deployment wallet** - Don't use your main wallet
3. **Keep minimal funds** - Only keep enough MNT for gas fees
4. **Test on testnet first** - Always test deployments on testnet before mainnet
5. **Verify contracts** - Always verify contracts on the explorer

## Troubleshooting

### "Insufficient funds"
- Make sure your deployment wallet has enough MNT for gas fees
- Check your balance: The script will show your balance before deploying

### "Nonce too high"
- Wait a few minutes and try again
- Or manually set a nonce in the Hardhat config

### "Contract verification failed"
- This is optional and doesn't affect functionality
- You can verify manually later using the explorer

### "Network not found"
- Make sure you're using the correct network name: `mantle` or `mantleTestnet`
- Check your RPC URL in `.env`

## Next Steps

After successful deployment:

1. Update frontend `.env` with contract addresses
2. Test minting on testnet
3. Test all contract interactions
4. Deploy to mainnet when ready
5. Update production environment variables

## Support

For issues or questions:
- Check Hardhat documentation: https://hardhat.org/docs
- Mantle documentation: https://docs.mantle.xyz
- Check deployment logs in `deployments/` directory


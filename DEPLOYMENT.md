# Contract Deployment Guide

## Prerequisites

1. **Node.js** (v18 or higher)
2. **MetaMask** or another wallet with IP for gas fees
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

# Network RPC URL
STORY_AENEID_RPC_URL=https://aeneid.storyrpc.io

# Base URI for metadata
BASE_URI=https://api.loremint.com/metadata/

# Optional: Explorer API key for contract verification
STORY_AENEID_EXPLORER_API_KEY=
```

### 3. Get Testnet IP (for testing)

- Visit the official Story faucet (https://faucet.story.foundation/) and request Story Aeneid testnet funds

## Deployment

### Deploy to Story Aeneid Testnet

```bash
npx hardhat run scripts/deployStory.ts --network storyAeneid
```

> Mainnet is not yet configured. Update `hardhat.config.cjs` once Story mainnet values are available.

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
npx hardhat verify --network storyAeneid <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

### 3. Check Deployment Info

Deployment information is saved to `deployments/<network>.json` for reference.

## Security Best Practices

1. **Never commit `.env` file** - It contains your private key
2. **Use a dedicated deployment wallet** - Don't use your main wallet
3. **Keep minimal funds** - Only keep enough IP for gas fees
4. **Test on testnet first** - Always test deployments on testnet before mainnet
5. **Verify contracts** - Always verify contracts on the explorer

## Troubleshooting

### "Insufficient funds"
- Make sure your deployment wallet has enough IP for gas fees
- Check your balance: The script will show your balance before deploying

### "Nonce too high"
- Wait a few minutes and try again
- Or manually set a nonce in the Hardhat config

### "Contract verification failed"
- This is optional and doesn't affect functionality
- You can verify manually later using the explorer

### "Network not found"
- Make sure you're using the correct network name: `storyAeneid`
- Check your RPC URL in `.env`

## Next Steps

After successful deployment:

1. Update frontend `.env` with contract addresses
2. Test minting on testnet
3. Test all contract interactions
4. Deploy to mainnet when Story mainnet support is available
5. Update production environment variables

## Support

For issues or questions:
- Check Hardhat documentation: https://hardhat.org/docs
- Story documentation: https://docs.story.foundation
- Check deployment logs in `deployments/` directory


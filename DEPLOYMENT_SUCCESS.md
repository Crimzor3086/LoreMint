# ✅ Contract Deployment Successful - Mantle Sepolia

## Deployed Contracts

All LoreMint contracts have been successfully deployed to **Mantle Sepolia Testnet**!

### Contract Addresses

| Contract | Address | Explorer |
|----------|---------|----------|
| **CharacterToken** | `0xC70FF3ACB17A3CC1A61803F600395F1f509E74fF` | [View on Explorer](https://explorer.sepolia.mantle.xyz/address/0xC70FF3ACB17A3CC1A61803F600395F1f509E74fF) |
| **WorldToken** | `0xb101a3482225068Ab8f4F37ba54178C11563930b` | [View on Explorer](https://explorer.sepolia.mantle.xyz/address/0xb101a3482225068Ab8f4F37ba54178C11563930b) |
| **PlotToken** | `0xdEbE3a078FB1D0d9b172c71E9Fc1594de545Ab3c` | [View on Explorer](https://explorer.sepolia.mantle.xyz/address/0xdEbE3a078FB1D0d9b172c71E9Fc1594de545Ab3c) |
| **ContributionManager** | `0xE14bA9eE2fF1b516D3E53789167051a8826d9c3B` | [View on Explorer](https://explorer.sepolia.mantle.xyz/address/0xE14bA9eE2fF1b516D3E53789167051a8826d9c3B) |

## Update Environment Variables

Add these to your `.env` file:

```env
# Mantle Sepolia Contract Addresses
VITE_CHARACTER_TOKEN_ADDRESS=0xC70FF3ACB17A3CC1A61803F600395F1f509E74fF
VITE_WORLD_TOKEN_ADDRESS=0xb101a3482225068Ab8f4F37ba54178C11563930b
VITE_PLOT_TOKEN_ADDRESS=0xdEbE3a078FB1D0d9b172c71E9Fc1594de545Ab3c
VITE_CONTRIBUTION_MANAGER_ADDRESS=0xE14bA9eE2fF1b516D3E53789167051a8826d9c3B
```

## Deployment Details

- **Network**: Mantle Sepolia Testnet
- **Chain ID**: 5003
- **Deployer**: `0x7c538b83D0295f94C4bBAf8302095d9ED4b2Ad5f`
- **Remaining Balance**: ~4.66 MNT
- **RPC URL**: https://rpc.sepolia.mantle.xyz
- **Explorer**: https://explorer.sepolia.mantle.xyz

## Next Steps

1. ✅ **Update `.env` file** with the contract addresses above
2. ✅ **Restart your dev server** to load new addresses
3. ✅ **Test minting** - Try minting a character, world, or plot
4. ✅ **Test contributions** - Submit a contribution through the Community page
5. ✅ **Verify contracts** (optional) - Use Hardhat verify command if you have an API key

## Verification (Optional)

To verify contracts on the explorer:

```bash
# CharacterToken
npx hardhat verify --network mantleSepolia 0xC70FF3ACB17A3CC1A61803F600395F1f509E74fF "https://api.loremint.com/metadata/character/"

# WorldToken
npx hardhat verify --network mantleSepolia 0xb101a3482225068Ab8f4F37ba54178C11563930b "https://api.loremint.com/metadata/world/"

# PlotToken
npx hardhat verify --network mantleSepolia 0xdEbE3a078FB1D0d9b172c71E9Fc1594de545Ab3c "https://api.loremint.com/metadata/plot/"

# ContributionManager
npx hardhat verify --network mantleSepolia 0xE14bA9eE2fF1b516D3E53789167051a8826d9c3B
```

## Testing

Now you can:
- Connect your MetaMask wallet to Mantle Sepolia
- Mint characters, worlds, and plot arcs
- Submit and vote on contributions
- View your assets in the Dashboard
- See royalty distributions

All contracts are live and ready to use! 🎉


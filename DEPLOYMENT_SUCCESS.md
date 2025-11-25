# ✅ Contract Deployment Checklist - Story Aeneid

Use this template after deploying to the Story Aeneid testnet.

## Contract Addresses

| Contract | Address | Explorer |
|----------|---------|----------|
| **CharacterToken** | `<character_address>` | [View on Explorer](https://aeneid.storyscan.xyz) |
| **WorldToken** | `<world_address>` | [View on Explorer](https://aeneid.storyscan.xyz) |
| **PlotToken** | `<plot_address>` | [View on Explorer](https://aeneid.storyscan.xyz) |
| **ContributionManager** | `<contribution_manager_address>` | [View on Explorer](https://aeneid.storyscan.xyz) |

## Update Environment Variables

```env
VITE_CHARACTER_TOKEN_ADDRESS=<character_address>
VITE_WORLD_TOKEN_ADDRESS=<world_address>
VITE_PLOT_TOKEN_ADDRESS=<plot_address>
VITE_CONTRIBUTION_MANAGER_ADDRESS=<contribution_manager_address>
```

## Deployment Details

- **Network**: Story Aeneid Testnet
- **Chain ID**: 1315
- **RPC URL**: https://aeneid.storyrpc.io
- **Explorer**: https://aeneid.storyscan.xyz

## Verification (Optional)

```bash
npx hardhat verify --network storyAeneid <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

## Testing Checklist

- Connect MetaMask to Story Aeneid
- Mint characters, worlds, and plot arcs
- Submit and vote on contributions
- Verify on-chain events appear correctly

Update this document with real addresses once deployment to Story Aeneid succeeds. 🎉


# Blockchain Integration Guide

## Overview

LoreMint is now fully integrated with the Mantle blockchain. All data fetching and interactions are handled through blockchain services and React hooks.

## Architecture

### 1. Contract ABIs
Located in `src/lib/blockchain/abis/`:
- `CharacterToken.json` - ERC721 for character IP tokens
- `WorldToken.json` - ERC721 for world IP tokens
- `PlotToken.json` - ERC721 for plot arc IP tokens
- `ContributionManager.json` - Manages fan contributions and voting

### 2. Blockchain Services
Located in `src/lib/blockchain/services/`:
- `characterService.ts` - Character token operations
- `worldService.ts` - World token operations
- `plotService.ts` - Plot token operations
- `contributionService.ts` - Contribution management operations

### 3. React Hooks
Located in `src/hooks/`:
- `useCharacters()` - Fetch and mint characters
- `useWorlds()` - Fetch and mint worlds
- `usePlots()` - Fetch and mint plot arcs
- `useContributions()` - Submit, vote, approve/reject contributions
- `useMint()` - Unified minting hook for all asset types
- `useWallet()` - Wallet connection and management

## Setup

### 1. Deploy Contracts
Deploy the smart contracts to Mantle network:
- CharacterToken
- WorldToken
- PlotToken
- ContributionManager

### 2. Update Environment Variables
Add contract addresses to `.env`:
```env
VITE_CHARACTER_TOKEN_ADDRESS=0x...
VITE_WORLD_TOKEN_ADDRESS=0x...
VITE_PLOT_TOKEN_ADDRESS=0x...
VITE_CONTRIBUTION_MANAGER_ADDRESS=0x...
```

### 3. Connect Wallet
Users must connect their MetaMask wallet. The app will:
- Automatically switch to Mantle network if needed
- Add Mantle network to MetaMask if not present
- Fetch user's assets from blockchain

## Usage

### Fetching Data
All pages automatically fetch data when wallet is connected:

```typescript
// Dashboard
const { characters, worlds, plots } = useCharacters();
const { worlds } = useWorlds();
const { plots } = usePlots();

// Community
const { contributions, submit, vote, approve, reject } = useContributions();
```

### Minting Assets
```typescript
const { mint, isMinting } = useMint();

await mint("character", {
  name: "Character Name",
  description: "Character backstory",
  attributes: {
    abilities: ["Ability 1", "Ability 2"],
    traits: ["Trait 1", "Trait 2"],
  }
});
```

### Submitting Contributions
```typescript
const { submit } = useContributions();

await submit("story", "Title", "Description", "assetId");
```

## Error Handling

All services handle:
- Contract not deployed (returns empty arrays)
- Wallet not connected (shows appropriate messages)
- Transaction failures (shows error toasts)
- Network errors (graceful degradation)

## Next Steps

1. **Deploy Contracts**: Deploy all contracts to Mantle mainnet/testnet
2. **Update Addresses**: Add deployed contract addresses to `.env`
3. **Test Integration**: Test all operations with deployed contracts
4. **Add Indexer**: Consider adding a blockchain indexer for better performance
5. **Royalty Service**: Implement royalty distribution service
6. **Event Listeners**: Add real-time event listeners for new mints/contributions

## Notes

- Contracts must be deployed before use
- All operations require wallet connection
- Transactions require user approval in MetaMask
- Data is fetched on component mount and wallet connection
- Services automatically refresh data after mutations


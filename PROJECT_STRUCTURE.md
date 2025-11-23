# LoreMint Project Structure

This document describes the organized structure of the LoreMint project following best practices for a blockchain + AI storytelling platform.

## Directory Structure

```
frontend/
├── src/
│   ├── app/              # UI pages (if using Next.js app router)
│   │   └── (pages would go here in Next.js)
│   │
│   ├── pages/            # React Router pages (current Vite setup)
│   │   ├── Landing.tsx
│   │   ├── Dashboard.tsx
│   │   ├── CharacterBuilder.tsx
│   │   ├── WorldBuilder.tsx
│   │   ├── MintIP.tsx
│   │   ├── StoryGraph.tsx
│   │   ├── Community.tsx
│   │   └── NotFound.tsx
│   │
│   ├── components/       # Reusable UI components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   └── ParticleBackground.tsx
│   │
│   ├── hooks/            # Custom React hooks
│   │   ├── useWallet.ts  # Wallet connection & management
│   │   ├── useMint.ts    # IP minting functionality
│   │   └── useAI.ts      # AI generation hooks
│   │
│   ├── lib/              # Utilities & helpers
│   │   ├── blockchain/  # Story & Polygon integration
│   │   │   ├── polygon.ts    # Polygon SDK / RPC functions
│   │   │   ├── contracts.ts  # Contract ABI imports & helpers
│   │   │   └── index.ts
│   │   ├── ai/          # AI content generation helpers
│   │   │   ├── loreGenerator.ts  # AI service for lore generation
│   │   │   └── index.ts
│   │   └── utils.ts     # Misc utilities
│   │
│   ├── mock/            # Mock data for Phase 1 / testing
│   │   ├── characters.ts
│   │   ├── worlds.ts
│   │   ├── plots.ts
│   │   ├── contributions.ts
│   │   └── index.ts
│   │
│   ├── types/           # TypeScript interfaces
│   │   ├── character.ts
│   │   ├── world.ts
│   │   ├── plot.ts
│   │   ├── contribution.ts
│   │   └── index.ts
│   │
│   ├── context/         # React contexts
│   │   ├── WalletContext.tsx  # Global wallet state
│   │   └── AIContext.tsx      # Global AI state
│   │
│   └── styles/          # Global CSS or Tailwind overrides
│       └── (index.css)
│
├── contracts/           # Smart contracts
│   ├── CharacterToken.sol
│   ├── WorldToken.sol
│   ├── PlotToken.sol
│   └── ContributionManager.sol
│
└── scripts/             # Deployment / setup scripts
    ├── deployStory.ts   # Story L1 smart contract deployment
    └── deployPolygon.ts # Polygon deployment scripts
```

## Key Components

### 1. Types (`src/types/`)
- **Purpose**: Centralized TypeScript interfaces
- **Files**:
  - `character.ts`: Character interface
  - `world.ts`: World interface
  - `plot.ts`: PlotArc interface
  - `contribution.ts`: Contribution & RoyaltySplit interfaces
  - `index.ts`: Re-exports all types

### 2. Mock Data (`src/mock/`)
- **Purpose**: Sample data for development and testing
- **Files**:
  - `characters.ts`: Mock character data
  - `worlds.ts`: Mock world data
  - `plots.ts`: Mock plot arc data
  - `contributions.ts`: Mock contributions and royalty splits
  - `index.ts`: Re-exports all mock data

### 3. Blockchain Integration (`src/lib/blockchain/`)
- **Purpose**: Blockchain interactions for Story L1 and Polygon
- **Files**:
  - `polygon.ts`: Polygon network configuration and RPC functions
  - `contracts.ts`: Smart contract ABIs, addresses, and interaction helpers
  - `index.ts`: Re-exports blockchain utilities

### 4. AI Integration (`src/lib/ai/`)
- **Purpose**: AI-powered content generation
- **Files**:
  - `loreGenerator.ts`: AI service for generating character and world lore
  - `index.ts`: Re-exports AI services

### 5. React Hooks (`src/hooks/`)
- **Purpose**: Reusable React hooks for common functionality
- **Files**:
  - `useWallet.ts`: Wallet connection, balance, network switching
  - `useMint.ts`: IP token minting functionality
  - `useAI.ts`: AI generation hooks

### 6. React Contexts (`src/context/`)
- **Purpose**: Global state management
- **Files**:
  - `WalletContext.tsx`: Global wallet state provider
  - `AIContext.tsx`: Global AI state provider

### 7. Smart Contracts (`contracts/`)
- **Purpose**: Solidity smart contracts for IP tokenization
- **Files**:
  - `CharacterToken.sol`: ERC721 for character IP
  - `WorldToken.sol`: ERC721 for world IP
  - `PlotToken.sol`: ERC721 for plot arc IP
  - `ContributionManager.sol`: Manages fan contributions and royalties

### 8. Deployment Scripts (`scripts/`)
- **Purpose**: Automated contract deployment
- **Files**:
  - `deployStory.ts`: Deploy to Story L1
  - `deployPolygon.ts`: Deploy to Polygon

## Usage Examples

### Using Types
```typescript
import { Character, World, PlotArc } from "@/types";
```

### Using Mock Data
```typescript
import { mockCharacters, mockWorlds } from "@/mock";
```

### Using Blockchain
```typescript
import { initPolygonConnection, writeContract } from "@/lib/blockchain";
```

### Using AI Services
```typescript
import { AIService } from "@/lib/ai";
const lore = await AIService.generateCharacterLore(options);
```

### Using Hooks
```typescript
import { useWallet } from "@/hooks/useWallet";
import { useMint } from "@/hooks/useMint";
import { useAI } from "@/hooks/useAI";
```

### Using Contexts
```typescript
import { useWalletContext } from "@/context/WalletContext";
import { useAIContext } from "@/context/AIContext";
```

## Environment Variables

Create a `.env` file with:
```
VITE_POLYGON_RPC_URL=https://polygon-rpc.com
VITE_CHARACTER_TOKEN_ADDRESS=0x...
VITE_WORLD_TOKEN_ADDRESS=0x...
VITE_PLOT_TOKEN_ADDRESS=0x...
VITE_CONTRIBUTION_MANAGER_ADDRESS=0x...
```

## Next Steps

1. **Replace Mock Implementations**: Update blockchain and AI services with real implementations
2. **Deploy Contracts**: Use deployment scripts to deploy to testnet/mainnet
3. **Update Contract Addresses**: Update addresses in `contracts.ts` and `.env`
4. **Integrate Real Wallet**: Replace mock wallet with MetaMask/WalletConnect
5. **Connect Real AI API**: Replace template-based AI with OpenAI/Anthropic API


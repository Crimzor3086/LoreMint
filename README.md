# LoreMint - AI-Powered IP Tokenization & Storyworld Engine

## Project Overview

LoreMint is a decentralized platform that empowers creators to mint, expand, and monetize entire story universes as programmable IP assets on the Story Aeneid network. Leveraging AI, creators can generate characters, lore, timelines, and world-building elements while retaining full ownership and attribution.

## Project Structure

```
LoreMint/
├── src/              # Source code
│   ├── pages/        # React pages
│   ├── components/   # UI components
│   ├── hooks/        # React hooks
│   ├── context/      # React contexts
│   ├── lib/          # Utilities (blockchain, AI)
│   ├── mock/         # Mock data
│   └── types/        # TypeScript types
├── contracts/        # Solidity smart contracts
├── scripts/          # Deployment scripts
├── public/           # Static assets
└── package.json      # Dependencies
```

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone https://github.com/Crimzor3086/LoreMint.git

# Step 2: Navigate to the project directory
cd LoreMint

# Step 3: Install dependencies
npm install

# Step 4: Set up environment variables
cp .env.example .env
# Edit .env and add your Alchemy API key and contract addresses

# Step 5: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Network Configuration
VITE_STORY_AENEID_RPC_URL=https://aeneid.storyrpc.io
VITE_STORY_AENEID_CHAIN_ID=1315
VITE_STORY_AENEID_NETWORK_NAME="Story Aeneid Testnet"
VITE_STORY_AENEID_NATIVE_NAME="Imagination Protocol"
VITE_STORY_AENEID_NATIVE_SYMBOL=IP
VITE_STORY_AENEID_NATIVE_DECIMALS=18
VITE_STORY_AENEID_BLOCK_EXPLORER=https://aeneid.storyscan.xyz

# Contract Addresses (update after deployment)
VITE_CHARACTER_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
VITE_WORLD_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
VITE_PLOT_TOKEN_ADDRESS=0x0000000000000000000000000000000000000000
VITE_CONTRIBUTION_MANAGER_ADDRESS=0x0000000000000000000000000000000000000000
```

**Note**: The `.env` file is gitignored for security. Use `.env.example` as a template.

## Repository

**GitHub**: [https://github.com/Crimzor3086/LoreMint](https://github.com/Crimzor3086/LoreMint)

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/4b511bb2-6fbb-4cae-a778-19170193c972) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

# SolanaGate

A comprehensive framework for building token-gated dApps on Solana with integrated token utilities and interactive features.

## Features

- 🔐 Token-gated access control with Solana wallet integration
- 📊 Real-time token price and market data from DexScreener
- 📈 Historical price charts with Solana Tracker API
- 🎮 Interactive token-gated features
- 🎨 Responsive design with Tailwind CSS
- ⚡ Built with Vite for fast development and production builds
- 🔧 Easy configuration via environment variables

## Prerequisites

- Node.js 16+ and npm 7+
- Solana CLI (for deployment)
- A Solana wallet with devnet/testnet SOL for testing

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/solana-token-gate.git
   cd solana-token-gate
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration (see [Configuration](#configuration) below).

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# ====================================
# Token Configuration
# ====================================
VITE_TOKEN_MINT_ADDRESS=YOUR_TOKEN_MINT_ADDRESS
VITE_TOKEN_SYMBOL=TOKEN
VITE_TOKEN_NAME=Your Token
VITE_TOKEN_DECIMALS=9
VITE_TOKEN_LOGO_URL=/img/token-logo.png

# ====================================
# API Configuration
# ====================================
VITE_DEXSCREENER_API=https://api.dexscreener.com/tokens/v1/solana
VITE_SOLANA_TRACKER_API_URL=https://api.solanatracker.io
VITE_SOLANA_TRACKER_API_KEY=your_api_key_here

# ====================================
# Environment Configuration
# ====================================
VITE_DEBUG=true
VITE_LOG_LEVEL=debug

# ====================================
# RPC Configuration
# ====================================
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
# VITE_SOLANA_RPC_URL=https://api.devnet.solana.com  # For development
```

### Token Logo

Place your token logo in the `public/img/` directory and update the `VITE_TOKEN_LOGO_URL` in your `.env` file.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
- `npm run type-check` - Check TypeScript types

## Project Structure

```text
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components
│   ├── games/        # Game components
│   ├── layouts/      # Layout components
│   └── token/        # Token-related components
├── config/           # Configuration files
├── context/          # React context providers
├── games/            # Game implementations
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── styles/           # Global styles and themes
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Deployment

### Vercel (Recommended)

1. Push your code to a GitHub/GitLab/Bitbucket repository
2. Import the repository to Vercel
3. Add your environment variables in the Vercel dashboard
4. Deploy!

### Netlify

1. Push your code to a Git repository
2. Create a new site in Netlify and link your repository
3. Add your environment variables in the Netlify dashboard
4. Set the build command to `npm run build` and publish directory to `dist`
5. Deploy!

## API Integration

### DexScreener API

This project uses the DexScreener API to fetch real-time token price and market data. No API key is required for basic usage.

### Solana Tracker API

For historical price data, you'll need to get an API key from [Solana Tracker](https://www.solanatracker.io/account/data-api).

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

---

Built with ❤️ by the Solana community

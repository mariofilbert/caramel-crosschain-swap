# Cross-Chain Swap Frontend

This is the frontend for a cross-chain swap system that allows users to create and sign swap intents, which are submitted to an Espresso-compatible sequencer. The frontend is built using Next.js, RainbowKit, Wagmi, and Tailwind CSS.

## 📌 Features

- Connects to Arbitrum Sepolia using RainbowKit and Wagmi.
- Allows users to create and sign swap intents.
- Submits swap intents to an Espresso-compatible sequencer.
- Displays real-time transaction updates.

## 🛠 Tech Stack

- **Next.js** - React framework for server-side rendering and static site generation.
- **Wagmi** - React hooks for Ethereum.
- **RainbowKit** - Wallet connection UI.
- **Tailwind CSS** - Utility-first CSS framework.

## 📦 Setup & Installation

### 1️⃣ Install Dependencies

```sh
npm install
```

### 2️⃣ Run the Development Server3

```sh
npm run dev
```

The application will be available at `http://localhost:3000`.

## 🚀 Usage

1. Connect your wallet using RainbowKit.
2. Enter the swap details and sign the intent.
3. Submit the intent to the sequencer.
4. View the transaction status in real-time.

## 📁 Project Structure

```
.
├── components
│   ├── cross-chain-swap.tsx  # Swap form component
├── pages
│   ├── index.tsx             # Home page
├── app
│   ├── App.tsx               # Wagmi & RainbowKit provider setup
├── styles
│   ├── globals.css           # Global styles
├── public
│   ├── images                # Static assets
└── package.json
```

## 📬 Contact & Contributions

Feel free to fork this repository and contribute. If you encounter issues, submit an issue or reach out via GitHub.

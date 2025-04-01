'use client';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultConfig,
  RainbowKitProvider,
  Chain,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider, http } from 'wagmi';
import { arbitrumSepolia, sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactNode } from 'react';

// const caramel = {
//   id: 343434,
//   name: 'Caramel',
//   iconUrl: '/caramel.jpg',
//   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     default: { http: ['http://13.212.76.163:8547'] },
//   },
// } as const satisfies Chain;

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: [arbitrumSepolia],
  // chains: [arbitrumSepolia, sepolia, caramel],
  ssr: true, // If your dApp uses server side rendering (SSR)
  transports: {
    [arbitrumSepolia.id]: http(
      'https://arb-sepolia.g.alchemy.com/v2/AF3Lr06nsSwPKK8QtgzWFZ9POOO95S71'
    ),
    // [sepolia.id]: http(
    //   'https://eth-sepolia.g.alchemy.com/v2/O4y-cX6J6a0UnHdMiC6NtAqELICe0J34'
    // ),
    // [caramel.id]: http('http://13.212.76.163:8547'),
  },
});

const queryClient = new QueryClient();
function App({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;

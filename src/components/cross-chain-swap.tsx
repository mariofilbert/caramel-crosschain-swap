'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ChevronDown,
  Clock,
  Copy,
  ExternalLink,
  LogOut,
  RefreshCw,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// new imports
import { useAccount, useBalance, useDisconnect, useSwitchChain } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { arbitrumSepolia, sepolia } from 'wagmi/chains';
import {
  keccak256,
  toHex,
  stringToBytes,
  erc20Abi,
  pad,
  encodeAbiParameters,
  hexToBytes,
  bytesToHex,
  parseUnits,
  defineChain,
  parseEther,
  createPublicClient,
  http,
  formatUnits,
} from 'viem';

// tambahan
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
// import SpokeABI from '@/abis/SpokeABI.json';
import ERC20ABI from '@/abis/ERC20ABI.json';
import SwapIntentABI from '@/abis/SwapIntentABI.json';

import CustomConnectButton from '@/components/ui/custom-connectbutton';

// Define types for our data
interface Token {
  symbol: string;
  name: string;
  address: string;
  logoUrl: string;
  chainId: number;
  balance?: string;
  price?: number;
}

interface Chain {
  id: number;
  name: string;
  logoUrl: string;
}

// interface WalletProvider {
//   id: string;
//   name: string;
//   logoUrl: string;
//   description: string;
// }

// const caramelChain = defineChain({
//   id: 343434,
//   name: 'Caramel',
//   nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     default: { http: ['http://13.212.76.163:8547'] },
//   },
// });

const client = createPublicClient({
  chain: sepolia,
  transport: http(
    'https://eth-sepolia.g.alchemy.com/v2/O4y-cX6J6a0UnHdMiC6NtAqELICe0J34'
  ),
});

// Sample data
const chains: Chain[] = [
  // {
  //   id: sepolia.id,
  //   name: 'Sepolia',
  //   logoUrl: '/sepolia eth.png',
  // },
  {
    id: arbitrumSepolia.id,
    name: 'Arbitrum Sepolia',
    logoUrl: '/arbitrum sepolia.png',
  },
  {
    id: sepolia.id,
    name: 'Caramel',
    logoUrl: '/caramel.jpg',
  },
  // {
  //   id: caramelChain.id,
  //   name: 'Caramel',
  //   logoUrl: '/caramel.jpg',
  // },
  // {
  //   id: mainnet.id,
  //   name: 'Ethereum',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  // },
  // {
  //   id: arbitrum.id,
  //   name: 'Arbitrum',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  // },
  // {
  //   id: base.id,
  //   name: 'Base',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  // },
  // {
  //   id: polygon.id,
  //   name: 'Polygon',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  // },
  // {
  //   id: optimism.id,
  //   name: 'Optimism',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  // },
];

const tokens: Token[] = [
  {
    symbol: 'T1',
    name: 'Token 1 Arbitrum Sepolia',
    address: '0x1C70d89E4E415C03BBDf59Ed8E2d081aDf06a837',
    chainId: 421614, // Arbitrum Sepolia testnet
    logoUrl: '/T1.jpg',
    // balance: '0.5',
    // price: 3500,
  },
  {
    symbol: 'T1',
    name: 'Token 1 ETH Sepolia',
    address: '0x0daAe4993EFB4a5940eBb24E527584a939B3dBf9',
    chainId: 11155111, // Sepolia testnet
    logoUrl: '/T1.jpg',
    // balance: '0.5',
    // price: 3500,
  },
  // {
  //   symbol: 'USDC',
  //   name: 'USD Coin',
  //   address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  //   balance: '1000',
  //   price: 1,
  // },
  // {
  //   symbol: 'USDT',
  //   name: 'Tether',
  //   address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  //   balance: '500',
  //   price: 1,
  // },
  // {
  //   symbol: 'WBTC',
  //   name: 'Wrapped Bitcoin',
  //   address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  //   logoUrl: '/placeholder.svg?height=24&width=24',
  //   balance: '0.01',
  //   price: 62000,
  // },
];

// const walletProviders: WalletProvider[] = [
//   {
//     id: 'metamask',
//     name: 'MetaMask',
//     logoUrl: '/placeholder.svg?height=40&width=40',
//     description: 'Connect to your MetaMask Wallet',
//   },
//   {
//     id: 'walletconnect',
//     name: 'WalletConnect',
//     logoUrl: '/placeholder.svg?height=40&width=40',
//     description: 'Scan with WalletConnect to connect',
//   },
//   {
//     id: 'coinbase',
//     name: 'Coinbase Wallet',
//     logoUrl: '/placeholder.svg?height=40&width=40',
//     description: 'Connect to your Coinbase Wallet',
//   },
//   {
//     id: 'trustwallet',
//     name: 'Trust Wallet',
//     logoUrl: '/placeholder.svg?height=40&width=40',
//     description: 'Connect to your Trust Wallet',
//   },
// ];

const getTokenForChain = (chainId: number): Token => {
  return tokens.find((token) => token.chainId === chainId) || tokens[0];
};

export default function CrossChainSwap() {
  const [sourceChain, setSourceChain] = useState<Chain>(chains[0]); // Sepolia
  const [destinationChain, setDestinationChain] = useState<Chain>(chains[1]); // Arbitrum
  const [sourceAmount, setSourceAmount] = useState<string>('0.5');
  const [destinationAmount, setDestinationAmount] = useState<string>('0.5');

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // For History trx
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] =
    useState<boolean>(false);

  // Hover over button
  const [isSwitchHovered, setIsSwitchHovered] = useState<boolean>(false);

  // Set tokens based on selected chains
  const [sourceToken, setSourceToken] = useState<Token>(
    getTokenForChain(sourceChain.id)
  );
  const [destinationToken, setDestinationToken] = useState<Token>(
    getTokenForChain(destinationChain.id)
  );

  const [isSuccessDialogOpen, setIsSuccessDialogOpen] =
    useState<boolean>(false);

  //TRX Intent hash
  const [transactionHash, setTransactionHash] = useState<string>('');

  // Reading Balance For Destination Token
  const [balance, setBalance] = useState<string | null>(null);

  const { address, isConnected, chain: currentChain } = useAccount();
  const { data: balanceData } = useBalance({
    address: address,
    token: sourceToken.address as `0x${string}`,
  });
  const { switchChain } = useSwitchChain();

  // Calculate the exchange rate
  const exchangeRate = 1; // 1% fee example
  // const estimatedGas = '0.001 ETH';
  const estimatedTime = '5 sec';

  // ================================================
  // ================================================

  // const handleSwap = () => {
  //   if (!isConnected) {
  //     return;
  //   }

  //   setIsLoading(true);
  //   // Simulate API call
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // };

  useEffect(() => {
    setSourceToken(getTokenForChain(sourceChain.id));
  }, [sourceChain]);

  useEffect(() => {
    setDestinationToken(getTokenForChain(destinationChain.id));
  }, [destinationChain]);

  useEffect(() => {
    if (isConnected && currentChain) {
      // Find the chain in our chains array that matches the current wallet chain
      const matchingChain = chains.find(
        (chain) => chain.id === currentChain.id
      );
      if (matchingChain) {
        setSourceChain(matchingChain);
        // Also update the source token based on the new chain
        setSourceToken(getTokenForChain(matchingChain.id));
      }
    }
  }, [currentChain, isConnected]);
  useEffect(() => {
    const fetchBalance = async () => {
      if (!address) return;
      try {
        const balanceWei = await client.readContract({
          address: destinationToken.address as `0x${string}`,
          abi: erc20Abi,
          functionName: 'balanceOf',
          args: [address],
        });

        setBalance(formatUnits(balanceWei, 18));
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [address]);

  const handleSourceAmountChange = (value: string) => {
    setSourceAmount(value);
    // Calculate destination amount based on exchange rate
    const numValue = Number.parseFloat(value) || 0;
    setDestinationAmount((numValue * exchangeRate).toFixed(6));
  };

  const handleMaxClick = () => {
    if (sourceToken.balance) {
      setSourceAmount(sourceToken.balance);
      const numValue = Number.parseFloat(sourceToken.balance) || 0;
      setDestinationAmount((numValue * exchangeRate).toFixed(6));
    }
  };

  const handleSourceChainChange = (chain: Chain) => {
    setSourceChain(chain);
    // If selected chain is the same as destination, swap them
    if (chain.id === destinationChain.id) {
      setDestinationChain(sourceChain);
    }
  };

  const handleDestinationChainChange = (chain: Chain) => {
    setDestinationChain(chain);
    // If selected chain is the same as source, swap them
    if (chain.id === sourceChain.id) {
      setSourceChain(destinationChain);
    }
  };

  // const getTokenBalance = (token: Token) => {
  //   // If connected and current chain matches source chain, use Wagmi balance
  //   if (isConnected && currentChain?.id === sourceChain.id) {
  //     // Convert Wagmi balance to token's decimal representation
  //     return balanceData?.decimals || '0.0';
  //   }
  //   // Fallback to token's predefined balance or "0.0"
  //   return token.balance || '0.0';
  // };

  // const switchChains = () => {
  //   const tempChain = sourceChain;
  //   setSourceChain(destinationChain);
  //   setDestinationChain(tempChain);
  //   // Tokens will auto-update via the useEffect hooks
  // };

  // const connectWallet = (providerId: string) => {
  //   setIsLoading(true);

  //   // Simulate wallet connection
  //   setTimeout(() => {
  //     setIsWalletConnected(true);
  //     setWalletAddress('0x1234...5678');
  //     setWalletBalance('1.25 ETH');
  //     setIsLoading(false);
  //     setIsConnectDialogOpen(false);
  //   }, 1500);
  // };

  // const disconnectWallet = () => {
  //   setIsWalletConnected(false);
  //   setWalletAddress('');
  //   setWalletBalance('0.0');
  // };

  // const copyAddress = () => {
  //   navigator.clipboard.writeText('0x1234567890abcdef1234567890abcdef12345678');
  //   // You could add a toast notification here
  // };

  // const shortenAddress = (addr?: `0x${string}`, chars = 4): string => {
  //   if (!addr || addr.length < chars * 2 + 2) return addr ?? '';
  //   return `${addr.slice(0, chars + 2)}...${addr.slice(-chars)}`;
  // };

  // const isSwapButtonDisabled =
  //   isLoading || !sourceAmount || Number.parseFloat(sourceAmount) <= 0;

  // ================================================
  // ================================================

  const {
    writeContract: approveToken,
    data: approveData,
    isPending: isPendingApprove,
  } = useWriteContract();

  const {
    writeContract: openIntent,
    data: openIntentData,
    isPending,
  } = useWriteContract();

  const {
    isSuccess: isConfirmed,
    isLoading: isLoadingAprrove,
    isError: isErrorSwap,
  } = useWaitForTransactionReceipt({
    hash: approveData,
  });

  const {
    isSuccess: isIntentSuccess,
    isLoading: isLoadingIntent,
    isError,
  } = useWaitForTransactionReceipt({
    hash: openIntentData,
  });

  useEffect(() => {
    if (isIntentSuccess) {
      setIsSuccessDialogOpen(true);
    }
  }, [isIntentSuccess]);

  const { address: wallet } = useAccount();

  const approveSwap = async (amount: string) => {
    try {
      const amountInWei = parseUnits(amount, 18); // Convert to correct decimals

      if (currentChain?.id == 11155111) {
        approveToken({
          address: sourceToken.address as `0x${string}`,
          abi: ERC20ABI,
          functionName: 'approve',
          args: ['0x1d42C61ca1D1bFe571b6B39C3404DB03089af3f2', amountInWei],
        });
      }
      if (currentChain?.id == 421614) {
        approveToken({
          address: sourceToken.address as `0x${string}`,
          abi: ERC20ABI,
          functionName: 'approve',
          args: ['0xAA9E0Df8224BfF453BC3afB1Fe1e9619d9224de6', amountInWei],
        });
      }
      console.log(`✅ Approved ${amount} tokens`);
      return true;
    } catch (error) {
      console.error('❌ Approval failed:', error);
      return false;
    }
  };

  const handleSwap = async () => {
    // struct OrderData {
    // bytes32 sender;
    // bytes32 recipient;
    // bytes32 inputToken;
    // bytes32 outputToken;
    // uint256 amountIn;
    // uint256 amountOut;
    // uint256 senderNonce;
    // uint32 originDomain;
    // uint32 destinationDomain;
    // bytes32 destinationSettler;
    // uint32 fillDeadline;
    // bytes data;

    // const orderData = encodeAbiParameters(
    //   [
    //     { name: 'sender', type: 'bytes32' },
    //     { name: 'recipient', type: 'bytes32' },
    //     { name: 'inputToken', type: 'bytes32' },
    //     { name: 'outputToken', type: 'bytes32' },
    //     { name: 'amountIn', type: 'uint256' },
    //     { name: 'amountOut', type: 'uint256' },
    //     { name: 'senderNonce', type: 'uint256' },
    //     { name: 'originDomain', type: 'uint32' },
    //     { name: 'destinationDomain', type: 'uint32' },
    //   ],
    //   [
    //     pad(wallet!),
    //     pad(wallet!),
    //     pad('0x930a3eE87F82134510a272655dfC0A7ae299B2Af'),
    //     pad('0x930a3eE87F82134510a272655dfC0A7ae299B2Af'),
    //     BigInt(1000),
    //     BigInt(900),
    //     BigInt(0),
    //     1000,
    //     10001,
    //   ]
    // );

    // console.log(orderData);

    // writeContract({
    //   address: '0x99b0f318977b115293535Bf484ee406EaBd2c4F1',
    //   abi: SpokeABI,
    //   functionName: 'open',
    //   value: BigInt(0),
    //   args: [
    //     [
    //       Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
    //       keccak256(toHex('orderData')),
    //       orderData,
    //     ],
    //   ],
    // });

    // console.log(wallet);
    // console.log(sourceToken.address);
    // console.log(destinationToken.address);

    const sender = wallet;
    const inputToken = sourceToken.address;
    const amountIn = parseUnits(sourceAmount, 18);
    const outputToken = destinationToken.address;
    const amountOut = parseUnits(destinationAmount, 18);

    console.log(currentChain);

    if (currentChain?.id == 11155111) {
      openIntent({
        address: '0x1d42C61ca1D1bFe571b6B39C3404DB03089af3f2',
        abi: SwapIntentABI,
        functionName: 'submitIntent',
        args: [sender, inputToken, amountIn, outputToken, amountOut],
      });
    }

    if (currentChain?.id == 421614) {
      openIntent({
        address: '0xAA9E0Df8224BfF453BC3afB1Fe1e9619d9224de6',
        abi: SwapIntentABI,
        functionName: 'submitIntent',
        args: [sender, inputToken, amountIn, outputToken, amountOut],
      });
    }
    console.log('handleSwap');

    // setTimeout(() => {
    //   const transactionHash =
    //     '0x' +
    //     Math.random().toString(16).substring(2, 10) +
    //     '...' +
    //     Math.random().toString(16).substring(2, 6);
    //   setTransactionHash(transactionHash);
    //   setIsSuccessDialogOpen(true);
    // }, 3000);
  };

  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  return (
    <Card className="w-full max-w-md border-slate-700 bg-slate-800 text-slate-100 shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">Swap</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog
            open={isHistoryDialogOpen}
            onOpenChange={setIsHistoryDialogOpen}
          >
            {/* The History Button */}
            {/* <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-slate-100 hover:bg-slate-700"
              >
                <Clock className="h-4 w-4" />
              </Button>
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-100">
              <DialogHeader>
                <DialogTitle>Transaction History</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Your recent cross-chain swap transactions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {isConnected ? (
                  <div className="space-y-4">
                    <div className="rounded-lg bg-slate-700 p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span>0.1 ETH → 0.099 ETH</span>
                            <span className="text-xs text-slate-400">
                              Arbitrum → Base
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-green-400">
                          Completed
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        2 hours ago •{' '}
                        <a href="#" className="text-primary">
                          View on Explorer
                        </a>
                      </div>
                    </div>
                    <div className="rounded-lg bg-slate-700 p-3">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <span>500 USDC → 499 USDC</span>
                            <span className="text-xs text-slate-400">
                              Ethereum → Polygon
                            </span>
                          </div>
                        </div>
                        <span className="text-xs text-green-400">
                          Completed
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        Yesterday •{' '}
                        <a href="#" className="text-primary">
                          View on Explorer
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="mb-4">
                      Connect your wallet to view transaction history
                    </p>
                    <div className="mt-4">
                      <CustomConnectButton />
                    </div>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <ConnectButton showBalance={false} accountStatus="address" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-4">
        {/* Source Chain and Token */}
        <div className="rounded-xl bg-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">From</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-slate-400">
                Balance: {isConnected ? balanceData?.formatted : ''}
                {sourceToken.symbol}
              </div>
              {/* <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-primary hover:bg-slate-600"
                onClick={handleMaxClick}
                disabled={!isConnected}
              >
                MAX
              </Button> */}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={sourceAmount}
              onChange={(e) => handleSourceAmountChange(e.target.value)}
              className="border-none bg-transparent text-2xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="0.0"
            />

            {/* Replace token dropdown with a static display */}
            <div className="flex items-center px-3 py-2 bg-slate-600 border border-slate-600 rounded-md">
              <Image
                src={sourceToken.logoUrl || '/placeholder.svg'}
                alt={sourceToken.symbol}
                width={20}
                height={20}
                className="mr-2 rounded-full"
              />
              <span>{sourceToken.symbol}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between bg-slate-600 hover:bg-slate-500 text-left h-8 px-3"
              >
                <div className="flex items-center">
                  <Image
                    src={sourceChain.logoUrl || '/placeholder.svg'}
                    alt={sourceChain.name}
                    width={16}
                    height={16}
                    className="mr-2 rounded-full"
                  />
                  <span className="text-sm">{sourceChain.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-700 border-slate-600">
              {chains.map((chain) => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => handleSourceChainChange(chain)}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer hover:bg-slate-600',
                    sourceChain.id === chain.id && 'bg-slate-600',
                    destinationChain.id === chain.id &&
                      'opacity-50 cursor-not-allowed'
                  )}
                  disabled={destinationChain.id === chain.id}
                >
                  <Image
                    src={chain.logoUrl || '/placeholder.svg'}
                    alt={chain.name}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <span>{chain.name}</span>
                  {destinationChain.id === chain.id && (
                    <span className="ml-auto text-xs text-slate-400">
                      (Selected as destination)
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Switch Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <Button
            variant="outline"
            size="icon"
            // className="rounded-full h-8 w-8 bg-slate-800 border-slate-700 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
            className="rounded-full h-8 w-8 bg-slate-800 border-slate-700"
            // onClick={switchChains}
            // onMouseEnter={() => setIsSwitchHovered(true)}
            // onMouseLeave={() => setIsSwitchHovered(false)}
          >
            {/* {isSwitchHovered ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )} */}
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>

        {/* Destination Chain and Token */}
        <div className="rounded-xl bg-slate-700 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-400">To (estimated)</div>
            <div className="flex items-center space-x-2">
              <div className="text-sm text-slate-400">
                Balance: {isConnected ? balance : ''} {sourceToken.symbol}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              type="number"
              value={destinationAmount}
              readOnly
              className="border-none bg-transparent text-2xl font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
              placeholder="0.0"
            />

            {/* Replace token dropdown with a static display */}
            <div className="flex items-center px-3 py-2 bg-slate-600 border border-slate-600 rounded-md">
              <Image
                src={destinationToken.logoUrl || '/placeholder.svg'}
                alt={destinationToken.symbol}
                width={20}
                height={20}
                className="mr-2 rounded-full"
              />
              <span>{destinationToken.symbol}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between bg-slate-600 hover:bg-slate-500 text-left h-8 px-3"
              >
                <div className="flex items-center">
                  <Image
                    src={destinationChain.logoUrl || '/placeholder.svg'}
                    alt={destinationChain.name}
                    width={16}
                    height={16}
                    className="mr-2 rounded-full"
                  />
                  <span className="text-sm">{destinationChain.name}</span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-slate-700 border-slate-600">
              {chains.map((chain) => (
                <DropdownMenuItem
                  key={chain.id}
                  onClick={() => handleDestinationChainChange(chain)}
                  className={cn(
                    'flex items-center gap-2 cursor-pointer hover:bg-slate-600',
                    destinationChain.id === chain.id && 'bg-slate-600',
                    sourceChain.id === chain.id &&
                      'opacity-50 cursor-not-allowed'
                  )}
                  disabled={sourceChain.id === chain.id}
                >
                  <Image
                    src={chain.logoUrl || '/placeholder.svg'}
                    alt={chain.name}
                    width={16}
                    height={16}
                    className="rounded-full"
                  />
                  <span>{chain.name}</span>
                  {sourceChain.id === chain.id && (
                    <span className="ml-auto text-xs text-slate-400">
                      (Selected as source)
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Swap Details */}
        <div className="space-y-2 text-sm">
          {/* <div className="flex justify-between items-center">
            <span className="text-slate-400">Rate</span>
            <span>
              1 {sourceToken.symbol} ≈ {exchangeRate} {destinationToken.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Estimated Gas</span>
            <span>{estimatedGas}</span>
          </div> */}
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Estimated Time</span>
            <span>{estimatedTime}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Route</span>
            <div className="flex items-center">
              <span>{sourceChain.name}</span>
              <ArrowRight className="h-3 w-3 mx-1" />
              <span>{destinationChain.name}</span>
              <Button
                variant="link"
                size="sm"
                className="h-4 p-0 ml-1 text-primary"
              >
                {/* <ExternalLink className="h-3 w-3" /> */}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {currentChain?.id === sourceChain.id ? (
          <Button
            className="w-full transition-transform duration-300 hover:scale-105"
            disabled={isLoadingAprrove || isLoadingIntent || isPendingApprove}
            onClick={async () => {
              // Handle not connected state
              if (!isConnected) return;

              if (!isConfirmed) approveSwap(sourceAmount);
              if (isConfirmed) handleSwap();
            }}
          >
            {isLoadingAprrove
              ? 'Approving'
              : isLoadingIntent
              ? 'Swapping...'
              : 'Swap Now'}
          </Button>
        ) : (
          <Button
            className="w-full transition-transform duration-300 hover:scale-105"
            onClick={async () => {
              try {
                // Try to switch to the correct chain
                switchChain({ chainId: sourceChain.id });

                return; // Exit early to let the chain switch take effect
              } catch (error) {
                console.error('Failed to switch chain:', error);
              }
            }}
          >
            Switch to {sourceChain.name}
          </Button>
        )}
      </CardFooter>
      {/* </Card> */}

      {/* Success Transaction Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent className="sm:max-w-md bg-slate-800 border-slate-700 text-slate-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span>Intent Submitted!</span>
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Your cross-chain swap is being processed.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-slate-700 p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">From</span>
                <span className="font-medium">
                  {sourceAmount} {sourceToken.symbol} ({sourceChain.name})
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">To</span>
                <span className="font-medium">
                  {destinationAmount} {destinationToken.symbol} (
                  {destinationChain.name})
                </span>
              </div>
              {/* <div className="flex justify-between items-center">
                <span className="text-slate-400">Transaction Hash</span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-xs">{transactionHash}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-slate-400 hover:text-slate-100"
                    onClick={() =>
                      navigator.clipboard.writeText(transactionHash)
                    }
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div> */}
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status</span>
                <span className="text-green-400 font-medium">Processed</span>
              </div>
            </div>

            <div className="flex justify-between gap-4">
              <Button
                variant="outline"
                className="flex-1 bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-slate-500"
                onClick={() => setIsSuccessDialogOpen(false)}
              >
                Close
              </Button>
              <Button
                className="flex-1 bg-primary transition-transform duration-300 hover:scale-105"
                onClick={() => {
                  window.open(
                    `https://sepolia.etherscan.io/tx/${transactionHash}`,
                    '_blank'
                  );
                }}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View on Explorer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* <Button onClick={() => setIsSuccessDialogOpen(true)} /> */}
    </Card>
  );
}

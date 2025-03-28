
import React, { FC, ReactNode, useMemo } from 'react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { 
  ConnectionProvider, 
  WalletProvider as SolanaWalletProvider, 
  useWallet 
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  CoinbaseWalletAdapter,
  LedgerWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { SOLANA_ENDPOINT } from '@/lib/solana';
import { toast } from "@/hooks/use-toast";

// Import Solana wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css';

interface WalletProviderProps {
  children: ReactNode;
}

// Wallet error handler component - moved inside the main provider component
const WalletProvider: FC<WalletProviderProps> = ({ children }) => {
  // Can be 'mainnet-beta', 'testnet', 'devnet', or 'localnet'
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => SOLANA_ENDPOINT, []);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new CoinbaseWalletAdapter(),
      new LedgerWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <SolanaWalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletConnectionErrorHandler />
          {children}
        </WalletModalProvider>
      </SolanaWalletProvider>
    </ConnectionProvider>
  );
};

// Error handler moved to be defined after the main component
// This ensures the proper React context is available for the hooks
const WalletConnectionErrorHandler: FC = () => {
  const { wallet, connecting, connected, disconnecting } = useWallet();
  
  React.useEffect(() => {
    const onError = (error: Error) => {
      console.error('Wallet connection error:', error);
      toast({
        title: "Wallet Connection Error",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    };

    if (wallet) {
      wallet.adapter.on('error', onError);
      
      // Show a successful connection message
      if (connected && !connecting && !disconnecting) {
        toast({
          title: "Wallet Connected",
          description: `Successfully connected to ${wallet.adapter.name}.`,
        });
      }
      
      return () => {
        wallet.adapter.off('error', onError);
      };
    }
  }, [wallet, connecting, connected, disconnecting]);

  return null;
};

export default WalletProvider;

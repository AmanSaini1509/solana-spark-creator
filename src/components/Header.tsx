
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getSOLBalance, shortenAddress } from '@/lib/solana';
import { Link, useLocation } from 'react-router-dom';
import { AlertCircle, Wallet, LogOut, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (!connected || !publicKey) {
        setSolBalance(null);
        return;
      }
      
      try {
        setIsBalanceLoading(true);
        setBalanceError(null);
        
        const balance = await getSOLBalance(publicKey);
        setSolBalance(balance);
      } catch (error) {
        console.error('Error fetching SOL balance:', error);
        setBalanceError('Failed to load balance');
        toast({
          title: "Error Loading Balance",
          description: "Could not fetch your SOL balance. Please check your connection.",
          variant: "destructive",
        });
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchBalance();
    
    // Set up interval to refresh balance every 15 seconds if connected
    const intervalId = setInterval(() => {
      if (connected && publicKey) {
        fetchBalance();
      }
    }, 15000);

    return () => clearInterval(intervalId);
  }, [connected, publicKey, toast]);

  const NavButton = ({ to, label }: { to: string; label: string }) => {
    const isActive = location.pathname === to;

    return (
      <Link to={to}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`text-white ${isActive ? "bg-solana-purple" : "hover:bg-solana-gray/30"}`}
        >
          {label}
        </Button>
      </Link>
    );
  };

  const copyAddressToClipboard = () => {
    if (!publicKey) return;
    
    navigator.clipboard.writeText(publicKey.toString()).then(() => {
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    });
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-solana-dark/80 border-b border-solana-gray/30 py-3">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="text-2xl font-bold text-transparent bg-clip-text bg-solana-gradient mr-2">
            Solana Spark
          </div>
          <div className="text-solana-light-gray text-xs">Creator</div>
        </div>

        <div className="flex gap-2 mb-4 sm:mb-0 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          <NavButton to="/" label="Home" />
          <NavButton to="/create" label="Create Token" />
          <NavButton to="/mint" label="Mint" />
          <NavButton to="/send" label="Send" />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          {connected && publicKey ? (
            <div className="flex items-center">
              <div 
                className="flex items-center gap-1 rounded-full px-3 py-1 bg-solana-gray/30 text-solana-light-gray cursor-pointer hover:bg-solana-gray/40"
                onClick={copyAddressToClipboard}
              >
                <span className="text-sm hidden sm:inline">{shortenAddress(publicKey.toString())}</span>
                <Copy className="h-3.5 w-3.5" />
              </div>
              
              {isBalanceLoading ? (
                <div className="text-sm rounded-full px-3 py-1 bg-solana-gray/30 text-solana-light-gray ml-2">
                  Loading...
                </div>
              ) : balanceError ? (
                <div className="text-sm rounded-full px-3 py-1 bg-red-900/30 text-red-300 ml-2 flex items-center">
                  <AlertCircle className="h-3.5 w-3.5 mr-1" />
                  Error
                </div>
              ) : (
                <div className="text-sm rounded-full px-3 py-1 bg-solana-purple/20 text-solana-light-gray ml-2 flex items-center">
                  <Wallet className="h-3.5 w-3.5 mr-1" />
                  {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : '0 SOL'}
                </div>
              )}
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-2 text-solana-light-gray hover:text-white hover:bg-red-900/30"
                onClick={() => disconnect()}
              >
                <LogOut className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/80 rounded-md" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

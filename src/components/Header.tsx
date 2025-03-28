
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getSOLBalance, shortenAddress } from '@/lib/solana';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { connected, publicKey } = useWallet();
  const [solBalance, setSolBalance] = useState<number | null>(null);
  const location = useLocation();
  
  useEffect(() => {
    const fetchBalance = async () => {
      if (connected && publicKey) {
        const balance = await getSOLBalance(publicKey);
        setSolBalance(balance);
      } else {
        setSolBalance(null);
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
  }, [connected, publicKey]);

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
          {connected && publicKey && (
            <div className="text-sm rounded-full px-3 py-1 bg-solana-gray/30 text-solana-light-gray">
              {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : 'Loading...'}
            </div>
          )}
          <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/80 rounded-md" />
        </div>
      </div>
    </header>
  );
};

export default Header;

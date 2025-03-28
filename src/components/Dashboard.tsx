
import React, { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { connected } = useWallet();

  const features = [
    {
      title: "Create Token",
      description: "Launch your own SPL token on Solana with just a few clicks",
      link: "/create",
      icon: "✨"
    },
    {
      title: "Mint Tokens",
      description: "Mint additional tokens to your wallet or other addresses",
      link: "/mint",
      icon: "🔨"
    },
    {
      title: "Send Tokens",
      description: "Transfer tokens to other wallets quickly and easily",
      link: "/send",
      icon: "📤"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient -z-10"></div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
          <span className="text-transparent bg-clip-text bg-solana-gradient">
            Solana Spark Creator
          </span>
        </h1>
        
        <p className="text-xl text-center text-solana-light-gray mb-8 max-w-2xl">
          Create, mint, and send Solana SPL tokens with a simple, intuitive interface.
          Connect your wallet to get started.
        </p>
        
        {!connected ? (
          <div className="glass-panel p-8 mb-8 text-center w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Connect Your Wallet</h2>
            <p className="text-solana-light-gray mb-6">
              Connect a Solana wallet like Phantom or Solflare to start creating and managing tokens.
            </p>
            <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/80" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            {features.map((feature, index) => (
              <Link to={feature.link} key={index} className="block h-full">
                <Card className="h-full glass-panel p-6 transition-all duration-200 hover:border-solana-purple/50 hover:shadow-lg hover:shadow-solana-purple/10">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-solana-light-gray mb-4">{feature.description}</p>
                  <Button variant="link" className="text-solana-purple p-0 flex items-center">
                    Get started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

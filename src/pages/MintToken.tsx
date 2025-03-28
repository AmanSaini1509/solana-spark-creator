
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mintTokens, shortenAddress } from '@/lib/solana';
import { PublicKey } from '@solana/web3.js';
import TransactionStatus from '@/components/TransactionStatus';
import { Card } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';

const MintToken = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const location = useLocation();
  
  // Get token mint from location state if available
  const defaultTokenMint = location.state?.tokenMint || '';
  
  const [tokenMint, setTokenMint] = useState(defaultTokenMint);
  const [amount, setAmount] = useState('1000');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const [txMessage, setTxMessage] = useState('');
  const [signature, setSignature] = useState('');

  const handleMintTokens = async () => {
    if (!publicKey || !signTransaction) return;

    try {
      setIsMinting(true);
      setStatus('processing');
      setTxMessage('Minting tokens...');

      const mintPublicKey = new PublicKey(tokenMint);
      const destination = destinationAddress 
        ? new PublicKey(destinationAddress) 
        : publicKey;

      const result = await mintTokens(
        { publicKey, signTransaction },
        mintPublicKey,
        destination,
        publicKey,
        parseInt(amount) * Math.pow(10, 9) // Assuming 9 decimals
      );

      if (result.success) {
        setStatus('success');
        setTxMessage(result.message);
        setSignature(result.signature);
      } else {
        setStatus('error');
        setTxMessage(result.message);
      }
    } catch (error) {
      console.error('Error minting tokens:', error);
      setStatus('error');
      setTxMessage(`Error minting tokens: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-solana-gradient">Mint SPL Tokens</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="glass-panel p-8">
          {!connected ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
              <p className="text-solana-light-gray mb-6">
                You need to connect your wallet to mint tokens.
              </p>
              <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/80 mx-auto" />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="tokenMint">Token Mint Address</Label>
                  <Input
                    id="tokenMint"
                    value={tokenMint}
                    onChange={(e) => setTokenMint(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="Enter the token mint address"
                  />
                  <p className="text-xs text-solana-light-gray mt-1">
                    The mint address of the token you want to mint.
                  </p>
                </div>

                <div>
                  <Label htmlFor="amount">Amount to Mint</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="1000"
                  />
                </div>

                <div>
                  <Label htmlFor="destination">
                    Destination Address (Optional)
                  </Label>
                  <Input
                    id="destination"
                    value={destinationAddress}
                    onChange={(e) => setDestinationAddress(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="Leave empty to mint to your wallet"
                  />
                  <p className="text-xs text-solana-light-gray mt-1">
                    If left empty, tokens will be minted to your connected wallet ({publicKey && shortenAddress(publicKey.toString())}).
                  </p>
                </div>

                <Button
                  onClick={handleMintTokens}
                  disabled={isMinting || !tokenMint || !amount || !connected}
                  className="w-full bg-solana-purple hover:bg-solana-purple/80"
                >
                  {isMinting ? "Minting..." : "Mint Tokens"}
                </Button>
              </div>

              <TransactionStatus status={status} message={txMessage} signature={signature} />

              {status === 'success' && (
                <div className="mt-6">
                  <Button className="w-full" asChild>
                    <Link to="/send" state={{ tokenMint }}>
                      Continue to Send Tokens
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MintToken;

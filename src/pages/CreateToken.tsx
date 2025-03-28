
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createSplToken } from '@/lib/solana';
import { PublicKey } from '@solana/web3.js';
import TransactionStatus from '@/components/TransactionStatus';
import { Card } from '@/components/ui/card';
import { ArrowRight, Copy } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const CreateToken = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const [decimals, setDecimals] = useState("9");
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const [txMessage, setTxMessage] = useState('');
  const [tokenMint, setTokenMint] = useState('');
  const { toast } = useToast();

  const handleCreateToken = async () => {
    if (!publicKey || !signTransaction) return;

    try {
      setIsCreating(true);
      setStatus('processing');
      setTxMessage('Creating your new SPL token...');

      const result = await createSplToken(
        { publicKey, signTransaction },
        publicKey,
        parseInt(decimals)
      );

      if (result.success) {
        setStatus('success');
        setTxMessage(result.message);
        setTokenMint(result.signature);
      } else {
        setStatus('error');
        setTxMessage(result.message);
      }
    } catch (error) {
      console.error('Error creating token:', error);
      setStatus('error');
      setTxMessage(`Error creating token: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copied!",
        description: "Token address copied to clipboard.",
      });
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-solana-gradient">Create SPL Token</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="glass-panel p-8">
          {!connected ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
              <p className="text-solana-light-gray mb-6">
                You need to connect your wallet to create a new SPL token.
              </p>
              <WalletMultiButton className="!bg-solana-purple hover:!bg-solana-purple/80 mx-auto" />
            </div>
          ) : (
            <>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="decimals">Token Decimals</Label>
                  <Input
                    id="decimals"
                    type="number"
                    min="0"
                    max="9"
                    value={decimals}
                    onChange={(e) => setDecimals(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="9"
                  />
                  <p className="text-xs text-solana-light-gray mt-1">
                    Most tokens use 9 decimals. This determines the smallest unit of your token (e.g., 0.000000001).
                  </p>
                </div>

                <Button
                  onClick={handleCreateToken}
                  disabled={isCreating || !connected}
                  className="w-full bg-solana-purple hover:bg-solana-purple/80"
                >
                  {isCreating ? "Creating..." : "Create Token"}
                </Button>
              </div>

              <TransactionStatus status={status} message={txMessage} signature={tokenMint} />

              {tokenMint && (
                <div className="mt-6 p-4 border border-solana-green/30 rounded-lg bg-solana-green/5">
                  <h3 className="font-medium mb-2">Token Created!</h3>
                  <div className="flex items-center">
                    <Input 
                      value={tokenMint} 
                      readOnly 
                      className="bg-solana-gray/20 border-solana-gray/30 text-white" 
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="ml-2" 
                      onClick={() => copyToClipboard(tokenMint)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-solana-light-gray mt-2">
                    This is your token's mint address. Save it for future use.
                  </p>
                  <div className="mt-4">
                    <Button className="w-full bg-solana-blue hover:bg-solana-blue/80" asChild>
                      <Link to="/mint" state={{ tokenMint }}>
                        Continue to Mint Tokens <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateToken;

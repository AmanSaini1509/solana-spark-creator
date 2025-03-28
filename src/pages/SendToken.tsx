
import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendTokens, shortenAddress } from '@/lib/solana';
import { PublicKey } from '@solana/web3.js';
import TransactionStatus from '@/components/TransactionStatus';
import { Card } from '@/components/ui/card';
import { useLocation } from 'react-router-dom';

const SendToken = () => {
  const { publicKey, signTransaction, connected } = useWallet();
  const location = useLocation();
  
  // Get token mint from location state if available
  const defaultTokenMint = location.state?.tokenMint || '';
  
  const [tokenMint, setTokenMint] = useState(defaultTokenMint);
  const [amount, setAmount] = useState('100');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | null>(null);
  const [txMessage, setTxMessage] = useState('');
  const [signature, setSignature] = useState('');

  const handleSendTokens = async () => {
    if (!publicKey || !signTransaction || !recipientAddress) return;

    try {
      setIsSending(true);
      setStatus('processing');
      setTxMessage('Sending tokens...');

      const mintPublicKey = new PublicKey(tokenMint);
      const recipient = new PublicKey(recipientAddress);

      const result = await sendTokens(
        { publicKey, signTransaction },
        mintPublicKey,
        publicKey,
        recipient,
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
      console.error('Error sending tokens:', error);
      setStatus('error');
      setTxMessage(`Error sending tokens: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-solana-gradient">Send SPL Tokens</h1>
      
      <div className="max-w-2xl mx-auto">
        <Card className="glass-panel p-8">
          {!connected ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-medium mb-4">Connect Your Wallet</h2>
              <p className="text-solana-light-gray mb-6">
                You need to connect your wallet to send tokens.
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
                </div>

                <div>
                  <Label htmlFor="recipient">Recipient Address</Label>
                  <Input
                    id="recipient"
                    value={recipientAddress}
                    onChange={(e) => setRecipientAddress(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="Enter the recipient's wallet address"
                  />
                </div>

                <div>
                  <Label htmlFor="amount">Amount to Send</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="mt-1 bg-solana-gray/20 border-solana-gray/30 text-white"
                    placeholder="100"
                  />
                </div>

                <Button
                  onClick={handleSendTokens}
                  disabled={isSending || !tokenMint || !amount || !recipientAddress || !connected}
                  className="w-full bg-solana-purple hover:bg-solana-purple/80"
                >
                  {isSending ? "Sending..." : "Send Tokens"}
                </Button>
              </div>

              <TransactionStatus status={status} message={txMessage} signature={signature} />
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SendToken;


import React from 'react';
import { Loader, CheckCircle, XCircle, ArrowUpRight } from 'lucide-react';
import { exploreTransaction } from '@/lib/solana';

export type TransactionStatus = 'processing' | 'success' | 'error' | null;

interface TransactionStatusProps {
  status: TransactionStatus;
  message?: string;
  signature?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ 
  status, 
  message,
  signature 
}) => {
  if (!status) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="h-5 w-5 text-solana-blue animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-solana-green" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return null;
    }
  };

  const getBgColor = () => {
    switch (status) {
      case 'processing':
        return 'bg-solana-blue/10';
      case 'success':
        return 'bg-solana-green/10';
      case 'error':
        return 'bg-destructive/10';
      default:
        return 'bg-solana-gray/20';
    }
  };

  return (
    <div className={`rounded-lg ${getBgColor()} p-4 my-4`}>
      <div className="flex items-center">
        {getStatusIcon()}
        <span className="ml-2 font-medium">
          {status === 'processing' && 'Processing transaction...'}
          {status === 'success' && 'Transaction successful!'}
          {status === 'error' && 'Transaction failed'}
        </span>
      </div>
      
      {message && <p className="mt-2 text-sm text-solana-light-gray">{message}</p>}
      
      {signature && status === 'success' && (
        <a 
          href={exploreTransaction(signature)} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-2 text-sm flex items-center text-solana-blue hover:underline"
        >
          View on Solana Explorer
          <ArrowUpRight className="ml-1 h-3 w-3" />
        </a>
      )}
    </div>
  );
};

export default TransactionStatus;


import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  transfer,
} from '@solana/spl-token';

// Default to devnet for development
export const SOLANA_NETWORK = "devnet";
export const SOLANA_ENDPOINT = `https://api.${SOLANA_NETWORK}.solana.com`;

export const connection = new Connection(SOLANA_ENDPOINT);

export async function createSplToken(
  payer: any,
  mintAuthority: PublicKey,
  decimals: number = 9
) {
  try {
    const tokenMint = await createMint(
      connection,
      payer,
      mintAuthority,
      mintAuthority,
      decimals
    );

    return {
      success: true,
      message: "Token created successfully",
      signature: tokenMint.toBase58(),
    };
  } catch (error) {
    console.error("Error creating token:", error);
    return {
      success: false,
      message: `Error creating token: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function mintTokens(
  payer: any,
  mint: PublicKey,
  destination: PublicKey,
  authority: PublicKey,
  amount: number
) {
  try {
    // Get or create the associated token account for the destination
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    // Mint tokens to the associated token account
    const signature = await mintTo(
      connection,
      payer,
      mint,
      tokenAccount.address,
      authority,
      amount
    );

    return {
      success: true,
      message: "Tokens minted successfully",
      signature,
      tokenAccount: tokenAccount.address.toBase58(),
    };
  } catch (error) {
    console.error("Error minting tokens:", error);
    return {
      success: false,
      message: `Error minting tokens: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function sendTokens(
  payer: any,
  mint: PublicKey,
  source: PublicKey,
  destination: PublicKey,
  amount: number
) {
  try {
    // Get or create the associated token account for the source
    const sourceTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      source
    );

    // Get or create the associated token account for the destination
    const destinationTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      payer,
      mint,
      destination
    );

    // Transfer tokens from source to destination
    const signature = await transfer(
      connection,
      payer,
      sourceTokenAccount.address,
      destinationTokenAccount.address,
      source,
      amount
    );

    return {
      success: true,
      message: "Tokens sent successfully",
      signature,
    };
  } catch (error) {
    console.error("Error sending tokens:", error);
    return {
      success: false,
      message: `Error sending tokens: ${error instanceof Error ? error.message : "Unknown error"}`,
    };
  }
}

export async function getSOLBalance(publicKey: PublicKey): Promise<number> {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error("Error fetching SOL balance:", error);
    return 0;
  }
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export const exploreTransaction = (signature: string): string => {
  return `https://explorer.solana.com/tx/${signature}?cluster=${SOLANA_NETWORK}`;
};

export const exploreAddress = (address: string): string => {
  return `https://explorer.solana.com/address/${address}?cluster=${SOLANA_NETWORK}`;
};

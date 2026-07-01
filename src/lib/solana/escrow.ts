import { Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";

/**
 * Client-side escrow helpers for Blingbids.com
 * Interfaces with the blingbids_escrow Anchor program
 */

export const BLINGBIDS_PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_ESCROW_PROGRAM_ID ?? "Bling1111111111111111111111111111111111111"
);

export const BOOST_FUND_PDA_SEED = "boost_fund";
export const ESCROW_PDA_SEED = "escrow";
export const AUCTION_PDA_SEED = "auction";

export interface EscrowConfig {
  sellerFeeBps: number;      // 700-1000 (7-10%)
  buyerFeeBps: number;       // 100-200 (1-2%)
  boostFundRerouteBps: number; // 2500 (25%)
  inspectionPeriodDays: number; // 7
}

export const DEFAULT_ESCROW_CONFIG: EscrowConfig = {
  sellerFeeBps: 800,
  buyerFeeBps: 150,
  boostFundRerouteBps: 2500,
  inspectionPeriodDays: 7,
};

export async function placeBidTx(
  connection: Connection,
  program: Program,
  auctionId: string,
  bidder: PublicKey,
  amountLamports: number
): Promise<Transaction> {
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(AUCTION_PDA_SEED), Buffer.from(auctionId)],
    program.programId
  );

  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(ESCROW_PDA_SEED), auctionPda.toBuffer()],
    program.programId
  );

  const tx = await program.methods
    .placeBid(new BN(amountLamports))
    .accounts({
      auction: auctionPda,
      escrow: escrowPda,
      bidder,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  return tx;
}

export async function releaseEscrowTx(
  program: Program,
  auctionId: string,
  buyer: PublicKey
): Promise<Transaction> {
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(AUCTION_PDA_SEED), Buffer.from(auctionId)],
    program.programId
  );

  const [escrowPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(ESCROW_PDA_SEED), auctionPda.toBuffer()],
    program.programId
  );

  const [boostFundPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(BOOST_FUND_PDA_SEED)],
    program.programId
  );

  return program.methods
    .releaseEscrow()
    .accounts({
      auction: auctionPda,
      escrow: escrowPda,
      boostFund: boostFundPda,
      buyer,
    })
    .transaction();
}

export function createReadOnlyProvider(connection: Connection): AnchorProvider {
  return new AnchorProvider(connection, {} as AnchorProvider["wallet"], {
    commitment: "confirmed",
  });
}
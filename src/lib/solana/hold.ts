import { PublicKey, Transaction } from "@solana/web3.js";
import { Program, BN } from "@coral-xyz/anchor";
import type { HoldAction } from "@/lib/types";

const HOLD_ACTION_MAP: Record<HoldAction, number> = {
  "accept-now": 0,
  "pause-hold": 1,
  "extend-supply": 2,
  "add-matching": 3,
};

const AUCTION_PDA_SEED = "auction";

/**
 * Seller HOLD controls — logged on-chain for transparency
 */
export async function executeHoldActionTx(
  program: Program,
  auctionId: string,
  seller: PublicKey,
  action: HoldAction,
  extensionSeconds?: number
): Promise<Transaction> {
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(AUCTION_PDA_SEED), Buffer.from(auctionId)],
    program.programId
  );

  const holdType = HOLD_ACTION_MAP[action];

  return program.methods
    .sellerHold(holdType, extensionSeconds ? new BN(extensionSeconds) : null)
    .accounts({
      auction: auctionPda,
      seller,
    })
    .transaction();
}

export async function setReservePriceTx(
  program: Program,
  auctionId: string,
  seller: PublicKey,
  hiddenReserve: number,
  visibleTarget: number
): Promise<Transaction> {
  const [auctionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from(AUCTION_PDA_SEED), Buffer.from(auctionId)],
    program.programId
  );

  return program.methods
    .setPricing(new BN(hiddenReserve), new BN(visibleTarget))
    .accounts({
      auction: auctionPda,
      seller,
    })
    .transaction();
}
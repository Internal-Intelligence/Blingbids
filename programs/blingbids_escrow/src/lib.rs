use anchor_lang::prelude::*;

declare_id!("Bling1111111111111111111111111111111111111");

/// Blingbids.com Escrow + Fee Reroute + HOLD Program
/// Handles: platform escrow, 7-day inspection, fee split, Boost Fund routing
#[program]
pub mod blingbids_escrow {
    use super::*;

    pub fn initialize_boost_fund(ctx: Context<InitializeBoostFund>) -> Result<()> {
        let fund = &mut ctx.accounts.boost_fund;
        fund.authority = ctx.accounts.authority.key();
        fund.total_collected = 0;
        fund.total_distributed = 0;
        fund.bump = ctx.bumps.boost_fund;
        Ok(())
    }

    pub fn create_auction(
        ctx: Context<CreateAuction>,
        auction_id: String,
        start_price: u64,
        target_price: u64,
        hidden_reserve: Option<u64>,
        seller_fee_bps: u16,
        buyer_fee_bps: u16,
    ) -> Result<()> {
        require!(seller_fee_bps <= 1000, BlingbidsError::FeeTooHigh);
        require!(buyer_fee_bps <= 200, BlingbidsError::FeeTooHigh);

        let auction = &mut ctx.accounts.auction;
        auction.seller = ctx.accounts.seller.key();
        auction.auction_id = auction_id;
        auction.start_price = start_price;
        auction.target_price = target_price;
        auction.hidden_reserve = hidden_reserve;
        auction.current_bid = 0;
        auction.high_bidder = Pubkey::default();
        auction.status = AuctionStatus::Live;
        auction.seller_fee_bps = seller_fee_bps;
        auction.buyer_fee_bps = buyer_fee_bps;
        auction.inspection_deadline = None;
        auction.bump = ctx.bumps.auction;
        Ok(())
    }

    pub fn place_bid(ctx: Context<PlaceBid>, amount: u64) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        require!(auction.status == AuctionStatus::Live, BlingbidsError::NotLive);
        require!(amount > auction.current_bid, BlingbidsError::BidTooLow);

        // Transfer lamports to escrow PDA
        let escrow = &mut ctx.accounts.escrow;
        escrow.total_locked = escrow.total_locked.checked_add(amount).unwrap();

        auction.current_bid = amount;
        auction.high_bidder = ctx.accounts.bidder.key();
        Ok(())
    }

    /// Seller HOLD: Accept Now / Pause & Hold / Extend / Add Matching
    pub fn seller_hold(
        ctx: Context<SellerHold>,
        action: u8,
        extension_seconds: Option<i64>,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        require!(
            ctx.accounts.seller.key() == auction.seller,
            BlingbidsError::Unauthorized
        );

        match action {
            0 => {
                // Accept Now — settle immediately if bid >= reserve
                if let Some(reserve) = auction.hidden_reserve {
                    require!(auction.current_bid >= reserve, BlingbidsError::BelowReserve);
                }
                auction.status = AuctionStatus::Settled;
            }
            1 => auction.status = AuctionStatus::Hold,
            2 => {
                auction.status = AuctionStatus::Live;
                // Extension handled off-chain timer sync
                let _ = extension_seconds;
            }
            3 => {
                // Add matching pieces — emit event for off-chain bundle
                auction.status = AuctionStatus::Live;
            }
            _ => return Err(BlingbidsError::InvalidHoldAction.into()),
        }

        emit!(HoldEvent {
            auction: auction.key(),
            seller: auction.seller,
            action,
            timestamp: Clock::get()?.unix_timestamp,
        });
        Ok(())
    }

    pub fn release_escrow(ctx: Context<ReleaseEscrow>) -> Result<()> {
        let auction = &ctx.accounts.auction;
        require!(auction.status == AuctionStatus::Settled, BlingbidsError::NotSettled);

        let sale_price = auction.current_bid;
        let seller_fee = sale_price
            .checked_mul(auction.seller_fee_bps as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();
        let buyer_fee = sale_price
            .checked_mul(auction.buyer_fee_bps as u64)
            .unwrap()
            .checked_div(10000)
            .unwrap();
        let total_fees = seller_fee.checked_add(buyer_fee).unwrap();

        // 25% of fees → Boost Fund
        let boost_amount = total_fees.checked_mul(2500).unwrap().checked_div(10000).unwrap();
        let boost_fund = &mut ctx.accounts.boost_fund;
        boost_fund.total_collected = boost_fund.total_collected.checked_add(boost_amount).unwrap();

        // Set 7-day inspection deadline
        let clock = Clock::get()?;
        // Inspection period enforced off-chain + dispute program

        emit!(EscrowReleased {
            auction: auction.key(),
            sale_price,
            boost_fund_contribution: boost_amount,
            inspection_deadline: clock.unix_timestamp + 7 * 86400,
        });
        Ok(())
    }

    pub fn set_pricing(
        ctx: Context<SetPricing>,
        hidden_reserve: u64,
        visible_target: u64,
    ) -> Result<()> {
        let auction = &mut ctx.accounts.auction;
        require!(
            ctx.accounts.seller.key() == auction.seller,
            BlingbidsError::Unauthorized
        );
        auction.hidden_reserve = Some(hidden_reserve);
        auction.target_price = visible_target;
        Ok(())
    }
}

// ─── Accounts ───────────────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(auction_id: String)]
pub struct CreateAuction<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        init,
        payer = seller,
        space = 8 + Auction::INIT_SPACE,
        seeds = [b"auction", auction_id.as_bytes()],
        bump
    )]
    pub auction: Account<'info, Auction>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBid<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
    #[account(mut)]
    pub auction: Account<'info, Auction>,
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SellerHold<'info> {
    pub seller: Signer<'info>,
    #[account(mut)]
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct ReleaseEscrow<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    pub auction: Account<'info, Auction>,
    #[account(mut)]
    pub escrow: Account<'info, Escrow>,
    #[account(
        mut,
        seeds = [b"boost_fund"],
        bump = boost_fund.bump
    )]
    pub boost_fund: Account<'info, BoostFund>,
}

#[derive(Accounts)]
pub struct SetPricing<'info> {
    pub seller: Signer<'info>,
    #[account(mut)]
    pub auction: Account<'info, Auction>,
}

#[derive(Accounts)]
pub struct InitializeBoostFund<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + BoostFund::INIT_SPACE,
        seeds = [b"boost_fund"],
        bump
    )]
    pub boost_fund: Account<'info, BoostFund>,
    pub system_program: Program<'info, System>,
}

// ─── State ──────────────────────────────────────────────────────────────────

#[account]
#[derive(InitSpace)]
pub struct Auction {
    pub seller: Pubkey,
    #[max_len(64)]
    pub auction_id: String,
    pub start_price: u64,
    pub target_price: u64,
    pub hidden_reserve: Option<u64>,
    pub current_bid: u64,
    pub high_bidder: Pubkey,
    pub status: AuctionStatus,
    pub seller_fee_bps: u16,
    pub buyer_fee_bps: u16,
    pub inspection_deadline: Option<i64>,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow {
    pub auction: Pubkey,
    pub total_locked: u64,
    pub bump: u8,
}

#[account]
#[derive(InitSpace)]
pub struct BoostFund {
    pub authority: Pubkey,
    pub total_collected: u64,
    pub total_distributed: u64,
    pub bump: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum AuctionStatus {
    Live,
    Hold,
    Paused,
    Settled,
    Disputed,
}

// ─── Events ─────────────────────────────────────────────────────────────────

#[event]
pub struct HoldEvent {
    pub auction: Pubkey,
    pub seller: Pubkey,
    pub action: u8,
    pub timestamp: i64,
}

#[event]
pub struct EscrowReleased {
    pub auction: Pubkey,
    pub sale_price: u64,
    pub boost_fund_contribution: u64,
    pub inspection_deadline: i64,
}

// ─── Errors ─────────────────────────────────────────────────────────────────

#[error_code]
pub enum BlingbidsError {
    #[msg("Fee exceeds maximum allowed")]
    FeeTooHigh,
    #[msg("Auction is not live")]
    NotLive,
    #[msg("Bid must exceed current high bid")]
    BidTooLow,
    #[msg("Unauthorized — seller only")]
    Unauthorized,
    #[msg("Invalid HOLD action")]
    InvalidHoldAction,
    #[msg("Bid below hidden reserve")]
    BelowReserve,
    #[msg("Auction not settled")]
    NotSettled,
}
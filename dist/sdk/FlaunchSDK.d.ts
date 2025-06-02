import { Drift, HexString, ReadWriteAdapter, type Address } from "@delvtech/drift";
import { Hex } from "viem";
import { ReadFlaunchPositionManager, ReadWriteFlaunchPositionManager, WatchPoolCreatedParams, WatchPoolSwapParams as WatchPoolSwapParamsPositionManager } from "../clients/FlaunchPositionManagerClient";
import { ReadPoolManager, PositionInfoParams } from "../clients/PoolManagerClient";
import { ReadStateView } from "../clients/StateViewClient";
import { ReadFairLaunch } from "../clients/FairLaunchClient";
import { ReadBidWall } from "../clients/BidWallClient";
import { AnyBidWall } from "../clients/AnyBidWall";
import { ReadFlaunchZap, ReadWriteFlaunchZap, FlaunchParams, FlaunchIPFSParams, FlaunchWithRevenueManagerParams, FlaunchWithRevenueManagerIPFSParams } from "../clients/FlaunchZapClient";
import { ReadFlaunch } from "../clients/FlaunchClient";
import { ReadQuoter } from "clients/QuoterClient";
import { ReadPermit2, ReadWritePermit2 } from "clients/Permit2Client";
import { ReadFlaunchPositionManagerV1_1, ReadWriteFlaunchPositionManagerV1_1 } from "clients/FlaunchPositionManagerV1_1Client";
import { AnyFlaunchParams, ReadAnyPositionManager, ReadWriteAnyPositionManager } from "clients/AnyPositionManagerClient";
import { ReadFeeEscrow, ReadWriteFeeEscrow } from "clients/FeeEscrowClient";
import { ReadReferralEscrow, ReadWriteReferralEscrow } from "clients/ReferralEscrowClient";
import { ReadBidWallV1_1 } from "clients/BidWallV1_1Client";
import { ReadFairLaunchV1_1 } from "clients/FairLaunchV1_1Client";
import { ReadFlaunchV1_1 } from "clients/FlaunchV1_1Client";
import { ReadWriteTreasuryManagerFactory } from "clients/TreasuryManagerFactoryClient";
import { CoinMetadata, FlaunchVersion } from "types";
import { PermitSingle } from "utils/universalRouter";
type WatchPoolSwapParams = Omit<WatchPoolSwapParamsPositionManager<boolean>, "flETHIsCurrencyZero"> & {
    filterByCoin?: Address;
};
type GenericBaseSwapLog = {
    timestamp: number;
    transactionHash: Hex;
    blockNumber: bigint;
    args: any;
};
type GenericBuySwapLog = GenericBaseSwapLog & {
    type: "BUY";
    delta: {
        coinsBought: bigint;
        flETHSold: bigint;
        fees: {
            isInFLETH: boolean;
            amount: bigint;
        };
    };
};
type GenericSellSwapLog = GenericBaseSwapLog & {
    type: "SELL";
    delta: {
        coinsSold: bigint;
        flETHBought: bigint;
        fees: {
            isInFLETH: boolean;
            amount: bigint;
        };
    };
};
type BuyCoinBase = {
    coinAddress: Address;
    slippagePercent: number;
    referrer?: Address;
};
type BuyCoinExactInParams = BuyCoinBase & {
    swapType: "EXACT_IN";
    amountIn: bigint;
    amountOutMin?: bigint;
};
type BuyCoinExactOutParams = BuyCoinBase & {
    swapType: "EXACT_OUT";
    amountOut: bigint;
    amountInMax?: bigint;
};
type BuyCoinParams = BuyCoinExactInParams | BuyCoinExactOutParams;
type SellCoinParams = {
    coinAddress: Address;
    amountIn: bigint;
    slippagePercent: number;
    ethOutMin?: bigint;
    referrer?: Address;
    permitSingle?: PermitSingle;
    signature?: HexString;
};
/**
 * Base class for interacting with Flaunch protocol in read-only mode
 */
export declare class ReadFlaunchSDK {
    readonly drift: Drift;
    readonly chainId: number;
    readonly TICK_SPACING = 60;
    readonly readPositionManager: ReadFlaunchPositionManager;
    readonly readPositionManagerV1_1: ReadFlaunchPositionManagerV1_1;
    readonly readAnyPositionManager: ReadAnyPositionManager;
    readonly readFeeEscrow: ReadFeeEscrow;
    readonly readReferralEscrow: ReadReferralEscrow;
    readonly readFlaunchZap: ReadFlaunchZap;
    readonly readPoolManager: ReadPoolManager;
    readonly readStateView: ReadStateView;
    readonly readFairLaunch: ReadFairLaunch;
    readonly readFairLaunchV1_1: ReadFairLaunchV1_1;
    readonly readBidWall: ReadBidWall;
    readonly readAnyBidWall: AnyBidWall;
    readonly readBidWallV1_1: ReadBidWallV1_1;
    readonly readFlaunch: ReadFlaunch;
    readonly readFlaunchV1_1: ReadFlaunchV1_1;
    readonly readQuoter: ReadQuoter;
    readonly readPermit2: ReadPermit2;
    resolveIPFS: (value: string) => string;
    constructor(chainId: number, drift?: Drift);
    /**
     * Checks if a given coin address is a valid Flaunch coin (supports all versions)
     * @param coinAddress - The address of the coin to check
     * @returns Promise<boolean> - True if the coin is valid, false otherwise
     */
    isValidCoin(coinAddress: Address): Promise<boolean>;
    /**
     * Determines the version of a Flaunch coin
     * @param coinAddress - The address of the coin to check
     * @returns Promise<FlaunchVersion> - The version of the coin
     */
    getCoinVersion(coinAddress: Address): Promise<FlaunchVersion>;
    /**
     * Gets the position manager address for a given version
     * @param version - The version to get the position manager address for
     */
    getPositionManager(version: FlaunchVersion): ReadFlaunchPositionManager | ReadFlaunchPositionManagerV1_1 | ReadAnyPositionManager;
    /**
     * Gets the fair launch address for a given version
     * @param version - The version to get the fair launch address for
     */
    getFairLaunch(version: FlaunchVersion): ReadFairLaunch | ReadFairLaunchV1_1;
    /**
     * Gets the bid wall address for a given version
     * @param version - The version to get the bid wall address for
     */
    getBidWall(version: FlaunchVersion): ReadBidWall | AnyBidWall | ReadBidWallV1_1;
    getPositionManagerAddress(version: FlaunchVersion): `0x${string}`;
    getFairLaunchAddress(version: FlaunchVersion): `0x${string}`;
    getBidWallAddress(version: FlaunchVersion): `0x${string}`;
    /**
     * Retrieves metadata for a given Flaunch coin
     * @param coinAddress - The address of the coin
     * @returns Promise<CoinMetadata & { symbol: string }> - The coin's metadata including name, symbol, description, and social links
     */
    getCoinMetadata(coinAddress: Address): Promise<CoinMetadata & {
        symbol: string;
    }>;
    /**
     * Retrieves metadata for a given Flaunch coin using its token ID & Flaunch contract address
     * @param flaunch - The address of the Flaunch contract
     * @param tokenId - The token ID of the coin
     * @returns The coin's metadata including name, symbol, description, and social links
     */
    getCoinMetadataFromTokenId(flaunch: Address, tokenId: bigint): Promise<CoinMetadata & {
        symbol: string;
    }>;
    /**
     * Retrieves metadata for multiple Flaunch coins using their token IDs & Flaunch contract addresses
     * @param params - An array of objects containing flaunch contract address and token ID
     * @param batchSize - Optional, the number of ipfs requests to process in each batch
     * @param batchDelay - Optional, the delay in milliseconds between batches
     * @returns An array of objects containing coin address, name, symbol, description, and social links
     */
    getCoinMetadataFromTokenIds(params: {
        flaunch: Address;
        tokenId: bigint;
    }[], batchSize?: number, batchDelay?: number): Promise<{
        coinAddress: Address;
        name: string;
        symbol: string;
        description: any;
        image: string;
        external_link: any;
        collaborators: any;
        discordUrl: any;
        twitterUrl: any;
        telegramUrl: any;
    }[]>;
    /**
     * Watches for pool creation events
     * @param params - Parameters for watching pool creation
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Subscription to pool creation events
     */
    watchPoolCreated(params: WatchPoolCreatedParams, version?: FlaunchVersion): Promise<{
        cleanup: () => void;
        pollPoolCreatedNow: () => Promise<void>;
    }>;
    /**
     * Polls for current pool creation events
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Current pool creation events or undefined if polling is not available
     */
    pollPoolCreatedNow(version?: FlaunchVersion): Promise<void> | undefined;
    /**
     * Watches for pool swap events
     * @param params - Parameters for watching pool swaps including optional coin filter
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Subscription to pool swap events
     */
    watchPoolSwap(params: WatchPoolSwapParams, version?: FlaunchVersion): Promise<{
        cleanup: () => void;
        pollPoolSwapNow: () => Promise<void>;
    }>;
    /**
     * Polls for current pool swap events
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Current pool swap events or undefined if polling is not available
     */
    pollPoolSwapNow(version?: FlaunchVersion): Promise<void> | undefined;
    /**
     * Gets information about a liquidity position
     * @param params - Parameters for querying position info
     * @returns Position information from the state view contract
     */
    positionInfo(params: PositionInfoParams): Promise<{
        liquidity: bigint;
        feeGrowthInside0LastX128: bigint;
        feeGrowthInside1LastX128: bigint;
    } | {
        liquidity: bigint;
        feeGrowthInside0LastX128: bigint;
        feeGrowthInside1LastX128: bigint;
    }>;
    /**
     * Gets the current tick for a given coin's pool
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The current tick of the pool
     */
    currentTick(coinAddress: Address, version?: FlaunchVersion): Promise<number>;
    /**
     * Calculates the coin price in ETH based on the current tick
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<string> - The price of the coin in ETH with 18 decimals precision
     */
    coinPriceInETH(coinAddress: Address, version?: FlaunchVersion): Promise<string>;
    /**
     * Calculates the coin price in USD based on the current ETH/USDC price
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<string> - The price of the coin in USD with 2 decimal precision
     */
    coinPriceInUSD({ coinAddress, version, drift, }: {
        coinAddress: Address;
        version?: FlaunchVersion;
        drift?: Drift;
    }): Promise<string>;
    coinMarketCapInUSD({ coinAddress, version, drift, }: {
        coinAddress: Address;
        version?: FlaunchVersion;
        drift?: Drift;
    }): Promise<string>;
    /**
     * Gets the current ETH/USDC price
     * @param drift - Optional drift instance to get price from Base Mainnet
     * @returns Promise<number> - The current ETH/USDC price
     */
    getETHUSDCPrice(drift?: Drift): Promise<number>;
    initialSqrtPriceX96(params: {
        coinAddress: Address;
        initialMarketCapUSD: number;
    }): Promise<bigint>;
    /**
     * Gets information about a fair launch for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Fair launch information from the appropriate contract version
     */
    fairLaunchInfo(coinAddress: Address, version?: FlaunchVersion): Promise<{
        startsAt: bigint;
        endsAt: bigint;
        initialTick: number;
        revenue: bigint;
        supply: bigint;
        closed: boolean;
    }>;
    /**
     * Checks if a fair launch is currently active for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<boolean> - True if fair launch is active, false otherwise
     */
    isFairLaunchActive(coinAddress: Address, version?: FlaunchVersion): Promise<boolean>;
    /**
     * Gets the duration of a fair launch for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The duration in seconds (30 minutes for V1, variable for V1.1)
     */
    fairLaunchDuration(coinAddress: Address, version?: FlaunchVersion): Promise<number | bigint>;
    /**
     * Gets the initial tick for a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The initial tick value
     */
    initialTick(coinAddress: Address, version?: FlaunchVersion): Promise<number>;
    /**
     * Gets information about the ETH-only position in a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, tickLower: number, tickUpper: number}> - Position details
     */
    fairLaunchETHOnlyPosition(coinAddress: Address, version?: FlaunchVersion): Promise<{
        flETHAmount: bigint;
        coinAmount: bigint;
        tickLower: number;
        tickUpper: number;
    }>;
    /**
     * Gets information about the coin-only position in a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, tickLower: number, tickUpper: number}> - Position details
     */
    fairLaunchCoinOnlyPosition(coinAddress: Address, version?: FlaunchVersion): Promise<{
        flETHAmount: bigint;
        coinAmount: bigint;
        tickLower: number;
        tickUpper: number;
    }>;
    /**
     * Gets information about the bid wall position for a coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, pendingEth: bigint, tickLower: number, tickUpper: number}> - Bid wall position details
     */
    bidWallPosition(coinAddress: Address, version?: FlaunchVersion): Promise<{
        flETHAmount: bigint;
        coinAmount: bigint;
        pendingEth: bigint;
        tickLower: number;
        tickUpper: number;
    }>;
    /**
     * Gets the ETH balance for the creator to claim
     * @param creator - The address of the creator to check
     * @param isV1 - Optional boolean to check the balance for V1. V1.1 & AnyPositionManager use the same FeeEscrow contract
     * @returns The balance of the creator
     */
    creatorRevenue(creator: Address, isV1?: boolean): Promise<bigint>;
    /**
     * Gets the balance of a recipient for a given coin
     * @param recipient - The address of the recipient to check
     * @param coinAddress - The address of the coin
     * @returns Promise<bigint> - The balance of the recipient
     */
    referralBalance(recipient: Address, coinAddress: Address): Promise<bigint>;
    /**
     * Gets the claimable balance of ETH for the recipient from a revenue manager
     * @param params - Parameters for checking the balance
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.recipient - The address of the recipient to check
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    revenueManagerBalance(params: {
        revenueManagerAddress: Address;
        recipient: Address;
    }): Promise<bigint>;
    /**
     * Gets the claimable balance of ETH for the protocol from a revenue manager
     * @param revenueManagerAddress - The address of the revenue manager
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    revenueManagerProtocolBalance(revenueManagerAddress: Address): Promise<bigint>;
    /**
     * Gets the total number of tokens managed by a revenue manager
     * @param revenueManagerAddress - The address of the revenue manager
     * @returns Promise<bigint> - The total count of tokens
     */
    revenueManagerTokensCount(revenueManagerAddress: Address): Promise<bigint>;
    /**
     * Gets all tokens created by a specific creator address
     * @param params - Parameters for querying tokens by creator
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.creator - The address of the creator to query tokens for
     * @param params.sortByDesc - Whether to sort the tokens by descending order
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    revenueManagerAllTokensByCreator(params: {
        revenueManagerAddress: Address;
        creator: Address;
        sortByDesc?: boolean;
    }): Promise<readonly {
        flaunch: `0x${string}`;
        tokenId: bigint;
    }[]>;
    /**
     * Gets all tokens currently managed by a revenue manager
     * @param params - Parameters for querying tokens in manager
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    revenueManagerAllTokensInManager(params: {
        revenueManagerAddress: Address;
        sortByDesc?: boolean;
    }): Promise<{
        flaunch: `0x${string}`;
        tokenId: bigint;
    }[]>;
    /**
     * Gets the pool ID for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use
     * @returns Promise<string> - The pool ID
     */
    poolId(coinAddress: Address, version?: FlaunchVersion): Promise<`0x${string}`>;
    /**
     * Gets the flaunching fee for a given initial price and slippage percent
     * @param params.sender - The address of the sender
     * @param params.initialMarketCapUSD - The initial market cap in USD
     * @param params.slippagePercent - The slippage percent
     * @returns Promise<bigint> - The flaunching fee
     */
    getFlaunchingFee(params: {
        sender: Address;
        initialMarketCapUSD: number;
        slippagePercent?: number;
    }): Promise<bigint>;
    /**
     * Calculates the ETH required to flaunch a token, takes into account the ETH for premine and the flaunching fee
     * @param params.premineAmount - The amount of coins to be premined
     * @param params.initialMarketCapUSD - The initial market cap in USD
     * @param params.slippagePercent - The slippage percent
     * @returns Promise<bigint> - The ETH required to flaunch
     */
    ethRequiredToFlaunch(params: {
        premineAmount: bigint;
        initialMarketCapUSD: number;
        slippagePercent?: number;
    }): Promise<bigint>;
    /**
     * Gets a quote for selling an exact amount of tokens for ETH
     * @param coinAddress - The address of the token to sell
     * @param amountIn - The exact amount of tokens to sell
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The expected amount of ETH to receive
     */
    getSellQuoteExactInput(coinAddress: Address, amountIn: bigint, version?: FlaunchVersion): Promise<bigint>;
    /**
     * Gets a quote for buying tokens with an exact amount of ETH
     * @param coinAddress - The address of the token to buy
     * @param ethIn - The exact amount of ETH to spend
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The expected amount of tokens to receive
     */
    getBuyQuoteExactInput(coinAddress: Address, amountIn: bigint, version?: FlaunchVersion): Promise<bigint>;
    /**
     * Gets a quote for buying an exact amount of tokens with ETH
     * @param coinAddress - The address of the token to buy
     * @param coinOut - The exact amount of tokens to receive
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The required amount of ETH to spend
     */
    getBuyQuoteExactOutput(coinAddress: Address, amountOut: bigint, version?: FlaunchVersion): Promise<bigint>;
    /**
     * Determines if flETH is currency0 in the pool
     * @param coinAddress - The address of the coin
     * @returns boolean - True if flETH is currency0, false otherwise
     */
    flETHIsCurrencyZero(coinAddress: Address): boolean;
    /**
     * Sets a custom IPFS resolver function
     * @dev this is used to resolve IPFS hash to a gateway URL
     * eg: input: Qabc, output: https://ipfs.io/ipfs/Qabc
     * @param resolverFn - Custom function to resolve IPFS URIs
     */
    setIPFSResolver(resolverFn: (ipfsHash: string) => string): void;
    /**
     * Parses a transaction hash to extract PoolSwap events and return parsed swap data
     * @param params - Object containing parsing parameters
     * @param params.txHash - The transaction hash to parse
     * @param params.version - The Flaunch version to use for parsing
     * @param params.flETHIsCurrencyZero - Whether flETH is currency 0 in the pool (optional)
     * @returns Parsed swap log or undefined if no PoolSwap event found.
     *          If flETHIsCurrencyZero is provided, returns typed swap data with BUY/SELL information.
     *          If flETHIsCurrencyZero is undefined, returns basic swap log without parsed delta.
     */
    parseSwapTx<T extends boolean | undefined = undefined>(params: {
        txHash: Hex;
        version: FlaunchVersion;
        flETHIsCurrencyZero?: T;
    }): Promise<T extends boolean ? GenericBuySwapLog | GenericSellSwapLog | undefined : GenericBaseSwapLog | undefined>;
}
export declare class ReadWriteFlaunchSDK extends ReadFlaunchSDK {
    drift: Drift<ReadWriteAdapter>;
    readonly readWritePositionManager: ReadWriteFlaunchPositionManager;
    readonly readWritePositionManagerV1_1: ReadWriteFlaunchPositionManagerV1_1;
    readonly readWriteAnyPositionManager: ReadWriteAnyPositionManager;
    readonly readWriteFeeEscrow: ReadWriteFeeEscrow;
    readonly readWriteReferralEscrow: ReadWriteReferralEscrow;
    readonly readWriteFlaunchZap: ReadWriteFlaunchZap;
    readonly readWriteTreasuryManagerFactory: ReadWriteTreasuryManagerFactory;
    readonly readWritePermit2: ReadWritePermit2;
    constructor(chainId: number, drift?: Drift<ReadWriteAdapter>);
    /**
     * Deploys a new revenue manager
     * @param params - Parameters for deploying the revenue manager
     * @param params.protocolRecipient - The address of the protocol recipient
     * @param params.protocolFeePercent - The percentage of the protocol fee
     * @returns Address of the deployed revenue manager
     */
    deployRevenueManager(params: {
        protocolRecipient: Address;
        protocolFeePercent: number;
    }): Promise<Address>;
    /**
     * Creates a new Flaunch on the specified version
     * @param params - Parameters for creating the Flaunch
     * @returns Transaction response
     */
    flaunch(params: FlaunchParams): Promise<`0x${string}`>;
    /**
     * Creates a new Flaunch with IPFS metadata and optional version specification
     * @param params - Parameters for creating the Flaunch with IPFS data
     * @returns Transaction response
     */
    flaunchIPFS(params: FlaunchIPFSParams): Promise<`0x${string}`>;
    /**
     * Creates a new Flaunch with revenue manager configuration
     * @param params - Parameters for creating the Flaunch with revenue manager
     * @throws Error if FlaunchZap is not deployed on the current chain
     * @returns Transaction response
     */
    flaunchWithRevenueManager(params: FlaunchWithRevenueManagerParams): Promise<`0x${string}`>;
    /**
     * Creates a new Flaunch with revenue manager configuration and IPFS metadata
     * @param params - Parameters for creating the Flaunch with revenue manager and IPFS data
     * @throws Error if FlaunchZap is not deployed on the current chain
     * @returns Transaction response
     */
    flaunchIPFSWithRevenueManager(params: FlaunchWithRevenueManagerIPFSParams): Promise<`0x${string}`>;
    /**
     * Creates a new Flaunch with AnyPositionManager for external coins
     * @param params - Parameters for creating the Flaunch with AnyPositionManager
     * @returns Transaction response
     */
    anyFlaunch(params: AnyFlaunchParams): Promise<`0x${string}`>;
    /**
     * Gets the balance of a specific coin for the connected wallet
     * @param coinAddress - The address of the coin to check
     * @returns Promise<bigint> - The balance of the coin
     */
    coinBalance(coinAddress: Address): Promise<bigint>;
    /**
     * Buys a coin with ETH
     * @param params - Parameters for buying the coin including amount, slippage, and referrer
     * @param version - Optional specific version to use. If not provided, will determine automatically
     * @returns Transaction response for the buy operation
     */
    buyCoin(params: BuyCoinParams, version?: FlaunchVersion): Promise<`0x${string}`>;
    /**
     * Sells a coin for ETH
     * @param params - Parameters for selling the coin including amount, slippage, permit data, and referrer
     * @param version - Optional specific version to use. If not provided, will determine automatically
     * @returns Transaction response for the sell operation
     */
    sellCoin(params: SellCoinParams, version?: FlaunchVersion): Promise<`0x${string}`>;
    /**
     * Gets the typed data for a Permit2 signature
     * @param coinAddress - The address of the coin to permit
     * @param deadline - Optional deadline for the permit (defaults to 10 years)
     * @returns The typed data object for signing
     */
    getPermit2TypedData(coinAddress: Address, deadline?: bigint): Promise<{
        typedData: {
            primaryType: string;
            domain: {
                name: string;
                chainId: number;
                verifyingContract: import("abitype").Address;
            };
            types: typeof import("utils/universalRouter").PERMIT_TYPES;
            message: PermitSingle;
        };
        permitSingle: PermitSingle;
    }>;
    /**
     * Gets the current Permit2 allowance and nonce for a coin
     * @param coinAddress - The address of the coin to check
     * @returns Promise<{allowance: bigint, nonce: bigint}> - Current allowance and nonce
     */
    getPermit2AllowanceAndNonce(coinAddress: Address): Promise<{
        allowance: bigint;
        nonce: number;
    }>;
    /**
     * Withdraws the creator's share of the revenue
     * @param params - Parameters for withdrawing the creator's share of the revenue
     * @param params.recipient - The address to withdraw the revenue to. Defaults to the connected wallet
     * @param params.isV1 - Optional boolean to withdraw from V1. V1.1 & AnyPositionManager use the same FeeEscrow contract
     * @returns Transaction response
     */
    withdrawCreatorRevenue(params: {
        recipient?: Address;
        isV1?: boolean;
    }): Promise<`0x${string}`>;
    /**
     * Claims the referral balance for a given recipient
     * @param coins - The addresses of the coins to claim
     * @param recipient - The address of the recipient to claim the balance for
     * @returns Transaction response
     */
    claimReferralBalance(coins: Address[], recipient: Address): Promise<`0x${string}`>;
    /**
     * Claims the protocol's share of the revenue
     * @param params - Parameters for claiming the protocol's share of the revenue
     * @returns Transaction response
     */
    revenueManagerProtocolClaim(params: {
        revenueManagerAddress: Address;
    }): Promise<`0x${string}`>;
    /**
     * Claims the total creator's share of the revenue from a revenue manager
     * @param params - Parameters for claiming the creator's share of the revenue
     * @returns Transaction response
     */
    revenueManagerCreatorClaim(params: {
        revenueManagerAddress: Address;
    }): Promise<`0x${string}`>;
    /**
     * Claims the creator's share of the revenue from specific flaunch tokens
     * @param params - Parameters for claiming the creator's share of the revenue
     * @returns Transaction response
     */
    revenueManagerCreatorClaimForTokens(params: {
        revenueManagerAddress: Address;
        flaunchTokens: {
            flaunch: Address;
            tokenId: bigint;
        }[];
    }): Promise<`0x${string}`>;
}
export {};
//# sourceMappingURL=FlaunchSDK.d.ts.map
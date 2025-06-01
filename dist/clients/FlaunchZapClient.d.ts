import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter, type HexString } from "@delvtech/drift";
import { FlaunchZapAbi } from "../abi/FlaunchZap";
import { IPFSParams } from "../types";
import { ReadFlaunchPositionManagerV1_1 } from "./FlaunchPositionManagerV1_1Client";
export type FlaunchZapABI = typeof FlaunchZapAbi;
export interface FlaunchParams {
    name: string;
    symbol: string;
    tokenUri: string;
    fairLaunchPercent: number;
    fairLaunchDuration: number;
    initialMarketCapUSD: number;
    creator: Address;
    creatorFeeAllocationPercent: number;
    flaunchAt?: bigint;
    premineAmount?: bigint;
}
export interface FlaunchIPFSParams extends Omit<FlaunchParams, "tokenUri">, IPFSParams {
}
export interface FlaunchWithRevenueManagerParams extends FlaunchParams {
    revenueManagerInstanceAddress: Address;
}
export interface FlaunchWithRevenueManagerIPFSParams extends Omit<FlaunchWithRevenueManagerParams, "tokenUri">, IPFSParams {
}
/**
 * Base client for interacting with the FlaunchZap contract in read-only mode
 * Provides basic contract initialization
 */
export declare class ReadFlaunchZap {
    drift: Drift;
    chainId: number;
    readonly contract: ReadContract<FlaunchZapABI>;
    readonly TOTAL_SUPPLY: bigint;
    readonly readPositionManagerV1_1: ReadFlaunchPositionManagerV1_1;
    /**
     * Creates a new ReadFlaunchZap instance
     * @param chainId - The chain ID of the contract
     * @param address - The address of the FlaunchZap contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(chainId: number, address: Address, drift?: Drift);
    getPremineCostInWei(params: {
        initialPriceParams: HexString;
        premineAmount: bigint;
        slippagePercent?: number;
    }): Promise<bigint>;
    getFlaunchingFee(params: {
        sender: Address;
        initialPriceParams: HexString;
        slippagePercent?: number;
    }): Promise<bigint>;
    /**
     * Calculates the ETH required to flaunch a token, takes into account the ETH for premine and the flaunching fee
     */
    ethRequiredToFlaunch(params: {
        premineAmount: bigint;
        initialPriceParams: HexString;
        slippagePercent?: number;
    }): Promise<bigint>;
}
/**
 * Extended client for interacting with the FlaunchZap contract with write capabilities
 */
export declare class ReadWriteFlaunchZap extends ReadFlaunchZap {
    contract: ReadWriteContract<FlaunchZapABI>;
    constructor(chainId: number, address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Flaunches a new token, supports premine
     * @param params - Parameters for the flaunch
     * @returns Transaction response for the flaunch creation
     */
    flaunch(params: FlaunchParams): Promise<`0x${string}`>;
    flaunchIPFS(params: FlaunchIPFSParams): Promise<`0x${string}`>;
    /**
     * Flaunches a new token for a revenue manager
     * @param params - Parameters for the flaunch with revenue manager
     * @param params.name - The name of the token
     * @param params.symbol - The symbol of the token
     * @param params.tokenUri - The URI containing the token metadata
     * @param params.fairLaunchPercent - Percentage of total supply to be used in fair launch (0-100)
     * @param params.fairLaunchDuration - Duration of fair launch in seconds
     * @param params.initialMarketCapUSD - Initial market cap in USD
     * @param params.creator - Address of the token creator
     * @param params.creatorFeeAllocationPercent - Percentage of fees allocated to creator (0-100)
     * @param params.protocolRecipient - Address to receive protocol fees
     * @param params.protocolFeePercent - Percentage of fees allocated to protocol (0-100)
     * @param params.flaunchAt - Optional timestamp when the flaunch should start
     * @param params.premineAmount - Optional amount of tokens to premine
     * @returns Transaction response for the flaunch creation
     */
    flaunchWithRevenueManager(params: FlaunchWithRevenueManagerParams): Promise<`0x${string}`>;
    /**
     * Flaunches a new token for a revenue manager, storing the token metadata on IPFS
     * @param params - Parameters for the flaunch including all revenue manager params and IPFS metadata
     * @returns Promise resolving to the transaction response for the flaunch creation
     */
    flaunchIPFSWithRevenueManager(params: FlaunchWithRevenueManagerIPFSParams): Promise<`0x${string}`>;
}
//# sourceMappingURL=FlaunchZapClient.d.ts.map
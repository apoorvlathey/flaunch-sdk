import { type ReadContract, type Address, type Drift, type EventLog, type ReadWriteContract, type ReadWriteAdapter, HexString } from "@delvtech/drift";
import { FlaunchPositionManagerAbi } from "../abi/FlaunchPositionManager";
import { type Hex } from "viem";
import { IPFSParams } from "../types";
export type FlaunchPositionManagerABI = typeof FlaunchPositionManagerAbi;
export type PoolCreatedLog = EventLog<FlaunchPositionManagerABI, "PoolCreated"> & {
    timestamp: number;
};
export type PoolCreatedLogs = PoolCreatedLog[];
export interface WatchPoolCreatedParams {
    onPoolCreated: ({ logs, isFetchingFromStart, }: {
        logs: PoolCreatedLogs;
        isFetchingFromStart: boolean;
    }) => void;
    startBlockNumber?: bigint;
}
export type BaseSwapLog = EventLog<FlaunchPositionManagerABI, "PoolSwap"> & {
    timestamp: number;
};
export type BuySwapLog = BaseSwapLog & {
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
export type SellSwapLog = BaseSwapLog & {
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
export type PoolSwapLog = BuySwapLog | SellSwapLog | BaseSwapLog;
export type PoolSwapLogs = PoolSwapLog[];
export interface WatchPoolSwapParams<TFLETHIsCurrencyZero extends boolean | undefined = undefined> {
    onPoolSwap: ({ logs, isFetchingFromStart, }: {
        logs: TFLETHIsCurrencyZero extends boolean ? (BuySwapLog | SellSwapLog)[] : BaseSwapLog[];
        isFetchingFromStart: boolean;
    }) => void;
    flETHIsCurrencyZero?: TFLETHIsCurrencyZero;
    startBlockNumber?: bigint;
    filterByPoolId?: HexString;
}
export interface FlaunchParams {
    name: string;
    symbol: string;
    tokenUri: string;
    fairLaunchPercent: number;
    initialMarketCapUSD: number;
    creator: Address;
    creatorFeeAllocationPercent: number;
    flaunchAt?: bigint;
}
export interface FlaunchIPFSParams extends Omit<FlaunchParams, "tokenUri">, IPFSParams {
}
export declare class ReadFlaunchPositionManager {
    readonly contract: ReadContract<FlaunchPositionManagerABI>;
    drift: Drift;
    pollPoolCreatedNow?: () => Promise<void>;
    pollPoolSwapNow?: () => Promise<void>;
    readonly TOTAL_SUPPLY: bigint;
    constructor(address: Address, drift?: Drift);
    isValidCoin(coinAddress: Address): Promise<boolean>;
    /**
     * Gets the ETH balance for the creator to claim
     * @param creator - The address of the creator to check
     * @returns The balance of the creator
     */
    creatorBalance(creator: Address): Promise<bigint>;
    getFlaunchingFee(params: {
        sender: Address;
        initialPriceParams: HexString;
        slippagePercent?: number;
    }): Promise<bigint>;
    watchPoolCreated({ onPoolCreated, startBlockNumber, }: WatchPoolCreatedParams): Promise<{
        cleanup: () => void;
        pollPoolCreatedNow: () => Promise<void>;
    }>;
    /**
     * Parses a transaction hash to extract PoolSwap events and return parsed swap data
     * @param txHash - The transaction hash to parse
     * @param flETHIsCurrencyZero - Whether flETH is currency 0 in the pool (optional)
     * @returns Parsed swap log or undefined if no PoolSwap event found
     */
    parseSwapTx(txHash: Hex, flETHIsCurrencyZero?: boolean): Promise<PoolSwapLog | undefined>;
    watchPoolSwap<T extends boolean | undefined = undefined>({ onPoolSwap, flETHIsCurrencyZero, startBlockNumber, filterByPoolId, }: WatchPoolSwapParams<T>): Promise<{
        cleanup: () => void;
        pollPoolSwapNow: () => Promise<void>;
    }>;
}
export declare class ReadWriteFlaunchPositionManager extends ReadFlaunchPositionManager {
    contract: ReadWriteContract<FlaunchPositionManagerABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    flaunch({ name, symbol, tokenUri, fairLaunchPercent, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, }: FlaunchParams): Promise<`0x${string}`>;
    flaunchIPFS({ name, symbol, fairLaunchPercent, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, metadata, pinataConfig, }: FlaunchIPFSParams): Promise<`0x${string}`>;
    /**
     * Withdraws the creator's share of the revenue
     * @param recipient - The address to withdraw the revenue to
     * @returns Transaction response
     */
    withdrawFees(recipient: Address): Promise<`0x${string}`>;
}
//# sourceMappingURL=FlaunchPositionManagerClient.d.ts.map
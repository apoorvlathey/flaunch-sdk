import { type ReadContract, type Address, type Drift, type EventLog, type ReadWriteContract, type ReadWriteAdapter, HexString } from "@delvtech/drift";
import { FlaunchPositionManagerV1_1Abi } from "../abi/FlaunchPositionManagerV1_1";
import { type Hex } from "viem";
import { IPFSParams } from "../types";
export type FlaunchPositionManagerV1_1ABI = typeof FlaunchPositionManagerV1_1Abi;
export type PoolCreatedLog = EventLog<FlaunchPositionManagerV1_1ABI, "PoolCreated"> & {
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
export type BaseSwapLog = EventLog<FlaunchPositionManagerV1_1ABI, "PoolSwap"> & {
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
    fairLaunchDuration: bigint;
    initialMarketCapUSD: number;
    creator: Address;
    creatorFeeAllocationPercent: number;
    flaunchAt?: bigint;
}
export interface FlaunchIPFSParams extends Omit<FlaunchParams, "tokenUri">, IPFSParams {
}
export declare class ReadFlaunchPositionManagerV1_1 {
    readonly contract: ReadContract<FlaunchPositionManagerV1_1ABI>;
    drift: Drift;
    pollPoolCreatedNow?: () => Promise<void>;
    pollPoolSwapNow?: () => Promise<void>;
    readonly TOTAL_SUPPLY: bigint;
    constructor(address: Address, drift?: Drift);
    isValidCoin(coinAddress: Address): Promise<boolean>;
    getFlaunchingMarketCap(initialPriceParams: HexString): Promise<bigint>;
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
    initialPrice(): Promise<`0x${string}`>;
}
export declare class ReadWriteFlaunchPositionManagerV1_1 extends ReadFlaunchPositionManagerV1_1 {
    contract: ReadWriteContract<FlaunchPositionManagerV1_1ABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Flaunches a new token directly from the position manager.
     * For premine support, flaunch via the FlaunchZapClient.
     */
    flaunch({ name, symbol, tokenUri, fairLaunchPercent, fairLaunchDuration, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, }: FlaunchParams): Promise<`0x${string}`>;
    /**
     * Flaunches a new token directly from the position manager by uploading the token metadata to IPFS.
     * For premine support, flaunch via the FlaunchZapClient.
     */
    flaunchIPFS({ name, symbol, fairLaunchPercent, fairLaunchDuration, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, metadata, pinataConfig, }: FlaunchIPFSParams): Promise<`0x${string}`>;
}
//# sourceMappingURL=FlaunchPositionManagerV1_1Client.d.ts.map
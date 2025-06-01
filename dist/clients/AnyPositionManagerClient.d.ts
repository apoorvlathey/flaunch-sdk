import { type ReadContract, type Address, type Drift, type EventLog, type ReadWriteContract, type ReadWriteAdapter, HexString } from "@delvtech/drift";
import { AnyPositionManagerAbi } from "../abi/AnyPositionManager";
import { IPFSParams } from "../types";
export type AnyPositionManagerABI = typeof AnyPositionManagerAbi;
export type PoolCreatedLog = EventLog<AnyPositionManagerABI, "PoolCreated"> & {
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
export type BaseSwapLog = EventLog<AnyPositionManagerABI, "PoolSwap"> & {
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
export interface AnyFlaunchParams {
    memecoin: Address;
    initialMarketCapUSD: number;
    creator: Address;
    creatorFeeAllocationPercent: number;
}
export interface FlaunchIPFSParams extends Omit<AnyFlaunchParams, "tokenUri">, IPFSParams {
}
export declare class ReadAnyPositionManager {
    readonly contract: ReadContract<AnyPositionManagerABI>;
    drift: Drift;
    pollPoolCreatedNow?: () => Promise<void>;
    pollPoolSwapNow?: () => Promise<void>;
    readonly TOTAL_SUPPLY: bigint;
    constructor(address: Address, drift?: Drift);
    isValidCoin(coinAddress: Address): Promise<boolean>;
    getFlaunchingFee(params: {
        sender: Address;
        initialPriceParams: HexString;
        slippagePercent?: number;
    }): Promise<bigint>;
    watchPoolCreated({ onPoolCreated, startBlockNumber, }: WatchPoolCreatedParams): Promise<{
        cleanup: () => void;
        pollPoolCreatedNow: () => Promise<void>;
    }>;
    watchPoolSwap<T extends boolean | undefined = undefined>({ onPoolSwap, flETHIsCurrencyZero, startBlockNumber, filterByPoolId, }: WatchPoolSwapParams<T>): Promise<{
        cleanup: () => void;
        pollPoolSwapNow: () => Promise<void>;
    }>;
}
export declare class ReadWriteAnyPositionManager extends ReadAnyPositionManager {
    contract: ReadWriteContract<AnyPositionManagerABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    flaunch({ memecoin, initialMarketCapUSD, creator, creatorFeeAllocationPercent, }: AnyFlaunchParams): Promise<`0x${string}`>;
}
//# sourceMappingURL=AnyPositionManagerClient.d.ts.map
import { BuySwapLog, PoolCreatedLogs, SellSwapLog } from "../clients/FlaunchPositionManagerClient";
import { ReadFlaunchSDK } from "../sdk/FlaunchSDK";
import { Address } from "viem";
/**
 * Hook to watch and track pool creation events from the Flaunch V1.1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of pool creation events in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
export declare function usePoolCreatedEvents(flaunch: ReadFlaunchSDK, startBlockNumber?: bigint): {
    logs: PoolCreatedLogs;
    isFetchingFromStart: boolean;
};
/**
 * Hook to watch and track swap events (buys/sells) for a specific coin from the Flaunch V1.1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param coinAddress - Address of the coin to watch swaps for
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of swap events (both buys and sells) in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
export declare function usePoolSwapEvents(flaunch: ReadFlaunchSDK, coinAddress: Address, startBlockNumber?: bigint): {
    logs: (BuySwapLog | SellSwapLog)[];
    isFetchingFromStart: boolean;
};
/**
 * Hook to watch and track pool creation events from the Flaunch V1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of pool creation events in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
export declare function usePoolCreatedEventsV1(flaunch: ReadFlaunchSDK, startBlockNumber?: bigint): {
    logs: PoolCreatedLogs;
    isFetchingFromStart: boolean;
};
/**
 * Hook to watch and track swap events (buys/sells) for a specific coin from the Flaunch V1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param coinAddress - Address of the coin to watch swaps for
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of swap events (both buys and sells) in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
export declare function usePoolSwapEventsV1(flaunch: ReadFlaunchSDK, coinAddress: Address, startBlockNumber?: bigint): {
    logs: (BuySwapLog | SellSwapLog)[];
    isFetchingFromStart: boolean;
};
//# sourceMappingURL=FlaunchPositionManagerHooks.d.ts.map
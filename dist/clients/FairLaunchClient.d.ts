import { type ReadContract, type Address, type Drift, type HexString } from "@delvtech/drift";
import { FairLaunchAbi } from "../abi/FairLaunch";
export type FairLaunchABI = typeof FairLaunchAbi;
/**
 * Client for interacting with the FairLaunch V1 contract in read-only mode
 * Provides methods to query fair launch information and status
 */
export declare class ReadFairLaunch {
    readonly contract: ReadContract<FairLaunchABI>;
    /**
     * Creates a new ReadFairLaunch instance
     * @param address - The address of the FairLaunch contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    fairLaunchDuration({ poolId }: {
        poolId: HexString;
    }): number;
    /**
     * Gets information about a fair launch for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{initialTick: number, closed: boolean, endsAt: number}> - Fair launch details
     */
    fairLaunchInfo({ poolId }: {
        poolId: HexString;
    }): Promise<{
        startsAt: bigint;
        endsAt: bigint;
        initialTick: number;
        revenue: bigint;
        supply: bigint;
        closed: boolean;
    }>;
    /**
     * Checks if a fair launch is currently active
     * @param poolId - The ID of the pool
     * @returns Promise<boolean> - True if the fair launch is active (not closed and not expired), false otherwise
     */
    isFairLaunchActive({ poolId }: {
        poolId: HexString;
    }): Promise<boolean>;
}
//# sourceMappingURL=FairLaunchClient.d.ts.map
import { type ReadContract, type Address, type Drift, type HexString } from "@delvtech/drift";
import { BidwallAbi } from "../abi/BidWall";
export type BidwallABI = typeof BidwallAbi;
/**
 * Client for interacting with the BidWall V1 contract in read-only mode
 * Provides methods to query bid wall positions and pool information
 */
export declare class ReadBidWall {
    readonly contract: ReadContract<BidwallABI>;
    /**
     * Creates a new ReadBidWall instance
     * @param address - The address of the BidWall contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    /**
     * Gets information about a bid wall position for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{amount0_: bigint, amount1_: bigint, pendingEth_: bigint}> - Position details including token amounts and pending ETH
     */
    position({ poolId }: {
        poolId: HexString;
    }): Promise<{
        amount0_: bigint;
        amount1_: bigint;
        pendingEth_: bigint;
    }>;
    /**
     * Gets configuration information about a pool's bid wall
     * @param poolId - The ID of the pool
     * @returns Promise<{tickLower: number, tickUpper: number}> - Pool configuration including tick range
     */
    poolInfo({ poolId }: {
        poolId: HexString;
    }): Promise<{
        tickLower: number;
        tickUpper: number;
        disabled: boolean;
        initialized: boolean;
        pendingETHFees: bigint;
        cumulativeSwapFees: bigint;
    }>;
}
//# sourceMappingURL=BidWallClient.d.ts.map
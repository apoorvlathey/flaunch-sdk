import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter } from "@delvtech/drift";
import { FeeEscrowAbi } from "../abi/FeeEscrow";
export type FeeEscrowABI = typeof FeeEscrowAbi;
/**
 * Client for interacting with the FeeEscrow contract in read-only mode
 * Provides methods to query fee balances and withdraw fees
 */
export declare class ReadFeeEscrow {
    readonly contract: ReadContract<FeeEscrowABI>;
    /**
     * Creates a new ReadFeeEscrow instance
     * @param address - The address of the FeeEscrow contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    /**
     * Gets the claimable balance of fees for a creator
     * @param creator - The address of the creator to check
     * @returns Promise<bigint> - The claimable balance of fees
     */
    balances(creator: Address): Promise<bigint>;
}
/**
 * Extended client for interacting with the FeeEscrow contract with write capabilities
 * Provides methods to withdraw fees
 */
export declare class ReadWriteFeeEscrow extends ReadFeeEscrow {
    contract: ReadWriteContract<FeeEscrowABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Withdraws fees as ETH to a recipient
     * @param recipient - The address to receive the fees
     * @param unwrap - Whether to unwrap the native token before sending
     * @returns Promise<void>
     */
    withdrawFees(recipient: Address): Promise<`0x${string}`>;
}
//# sourceMappingURL=FeeEscrowClient.d.ts.map
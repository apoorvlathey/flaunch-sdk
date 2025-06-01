import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter } from "@delvtech/drift";
import { ReferralEscrowAbi } from "../abi/ReferralEscrow";
export type ReferralEscrowABI = typeof ReferralEscrowAbi;
/**
 * Client for interacting with the ReferralEscrow contract in read-only mode
 * Provides methods to query token allocations
 */
export declare class ReadReferralEscrow {
    readonly contract: ReadContract<ReferralEscrowABI>;
    /**
     * Creates a new ReadReferralEscrow instance
     * @param address - The address of the ReferralEscrow contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    /**
     * Gets the token allocation for a specific user and token
     * @param user - The address of the user to check
     * @param token - The address of the token
     * @returns Promise<bigint> - The allocated token amount
     */
    allocations(user: Address, token: Address): Promise<bigint>;
}
/**
 * Extended client for interacting with the ReferralEscrow contract with write capabilities
 * Provides methods to claim tokens
 */
export declare class ReadWriteReferralEscrow extends ReadReferralEscrow {
    contract: ReadWriteContract<ReferralEscrowABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Claims tokens for a recipient
     * @param tokens - Array of token addresses to claim
     * @param recipient - The address to receive the claimed tokens
     * @returns Promise<void>
     */
    claimTokens(tokens: Address[], recipient: Address): Promise<`0x${string}`>;
}
//# sourceMappingURL=ReferralEscrowClient.d.ts.map
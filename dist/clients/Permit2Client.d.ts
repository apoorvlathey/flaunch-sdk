import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter } from "@delvtech/drift";
import { Permit2Abi } from "../abi/Permit2";
export type Permit2ABI = typeof Permit2Abi;
/**
 * Client for interacting with Uniswap's Permit2 contract in read-only mode
 * Provides methods to query token approvals and allowances
 */
export declare class ReadPermit2 {
    readonly contract: ReadContract<Permit2ABI>;
    /**
     * Creates a new ReadPermit2 instance
     * @param address - The address of the Permit2 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    /**
     * Gets the allowance and nonce for a token approval
     * @param owner - The address of the token owner
     * @param coinAddress - The address of the token contract
     * @param spender - The address of the spender
     * @returns Promise<{amount: bigint, expiration: bigint, nonce: bigint}> - The allowance details
     */
    allowance(owner: Address, coinAddress: Address, spender: Address): Promise<{
        amount: bigint;
        expiration: number;
        nonce: number;
    }>;
}
export declare class ReadWritePermit2 extends ReadPermit2 {
    contract: ReadWriteContract<Permit2ABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Approves a spender to spend a token via transaction
     * @param params - The parameters for the approval
     * @returns The transaction response
     */
    approve(params: {
        token: Address;
        spender: Address;
        amount: bigint;
        expiration: number;
    }): Promise<`0x${string}`>;
}
//# sourceMappingURL=Permit2Client.d.ts.map
import { type ReadContract, type Address, type Drift } from "@delvtech/drift";
import { FlaunchV1_1Abi } from "../abi/FlaunchV1_1";
export type FlaunchV1_1ABI = typeof FlaunchV1_1Abi;
/**
 * Client for interacting with the Flaunch V1.1 contract in read-only mode
 * Provides methods to query token IDs and metadata URIs
 * Enhanced version of the V1 contract with additional features
 */
export declare class ReadFlaunchV1_1 {
    readonly contract: ReadContract<FlaunchV1_1ABI>;
    /**
     * Creates a new ReadFlaunchV1_1 instance
     * @param address - The address of the Flaunch V1.1 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
    /**
     * Gets the token ID associated with a memecoin
     * @param coinAddress - The address of the memecoin
     * @returns Promise<bigint> - The token ID
     */
    tokenId(coinAddress: Address): Promise<bigint>;
    /**
     * Gets the metadata URI for a token
     * @param tokenId - The ID of the token
     * @returns Promise<string> - The token's metadata URI
     */
    tokenURI(tokenId: bigint): Promise<string>;
}
//# sourceMappingURL=FlaunchV1_1Client.d.ts.map
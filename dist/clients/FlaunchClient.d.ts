import { type ReadContract, type Address, type Drift } from "@delvtech/drift";
import { FlaunchAbi } from "../abi/Flaunch";
export type FlaunchABI = typeof FlaunchAbi;
/**
 * Client for interacting with the Flaunch V1 contract in read-only mode
 * Provides methods to query token IDs and metadata URIs
 */
export declare class ReadFlaunch {
    readonly contract: ReadContract<FlaunchABI>;
    /**
     * Creates a new ReadFlaunch instance
     * @param address - The address of the Flaunch contract
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
    /**
     * Gets the memecoin address for a given token ID
     * @param tokenId - The ID of the token
     * @returns Promise<Address> - The address of the memecoin
     */
    memecoin(tokenId: bigint): Promise<`0x${string}`>;
}
//# sourceMappingURL=FlaunchClient.d.ts.map
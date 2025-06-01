import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter } from "@delvtech/drift";
import { FastFlaunchZapAbi } from "../abi/FastFlaunchZap";
import { IPFSParams } from "../types";
export type FastFlaunchZapABI = typeof FastFlaunchZapAbi;
/**
 * Base client for interacting with the FastFlaunchZap contract in read-only mode
 * Provides basic contract initialization
 */
export declare class ReadFastFlaunchZap {
    readonly contract: ReadContract<FastFlaunchZapABI>;
    /**
     * Creates a new ReadFastFlaunchZap instance
     * @param address - The address of the FastFlaunchZap contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address: Address, drift?: Drift);
}
/**
 * Parameters for creating a new fast flaunch with direct token URI
 */
export interface FastFlaunchParams {
    /** The name of the token */
    name: string;
    /** The symbol of the token */
    symbol: string;
    /** The URI containing the token metadata */
    tokenUri: string;
    /** The address of the token creator */
    creator: Address;
}
/**
 * Parameters for creating a new fast flaunch with IPFS metadata
 * Extends FastFlaunchParams (without tokenUri) and IPFSParams
 */
export interface FastFlaunchIPFSParams extends Omit<FastFlaunchParams, "tokenUri">, IPFSParams {
}
/**
 * Extended client for interacting with the FastFlaunchZap contract with write capabilities
 * Provides methods to create new fast flaunches with direct URI or IPFS metadata
 */
export declare class ReadWriteFastFlaunchZap extends ReadFastFlaunchZap {
    contract: ReadWriteContract<FastFlaunchZapABI>;
    /**
     * Creates a new ReadWriteFastFlaunchZap instance
     * @param address - The address of the FastFlaunchZap contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     */
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Creates a new fast flaunch with direct token URI
     * @param params - Parameters for the fast flaunch including name, symbol, tokenUri, and creator
     * @returns Transaction response for the flaunch creation
     */
    fastFlaunch({ name, symbol, tokenUri, creator }: FastFlaunchParams): Promise<`0x${string}`>;
    /**
     * Creates a new fast flaunch with metadata stored on IPFS
     * @param params - Parameters for the fast flaunch including name, symbol, creator, metadata, and Pinata config
     * @returns Promise resolving to the transaction response for the flaunch creation
     */
    fastFlaunchIPFS({ name, symbol, creator, metadata, pinataConfig, }: FastFlaunchIPFSParams): Promise<`0x${string}`>;
}
//# sourceMappingURL=FastFlaunchClient.d.ts.map
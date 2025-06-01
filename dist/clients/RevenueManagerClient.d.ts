import { type ReadContract, type Address, type Drift, type ReadWriteContract, type ReadWriteAdapter } from "@delvtech/drift";
import { RevenueManagerAbi } from "../abi/RevenueManager";
export type RevenueManagerABI = typeof RevenueManagerAbi;
export declare class ReadRevenueManager {
    drift: Drift;
    readonly contract: ReadContract<RevenueManagerABI>;
    constructor(address: Address, drift?: Drift);
    /**
     * Gets the claimable balance of ETH for the recipient
     * @param recipient - The address of the recipient to check
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    balances(address: Address): Promise<bigint>;
    /**
     * Gets the protocol recipient address
     * @returns Promise<Address> - The protocol recipient address
     */
    protocolRecipient(): Promise<`0x${string}`>;
    /**
     * Gets the total number of tokens managed by the revenue manager
     * @returns Promise<bigint> - The total count of tokens
     */
    tokensCount(): Promise<bigint>;
    /**
     * Gets all tokens created by a specific creator address
     * @param creator - The address of the creator to query tokens for
     * @param sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    allTokensByCreator(creator: Address, sortByDesc?: boolean): Promise<readonly {
        flaunch: `0x${string}`;
        tokenId: bigint;
    }[]>;
    /**
     * Gets all tokens currently managed by the revenue manager contract
     * @dev Uses multicall to batch requests for better performance
     * @param sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    allTokensInManager(sortByDesc?: boolean): Promise<{
        flaunch: `0x${string}`;
        tokenId: bigint;
    }[]>;
}
export declare class ReadWriteRevenueManager extends ReadRevenueManager {
    contract: ReadWriteContract<RevenueManagerABI>;
    constructor(address: Address, drift?: Drift<ReadWriteAdapter>);
    /**
     * Allows the protocol recipient to claim the protocol's share of the revenue
     * @returns Promise<TransactionResponse> - The transaction response
     */
    protocolClaim(): Promise<`0x${string}`>;
    /**
     * Allows the creator to claim their total share of the revenue from a revenue manager
     * @returns Promise<TransactionResponse> - The transaction response
     */
    creatorClaim(): Promise<`0x${string}`>;
    /**
     * Allows the creator to claim their share of the revenue from specific flaunch tokens
     * @param flaunchTokens - The flaunch token ids to claim the revenue for
     * @returns Promise<TransactionResponse> - The transaction response
     */
    creatorClaimForTokens(flaunchTokens: {
        flaunch: Address;
        tokenId: bigint;
    }[]): Promise<`0x${string}`>;
}
//# sourceMappingURL=RevenueManagerClient.d.ts.map
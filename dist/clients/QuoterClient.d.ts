import { type ReadContract, type Address, type Drift } from "@delvtech/drift";
import { QuoterAbi } from "../abi/Quoter";
export type QuoterABI = typeof QuoterAbi;
/**
 * Client for interacting with the Quoter contract to get price quotes for swaps
 * Provides methods to simulate trades and get expected output amounts
 */
export declare class ReadQuoter {
    chainId: number;
    readonly contract: ReadContract<QuoterABI>;
    /**
     * Creates a new ReadQuoter instance
     * @param chainId - The chain ID where the Quoter contract is deployed
     * @param address - The address of the Quoter contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(chainId: number, address: Address, drift?: Drift);
    /**
     * Gets a quote for selling an exact amount of tokens for ETH
     * @param coinAddress - The address of the token to sell
     * @param amountIn - The exact amount of tokens to sell
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The expected amount of ETH to receive
     */
    getSellQuoteExactInput(coinAddress: Address, amountIn: bigint, positionManagerAddress: Address): Promise<bigint>;
    /**
     * Gets a quote for buying tokens with an exact amount of ETH
     * @param coinAddress - The address of the token to buy
     * @param ethIn - The exact amount of ETH to spend
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The expected amount of tokens to receive
     */
    getBuyQuoteExactInput(coinAddress: Address, ethIn: bigint, positionManagerAddress: Address): Promise<bigint>;
    /**
     * Gets a quote for buying an exact amount of tokens with ETH
     * @param coinAddress - The address of the token to buy
     * @param coinOut - The exact amount of tokens to receive
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The required amount of ETH to spend
     */
    getBuyQuoteExactOutput(coinAddress: Address, coinOut: bigint, positionManagerAddress: Address): Promise<bigint>;
    /**
     * Gets the current ETH/USDC price from the pool
     * @returns Promise<number> - The price of 1 ETH in USDC, formatted with 2 decimal places
     */
    getETHUSDCPrice(): Promise<number>;
}
//# sourceMappingURL=QuoterClient.d.ts.map
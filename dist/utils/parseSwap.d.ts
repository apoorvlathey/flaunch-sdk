export interface SwapLogArgs {
    flAmount0: bigint;
    flAmount1: bigint;
    flFee0: bigint;
    flFee1: bigint;
    ispAmount0: bigint;
    ispAmount1: bigint;
    ispFee0: bigint;
    ispFee1: bigint;
    uniAmount0: bigint;
    uniAmount1: bigint;
    uniFee0: bigint;
    uniFee1: bigint;
}
export interface SwapFees {
    isInFLETH: boolean;
    amount: bigint;
}
export interface BuySwapData {
    type: "BUY";
    delta: {
        coinsBought: bigint;
        flETHSold: bigint;
        fees: SwapFees;
    };
}
export interface SellSwapData {
    type: "SELL";
    delta: {
        coinsSold: bigint;
        flETHBought: bigint;
        fees: SwapFees;
    };
}
export type ParsedSwapData = BuySwapData | SellSwapData;
/**
 * Parses raw swap log arguments into structured swap data
 * @param args - The swap log arguments
 * @param flETHIsCurrencyZero - Whether flETH is currency 0 in the pool
 * @returns Parsed swap data with type and delta information
 */
export declare function parseSwapData(args: SwapLogArgs, flETHIsCurrencyZero: boolean): ParsedSwapData;
//# sourceMappingURL=parseSwap.d.ts.map
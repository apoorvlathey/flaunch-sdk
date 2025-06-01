import { type ReadContract, type Address, type Drift, type HexString } from "@delvtech/drift";
import { InitialPriceAbi } from "../abi/InitialPrice";
export type InitialPriceABI = typeof InitialPriceAbi;
export declare class ReadInitialPrice {
    readonly contract: ReadContract<InitialPriceABI>;
    constructor(address: Address, drift?: Drift);
    /**
     * Returns a flaunching fee of 0.1% of the initial market cap IF the market cap is greater than 10k & the sender is not fee exempt
     * @param params - The parameters for the flaunching fee calculation
     * @param params.sender - The address of the sender
     * @param params.initialPriceParams - The initial price parameters
     * @returns The flaunching fee
     */
    getFlaunchingFee(params: {
        sender: Address;
        initialPriceParams: HexString;
    }): Promise<bigint>;
    getSqrtPriceX96(params: {
        isFLETHZero: boolean;
        initialPriceParams: HexString;
    }): Promise<bigint>;
}
//# sourceMappingURL=InitialPriceClient.d.ts.map
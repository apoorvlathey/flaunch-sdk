import { type ReadContract, type Address, type Drift, type HexString } from "@delvtech/drift";
import { MulticallAbi } from "../abi/Multicall";
export type MulticallABI = typeof MulticallAbi;
export declare class ReadMulticall {
    readonly address: Address;
    readonly contract: ReadContract<MulticallABI>;
    constructor(drift: Drift);
    aggregate3(calls: {
        target: Address;
        callData: HexString;
    }[]): Promise<readonly {
        success: boolean;
        returnData: `0x${string}`;
    }[]>;
}
//# sourceMappingURL=MulticallClient.d.ts.map
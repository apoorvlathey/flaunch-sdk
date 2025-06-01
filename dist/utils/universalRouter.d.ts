import { Address, Hex } from "viem";
export type PermitDetails = {
    token: Address;
    amount: bigint;
    expiration: number;
    nonce: number;
};
export type PermitSingle = {
    details: PermitDetails;
    spender: Address;
    sigDeadline: bigint;
};
/**
 * @dev EXACT_OUT adds the slippage, EXACT_IN removes it
 */
export declare const getAmountWithSlippage: (amount: bigint | undefined, slippage: string, swapType: "EXACT_IN" | "EXACT_OUT") => bigint;
export declare const ethToMemecoin: (params: {
    sender: Address;
    memecoin: Address;
    chainId: number;
    referrer: Address | null;
    swapType: "EXACT_IN" | "EXACT_OUT";
    amountIn?: bigint;
    amountOutMin?: bigint;
    amountOut?: bigint;
    amountInMax?: bigint;
    positionManagerAddress: Address;
}) => {
    calldata: `0x${string}`;
    commands: `0x${string}`;
    inputs: `0x${string}`[];
};
export declare const memecoinToEthWithPermit2: (params: {
    chainId: number;
    memecoin: Address;
    amountIn: bigint;
    ethOutMin: bigint;
    permitSingle: PermitSingle | undefined;
    signature: Hex | undefined;
    referrer: Address | null;
    positionManagerAddress: Address;
}) => {
    calldata: `0x${string}`;
    commands: `0x${string}`;
    inputs: `0x${string}`[];
};
export declare const PERMIT_DETAILS: {
    name: string;
    type: string;
}[];
export declare const PERMIT_TYPES: {
    PermitSingle: {
        name: string;
        type: string;
    }[];
    PermitDetails: {
        name: string;
        type: string;
    }[];
};
export declare const getPermit2TypedData: ({ chainId, coinAddress, nonce, deadline, }: {
    chainId: number;
    coinAddress: Address;
    nonce: number;
    deadline?: bigint;
}) => {
    typedData: {
        primaryType: string;
        domain: {
            name: string;
            chainId: number;
            verifyingContract: Address;
        };
        types: typeof PERMIT_TYPES;
        message: PermitSingle;
    };
    permitSingle: PermitSingle;
};
//# sourceMappingURL=universalRouter.d.ts.map
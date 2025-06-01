import { PoolKey } from "../types";
export declare const TickFinder: {
    MIN_TICK: number;
    MAX_TICK: number;
};
export declare const TICK_SPACING = 60;
export declare const getPoolId: (poolKey: PoolKey) => `0x${string}`;
export declare const orderPoolKey: (poolKey: PoolKey) => {
    currency0: `0x${string}`;
    currency1: `0x${string}`;
    fee: number;
    tickSpacing: number;
    hooks: import("abitype").Address;
};
export declare const getValidTick: ({ tick, tickSpacing, roundDown, }: {
    tick: number;
    tickSpacing: number;
    roundDown: boolean;
}) => number;
export declare const getSqrtPriceX96FromTick: (tick: number) => bigint;
export declare const calculateUnderlyingTokenBalances: (liquidity: bigint, tickLower: number, tickUpper: number, tickCurrent: number) => {
    amount0: bigint;
    amount1: bigint;
};
//# sourceMappingURL=univ4.d.ts.map
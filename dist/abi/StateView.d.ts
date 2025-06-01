export declare const StateViewAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract IPoolManager";
        readonly name: "_poolManager";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly name: "getFeeGrowthGlobals";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "feeGrowthGlobal0";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthGlobal1";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int24";
        readonly name: "tickLower";
        readonly type: "int24";
    }, {
        readonly internalType: "int24";
        readonly name: "tickUpper";
        readonly type: "int24";
    }];
    readonly name: "getFeeGrowthInside";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside0X128";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside1X128";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly name: "getLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidity";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "positionId";
        readonly type: "bytes32";
    }];
    readonly name: "getPositionInfo";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside0LastX128";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside1LastX128";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "int24";
        readonly name: "tickLower";
        readonly type: "int24";
    }, {
        readonly internalType: "int24";
        readonly name: "tickUpper";
        readonly type: "int24";
    }, {
        readonly internalType: "bytes32";
        readonly name: "salt";
        readonly type: "bytes32";
    }];
    readonly name: "getPositionInfo";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside0LastX128";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthInside1LastX128";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "bytes32";
        readonly name: "positionId";
        readonly type: "bytes32";
    }];
    readonly name: "getPositionLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidity";
        readonly type: "uint128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }];
    readonly name: "getSlot0";
    readonly outputs: readonly [{
        readonly internalType: "uint160";
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }, {
        readonly internalType: "uint24";
        readonly name: "protocolFee";
        readonly type: "uint24";
    }, {
        readonly internalType: "uint24";
        readonly name: "lpFee";
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int16";
        readonly name: "tick";
        readonly type: "int16";
    }];
    readonly name: "getTickBitmap";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "tickBitmap";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly name: "getTickFeeGrowthOutside";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "feeGrowthOutside0X128";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthOutside1X128";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly name: "getTickInfo";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidityGross";
        readonly type: "uint128";
    }, {
        readonly internalType: "int128";
        readonly name: "liquidityNet";
        readonly type: "int128";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthOutside0X128";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "feeGrowthOutside1X128";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly name: "getTickLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "uint128";
        readonly name: "liquidityGross";
        readonly type: "uint128";
    }, {
        readonly internalType: "int128";
        readonly name: "liquidityNet";
        readonly type: "int128";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "poolManager";
    readonly outputs: readonly [{
        readonly internalType: "contract IPoolManager";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}];
//# sourceMappingURL=StateView.d.ts.map
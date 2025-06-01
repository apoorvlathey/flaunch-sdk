'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const AnyPositionManagerAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    { internalType: "address", name: "feeEscrow", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                    {
                        internalType: "contract TreasuryActionManager",
                        name: "actionManager",
                        type: "address",
                    },
                    { internalType: "address", name: "bidWall", type: "address" },
                ],
                internalType: "struct AnyPositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyFlaunched", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotApprovedCreator", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_creator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_isApproved",
                type: "bool",
            },
        ],
        name: "CreatorApproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount1",
                type: "uint128",
            },
        ],
        name: "HookFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount1",
                type: "uint128",
            },
        ],
        name: "HookSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                components: [
                    { internalType: "address", name: "memecoin", type: "address" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct AnyPositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_creator", type: "address" },
            { internalType: "bool", name: "_isApproved", type: "bool" },
        ],
        name: "approveCreator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "approvedMemecoinCreator",
        outputs: [{ internalType: "bool", name: "isApproved", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract FeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "memecoin", type: "address" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct AnyPositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [
            { internalType: "contract IAnyFlaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const BidwallAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_protocolOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotCreator", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
        ],
        name: "BidWallClosed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_added",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_pending",
                type: "uint256",
            },
        ],
        name: "BidWallDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            { indexed: false, internalType: "bool", name: "_disabled", type: "bool" },
        ],
        name: "BidWallDisabledStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallRepositioned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
        ],
        name: "BidWallRewardsTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_newSwapFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FixedSwapFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_ethSwapAmount", type: "uint256" },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "isBidWallEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "poolInfo",
        outputs: [
            { internalType: "bool", name: "disabled", type: "bool" },
            { internalType: "bool", name: "initialized", type: "bool" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "uint256", name: "pendingETHFees", type: "uint256" },
            { internalType: "uint256", name: "cumulativeSwapFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "position",
        outputs: [
            { internalType: "uint256", name: "amount0_", type: "uint256" },
            { internalType: "uint256", name: "amount1_", type: "uint256" },
            { internalType: "uint256", name: "pendingEth_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "bool", name: "_disable", type: "bool" },
        ],
        name: "setDisabledState",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "swapFeeThreshold", type: "uint256" },
        ],
        name: "setSwapFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

const BidWallV1_1Abi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_protocolOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotCreator", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
        ],
        name: "BidWallClosed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_added",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_pending",
                type: "uint256",
            },
        ],
        name: "BidWallDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            { indexed: false, internalType: "bool", name: "_disabled", type: "bool" },
        ],
        name: "BidWallDisabledStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallRepositioned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
        ],
        name: "BidWallRewardsTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_newSwapFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FixedSwapFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_staleTimeWindow",
                type: "uint256",
            },
        ],
        name: "StaleTimeWindowUpdated",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "checkStalePosition",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_ethSwapAmount", type: "uint256" },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "isBidWallEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "lastPoolTransaction",
        outputs: [{ internalType: "uint256", name: "_timestamp", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "poolInfo",
        outputs: [
            { internalType: "bool", name: "disabled", type: "bool" },
            { internalType: "bool", name: "initialized", type: "bool" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "uint256", name: "pendingETHFees", type: "uint256" },
            { internalType: "uint256", name: "cumulativeSwapFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "position",
        outputs: [
            { internalType: "uint256", name: "amount0_", type: "uint256" },
            { internalType: "uint256", name: "amount1_", type: "uint256" },
            { internalType: "uint256", name: "pendingEth_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "bool", name: "_disable", type: "bool" },
        ],
        name: "setDisabledState",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_staleTimeWindow", type: "uint256" },
        ],
        name: "setStaleTimeWindow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "swapFeeThreshold", type: "uint256" },
        ],
        name: "setSwapFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "staleTimeWindow",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

const FairLaunchAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_startsAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endsAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_revenue",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_supply",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endedAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchEnded",
        type: "event",
    },
    {
        inputs: [],
        name: "FAIR_LAUNCH_WINDOW",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_tokenFees", type: "uint256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "closePosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int24", name: "_initialTick", type: "int24" },
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
            {
                internalType: "uint256",
                name: "_initialTokenFairLaunch",
                type: "uint256",
            },
        ],
        name: "createPosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "fairLaunchInfo",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int256", name: "_amountSpecified", type: "int256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "fillFromPosition",
        outputs: [
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "BalanceDelta", name: "balanceDelta_", type: "int256" },
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "fairLaunchInfo_",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "inFairLaunchWindow",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int256", name: "_revenue", type: "int256" },
        ],
        name: "modifyRevenue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
];

const FairLaunchV1_1Abi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_startsAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endsAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_revenue",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_supply",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endedAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchEnded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_tokenFees", type: "uint256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "closePosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int24", name: "_initialTick", type: "int24" },
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
            {
                internalType: "uint256",
                name: "_initialTokenFairLaunch",
                type: "uint256",
            },
            { internalType: "uint256", name: "_fairLaunchDuration", type: "uint256" },
        ],
        name: "createPosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "fairLaunchInfo",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int256", name: "_amountSpecified", type: "int256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "fillFromPosition",
        outputs: [
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "BalanceDelta", name: "balanceDelta_", type: "int256" },
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "fairLaunchInfo_",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "inFairLaunchWindow",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int256", name: "_revenue", type: "int256" },
        ],
        name: "modifyRevenue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
];

const FastFlaunchZapAbi = [
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "CREATOR_FEE_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "FAIR_LAUNCH_SUPPLY",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "USDC_MARKET_CAP",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    { internalType: "address", name: "creator", type: "address" },
                ],
                internalType: "struct FastFlaunchZap.FastFlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const FeeEscrowAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_indexer", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "InvalidRecipient", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "PoolIdNotIndexed", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_payee",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "allocateFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "indexer",
        outputs: [
            { internalType: "contract IndexerSubscriber", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_indexer", type: "address" }],
        name: "setIndexer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "totalFeesAllocated",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "bool", name: "_unwrap", type: "bool" },
        ],
        name: "withdrawFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const FlaunchAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_memecoinImplementation",
                type: "address",
            },
            { internalType: "string", name: "_baseURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccountBalanceOverflow", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "CallerIsNotPositionManager", type: "error" },
    { inputs: [], name: "CallerNotL2ToL2CrossDomainMessenger", type: "error" },
    {
        inputs: [
            { internalType: "uint24", name: "_allocation", type: "uint24" },
            { internalType: "uint256", name: "_maxAllocation", type: "uint256" },
        ],
        name: "CreatorFeeAllocationInvalid",
        type: "error",
    },
    { inputs: [], name: "InvalidCrossDomainSender", type: "error" },
    { inputs: [], name: "InvalidDestinationChain", type: "error" },
    { inputs: [], name: "InvalidFlaunchSchedule", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "InvalidInitialSupply",
        type: "error",
    },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "NotOwnerNorApproved", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_buyAmount", type: "uint256" },
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "PremineExceedsInitialAmount",
        type: "error",
    },
    { inputs: [], name: "TokenAlreadyBridged", type: "error" },
    { inputs: [], name: "TokenAlreadyExists", type: "error" },
    { inputs: [], name: "TokenDoesNotExist", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownMemecoin", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "isApproved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_messageSource",
                type: "uint256",
            },
        ],
        name: "TokenBridged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
        ],
        name: "TokenBridging",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_CREATOR_ALLOCATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_FAIR_LAUNCH_TOKENS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_SCHEDULE_DURATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "baseURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "bridgingStatus",
        outputs: [{ internalType: "bool", name: "_started", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                ],
                internalType: "struct Flaunch.MemecoinMetadata",
                name: "_metadata",
                type: "tuple",
            },
        ],
        name: "finalizeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            {
                internalType: "address payable",
                name: "memecoinTreasury_",
                type: "address",
            },
            { internalType: "uint256", name: "tokenId_", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_memecoinTreasuryImplementation",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "initializeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoin",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoinTreasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinTreasuryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextTokenId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "isApproved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_memecoin", type: "address" },
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMemecoinMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_memecoin", type: "address" }],
        name: "tokenId",
        outputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

const FlaunchPositionManagerAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                ],
                internalType: "struct PositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_paid", type: "uint256" },
            { internalType: "uint256", name: "_required", type: "uint256" },
        ],
        name: "InsufficientFlaunchFee",
        type: "error",
    },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
        ],
        name: "TokenNotFlaunched",
        type: "error",
    },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_payee",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFee",
                type: "uint256",
            },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "_premineAmount",
                type: "int256",
            },
        ],
        name: "PoolPremine",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchesAt",
                type: "uint256",
            },
        ],
        name: "PoolScheduled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunch",
        outputs: [
            { internalType: "contract FairLaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract IFlaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "flaunchesAt",
        outputs: [
            { internalType: "uint256", name: "_flaunchTime", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "premineInfo",
        outputs: [
            { internalType: "int256", name: "amountSpecified", type: "int256" },
            { internalType: "uint256", name: "blockNumber", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "bool", name: "_unwrap", type: "bool" },
        ],
        name: "withdrawFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const FlaunchPositionManagerV1_1Abi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    { internalType: "address", name: "feeEscrow", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                    {
                        internalType: "contract TreasuryActionManager",
                        name: "actionManager",
                        type: "address",
                    },
                    {
                        internalType: "contract BidWall",
                        name: "bidWall",
                        type: "address",
                    },
                    {
                        internalType: "contract FairLaunch",
                        name: "fairLaunch",
                        type: "address",
                    },
                ],
                internalType: "struct PositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_paid", type: "uint256" },
            { internalType: "uint256", name: "_required", type: "uint256" },
        ],
        name: "InsufficientFlaunchFee",
        type: "error",
    },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
        ],
        name: "TokenNotFlaunched",
        type: "error",
    },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_unsoldSupply",
                type: "uint256",
            },
        ],
        name: "FairLaunchBurn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount1",
                type: "uint128",
            },
        ],
        name: "HookFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount1",
                type: "uint128",
            },
        ],
        name: "HookSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFee",
                type: "uint256",
            },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "_premineAmount",
                type: "int256",
            },
        ],
        name: "PoolPremine",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchesAt",
                type: "uint256",
            },
        ],
        name: "PoolScheduled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        inputs: [],
        name: "BURN_ADDRESS",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunch",
        outputs: [
            { internalType: "contract FairLaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract FeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract IFlaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "flaunchesAt",
        outputs: [
            { internalType: "uint256", name: "_flaunchTime", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const FlaunchV1_1Abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_memecoinImplementation",
                type: "address",
            },
            { internalType: "string", name: "_baseURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccountBalanceOverflow", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "CallerIsNotPositionManager", type: "error" },
    { inputs: [], name: "CallerNotL2ToL2CrossDomainMessenger", type: "error" },
    {
        inputs: [
            { internalType: "uint24", name: "_allocation", type: "uint24" },
            { internalType: "uint256", name: "_maxAllocation", type: "uint256" },
        ],
        name: "CreatorFeeAllocationInvalid",
        type: "error",
    },
    { inputs: [], name: "InvalidCrossDomainSender", type: "error" },
    { inputs: [], name: "InvalidDestinationChain", type: "error" },
    { inputs: [], name: "InvalidFlaunchSchedule", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "InvalidInitialSupply",
        type: "error",
    },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "NotOwnerNorApproved", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_buyAmount", type: "uint256" },
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "PremineExceedsInitialAmount",
        type: "error",
    },
    { inputs: [], name: "TokenAlreadyBridged", type: "error" },
    { inputs: [], name: "TokenAlreadyExists", type: "error" },
    { inputs: [], name: "TokenDoesNotExist", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownMemecoin", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "isApproved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_messageSource",
                type: "uint256",
            },
        ],
        name: "TokenBridged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
        ],
        name: "TokenBridging",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_CREATOR_ALLOCATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_FAIR_LAUNCH_TOKENS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_SCHEDULE_DURATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "baseURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "bridgingStatus",
        outputs: [{ internalType: "bool", name: "_started", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                ],
                internalType: "struct Flaunch.MemecoinMetadata",
                name: "_metadata",
                type: "tuple",
            },
        ],
        name: "finalizeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            {
                internalType: "address payable",
                name: "memecoinTreasury_",
                type: "address",
            },
            { internalType: "uint256", name: "tokenId_", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_memecoinTreasuryImplementation",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "initializeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoin",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoinTreasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinTreasuryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextTokenId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "poolId",
        outputs: [{ internalType: "PoolId", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "isApproved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_memecoin", type: "address" },
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMemecoinMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_memecoin", type: "address" }],
        name: "tokenId",
        outputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

const FlaunchZapAbi = [
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "contract Flaunch",
                name: "_flaunchContract",
                type: "address",
            },
            { internalType: "contract IFLETH", name: "_flETH", type: "address" },
            { internalType: "contract PoolSwap", name: "_poolSwap", type: "address" },
            {
                internalType: "contract ITreasuryManagerFactory",
                name: "_treasuryManagerFactory",
                type: "address",
            },
            {
                internalType: "contract IMerkleAirdrop",
                name: "_merkleAirdrop",
                type: "address",
            },
            {
                internalType: "contract WhitelistFairLaunch",
                name: "_whitelistFairLaunch",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "CreatorCannotBeZero", type: "error" },
    { inputs: [], name: "InsufficientMemecoinsForAirdrop", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_premineAmount", type: "uint256" },
            { internalType: "uint256", name: "_slippage", type: "uint256" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "calculateFee",
        outputs: [
            { internalType: "uint256", name: "ethRequired_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flETH",
        outputs: [{ internalType: "contract IFLETH", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_flaunchParams",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            { internalType: "uint256", name: "ethSpent_", type: "uint256" },
            { internalType: "address", name: "", type: "address" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_flaunchParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
                    { internalType: "string", name: "merkleIPFSHash", type: "string" },
                    { internalType: "uint256", name: "maxTokens", type: "uint256" },
                ],
                internalType: "struct FlaunchZap.WhitelistParams",
                name: "_whitelistParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "uint256", name: "airdropIndex", type: "uint256" },
                    { internalType: "uint256", name: "airdropAmount", type: "uint256" },
                    { internalType: "uint256", name: "airdropEndTime", type: "uint256" },
                    { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
                    { internalType: "string", name: "merkleIPFSHash", type: "string" },
                ],
                internalType: "struct FlaunchZap.AirdropParams",
                name: "_airdropParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "manager", type: "address" },
                    { internalType: "bytes", name: "initializeData", type: "bytes" },
                    { internalType: "bytes", name: "depositData", type: "bytes" },
                ],
                internalType: "struct FlaunchZap.TreasuryManagerParams",
                name: "_treasuryManagerParams",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            { internalType: "uint256", name: "ethSpent_", type: "uint256" },
            { internalType: "address", name: "deployedManager_", type: "address" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract Flaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "merkleAirdrop",
        outputs: [
            { internalType: "contract IMerkleAirdrop", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolSwap",
        outputs: [{ internalType: "contract PoolSwap", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "treasuryManagerFactory",
        outputs: [
            {
                internalType: "contract ITreasuryManagerFactory",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "whitelistFairLaunch",
        outputs: [
            {
                internalType: "contract WhitelistFairLaunch",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const InitialPriceAbi = [
    {
        inputs: [
            { internalType: "address", name: "_protocolOwner", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_ethToken", type: "address" },
            { internalType: "address", name: "_usdcToken", type: "address" },
            {
                internalType: "address",
                name: "_flaunchFeeExemption",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_usdcMarketCap", type: "uint256" },
            {
                internalType: "uint256",
                name: "_usdcMarketCapMinimum",
                type: "uint256",
            },
        ],
        name: "MarketCapTooSmall",
        type: "error",
    },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FlaunchFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "MINIMUM_USDC_MARKET_CAP",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "ethToken",
        outputs: [{ internalType: "Currency", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchFeeExemption",
        outputs: [
            {
                internalType: "contract FlaunchFeeExemption",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchFeeThreshold",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "bool", name: "_flipped", type: "bool" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getSqrtPriceX96",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96_", type: "uint160" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolId",
        outputs: [{ internalType: "PoolId", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_flaunchFeeThreshold",
                type: "uint256",
            },
        ],
        name: "setFlaunchFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "setPool",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "usdcToken",
        outputs: [{ internalType: "Currency", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "usdcToken0",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
];

const MemecoinAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    { inputs: [], name: "CallerNotFlaunch", type: "error" },
    { inputs: [], name: "MintAddressIsZero", type: "error" },
    { inputs: [], name: "Permit2AllowanceIsFixedAtInfinity", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "CrosschainBurn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "CrosschainMint",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "fromDelegate",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toDelegate",
                type: "address",
            },
        ],
        name: "DelegateChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegate",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "previousBalance",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newBalance",
                type: "uint256",
            },
        ],
        name: "DelegateVotesChanged",
        type: "event",
    },
    { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "_name", type: "string" },
            {
                indexed: false,
                internalType: "string",
                name: "_symbol",
                type: "string",
            },
        ],
        name: "MetadataUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "CLOCK_MODE",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint32", name: "pos", type: "uint32" },
        ],
        name: "checkpoints",
        outputs: [
            {
                components: [
                    { internalType: "uint32", name: "fromBlock", type: "uint32" },
                    { internalType: "uint224", name: "votes", type: "uint224" },
                ],
                internalType: "struct ERC20VotesUpgradeable.Checkpoint",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "clock",
        outputs: [{ internalType: "uint48", name: "", type: "uint48" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "creator",
        outputs: [{ internalType: "address", name: "creator_", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_from", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "crosschainBurn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "crosschainMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "delegatee", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "delegateBySig",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "delegates",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "eip712Domain",
        outputs: [
            { internalType: "bytes1", name: "fields", type: "bytes1" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "version", type: "string" },
            { internalType: "uint256", name: "chainId", type: "uint256" },
            { internalType: "address", name: "verifyingContract", type: "address" },
            { internalType: "bytes32", name: "salt", type: "bytes32" },
            { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunch",
        outputs: [{ internalType: "contract Flaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "timepoint", type: "uint256" }],
        name: "getPastTotalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "timepoint", type: "uint256" },
        ],
        name: "getPastVotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "getVotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
            { internalType: "string", name: "tokenUri_", type: "string" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "nonces",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "numCheckpoints",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "_interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "treasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
];

const MulticallAbi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes[]",
                name: "returnData",
                type: "bytes[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bool",
                        name: "allowFailure",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call3[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate3",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bool",
                        name: "allowFailure",
                        type: "bool",
                    },
                    {
                        internalType: "uint256",
                        name: "value",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call3Value[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate3Value",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "blockAndAggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getBasefee",
        outputs: [
            {
                internalType: "uint256",
                name: "basefee",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
        ],
        name: "getBlockHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBlockNumber",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getChainId",
        outputs: [
            {
                internalType: "uint256",
                name: "chainid",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockCoinbase",
        outputs: [
            {
                internalType: "address",
                name: "coinbase",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockDifficulty",
        outputs: [
            {
                internalType: "uint256",
                name: "difficulty",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockGasLimit",
        outputs: [
            {
                internalType: "uint256",
                name: "gaslimit",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockTimestamp",
        outputs: [
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "getEthBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLastBlockHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "requireSuccess",
                type: "bool",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "tryAggregate",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "requireSuccess",
                type: "bool",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "tryBlockAndAggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
];

const Permit2Abi = [
    {
        inputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
        name: "AllowanceExpired",
        type: "error",
    },
    { inputs: [], name: "ExcessiveInvalidation", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "InsufficientAllowance",
        type: "error",
    },
    {
        inputs: [{ internalType: "uint256", name: "maxAmount", type: "uint256" }],
        name: "InvalidAmount",
        type: "error",
    },
    { inputs: [], name: "InvalidContractSignature", type: "error" },
    { inputs: [], name: "InvalidNonce", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    { inputs: [], name: "InvalidSignatureLength", type: "error" },
    { inputs: [], name: "InvalidSigner", type: "error" },
    { inputs: [], name: "LengthMismatch", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "signatureDeadline", type: "uint256" },
        ],
        name: "SignatureExpired",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "Lockdown",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "newNonce",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "oldNonce",
                type: "uint48",
            },
        ],
        name: "NonceInvalidation",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
            { indexed: false, internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        name: "Permit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "word",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "mask",
                type: "uint256",
            },
        ],
        name: "UnorderedNonceInvalidation",
        type: "event",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
            { internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint48", name: "newNonce", type: "uint48" },
        ],
        name: "invalidateNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "wordPos", type: "uint256" },
            { internalType: "uint256", name: "mask", type: "uint256" },
        ],
        name: "invalidateUnorderedNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "address", name: "spender", type: "address" },
                ],
                internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
                name: "approvals",
                type: "tuple[]",
            },
        ],
        name: "lockdown",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "nonceBitmap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint160", name: "amount", type: "uint160" },
                            { internalType: "uint48", name: "expiration", type: "uint48" },
                            { internalType: "uint48", name: "nonce", type: "uint48" },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails[]",
                        name: "details",
                        type: "tuple[]",
                    },
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "sigDeadline", type: "uint256" },
                ],
                internalType: "struct IAllowanceTransfer.PermitBatch",
                name: "permitBatch",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint160", name: "amount", type: "uint160" },
                            { internalType: "uint48", name: "expiration", type: "uint48" },
                            { internalType: "uint48", name: "nonce", type: "uint48" },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails",
                        name: "details",
                        type: "tuple",
                    },
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "sigDeadline", type: "uint256" },
                ],
                internalType: "struct IAllowanceTransfer.PermitSingle",
                name: "permitSingle",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            { internalType: "string", name: "witnessTypeString", type: "string" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            { internalType: "string", name: "witnessTypeString", type: "string" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "from", type: "address" },
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint160", name: "amount", type: "uint160" },
                    { internalType: "address", name: "token", type: "address" },
                ],
                internalType: "struct IAllowanceTransfer.AllowanceTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "address", name: "token", type: "address" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const PoolManagerAbi = [
    {
        inputs: [
            { internalType: "address", name: "initialOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyUnlocked", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "currency0", type: "address" },
            { internalType: "address", name: "currency1", type: "address" },
        ],
        name: "CurrenciesOutOfOrderOrEqual",
        type: "error",
    },
    { inputs: [], name: "CurrencyNotSettled", type: "error" },
    { inputs: [], name: "DelegateCallNotAllowed", type: "error" },
    { inputs: [], name: "InvalidCaller", type: "error" },
    { inputs: [], name: "ManagerLocked", type: "error" },
    { inputs: [], name: "MustClearExactPositiveDelta", type: "error" },
    { inputs: [], name: "NonzeroNativeValue", type: "error" },
    { inputs: [], name: "PoolNotInitialized", type: "error" },
    { inputs: [], name: "ProtocolFeeCurrencySynced", type: "error" },
    {
        inputs: [{ internalType: "uint24", name: "fee", type: "uint24" }],
        name: "ProtocolFeeTooLarge",
        type: "error",
    },
    { inputs: [], name: "SwapAmountCannotBeZero", type: "error" },
    {
        inputs: [{ internalType: "int24", name: "tickSpacing", type: "int24" }],
        name: "TickSpacingTooLarge",
        type: "error",
    },
    {
        inputs: [{ internalType: "int24", name: "tickSpacing", type: "int24" }],
        name: "TickSpacingTooSmall",
        type: "error",
    },
    { inputs: [], name: "UnauthorizedDynamicLPFeeUpdate", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount1",
                type: "uint256",
            },
        ],
        name: "Donate",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "Currency",
                name: "currency0",
                type: "address",
            },
            {
                indexed: true,
                internalType: "Currency",
                name: "currency1",
                type: "address",
            },
            { indexed: false, internalType: "uint24", name: "fee", type: "uint24" },
            {
                indexed: false,
                internalType: "int24",
                name: "tickSpacing",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "Initialize",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "tickUpper",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "liquidityDelta",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "ModifyLiquidity",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            { indexed: false, internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "OperatorSet",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "user", type: "address" },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "protocolFeeController",
                type: "address",
            },
        ],
        name: "ProtocolFeeControllerUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: false,
                internalType: "uint24",
                name: "protocolFee",
                type: "uint24",
            },
        ],
        name: "ProtocolFeeUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "sqrtPriceX96",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "liquidity",
                type: "uint128",
            },
            { indexed: false, internalType: "int24", name: "tick", type: "int24" },
            { indexed: false, internalType: "uint24", name: "fee", type: "uint24" },
        ],
        name: "Swap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "caller",
                type: "address",
            },
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "clear",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "collectProtocolFees",
        outputs: [
            { internalType: "uint256", name: "amountCollected", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint256", name: "amount0", type: "uint256" },
            { internalType: "uint256", name: "amount1", type: "uint256" },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "donate",
        outputs: [{ internalType: "BalanceDelta", name: "delta", type: "int256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
        name: "extsload",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "startSlot", type: "bytes32" },
            { internalType: "uint256", name: "nSlots", type: "uint256" },
        ],
        name: "extsload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32[]", name: "slots", type: "bytes32[]" }],
        name: "extsload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32[]", name: "slots", type: "bytes32[]" }],
        name: "exttload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
        name: "exttload",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
        ],
        name: "initialize",
        outputs: [{ internalType: "int24", name: "tick", type: "int24" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isOperator",
        outputs: [{ internalType: "bool", name: "isOperator", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "params",
                type: "tuple",
            },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "modifyLiquidity",
        outputs: [
            { internalType: "BalanceDelta", name: "callerDelta", type: "int256" },
            { internalType: "BalanceDelta", name: "feesAccrued", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolFeeController",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "protocolFeesAccrued",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setOperator",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint24", name: "newProtocolFee", type: "uint24" },
        ],
        name: "setProtocolFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "controller", type: "address" }],
        name: "setProtocolFeeController",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "settle",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "recipient", type: "address" }],
        name: "settleFor",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "params",
                type: "tuple",
            },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "swap",
        outputs: [
            { internalType: "BalanceDelta", name: "swapDelta", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "sync",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "take",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "receiver", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "address", name: "receiver", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlock",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint24", name: "newDynamicLPFee", type: "uint24" },
        ],
        name: "updateDynamicLPFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const QuoterAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "NotEnoughLiquidity",
        type: "error",
    },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "QuoteSwap",
        type: "error",
    },
    { inputs: [], name: "UnexpectedCallSuccess", type: "error" },
    {
        inputs: [{ internalType: "bytes", name: "revertData", type: "bytes" }],
        name: "UnexpectedRevertBytes",
        type: "error",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactInput",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactInputSingle",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactOutput",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactOutputSingle",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInput",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutput",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutputSingle",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const ReferralEscrowAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_positionManager", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "MismatchedTokensAndLimits", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "TokensAssigned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "TokensClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenIn",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_ethOut",
                type: "uint256",
            },
        ],
        name: "TokensSwapped",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "_user", type: "address" },
            { internalType: "address", name: "_token", type: "address" },
        ],
        name: "allocations",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "address", name: "_user", type: "address" },
            { internalType: "address", name: "_token", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "assignTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "_tokens", type: "address[]" },
            {
                internalType: "uint160[]",
                name: "_sqrtPriceX96Limits",
                type: "uint160[]",
            },
            { internalType: "address payable", name: "_recipient", type: "address" },
        ],
        name: "claimAndSwap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "_tokens", type: "address[]" },
            { internalType: "address payable", name: "_recipient", type: "address" },
        ],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolSwap",
        outputs: [{ internalType: "contract PoolSwap", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_poolSwap", type: "address" }],
        name: "setPoolSwap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const RevenueManagerAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_treasuryManagerFactory",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "FailedToClaim", type: "error" },
    { inputs: [], name: "FlaunchContractNotValid", type: "error" },
    { inputs: [], name: "InvalidClaimer", type: "error" },
    { inputs: [], name: "InvalidCreatorAddress", type: "error" },
    { inputs: [], name: "InvalidProtocolFee", type: "error" },
    { inputs: [], name: "NotInitialized", type: "error" },
    { inputs: [], name: "NotManagerOwner", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "_unlockedAt", type: "uint256" }],
        name: "TokenTimelocked",
        type: "error",
    },
    { inputs: [], name: "UnknownFlaunchToken", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_creator",
                type: "address",
            },
        ],
        name: "CreatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "address payable",
                        name: "protocolRecipient",
                        type: "address",
                    },
                    { internalType: "uint256", name: "protocolFee", type: "uint256" },
                ],
                indexed: false,
                internalType: "struct RevenueManager.InitializeParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "ManagerInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_newOwner",
                type: "address",
            },
        ],
        name: "ManagerOwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolFee",
                type: "uint256",
            },
        ],
        name: "ProtocolFeeUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_protocolRecipient",
                type: "address",
            },
        ],
        name: "ProtocolRecipientUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ProtocolRevenueClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "RevenueClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
        ],
        name: "TreasuryEscrowed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
        ],
        name: "TreasuryReclaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_unlockedAt",
                type: "uint256",
            },
        ],
        name: "TreasuryTimelocked",
        type: "event",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "balance_", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "claim",
        outputs: [{ internalType: "uint256", name: "amount_", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken[]",
                name: "_flaunchToken",
                type: "tuple[]",
            },
        ],
        name: "claim",
        outputs: [{ internalType: "uint256", name: "amount_", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "creator",
        outputs: [{ internalType: "address", name: "_creator", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "creatorTotalClaimed",
        outputs: [{ internalType: "uint256", name: "_claimed", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address", name: "_creator", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "flaunchTokenInternalIds",
        outputs: [
            { internalType: "uint256", name: "_internalId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
        ],
        name: "getPoolId",
        outputs: [{ internalType: "PoolId", name: "poolId_", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        name: "getProtocolFee",
        outputs: [
            { internalType: "uint256", name: "protocolFee_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "initialized",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_internalId", type: "uint256" }],
        name: "internalIds",
        outputs: [
            { internalType: "contract Flaunch", name: "flaunch", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "managerOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextInternalId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolRecipient",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolTotalClaimed",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address", name: "_recipient", type: "address" },
        ],
        name: "rescue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address payable", name: "_creator", type: "address" },
        ],
        name: "setCreator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_protocolRecipient",
                type: "address",
            },
        ],
        name: "setProtocolRecipient",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_internalId", type: "uint256" }],
        name: "tokenPoolId",
        outputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenTimelock",
        outputs: [
            { internalType: "uint256", name: "_unlockedAt", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenTotalClaimed",
        outputs: [{ internalType: "uint256", name: "_claimed", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "tokens",
        outputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken[]",
                name: "flaunchTokens_",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_newManagerOwner", type: "address" },
        ],
        name: "transferManagerOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "treasuryManagerFactory",
        outputs: [
            {
                internalType: "contract TreasuryManagerFactory",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const StateViewAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getFeeGrowthGlobals",
        outputs: [
            { internalType: "uint256", name: "feeGrowthGlobal0", type: "uint256" },
            { internalType: "uint256", name: "feeGrowthGlobal1", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
        ],
        name: "getFeeGrowthInside",
        outputs: [
            {
                internalType: "uint256",
                name: "feeGrowthInside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getLiquidity",
        outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "bytes32", name: "positionId", type: "bytes32" },
        ],
        name: "getPositionInfo",
        outputs: [
            { internalType: "uint128", name: "liquidity", type: "uint128" },
            {
                internalType: "uint256",
                name: "feeGrowthInside0LastX128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1LastX128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "bytes32", name: "salt", type: "bytes32" },
        ],
        name: "getPositionInfo",
        outputs: [
            { internalType: "uint128", name: "liquidity", type: "uint128" },
            {
                internalType: "uint256",
                name: "feeGrowthInside0LastX128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1LastX128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "bytes32", name: "positionId", type: "bytes32" },
        ],
        name: "getPositionLiquidity",
        outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getSlot0",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
            { internalType: "int24", name: "tick", type: "int24" },
            { internalType: "uint24", name: "protocolFee", type: "uint24" },
            { internalType: "uint24", name: "lpFee", type: "uint24" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int16", name: "tick", type: "int16" },
        ],
        name: "getTickBitmap",
        outputs: [{ internalType: "uint256", name: "tickBitmap", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickFeeGrowthOutside",
        outputs: [
            {
                internalType: "uint256",
                name: "feeGrowthOutside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthOutside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickInfo",
        outputs: [
            { internalType: "uint128", name: "liquidityGross", type: "uint128" },
            { internalType: "int128", name: "liquidityNet", type: "int128" },
            {
                internalType: "uint256",
                name: "feeGrowthOutside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthOutside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickLiquidity",
        outputs: [
            { internalType: "uint128", name: "liquidityGross", type: "uint128" },
            { internalType: "int128", name: "liquidityNet", type: "int128" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
];

const TreasuryManagerFactoryAbi = [
    {
        inputs: [
            { internalType: "address", name: "_protocolOwner", type: "address" },
            { internalType: "address", name: "_feeEscrow", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownManagerImplemention", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_manager",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerDeployed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerImplementationApproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerImplementationUnapproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "approveManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "approvedManagerImplementation",
        outputs: [{ internalType: "bool", name: "_approved", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "deployAndInitializeManager",
        outputs: [
            { internalType: "address payable", name: "manager_", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "deployManager",
        outputs: [
            { internalType: "address payable", name: "manager_", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract IFeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_manager", type: "address" }],
        name: "managerImplementation",
        outputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "unapproveManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

const UniversalRouterAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "permit2", type: "address" },
                    { internalType: "address", name: "weth9", type: "address" },
                    { internalType: "address", name: "v2Factory", type: "address" },
                    { internalType: "address", name: "v3Factory", type: "address" },
                    {
                        internalType: "bytes32",
                        name: "pairInitCodeHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "poolInitCodeHash",
                        type: "bytes32",
                    },
                    { internalType: "address", name: "v4PoolManager", type: "address" },
                    {
                        internalType: "address",
                        name: "v3NFTPositionManager",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "v4PositionManager",
                        type: "address",
                    },
                ],
                internalType: "struct RouterParameters",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "BalanceTooLow", type: "error" },
    { inputs: [], name: "ContractLocked", type: "error" },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "DeltaNotNegative",
        type: "error",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "DeltaNotPositive",
        type: "error",
    },
    { inputs: [], name: "ETHNotAccepted", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "commandIndex", type: "uint256" },
            { internalType: "bytes", name: "message", type: "bytes" },
        ],
        name: "ExecutionFailed",
        type: "error",
    },
    { inputs: [], name: "FromAddressIsNotOwner", type: "error" },
    { inputs: [], name: "InputLengthMismatch", type: "error" },
    { inputs: [], name: "InsufficientBalance", type: "error" },
    { inputs: [], name: "InsufficientETH", type: "error" },
    { inputs: [], name: "InsufficientToken", type: "error" },
    {
        inputs: [{ internalType: "bytes4", name: "action", type: "bytes4" }],
        name: "InvalidAction",
        type: "error",
    },
    { inputs: [], name: "InvalidBips", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "commandType", type: "uint256" }],
        name: "InvalidCommandType",
        type: "error",
    },
    { inputs: [], name: "InvalidEthSender", type: "error" },
    { inputs: [], name: "InvalidPath", type: "error" },
    { inputs: [], name: "InvalidReserves", type: "error" },
    { inputs: [], name: "LengthMismatch", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "NotAuthorizedForToken",
        type: "error",
    },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "OnlyMintAllowed", type: "error" },
    { inputs: [], name: "SliceOutOfBounds", type: "error" },
    { inputs: [], name: "TransactionDeadlinePassed", type: "error" },
    { inputs: [], name: "UnsafeCast", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "action", type: "uint256" }],
        name: "UnsupportedAction",
        type: "error",
    },
    { inputs: [], name: "V2InvalidPath", type: "error" },
    { inputs: [], name: "V2TooLittleReceived", type: "error" },
    { inputs: [], name: "V2TooMuchRequested", type: "error" },
    { inputs: [], name: "V3InvalidAmountOut", type: "error" },
    { inputs: [], name: "V3InvalidCaller", type: "error" },
    { inputs: [], name: "V3InvalidSwap", type: "error" },
    { inputs: [], name: "V3TooLittleReceived", type: "error" },
    { inputs: [], name: "V3TooMuchRequested", type: "error" },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "minAmountOutReceived",
                type: "uint256",
            },
            { internalType: "uint256", name: "amountReceived", type: "uint256" },
        ],
        name: "V4TooLittleReceived",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "maxAmountInRequested",
                type: "uint256",
            },
            { internalType: "uint256", name: "amountRequested", type: "uint256" },
        ],
        name: "V4TooMuchRequested",
        type: "error",
    },
    {
        inputs: [],
        name: "V3_POSITION_MANAGER",
        outputs: [
            {
                internalType: "contract INonfungiblePositionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "V4_POSITION_MANAGER",
        outputs: [
            { internalType: "contract IPositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "commands", type: "bytes" },
            { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "commands", type: "bytes" },
            { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "msgSender",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

exports.AnyPositionManagerAbi = AnyPositionManagerAbi;
exports.BidWallV1_1Abi = BidWallV1_1Abi;
exports.BidwallAbi = BidwallAbi;
exports.FairLaunchAbi = FairLaunchAbi;
exports.FairLaunchV1_1Abi = FairLaunchV1_1Abi;
exports.FastFlaunchZapAbi = FastFlaunchZapAbi;
exports.FeeEscrowAbi = FeeEscrowAbi;
exports.FlaunchAbi = FlaunchAbi;
exports.FlaunchPositionManagerAbi = FlaunchPositionManagerAbi;
exports.FlaunchPositionManagerV1_1Abi = FlaunchPositionManagerV1_1Abi;
exports.FlaunchV1_1Abi = FlaunchV1_1Abi;
exports.FlaunchZapAbi = FlaunchZapAbi;
exports.InitialPriceAbi = InitialPriceAbi;
exports.MemecoinAbi = MemecoinAbi;
exports.MulticallAbi = MulticallAbi;
exports.Permit2Abi = Permit2Abi;
exports.PoolManagerAbi = PoolManagerAbi;
exports.QuoterAbi = QuoterAbi;
exports.ReferralEscrowAbi = ReferralEscrowAbi;
exports.RevenueManagerAbi = RevenueManagerAbi;
exports.StateViewAbi = StateViewAbi;
exports.TreasuryManagerFactoryAbi = TreasuryManagerFactoryAbi;
exports.UniversalRouterAbi = UniversalRouterAbi;
//# sourceMappingURL=index.cjs.map

export declare const FlaunchPositionManagerV1_1Abi: readonly [{
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "nativeToken";
            readonly type: "address";
        }, {
            readonly internalType: "contract IPoolManager";
            readonly name: "poolManager";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "uint24";
                readonly name: "swapFee";
                readonly type: "uint24";
            }, {
                readonly internalType: "uint24";
                readonly name: "referrer";
                readonly type: "uint24";
            }, {
                readonly internalType: "uint24";
                readonly name: "protocol";
                readonly type: "uint24";
            }, {
                readonly internalType: "bool";
                readonly name: "active";
                readonly type: "bool";
            }];
            readonly internalType: "struct FeeDistributor.FeeDistribution";
            readonly name: "feeDistribution";
            readonly type: "tuple";
        }, {
            readonly internalType: "contract IInitialPrice";
            readonly name: "initialPrice";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "protocolOwner";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "protocolFeeRecipient";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "flayGovernance";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "feeEscrow";
            readonly type: "address";
        }, {
            readonly internalType: "contract FeeExemptions";
            readonly name: "feeExemptions";
            readonly type: "address";
        }, {
            readonly internalType: "contract TreasuryActionManager";
            readonly name: "actionManager";
            readonly type: "address";
        }, {
            readonly internalType: "contract BidWall";
            readonly name: "bidWall";
            readonly type: "address";
        }, {
            readonly internalType: "contract FairLaunch";
            readonly name: "fairLaunch";
            readonly type: "address";
        }];
        readonly internalType: "struct PositionManager.ConstructorParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CallerIsNotBidWall";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_caller";
        readonly type: "address";
    }];
    readonly name: "CallerNotCreator";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CannotBeInitializedDirectly";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CannotModifyLiquidityDuringFairLaunch";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CannotSellTokenDuringFairLaunch";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "HookNotImplemented";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_paid";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_required";
        readonly type: "uint256";
    }];
    readonly name: "InsufficientFlaunchFee";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidPool";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LockFailure";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NewOwnerIsZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NoHandoverRequest";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotPoolManager";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotSelf";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ProtocolFeeInvalid";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "RecipientZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ReferrerFeeInvalid";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "SwapFeeInvalid";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_flaunchesAt";
        readonly type: "uint256";
    }];
    readonly name: "TokenNotFlaunched";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "UnknownPool";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "_allocation";
        readonly type: "uint24";
    }];
    readonly name: "CreatorFeeAllocationUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_unsoldSupply";
        readonly type: "uint256";
    }];
    readonly name: "FairLaunchBurn";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_feeCalculator";
        readonly type: "address";
    }];
    readonly name: "FairLaunchFeeCalculatorUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_feeCalculator";
        readonly type: "address";
    }];
    readonly name: "FeeCalculatorUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "swapFee";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "referrer";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "protocol";
            readonly type: "uint24";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }];
        readonly indexed: false;
        readonly internalType: "struct FeeDistributor.FeeDistribution";
        readonly name: "_feeDistribution";
        readonly type: "tuple";
    }];
    readonly name: "FeeDistributionUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "feeAmount0";
        readonly type: "uint128";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "feeAmount1";
        readonly type: "uint128";
    }];
    readonly name: "HookFee";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "int128";
        readonly name: "amount0";
        readonly type: "int128";
    }, {
        readonly indexed: false;
        readonly internalType: "int128";
        readonly name: "amount1";
        readonly type: "int128";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "hookLPfeeAmount0";
        readonly type: "uint128";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "hookLPfeeAmount1";
        readonly type: "uint128";
    }];
    readonly name: "HookSwap";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_initialPrice";
        readonly type: "address";
    }];
    readonly name: "InitialPriceUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipHandoverCanceled";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipHandoverRequested";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "oldOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "OwnershipTransferred";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_memecoin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_memecoinTreasury";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "_currencyFlipped";
        readonly type: "bool";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_flaunchFee";
        readonly type: "uint256";
    }, {
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "tokenUri";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "initialTokenFairLaunch";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fairLaunchDuration";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "premineAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "creator";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "creatorFeeAllocation";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint256";
            readonly name: "flaunchAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "initialPriceParams";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "feeCalculatorParams";
            readonly type: "bytes";
        }];
        readonly indexed: false;
        readonly internalType: "struct PositionManager.FlaunchParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "PoolCreated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "swapFee";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "referrer";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "protocol";
            readonly type: "uint24";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }];
        readonly indexed: false;
        readonly internalType: "struct FeeDistributor.FeeDistribution";
        readonly name: "_feeDistribution";
        readonly type: "tuple";
    }];
    readonly name: "PoolFeeDistributionUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_donateAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_creatorAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_bidWallAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_governanceAmount";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_protocolAmount";
        readonly type: "uint256";
    }];
    readonly name: "PoolFeesDistributed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount0";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount1";
        readonly type: "uint256";
    }];
    readonly name: "PoolFeesReceived";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "zeroForOne";
        readonly type: "bool";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount0";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount1";
        readonly type: "uint256";
    }];
    readonly name: "PoolFeesSwapped";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "_premineAmount";
        readonly type: "int256";
    }];
    readonly name: "PoolPremine";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_flaunchesAt";
        readonly type: "uint256";
    }];
    readonly name: "PoolScheduled";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint160";
        readonly name: "_sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "_tick";
        readonly type: "int24";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "_protocolFee";
        readonly type: "uint24";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "_swapFee";
        readonly type: "uint24";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "_liquidity";
        readonly type: "uint128";
    }];
    readonly name: "PoolStateUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "flAmount0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "flAmount1";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "flFee0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "flFee1";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "ispAmount0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "ispAmount1";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "ispFee0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "ispFee1";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "uniAmount0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "uniAmount1";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "uniFee0";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "uniFee1";
        readonly type: "int256";
    }];
    readonly name: "PoolSwap";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_referralEscrow";
        readonly type: "address";
    }];
    readonly name: "ReferralEscrowUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "ReferrerFeePaid";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "BURN_ADDRESS";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_PROTOCOL_ALLOCATION";
    readonly outputs: readonly [{
        readonly internalType: "uint24";
        readonly name: "";
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MIN_DISTRIBUTE_THRESHOLD";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "actionManager";
    readonly outputs: readonly [{
        readonly internalType: "contract TreasuryActionManager";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "int24";
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly internalType: "int256";
            readonly name: "liquidityDelta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct IPoolManager.ModifyLiquidityParams";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "_delta";
        readonly type: "int256";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "_feesAccrued";
        readonly type: "int256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "afterAddLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount0";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount1";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "afterDonate";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint160";
        readonly name: "";
        readonly type: "uint160";
    }, {
        readonly internalType: "int24";
        readonly name: "";
        readonly type: "int24";
    }];
    readonly name: "afterInitialize";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "int24";
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly internalType: "int256";
            readonly name: "liquidityDelta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct IPoolManager.ModifyLiquidityParams";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "_delta";
        readonly type: "int256";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "_feesAccrued";
        readonly type: "int256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "afterRemoveLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "int256";
            readonly name: "amountSpecified";
            readonly type: "int256";
        }, {
            readonly internalType: "uint160";
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }];
        readonly internalType: "struct IPoolManager.SwapParams";
        readonly name: "_params";
        readonly type: "tuple";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "_delta";
        readonly type: "int256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_hookData";
        readonly type: "bytes";
    }];
    readonly name: "afterSwap";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }, {
        readonly internalType: "int128";
        readonly name: "hookDeltaUnspecified_";
        readonly type: "int128";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "int24";
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly internalType: "int256";
            readonly name: "liquidityDelta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct IPoolManager.ModifyLiquidityParams";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "beforeAddLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "beforeDonate";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint160";
        readonly name: "";
        readonly type: "uint160";
    }];
    readonly name: "beforeInitialize";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "int24";
            readonly name: "tickLower";
            readonly type: "int24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickUpper";
            readonly type: "int24";
        }, {
            readonly internalType: "int256";
            readonly name: "liquidityDelta";
            readonly type: "int256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "salt";
            readonly type: "bytes32";
        }];
        readonly internalType: "struct IPoolManager.ModifyLiquidityParams";
        readonly name: "";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly name: "beforeRemoveLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "int256";
            readonly name: "amountSpecified";
            readonly type: "int256";
        }, {
            readonly internalType: "uint160";
            readonly name: "sqrtPriceLimitX96";
            readonly type: "uint160";
        }];
        readonly internalType: "struct IPoolManager.SwapParams";
        readonly name: "_params";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "_hookData";
        readonly type: "bytes";
    }];
    readonly name: "beforeSwap";
    readonly outputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "selector_";
        readonly type: "bytes4";
    }, {
        readonly internalType: "BeforeSwapDelta";
        readonly name: "beforeSwapDelta_";
        readonly type: "int256";
    }, {
        readonly internalType: "uint24";
        readonly name: "";
        readonly type: "uint24";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "bidWall";
    readonly outputs: readonly [{
        readonly internalType: "contract BidWall";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "cancelOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_key";
        readonly type: "tuple";
    }];
    readonly name: "closeBidWall";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "completeOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "fairLaunch";
    readonly outputs: readonly [{
        readonly internalType: "contract FairLaunch";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "fairLaunchFeeCalculator";
    readonly outputs: readonly [{
        readonly internalType: "contract IFeeCalculator";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "feeCalculator";
    readonly outputs: readonly [{
        readonly internalType: "contract IFeeCalculator";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "feeEscrow";
    readonly outputs: readonly [{
        readonly internalType: "contract FeeEscrow";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "feeExemptions";
    readonly outputs: readonly [{
        readonly internalType: "contract FeeExemptions";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "feeSplit";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "bidWall_";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "creator_";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "protocol_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "string";
            readonly name: "name";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "symbol";
            readonly type: "string";
        }, {
            readonly internalType: "string";
            readonly name: "tokenUri";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "initialTokenFairLaunch";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "fairLaunchDuration";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "premineAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "address";
            readonly name: "creator";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "creatorFeeAllocation";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint256";
            readonly name: "flaunchAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes";
            readonly name: "initialPriceParams";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "feeCalculatorParams";
            readonly type: "bytes";
        }];
        readonly internalType: "struct PositionManager.FlaunchParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "flaunch";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "memecoin_";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "flaunchContract";
    readonly outputs: readonly [{
        readonly internalType: "contract IFlaunch";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "flaunchesAt";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_flaunchTime";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "flayGovernance";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bool";
        readonly name: "_isFairLaunch";
        readonly type: "bool";
    }];
    readonly name: "getFeeCalculator";
    readonly outputs: readonly [{
        readonly internalType: "contract IFeeCalculator";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_initialPriceParams";
        readonly type: "bytes";
    }];
    readonly name: "getFlaunchingFee";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "_initialPriceParams";
        readonly type: "bytes";
    }];
    readonly name: "getFlaunchingMarketCap";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "getHookPermissions";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "bool";
            readonly name: "beforeInitialize";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterInitialize";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "beforeAddLiquidity";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterAddLiquidity";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "beforeRemoveLiquidity";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterRemoveLiquidity";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "beforeSwap";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterSwap";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "beforeDonate";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterDonate";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "beforeSwapReturnDelta";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterSwapReturnDelta";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterAddLiquidityReturnDelta";
            readonly type: "bool";
        }, {
            readonly internalType: "bool";
            readonly name: "afterRemoveLiquidityReturnDelta";
            readonly type: "bool";
        }];
        readonly internalType: "struct Hooks.Permissions";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "pure";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "getPoolFeeDistribution";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "swapFee";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "referrer";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "protocol";
            readonly type: "uint24";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }];
        readonly internalType: "struct FeeDistributor.FeeDistribution";
        readonly name: "feeDistribution_";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "initialPrice";
    readonly outputs: readonly [{
        readonly internalType: "contract IInitialPrice";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "nativeToken";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "notifier";
    readonly outputs: readonly [{
        readonly internalType: "contract Notifier";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "result";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "ownershipHandoverExpiresAt";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "result";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "_poolKey";
        readonly type: "tuple";
    }];
    readonly name: "poolFees";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "amount0";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "amount1";
            readonly type: "uint256";
        }];
        readonly internalType: "struct InternalSwapPool.ClaimableFees";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }];
    readonly name: "poolKey";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "currency0";
            readonly type: "address";
        }, {
            readonly internalType: "Currency";
            readonly name: "currency1";
            readonly type: "address";
        }, {
            readonly internalType: "uint24";
            readonly name: "fee";
            readonly type: "uint24";
        }, {
            readonly internalType: "int24";
            readonly name: "tickSpacing";
            readonly type: "int24";
        }, {
            readonly internalType: "contract IHooks";
            readonly name: "hooks";
            readonly type: "address";
        }];
        readonly internalType: "struct PoolKey";
        readonly name: "";
        readonly type: "tuple";
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
}, {
    readonly inputs: readonly [];
    readonly name: "referralEscrow";
    readonly outputs: readonly [{
        readonly internalType: "contract ReferralEscrow";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "renounceOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "requestOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IFeeCalculator";
        readonly name: "_feeCalculator";
        readonly type: "address";
    }];
    readonly name: "setFairLaunchFeeCalculator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract IFeeCalculator";
        readonly name: "_feeCalculator";
        readonly type: "address";
    }];
    readonly name: "setFeeCalculator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "swapFee";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "referrer";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "protocol";
            readonly type: "uint24";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }];
        readonly internalType: "struct FeeDistributor.FeeDistribution";
        readonly name: "_feeDistribution";
        readonly type: "tuple";
    }];
    readonly name: "setFeeDistribution";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_flaunchContract";
        readonly type: "address";
    }];
    readonly name: "setFlaunch";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_initialPrice";
        readonly type: "address";
    }];
    readonly name: "setInitialPrice";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint24";
            readonly name: "swapFee";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "referrer";
            readonly type: "uint24";
        }, {
            readonly internalType: "uint24";
            readonly name: "protocol";
            readonly type: "uint24";
        }, {
            readonly internalType: "bool";
            readonly name: "active";
            readonly type: "bool";
        }];
        readonly internalType: "struct FeeDistributor.FeeDistribution";
        readonly name: "_feeDistribution";
        readonly type: "tuple";
    }];
    readonly name: "setPoolFeeDistribution";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint24";
        readonly name: "_protocol";
        readonly type: "uint24";
    }];
    readonly name: "setProtocolFeeDistribution";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "_referralEscrow";
        readonly type: "address";
    }];
    readonly name: "setReferralEscrow";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "newOwner";
        readonly type: "address";
    }];
    readonly name: "transferOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "unlockCallback";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=FlaunchPositionManagerV1_1.d.ts.map
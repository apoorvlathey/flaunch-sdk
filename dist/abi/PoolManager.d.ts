export declare const PoolManagerAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "initialOwner";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyUnlocked";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "currency0";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "currency1";
        readonly type: "address";
    }];
    readonly name: "CurrenciesOutOfOrderOrEqual";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CurrencyNotSettled";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "DelegateCallNotAllowed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidCaller";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ManagerLocked";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MustClearExactPositiveDelta";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NonzeroNativeValue";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "PoolNotInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ProtocolFeeCurrencySynced";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint24";
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly name: "ProtocolFeeTooLarge";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "SwapAmountCannotBeZero";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "int24";
        readonly name: "tickSpacing";
        readonly type: "int24";
    }];
    readonly name: "TickSpacingTooLarge";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "int24";
        readonly name: "tickSpacing";
        readonly type: "int24";
    }];
    readonly name: "TickSpacingTooSmall";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnauthorizedDynamicLPFeeUpdate";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "Approval";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount1";
        readonly type: "uint256";
    }];
    readonly name: "Donate";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "Currency";
        readonly name: "currency0";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "Currency";
        readonly name: "currency1";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "fee";
        readonly type: "uint24";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "tickSpacing";
        readonly type: "int24";
    }, {
        readonly indexed: false;
        readonly internalType: "contract IHooks";
        readonly name: "hooks";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint160";
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly name: "Initialize";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "tickLower";
        readonly type: "int24";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "tickUpper";
        readonly type: "int24";
    }, {
        readonly indexed: false;
        readonly internalType: "int256";
        readonly name: "liquidityDelta";
        readonly type: "int256";
    }, {
        readonly indexed: false;
        readonly internalType: "bytes32";
        readonly name: "salt";
        readonly type: "bytes32";
    }];
    readonly name: "ModifyLiquidity";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "OperatorSet";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "user";
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
        readonly internalType: "address";
        readonly name: "protocolFeeController";
        readonly type: "address";
    }];
    readonly name: "ProtocolFeeControllerUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
        readonly name: "id";
        readonly type: "bytes32";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "protocolFee";
        readonly type: "uint24";
    }];
    readonly name: "ProtocolFeeUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "PoolId";
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
        readonly internalType: "uint160";
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }, {
        readonly indexed: false;
        readonly internalType: "uint128";
        readonly name: "liquidity";
        readonly type: "uint128";
    }, {
        readonly indexed: false;
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }, {
        readonly indexed: false;
        readonly internalType: "uint24";
        readonly name: "fee";
        readonly type: "uint24";
    }];
    readonly name: "Swap";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "caller";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "Transfer";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "allowance";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "spender";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "balance";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "burn";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "clear";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "recipient";
        readonly type: "address";
    }, {
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "collectProtocolFees";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amountCollected";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
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
        readonly name: "key";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount0";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount1";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly name: "donate";
    readonly outputs: readonly [{
        readonly internalType: "BalanceDelta";
        readonly name: "delta";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "slot";
        readonly type: "bytes32";
    }];
    readonly name: "extsload";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "startSlot";
        readonly type: "bytes32";
    }, {
        readonly internalType: "uint256";
        readonly name: "nSlots";
        readonly type: "uint256";
    }];
    readonly name: "extsload";
    readonly outputs: readonly [{
        readonly internalType: "bytes32[]";
        readonly name: "";
        readonly type: "bytes32[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32[]";
        readonly name: "slots";
        readonly type: "bytes32[]";
    }];
    readonly name: "extsload";
    readonly outputs: readonly [{
        readonly internalType: "bytes32[]";
        readonly name: "";
        readonly type: "bytes32[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32[]";
        readonly name: "slots";
        readonly type: "bytes32[]";
    }];
    readonly name: "exttload";
    readonly outputs: readonly [{
        readonly internalType: "bytes32[]";
        readonly name: "";
        readonly type: "bytes32[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "slot";
        readonly type: "bytes32";
    }];
    readonly name: "exttload";
    readonly outputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "";
        readonly type: "bytes32";
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
        readonly name: "key";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint160";
        readonly name: "sqrtPriceX96";
        readonly type: "uint160";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [{
        readonly internalType: "int24";
        readonly name: "tick";
        readonly type: "int24";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }];
    readonly name: "isOperator";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "isOperator";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "mint";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
        readonly name: "key";
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
        readonly name: "params";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly name: "modifyLiquidity";
    readonly outputs: readonly [{
        readonly internalType: "BalanceDelta";
        readonly name: "callerDelta";
        readonly type: "int256";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "feesAccrued";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "owner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolFeeController";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly name: "protocolFeesAccrued";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "approved";
        readonly type: "bool";
    }];
    readonly name: "setOperator";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
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
        readonly name: "key";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint24";
        readonly name: "newProtocolFee";
        readonly type: "uint24";
    }];
    readonly name: "setProtocolFee";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "controller";
        readonly type: "address";
    }];
    readonly name: "setProtocolFeeController";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "settle";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "recipient";
        readonly type: "address";
    }];
    readonly name: "settleFor";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "interfaceId";
        readonly type: "bytes4";
    }];
    readonly name: "supportsInterface";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
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
        readonly name: "key";
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
        readonly name: "params";
        readonly type: "tuple";
    }, {
        readonly internalType: "bytes";
        readonly name: "hookData";
        readonly type: "bytes";
    }];
    readonly name: "swap";
    readonly outputs: readonly [{
        readonly internalType: "BalanceDelta";
        readonly name: "swapDelta";
        readonly type: "int256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly name: "sync";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "take";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "transfer";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "receiver";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
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
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "unlock";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "result";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
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
        readonly name: "key";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint24";
        readonly name: "newDynamicLPFee";
        readonly type: "uint24";
    }];
    readonly name: "updateDynamicLPFee";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
//# sourceMappingURL=PoolManager.d.ts.map
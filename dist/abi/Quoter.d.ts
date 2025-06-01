export declare const QuoterAbi: readonly [{
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
    readonly name: "NotEnoughLiquidity";
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
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount";
        readonly type: "uint256";
    }];
    readonly name: "QuoteSwap";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnexpectedCallSuccess";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "revertData";
        readonly type: "bytes";
    }];
    readonly name: "UnexpectedRevertBytes";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "exactCurrency";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "Currency";
                readonly name: "intermediateCurrency";
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
            }, {
                readonly internalType: "bytes";
                readonly name: "hookData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PathKey[]";
            readonly name: "path";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "_quoteExactInput";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
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
            readonly name: "poolKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }, {
            readonly internalType: "bytes";
            readonly name: "hookData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactSingleParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "_quoteExactInputSingle";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "exactCurrency";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "Currency";
                readonly name: "intermediateCurrency";
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
            }, {
                readonly internalType: "bytes";
                readonly name: "hookData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PathKey[]";
            readonly name: "path";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "_quoteExactOutput";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
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
            readonly name: "poolKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }, {
            readonly internalType: "bytes";
            readonly name: "hookData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactSingleParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "_quoteExactOutputSingle";
    readonly outputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "";
        readonly type: "bytes";
    }];
    readonly stateMutability: "nonpayable";
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
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "exactCurrency";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "Currency";
                readonly name: "intermediateCurrency";
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
            }, {
                readonly internalType: "bytes";
                readonly name: "hookData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PathKey[]";
            readonly name: "path";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "quoteExactInput";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amountOut";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
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
            readonly name: "poolKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }, {
            readonly internalType: "bytes";
            readonly name: "hookData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactSingleParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "quoteExactInputSingle";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amountOut";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "Currency";
            readonly name: "exactCurrency";
            readonly type: "address";
        }, {
            readonly components: readonly [{
                readonly internalType: "Currency";
                readonly name: "intermediateCurrency";
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
            }, {
                readonly internalType: "bytes";
                readonly name: "hookData";
                readonly type: "bytes";
            }];
            readonly internalType: "struct PathKey[]";
            readonly name: "path";
            readonly type: "tuple[]";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "quoteExactOutput";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amountIn";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
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
            readonly name: "poolKey";
            readonly type: "tuple";
        }, {
            readonly internalType: "bool";
            readonly name: "zeroForOne";
            readonly type: "bool";
        }, {
            readonly internalType: "uint128";
            readonly name: "exactAmount";
            readonly type: "uint128";
        }, {
            readonly internalType: "bytes";
            readonly name: "hookData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct IV4Quoter.QuoteExactSingleParams";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly name: "quoteExactOutputSingle";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amountIn";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "gasEstimate";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
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
}];
//# sourceMappingURL=Quoter.d.ts.map
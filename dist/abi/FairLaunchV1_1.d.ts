export declare const FairLaunchV1_1Abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract IPoolManager";
        readonly name: "_poolManager";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AccessControlBadConfirmation";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "bytes32";
        readonly name: "neededRole";
        readonly type: "bytes32";
    }];
    readonly name: "AccessControlUnauthorizedAccount";
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
    readonly name: "NotPositionManager";
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
        readonly internalType: "uint256";
        readonly name: "_tokens";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_startsAt";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_endsAt";
        readonly type: "uint256";
    }];
    readonly name: "FairLaunchCreated";
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
        readonly name: "_revenue";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_supply";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_endedAt";
        readonly type: "uint256";
    }];
    readonly name: "FairLaunchEnded";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "previousAdminRole";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "newAdminRole";
        readonly type: "bytes32";
    }];
    readonly name: "RoleAdminChanged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleGranted";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "sender";
        readonly type: "address";
    }];
    readonly name: "RoleRevoked";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "DEFAULT_ADMIN_ROLE";
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
        readonly name: "_poolKey";
        readonly type: "tuple";
    }, {
        readonly internalType: "uint256";
        readonly name: "_tokenFees";
        readonly type: "uint256";
    }, {
        readonly internalType: "bool";
        readonly name: "_nativeIsZero";
        readonly type: "bool";
    }];
    readonly name: "closePosition";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "startsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "int24";
            readonly name: "initialTick";
            readonly type: "int24";
        }, {
            readonly internalType: "uint256";
            readonly name: "revenue";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "supply";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "closed";
            readonly type: "bool";
        }];
        readonly internalType: "struct FairLaunch.FairLaunchInfo";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int24";
        readonly name: "_initialTick";
        readonly type: "int24";
    }, {
        readonly internalType: "uint256";
        readonly name: "_flaunchesAt";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_initialTokenFairLaunch";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_fairLaunchDuration";
        readonly type: "uint256";
    }];
    readonly name: "createPosition";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "startsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "int24";
            readonly name: "initialTick";
            readonly type: "int24";
        }, {
            readonly internalType: "uint256";
            readonly name: "revenue";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "supply";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "closed";
            readonly type: "bool";
        }];
        readonly internalType: "struct FairLaunch.FairLaunchInfo";
        readonly name: "";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "fairLaunchInfo";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "startsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "int24";
            readonly name: "initialTick";
            readonly type: "int24";
        }, {
            readonly internalType: "uint256";
            readonly name: "revenue";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "supply";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "closed";
            readonly type: "bool";
        }];
        readonly internalType: "struct FairLaunch.FairLaunchInfo";
        readonly name: "";
        readonly type: "tuple";
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
    }, {
        readonly internalType: "int256";
        readonly name: "_amountSpecified";
        readonly type: "int256";
    }, {
        readonly internalType: "bool";
        readonly name: "_nativeIsZero";
        readonly type: "bool";
    }];
    readonly name: "fillFromPosition";
    readonly outputs: readonly [{
        readonly internalType: "BeforeSwapDelta";
        readonly name: "beforeSwapDelta_";
        readonly type: "int256";
    }, {
        readonly internalType: "BalanceDelta";
        readonly name: "balanceDelta_";
        readonly type: "int256";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "startsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "endsAt";
            readonly type: "uint256";
        }, {
            readonly internalType: "int24";
            readonly name: "initialTick";
            readonly type: "int24";
        }, {
            readonly internalType: "uint256";
            readonly name: "revenue";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "supply";
            readonly type: "uint256";
        }, {
            readonly internalType: "bool";
            readonly name: "closed";
            readonly type: "bool";
        }];
        readonly internalType: "struct FairLaunch.FairLaunchInfo";
        readonly name: "fairLaunchInfo_";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }];
    readonly name: "getRoleAdmin";
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
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "grantRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "hasRole";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "inFairLaunchWindow";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "int256";
        readonly name: "_revenue";
        readonly type: "int256";
    }];
    readonly name: "modifyRevenue";
    readonly outputs: readonly [];
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
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "callerConfirmation";
        readonly type: "address";
    }];
    readonly name: "renounceRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes32";
        readonly name: "role";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }];
    readonly name: "revokeRole";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
}];
//# sourceMappingURL=FairLaunchV1_1.d.ts.map
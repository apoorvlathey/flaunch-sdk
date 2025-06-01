export declare const ReferralEscrowAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_nativeToken";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_positionManager";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "MismatchedTokensAndLimits";
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
    readonly name: "Unauthorized";
    readonly type: "error";
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
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_user";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "TokensAssigned";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_user";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "TokensClaimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_user";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_tokenIn";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_ethOut";
        readonly type: "uint256";
    }];
    readonly name: "TokensSwapped";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_user";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }];
    readonly name: "allocations";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "_user";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_token";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "assignTokens";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "cancelOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "_tokens";
        readonly type: "address[]";
    }, {
        readonly internalType: "uint160[]";
        readonly name: "_sqrtPriceX96Limits";
        readonly type: "uint160[]";
    }, {
        readonly internalType: "address payable";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "claimAndSwap";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address[]";
        readonly name: "_tokens";
        readonly type: "address[]";
    }, {
        readonly internalType: "address payable";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "claimTokens";
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
    readonly inputs: readonly [];
    readonly name: "poolSwap";
    readonly outputs: readonly [{
        readonly internalType: "contract PoolSwap";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "positionManager";
    readonly outputs: readonly [{
        readonly internalType: "address";
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
        readonly internalType: "address";
        readonly name: "_poolSwap";
        readonly type: "address";
    }];
    readonly name: "setPoolSwap";
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
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=ReferralEscrow.d.ts.map
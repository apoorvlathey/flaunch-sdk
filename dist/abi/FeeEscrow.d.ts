export declare const FeeEscrowAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_nativeToken";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_indexer";
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
    readonly name: "InvalidRecipient";
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
    readonly name: "PoolIdNotIndexed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "RecipientZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
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
        readonly internalType: "address";
        readonly name: "_payee";
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
    readonly name: "Deposit";
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
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
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
    readonly name: "Withdrawal";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }, {
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "allocateFees";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "balances";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
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
    readonly name: "indexer";
    readonly outputs: readonly [{
        readonly internalType: "contract IndexerSubscriber";
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
        readonly name: "_indexer";
        readonly type: "address";
    }];
    readonly name: "setIndexer";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly name: "totalFeesAllocated";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
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
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "_unwrap";
        readonly type: "bool";
    }];
    readonly name: "withdrawFees";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=FeeEscrow.d.ts.map
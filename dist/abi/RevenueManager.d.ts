export declare const RevenueManagerAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_treasuryManagerFactory";
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
    readonly name: "FailedToClaim";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FlaunchContractNotValid";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidClaimer";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidCreatorAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidProtocolFee";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotManagerOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_unlockedAt";
        readonly type: "uint256";
    }];
    readonly name: "TokenTimelocked";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnknownFlaunchToken";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_creator";
        readonly type: "address";
    }];
    readonly name: "CreatorUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly components: readonly [{
            readonly internalType: "address payable";
            readonly name: "protocolRecipient";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "protocolFee";
            readonly type: "uint256";
        }];
        readonly indexed: false;
        readonly internalType: "struct RevenueManager.InitializeParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "ManagerInitialized";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_previousOwner";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_newOwner";
        readonly type: "address";
    }];
    readonly name: "ManagerOwnershipTransferred";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_protocolFee";
        readonly type: "uint256";
    }];
    readonly name: "ProtocolFeeUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_protocolRecipient";
        readonly type: "address";
    }];
    readonly name: "ProtocolRecipientUpdated";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "ProtocolRevenueClaimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "RevenueClaimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }];
    readonly name: "TreasuryEscrowed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "TreasuryReclaimed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_unlockedAt";
        readonly type: "uint256";
    }];
    readonly name: "TreasuryTimelocked";
    readonly type: "event";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "balances";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "balance_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "claim";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken[]";
        readonly name: "_flaunchToken";
        readonly type: "tuple[]";
    }];
    readonly name: "claim";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "amount_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "creator";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "_creator";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_creator";
        readonly type: "address";
    }];
    readonly name: "creatorTotalClaimed";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_claimed";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken";
        readonly name: "_flaunchToken";
        readonly type: "tuple";
    }, {
        readonly internalType: "address";
        readonly name: "_creator";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "deposit";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "flaunchTokenInternalIds";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_internalId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken";
        readonly name: "_flaunchToken";
        readonly type: "tuple";
    }];
    readonly name: "getPoolId";
    readonly outputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "poolId_";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_amount";
        readonly type: "uint256";
    }];
    readonly name: "getProtocolFee";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "protocolFee_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "initialized";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_internalId";
        readonly type: "uint256";
    }];
    readonly name: "internalIds";
    readonly outputs: readonly [{
        readonly internalType: "contract Flaunch";
        readonly name: "flaunch";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "managerOwner";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "nextInternalId";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolFee";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolRecipient";
    readonly outputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "protocolTotalClaimed";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken";
        readonly name: "_flaunchToken";
        readonly type: "tuple";
    }, {
        readonly internalType: "address";
        readonly name: "_recipient";
        readonly type: "address";
    }];
    readonly name: "rescue";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken";
        readonly name: "_flaunchToken";
        readonly type: "tuple";
    }, {
        readonly internalType: "address payable";
        readonly name: "_creator";
        readonly type: "address";
    }];
    readonly name: "setCreator";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "_protocolRecipient";
        readonly type: "address";
    }];
    readonly name: "setProtocolRecipient";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_internalId";
        readonly type: "uint256";
    }];
    readonly name: "tokenPoolId";
    readonly outputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "_poolId";
        readonly type: "bytes32";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "tokenTimelock";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_unlockedAt";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_flaunch";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "tokenTotalClaimed";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_claimed";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_creator";
        readonly type: "address";
    }];
    readonly name: "tokens";
    readonly outputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "contract Flaunch";
            readonly name: "flaunch";
            readonly type: "address";
        }, {
            readonly internalType: "uint256";
            readonly name: "tokenId";
            readonly type: "uint256";
        }];
        readonly internalType: "struct ITreasuryManager.FlaunchToken[]";
        readonly name: "flaunchTokens_";
        readonly type: "tuple[]";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_newManagerOwner";
        readonly type: "address";
    }];
    readonly name: "transferManagerOwnership";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "treasuryManagerFactory";
    readonly outputs: readonly [{
        readonly internalType: "contract TreasuryManagerFactory";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=RevenueManager.d.ts.map
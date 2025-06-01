export declare const FlaunchZapAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract PositionManager";
        readonly name: "_positionManager";
        readonly type: "address";
    }, {
        readonly internalType: "contract Flaunch";
        readonly name: "_flaunchContract";
        readonly type: "address";
    }, {
        readonly internalType: "contract IFLETH";
        readonly name: "_flETH";
        readonly type: "address";
    }, {
        readonly internalType: "contract PoolSwap";
        readonly name: "_poolSwap";
        readonly type: "address";
    }, {
        readonly internalType: "contract ITreasuryManagerFactory";
        readonly name: "_treasuryManagerFactory";
        readonly type: "address";
    }, {
        readonly internalType: "contract IMerkleAirdrop";
        readonly name: "_merkleAirdrop";
        readonly type: "address";
    }, {
        readonly internalType: "contract WhitelistFairLaunch";
        readonly name: "_whitelistFairLaunch";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "CreatorCannotBeZero";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientMemecoinsForAirdrop";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_premineAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_slippage";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "_initialPriceParams";
        readonly type: "bytes";
    }];
    readonly name: "calculateFee";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "ethRequired_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "flETH";
    readonly outputs: readonly [{
        readonly internalType: "contract IFLETH";
        readonly name: "";
        readonly type: "address";
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
        readonly name: "_flaunchParams";
        readonly type: "tuple";
    }];
    readonly name: "flaunch";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "memecoin_";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "ethSpent_";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
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
        readonly name: "_flaunchParams";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "bytes32";
            readonly name: "merkleRoot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "string";
            readonly name: "merkleIPFSHash";
            readonly type: "string";
        }, {
            readonly internalType: "uint256";
            readonly name: "maxTokens";
            readonly type: "uint256";
        }];
        readonly internalType: "struct FlaunchZap.WhitelistParams";
        readonly name: "_whitelistParams";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "uint256";
            readonly name: "airdropIndex";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "airdropAmount";
            readonly type: "uint256";
        }, {
            readonly internalType: "uint256";
            readonly name: "airdropEndTime";
            readonly type: "uint256";
        }, {
            readonly internalType: "bytes32";
            readonly name: "merkleRoot";
            readonly type: "bytes32";
        }, {
            readonly internalType: "string";
            readonly name: "merkleIPFSHash";
            readonly type: "string";
        }];
        readonly internalType: "struct FlaunchZap.AirdropParams";
        readonly name: "_airdropParams";
        readonly type: "tuple";
    }, {
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "manager";
            readonly type: "address";
        }, {
            readonly internalType: "bytes";
            readonly name: "initializeData";
            readonly type: "bytes";
        }, {
            readonly internalType: "bytes";
            readonly name: "depositData";
            readonly type: "bytes";
        }];
        readonly internalType: "struct FlaunchZap.TreasuryManagerParams";
        readonly name: "_treasuryManagerParams";
        readonly type: "tuple";
    }];
    readonly name: "flaunch";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "memecoin_";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "ethSpent_";
        readonly type: "uint256";
    }, {
        readonly internalType: "address";
        readonly name: "deployedManager_";
        readonly type: "address";
    }];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "flaunchContract";
    readonly outputs: readonly [{
        readonly internalType: "contract Flaunch";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "merkleAirdrop";
    readonly outputs: readonly [{
        readonly internalType: "contract IMerkleAirdrop";
        readonly name: "";
        readonly type: "address";
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
        readonly internalType: "contract PositionManager";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "treasuryManagerFactory";
    readonly outputs: readonly [{
        readonly internalType: "contract ITreasuryManagerFactory";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "whitelistFairLaunch";
    readonly outputs: readonly [{
        readonly internalType: "contract WhitelistFairLaunch";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=FlaunchZap.d.ts.map
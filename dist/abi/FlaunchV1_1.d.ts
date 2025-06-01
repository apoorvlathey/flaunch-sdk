export declare const FlaunchV1_1Abi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_memecoinImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "string";
        readonly name: "_baseURI";
        readonly type: "string";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "AccountBalanceOverflow";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "AlreadyInitialized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "BalanceQueryForZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CallerIsNotPositionManager";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "CallerNotL2ToL2CrossDomainMessenger";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint24";
        readonly name: "_allocation";
        readonly type: "uint24";
    }, {
        readonly internalType: "uint256";
        readonly name: "_maxAllocation";
        readonly type: "uint256";
    }];
    readonly name: "CreatorFeeAllocationInvalid";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidCrossDomainSender";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidDestinationChain";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidFlaunchSchedule";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_initialSupply";
        readonly type: "uint256";
    }];
    readonly name: "InvalidInitialSupply";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidInitialization";
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
    readonly name: "NotInitializing";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotOwnerNorApproved";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_buyAmount";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_initialSupply";
        readonly type: "uint256";
    }];
    readonly name: "PremineExceedsInitialAmount";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TokenAlreadyBridged";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TokenAlreadyExists";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TokenDoesNotExist";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TransferFromIncorrectOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TransferToNonERC721ReceiverImplementer";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TransferToZeroAddress";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "Unauthorized";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnknownMemecoin";
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
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "Approval";
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
        readonly name: "isApproved";
        readonly type: "bool";
    }];
    readonly name: "ApprovalForAll";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint64";
        readonly name: "version";
        readonly type: "uint64";
    }];
    readonly name: "Initialized";
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
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_chainId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_memecoin";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_messageSource";
        readonly type: "uint256";
    }];
    readonly name: "TokenBridged";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "uint256";
        readonly name: "_chainId";
        readonly type: "uint256";
    }, {
        readonly indexed: false;
        readonly internalType: "address";
        readonly name: "_memecoin";
        readonly type: "address";
    }];
    readonly name: "TokenBridging";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
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
    }];
    readonly name: "Transfer";
    readonly type: "event";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_CREATOR_ALLOCATION";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_FAIR_LAUNCH_TOKENS";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "MAX_SCHEDULE_DURATION";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "account";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "approve";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "owner";
        readonly type: "address";
    }];
    readonly name: "balanceOf";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "result";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "baseURI";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_chainId";
        readonly type: "uint256";
    }];
    readonly name: "bridgingStatus";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "_started";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "burn";
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
        readonly internalType: "address";
        readonly name: "pendingOwner";
        readonly type: "address";
    }];
    readonly name: "completeOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
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
        }];
        readonly internalType: "struct Flaunch.MemecoinMetadata";
        readonly name: "_metadata";
        readonly type: "tuple";
    }];
    readonly name: "finalizeBridge";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
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
    }, {
        readonly internalType: "address payable";
        readonly name: "memecoinTreasury_";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "tokenId_";
        readonly type: "uint256";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "getApproved";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "result";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "contract PositionManager";
        readonly name: "_positionManager";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_memecoinTreasuryImplementation";
        readonly type: "address";
    }];
    readonly name: "initialize";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "_chainId";
        readonly type: "uint256";
    }];
    readonly name: "initializeBridge";
    readonly outputs: readonly [];
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
    readonly name: "isApprovedForAll";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "result";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "memecoin";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "memecoinImplementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "memecoinTreasury";
    readonly outputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "memecoinTreasuryImplementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "name";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "nextTokenId";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
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
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "ownerOf";
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
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "poolId";
    readonly outputs: readonly [{
        readonly internalType: "PoolId";
        readonly name: "";
        readonly type: "bytes32";
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
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "safeTransferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "operator";
        readonly type: "address";
    }, {
        readonly internalType: "bool";
        readonly name: "isApproved";
        readonly type: "bool";
    }];
    readonly name: "setApprovalForAll";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "_baseURI";
        readonly type: "string";
    }];
    readonly name: "setBaseURI";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_memecoin";
        readonly type: "address";
    }, {
        readonly internalType: "string";
        readonly name: "name_";
        readonly type: "string";
    }, {
        readonly internalType: "string";
        readonly name: "symbol_";
        readonly type: "string";
    }];
    readonly name: "setMemecoinMetadata";
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
        readonly name: "result";
        readonly type: "bool";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "symbol";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_memecoin";
        readonly type: "address";
    }];
    readonly name: "tokenId";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "_tokenId";
        readonly type: "uint256";
    }];
    readonly name: "tokenURI";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "from";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "to";
        readonly type: "address";
    }, {
        readonly internalType: "uint256";
        readonly name: "id";
        readonly type: "uint256";
    }];
    readonly name: "transferFrom";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
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
}];
//# sourceMappingURL=FlaunchV1_1.d.ts.map
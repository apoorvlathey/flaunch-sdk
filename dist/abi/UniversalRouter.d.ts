export declare const UniversalRouterAbi: readonly [{
    readonly inputs: readonly [{
        readonly components: readonly [{
            readonly internalType: "address";
            readonly name: "permit2";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "weth9";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "v2Factory";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "v3Factory";
            readonly type: "address";
        }, {
            readonly internalType: "bytes32";
            readonly name: "pairInitCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "bytes32";
            readonly name: "poolInitCodeHash";
            readonly type: "bytes32";
        }, {
            readonly internalType: "address";
            readonly name: "v4PoolManager";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "v3NFTPositionManager";
            readonly type: "address";
        }, {
            readonly internalType: "address";
            readonly name: "v4PositionManager";
            readonly type: "address";
        }];
        readonly internalType: "struct RouterParameters";
        readonly name: "params";
        readonly type: "tuple";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "BalanceTooLow";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ContractLocked";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly name: "DeltaNotNegative";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "Currency";
        readonly name: "currency";
        readonly type: "address";
    }];
    readonly name: "DeltaNotPositive";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "ETHNotAccepted";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "commandIndex";
        readonly type: "uint256";
    }, {
        readonly internalType: "bytes";
        readonly name: "message";
        readonly type: "bytes";
    }];
    readonly name: "ExecutionFailed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "FromAddressIsNotOwner";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InputLengthMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientBalance";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientETH";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InsufficientToken";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes4";
        readonly name: "action";
        readonly type: "bytes4";
    }];
    readonly name: "InvalidAction";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidBips";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "commandType";
        readonly type: "uint256";
    }];
    readonly name: "InvalidCommandType";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidEthSender";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidPath";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "InvalidReserves";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "LengthMismatch";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "tokenId";
        readonly type: "uint256";
    }];
    readonly name: "NotAuthorizedForToken";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "NotPoolManager";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "OnlyMintAllowed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "SliceOutOfBounds";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "TransactionDeadlinePassed";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "UnsafeCast";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "action";
        readonly type: "uint256";
    }];
    readonly name: "UnsupportedAction";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V2InvalidPath";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V2TooLittleReceived";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V2TooMuchRequested";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3InvalidAmountOut";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3InvalidCaller";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3InvalidSwap";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3TooLittleReceived";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3TooMuchRequested";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "minAmountOutReceived";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amountReceived";
        readonly type: "uint256";
    }];
    readonly name: "V4TooLittleReceived";
    readonly type: "error";
}, {
    readonly inputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "maxAmountInRequested";
        readonly type: "uint256";
    }, {
        readonly internalType: "uint256";
        readonly name: "amountRequested";
        readonly type: "uint256";
    }];
    readonly name: "V4TooMuchRequested";
    readonly type: "error";
}, {
    readonly inputs: readonly [];
    readonly name: "V3_POSITION_MANAGER";
    readonly outputs: readonly [{
        readonly internalType: "contract INonfungiblePositionManager";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "V4_POSITION_MANAGER";
    readonly outputs: readonly [{
        readonly internalType: "contract IPositionManager";
        readonly name: "";
        readonly type: "address";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "commands";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "inputs";
        readonly type: "bytes[]";
    }];
    readonly name: "execute";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "bytes";
        readonly name: "commands";
        readonly type: "bytes";
    }, {
        readonly internalType: "bytes[]";
        readonly name: "inputs";
        readonly type: "bytes[]";
    }, {
        readonly internalType: "uint256";
        readonly name: "deadline";
        readonly type: "uint256";
    }];
    readonly name: "execute";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "msgSender";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "";
        readonly type: "address";
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
    readonly inputs: readonly [{
        readonly internalType: "int256";
        readonly name: "amount0Delta";
        readonly type: "int256";
    }, {
        readonly internalType: "int256";
        readonly name: "amount1Delta";
        readonly type: "int256";
    }, {
        readonly internalType: "bytes";
        readonly name: "data";
        readonly type: "bytes";
    }];
    readonly name: "uniswapV3SwapCallback";
    readonly outputs: readonly [];
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
}, {
    readonly stateMutability: "payable";
    readonly type: "receive";
}];
//# sourceMappingURL=UniversalRouter.d.ts.map
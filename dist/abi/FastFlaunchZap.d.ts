export declare const FastFlaunchZapAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "contract PositionManager";
        readonly name: "_positionManager";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "constructor";
}, {
    readonly inputs: readonly [];
    readonly name: "CREATOR_FEE_ALLOCATION";
    readonly outputs: readonly [{
        readonly internalType: "uint24";
        readonly name: "";
        readonly type: "uint24";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "FAIR_LAUNCH_SUPPLY";
    readonly outputs: readonly [{
        readonly internalType: "uint256";
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "USDC_MARKET_CAP";
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
            readonly internalType: "address";
            readonly name: "creator";
            readonly type: "address";
        }];
        readonly internalType: "struct FastFlaunchZap.FastFlaunchParams";
        readonly name: "_params";
        readonly type: "tuple";
    }];
    readonly name: "flaunch";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "memecoin_";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
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
}];
//# sourceMappingURL=FastFlaunchZap.d.ts.map
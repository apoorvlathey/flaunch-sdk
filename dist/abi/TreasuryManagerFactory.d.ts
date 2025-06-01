export declare const TreasuryManagerFactoryAbi: readonly [{
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_protocolOwner";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_feeEscrow";
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
    readonly name: "AlreadyInitialized";
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
    readonly inputs: readonly [];
    readonly name: "UnknownManagerImplemention";
    readonly type: "error";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_manager";
        readonly type: "address";
    }, {
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "ManagerDeployed";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "ManagerImplementationApproved";
    readonly type: "event";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: true;
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "ManagerImplementationUnapproved";
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
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "approveManager";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "approvedManagerImplementation";
    readonly outputs: readonly [{
        readonly internalType: "bool";
        readonly name: "_approved";
        readonly type: "bool";
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
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }, {
        readonly internalType: "address";
        readonly name: "_owner";
        readonly type: "address";
    }, {
        readonly internalType: "bytes";
        readonly name: "_data";
        readonly type: "bytes";
    }];
    readonly name: "deployAndInitializeManager";
    readonly outputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "manager_";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "address";
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "deployManager";
    readonly outputs: readonly [{
        readonly internalType: "address payable";
        readonly name: "manager_";
        readonly type: "address";
    }];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly inputs: readonly [];
    readonly name: "feeEscrow";
    readonly outputs: readonly [{
        readonly internalType: "contract IFeeEscrow";
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
        readonly internalType: "address";
        readonly name: "_manager";
        readonly type: "address";
    }];
    readonly name: "managerImplementation";
    readonly outputs: readonly [{
        readonly internalType: "address";
        readonly name: "_managerImplementation";
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
    readonly inputs: readonly [];
    readonly name: "requestOwnershipHandover";
    readonly outputs: readonly [];
    readonly stateMutability: "payable";
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
        readonly name: "_managerImplementation";
        readonly type: "address";
    }];
    readonly name: "unapproveManager";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
//# sourceMappingURL=TreasuryManagerFactory.d.ts.map
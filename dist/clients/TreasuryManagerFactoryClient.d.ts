import { type ReadContract, type Address, type Drift, type ReadWriteContract } from "@delvtech/drift";
import { TreasuryManagerFactoryAbi } from "../abi/TreasuryManagerFactory";
export type TreasuryManagerFactoryABI = typeof TreasuryManagerFactoryAbi;
export declare class ReadTreasuryManagerFactory {
    readonly contract: ReadContract<TreasuryManagerFactoryABI>;
    constructor(address: Address, drift?: Drift);
}
export declare class ReadWriteTreasuryManagerFactory extends ReadTreasuryManagerFactory {
    chainId: number;
    contract: ReadWriteContract<TreasuryManagerFactoryABI>;
    constructor(chainId: number, address: Address, drift?: Drift);
    /**
     * Deploys a new revenue manager
     * @param params - Parameters for deploying the revenue manager
     * @param params.protocolRecipient - The address of the protocol recipient
     * @param params.protocolFeePercent - The percentage of the protocol fee
     * @returns Transaction response
     */
    deployRevenueManager(params: {
        protocolRecipient: Address;
        protocolFeePercent: number;
    }): Promise<`0x${string}`>;
}
//# sourceMappingURL=TreasuryManagerFactoryClient.d.ts.map
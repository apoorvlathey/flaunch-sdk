import { Drift, ReadWriteAdapter } from "@delvtech/drift";
import type { PublicClient, WalletClient } from "viem";
export type CreateDriftParams = {
    publicClient: PublicClient;
    walletClient?: WalletClient;
};
/**
 * Creates a read-only Drift instance with only public client
 * @param params - Parameters with only publicClient
 * @returns Drift instance for read-only operations
 * @throws Error if publicClient.chain is not configured
 */
export declare function createDrift(params: Omit<CreateDriftParams, "walletClient">): Drift;
/**
 * Creates a read-write Drift instance with both public and wallet clients
 * @param params - Parameters with both publicClient and walletClient
 * @returns Drift instance for read and write operations
 * @throws Error if publicClient.chain is not configured
 */
export declare function createDrift(params: Required<CreateDriftParams>): Drift<ReadWriteAdapter>;
//# sourceMappingURL=drift.d.ts.map
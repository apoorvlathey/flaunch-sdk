import type { PublicClient, WalletClient } from "viem";
import { ReadFlaunchSDK, ReadWriteFlaunchSDK } from "./FlaunchSDK";
export type CreateFlaunchParams = {
    publicClient: PublicClient;
    walletClient?: WalletClient;
};
/**
 * Creates a read-only Flaunch SDK instance with only public client
 * @param params - Parameters with only publicClient
 * @returns ReadFlaunchSDK for read-only operations
 * @throws Error if publicClient.chain is not configured
 */
export declare function createFlaunch(params: Omit<CreateFlaunchParams, "walletClient">): ReadFlaunchSDK;
/**
 * Creates a read-write Flaunch SDK instance with both public and wallet clients
 * @param params - Parameters with both publicClient and walletClient
 * @returns ReadWriteFlaunchSDK for read and write operations
 * @throws Error if publicClient.chain is not configured
 */
export declare function createFlaunch(params: Required<CreateFlaunchParams>): ReadWriteFlaunchSDK;
//# sourceMappingURL=factory.d.ts.map
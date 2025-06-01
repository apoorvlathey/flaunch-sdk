import { IPFSParams } from "../types";
export declare const resolveIPFS: (value: string) => string;
export interface PinataConfig {
    jwt: string;
}
interface UploadResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
    isDuplicate: boolean;
}
/**
 * Uploads a file to IPFS using Pinata
 * @param params Configuration and file data
 * @returns Upload response with CID and other details
 */
export declare const uploadFileToIPFS: (params: {
    pinataConfig: PinataConfig;
    file: File;
    name?: string;
    metadata?: Record<string, string>;
}) => Promise<UploadResponse>;
/**
 * Uploads JSON data to IPFS using Pinata
 * @param params Configuration and JSON data
 * @returns Upload response with CID and other details
 */
export declare const uploadJsonToIPFS: (params: {
    pinataConfig: PinataConfig;
    json: Record<string, any>;
    name?: string;
    metadata?: Record<string, string>;
}) => Promise<UploadResponse>;
/**
 * Uploads a base64 image to IPFS using Pinata
 * @param params Configuration and base64 image data
 * @returns Upload response with CID and other details
 */
export declare const uploadImageToIPFS: (params: {
    pinataConfig: PinataConfig;
    base64Image: string;
    name?: string;
    metadata?: Record<string, string>;
}) => Promise<UploadResponse>;
export declare const generateTokenUri: (name: string, params: IPFSParams) => Promise<string>;
export {};
//# sourceMappingURL=ipfs.d.ts.map
import { type ReadContract, type Address, type Drift, type HexString } from "@delvtech/drift";
import { PoolManagerAbi } from "../abi/PoolManager";
export type PoolManagerABI = typeof PoolManagerAbi;
export interface PositionInfoParams {
    poolId: HexString;
    owner: Address;
    tickLower: number;
    tickUpper: number;
    salt: string;
}
export declare class ReadPoolManager {
    readonly contract: ReadContract<PoolManagerABI>;
    constructor(address: Address, drift?: Drift);
    poolStateSlot({ poolId }: {
        poolId: HexString;
    }): `0x${string}`;
    poolSlot0({ poolId }: {
        poolId: HexString;
    }): Promise<{
        sqrtPriceX96: bigint;
        tick: number;
        protocolFee: number;
        lpFee: number;
    }>;
    positionInfo({ poolId, owner, tickLower, tickUpper, salt, }: PositionInfoParams): Promise<{
        liquidity: bigint;
        feeGrowthInside0LastX128: bigint;
        feeGrowthInside1LastX128: bigint;
    }>;
    getStateSlot(stateSlot: HexString): Promise<HexString>;
}
//# sourceMappingURL=PoolManagerClient.d.ts.map
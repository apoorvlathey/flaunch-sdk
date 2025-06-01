import { createDrift as createDrift$1 } from '@delvtech/drift';
import { zeroAddress, parseEther, encodeAbiParameters, maxUint256 as maxUint256$1, encodeFunctionData, maxUint160, maxUint48, parseUnits, hexToBigInt as hexToBigInt$1, pad as pad$1, keccak256 as keccak256$1, encodePacked, stringToHex as stringToHex$1, zeroHash, formatUnits as formatUnits$1, concat, toHex as toHex$1, createPublicClient, http } from 'viem';
import axios from 'axios';
import { TickMath } from '@uniswap/v3-sdk';
import { viemAdapter } from '@delvtech/drift-viem';

function defineChain(chain) {
    return {
        formatters: undefined,
        fees: undefined,
        serializers: undefined,
        ...chain,
    };
}

const version = '2.29.2';

let errorConfig = {
    getDocsUrl: ({ docsBaseUrl, docsPath = '', docsSlug, }) => docsPath
        ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}`
        : undefined,
    version: `viem@${version}`,
};
class BaseError extends Error {
    constructor(shortMessage, args = {}) {
        const details = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.details;
            if (args.cause?.message)
                return args.cause.message;
            return args.details;
        })();
        const docsPath = (() => {
            if (args.cause instanceof BaseError)
                return args.cause.docsPath || args.docsPath;
            return args.docsPath;
        })();
        const docsUrl = errorConfig.getDocsUrl?.({ ...args, docsPath });
        const message = [
            shortMessage || 'An error occurred.',
            '',
            ...(args.metaMessages ? [...args.metaMessages, ''] : []),
            ...(docsUrl ? [`Docs: ${docsUrl}`] : []),
            ...(details ? [`Details: ${details}`] : []),
            ...(errorConfig.version ? [`Version: ${errorConfig.version}`] : []),
        ].join('\n');
        super(message, args.cause ? { cause: args.cause } : undefined);
        Object.defineProperty(this, "details", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "docsPath", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "metaMessages", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "shortMessage", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "version", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "name", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'BaseError'
        });
        this.details = details;
        this.docsPath = docsPath;
        this.metaMessages = args.metaMessages;
        this.name = args.name ?? this.name;
        this.shortMessage = shortMessage;
        this.version = version;
    }
    walk(fn) {
        return walk(this, fn);
    }
}
function walk(err, fn) {
    if (fn?.(err))
        return err;
    if (err &&
        typeof err === 'object' &&
        'cause' in err &&
        err.cause !== undefined)
        return walk(err.cause, fn);
    return fn ? null : err;
}

class IntegerOutOfRangeError extends BaseError {
    constructor({ max, min, signed, size, value, }) {
        super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, { name: 'IntegerOutOfRangeError' });
    }
}
class SizeOverflowError extends BaseError {
    constructor({ givenSize, maxSize }) {
        super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, { name: 'SizeOverflowError' });
    }
}

function isHex(value, { strict = true } = {}) {
    if (!value)
        return false;
    if (typeof value !== 'string')
        return false;
    return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size(value) {
    if (isHex(value, { strict: false }))
        return Math.ceil((value.length - 2) / 2);
    return value.length;
}

function trim(hexOrBytes, { dir = 'left' } = {}) {
    let data = typeof hexOrBytes === 'string' ? hexOrBytes.replace('0x', '') : hexOrBytes;
    let sliceLength = 0;
    for (let i = 0; i < data.length - 1; i++) {
        if (data[dir === 'left' ? i : data.length - i - 1].toString() === '0')
            sliceLength++;
        else
            break;
    }
    data =
        dir === 'left'
            ? data.slice(sliceLength)
            : data.slice(0, data.length - sliceLength);
    if (typeof hexOrBytes === 'string') {
        if (data.length === 1 && dir === 'right')
            data = `${data}0`;
        return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
    }
    return data;
}

class SliceOffsetOutOfBoundsError extends BaseError {
    constructor({ offset, position, size, }) {
        super(`Slice ${position === 'start' ? 'starting' : 'ending'} at offset "${offset}" is out-of-bounds (size: ${size}).`, { name: 'SliceOffsetOutOfBoundsError' });
    }
}
class SizeExceedsPaddingSizeError extends BaseError {
    constructor({ size, targetSize, type, }) {
        super(`${type.charAt(0).toUpperCase()}${type
            .slice(1)
            .toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, { name: 'SizeExceedsPaddingSizeError' });
    }
}

function pad(hexOrBytes, { dir, size = 32 } = {}) {
    if (typeof hexOrBytes === 'string')
        return padHex(hexOrBytes, { dir, size });
    return padBytes(hexOrBytes, { dir, size });
}
function padHex(hex_, { dir, size = 32 } = {}) {
    if (size === null)
        return hex_;
    const hex = hex_.replace('0x', '');
    if (hex.length > size * 2)
        throw new SizeExceedsPaddingSizeError({
            size: Math.ceil(hex.length / 2),
            targetSize: size,
            type: 'hex',
        });
    return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes(bytes, { dir, size = 32 } = {}) {
    if (size === null)
        return bytes;
    if (bytes.length > size)
        throw new SizeExceedsPaddingSizeError({
            size: bytes.length,
            targetSize: size,
            type: 'bytes',
        });
    const paddedBytes = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
        const padEnd = dir === 'right';
        paddedBytes[padEnd ? i : size - i - 1] =
            bytes[padEnd ? i : bytes.length - i - 1];
    }
    return paddedBytes;
}

const hexes = /*#__PURE__*/ Array.from({ length: 256 }, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToHex(value, opts);
    if (typeof value === 'string') {
        return stringToHex(value, opts);
    }
    if (typeof value === 'boolean')
        return boolToHex(value, opts);
    return bytesToHex(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex(value, opts = {}) {
    const hex = `0x${Number(value)}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { size: opts.size });
    }
    return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex(value, opts = {}) {
    let string = '';
    for (let i = 0; i < value.length; i++) {
        string += hexes[value[i]];
    }
    const hex = `0x${string}`;
    if (typeof opts.size === 'number') {
        assertSize(hex, { size: opts.size });
        return pad(hex, { dir: 'right', size: opts.size });
    }
    return hex;
}
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function numberToHex(value_, opts = {}) {
    const { signed, size } = opts;
    const value = BigInt(value_);
    let maxValue;
    if (size) {
        if (signed)
            maxValue = (1n << (BigInt(size) * 8n - 1n)) - 1n;
        else
            maxValue = 2n ** (BigInt(size) * 8n) - 1n;
    }
    else if (typeof value_ === 'number') {
        maxValue = BigInt(Number.MAX_SAFE_INTEGER);
    }
    const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
    if ((maxValue && value > maxValue) || value < minValue) {
        const suffix = typeof value_ === 'bigint' ? 'n' : '';
        throw new IntegerOutOfRangeError({
            max: maxValue ? `${maxValue}${suffix}` : undefined,
            min: `${minValue}${suffix}`,
            signed,
            size,
            value: `${value_}${suffix}`,
        });
    }
    const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
    if (size)
        return pad(hex, { size });
    return hex;
}
const encoder$1 = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex(value_, opts = {}) {
    const value = encoder$1.encode(value_);
    return bytesToHex(value, opts);
}

const encoder = /*#__PURE__*/ new TextEncoder();
/**
 * Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes
 * - Example: https://viem.sh/docs/utilities/toBytes#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes('Hello world')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function toBytes$1(value, opts = {}) {
    if (typeof value === 'number' || typeof value === 'bigint')
        return numberToBytes(value, opts);
    if (typeof value === 'boolean')
        return boolToBytes(value, opts);
    if (isHex(value))
        return hexToBytes(value, opts);
    return stringToBytes(value, opts);
}
/**
 * Encodes a boolean into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
 *
 * @param value Boolean value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true)
 * // Uint8Array([1])
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true, { size: 32 })
 * // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
 */
function boolToBytes(value, opts = {}) {
    const bytes = new Uint8Array(1);
    bytes[0] = Number(value);
    if (typeof opts.size === 'number') {
        assertSize(bytes, { size: opts.size });
        return pad(bytes, { size: opts.size });
    }
    return bytes;
}
// We use very optimized technique to convert hex string to byte array
const charCodeMap = {
    zero: 48,
    nine: 57,
    A: 65,
    F: 70,
    a: 97,
    f: 102,
};
function charCodeToBase16(char) {
    if (char >= charCodeMap.zero && char <= charCodeMap.nine)
        return char - charCodeMap.zero;
    if (char >= charCodeMap.A && char <= charCodeMap.F)
        return char - (charCodeMap.A - 10);
    if (char >= charCodeMap.a && char <= charCodeMap.f)
        return char - (charCodeMap.a - 10);
    return undefined;
}
/**
 * Encodes a hex string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
 *
 * @param hex Hex string to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function hexToBytes(hex_, opts = {}) {
    let hex = hex_;
    if (opts.size) {
        assertSize(hex, { size: opts.size });
        hex = pad(hex, { dir: 'right', size: opts.size });
    }
    let hexString = hex.slice(2);
    if (hexString.length % 2)
        hexString = `0${hexString}`;
    const length = hexString.length / 2;
    const bytes = new Uint8Array(length);
    for (let index = 0, j = 0; index < length; index++) {
        const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
        const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
        if (nibbleLeft === undefined || nibbleRight === undefined) {
            throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
        }
        bytes[index] = nibbleLeft * 16 + nibbleRight;
    }
    return bytes;
}
/**
 * Encodes a number into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
 *
 * @param value Number to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function numberToBytes(value, opts) {
    const hex = numberToHex(value, opts);
    return hexToBytes(hex);
}
/**
 * Encodes a UTF-8 string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
 *
 * @param value String to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */
function stringToBytes(value, opts = {}) {
    const bytes = encoder.encode(value);
    if (typeof opts.size === 'number') {
        assertSize(bytes, { size: opts.size });
        return pad(bytes, { dir: 'right', size: opts.size });
    }
    return bytes;
}

function assertSize(hexOrBytes, { size: size$1 }) {
    if (size(hexOrBytes) > size$1)
        throw new SizeOverflowError({
            givenSize: size(hexOrBytes),
            maxSize: size$1,
        });
}
/**
 * Decodes a hex value into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x1a4', { signed: true })
 * // 420n
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420n
 */
function hexToBigInt(hex, opts = {}) {
    const { signed } = opts;
    if (opts.size)
        assertSize(hex, { size: opts.size });
    const value = BigInt(hex);
    if (!signed)
        return value;
    const size = (hex.length - 2) / 2;
    const max = (1n << (BigInt(size) * 8n - 1n)) - 1n;
    if (value <= max)
        return value;
    return value - BigInt(`0x${'f'.padStart(size * 2, 'f')}`) - 1n;
}
/**
 * Decodes a hex string into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToNumber('0x1a4')
 * // 420
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420
 */
function hexToNumber(hex, opts = {}) {
    return Number(hexToBigInt(hex, opts));
}

function defineFormatter(type, format) {
    return ({ exclude, format: overrides, }) => {
        return {
            exclude,
            format: (args) => {
                const formatted = format(args);
                if (exclude) {
                    for (const key of exclude) {
                        delete formatted[key];
                    }
                }
                return {
                    ...formatted,
                    ...overrides(args),
                };
            },
            type,
        };
    };
}

const transactionType = {
    '0x0': 'legacy',
    '0x1': 'eip2930',
    '0x2': 'eip1559',
    '0x3': 'eip4844',
    '0x4': 'eip7702',
};
function formatTransaction(transaction) {
    const transaction_ = {
        ...transaction,
        blockHash: transaction.blockHash ? transaction.blockHash : null,
        blockNumber: transaction.blockNumber
            ? BigInt(transaction.blockNumber)
            : null,
        chainId: transaction.chainId ? hexToNumber(transaction.chainId) : undefined,
        gas: transaction.gas ? BigInt(transaction.gas) : undefined,
        gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
        maxFeePerBlobGas: transaction.maxFeePerBlobGas
            ? BigInt(transaction.maxFeePerBlobGas)
            : undefined,
        maxFeePerGas: transaction.maxFeePerGas
            ? BigInt(transaction.maxFeePerGas)
            : undefined,
        maxPriorityFeePerGas: transaction.maxPriorityFeePerGas
            ? BigInt(transaction.maxPriorityFeePerGas)
            : undefined,
        nonce: transaction.nonce ? hexToNumber(transaction.nonce) : undefined,
        to: transaction.to ? transaction.to : null,
        transactionIndex: transaction.transactionIndex
            ? Number(transaction.transactionIndex)
            : null,
        type: transaction.type
            ? transactionType[transaction.type]
            : undefined,
        typeHex: transaction.type ? transaction.type : undefined,
        value: transaction.value ? BigInt(transaction.value) : undefined,
        v: transaction.v ? BigInt(transaction.v) : undefined,
    };
    if (transaction.authorizationList)
        transaction_.authorizationList = formatAuthorizationList$1(transaction.authorizationList);
    transaction_.yParity = (() => {
        // If `yParity` is provided, we will use it.
        if (transaction.yParity)
            return Number(transaction.yParity);
        // If no `yParity` provided, try derive from `v`.
        if (typeof transaction_.v === 'bigint') {
            if (transaction_.v === 0n || transaction_.v === 27n)
                return 0;
            if (transaction_.v === 1n || transaction_.v === 28n)
                return 1;
            if (transaction_.v >= 35n)
                return transaction_.v % 2n === 0n ? 1 : 0;
        }
        return undefined;
    })();
    if (transaction_.type === 'legacy') {
        delete transaction_.accessList;
        delete transaction_.maxFeePerBlobGas;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
        delete transaction_.yParity;
    }
    if (transaction_.type === 'eip2930') {
        delete transaction_.maxFeePerBlobGas;
        delete transaction_.maxFeePerGas;
        delete transaction_.maxPriorityFeePerGas;
    }
    if (transaction_.type === 'eip1559') {
        delete transaction_.maxFeePerBlobGas;
    }
    return transaction_;
}
const defineTransaction = /*#__PURE__*/ defineFormatter('transaction', formatTransaction);
//////////////////////////////////////////////////////////////////////////////
function formatAuthorizationList$1(authorizationList) {
    return authorizationList.map((authorization) => ({
        address: authorization.address,
        chainId: Number(authorization.chainId),
        nonce: Number(authorization.nonce),
        r: authorization.r,
        s: authorization.s,
        yParity: Number(authorization.yParity),
    }));
}

function formatBlock(block) {
    const transactions = (block.transactions ?? []).map((transaction) => {
        if (typeof transaction === 'string')
            return transaction;
        return formatTransaction(transaction);
    });
    return {
        ...block,
        baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
        blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : undefined,
        difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
        excessBlobGas: block.excessBlobGas
            ? BigInt(block.excessBlobGas)
            : undefined,
        gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
        gasUsed: block.gasUsed ? BigInt(block.gasUsed) : undefined,
        hash: block.hash ? block.hash : null,
        logsBloom: block.logsBloom ? block.logsBloom : null,
        nonce: block.nonce ? block.nonce : null,
        number: block.number ? BigInt(block.number) : null,
        size: block.size ? BigInt(block.size) : undefined,
        timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
        transactions,
        totalDifficulty: block.totalDifficulty
            ? BigInt(block.totalDifficulty)
            : null,
    };
}
const defineBlock = /*#__PURE__*/ defineFormatter('block', formatBlock);

function formatLog(log, { args, eventName, } = {}) {
    return {
        ...log,
        blockHash: log.blockHash ? log.blockHash : null,
        blockNumber: log.blockNumber ? BigInt(log.blockNumber) : null,
        logIndex: log.logIndex ? Number(log.logIndex) : null,
        transactionHash: log.transactionHash ? log.transactionHash : null,
        transactionIndex: log.transactionIndex
            ? Number(log.transactionIndex)
            : null,
        ...(eventName ? { args, eventName } : {}),
    };
}

const receiptStatuses = {
    '0x0': 'reverted',
    '0x1': 'success',
};
function formatTransactionReceipt(transactionReceipt) {
    const receipt = {
        ...transactionReceipt,
        blockNumber: transactionReceipt.blockNumber
            ? BigInt(transactionReceipt.blockNumber)
            : null,
        contractAddress: transactionReceipt.contractAddress
            ? transactionReceipt.contractAddress
            : null,
        cumulativeGasUsed: transactionReceipt.cumulativeGasUsed
            ? BigInt(transactionReceipt.cumulativeGasUsed)
            : null,
        effectiveGasPrice: transactionReceipt.effectiveGasPrice
            ? BigInt(transactionReceipt.effectiveGasPrice)
            : null,
        gasUsed: transactionReceipt.gasUsed
            ? BigInt(transactionReceipt.gasUsed)
            : null,
        logs: transactionReceipt.logs
            ? transactionReceipt.logs.map((log) => formatLog(log))
            : null,
        to: transactionReceipt.to ? transactionReceipt.to : null,
        transactionIndex: transactionReceipt.transactionIndex
            ? hexToNumber(transactionReceipt.transactionIndex)
            : null,
        status: transactionReceipt.status
            ? receiptStatuses[transactionReceipt.status]
            : null,
        type: transactionReceipt.type
            ? transactionType[transactionReceipt.type] || transactionReceipt.type
            : null,
    };
    if (transactionReceipt.blobGasPrice)
        receipt.blobGasPrice = BigInt(transactionReceipt.blobGasPrice);
    if (transactionReceipt.blobGasUsed)
        receipt.blobGasUsed = BigInt(transactionReceipt.blobGasUsed);
    return receipt;
}
const defineTransactionReceipt = /*#__PURE__*/ defineFormatter('transactionReceipt', formatTransactionReceipt);

const rpcTransactionType = {
    legacy: '0x0',
    eip2930: '0x1',
    eip1559: '0x2',
    eip4844: '0x3',
    eip7702: '0x4',
};
function formatTransactionRequest(request) {
    const rpcRequest = {};
    if (typeof request.authorizationList !== 'undefined')
        rpcRequest.authorizationList = formatAuthorizationList(request.authorizationList);
    if (typeof request.accessList !== 'undefined')
        rpcRequest.accessList = request.accessList;
    if (typeof request.blobVersionedHashes !== 'undefined')
        rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
    if (typeof request.blobs !== 'undefined') {
        if (typeof request.blobs[0] !== 'string')
            rpcRequest.blobs = request.blobs.map((x) => bytesToHex(x));
        else
            rpcRequest.blobs = request.blobs;
    }
    if (typeof request.data !== 'undefined')
        rpcRequest.data = request.data;
    if (typeof request.from !== 'undefined')
        rpcRequest.from = request.from;
    if (typeof request.gas !== 'undefined')
        rpcRequest.gas = numberToHex(request.gas);
    if (typeof request.gasPrice !== 'undefined')
        rpcRequest.gasPrice = numberToHex(request.gasPrice);
    if (typeof request.maxFeePerBlobGas !== 'undefined')
        rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
    if (typeof request.maxFeePerGas !== 'undefined')
        rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
    if (typeof request.maxPriorityFeePerGas !== 'undefined')
        rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
    if (typeof request.nonce !== 'undefined')
        rpcRequest.nonce = numberToHex(request.nonce);
    if (typeof request.to !== 'undefined')
        rpcRequest.to = request.to;
    if (typeof request.type !== 'undefined')
        rpcRequest.type = rpcTransactionType[request.type];
    if (typeof request.value !== 'undefined')
        rpcRequest.value = numberToHex(request.value);
    return rpcRequest;
}
const defineTransactionRequest = /*#__PURE__*/ defineFormatter('transactionRequest', formatTransactionRequest);
//////////////////////////////////////////////////////////////////////////////
function formatAuthorizationList(authorizationList) {
    return authorizationList.map((authorization) => ({
        address: authorization.address,
        r: authorization.r
            ? numberToHex(BigInt(authorization.r))
            : authorization.r,
        s: authorization.s
            ? numberToHex(BigInt(authorization.s))
            : authorization.s,
        chainId: numberToHex(authorization.chainId),
        nonce: numberToHex(authorization.nonce),
        ...(typeof authorization.yParity !== 'undefined'
            ? { yParity: numberToHex(authorization.yParity) }
            : {}),
        ...(typeof authorization.v !== 'undefined' &&
            typeof authorization.yParity === 'undefined'
            ? { v: numberToHex(authorization.v) }
            : {}),
    }));
}

const maxUint256 = 2n ** 256n - 1n;

function concatHex(values) {
    return `0x${values.reduce((acc, x) => acc + x.replace('0x', ''), '')}`;
}

class NegativeOffsetError extends BaseError {
    constructor({ offset }) {
        super(`Offset \`${offset}\` cannot be negative.`, {
            name: 'NegativeOffsetError',
        });
    }
}
class PositionOutOfBoundsError extends BaseError {
    constructor({ length, position }) {
        super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, { name: 'PositionOutOfBoundsError' });
    }
}
class RecursiveReadLimitExceededError extends BaseError {
    constructor({ count, limit }) {
        super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, { name: 'RecursiveReadLimitExceededError' });
    }
}

const staticCursor = {
    bytes: new Uint8Array(),
    dataView: new DataView(new ArrayBuffer(0)),
    position: 0,
    positionReadCount: new Map(),
    recursiveReadCount: 0,
    recursiveReadLimit: Number.POSITIVE_INFINITY,
    assertReadLimit() {
        if (this.recursiveReadCount >= this.recursiveReadLimit)
            throw new RecursiveReadLimitExceededError({
                count: this.recursiveReadCount + 1,
                limit: this.recursiveReadLimit,
            });
    },
    assertPosition(position) {
        if (position < 0 || position > this.bytes.length - 1)
            throw new PositionOutOfBoundsError({
                length: this.bytes.length,
                position,
            });
    },
    decrementPosition(offset) {
        if (offset < 0)
            throw new NegativeOffsetError({ offset });
        const position = this.position - offset;
        this.assertPosition(position);
        this.position = position;
    },
    getReadCount(position) {
        return this.positionReadCount.get(position || this.position) || 0;
    },
    incrementPosition(offset) {
        if (offset < 0)
            throw new NegativeOffsetError({ offset });
        const position = this.position + offset;
        this.assertPosition(position);
        this.position = position;
    },
    inspectByte(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
    },
    inspectBytes(length, position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + length - 1);
        return this.bytes.subarray(position, position + length);
    },
    inspectUint8(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position);
        return this.bytes[position];
    },
    inspectUint16(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 1);
        return this.dataView.getUint16(position);
    },
    inspectUint24(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 2);
        return ((this.dataView.getUint16(position) << 8) +
            this.dataView.getUint8(position + 2));
    },
    inspectUint32(position_) {
        const position = position_ ?? this.position;
        this.assertPosition(position + 3);
        return this.dataView.getUint32(position);
    },
    pushByte(byte) {
        this.assertPosition(this.position);
        this.bytes[this.position] = byte;
        this.position++;
    },
    pushBytes(bytes) {
        this.assertPosition(this.position + bytes.length - 1);
        this.bytes.set(bytes, this.position);
        this.position += bytes.length;
    },
    pushUint8(value) {
        this.assertPosition(this.position);
        this.bytes[this.position] = value;
        this.position++;
    },
    pushUint16(value) {
        this.assertPosition(this.position + 1);
        this.dataView.setUint16(this.position, value);
        this.position += 2;
    },
    pushUint24(value) {
        this.assertPosition(this.position + 2);
        this.dataView.setUint16(this.position, value >> 8);
        this.dataView.setUint8(this.position + 2, value & ~4294967040);
        this.position += 3;
    },
    pushUint32(value) {
        this.assertPosition(this.position + 3);
        this.dataView.setUint32(this.position, value);
        this.position += 4;
    },
    readByte() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectByte();
        this.position++;
        return value;
    },
    readBytes(length, size) {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectBytes(length);
        this.position += size ?? length;
        return value;
    },
    readUint8() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint8();
        this.position += 1;
        return value;
    },
    readUint16() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint16();
        this.position += 2;
        return value;
    },
    readUint24() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint24();
        this.position += 3;
        return value;
    },
    readUint32() {
        this.assertReadLimit();
        this._touch();
        const value = this.inspectUint32();
        this.position += 4;
        return value;
    },
    get remaining() {
        return this.bytes.length - this.position;
    },
    setPosition(position) {
        const oldPosition = this.position;
        this.assertPosition(position);
        this.position = position;
        return () => (this.position = oldPosition);
    },
    _touch() {
        if (this.recursiveReadLimit === Number.POSITIVE_INFINITY)
            return;
        const count = this.getReadCount();
        this.positionReadCount.set(this.position, count + 1);
        if (count > 0)
            this.recursiveReadCount++;
    },
};
function createCursor(bytes, { recursiveReadLimit = 8_192 } = {}) {
    const cursor = Object.create(staticCursor);
    cursor.bytes = bytes;
    cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    cursor.positionReadCount = new Map();
    cursor.recursiveReadLimit = recursiveReadLimit;
    return cursor;
}

function toRlp(bytes, to = 'hex') {
    const encodable = getEncodable(bytes);
    const cursor = createCursor(new Uint8Array(encodable.length));
    encodable.encode(cursor);
    if (to === 'hex')
        return bytesToHex(cursor.bytes);
    return cursor.bytes;
}
function getEncodable(bytes) {
    if (Array.isArray(bytes))
        return getEncodableList(bytes.map((x) => getEncodable(x)));
    return getEncodableBytes(bytes);
}
function getEncodableList(list) {
    const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
    const sizeOfBodyLength = getSizeOfLength(bodyLength);
    const length = (() => {
        if (bodyLength <= 55)
            return 1 + bodyLength;
        return 1 + sizeOfBodyLength + bodyLength;
    })();
    return {
        length,
        encode(cursor) {
            if (bodyLength <= 55) {
                cursor.pushByte(0xc0 + bodyLength);
            }
            else {
                cursor.pushByte(0xc0 + 55 + sizeOfBodyLength);
                if (sizeOfBodyLength === 1)
                    cursor.pushUint8(bodyLength);
                else if (sizeOfBodyLength === 2)
                    cursor.pushUint16(bodyLength);
                else if (sizeOfBodyLength === 3)
                    cursor.pushUint24(bodyLength);
                else
                    cursor.pushUint32(bodyLength);
            }
            for (const { encode } of list) {
                encode(cursor);
            }
        },
    };
}
function getEncodableBytes(bytesOrHex) {
    const bytes = typeof bytesOrHex === 'string' ? hexToBytes(bytesOrHex) : bytesOrHex;
    const sizeOfBytesLength = getSizeOfLength(bytes.length);
    const length = (() => {
        if (bytes.length === 1 && bytes[0] < 0x80)
            return 1;
        if (bytes.length <= 55)
            return 1 + bytes.length;
        return 1 + sizeOfBytesLength + bytes.length;
    })();
    return {
        length,
        encode(cursor) {
            if (bytes.length === 1 && bytes[0] < 0x80) {
                cursor.pushBytes(bytes);
            }
            else if (bytes.length <= 55) {
                cursor.pushByte(0x80 + bytes.length);
                cursor.pushBytes(bytes);
            }
            else {
                cursor.pushByte(0x80 + 55 + sizeOfBytesLength);
                if (sizeOfBytesLength === 1)
                    cursor.pushUint8(bytes.length);
                else if (sizeOfBytesLength === 2)
                    cursor.pushUint16(bytes.length);
                else if (sizeOfBytesLength === 3)
                    cursor.pushUint24(bytes.length);
                else
                    cursor.pushUint32(bytes.length);
                cursor.pushBytes(bytes);
            }
        },
    };
}
function getSizeOfLength(length) {
    if (length < 2 ** 8)
        return 1;
    if (length < 2 ** 16)
        return 2;
    if (length < 2 ** 24)
        return 3;
    if (length < 2 ** 32)
        return 4;
    throw new BaseError('Length is too large.');
}

const gweiUnits = {
    ether: -9,
    wei: 9,
};

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value, decimals) {
    let display = value.toString();
    const negative = display.startsWith('-');
    if (negative)
        display = display.slice(1);
    display = display.padStart(decimals, '0');
    let [integer, fraction] = [
        display.slice(0, display.length - decimals),
        display.slice(display.length - decimals),
    ];
    fraction = fraction.replace(/(0+)$/, '');
    return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Converts numerical wei to a string representation of gwei.
 *
 * - Docs: https://viem.sh/docs/utilities/formatGwei
 *
 * @example
 * import { formatGwei } from 'viem'
 *
 * formatGwei(1000000000n)
 * // '1'
 */
function formatGwei(wei, unit = 'wei') {
    return formatUnits(wei, gweiUnits[unit]);
}

function prettyPrint(args) {
    const entries = Object.entries(args)
        .map(([key, value]) => {
        if (value === undefined || value === false)
            return null;
        return [key, value];
    })
        .filter(Boolean);
    const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
    return entries
        .map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`)
        .join('\n');
}
class InvalidLegacyVError extends BaseError {
    constructor({ v }) {
        super(`Invalid \`v\` value "${v}". Expected 27 or 28.`, {
            name: 'InvalidLegacyVError',
        });
    }
}
class InvalidSerializableTransactionError extends BaseError {
    constructor({ transaction }) {
        super('Cannot infer a transaction type from provided transaction.', {
            metaMessages: [
                'Provided Transaction:',
                '{',
                prettyPrint(transaction),
                '}',
                '',
                'To infer the type, either provide:',
                '- a `type` to the Transaction, or',
                '- an EIP-1559 Transaction with `maxFeePerGas`, or',
                '- an EIP-2930 Transaction with `gasPrice` & `accessList`, or',
                '- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or',
                '- an EIP-7702 Transaction with `authorizationList`, or',
                '- a Legacy Transaction with `gasPrice`',
            ],
            name: 'InvalidSerializableTransactionError',
        });
    }
}
class InvalidStorageKeySizeError extends BaseError {
    constructor({ storageKey }) {
        super(`Size for storage key "${storageKey}" is invalid. Expected 32 bytes. Got ${Math.floor((storageKey.length - 2) / 2)} bytes.`, { name: 'InvalidStorageKeySizeError' });
    }
}

/*
 * Serializes an EIP-7702 authorization list.
 */
function serializeAuthorizationList(authorizationList) {
    if (!authorizationList || authorizationList.length === 0)
        return [];
    const serializedAuthorizationList = [];
    for (const authorization of authorizationList) {
        const { chainId, nonce, ...signature } = authorization;
        const contractAddress = authorization.address;
        serializedAuthorizationList.push([
            chainId ? toHex(chainId) : '0x',
            contractAddress,
            nonce ? toHex(nonce) : '0x',
            ...toYParitySignatureArray({}, signature),
        ]);
    }
    return serializedAuthorizationList;
}

/**
 * Compute commitments from a list of blobs.
 *
 * @example
 * ```ts
 * import { blobsToCommitments, toBlobs } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * ```
 */
function blobsToCommitments(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
    const blobs = (typeof parameters.blobs[0] === 'string'
        ? parameters.blobs.map((x) => hexToBytes(x))
        : parameters.blobs);
    const commitments = [];
    for (const blob of blobs)
        commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
    return (to === 'bytes'
        ? commitments
        : commitments.map((x) => bytesToHex(x)));
}

/**
 * Compute the proofs for a list of blobs and their commitments.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 * ```
 */
function blobsToProofs(parameters) {
    const { kzg } = parameters;
    const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
    const blobs = (typeof parameters.blobs[0] === 'string'
        ? parameters.blobs.map((x) => hexToBytes(x))
        : parameters.blobs);
    const commitments = (typeof parameters.commitments[0] === 'string'
        ? parameters.commitments.map((x) => hexToBytes(x))
        : parameters.commitments);
    const proofs = [];
    for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const commitment = commitments[i];
        proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
    }
    return (to === 'bytes'
        ? proofs
        : proofs.map((x) => bytesToHex(x)));
}

/**
 * Internal assertion helpers.
 * @module
 */
/** Asserts something is positive integer. */
function anumber(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error('positive integer expected, got ' + n);
}
/** Is number an Uint8Array? Copied from utils for perf. */
function isBytes(a) {
    return a instanceof Uint8Array || (ArrayBuffer.isView(a) && a.constructor.name === 'Uint8Array');
}
/** Asserts something is Uint8Array. */
function abytes(b, ...lengths) {
    if (!isBytes(b))
        throw new Error('Uint8Array expected');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new Error('Uint8Array expected of length ' + lengths + ', got length=' + b.length);
}
/** Asserts a hash instance has not been destroyed / finished */
function aexists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
/** Asserts output is properly-sized byte array */
function aoutput(out, instance) {
    abytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error('digestInto() expects output buffer of length at least ' + min);
    }
}

/**
 * Utilities for hex, bytes, CSPRNG.
 * @module
 */
function u32(arr) {
    return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
// Cast array to view
function createView(arr) {
    return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/** The rotate right (circular right shift) operation for uint32 */
function rotr(word, shift) {
    return (word << (32 - shift)) | (word >>> shift);
}
/** Is current platform little-endian? Most are. Big-Endian platform: IBM */
const isLE = /* @__PURE__ */ (() => new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44)();
// The byte swap operation for uint32
function byteSwap(word) {
    return (((word << 24) & 0xff000000) |
        ((word << 8) & 0xff0000) |
        ((word >>> 8) & 0xff00) |
        ((word >>> 24) & 0xff));
}
/** In place byte swap for Uint32Array */
function byteSwap32(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr[i] = byteSwap(arr[i]);
    }
}
// Built-in hex conversion https://caniuse.com/mdn-javascript_builtins_uint8array_fromhex
// @ts-ignore
typeof Uint8Array.from([]).toHex === 'function' && typeof Uint8Array.fromHex === 'function';
/**
 * Convert JS string to byte array.
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
    if (typeof str !== 'string')
        throw new Error('utf8ToBytes expected string, got ' + typeof str);
    return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    abytes(data);
    return data;
}
/** For runtime check if class implements interface */
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
/** Wraps hash function, creating an interface on top of it */
function wrapConstructor(hashCons) {
    const hashC = (msg) => hashCons().update(toBytes(msg)).digest();
    const tmp = hashCons();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashCons();
    return hashC;
}

/**
 * Internal Merkle-Damgard hash utils.
 * @module
 */
/** Polyfill for Safari 14. https://caniuse.com/mdn-javascript_builtins_dataview_setbiguint64 */
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
/** Choice: a ? b : c */
function Chi(a, b, c) {
    return (a & b) ^ (~a & c);
}
/** Majority function, true if any two inputs is true. */
function Maj(a, b, c) {
    return (a & b) ^ (a & c) ^ (b & c);
}
/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
class HashMD extends Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.buffer = new Uint8Array(blockLen);
        this.view = createView(this.buffer);
    }
    update(data) {
        aexists(this);
        const { view, buffer, blockLen } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = createView(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        aexists(this);
        aoutput(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in
        // current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = createView(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}

/**
 * SHA2-256 a.k.a. sha256. In JS, it is the fastest hash, even faster than Blake3.
 *
 * To break sha256 using birthday attack, attackers need to try 2^128 hashes.
 * BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
 *
 * Check out [FIPS 180-4](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf).
 * @module
 */
/** Round constants: first 32 bits of fractional parts of the cube roots of the first 64 primes 2..311). */
// prettier-ignore
const SHA256_K = /* @__PURE__ */ new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
/** Initial state: first 32 bits of fractional parts of the square roots of the first 8 primes 2..19. */
// prettier-ignore
const SHA256_IV = /* @__PURE__ */ new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
/**
 * Temporary buffer, not used to store anything between runs.
 * Named this way because it matches specification.
 */
const SHA256_W = /* @__PURE__ */ new Uint32Array(64);
class SHA256 extends HashMD {
    constructor(outputLen = 32) {
        super(64, outputLen, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = SHA256_IV[0] | 0;
        this.B = SHA256_IV[1] | 0;
        this.C = SHA256_IV[2] | 0;
        this.D = SHA256_IV[3] | 0;
        this.E = SHA256_IV[4] | 0;
        this.F = SHA256_IV[5] | 0;
        this.G = SHA256_IV[6] | 0;
        this.H = SHA256_IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ (W15 >>> 3);
            const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
/** SHA2-256 hash function */
const sha256$1 = /* @__PURE__ */ wrapConstructor(() => new SHA256());

function sha256(value, to_) {
    const to = to_ || 'hex';
    const bytes = sha256$1(isHex(value, { strict: false }) ? toBytes$1(value) : value);
    if (to === 'bytes')
        return bytes;
    return toHex(bytes);
}

/**
 * Transform a commitment to it's versioned hash.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentToVersionedHash,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const [commitment] = blobsToCommitments({ blobs, kzg })
 * const versionedHash = commitmentToVersionedHash({ commitment })
 * ```
 */
function commitmentToVersionedHash(parameters) {
    const { commitment, version = 1 } = parameters;
    const to = parameters.to ?? (typeof commitment === 'string' ? 'hex' : 'bytes');
    const versionedHash = sha256(commitment, 'bytes');
    versionedHash.set([version], 0);
    return (to === 'bytes' ? versionedHash : bytesToHex(versionedHash));
}

/**
 * Transform a list of commitments to their versioned hashes.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentsToVersionedHashes,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const versionedHashes = commitmentsToVersionedHashes({ commitments })
 * ```
 */
function commitmentsToVersionedHashes(parameters) {
    const { commitments, version } = parameters;
    const to = parameters.to ?? (typeof commitments[0] === 'string' ? 'hex' : 'bytes');
    const hashes = [];
    for (const commitment of commitments) {
        hashes.push(commitmentToVersionedHash({
            commitment,
            to,
            version,
        }));
    }
    return hashes;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
/** Blob limit per transaction. */
const blobsPerTransaction = 6;
/** The number of bytes in a BLS scalar field element. */
const bytesPerFieldElement = 32;
/** The number of field elements in a blob. */
const fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
const bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
const maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction -
    // terminator byte (0x80).
    1 -
    // zero byte (0x00) appended to each field element.
    1 * fieldElementsPerBlob * blobsPerTransaction;

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
const versionedHashVersionKzg = 1;

class BlobSizeTooLargeError extends BaseError {
    constructor({ maxSize, size }) {
        super('Blob size is too large.', {
            metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
            name: 'BlobSizeTooLargeError',
        });
    }
}
class EmptyBlobError extends BaseError {
    constructor() {
        super('Blob data must not be empty.', { name: 'EmptyBlobError' });
    }
}
class InvalidVersionedHashSizeError extends BaseError {
    constructor({ hash, size, }) {
        super(`Versioned hash "${hash}" size is invalid.`, {
            metaMessages: ['Expected: 32', `Received: ${size}`],
            name: 'InvalidVersionedHashSizeError',
        });
    }
}
class InvalidVersionedHashVersionError extends BaseError {
    constructor({ hash, version, }) {
        super(`Versioned hash "${hash}" version is invalid.`, {
            metaMessages: [
                `Expected: ${versionedHashVersionKzg}`,
                `Received: ${version}`,
            ],
            name: 'InvalidVersionedHashVersionError',
        });
    }
}

/**
 * Transforms arbitrary data to blobs.
 *
 * @example
 * ```ts
 * import { toBlobs, stringToHex } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * ```
 */
function toBlobs(parameters) {
    const to = parameters.to ?? (typeof parameters.data === 'string' ? 'hex' : 'bytes');
    const data = (typeof parameters.data === 'string'
        ? hexToBytes(parameters.data)
        : parameters.data);
    const size_ = size(data);
    if (!size_)
        throw new EmptyBlobError();
    if (size_ > maxBytesPerTransaction)
        throw new BlobSizeTooLargeError({
            maxSize: maxBytesPerTransaction,
            size: size_,
        });
    const blobs = [];
    let active = true;
    let position = 0;
    while (active) {
        const blob = createCursor(new Uint8Array(bytesPerBlob));
        let size = 0;
        while (size < fieldElementsPerBlob) {
            const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
            // Push a zero byte so the field element doesn't overflow the BLS modulus.
            blob.pushByte(0x00);
            // Push the current segment of data bytes.
            blob.pushBytes(bytes);
            // If we detect that the current segment of data bytes is less than 31 bytes,
            // we can stop processing and push a terminator byte to indicate the end of the blob.
            if (bytes.length < 31) {
                blob.pushByte(0x80);
                active = false;
                break;
            }
            size++;
            position += 31;
        }
        blobs.push(blob);
    }
    return (to === 'bytes'
        ? blobs.map((x) => x.bytes)
        : blobs.map((x) => bytesToHex(x.bytes)));
}

/**
 * Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
 *
 * @example
 * ```ts
 * import { toBlobSidecars, stringToHex } from 'viem'
 *
 * const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
 * ```
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs,
 *   blobsToProofs,
 *   toBlobSidecars,
 *   stringToHex
 * } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 *
 * const sidecars = toBlobSidecars({ blobs, commitments, proofs })
 * ```
 */
function toBlobSidecars(parameters) {
    const { data, kzg, to } = parameters;
    const blobs = parameters.blobs ?? toBlobs({ data: data, to });
    const commitments = parameters.commitments ?? blobsToCommitments({ blobs, kzg: kzg, to });
    const proofs = parameters.proofs ?? blobsToProofs({ blobs, commitments, kzg: kzg, to });
    const sidecars = [];
    for (let i = 0; i < blobs.length; i++)
        sidecars.push({
            blob: blobs[i],
            commitment: commitments[i],
            proof: proofs[i],
        });
    return sidecars;
}

class InvalidAddressError extends BaseError {
    constructor({ address }) {
        super(`Address "${address}" is invalid.`, {
            metaMessages: [
                '- Address must be a hex value of 20 bytes (40 hex characters).',
                '- Address must match its checksum counterpart.',
            ],
            name: 'InvalidAddressError',
        });
    }
}

class InvalidChainIdError extends BaseError {
    constructor({ chainId }) {
        super(typeof chainId === 'number'
            ? `Chain ID "${chainId}" is invalid.`
            : 'Chain ID is invalid.', { name: 'InvalidChainIdError' });
    }
}

class FeeCapTooHighError extends BaseError {
    constructor({ cause, maxFeePerGas, } = {}) {
        super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}) cannot be higher than the maximum allowed value (2^256-1).`, {
            cause,
            name: 'FeeCapTooHighError',
        });
    }
}
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class TipAboveFeeCapError extends BaseError {
    constructor({ cause, maxPriorityFeePerGas, maxFeePerGas, } = {}) {
        super([
            `The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas
                ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei`
                : ''}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}).`,
        ].join('\n'), {
            cause,
            name: 'TipAboveFeeCapError',
        });
    }
}
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
    enumerable: true,
    configurable: true,
    writable: true,
    value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
class LruMap extends Map {
    constructor(size) {
        super();
        Object.defineProperty(this, "maxSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.maxSize = size;
    }
    get(key) {
        const value = super.get(key);
        if (super.has(key) && value !== undefined) {
            this.delete(key);
            super.set(key, value);
        }
        return value;
    }
    set(key, value) {
        super.set(key, value);
        if (this.maxSize && this.size > this.maxSize) {
            const firstKey = this.keys().next().value;
            if (firstKey)
                this.delete(firstKey);
        }
        return this;
    }
}

/**
 * Internal helpers for u64. BigUint64Array is too slow as per 2025, so we implement it using Uint32Array.
 * @todo re-check https://issues.chromium.org/issues/42212588
 * @module
 */
const U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));

/**
 * SHA3 (keccak) hash function, based on a new "Sponge function" design.
 * Different from older hashes, the internal state is bigger than output size.
 *
 * Check out [FIPS-202](https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.202.pdf),
 * [Website](https://keccak.team/keccak.html),
 * [the differences between SHA-3 and Keccak](https://crypto.stackexchange.com/questions/15727/what-are-the-key-differences-between-the-draft-sha-3-standard-and-the-keccak-sub).
 *
 * Check out `sha3-addons` module for cSHAKE, k12, and others.
 * @module
 */
// Various per round constants calculations
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
const _0n = /* @__PURE__ */ BigInt(0);
const _1n = /* @__PURE__ */ BigInt(1);
const _2n = /* @__PURE__ */ BigInt(2);
const _7n = /* @__PURE__ */ BigInt(7);
const _256n = /* @__PURE__ */ BigInt(256);
const _0x71n = /* @__PURE__ */ BigInt(0x71);
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
    // Pi
    [x, y] = [y, (2 * x + 3 * y) % 5];
    SHA3_PI.push(2 * (5 * y + x));
    // Rotational
    SHA3_ROTL.push((((round + 1) * (round + 2)) / 2) % 64);
    // Iota
    let t = _0n;
    for (let j = 0; j < 7; j++) {
        R = ((R << _1n) ^ ((R >> _7n) * _0x71n)) % _256n;
        if (R & _2n)
            t ^= _1n << ((_1n << /* @__PURE__ */ BigInt(j)) - _1n);
    }
    _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */ split(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => (s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s));
const rotlL = (h, l, s) => (s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s));
/** `keccakf1600` internal function, additionally allows to adjust round count. */
function keccakP(s, rounds = 24) {
    const B = new Uint32Array(5 * 2);
    // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
    for (let round = 24 - rounds; round < 24; round++) {
        // Theta θ
        for (let x = 0; x < 10; x++)
            B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
        for (let x = 0; x < 10; x += 2) {
            const idx1 = (x + 8) % 10;
            const idx0 = (x + 2) % 10;
            const B0 = B[idx0];
            const B1 = B[idx0 + 1];
            const Th = rotlH(B0, B1, 1) ^ B[idx1];
            const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
            for (let y = 0; y < 50; y += 10) {
                s[x + y] ^= Th;
                s[x + y + 1] ^= Tl;
            }
        }
        // Rho (ρ) and Pi (π)
        let curH = s[2];
        let curL = s[3];
        for (let t = 0; t < 24; t++) {
            const shift = SHA3_ROTL[t];
            const Th = rotlH(curH, curL, shift);
            const Tl = rotlL(curH, curL, shift);
            const PI = SHA3_PI[t];
            curH = s[PI];
            curL = s[PI + 1];
            s[PI] = Th;
            s[PI + 1] = Tl;
        }
        // Chi (χ)
        for (let y = 0; y < 50; y += 10) {
            for (let x = 0; x < 10; x++)
                B[x] = s[y + x];
            for (let x = 0; x < 10; x++)
                s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
        }
        // Iota (ι)
        s[0] ^= SHA3_IOTA_H[round];
        s[1] ^= SHA3_IOTA_L[round];
    }
    B.fill(0);
}
/** Keccak sponge function. */
class Keccak extends Hash {
    // NOTE: we accept arguments in bytes instead of bits here.
    constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
        super();
        this.pos = 0;
        this.posOut = 0;
        this.finished = false;
        this.destroyed = false;
        this.enableXOF = false;
        this.blockLen = blockLen;
        this.suffix = suffix;
        this.outputLen = outputLen;
        this.enableXOF = enableXOF;
        this.rounds = rounds;
        // Can be passed from user as dkLen
        anumber(outputLen);
        // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
        // 0 < blockLen < 200
        if (0 >= this.blockLen || this.blockLen >= 200)
            throw new Error('Sha3 supports only keccak-f1600 function');
        this.state = new Uint8Array(200);
        this.state32 = u32(this.state);
    }
    keccak() {
        if (!isLE)
            byteSwap32(this.state32);
        keccakP(this.state32, this.rounds);
        if (!isLE)
            byteSwap32(this.state32);
        this.posOut = 0;
        this.pos = 0;
    }
    update(data) {
        aexists(this);
        const { blockLen, state } = this;
        data = toBytes(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            for (let i = 0; i < take; i++)
                state[this.pos++] ^= data[pos++];
            if (this.pos === blockLen)
                this.keccak();
        }
        return this;
    }
    finish() {
        if (this.finished)
            return;
        this.finished = true;
        const { state, suffix, pos, blockLen } = this;
        // Do the padding
        state[pos] ^= suffix;
        if ((suffix & 0x80) !== 0 && pos === blockLen - 1)
            this.keccak();
        state[blockLen - 1] ^= 0x80;
        this.keccak();
    }
    writeInto(out) {
        aexists(this, false);
        abytes(out);
        this.finish();
        const bufferOut = this.state;
        const { blockLen } = this;
        for (let pos = 0, len = out.length; pos < len;) {
            if (this.posOut >= blockLen)
                this.keccak();
            const take = Math.min(blockLen - this.posOut, len - pos);
            out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
            this.posOut += take;
            pos += take;
        }
        return out;
    }
    xofInto(out) {
        // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
        if (!this.enableXOF)
            throw new Error('XOF is not possible for this instance');
        return this.writeInto(out);
    }
    xof(bytes) {
        anumber(bytes);
        return this.xofInto(new Uint8Array(bytes));
    }
    digestInto(out) {
        aoutput(out, this);
        if (this.finished)
            throw new Error('digest() was already called');
        this.writeInto(out);
        this.destroy();
        return out;
    }
    digest() {
        return this.digestInto(new Uint8Array(this.outputLen));
    }
    destroy() {
        this.destroyed = true;
        this.state.fill(0);
    }
    _cloneInto(to) {
        const { blockLen, suffix, outputLen, rounds, enableXOF } = this;
        to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
        to.state32.set(this.state32);
        to.pos = this.pos;
        to.posOut = this.posOut;
        to.finished = this.finished;
        to.rounds = rounds;
        // Suffix can change in cSHAKE
        to.suffix = suffix;
        to.outputLen = outputLen;
        to.enableXOF = enableXOF;
        to.destroyed = this.destroyed;
        return to;
    }
}
const gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
/** keccak-256 hash function. Different from SHA3-256. */
const keccak_256 = /* @__PURE__ */ gen(0x01, 136, 256 / 8);

function keccak256(value, to_) {
    const to = to_ || 'hex';
    const bytes = keccak_256(isHex(value, { strict: false }) ? toBytes$1(value) : value);
    if (to === 'bytes')
        return bytes;
    return toHex(bytes);
}

const checksumAddressCache = /*#__PURE__*/ new LruMap(8192);
function checksumAddress(address_, 
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
chainId) {
    if (checksumAddressCache.has(`${address_}.${chainId}`))
        return checksumAddressCache.get(`${address_}.${chainId}`);
    const hexAddress = chainId
        ? `${chainId}${address_.toLowerCase()}`
        : address_.substring(2).toLowerCase();
    const hash = keccak256(stringToBytes(hexAddress), 'bytes');
    const address = (chainId ? hexAddress.substring(`${chainId}0x`.length) : hexAddress).split('');
    for (let i = 0; i < 40; i += 2) {
        if (hash[i >> 1] >> 4 >= 8 && address[i]) {
            address[i] = address[i].toUpperCase();
        }
        if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
            address[i + 1] = address[i + 1].toUpperCase();
        }
    }
    const result = `0x${address.join('')}`;
    checksumAddressCache.set(`${address_}.${chainId}`, result);
    return result;
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
const isAddressCache = /*#__PURE__*/ new LruMap(8192);
function isAddress(address, options) {
    const { strict = true } = options ?? {};
    const cacheKey = `${address}.${strict}`;
    if (isAddressCache.has(cacheKey))
        return isAddressCache.get(cacheKey);
    const result = (() => {
        if (!addressRegex.test(address))
            return false;
        if (address.toLowerCase() === address)
            return true;
        if (strict)
            return checksumAddress(address) === address;
        return true;
    })();
    isAddressCache.set(cacheKey, result);
    return result;
}

/**
 * @description Returns a section of the hex or byte array given a start/end bytes offset.
 *
 * @param value The hex or byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function slice(value, start, end, { strict } = {}) {
    if (isHex(value, { strict: false }))
        return sliceHex(value, start, end, {
            strict,
        });
    return sliceBytes(value, start, end, {
        strict,
    });
}
function assertStartOffset(value, start) {
    if (typeof start === 'number' && start > 0 && start > size(value) - 1)
        throw new SliceOffsetOutOfBoundsError({
            offset: start,
            position: 'start',
            size: size(value),
        });
}
function assertEndOffset(value, start, end) {
    if (typeof start === 'number' &&
        typeof end === 'number' &&
        size(value) !== end - start) {
        throw new SliceOffsetOutOfBoundsError({
            offset: end,
            position: 'end',
            size: size(value),
        });
    }
}
/**
 * @description Returns a section of the byte array given a start/end bytes offset.
 *
 * @param value The byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceBytes(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = value_.slice(start, end);
    if (strict)
        assertEndOffset(value, start, end);
    return value;
}
/**
 * @description Returns a section of the hex value given a start/end bytes offset.
 *
 * @param value The hex value to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceHex(value_, start, end, { strict } = {}) {
    assertStartOffset(value_, start);
    const value = `0x${value_
        .replace('0x', '')
        .slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
    if (strict)
        assertEndOffset(value, start, end);
    return value;
}

function assertTransactionEIP7702(transaction) {
    const { authorizationList } = transaction;
    if (authorizationList) {
        for (const authorization of authorizationList) {
            const { chainId } = authorization;
            const address = authorization.address;
            if (!isAddress(address))
                throw new InvalidAddressError({ address });
            if (chainId < 0)
                throw new InvalidChainIdError({ chainId });
        }
    }
    assertTransactionEIP1559(transaction);
}
function assertTransactionEIP4844(transaction) {
    const { blobVersionedHashes } = transaction;
    if (blobVersionedHashes) {
        if (blobVersionedHashes.length === 0)
            throw new EmptyBlobError();
        for (const hash of blobVersionedHashes) {
            const size_ = size(hash);
            const version = hexToNumber(slice(hash, 0, 1));
            if (size_ !== 32)
                throw new InvalidVersionedHashSizeError({ hash, size: size_ });
            if (version !== versionedHashVersionKzg)
                throw new InvalidVersionedHashVersionError({
                    hash,
                    version,
                });
        }
    }
    assertTransactionEIP1559(transaction);
}
function assertTransactionEIP1559(transaction) {
    const { chainId, maxPriorityFeePerGas, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (maxFeePerGas && maxFeePerGas > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas });
    if (maxPriorityFeePerGas &&
        maxFeePerGas &&
        maxPriorityFeePerGas > maxFeePerGas)
        throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
}
function assertTransactionEIP2930(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid EIP-2930 Transaction attribute.');
    if (gasPrice && gasPrice > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}
function assertTransactionLegacy(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to } = transaction;
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (typeof chainId !== 'undefined' && chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (maxPriorityFeePerGas || maxFeePerGas)
        throw new BaseError('`maxFeePerGas`/`maxPriorityFeePerGas` is not a valid Legacy Transaction attribute.');
    if (gasPrice && gasPrice > maxUint256)
        throw new FeeCapTooHighError({ maxFeePerGas: gasPrice });
}

function getTransactionType(transaction) {
    if (transaction.type)
        return transaction.type;
    if (typeof transaction.authorizationList !== 'undefined')
        return 'eip7702';
    if (typeof transaction.blobs !== 'undefined' ||
        typeof transaction.blobVersionedHashes !== 'undefined' ||
        typeof transaction.maxFeePerBlobGas !== 'undefined' ||
        typeof transaction.sidecars !== 'undefined')
        return 'eip4844';
    if (typeof transaction.maxFeePerGas !== 'undefined' ||
        typeof transaction.maxPriorityFeePerGas !== 'undefined') {
        return 'eip1559';
    }
    if (typeof transaction.gasPrice !== 'undefined') {
        if (typeof transaction.accessList !== 'undefined')
            return 'eip2930';
        return 'legacy';
    }
    throw new InvalidSerializableTransactionError({ transaction });
}

/*
 * Serialize an  EIP-2930 access list
 * @remarks
 * Use to create a transaction serializer with support for EIP-2930 access lists
 *
 * @param accessList - Array of objects of address and arrays of Storage Keys
 * @throws InvalidAddressError, InvalidStorageKeySizeError
 * @returns Array of hex strings
 */
function serializeAccessList(accessList) {
    if (!accessList || accessList.length === 0)
        return [];
    const serializedAccessList = [];
    for (let i = 0; i < accessList.length; i++) {
        const { address, storageKeys } = accessList[i];
        for (let j = 0; j < storageKeys.length; j++) {
            if (storageKeys[j].length - 2 !== 64) {
                throw new InvalidStorageKeySizeError({ storageKey: storageKeys[j] });
            }
        }
        if (!isAddress(address, { strict: false })) {
            throw new InvalidAddressError({ address });
        }
        serializedAccessList.push([address, storageKeys]);
    }
    return serializedAccessList;
}

function serializeTransaction$2(transaction, signature) {
    const type = getTransactionType(transaction);
    if (type === 'eip1559')
        return serializeTransactionEIP1559(transaction, signature);
    if (type === 'eip2930')
        return serializeTransactionEIP2930(transaction, signature);
    if (type === 'eip4844')
        return serializeTransactionEIP4844(transaction, signature);
    if (type === 'eip7702')
        return serializeTransactionEIP7702(transaction, signature);
    return serializeTransactionLegacy(transaction, signature);
}
function serializeTransactionEIP7702(transaction, signature) {
    const { authorizationList, chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP7702(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedAuthorizationList = serializeAuthorizationList(authorizationList);
    return concatHex([
        '0x04',
        toRlp([
            toHex(chainId),
            nonce ? toHex(nonce) : '0x',
            maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
            maxFeePerGas ? toHex(maxFeePerGas) : '0x',
            gas ? toHex(gas) : '0x',
            to ?? '0x',
            value ? toHex(value) : '0x',
            data ?? '0x',
            serializedAccessList,
            serializedAuthorizationList,
            ...toYParitySignatureArray(transaction, signature),
        ]),
    ]);
}
function serializeTransactionEIP4844(transaction, signature) {
    const { chainId, gas, nonce, to, value, maxFeePerBlobGas, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP4844(transaction);
    let blobVersionedHashes = transaction.blobVersionedHashes;
    let sidecars = transaction.sidecars;
    // If `blobs` are passed, we will need to compute the KZG commitments & proofs.
    if (transaction.blobs &&
        (typeof blobVersionedHashes === 'undefined' ||
            typeof sidecars === 'undefined')) {
        const blobs = (typeof transaction.blobs[0] === 'string'
            ? transaction.blobs
            : transaction.blobs.map((x) => bytesToHex(x)));
        const kzg = transaction.kzg;
        const commitments = blobsToCommitments({
            blobs,
            kzg,
        });
        if (typeof blobVersionedHashes === 'undefined')
            blobVersionedHashes = commitmentsToVersionedHashes({
                commitments,
            });
        if (typeof sidecars === 'undefined') {
            const proofs = blobsToProofs({ blobs, commitments, kzg });
            sidecars = toBlobSidecars({ blobs, commitments, proofs });
        }
    }
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        toHex(chainId),
        nonce ? toHex(nonce) : '0x',
        maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? toHex(maxFeePerGas) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        maxFeePerBlobGas ? toHex(maxFeePerBlobGas) : '0x',
        blobVersionedHashes ?? [],
        ...toYParitySignatureArray(transaction, signature),
    ];
    const blobs = [];
    const commitments = [];
    const proofs = [];
    if (sidecars)
        for (let i = 0; i < sidecars.length; i++) {
            const { blob, commitment, proof } = sidecars[i];
            blobs.push(blob);
            commitments.push(commitment);
            proofs.push(proof);
        }
    return concatHex([
        '0x03',
        sidecars
            ? // If sidecars are enabled, envelope turns into a "wrapper":
                toRlp([serializedTransaction, blobs, commitments, proofs])
            : // If sidecars are disabled, standard envelope is used:
                toRlp(serializedTransaction),
    ]);
}
function serializeTransactionEIP1559(transaction, signature) {
    const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, data, } = transaction;
    assertTransactionEIP1559(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        toHex(chainId),
        nonce ? toHex(nonce) : '0x',
        maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? toHex(maxFeePerGas) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature),
    ];
    return concatHex([
        '0x02',
        toRlp(serializedTransaction),
    ]);
}
function serializeTransactionEIP2930(transaction, signature) {
    const { chainId, gas, data, nonce, to, value, accessList, gasPrice } = transaction;
    assertTransactionEIP2930(transaction);
    const serializedAccessList = serializeAccessList(accessList);
    const serializedTransaction = [
        toHex(chainId),
        nonce ? toHex(nonce) : '0x',
        gasPrice ? toHex(gasPrice) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
        serializedAccessList,
        ...toYParitySignatureArray(transaction, signature),
    ];
    return concatHex([
        '0x01',
        toRlp(serializedTransaction),
    ]);
}
function serializeTransactionLegacy(transaction, signature) {
    const { chainId = 0, gas, data, nonce, to, value, gasPrice } = transaction;
    assertTransactionLegacy(transaction);
    let serializedTransaction = [
        nonce ? toHex(nonce) : '0x',
        gasPrice ? toHex(gasPrice) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
    ];
    if (signature) {
        const v = (() => {
            // EIP-155 (inferred chainId)
            if (signature.v >= 35n) {
                const inferredChainId = (signature.v - 35n) / 2n;
                if (inferredChainId > 0)
                    return signature.v;
                return 27n + (signature.v === 35n ? 0n : 1n);
            }
            // EIP-155 (explicit chainId)
            if (chainId > 0)
                return BigInt(chainId * 2) + BigInt(35n + signature.v - 27n);
            // Pre-EIP-155 (no chainId)
            const v = 27n + (signature.v === 27n ? 0n : 1n);
            if (signature.v !== v)
                throw new InvalidLegacyVError({ v: signature.v });
            return v;
        })();
        const r = trim(signature.r);
        const s = trim(signature.s);
        serializedTransaction = [
            ...serializedTransaction,
            toHex(v),
            r === '0x00' ? '0x' : r,
            s === '0x00' ? '0x' : s,
        ];
    }
    else if (chainId > 0) {
        serializedTransaction = [
            ...serializedTransaction,
            toHex(chainId),
            '0x',
            '0x',
        ];
    }
    return toRlp(serializedTransaction);
}
function toYParitySignatureArray(transaction, signature_) {
    const signature = signature_ ?? transaction;
    const { v, yParity } = signature;
    if (typeof signature.r === 'undefined')
        return [];
    if (typeof signature.s === 'undefined')
        return [];
    if (typeof v === 'undefined' && typeof yParity === 'undefined')
        return [];
    const r = trim(signature.r);
    const s = trim(signature.s);
    const yParity_ = (() => {
        if (typeof yParity === 'number')
            return yParity ? toHex(1) : '0x';
        if (v === 0n)
            return '0x';
        if (v === 1n)
            return toHex(1);
        return v === 27n ? '0x' : toHex(1);
    })();
    return [yParity_, r === '0x00' ? '0x' : r, s === '0x00' ? '0x' : s];
}

/**
 * Predeploy contracts for OP Stack.
 * @see https://github.com/ethereum-optimism/optimism/blob/develop/specs/predeploys.md
 */
const contracts = {
    gasPriceOracle: { address: '0x420000000000000000000000000000000000000F' },
    l1Block: { address: '0x4200000000000000000000000000000000000015' },
    l2CrossDomainMessenger: {
        address: '0x4200000000000000000000000000000000000007',
    },
    l2Erc721Bridge: { address: '0x4200000000000000000000000000000000000014' },
    l2StandardBridge: { address: '0x4200000000000000000000000000000000000010' },
    l2ToL1MessagePasser: {
        address: '0x4200000000000000000000000000000000000016',
    },
};

const formatters$1 = {
    block: /*#__PURE__*/ defineBlock({
        format(args) {
            const transactions = args.transactions?.map((transaction) => {
                if (typeof transaction === 'string')
                    return transaction;
                const formatted = formatTransaction(transaction);
                if (formatted.typeHex === '0x7e') {
                    formatted.isSystemTx = transaction.isSystemTx;
                    formatted.mint = transaction.mint
                        ? hexToBigInt(transaction.mint)
                        : undefined;
                    formatted.sourceHash = transaction.sourceHash;
                    formatted.type = 'deposit';
                }
                return formatted;
            });
            return {
                transactions,
                stateRoot: args.stateRoot,
            };
        },
    }),
    transaction: /*#__PURE__*/ defineTransaction({
        format(args) {
            const transaction = {};
            if (args.type === '0x7e') {
                transaction.isSystemTx = args.isSystemTx;
                transaction.mint = args.mint ? hexToBigInt(args.mint) : undefined;
                transaction.sourceHash = args.sourceHash;
                transaction.type = 'deposit';
            }
            return transaction;
        },
    }),
    transactionReceipt: /*#__PURE__*/ defineTransactionReceipt({
        format(args) {
            return {
                l1GasPrice: args.l1GasPrice ? hexToBigInt(args.l1GasPrice) : null,
                l1GasUsed: args.l1GasUsed ? hexToBigInt(args.l1GasUsed) : null,
                l1Fee: args.l1Fee ? hexToBigInt(args.l1Fee) : null,
                l1FeeScalar: args.l1FeeScalar ? Number(args.l1FeeScalar) : null,
            };
        },
    }),
};

function serializeTransaction$1(transaction, signature) {
    if (isDeposit(transaction))
        return serializeTransactionDeposit(transaction);
    return serializeTransaction$2(transaction, signature);
}
const serializers$1 = {
    transaction: serializeTransaction$1,
};
function serializeTransactionDeposit(transaction) {
    assertTransactionDeposit(transaction);
    const { sourceHash, data, from, gas, isSystemTx, mint, to, value } = transaction;
    const serializedTransaction = [
        sourceHash,
        from,
        to ?? '0x',
        mint ? toHex(mint) : '0x',
        value ? toHex(value) : '0x',
        gas ? toHex(gas) : '0x',
        isSystemTx ? '0x1' : '0x',
        data ?? '0x',
    ];
    return concatHex([
        '0x7e',
        toRlp(serializedTransaction),
    ]);
}
function isDeposit(transaction) {
    if (transaction.type === 'deposit')
        return true;
    if (typeof transaction.sourceHash !== 'undefined')
        return true;
    return false;
}
function assertTransactionDeposit(transaction) {
    const { from, to } = transaction;
    if (from && !isAddress(from))
        throw new InvalidAddressError({ address: from });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
}

const chainConfig$1 = {
    contracts,
    formatters: formatters$1,
    serializers: serializers$1,
};

const sourceId$K = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 888888888,
    name: 'Ancient8',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.ancient8.gg'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ancient8 explorer',
            url: 'https://scan.ancient8.gg',
            apiUrl: 'https://scan.ancient8.gg/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$K]: {
                address: '0xB09DC08428C8b4EFB4ff9C0827386CDF34277996',
            },
        },
        portal: {
            [sourceId$K]: {
                address: '0x639F2AECE398Aa76b07e59eF6abe2cFe32bacb68',
                blockCreated: 19070571,
            },
        },
        l1StandardBridge: {
            [sourceId$K]: {
                address: '0xd5e3eDf5b68135D559D572E26bF863FBC1950033',
                blockCreated: 19070571,
            },
        },
    },
    sourceId: sourceId$K,
});

const sourceId$J = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 28122024,
    name: 'Ancient8 Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpcv2-testnet.ancient8.gg'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Ancient8 Celestia Testnet explorer',
            url: 'https://scanv2-testnet.ancient8.gg',
            apiUrl: 'https://scanv2-testnet.ancient8.gg/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$J]: {
                address: '0x942fD5017c0F60575930D8574Eaca13BEcD6e1bB',
            },
        },
        portal: {
            [sourceId$J]: {
                address: '0xfa1d9E26A6aCD7b22115D27572c1221B9803c960',
                blockCreated: 4972908,
            },
        },
        l1StandardBridge: {
            [sourceId$J]: {
                address: '0xF6Bc0146d3c74D48306e79Ae134A260E418C9335',
                blockCreated: 4972908,
            },
        },
    },
    sourceId: sourceId$J,
});

const sourceId$I = 1; // mainnet
const base = /*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 8453,
    name: 'Base',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.base.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Basescan',
            url: 'https://basescan.org',
            apiUrl: 'https://api.basescan.org/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$I]: {
                address: '0x43edB88C4B80fDD2AdFF2412A7BebF9dF42cB40e',
            },
        },
        l2OutputOracle: {
            [sourceId$I]: {
                address: '0x56315b90c40730925ec5485cf004d835058518A0',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 5022,
        },
        portal: {
            [sourceId$I]: {
                address: '0x49048044D57e1C92A77f79988d21Fa8fAF74E97e',
                blockCreated: 17482143,
            },
        },
        l1StandardBridge: {
            [sourceId$I]: {
                address: '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
                blockCreated: 17482143,
            },
        },
    },
    sourceId: sourceId$I,
});

const sourceId$H = 5; // goerli
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 84531,
    name: 'Base Goerli',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://goerli.base.org'] },
    },
    blockExplorers: {
        default: {
            name: 'Basescan',
            url: 'https://goerli.basescan.org',
            apiUrl: 'https://goerli.basescan.org/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$H]: {
                address: '0x2A35891ff30313CcFa6CE88dcf3858bb075A2298',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1376988,
        },
        portal: {
            [sourceId$H]: {
                address: '0xe93c8cD0D409341205A592f8c4Ac1A5fe5585cfA',
            },
        },
        l1StandardBridge: {
            [sourceId$H]: {
                address: '0xfA6D8Ee5BE770F84FC001D098C4bD604Fe01284a',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$H,
});

const sourceId$G = 11_155_111; // sepolia
const baseSepolia = /*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 84532,
    network: 'base-sepolia',
    name: 'Base Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.base.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Basescan',
            url: 'https://sepolia.basescan.org',
            apiUrl: 'https://api-sepolia.basescan.org/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$G]: {
                address: '0xd6E6dBf4F7EA0ac412fD8b65ED297e64BB7a06E1',
            },
        },
        l2OutputOracle: {
            [sourceId$G]: {
                address: '0x84457ca9D0163FbC4bbfe4Dfbb20ba46e48DF254',
            },
        },
        portal: {
            [sourceId$G]: {
                address: '0x49f53e41452c74589e85ca1677426ba426459e85',
                blockCreated: 4446677,
            },
        },
        l1StandardBridge: {
            [sourceId$G]: {
                address: '0xfd0Bf71F60660E2f608ed56e1659C450eB113120',
                blockCreated: 4446677,
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1059647,
        },
    },
    testnet: true,
    sourceId: sourceId$G,
});

defineChain({
    id: 53456,
    name: 'BirdLayer',
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: {
        default: {
            http: ['https://rpc.birdlayer.xyz', 'https://rpc1.birdlayer.xyz'],
            webSocket: ['wss://rpc.birdlayer.xyz/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BirdLayer Explorer',
            url: 'https://scan.birdlayer.xyz',
        },
    },
});

const sourceId$F = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 81457,
    name: 'Blast',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: { http: ['https://rpc.blast.io'] },
    },
    blockExplorers: {
        default: {
            name: 'Blastscan',
            url: 'https://blastscan.io',
            apiUrl: 'https://api.blastscan.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 212929,
        },
    },
    sourceId: sourceId$F,
});

const sourceId$E = 1; // mainnet
defineChain({
    ...chainConfig$1,
    id: 60808,
    name: 'BOB',
    nativeCurrency: {
        decimals: 18,
        name: 'ETH',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.gobob.xyz'],
            webSocket: ['wss://rpc.gobob.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BOB Explorer',
            url: 'https://explorer.gobob.xyz',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 23131,
        },
        l2OutputOracle: {
            [sourceId$E]: {
                address: '0xdDa53E23f8a32640b04D7256e651C1db98dB11C1',
                blockCreated: 4462615,
            },
        },
        portal: {
            [sourceId$E]: {
                address: '0x8AdeE124447435fE03e3CD24dF3f4cAE32E65a3E',
                blockCreated: 4462615,
            },
        },
    },
    sourceId: sourceId$E,
});

const sourceId$D = 11_155_111; // sepolia
defineChain({
    ...chainConfig$1,
    id: 808813,
    name: 'BOB Sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'ETH',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://bob-sepolia.rpc.gobob.xyz'],
            webSocket: ['wss://bob-sepolia.rpc.gobob.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'BOB Sepolia Explorer',
            url: 'https://bob-sepolia.explorer.gobob.xyz',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 35677,
        },
        l2OutputOracle: {
            [sourceId$D]: {
                address: '0x14D0069452b4AE2b250B395b8adAb771E4267d2f',
                blockCreated: 4462615,
            },
        },
        portal: {
            [sourceId$D]: {
                address: '0x867B1Aa872b9C8cB5E9F7755feDC45BB24Ad0ae4',
                blockCreated: 4462615,
            },
        },
    },
    testnet: true,
    sourceId: sourceId$D,
});

const fees = {
    /*
     * Estimates the fees per gas for a transaction.
  
     * If the transaction is to be paid in a token (feeCurrency is present) then the fees
     * are estimated in the value of the token. Otherwise falls back to the default
     * estimation by returning null.
     *
     * @param params fee estimation function parameters
     */
    estimateFeesPerGas: async (params) => {
        if (!params.request?.feeCurrency)
            return null;
        const [gasPrice, maxPriorityFeePerGas] = await Promise.all([
            estimateFeePerGasInFeeCurrency(params.client, params.request.feeCurrency),
            estimateMaxPriorityFeePerGasInFeeCurrency(params.client, params.request.feeCurrency),
        ]);
        // eth_gasPrice for cel2 returns baseFeePerGas + maxPriorityFeePerGas
        const maxFeePerGas = params.multiply(gasPrice - maxPriorityFeePerGas) + maxPriorityFeePerGas;
        return {
            maxFeePerGas,
            maxPriorityFeePerGas,
        };
    },
};
/*
 * Estimate the fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateFeePerGasInFeeCurrency(client, feeCurrency) {
    const fee = await client.request({
        method: 'eth_gasPrice',
        params: [feeCurrency],
    });
    return BigInt(fee);
}
/*
 * Estimate the max priority fee per gas in the value of the fee token

 *
 * @param client - Client to use
 * @param feeCurrency -  Address of a whitelisted fee token
 * @returns The fee per gas in wei in the value of the  fee token
 *
 */
async function estimateMaxPriorityFeePerGasInFeeCurrency(client, feeCurrency) {
    const feesPerGas = await client.request({
        method: 'eth_maxPriorityFeePerGas',
        params: [feeCurrency],
    });
    return BigInt(feesPerGas);
}

function isEmpty(value) {
    return (value === 0 ||
        value === 0n ||
        value === undefined ||
        value === null ||
        value === '0' ||
        value === '' ||
        (typeof value === 'string' &&
            (trim(value).toLowerCase() === '0x' ||
                trim(value).toLowerCase() === '0x00')));
}
function isPresent(value) {
    return !isEmpty(value);
}
/** @internal */
function isEIP1559(transaction) {
    return (typeof transaction.maxFeePerGas !== 'undefined' &&
        typeof transaction.maxPriorityFeePerGas !== 'undefined');
}
function isCIP64(transaction) {
    /*
     * Enable end user to force the tx to be considered as a CIP-64.
     *
     * The preliminary type will be determined as "eip1559" by src/utils/transaction/getTransactionType.ts
     * and so we need the logic below to check for the specific value instead of checking if just any
     * transaction type is provided. If that's anything else than "cip64" then we need to reevaluate the
     * type based on the transaction fields.
     *
     * Modify with caution and according to https://github.com/celo-org/celo-proposals/blob/master/CIPs/cip-0064.md
     */
    if (transaction.type === 'cip64') {
        return true;
    }
    return isEIP1559(transaction) && isPresent(transaction.feeCurrency);
}

const formatters = {
    block: /*#__PURE__*/ defineBlock({
        format(args) {
            const transactions = args.transactions?.map((transaction) => {
                if (typeof transaction === 'string')
                    return transaction;
                const formatted = formatTransaction(transaction);
                return {
                    ...formatted,
                    ...(transaction.gatewayFee
                        ? {
                            gatewayFee: hexToBigInt(transaction.gatewayFee),
                            gatewayFeeRecipient: transaction.gatewayFeeRecipient,
                        }
                        : {}),
                    feeCurrency: transaction.feeCurrency,
                };
            });
            return {
                transactions,
            };
        },
    }),
    transaction: /*#__PURE__*/ defineTransaction({
        format(args) {
            if (args.type === '0x7e')
                return {
                    isSystemTx: args.isSystemTx,
                    mint: args.mint ? hexToBigInt(args.mint) : undefined,
                    sourceHash: args.sourceHash,
                    type: 'deposit',
                };
            const transaction = { feeCurrency: args.feeCurrency };
            if (args.type === '0x7b')
                transaction.type = 'cip64';
            else {
                if (args.type === '0x7c')
                    transaction.type = 'cip42';
                transaction.gatewayFee = args.gatewayFee
                    ? hexToBigInt(args.gatewayFee)
                    : null;
                transaction.gatewayFeeRecipient = args.gatewayFeeRecipient;
            }
            return transaction;
        },
    }),
    transactionRequest: /*#__PURE__*/ defineTransactionRequest({
        format(args) {
            const request = {};
            if (args.feeCurrency)
                request.feeCurrency = args.feeCurrency;
            if (isCIP64(args))
                request.type = '0x7b';
            return request;
        },
    }),
};

function serializeTransaction(transaction, signature) {
    if (isCIP64(transaction))
        return serializeTransactionCIP64(transaction, signature);
    return serializeTransaction$1(transaction, signature);
}
const serializers = {
    transaction: serializeTransaction,
};
function serializeTransactionCIP64(transaction, signature) {
    assertTransactionCIP64(transaction);
    const { chainId, gas, nonce, to, value, maxFeePerGas, maxPriorityFeePerGas, accessList, feeCurrency, data, } = transaction;
    const serializedTransaction = [
        toHex(chainId),
        nonce ? toHex(nonce) : '0x',
        maxPriorityFeePerGas ? toHex(maxPriorityFeePerGas) : '0x',
        maxFeePerGas ? toHex(maxFeePerGas) : '0x',
        gas ? toHex(gas) : '0x',
        to ?? '0x',
        value ? toHex(value) : '0x',
        data ?? '0x',
        serializeAccessList(accessList),
        feeCurrency,
        ...toYParitySignatureArray(transaction, signature),
    ];
    return concatHex([
        '0x7b',
        toRlp(serializedTransaction),
    ]);
}
// maxFeePerGas must be less than maxUint256
const MAX_MAX_FEE_PER_GAS = maxUint256;
function assertTransactionCIP64(transaction) {
    const { chainId, maxPriorityFeePerGas, gasPrice, maxFeePerGas, to, feeCurrency, } = transaction;
    if (chainId <= 0)
        throw new InvalidChainIdError({ chainId });
    if (to && !isAddress(to))
        throw new InvalidAddressError({ address: to });
    if (gasPrice)
        throw new BaseError('`gasPrice` is not a valid CIP-64 Transaction attribute.');
    if (isPresent(maxFeePerGas) && maxFeePerGas > MAX_MAX_FEE_PER_GAS)
        throw new FeeCapTooHighError({ maxFeePerGas });
    if (isPresent(maxPriorityFeePerGas) &&
        isPresent(maxFeePerGas) &&
        maxPriorityFeePerGas > maxFeePerGas)
        throw new TipAboveFeeCapError({ maxFeePerGas, maxPriorityFeePerGas });
    if (isPresent(feeCurrency) && !isAddress(feeCurrency)) {
        throw new BaseError('`feeCurrency` MUST be a token address for CIP-64 transactions.');
    }
    if (isEmpty(feeCurrency)) {
        throw new BaseError('`feeCurrency` must be provided for CIP-64 transactions.');
    }
}

const chainConfig = {
    contracts,
    formatters,
    serializers,
    fees,
};

const sourceId$C = 17000; // holsky
// source https://storage.googleapis.com/cel2-rollup-files/alfajores/deployment-l1.json
/*#__PURE__*/ defineChain({
    ...chainConfig,
    id: 44_787,
    name: 'Alfajores',
    nativeCurrency: {
        decimals: 18,
        name: 'CELO',
        symbol: 'A-CELO',
    },
    rpcUrls: {
        default: {
            http: ['https://alfajores-forno.celo-testnet.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Celo Alfajores Explorer',
            url: 'https://celo-alfajores.blockscout.com',
            apiUrl: 'https://celo-alfajores.blockscout.com/api',
        },
    },
    contracts: {
        ...chainConfig.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 14569001,
        },
        portal: {
            [sourceId$C]: {
                address: '0x82527353927d8D069b3B452904c942dA149BA381',
                blockCreated: 2411324,
            },
        },
        disputeGameFactory: {
            [sourceId$C]: {
                address: '0xE28AAdcd9883746c0e5068F58f9ea06027b214cb',
                blockCreated: 2411324,
            },
        },
        l2OutputOracle: {
            [sourceId$C]: {
                address: '0x4a2635e9e4f6e45817b1D402ac4904c1d1752438',
                blockCreated: 2411324,
            },
        },
        l1StandardBridge: {
            [sourceId$C]: {
                address: '0xD1B0E0581973c9eB7f886967A606b9441A897037',
                blockCreated: 2411324,
            },
        },
    },
    testnet: true,
});

defineChain({
    id: 44,
    name: 'Crab Network',
    nativeCurrency: {
        decimals: 18,
        name: 'Crab Network Native Token',
        symbol: 'CRAB',
    },
    rpcUrls: {
        default: {
            http: ['https://crab-rpc.darwinia.network'],
            webSocket: ['wss://crab-rpc.darwinia.network'],
        },
    },
    blockExplorers: {
        default: { name: 'Blockscout', url: 'https://crab-scan.darwinia.network' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 3032593,
        },
    },
});

defineChain({
    id: 66665,
    name: 'Creator',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.creatorchain.io'],
        },
    },
    blockExplorers: {
        default: { name: 'Explorer', url: 'https://explorer.creatorchain.io' },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        },
    },
    testnet: true,
});

/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 2716446429837000,
    name: 'Dchain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://dchain-2716446429837000-1.jsonrpc.sagarpc.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Dchain Explorer',
            url: 'https://dchain-2716446429837000-1.sagaexplorer.io',
            apiUrl: 'https://api-dchain-2716446429837000-1.sagaexplorer.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
    },
});

/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 2713017997578000,
    name: 'Dchain Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: [
                'https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io',
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Dchain Explorer',
            url: 'https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io',
            apiUrl: 'https://api-dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
    },
});

defineChain({
    id: 53457,
    name: 'DODOchain Testnet',
    nativeCurrency: { decimals: 18, name: 'DODO', symbol: 'DODO' },
    rpcUrls: {
        default: {
            http: ['https://dodochain-testnet.alt.technology'],
            webSocket: ['wss://dodochain-testnet.alt.technology/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'DODOchain Testnet (Sepolia) Explorer',
            url: 'https://testnet-scan.dodochain.com',
        },
    },
    testnet: true,
});

const sourceId$B = 1; // mainnet
/*#__PURE__*/ defineChain({
    id: 478,
    name: 'Form Network',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.form.network/http'],
            webSocket: ['wss://rpc.form.network/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Form Explorer',
            url: 'https://explorer.form.network',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        addressManager: {
            [sourceId$B]: {
                address: '0x15c249E46A2F924C2dB3A1560CF86729bAD1f07B',
            },
        },
        l1CrossDomainMessenger: {
            [sourceId$B]: {
                address: '0xF333158DCCad1dF6C3F0a3aEe8BC31fA94d9eD5c',
            },
        },
        l2OutputOracle: {
            [sourceId$B]: {
                address: '0x4ccAAF69F41c5810cA875183648B577CaCf1F67E',
            },
        },
        portal: {
            [sourceId$B]: {
                address: '0x4E259Ee5F4136408908160dD32295A5031Fa426F',
            },
        },
        l1StandardBridge: {
            [sourceId$B]: {
                address: '0xdc20aA63D3DE59574E065957190D8f24e0F7B8Ba',
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        },
    },
    sourceId: sourceId$B,
});

const sourceId$A = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    id: 132_902,
    name: 'Form Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Ethereum',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia-rpc.form.network/http'],
            webSocket: ['wss://sepolia-rpc.form.network/ws'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Form Testnet Explorer',
            url: 'https://sepolia-explorer.form.network',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        addressManager: {
            [sourceId$A]: {
                address: '0xd5C38fa934f7fd7477D4800F4f38a1c5BFdF1373',
            },
        },
        l1CrossDomainMessenger: {
            [sourceId$A]: {
                address: '0x37A68565c4BE9700b3E3Ec60cC4416cAC3052FAa',
            },
        },
        l2OutputOracle: {
            [sourceId$A]: {
                address: '0x9eA2239E65a59EC9C7F1ED4C116dD58Da71Fc1e2',
            },
        },
        portal: {
            [sourceId$A]: {
                address: '0x60377e3cE15dF4CCA24c4beF076b60314240b032',
            },
        },
        l1StandardBridge: {
            [sourceId$A]: {
                address: '0xD4531f633942b2725896F47cD2aFd260b44Ab1F7',
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        },
    },
    testnet: true,
    sourceId: sourceId$A,
});

const sourceId$z = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 252,
    name: 'Fraxtal',
    nativeCurrency: { name: 'Frax', symbol: 'FRAX', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.frax.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'fraxscan',
            url: 'https://fraxscan.com',
            apiUrl: 'https://api.fraxscan.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$z]: {
                address: '0x66CC916Ed5C6C2FA97014f7D1cD141528Ae171e4',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$z]: {
                address: '0x36cb65c1967A0Fb0EEE11569C51C2f2aA1Ca6f6D',
                blockCreated: 19135323,
            },
        },
        l1StandardBridge: {
            [sourceId$z]: {
                address: '0x34C0bD5877A5Ee7099D0f5688D65F4bB9158BDE2',
                blockCreated: 19135323,
            },
        },
    },
    sourceId: sourceId$z,
});

const sourceId$y = 17000; // holesky
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 2522,
    name: 'Fraxtal Testnet',
    nativeCurrency: { name: 'Frax', symbol: 'FRAX', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.testnet.frax.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'fraxscan testnet',
            url: 'https://holesky.fraxscan.com',
            apiUrl: 'https://api-holesky.fraxscan.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$y]: {
                address: '0x715EA64DA13F4d0831ece4Ad3E8c1aa013167F32',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$y]: {
                address: '0xB9c64BfA498d5b9a8398Ed6f46eb76d90dE5505d',
                blockCreated: 318416,
            },
        },
        l1StandardBridge: {
            [sourceId$y]: {
                address: '0x0BaafC217162f64930909aD9f2B27125121d6332',
                blockCreated: 318416,
            },
        },
    },
    sourceId: sourceId$y,
});

const sourceId$x = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 33979,
    name: 'Funki',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc-mainnet.funkichain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Funki Mainnet Explorer',
            url: 'https://funkiscan.io',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
    },
    sourceId: sourceId$x,
});

const sourceId$w = 11_155_111; // sepolia
defineChain({
    ...chainConfig$1,
    id: 3397901,
    network: 'funkiSepolia',
    name: 'Funki Sepolia Sandbox',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://funki-testnet.alt.technology'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Funki Sepolia Sandbox Explorer',
            url: 'https://sepolia-sandbox.funkichain.com/',
        },
    },
    testnet: true,
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1620204,
        },
    },
    sourceId: sourceId$w,
});

const sourceId$v = 17000; // Holesky testnet
defineChain({
    ...chainConfig$1,
    name: 'Garnet Testnet',
    testnet: true,
    id: 17069,
    sourceId: sourceId$v,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.garnetchain.com'],
            webSocket: ['wss://rpc.garnetchain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://explorer.garnetchain.com',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$v]: {
                address: '0x57ee40586fbE286AfC75E67cb69511A6D9aF5909',
                blockCreated: 1274684,
            },
        },
        l2OutputOracle: {
            [sourceId$v]: {
                address: '0xCb8E7AC561b8EF04F2a15865e9fbc0766FEF569B',
                blockCreated: 1274684,
            },
        },
        l1StandardBridge: {
            [sourceId$v]: {
                address: '0x09bcDd311FE398F80a78BE37E489f5D440DB95DE',
                blockCreated: 1274684,
            },
        },
    },
});

const sourceId$u = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 57073,
    name: 'Ink',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: [
                'https://rpc-gel.inkonchain.com',
                'https://rpc-qnd.inkonchain.com',
            ],
            webSocket: [
                'wss://rpc-gel.inkonchain.com',
                'wss://rpc-qnd.inkonchain.com',
            ],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://explorer.inkonchain.com',
            apiUrl: 'https://explorer.inkonchain.com/api/v2',
        },
    },
    contracts: {
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 0,
        },
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$u]: {
                address: '0x10d7b35078d3baabb96dd45a9143b94be65b12cd',
            },
        },
        portal: {
            [sourceId$u]: {
                address: '0x5d66c1782664115999c47c9fa5cd031f495d3e4f',
            },
        },
        l1StandardBridge: {
            [sourceId$u]: {
                address: '0x88ff1e5b602916615391f55854588efcbb7663f0',
            },
        },
    },
    testnet: false,
    sourceId: sourceId$u,
});

const sourceId$t = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 763373,
    name: 'Ink Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc-gel-sepolia.inkonchain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://explorer-sepolia.inkonchain.com/',
            apiUrl: 'https://explorer-sepolia.inkonchain.com/api/v2',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 0,
        },
        disputeGameFactory: {
            [sourceId$t]: {
                address: '0x860e626c700af381133d9f4af31412a2d1db3d5d',
            },
        },
        portal: {
            [sourceId$t]: {
                address: '0x5c1d29c6c9c8b0800692acc95d700bcb4966a1d7',
            },
        },
        l1StandardBridge: {
            [sourceId$t]: {
                address: '0x33f60714bbd74d62b66d79213c348614de51901c',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$t,
});

defineChain({
    id: 701,
    name: 'Koi Network',
    nativeCurrency: {
        decimals: 18,
        name: 'Koi Network Native Token',
        symbol: 'KRING',
    },
    rpcUrls: {
        default: {
            http: ['https://koi-rpc.darwinia.network'],
            webSocket: ['wss://koi-rpc.darwinia.network'],
        },
    },
    blockExplorers: {
        default: { name: 'Blockscout', url: 'https://koi-scan.darwinia.network' },
    },
    contracts: {
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 180001,
        },
    },
    testnet: true,
});

const sourceId$s = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1135,
    name: 'Lisk',
    network: 'lisk',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.api.lisk.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://blockscout.lisk.com',
            apiUrl: 'https://blockscout.lisk.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xA9d71E1dd7ca26F26e656E66d6AA81ed7f745bf0',
        },
        l2OutputOracle: {
            [sourceId$s]: {
                address: '0x113cB99283AF242Da0A0C54347667edF531Aa7d6',
            },
        },
        portal: {
            [sourceId$s]: {
                address: '0x26dB93F8b8b4f7016240af62F7730979d353f9A7',
            },
        },
        l1StandardBridge: {
            [sourceId$s]: {
                address: '0x2658723Bf70c7667De6B25F99fcce13A16D25d08',
            },
        },
    },
    sourceId: sourceId$s,
});

const sourceId$r = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 4202,
    network: 'lisk-sepolia',
    name: 'Lisk Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.sepolia-api.lisk.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://sepolia-blockscout.lisk.com',
            apiUrl: 'https://sepolia-blockscout.lisk.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$r]: {
                address: '0xA0E35F56C318DE1bD5D9ca6A94Fe7e37C5663348',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$r]: {
                address: '0xe3d90F21490686Ec7eF37BE788E02dfC12787264',
            },
        },
        l1StandardBridge: {
            [sourceId$r]: {
                address: '0x1Fb30e446eA791cd1f011675E5F3f5311b70faF5',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$r,
});

const sourceId$q = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1750,
    name: 'Metal L2',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.metall2.com'],
            webSocket: ['wss://rpc.metall2.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://explorer.metall2.com',
            apiUrl: 'https://explorer.metall2.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$q]: {
                address: '0x3B1F7aDa0Fcc26B13515af752Dd07fB1CAc11426',
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 0,
        },
        portal: {
            [sourceId$q]: {
                address: '0x3F37aBdE2C6b5B2ed6F8045787Df1ED1E3753956',
            },
        },
        l1StandardBridge: {
            [sourceId$q]: {
                address: '0x6d0f65D59b55B0FEC5d2d15365154DcADC140BF3',
            },
        },
    },
    sourceId: sourceId$q,
});

const sourceId$p = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 34443,
    name: 'Mode Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.mode.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Modescan',
            url: 'https://modescan.io',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 2465882,
        },
        l2OutputOracle: {
            [sourceId$p]: {
                address: '0x4317ba146D4933D889518a3e5E11Fe7a53199b04',
            },
        },
        portal: {
            [sourceId$p]: {
                address: '0x8B34b14c7c7123459Cf3076b8Cb929BE097d0C07',
            },
        },
        l1StandardBridge: {
            [sourceId$p]: {
                address: '0x735aDBbE72226BD52e818E7181953f42E3b0FF21',
            },
        },
    },
    sourceId: sourceId$p,
});

const sourceId$o = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 919,
    name: 'Mode Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.mode.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://sepolia.explorer.mode.network',
            apiUrl: 'https://sepolia.explorer.mode.network/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$o]: {
                address: '0x2634BD65ba27AB63811c74A63118ACb312701Bfa',
                blockCreated: 3778393,
            },
        },
        portal: {
            [sourceId$o]: {
                address: '0x320e1580effF37E008F1C92700d1eBa47c1B23fD',
                blockCreated: 3778395,
            },
        },
        l1StandardBridge: {
            [sourceId$o]: {
                address: '0xbC5C679879B2965296756CD959C3C739769995E2',
                blockCreated: 3778392,
            },
        },
        multicall3: {
            address: '0xBAba8373113Fb7a68f195deF18732e01aF8eDfCF',
            blockCreated: 3019007,
        },
    },
    testnet: true,
    sourceId: sourceId$o,
});

const sourceId$n = 56; // bsc mainnet
/*#__PURE__*/ defineChain({
    id: 204,
    name: 'opBNB',
    nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
    },
    rpcUrls: {
        default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
    },
    blockExplorers: {
        default: {
            name: 'opBNB (BSCScan)',
            url: 'https://opbnb.bscscan.com',
            apiUrl: 'https://api-opbnb.bscscan.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 512881,
        },
        l2OutputOracle: {
            [sourceId$n]: {
                address: '0x153CAB79f4767E2ff862C94aa49573294B13D169',
            },
        },
        portal: {
            [sourceId$n]: {
                address: '0x1876EA7702C0ad0C6A2ae6036DE7733edfBca519',
            },
        },
        l1StandardBridge: {
            [sourceId$n]: {
                address: '0xF05F0e4362859c3331Cb9395CBC201E3Fa6757Ea',
            },
        },
    },
    sourceId: sourceId$n,
});

const sourceId$m = 97; // bsc testnet
/*#__PURE__*/ defineChain({
    id: 5611,
    name: 'opBNB Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'tBNB',
        symbol: 'tBNB',
    },
    rpcUrls: {
        default: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
    },
    blockExplorers: {
        default: {
            name: 'opbnbscan',
            url: 'https://testnet.opbnbscan.com',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 3705108,
        },
        l2OutputOracle: {
            [sourceId$m]: {
                address: '0xFf2394Bb843012562f4349C6632a0EcB92fC8810',
            },
        },
        portal: {
            [sourceId$m]: {
                address: '0x4386C8ABf2009aC0c263462Da568DD9d46e52a31',
            },
        },
        l1StandardBridge: {
            [sourceId$m]: {
                address: '0x677311Fd2cCc511Bbc0f581E8d9a07B033D5E840',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$m,
});

const sourceId$l = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 10,
    name: 'OP Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.optimism.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Optimism Explorer',
            url: 'https://optimistic.etherscan.io',
            apiUrl: 'https://api-optimistic.etherscan.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$l]: {
                address: '0xe5965Ab5962eDc7477C8520243A95517CD252fA9',
            },
        },
        l2OutputOracle: {
            [sourceId$l]: {
                address: '0xdfe97868233d1aa22e815a266982f2cf17685a27',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 4286263,
        },
        portal: {
            [sourceId$l]: {
                address: '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
            },
        },
        l1StandardBridge: {
            [sourceId$l]: {
                address: '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
            },
        },
    },
    sourceId: sourceId$l,
});

const sourceId$k = 5; // goerli
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 420,
    name: 'Optimism Goerli',
    nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://goerli.optimism.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Etherscan',
            url: 'https://goerli-optimism.etherscan.io',
            apiUrl: 'https://goerli-optimism.etherscan.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$k]: {
                address: '0xE6Dfba0953616Bacab0c9A8ecb3a9BBa77FC15c0',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 49461,
        },
        portal: {
            [sourceId$k]: {
                address: '0x5b47E1A08Ea6d985D6649300584e6722Ec4B1383',
            },
        },
        l1StandardBridge: {
            [sourceId$k]: {
                address: '0x636Af16bf2f682dD3109e60102b8E1A089FedAa8',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$k,
});

const sourceId$j = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 11155420,
    name: 'OP Sepolia',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.optimism.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://optimism-sepolia.blockscout.com',
            apiUrl: 'https://optimism-sepolia.blockscout.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$j]: {
                address: '0x05F9613aDB30026FFd634f38e5C4dFd30a197Fa1',
            },
        },
        l2OutputOracle: {
            [sourceId$j]: {
                address: '0x90E9c4f8a994a250F6aEfd61CAFb4F2e895D458F',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1620204,
        },
        portal: {
            [sourceId$j]: {
                address: '0x16Fc5058F25648194471939df75CF27A2fdC48BC',
            },
        },
        l1StandardBridge: {
            [sourceId$j]: {
                address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$j,
});

const sourceId$i = 11155111; // Sepolia testnet
defineChain({
    ...chainConfig$1,
    name: 'Pyrope Testnet',
    testnet: true,
    id: 695569,
    sourceId: sourceId$i,
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.pyropechain.com'],
            webSocket: ['wss://rpc.pyropechain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://pyrope.blockscout.com',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l1StandardBridge: {
            [sourceId$i]: {
                address: '0xC24932c31D9621aE9e792576152B7ef010cFC2F8',
            },
        },
    },
});

const sourceId$h = 1; // Ethereum mainnet
defineChain({
    ...chainConfig$1,
    name: 'Redstone',
    id: 690,
    sourceId: sourceId$h,
    nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
    rpcUrls: {
        default: {
            http: ['https://rpc.redstonechain.com'],
            webSocket: ['wss://rpc.redstonechain.com'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://explorer.redstone.xyz',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$h]: {
                address: '0xC7bCb0e8839a28A1cFadd1CF716de9016CdA51ae',
                blockCreated: 19578329,
            },
        },
        l2OutputOracle: {
            [sourceId$h]: {
                address: '0xa426A052f657AEEefc298b3B5c35a470e4739d69',
                blockCreated: 19578337,
            },
        },
        l1StandardBridge: {
            [sourceId$h]: {
                address: '0xc473ca7E02af24c129c2eEf51F2aDf0411c1Df69',
                blockCreated: 19578331,
            },
        },
    },
});

const sourceId$g = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 12_553,
    name: 'RSS3 VSL Mainnet',
    nativeCurrency: { name: 'RSS3', symbol: 'RSS3', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.rss3.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'RSS3 VSL Mainnet Scan',
            url: 'https://scan.rss3.io',
            apiUrl: 'https://scan.rss3.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$g]: {
                address: '0xE6f24d2C32B3109B18ed33cF08eFb490b1e09C10',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 14193,
        },
        portal: {
            [sourceId$g]: {
                address: '0x6A12432491bbbE8d3babf75F759766774C778Db4',
                blockCreated: 19387057,
            },
        },
        l1StandardBridge: {
            [sourceId$g]: {
                address: '0x4cbab69108Aa72151EDa5A3c164eA86845f18438',
            },
        },
    },
    sourceId: sourceId$g,
});

const sourceId$f = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 2_331,
    name: 'RSS3 VSL Sepolia Testnet',
    nativeCurrency: { name: 'RSS3', symbol: 'RSS3', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.testnet.rss3.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'RSS3 VSL Sepolia Testnet Scan',
            url: 'https://scan.testnet.rss3.io',
            apiUrl: 'https://scan.testnet.rss3.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$f]: {
                address: '0xDb5c46C3Eaa6Ed6aE8b2379785DF7dd029C0dC81',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 55697,
        },
        portal: {
            [sourceId$f]: {
                address: '0xcBD77E8E1E7F06B25baDe67142cdE82652Da7b57',
                blockCreated: 5345035,
            },
        },
        l1StandardBridge: {
            [sourceId$f]: {
                address: '0xdDD29bb63B0839FB1cE0eE439Ff027738595D07B',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$f,
});

const sourceId$e = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 360,
    name: 'Shape',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.shape.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'shapescan',
            url: 'https://shapescan.xyz',
            apiUrl: 'https://shapescan.xyz/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$e]: {
                address: '0x6Ef8c69CfE4635d866e3E02732068022c06e724D',
                blockCreated: 20369940,
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1,
        },
        portal: {
            [sourceId$e]: {
                address: '0xEB06fFa16011B5628BaB98E29776361c83741dd3',
                blockCreated: 20369933,
            },
        },
        l1StandardBridge: {
            [sourceId$e]: {
                address: '0x62Edd5f4930Ea92dCa3fB81689bDD9b9d076b57B',
                blockCreated: 20369935,
            },
        },
    },
    sourceId: sourceId$e,
});

const sourceId$d = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 11_011,
    name: 'Shape Sepolia Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://sepolia.shape.network'],
        },
    },
    blockExplorers: {
        default: {
            name: 'blockscout',
            url: 'https://explorer-sepolia.shape.network/',
            apiUrl: 'https://explorer-sepolia.shape.network/api/v2',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 1,
        },
    },
    testnet: true,
    sourceId: sourceId$d,
});

const sourceId$c = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 2192,
    network: 'snaxchain-mainnet',
    name: 'SnaxChain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.snaxchain.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Snax Explorer',
            url: 'https://explorer.snaxchain.io',
            apiUrl: 'https://explorer.snaxchain.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$c]: {
                address: '0x472562Fcf26D6b2793f8E0b0fB660ba0E5e08A46',
            },
        },
        l2OutputOracle: {
            [sourceId$c]: {
                address: '0x2172e492Fc807F5d5645D0E3543f139ECF539294',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$c]: {
                address: '0x79f446D024d74D0Bb6E699C131c703463c5D65E9',
            },
        },
        l1StandardBridge: {
            [sourceId$c]: {
                address: '0x6534Bdb6b5c060d3e6aa833433333135eFE8E0aA',
            },
        },
    },
    sourceId: sourceId$c,
});

const sourceId$b = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 13001,
    network: 'snaxchain-testnet',
    name: 'SnaxChain Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://testnet.snaxchain.io'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Snax Explorer',
            url: 'https://testnet-explorer.snaxchain.io',
            apiUrl: 'https://testnet-explorer.snaxchain.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$b]: {
                address: '0x206a75d89d45F146C54020F132FF93bEDD09f55E',
            },
        },
        l2OutputOracle: {
            [sourceId$b]: {
                address: '0x60e3A368a4cdCEf85ffB964e372726F56A46221e',
            },
        },
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
        },
        portal: {
            [sourceId$b]: {
                address: '0xb5afdd0E8dDF081Ef90e8A3e0c7b5798e66E954E',
            },
        },
        l1StandardBridge: {
            [sourceId$b]: {
                address: '0xbd37E1a59D4C00C9A46F75018dffd84061bC5f74',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$b,
});

const sourceId$a = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1868,
    name: 'Soneium Mainnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.soneium.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://soneium.blockscout.com',
            apiUrl: 'https://soneium.blockscout.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$a]: {
                address: '0x512a3d2c7a43bd9261d2b8e8c9c70d4bd4d503c0',
            },
        },
        l2OutputOracle: {
            [sourceId$a]: {
                address: '0x0000000000000000000000000000000000000000',
            },
        },
        portal: {
            [sourceId$a]: {
                address: '0x88e529a6ccd302c948689cd5156c83d4614fae92',
                blockCreated: 7061266,
            },
        },
        l1StandardBridge: {
            [sourceId$a]: {
                address: '0xeb9bf100225c214efc3e7c651ebbadcf85177607',
                blockCreated: 7061266,
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
    sourceId: sourceId$a,
});

const sourceId$9 = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1946,
    name: 'Soneium Minato Testnet',
    nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://rpc.minato.soneium.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Blockscout',
            url: 'https://soneium-minato.blockscout.com',
            apiUrl: 'https://soneium-minato.blockscout.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$9]: {
                address: '0xB3Ad2c38E6e0640d7ce6aA952AB3A60E81bf7a01',
            },
        },
        l2OutputOracle: {
            [sourceId$9]: {
                address: '0x710e5286C746eC38beeB7538d0146f60D27be343',
            },
        },
        portal: {
            [sourceId$9]: {
                address: '0x65ea1489741A5D72fFdD8e6485B216bBdcC15Af3',
                blockCreated: 6466136,
            },
        },
        l1StandardBridge: {
            [sourceId$9]: {
                address: '0x5f5a404A5edabcDD80DB05E8e54A78c9EBF000C2',
                blockCreated: 6466136,
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
    testnet: true,
    sourceId: sourceId$9,
});

const sourceId$8 = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 5330,
    name: 'Superseed',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.superseed.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Superseed Explorer',
            url: 'https://explorer.superseed.xyz',
            apiUrl: 'https://explorer.superseed.xyz/api/v2',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        disputeGameFactory: {
            [sourceId$8]: {
                address: '0x8b097CF1f9BbD9cbFD0DD561858a1FCbC8857Be0',
                blockCreated: 20737481,
            },
        },
        l2OutputOracle: {
            [sourceId$8]: {
                address: '0x693A0F8854F458D282DE3C5b69E8eE5EEE8aA949',
                blockCreated: 20737481,
            },
        },
        portal: {
            [sourceId$8]: {
                address: '0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07',
                blockCreated: 20737481,
            },
        },
        l1StandardBridge: {
            [sourceId$8]: {
                address: '0x8b0576E39F1233679109F9b40cFcC2a7E0901Ede',
                blockCreated: 20737481,
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        },
    },
    sourceId: sourceId$8,
});

const sourceId$7 = 11155111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 53302,
    name: 'Superseed Sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.superseed.xyz'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Superseed Sepolia Explorer',
            url: 'https://sepolia-explorer.superseed.xyz',
            apiUrl: 'https://sepolia-explorer.superseed.xyz/api/v2',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
        },
        portal: {
            [sourceId$7]: {
                address: '0x7A0db8C51432d2C3eb4e8f360a2EeB26FF2809fB',
                blockCreated: 5523438,
            },
        },
        l1StandardBridge: {
            [sourceId$7]: {
                address: '0x2B227A603fAAdB3De0ED050b63ADD232B5f2c28C',
                blockCreated: 5523442,
            },
        },
    },
    testnet: true,
    sourceId: sourceId$7,
});

/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1923,
    name: 'Swellchain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://swell-mainnet.alt.technology'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Swell Explorer',
            url: 'https://explorer.swellnetwork.io',
            apiUrl: 'https://explorer.swellnetwork.io/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
});

/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1924,
    name: 'Swellchain Testnet',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://swell-testnet.alt.technology'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Swellchain Testnet Explorer',
            url: 'https://swell-testnet-explorer.alt.technology',
            apiUrl: 'https://swell-testnet-explorer.alt.technology/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 1,
        },
    },
});

const sourceId$6 = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 130,
    name: 'Unichain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: {
            http: ['https://mainnet.unichain.org/'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Uniscan',
            url: 'https://uniscan.xyz',
            apiUrl: 'https://api.uniscan.xyz/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
        disputeGameFactory: {
            [sourceId$6]: {
                address: '0x2F12d621a16e2d3285929C9996f478508951dFe4',
            },
        },
        portal: {
            [sourceId$6]: {
                address: '0x0bd48f6B86a26D3a217d0Fa6FfE2B491B956A7a2',
            },
        },
        l1StandardBridge: {
            [sourceId$6]: {
                address: '0x81014F44b0a345033bB2b3B21C7a1A308B35fEeA',
            },
        },
    },
    sourceId: sourceId$6,
});

const sourceId$5 = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 1301,
    name: 'Unichain Sepolia',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.unichain.org'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Uniscan',
            url: 'https://sepolia.uniscan.xyz',
            apiUrl: 'https://api-sepolia.uniscan.xyz/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
        portal: {
            [sourceId$5]: {
                address: '0x0d83dab629f0e0F9d36c0Cbc89B69a489f0751bD',
            },
        },
        l1StandardBridge: {
            [sourceId$5]: {
                address: '0xea58fcA6849d79EAd1f26608855c2D6407d54Ce2',
            },
        },
        disputeGameFactory: {
            [sourceId$5]: {
                address: '0xeff73e5aa3B9AEC32c659Aa3E00444d20a84394b',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$5,
});

const sourceId$4 = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 480,
    name: 'World Chain',
    network: 'worldchain',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
    },
    blockExplorers: {
        default: {
            name: 'Worldscan',
            url: 'https://worldscan.org',
            apiUrl: 'https://api.worldscan.org/api',
        },
        blockscout: {
            name: 'Blockscout',
            url: 'https://worldchain-mainnet.explorer.alchemy.com',
            apiUrl: 'https://worldchain-mainnet.explorer.alchemy.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
        disputeGameFactory: {
            [sourceId$4]: {
                address: '0x069c4c579671f8c120b1327a73217D01Ea2EC5ea',
            },
        },
        l2OutputOracle: {
            [sourceId$4]: {
                address: '0x19A6d1E9034596196295CF148509796978343c5D',
            },
        },
        portal: {
            [sourceId$4]: {
                address: '0xd5ec14a83B7d95BE1E2Ac12523e2dEE12Cbeea6C',
            },
        },
        l1StandardBridge: {
            [sourceId$4]: {
                address: '0x470458C91978D2d929704489Ad730DC3E3001113',
            },
        },
    },
    testnet: false,
    sourceId: sourceId$4,
});

const sourceId$3 = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 4801,
    name: 'World Chain Sepolia',
    network: 'worldchain-sepolia',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
    rpcUrls: {
        default: { http: ['https://worldchain-sepolia.g.alchemy.com/public'] },
    },
    blockExplorers: {
        default: {
            name: 'Worldscan Sepolia',
            url: 'https://sepolia.worldscan.org',
            apiUrl: 'https://api-sepolia.worldscan.org/api',
        },
        blockscout: {
            name: 'Blockscout',
            url: 'https://worldchain-sepolia.explorer.alchemy.com',
            apiUrl: 'https://worldchain-sepolia.explorer.alchemy.com/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xca11bde05977b3631167028862be2a173976ca11',
            blockCreated: 0,
        },
        disputeGameFactory: {
            [sourceId$3]: {
                address: '0x8Ec1111f67Dad6b6A93B3F42DfBC92D81c98449A',
            },
        },
        l2OutputOracle: {
            [sourceId$3]: {
                address: '0xc8886f8BAb6Eaeb215aDB5f1c686BF699248300e',
            },
        },
        portal: {
            [sourceId$3]: {
                address: '0xFf6EBa109271fe6d4237EeeD4bAb1dD9A77dD1A4',
            },
        },
        l1StandardBridge: {
            [sourceId$3]: {
                address: '0xd7DF54b3989855eb66497301a4aAEc33Dbb3F8DE',
            },
        },
    },
    testnet: true,
    sourceId: sourceId$3,
});

const sourceId$2 = 1; // mainnet
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 7777777,
    name: 'Zora',
    nativeCurrency: {
        decimals: 18,
        name: 'Ether',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://rpc.zora.energy'],
            webSocket: ['wss://rpc.zora.energy'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://explorer.zora.energy',
            apiUrl: 'https://explorer.zora.energy/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$2]: {
                address: '0x9E6204F750cD866b299594e2aC9eA824E2e5f95c',
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 5882,
        },
        portal: {
            [sourceId$2]: {
                address: '0x1a0ad011913A150f69f6A19DF447A0CfD9551054',
            },
        },
        l1StandardBridge: {
            [sourceId$2]: {
                address: '0x3e2Ea9B92B7E48A52296fD261dc26fd995284631',
            },
        },
    },
    sourceId: sourceId$2,
});

const sourceId$1 = 11_155_111; // sepolia
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 999999999,
    name: 'Zora Sepolia',
    network: 'zora-sepolia',
    nativeCurrency: {
        decimals: 18,
        name: 'Zora Sepolia',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://sepolia.rpc.zora.energy'],
            webSocket: ['wss://sepolia.rpc.zora.energy'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Zora Sepolia Explorer',
            url: 'https://sepolia.explorer.zora.energy/',
            apiUrl: 'https://sepolia.explorer.zora.energy/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        l2OutputOracle: {
            [sourceId$1]: {
                address: '0x2615B481Bd3E5A1C0C7Ca3Da1bdc663E8615Ade9',
            },
        },
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 83160,
        },
        portal: {
            [sourceId$1]: {
                address: '0xeffE2C6cA9Ab797D418f0D91eA60807713f3536f',
            },
        },
        l1StandardBridge: {
            [sourceId$1]: {
                address: '0x5376f1D543dcbB5BD416c56C189e4cB7399fCcCB',
            },
        },
    },
    sourceId: sourceId$1,
    testnet: true,
});

const sourceId = 5; // goerli
/*#__PURE__*/ defineChain({
    ...chainConfig$1,
    id: 999,
    name: 'Zora Goerli Testnet',
    nativeCurrency: {
        decimals: 18,
        name: 'Zora Goerli',
        symbol: 'ETH',
    },
    rpcUrls: {
        default: {
            http: ['https://testnet.rpc.zora.energy'],
            webSocket: ['wss://testnet.rpc.zora.energy'],
        },
    },
    blockExplorers: {
        default: {
            name: 'Explorer',
            url: 'https://testnet.explorer.zora.energy',
            apiUrl: 'https://testnet.explorer.zora.energy/api',
        },
    },
    contracts: {
        ...chainConfig$1.contracts,
        multicall3: {
            address: '0xcA11bde05977b3631167028862bE2a173976CA11',
            blockCreated: 189123,
        },
        portal: {
            [sourceId]: {
                address: '0xDb9F51790365e7dc196e7D072728df39Be958ACe',
            },
        },
    },
    sourceId,
    testnet: true,
});

// doesn't use FeeEscrow
const FlaunchPositionManagerAddress = {
    [base.id]: "0x51Bba15255406Cfe7099a42183302640ba7dAFDC",
    [baseSepolia.id]: "0x9A7059cA00dA92843906Cb4bCa1D005cE848AFdC",
};
const FlaunchPositionManagerV1_1Address = {
    [base.id]: "0xf785bb58059fab6fb19bdda2cb9078d9e546efdc",
    [baseSepolia.id]: "0x24347e0dd16357059abfc1b321df354873552fdc",
};
const AnyPositionManagerAddress = {
    [base.id]: "0x69a96de474521f7c6c0be3ea0498e5cf2f0565dc",
    // FIXME: this is temp address
    [baseSepolia.id]: "0xB4A535B9D35851972736495CC52FBfDaCF32e5dc",
};
const FeeEscrowAddress = {
    [base.id]: "0x72e6f7948b1B1A343B477F39aAbd2E35E6D27dde",
    [baseSepolia.id]: "0x73E27908b7d35A9251a54799A8ef4C17e4ED9FF9",
};
const ReferralEscrowAddress = {
    [base.id]: "0xBD39c7Be6D98BD1a3e4Ad482baF99d738947fE55",
    // FIXME: this is temp address
    [baseSepolia.id]: "0x651c203C4fc420f1652b0445642a21a7F1eF814E",
};
const FLETHAddress = {
    [base.id]: "0x000000000D564D5be76f7f0d28fE52605afC7Cf8",
    [baseSepolia.id]: "0x79FC52701cD4BE6f9Ba9aDC94c207DE37e3314eb",
};
const FLETHHooksAddress = {
    [base.id]: "0x9E433F32bb5481a9CA7DFF5b3af74A7ed041a888",
    [baseSepolia.id]: "0x4bd2ca15286c96e4e731337de8b375da6841e888",
};
const FairLaunchAddress = {
    [base.id]: "0xCc7A4A00072ccbeEEbd999edc812C0ce498Fb63B",
    [baseSepolia.id]: "0x227Fc288aC56E169f2BfEA82e07F8635054d4136",
};
// also supports AnyPositionManager
const FairLaunchV1_1Address = {
    [base.id]: "0x4dc442403e8c758425b93c59dc737da522f32640",
    [baseSepolia.id]: "0x7922c1ead7c5825fb52ed6b14f397d064508acbe",
};
const FlaunchAddress = {
    [base.id]: "0xCc7A4A00072ccbeEEbd999edc812C0ce498Fb63B",
    [baseSepolia.id]: "0x7D375C9133721083DF7b7e5Cb0Ed8Fc78862dfe3",
};
// also supports AnyPositionManager
const FlaunchV1_1Address = {
    [base.id]: "0xb4512bf57d50fbcb64a3adf8b17a79b2a204c18c",
    [baseSepolia.id]: "0x96be8ff5e244294a34bfa507a39190dc7a839baa",
};
const AnyFlaunchAddress = {
    // FIXME: update with actual address
    [base.id]: zeroAddress,
    // FIXME: this is temp address
    [baseSepolia.id]: "0x67Ee6C83956a75f67bD3Fc8Ca4080D95a145c7C9",
};
const BidWallAddress = {
    [base.id]: "0x66681f10BA90496241A25e33380004f30Dfd8aa8",
    [baseSepolia.id]: "0xa2107050ACEf4809c88Ab744F8e667605db5ACDB",
};
// also supports AnyPositionManager
const BidWallV1_1Address = {
    [base.id]: "0x7f22353d1634223a802D1c1Ea5308Ddf5DD0ef9c",
    [baseSepolia.id]: "0x6f2fa01a05ff8b6efbfefd91a3b85aaf19265a00",
};
const AnyBidWallAddress = {
    // FIXME: update with actual address
    [base.id]: zeroAddress,
    // FIXME: this is temp address
    [baseSepolia.id]: "0xcfF222eA42E43F46A98755db237E4c9C2CA9B772",
};
const FastFlaunchZapAddress = {
    [base.id]: "0x68d967d25806fef4aa134db031cdcc55d3e20f92",
    [baseSepolia.id]: "0x821d9f6075e7971cc71c379081de9d532f5f9957",
};
const FlaunchZapAddress = {
    [base.id]: "0xfa9e8528ee95eb109bffd1a2d59cb95b300a672a",
    [baseSepolia.id]: "0xb2f5d987de90e026b61805e60b6002d367461474",
};
const RevenueManagerAddress = {
    [base.id]: "0x712fa8ddc7347b4b6b029aa21710f365cd02d898",
    [baseSepolia.id]: "0x17E02501dE3e420347e7C5fCAe3AD787C5aea690",
};
const TreasuryManagerFactoryAddress = {
    [base.id]: "0x48af8b28DDC5e5A86c4906212fc35Fa808CA8763",
    [baseSepolia.id]: "0xd2f3c6185e06925dcbe794c6574315b2202e9ccd",
};
const PoolManagerAddress = {
    [base.id]: "0x498581fF718922c3f8e6A244956aF099B2652b2b",
    [baseSepolia.id]: "0x05E73354cFDd6745C338b50BcFDfA3Aa6fA03408",
};
const UniversalRouterAddress = {
    [base.id]: "0x6fF5693b99212Da76ad316178A184AB56D299b43",
    [baseSepolia.id]: "0x492E6456D9528771018DeB9E87ef7750EF184104",
};
const QuoterAddress = {
    [base.id]: "0x0d5e0f971ed27fbff6c2837bf31316121532048d",
    [baseSepolia.id]: "0x4a6513c898fe1b2d0e78d3b0e0a4a151589b1cba",
};
const StateViewAddress = {
    [base.id]: "0xA3c0c9b65baD0b08107Aa264b0f3dB444b867A71",
    [baseSepolia.id]: "0x571291b572ed32ce6751a2Cb2486EbEe8DEfB9B4",
};
const Permit2Address = {
    [base.id]: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
    [baseSepolia.id]: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
};
const USDCETHPoolKeys = {
    [base.id]: {
        currency0: zeroAddress,
        currency1: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
        fee: 500,
        tickSpacing: 10,
        hooks: zeroAddress,
    },
    [baseSepolia.id]: {
        currency0: zeroAddress,
        currency1: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
        fee: 0,
        tickSpacing: 30,
        hooks: zeroAddress,
    },
};

const FlaunchPositionManagerAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                ],
                internalType: "struct PositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_paid", type: "uint256" },
            { internalType: "uint256", name: "_required", type: "uint256" },
        ],
        name: "InsufficientFlaunchFee",
        type: "error",
    },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
        ],
        name: "TokenNotFlaunched",
        type: "error",
    },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_payee",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFee",
                type: "uint256",
            },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "_premineAmount",
                type: "int256",
            },
        ],
        name: "PoolPremine",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchesAt",
                type: "uint256",
            },
        ],
        name: "PoolScheduled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunch",
        outputs: [
            { internalType: "contract FairLaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract IFlaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "flaunchesAt",
        outputs: [
            { internalType: "uint256", name: "_flaunchTime", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "premineInfo",
        outputs: [
            { internalType: "int256", name: "amountSpecified", type: "int256" },
            { internalType: "uint256", name: "blockNumber", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "bool", name: "_unwrap", type: "bool" },
        ],
        name: "withdrawFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

// List of public IPFS gateways to cycle through
const IPFS_GATEWAYS = [
    "https://gateway.pinata.cloud/ipfs/",
    "https://ipfs.io/ipfs/",
    "https://dweb.link/ipfs/",
];
// Counter to track the current gateway index
let currentGatewayIndex = 0;
const resolveIPFS = (value) => {
    if (value.startsWith("ipfs://")) {
        const cid = value.slice(7);
        // Get the next gateway and increment the counter
        const gateway = IPFS_GATEWAYS[currentGatewayIndex];
        // Update the counter, cycling back to 0 when we reach the end
        currentGatewayIndex = (currentGatewayIndex + 1) % IPFS_GATEWAYS.length;
        return `${gateway}${cid}`;
    }
    return value;
};
/**
 * Uploads a file to IPFS using Pinata
 * @param params Configuration and file data
 * @returns Upload response with CID and other details
 */
const uploadFileToIPFS = async (params) => {
    try {
        const formData = new FormData();
        formData.append("file", params.file);
        const pinataMetadata = {
            name: params.name || null,
            keyvalues: params.metadata || {},
        };
        formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
        const pinataOptions = {
            cidVersion: 1,
        };
        formData.append("pinataOptions", JSON.stringify(pinataOptions));
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                Authorization: `Bearer ${params.pinataConfig.jwt}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return {
            IpfsHash: response.data.IpfsHash,
            PinSize: response.data.PinSize,
            Timestamp: response.data.Timestamp,
            isDuplicate: response.data.isDuplicate || false,
        };
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to upload file to IPFS: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
};
/**
 * Uploads JSON data to IPFS using Pinata
 * @param params Configuration and JSON data
 * @returns Upload response with CID and other details
 */
const uploadJsonToIPFS = async (params) => {
    try {
        const requestBody = {
            pinataOptions: {
                cidVersion: 1,
            },
            pinataMetadata: {
                name: params.name || null,
                keyvalues: params.metadata || {},
            },
            pinataContent: params.json,
        };
        const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", requestBody, {
            headers: {
                Authorization: `Bearer ${params.pinataConfig.jwt}`,
                "Content-Type": "application/json",
            },
        });
        return {
            IpfsHash: response.data.IpfsHash,
            PinSize: response.data.PinSize,
            Timestamp: response.data.Timestamp,
            isDuplicate: response.data.isDuplicate || false,
        };
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to upload JSON to IPFS: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
};
/**
 * Uploads a base64 image to IPFS using Pinata
 * @param params Configuration and base64 image data
 * @returns Upload response with CID and other details
 */
const uploadImageToIPFS = async (params) => {
    try {
        const formData = new FormData();
        // Convert base64 to Blob and then to File
        // Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Data = params.base64Image.split(",")[1] || params.base64Image;
        const byteCharacters = atob(base64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
            const slice = byteCharacters.slice(offset, offset + 1024);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        // Detect mime type from base64 string
        let mimeType = "image/png"; // default
        if (params.base64Image.startsWith("data:")) {
            mimeType = params.base64Image.split(";")[0].split(":")[1];
        }
        const blob = new Blob(byteArrays, { type: mimeType });
        const fileName = params.name || `image.${mimeType.split("/")[1]}`;
        const file = new File([blob], fileName, { type: mimeType });
        formData.append("file", file);
        const pinataMetadata = {
            name: params.name || null,
            keyvalues: params.metadata || {},
        };
        formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
        const pinataOptions = {
            cidVersion: 1,
        };
        formData.append("pinataOptions", JSON.stringify(pinataOptions));
        const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            headers: {
                Authorization: `Bearer ${params.pinataConfig.jwt}`,
                "Content-Type": "multipart/form-data",
            },
        });
        return {
            IpfsHash: response.data.IpfsHash,
            PinSize: response.data.PinSize,
            Timestamp: response.data.Timestamp,
            isDuplicate: response.data.isDuplicate || false,
        };
    }
    catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Failed to upload image to IPFS: ${error.response?.data?.message || error.message}`);
        }
        throw error;
    }
};
const generateTokenUri = async (name, params) => {
    // 1. upload image to IPFS
    const imageRes = await uploadImageToIPFS({
        pinataConfig: params.pinataConfig,
        base64Image: params.metadata.base64Image,
    });
    // 2. upload metadata to IPFS
    const coinMetadata = {
        name,
        description: params.metadata.description,
        image: `ipfs://${imageRes.IpfsHash}`,
        external_link: params.metadata.websiteUrl || "",
        collaborators: [],
        discordUrl: params.metadata.discordUrl || "",
        twitterUrl: params.metadata.twitterUrl || "",
        telegramUrl: params.metadata.telegramUrl || "",
    };
    const metadataRes = await uploadJsonToIPFS({
        pinataConfig: params.pinataConfig,
        json: coinMetadata,
    });
    return `ipfs://${metadataRes.IpfsHash}`;
};

const UniversalRouterAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "permit2", type: "address" },
                    { internalType: "address", name: "weth9", type: "address" },
                    { internalType: "address", name: "v2Factory", type: "address" },
                    { internalType: "address", name: "v3Factory", type: "address" },
                    {
                        internalType: "bytes32",
                        name: "pairInitCodeHash",
                        type: "bytes32",
                    },
                    {
                        internalType: "bytes32",
                        name: "poolInitCodeHash",
                        type: "bytes32",
                    },
                    { internalType: "address", name: "v4PoolManager", type: "address" },
                    {
                        internalType: "address",
                        name: "v3NFTPositionManager",
                        type: "address",
                    },
                    {
                        internalType: "address",
                        name: "v4PositionManager",
                        type: "address",
                    },
                ],
                internalType: "struct RouterParameters",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "BalanceTooLow", type: "error" },
    { inputs: [], name: "ContractLocked", type: "error" },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "DeltaNotNegative",
        type: "error",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "DeltaNotPositive",
        type: "error",
    },
    { inputs: [], name: "ETHNotAccepted", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "commandIndex", type: "uint256" },
            { internalType: "bytes", name: "message", type: "bytes" },
        ],
        name: "ExecutionFailed",
        type: "error",
    },
    { inputs: [], name: "FromAddressIsNotOwner", type: "error" },
    { inputs: [], name: "InputLengthMismatch", type: "error" },
    { inputs: [], name: "InsufficientBalance", type: "error" },
    { inputs: [], name: "InsufficientETH", type: "error" },
    { inputs: [], name: "InsufficientToken", type: "error" },
    {
        inputs: [{ internalType: "bytes4", name: "action", type: "bytes4" }],
        name: "InvalidAction",
        type: "error",
    },
    { inputs: [], name: "InvalidBips", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "commandType", type: "uint256" }],
        name: "InvalidCommandType",
        type: "error",
    },
    { inputs: [], name: "InvalidEthSender", type: "error" },
    { inputs: [], name: "InvalidPath", type: "error" },
    { inputs: [], name: "InvalidReserves", type: "error" },
    { inputs: [], name: "LengthMismatch", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
        name: "NotAuthorizedForToken",
        type: "error",
    },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "OnlyMintAllowed", type: "error" },
    { inputs: [], name: "SliceOutOfBounds", type: "error" },
    { inputs: [], name: "TransactionDeadlinePassed", type: "error" },
    { inputs: [], name: "UnsafeCast", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "action", type: "uint256" }],
        name: "UnsupportedAction",
        type: "error",
    },
    { inputs: [], name: "V2InvalidPath", type: "error" },
    { inputs: [], name: "V2TooLittleReceived", type: "error" },
    { inputs: [], name: "V2TooMuchRequested", type: "error" },
    { inputs: [], name: "V3InvalidAmountOut", type: "error" },
    { inputs: [], name: "V3InvalidCaller", type: "error" },
    { inputs: [], name: "V3InvalidSwap", type: "error" },
    { inputs: [], name: "V3TooLittleReceived", type: "error" },
    { inputs: [], name: "V3TooMuchRequested", type: "error" },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "minAmountOutReceived",
                type: "uint256",
            },
            { internalType: "uint256", name: "amountReceived", type: "uint256" },
        ],
        name: "V4TooLittleReceived",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "maxAmountInRequested",
                type: "uint256",
            },
            { internalType: "uint256", name: "amountRequested", type: "uint256" },
        ],
        name: "V4TooMuchRequested",
        type: "error",
    },
    {
        inputs: [],
        name: "V3_POSITION_MANAGER",
        outputs: [
            {
                internalType: "contract INonfungiblePositionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "V4_POSITION_MANAGER",
        outputs: [
            { internalType: "contract IPositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "commands", type: "bytes" },
            { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "commands", type: "bytes" },
            { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
        ],
        name: "execute",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "msgSender",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "int256", name: "amount0Delta", type: "int256" },
            { internalType: "int256", name: "amount1Delta", type: "int256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "uniswapV3SwapCallback",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const IV4RouterAbiExactInput = [
    {
        type: "tuple",
        components: [
            { type: "address", name: "currencyIn" },
            {
                type: "tuple[]",
                name: "path",
                components: [
                    { type: "address", name: "intermediateCurrency" },
                    { type: "uint24", name: "fee" },
                    { type: "int24", name: "tickSpacing" },
                    { type: "address", name: "hooks" },
                    { type: "bytes", name: "hookData" },
                ],
            },
            { type: "uint128", name: "amountIn" },
            { type: "uint128", name: "amountOutMinimum" },
        ],
    },
];
const IV4RouterAbiExactOutput = [
    {
        type: "tuple",
        components: [
            { type: "address", name: "currencyOut" },
            {
                type: "tuple[]",
                name: "path",
                components: [
                    { type: "address", name: "intermediateCurrency" },
                    { type: "uint24", name: "fee" },
                    { type: "int24", name: "tickSpacing" },
                    { type: "address", name: "hooks" },
                    { type: "bytes", name: "hookData" },
                ],
            },
            { type: "uint128", name: "amountOut" },
            { type: "uint128", name: "amountInMaximum" },
        ],
    },
];
const V4Actions = {
    SWAP_EXACT_IN: "07",
    SWAP_EXACT_OUT: "09",
    SETTLE_ALL: "0c",
    TAKE_ALL: "0f",
};
const URCommands = {
    V4_SWAP: "10",
    SWEEP: "04",
    PERMIT2_PERMIT: "0a",
};
/**
 * @dev EXACT_OUT adds the slippage, EXACT_IN removes it
 */
const getAmountWithSlippage = (amount, slippage, swapType) => {
    if (amount == null) {
        return 0n;
    }
    const absAmount = amount < 0n ? -amount : amount;
    const slippageMultiplier = swapType === "EXACT_IN"
        ? BigInt(1e18) - parseEther(slippage)
        : BigInt(1e18) + parseEther(slippage);
    return (absAmount * slippageMultiplier) / BigInt(1e18);
};
const ETH = zeroAddress;
const ethToMemecoin = (params) => {
    const flETH = FLETHAddress[params.chainId];
    const flETHHooks = FLETHHooksAddress[params.chainId];
    const flaunchHooks = params.positionManagerAddress;
    // Determine actions based on swapType
    const v4Actions = ("0x" +
        (params.swapType === "EXACT_IN"
            ? V4Actions.SWAP_EXACT_IN
            : V4Actions.SWAP_EXACT_OUT) +
        V4Actions.SETTLE_ALL +
        V4Actions.TAKE_ALL);
    // Initialize variables for path and v4Params
    let path;
    let v4Params;
    // Configure path and parameters based on swapType
    if (params.swapType === "EXACT_IN") {
        if (params.amountIn == null || params.amountOutMin == null) {
            throw new Error("amountIn and amountOutMin are required for EXACT_IN swap");
        }
        // Path for 'EXACT_IN' swap
        path = [
            {
                intermediateCurrency: flETH,
                fee: 0,
                tickSpacing: 60,
                hooks: flETHHooks,
                hookData: "0x",
            },
            {
                intermediateCurrency: params.memecoin,
                fee: 0,
                tickSpacing: 60,
                hooks: flaunchHooks,
                hookData: encodeAbiParameters([{ type: "address", name: "referrer" }], [params.referrer ?? zeroAddress]),
            },
        ];
        // Parameters for 'EXACT_IN' swap
        v4Params = encodeAbiParameters(IV4RouterAbiExactInput, [
            {
                currencyIn: ETH,
                path: path,
                amountIn: params.amountIn,
                amountOutMinimum: params.amountOutMin,
            },
        ]);
    }
    else {
        if (params.amountOut == null || params.amountInMax == null) {
            throw new Error("amountOut and amountInMax are required for EXACT_OUT swap");
        }
        // Path for 'EXACT_OUT' swap
        path = [
            {
                fee: 0,
                tickSpacing: 60,
                hookData: "0x",
                hooks: flETHHooks,
                intermediateCurrency: ETH,
            },
            {
                fee: 0,
                tickSpacing: 60,
                hooks: flaunchHooks,
                intermediateCurrency: flETH,
                hookData: encodeAbiParameters([{ type: "address", name: "referrer" }], [params.referrer ?? zeroAddress]),
            },
        ];
        // Parameters for 'EXACT_OUT' swap
        v4Params = encodeAbiParameters(IV4RouterAbiExactOutput, [
            {
                currencyOut: params.memecoin,
                path: path,
                amountOut: params.amountOut,
                amountInMaximum: params.amountInMax,
            },
        ]);
    }
    // Common parameters for both swap types
    const settleParams = encodeAbiParameters([
        {
            type: "address",
            name: "currency",
        },
        {
            type: "uint256",
            name: "maxAmount",
        },
    ], [
        ETH,
        params.swapType === "EXACT_IN"
            ? params.amountIn ?? maxUint256$1
            : params.amountInMax ?? maxUint256$1,
    ]);
    const takeParams = encodeAbiParameters([
        {
            type: "address",
            name: "currency",
        },
        {
            type: "uint256",
            name: "minAmount",
        },
    ], [
        params.memecoin,
        params.swapType === "EXACT_IN"
            ? params.amountOutMin ?? maxUint256$1
            : params.amountOut ?? maxUint256$1,
    ]);
    // Encode router data
    const v4RouterData = encodeAbiParameters([
        { type: "bytes", name: "actions" },
        { type: "bytes[]", name: "params" },
    ], [v4Actions, [v4Params, settleParams, takeParams]]);
    // Commands for Universal Router
    const urCommands = ("0x" + URCommands.V4_SWAP + URCommands.SWEEP);
    const sweepInput = encodeAbiParameters([
        { type: "address", name: "token" },
        { type: "address", name: "recipient" },
        { type: "uint160", name: "amountIn" },
    ], [ETH, params.sender, 0n]);
    // Encode calldata for Universal Router
    const inputs = [v4RouterData, sweepInput];
    const urExecuteCalldata = encodeFunctionData({
        abi: UniversalRouterAbi,
        functionName: "execute",
        args: [urCommands, inputs],
    });
    return {
        calldata: urExecuteCalldata,
        commands: urCommands,
        inputs,
    };
};
// @notice Beofre calling the UniversalRouter the user must have:
// 1. Given the Permit2 contract allowance to spend the memecoin
const memecoinToEthWithPermit2 = (params) => {
    const flETH = FLETHAddress[params.chainId];
    const flETHHooks = FLETHHooksAddress[params.chainId];
    const flaunchHooks = params.positionManagerAddress;
    const v4Actions = ("0x" +
        V4Actions.SWAP_EXACT_IN +
        V4Actions.SETTLE_ALL +
        V4Actions.TAKE_ALL);
    const v4ExactInputParams = encodeAbiParameters(IV4RouterAbiExactInput, [
        {
            currencyIn: params.memecoin,
            path: [
                {
                    intermediateCurrency: flETH,
                    fee: 0,
                    tickSpacing: 60,
                    hooks: flaunchHooks,
                    hookData: encodeAbiParameters([
                        {
                            type: "address",
                            name: "referrer",
                        },
                    ], [params.referrer ?? zeroAddress]),
                },
                {
                    intermediateCurrency: ETH,
                    fee: 0,
                    tickSpacing: 60,
                    hooks: flETHHooks,
                    hookData: "0x",
                },
            ],
            amountIn: params.amountIn,
            amountOutMinimum: params.ethOutMin,
        },
    ]);
    const settleParams = encodeAbiParameters([
        {
            type: "address",
            name: "currency",
        },
        {
            type: "uint256",
            name: "maxAmount",
        },
    ], [params.memecoin, params.amountIn]);
    const takeParams = encodeAbiParameters([
        {
            type: "address",
            name: "currency",
        },
        {
            type: "uint256",
            name: "minAmount",
        },
    ], [ETH, params.ethOutMin]);
    const v4RouterData = encodeAbiParameters([
        { type: "bytes", name: "actions" },
        { type: "bytes[]", name: "params" },
    ], [v4Actions, [v4ExactInputParams, settleParams, takeParams]]);
    if (params.signature && params.permitSingle) {
        const urCommands = ("0x" +
            URCommands.PERMIT2_PERMIT +
            URCommands.V4_SWAP);
        const permit2PermitInput = encodeAbiParameters([
            {
                type: "tuple",
                components: [
                    {
                        type: "tuple",
                        components: [
                            { type: "address", name: "token" },
                            { type: "uint160", name: "amount" },
                            { type: "uint48", name: "expiration" },
                            { type: "uint48", name: "nonce" },
                        ],
                        name: "details",
                    },
                    { type: "address", name: "spender" },
                    { type: "uint256", name: "sigDeadline" },
                ],
                name: "PermitSingle",
            },
            { type: "bytes", name: "signature" },
        ], [params.permitSingle, params.signature]);
        const inputs = [permit2PermitInput, v4RouterData];
        const urExecuteCalldata = encodeFunctionData({
            abi: UniversalRouterAbi,
            functionName: "execute",
            args: [urCommands, inputs],
        });
        return {
            calldata: urExecuteCalldata,
            commands: urCommands,
            inputs,
        };
    }
    else {
        const urCommands = ("0x" + URCommands.V4_SWAP);
        const inputs = [v4RouterData];
        const urExecuteCalldata = encodeFunctionData({
            abi: UniversalRouterAbi,
            functionName: "execute",
            args: [urCommands, inputs],
        });
        return {
            calldata: urExecuteCalldata,
            commands: urCommands,
            inputs,
        };
    }
};
const PERMIT_DETAILS = [
    { name: "token", type: "address" },
    { name: "amount", type: "uint160" },
    { name: "expiration", type: "uint48" },
    { name: "nonce", type: "uint48" },
];
const PERMIT_TYPES = {
    PermitSingle: [
        { name: "details", type: "PermitDetails" },
        { name: "spender", type: "address" },
        { name: "sigDeadline", type: "uint256" },
    ],
    PermitDetails: PERMIT_DETAILS,
};
const getPermit2TypedData = ({ chainId, coinAddress, nonce, deadline, }) => {
    const domain = {
        name: "Permit2",
        chainId,
        verifyingContract: Permit2Address[chainId],
    };
    const message = {
        details: {
            token: coinAddress,
            amount: maxUint160,
            expiration: deadline === undefined ? Number(maxUint48) : Number(deadline),
            nonce,
        },
        spender: UniversalRouterAddress[chainId],
        sigDeadline: deadline === undefined ? maxUint256$1 : deadline,
    };
    const typedData = {
        primaryType: "PermitSingle",
        domain,
        types: PERMIT_TYPES,
        message,
    };
    return {
        typedData,
        permitSingle: message,
    };
};

const InitialPriceAbi = [
    {
        inputs: [
            { internalType: "address", name: "_protocolOwner", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_ethToken", type: "address" },
            { internalType: "address", name: "_usdcToken", type: "address" },
            {
                internalType: "address",
                name: "_flaunchFeeExemption",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_usdcMarketCap", type: "uint256" },
            {
                internalType: "uint256",
                name: "_usdcMarketCapMinimum",
                type: "uint256",
            },
        ],
        name: "MarketCapTooSmall",
        type: "error",
    },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FlaunchFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "MINIMUM_USDC_MARKET_CAP",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "ethToken",
        outputs: [{ internalType: "Currency", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchFeeExemption",
        outputs: [
            {
                internalType: "contract FlaunchFeeExemption",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchFeeThreshold",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "bool", name: "_flipped", type: "bool" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getSqrtPriceX96",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96_", type: "uint160" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolId",
        outputs: [{ internalType: "PoolId", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_flaunchFeeThreshold",
                type: "uint256",
            },
        ],
        name: "setFlaunchFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "setPool",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "usdcToken",
        outputs: [{ internalType: "Currency", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "usdcToken0",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
];

class ReadInitialPrice {
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: InitialPriceAbi,
            address,
        });
    }
    /**
     * Returns a flaunching fee of 0.1% of the initial market cap IF the market cap is greater than 10k & the sender is not fee exempt
     * @param params - The parameters for the flaunching fee calculation
     * @param params.sender - The address of the sender
     * @param params.initialPriceParams - The initial price parameters
     * @returns The flaunching fee
     */
    getFlaunchingFee(params) {
        return this.contract.read("getFlaunchingFee", {
            _sender: params.sender,
            _initialPriceParams: params.initialPriceParams,
        });
    }
    getSqrtPriceX96(params) {
        return this.contract.read("getSqrtPriceX96", {
            _flipped: !params.isFLETHZero,
            _initialPriceParams: params.initialPriceParams,
            0: zeroAddress, // sender
        });
    }
}

class ReadFlaunchPositionManager {
    constructor(address, drift = createDrift$1()) {
        this.TOTAL_SUPPLY = 100n * 10n ** 27n; // 100 Billion tokens in wei
        this.drift = drift;
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FlaunchPositionManagerAbi,
            address,
        });
    }
    async isValidCoin(coinAddress) {
        const poolKey = await this.contract.read("poolKey", {
            _token: coinAddress,
        });
        return poolKey.tickSpacing !== 0;
    }
    /**
     * Gets the ETH balance for the creator to claim
     * @param creator - The address of the creator to check
     * @returns The balance of the creator
     */
    creatorBalance(creator) {
        return this.contract.read("balances", {
            _recipient: creator,
        });
    }
    async getFlaunchingFee(params) {
        const readInitialPrice = new ReadInitialPrice(await this.contract.read("initialPrice"), this.drift);
        const flaunchingFee = await readInitialPrice.getFlaunchingFee(params);
        // increase the flaunching fee by the slippage percent
        const flaunchingFeeWithSlippage = getAmountWithSlippage(flaunchingFee, (params.slippagePercent ?? 0 / 100).toFixed(18).toString(), "EXACT_OUT");
        return flaunchingFeeWithSlippage;
    }
    async watchPoolCreated({ onPoolCreated, startBlockNumber, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolCreated({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolCreated", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        return {
                            ...log,
                            timestamp: Number(block?.timestamp) * 1000, // convert to ms for js
                        };
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolCreated({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolCreated({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolCreatedNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolCreatedNow = undefined;
            },
            pollPoolCreatedNow: pollEvents,
        };
    }
    async watchPoolSwap({ onPoolSwap, flETHIsCurrencyZero, startBlockNumber, filterByPoolId, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolSwap({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolSwap", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                        filter: {
                            poolId: filterByPoolId,
                        },
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        const timestamp = Number(block?.timestamp) * 1000; // convert to ms for js
                        if (flETHIsCurrencyZero === undefined) {
                            return {
                                ...log,
                                timestamp,
                            };
                        }
                        const { flAmount0, flAmount1, flFee0, flFee1, ispAmount0, ispAmount1, ispFee0, ispFee1, uniAmount0, uniAmount1, uniFee0, uniFee1, } = log.args;
                        const currency0Delta = flAmount0 + ispAmount0 + uniAmount0;
                        const currency1Delta = flAmount1 + ispAmount1 + uniAmount1;
                        const currency0Fees = flFee0 + ispFee0 + uniFee0;
                        const currency1Fees = flFee1 + ispFee1 + uniFee1;
                        let feesIsInFLETH;
                        let swapType;
                        if (flETHIsCurrencyZero) {
                            swapType = currency0Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency0Fees < 0;
                        }
                        else {
                            swapType = currency1Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency1Fees < 0;
                        }
                        const absCurrency0Delta = currency0Delta < 0 ? -currency0Delta : currency0Delta;
                        const absCurrency1Delta = currency1Delta < 0 ? -currency1Delta : currency1Delta;
                        const absCurrency0Fees = currency0Fees < 0 ? -currency0Fees : currency0Fees;
                        const absCurrency1Fees = currency1Fees < 0 ? -currency1Fees : currency1Fees;
                        const fees = {
                            isInFLETH: feesIsInFLETH,
                            amount: flETHIsCurrencyZero
                                ? feesIsInFLETH
                                    ? absCurrency0Fees
                                    : absCurrency1Fees
                                : feesIsInFLETH
                                    ? absCurrency1Fees
                                    : absCurrency0Fees,
                        };
                        if (swapType === "BUY") {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsBought: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHSold: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                        else {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsSold: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHBought: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolSwap({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolSwap({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolSwapNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolSwapNow = undefined;
            },
            pollPoolSwapNow: pollEvents,
        };
    }
}
class ReadWriteFlaunchPositionManager extends ReadFlaunchPositionManager {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    async flaunch({ name, symbol, tokenUri, fairLaunchPercent, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, }) {
        const initialMCapInUSDCWei = parseUnits(initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const fairLaunchInBps = BigInt(fairLaunchPercent * 100);
        const creatorFeeAllocationInBps = creatorFeeAllocationPercent * 100;
        let sender = zeroAddress;
        if (this.drift.adapter.getSignerAddress) {
            sender = await this.drift.adapter.getSignerAddress();
        }
        const flaunchingFee = await this.getFlaunchingFee({
            sender,
            initialPriceParams,
            slippagePercent: 5,
        });
        return this.contract.write("flaunch", {
            _params: {
                name,
                symbol,
                tokenUri,
                initialTokenFairLaunch: (this.TOTAL_SUPPLY * fairLaunchInBps) / 10000n,
                premineAmount: 0n,
                creator,
                creatorFeeAllocation: creatorFeeAllocationInBps,
                flaunchAt: flaunchAt ?? 0n,
                initialPriceParams,
                feeCalculatorParams: "0x",
            },
        }, {
            value: flaunchingFee,
            onMined: async () => {
                if (this.pollPoolCreatedNow) {
                    await this.pollPoolCreatedNow();
                }
            },
        });
    }
    async flaunchIPFS({ name, symbol, fairLaunchPercent, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, metadata, pinataConfig, }) {
        const tokenUri = await generateTokenUri(name, {
            metadata,
            pinataConfig,
        });
        return this.flaunch({
            name,
            symbol,
            tokenUri,
            fairLaunchPercent,
            initialMarketCapUSD,
            creator,
            creatorFeeAllocationPercent,
            flaunchAt,
        });
    }
    /**
     * Withdraws the creator's share of the revenue
     * @param recipient - The address to withdraw the revenue to
     * @returns Transaction response
     */
    withdrawFees(recipient) {
        return this.contract.write("withdrawFees", {
            _recipient: recipient,
            _unwrap: true,
        });
    }
}

const bytes32ToUint256 = (value) => {
    return hexToBigInt$1(value);
};
const uint256ToBytes32 = (value) => {
    return pad$1(encodeAbiParameters([{ type: "uint256", name: "value" }], [value]), { size: 32, dir: "right" });
};

const PoolManagerAbi = [
    {
        inputs: [
            { internalType: "address", name: "initialOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyUnlocked", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "currency0", type: "address" },
            { internalType: "address", name: "currency1", type: "address" },
        ],
        name: "CurrenciesOutOfOrderOrEqual",
        type: "error",
    },
    { inputs: [], name: "CurrencyNotSettled", type: "error" },
    { inputs: [], name: "DelegateCallNotAllowed", type: "error" },
    { inputs: [], name: "InvalidCaller", type: "error" },
    { inputs: [], name: "ManagerLocked", type: "error" },
    { inputs: [], name: "MustClearExactPositiveDelta", type: "error" },
    { inputs: [], name: "NonzeroNativeValue", type: "error" },
    { inputs: [], name: "PoolNotInitialized", type: "error" },
    { inputs: [], name: "ProtocolFeeCurrencySynced", type: "error" },
    {
        inputs: [{ internalType: "uint24", name: "fee", type: "uint24" }],
        name: "ProtocolFeeTooLarge",
        type: "error",
    },
    { inputs: [], name: "SwapAmountCannotBeZero", type: "error" },
    {
        inputs: [{ internalType: "int24", name: "tickSpacing", type: "int24" }],
        name: "TickSpacingTooLarge",
        type: "error",
    },
    {
        inputs: [{ internalType: "int24", name: "tickSpacing", type: "int24" }],
        name: "TickSpacingTooSmall",
        type: "error",
    },
    { inputs: [], name: "UnauthorizedDynamicLPFeeUpdate", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount1",
                type: "uint256",
            },
        ],
        name: "Donate",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "Currency",
                name: "currency0",
                type: "address",
            },
            {
                indexed: true,
                internalType: "Currency",
                name: "currency1",
                type: "address",
            },
            { indexed: false, internalType: "uint24", name: "fee", type: "uint24" },
            {
                indexed: false,
                internalType: "int24",
                name: "tickSpacing",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "contract IHooks",
                name: "hooks",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "Initialize",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "tickUpper",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "liquidityDelta",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "bytes32",
                name: "salt",
                type: "bytes32",
            },
        ],
        name: "ModifyLiquidity",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            { indexed: false, internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "OperatorSet",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "user", type: "address" },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "protocolFeeController",
                type: "address",
            },
        ],
        name: "ProtocolFeeControllerUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: false,
                internalType: "uint24",
                name: "protocolFee",
                type: "uint24",
            },
        ],
        name: "ProtocolFeeUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "PoolId", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "sqrtPriceX96",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "liquidity",
                type: "uint128",
            },
            { indexed: false, internalType: "int24", name: "tick", type: "int24" },
            { indexed: false, internalType: "uint24", name: "fee", type: "uint24" },
        ],
        name: "Swap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "caller",
                type: "address",
            },
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "balance", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "clear",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "collectProtocolFees",
        outputs: [
            { internalType: "uint256", name: "amountCollected", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint256", name: "amount0", type: "uint256" },
            { internalType: "uint256", name: "amount1", type: "uint256" },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "donate",
        outputs: [{ internalType: "BalanceDelta", name: "delta", type: "int256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
        name: "extsload",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "startSlot", type: "bytes32" },
            { internalType: "uint256", name: "nSlots", type: "uint256" },
        ],
        name: "extsload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32[]", name: "slots", type: "bytes32[]" }],
        name: "extsload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32[]", name: "slots", type: "bytes32[]" }],
        name: "exttload",
        outputs: [{ internalType: "bytes32[]", name: "", type: "bytes32[]" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "slot", type: "bytes32" }],
        name: "exttload",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
        ],
        name: "initialize",
        outputs: [{ internalType: "int24", name: "tick", type: "int24" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isOperator",
        outputs: [{ internalType: "bool", name: "isOperator", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "params",
                type: "tuple",
            },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "modifyLiquidity",
        outputs: [
            { internalType: "BalanceDelta", name: "callerDelta", type: "int256" },
            { internalType: "BalanceDelta", name: "feesAccrued", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolFeeController",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "protocolFeesAccrued",
        outputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "approved", type: "bool" },
        ],
        name: "setOperator",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint24", name: "newProtocolFee", type: "uint24" },
        ],
        name: "setProtocolFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "controller", type: "address" }],
        name: "setProtocolFeeController",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "settle",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "recipient", type: "address" }],
        name: "settleFor",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "params",
                type: "tuple",
            },
            { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        name: "swap",
        outputs: [
            { internalType: "BalanceDelta", name: "swapDelta", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "Currency", name: "currency", type: "address" }],
        name: "sync",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "Currency", name: "currency", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "take",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "receiver", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "sender", type: "address" },
            { internalType: "address", name: "receiver", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlock",
        outputs: [{ internalType: "bytes", name: "result", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "key",
                type: "tuple",
            },
            { internalType: "uint24", name: "newDynamicLPFee", type: "uint24" },
        ],
        name: "updateDynamicLPFee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

class ReadPoolManager {
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: PoolManagerAbi,
            address,
        });
    }
    poolStateSlot({ poolId }) {
        const POOLS_SLOT = uint256ToBytes32(6n);
        return keccak256$1(encodePacked(["bytes32", "bytes32"], [poolId, POOLS_SLOT]));
    }
    async poolSlot0({ poolId }) {
        const stateSlot = this.poolStateSlot({ poolId });
        let res = { sqrtPriceX96: 0n, tick: 0, protocolFee: 0, lpFee: 0 };
        try {
            const result = await this.contract.read("extsload", {
                slot: stateSlot,
            });
            const data = (Array.isArray(result) ? result[0] : result);
            // Convert the input hex to a BigInt for bitwise operations
            const dataAsBigInt = BigInt(data);
            // Extract sqrtPriceX96 (bottom 160 bits)
            const sqrtPriceX96Mask = BigInt("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
            const sqrtPriceX96 = dataAsBigInt & sqrtPriceX96Mask;
            // Extract tick (next 24 bits after sqrtPriceX96)
            // First, shift right by 160 bits to get the tick bits at the bottom
            const tickShifted = dataAsBigInt >> 160n;
            // Then mask to get only the 24 bits we want
            const tickMask = BigInt("0xFFFFFF");
            const tickRaw = Number(tickShifted & tickMask);
            // Sign extend the 24-bit number if needed
            const tick = tickRaw > 0x7fffff ? tickRaw - 0x1000000 : tickRaw;
            // Extract protocolFee (next 24 bits)
            const protocolFeeShifted = dataAsBigInt >> 184n;
            const protocolFeeMask = BigInt("0xFFFFFF");
            const protocolFee = Number(protocolFeeShifted & protocolFeeMask);
            // Extract lpFee (last 24 bits)
            const lpFeeShifted = dataAsBigInt >> 208n;
            const lpFeeMask = BigInt("0xFFFFFF");
            const lpFee = Number(lpFeeShifted & lpFeeMask);
            res = { sqrtPriceX96, tick, protocolFee, lpFee };
        }
        catch (error) {
            console.error(error);
        }
        return res;
    }
    async positionInfo({ poolId, owner, tickLower, tickUpper, salt, }) {
        const saltBytes32 = pad$1(stringToHex$1(salt), { size: 32, dir: "right" });
        const positionKey = keccak256$1(encodePacked(["address", "int24", "int24", "bytes32"], [owner, tickLower, tickUpper, saltBytes32]));
        const stateSlot = this.poolStateSlot({ poolId });
        const POSITIONS_OFFSET = 6n;
        const positionMapping = uint256ToBytes32(bytes32ToUint256(stateSlot) + POSITIONS_OFFSET);
        const positionInfoSlot = keccak256$1(encodePacked(["bytes32", "bytes32"], [positionKey, positionMapping]));
        const data = (await this.contract.read("extsload", {
            startSlot: positionInfoSlot,
            nSlots: 3n,
        }));
        // FIXME: data returned is not an array
        console.log({ data });
        const liquidity = hexToBigInt$1(data[0]);
        const feeGrowthInside0LastX128 = hexToBigInt$1(data[1]);
        const feeGrowthInside1LastX128 = hexToBigInt$1(data[2]);
        return {
            liquidity,
            feeGrowthInside0LastX128,
            feeGrowthInside1LastX128,
        };
    }
    async getStateSlot(stateSlot) {
        const result = await this.contract.read("extsload", {
            slot: stateSlot,
        });
        // Cast through unknown first to avoid type checking issues
        const firstResult = Array.isArray(result) ? result[0] : result;
        return firstResult;
    }
}

const StateViewAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getFeeGrowthGlobals",
        outputs: [
            { internalType: "uint256", name: "feeGrowthGlobal0", type: "uint256" },
            { internalType: "uint256", name: "feeGrowthGlobal1", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
        ],
        name: "getFeeGrowthInside",
        outputs: [
            {
                internalType: "uint256",
                name: "feeGrowthInside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getLiquidity",
        outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "bytes32", name: "positionId", type: "bytes32" },
        ],
        name: "getPositionInfo",
        outputs: [
            { internalType: "uint128", name: "liquidity", type: "uint128" },
            {
                internalType: "uint256",
                name: "feeGrowthInside0LastX128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1LastX128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "bytes32", name: "salt", type: "bytes32" },
        ],
        name: "getPositionInfo",
        outputs: [
            { internalType: "uint128", name: "liquidity", type: "uint128" },
            {
                internalType: "uint256",
                name: "feeGrowthInside0LastX128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthInside1LastX128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "bytes32", name: "positionId", type: "bytes32" },
        ],
        name: "getPositionLiquidity",
        outputs: [{ internalType: "uint128", name: "liquidity", type: "uint128" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "getSlot0",
        outputs: [
            { internalType: "uint160", name: "sqrtPriceX96", type: "uint160" },
            { internalType: "int24", name: "tick", type: "int24" },
            { internalType: "uint24", name: "protocolFee", type: "uint24" },
            { internalType: "uint24", name: "lpFee", type: "uint24" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int16", name: "tick", type: "int16" },
        ],
        name: "getTickBitmap",
        outputs: [{ internalType: "uint256", name: "tickBitmap", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickFeeGrowthOutside",
        outputs: [
            {
                internalType: "uint256",
                name: "feeGrowthOutside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthOutside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickInfo",
        outputs: [
            { internalType: "uint128", name: "liquidityGross", type: "uint128" },
            { internalType: "int128", name: "liquidityNet", type: "int128" },
            {
                internalType: "uint256",
                name: "feeGrowthOutside0X128",
                type: "uint256",
            },
            {
                internalType: "uint256",
                name: "feeGrowthOutside1X128",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "poolId", type: "bytes32" },
            { internalType: "int24", name: "tick", type: "int24" },
        ],
        name: "getTickLiquidity",
        outputs: [
            { internalType: "uint128", name: "liquidityGross", type: "uint128" },
            { internalType: "int128", name: "liquidityNet", type: "int128" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
];

/**
 * Client for reading state information from Uniswap V4 pools
 * Provides methods to query pool states, positions, and tick liquidity
 */
class ReadStateView {
    /**
     * Creates a new ReadStateView instance
     * @param address - The address of the StateView contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: StateViewAbi,
            address,
        });
    }
    /**
     * Gets the Slot0 data for a pool
     * @param poolId - The ID of the pool to query
     * @returns Promise<{tick: number, sqrtPriceX96: bigint, protocolFees: bigint}> - Current pool state
     */
    poolSlot0({ poolId }) {
        return this.contract.read("getSlot0", {
            poolId,
        });
    }
    /**
     * Gets information about a liquidity position
     * @param poolId - The ID of the pool
     * @param owner - The address of the position owner
     * @param tickLower - The lower tick of the position
     * @param tickUpper - The upper tick of the position
     * @param salt - The salt used to identify the position
     * @returns Promise<{liquidity: bigint, feeGrowthInside0LastX128: bigint, feeGrowthInside1LastX128: bigint, tokensOwed0: bigint, tokensOwed1: bigint}> - Position details
     */
    positionInfo({ poolId, owner, tickLower, tickUpper, salt, }) {
        const saltBytes32 = pad$1(stringToHex$1(salt), { size: 32, dir: "right" });
        return this.contract.read("getPositionInfo", {
            poolId,
            owner,
            tickLower,
            tickUpper,
            salt: saltBytes32,
        });
    }
    /**
     * Gets the liquidity at a specific tick
     * @param poolId - The ID of the pool
     * @param tick - The tick to query
     * @returns Promise<{liquidityGross: bigint, liquidityNet: bigint, feeGrowthOutside0X128: bigint, feeGrowthOutside1X128: bigint}> - Tick liquidity information
     */
    getTickLiquidity({ poolId, tick }) {
        return this.contract.read("getTickLiquidity", {
            poolId,
            tick,
        });
    }
}

const FairLaunchAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_startsAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endsAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_revenue",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_supply",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endedAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchEnded",
        type: "event",
    },
    {
        inputs: [],
        name: "FAIR_LAUNCH_WINDOW",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_tokenFees", type: "uint256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "closePosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int24", name: "_initialTick", type: "int24" },
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
            {
                internalType: "uint256",
                name: "_initialTokenFairLaunch",
                type: "uint256",
            },
        ],
        name: "createPosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "fairLaunchInfo",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int256", name: "_amountSpecified", type: "int256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "fillFromPosition",
        outputs: [
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "BalanceDelta", name: "balanceDelta_", type: "int256" },
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "fairLaunchInfo_",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "inFairLaunchWindow",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int256", name: "_revenue", type: "int256" },
        ],
        name: "modifyRevenue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
];

/**
 * Client for interacting with the FairLaunch V1 contract in read-only mode
 * Provides methods to query fair launch information and status
 */
class ReadFairLaunch {
    /**
     * Creates a new ReadFairLaunch instance
     * @param address - The address of the FairLaunch contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FairLaunchAbi,
            address,
        });
    }
    fairLaunchDuration({ poolId }) {
        return 30 * 60; // 30 minutes
    }
    /**
     * Gets information about a fair launch for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{initialTick: number, closed: boolean, endsAt: number}> - Fair launch details
     */
    fairLaunchInfo({ poolId }) {
        return this.contract.read("fairLaunchInfo", {
            _poolId: poolId,
        });
    }
    /**
     * Checks if a fair launch is currently active
     * @param poolId - The ID of the pool
     * @returns Promise<boolean> - True if the fair launch is active (not closed and not expired), false otherwise
     */
    async isFairLaunchActive({ poolId }) {
        const { closed, endsAt } = await this.fairLaunchInfo({ poolId });
        if (closed) {
            return false;
        }
        if (new Date().getTime() / 1000 > endsAt) {
            return false;
        }
        return true;
    }
}

const BidwallAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_protocolOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotCreator", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
        ],
        name: "BidWallClosed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_added",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_pending",
                type: "uint256",
            },
        ],
        name: "BidWallDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            { indexed: false, internalType: "bool", name: "_disabled", type: "bool" },
        ],
        name: "BidWallDisabledStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallRepositioned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
        ],
        name: "BidWallRewardsTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_newSwapFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FixedSwapFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_ethSwapAmount", type: "uint256" },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "isBidWallEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "poolInfo",
        outputs: [
            { internalType: "bool", name: "disabled", type: "bool" },
            { internalType: "bool", name: "initialized", type: "bool" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "uint256", name: "pendingETHFees", type: "uint256" },
            { internalType: "uint256", name: "cumulativeSwapFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "position",
        outputs: [
            { internalType: "uint256", name: "amount0_", type: "uint256" },
            { internalType: "uint256", name: "amount1_", type: "uint256" },
            { internalType: "uint256", name: "pendingEth_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "bool", name: "_disable", type: "bool" },
        ],
        name: "setDisabledState",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "swapFeeThreshold", type: "uint256" },
        ],
        name: "setSwapFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

/**
 * Client for interacting with the BidWall V1 contract in read-only mode
 * Provides methods to query bid wall positions and pool information
 */
class ReadBidWall {
    /**
     * Creates a new ReadBidWall instance
     * @param address - The address of the BidWall contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: BidwallAbi,
            address,
        });
    }
    /**
     * Gets information about a bid wall position for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{amount0_: bigint, amount1_: bigint, pendingEth_: bigint}> - Position details including token amounts and pending ETH
     */
    position({ poolId }) {
        return this.contract.read("position", {
            _poolId: poolId,
        });
    }
    /**
     * Gets configuration information about a pool's bid wall
     * @param poolId - The ID of the pool
     * @returns Promise<{tickLower: number, tickUpper: number}> - Pool configuration including tick range
     */
    poolInfo({ poolId }) {
        return this.contract.read("poolInfo", {
            _poolId: poolId,
        });
    }
}

const AnyBidWallAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_protocolOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotCreator", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
        ],
        name: "BidWallClosed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_added",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_pending",
                type: "uint256",
            },
        ],
        name: "BidWallDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            { indexed: false, internalType: "bool", name: "_disabled", type: "bool" },
        ],
        name: "BidWallDisabledStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallRepositioned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
        ],
        name: "BidWallRewardsTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_newSwapFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FixedSwapFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_staleTimeWindow",
                type: "uint256",
            },
        ],
        name: "StaleTimeWindowUpdated",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "checkStalePosition",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_ethSwapAmount", type: "uint256" },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "isBidWallEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "lastPoolTransaction",
        outputs: [{ internalType: "uint256", name: "_timestamp", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "poolInfo",
        outputs: [
            { internalType: "bool", name: "disabled", type: "bool" },
            { internalType: "bool", name: "initialized", type: "bool" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "uint256", name: "pendingETHFees", type: "uint256" },
            { internalType: "uint256", name: "cumulativeSwapFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "position",
        outputs: [
            { internalType: "uint256", name: "amount0_", type: "uint256" },
            { internalType: "uint256", name: "amount1_", type: "uint256" },
            { internalType: "uint256", name: "pendingEth_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "bool", name: "_disable", type: "bool" },
        ],
        name: "setDisabledState",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_staleTimeWindow", type: "uint256" },
        ],
        name: "setStaleTimeWindow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "swapFeeThreshold", type: "uint256" },
        ],
        name: "setSwapFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "staleTimeWindow",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

/**
 * Client for interacting with the AnyBidWall contract in read-only mode
 * Provides methods to query bid wall positions and pool information
 * Enhanced version of the V1 contract with additional features
 */
class AnyBidWall {
    /**
     * Creates a new ReadBidWallV1_1 instance
     * @param address - The address of the BidWall V1.1 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: AnyBidWallAbi,
            address,
        });
    }
    /**
     * Gets information about a bid wall position for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{amount0_: bigint, amount1_: bigint, pendingEth_: bigint}> - Position details including token amounts and pending ETH
     */
    position({ poolId }) {
        return this.contract.read("position", {
            _poolId: poolId,
        });
    }
    /**
     * Gets configuration information about a pool's bid wall
     * @param poolId - The ID of the pool
     * @returns Promise<{tickLower: number, tickUpper: number}> - Pool configuration including tick range
     */
    poolInfo({ poolId }) {
        return this.contract.read("poolInfo", {
            _poolId: poolId,
        });
    }
}

const FlaunchZapAbi = [
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "contract Flaunch",
                name: "_flaunchContract",
                type: "address",
            },
            { internalType: "contract IFLETH", name: "_flETH", type: "address" },
            { internalType: "contract PoolSwap", name: "_poolSwap", type: "address" },
            {
                internalType: "contract ITreasuryManagerFactory",
                name: "_treasuryManagerFactory",
                type: "address",
            },
            {
                internalType: "contract IMerkleAirdrop",
                name: "_merkleAirdrop",
                type: "address",
            },
            {
                internalType: "contract WhitelistFairLaunch",
                name: "_whitelistFairLaunch",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "CreatorCannotBeZero", type: "error" },
    { inputs: [], name: "InsufficientMemecoinsForAirdrop", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_premineAmount", type: "uint256" },
            { internalType: "uint256", name: "_slippage", type: "uint256" },
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "calculateFee",
        outputs: [
            { internalType: "uint256", name: "ethRequired_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flETH",
        outputs: [{ internalType: "contract IFLETH", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_flaunchParams",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            { internalType: "uint256", name: "ethSpent_", type: "uint256" },
            { internalType: "address", name: "", type: "address" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_flaunchParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
                    { internalType: "string", name: "merkleIPFSHash", type: "string" },
                    { internalType: "uint256", name: "maxTokens", type: "uint256" },
                ],
                internalType: "struct FlaunchZap.WhitelistParams",
                name: "_whitelistParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "uint256", name: "airdropIndex", type: "uint256" },
                    { internalType: "uint256", name: "airdropAmount", type: "uint256" },
                    { internalType: "uint256", name: "airdropEndTime", type: "uint256" },
                    { internalType: "bytes32", name: "merkleRoot", type: "bytes32" },
                    { internalType: "string", name: "merkleIPFSHash", type: "string" },
                ],
                internalType: "struct FlaunchZap.AirdropParams",
                name: "_airdropParams",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "manager", type: "address" },
                    { internalType: "bytes", name: "initializeData", type: "bytes" },
                    { internalType: "bytes", name: "depositData", type: "bytes" },
                ],
                internalType: "struct FlaunchZap.TreasuryManagerParams",
                name: "_treasuryManagerParams",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            { internalType: "uint256", name: "ethSpent_", type: "uint256" },
            { internalType: "address", name: "deployedManager_", type: "address" },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract Flaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "merkleAirdrop",
        outputs: [
            { internalType: "contract IMerkleAirdrop", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolSwap",
        outputs: [{ internalType: "contract PoolSwap", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "treasuryManagerFactory",
        outputs: [
            {
                internalType: "contract ITreasuryManagerFactory",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "whitelistFairLaunch",
        outputs: [
            {
                internalType: "contract WhitelistFairLaunch",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const FlaunchPositionManagerV1_1Abi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    { internalType: "address", name: "feeEscrow", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                    {
                        internalType: "contract TreasuryActionManager",
                        name: "actionManager",
                        type: "address",
                    },
                    {
                        internalType: "contract BidWall",
                        name: "bidWall",
                        type: "address",
                    },
                    {
                        internalType: "contract FairLaunch",
                        name: "fairLaunch",
                        type: "address",
                    },
                ],
                internalType: "struct PositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_paid", type: "uint256" },
            { internalType: "uint256", name: "_required", type: "uint256" },
        ],
        name: "InsufficientFlaunchFee",
        type: "error",
    },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
        ],
        name: "TokenNotFlaunched",
        type: "error",
    },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_unsoldSupply",
                type: "uint256",
            },
        ],
        name: "FairLaunchBurn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount1",
                type: "uint128",
            },
        ],
        name: "HookFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount1",
                type: "uint128",
            },
        ],
        name: "HookSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchFee",
                type: "uint256",
            },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "_premineAmount",
                type: "int256",
            },
        ],
        name: "PoolPremine",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_flaunchesAt",
                type: "uint256",
            },
        ],
        name: "PoolScheduled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        inputs: [],
        name: "BURN_ADDRESS",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunch",
        outputs: [
            { internalType: "contract FairLaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract FeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [{ internalType: "contract IFlaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "flaunchesAt",
        outputs: [
            { internalType: "uint256", name: "_flaunchTime", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

class ReadFlaunchPositionManagerV1_1 {
    constructor(address, drift = createDrift$1()) {
        this.TOTAL_SUPPLY = 100n * 10n ** 27n; // 100 Billion tokens in wei
        this.drift = drift;
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FlaunchPositionManagerV1_1Abi,
            address,
        });
    }
    async isValidCoin(coinAddress) {
        const poolKey = await this.contract.read("poolKey", {
            _token: coinAddress,
        });
        return poolKey.tickSpacing !== 0;
    }
    getFlaunchingMarketCap(initialPriceParams) {
        return this.contract.read("getFlaunchingMarketCap", {
            _initialPriceParams: initialPriceParams,
        });
    }
    async getFlaunchingFee(params) {
        const readInitialPrice = new ReadInitialPrice(await this.contract.read("initialPrice"), this.drift);
        const flaunchingFee = await readInitialPrice.getFlaunchingFee(params);
        // increase the flaunching fee by the slippage percent
        const flaunchingFeeWithSlippage = getAmountWithSlippage(flaunchingFee, (params.slippagePercent ?? 0 / 100).toFixed(18).toString(), "EXACT_OUT");
        return flaunchingFeeWithSlippage;
    }
    async watchPoolCreated({ onPoolCreated, startBlockNumber, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolCreated({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolCreated", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        return {
                            ...log,
                            timestamp: Number(block?.timestamp) * 1000, // convert to ms for js
                        };
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolCreated({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolCreated({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolCreatedNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolCreatedNow = undefined;
            },
            pollPoolCreatedNow: pollEvents,
        };
    }
    async watchPoolSwap({ onPoolSwap, flETHIsCurrencyZero, startBlockNumber, filterByPoolId, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolSwap({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolSwap", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                        filter: {
                            poolId: filterByPoolId,
                        },
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        const timestamp = Number(block?.timestamp) * 1000; // convert to ms for js
                        if (flETHIsCurrencyZero === undefined) {
                            return {
                                ...log,
                                timestamp,
                            };
                        }
                        const { flAmount0, flAmount1, flFee0, flFee1, ispAmount0, ispAmount1, ispFee0, ispFee1, uniAmount0, uniAmount1, uniFee0, uniFee1, } = log.args;
                        const currency0Delta = flAmount0 + ispAmount0 + uniAmount0;
                        const currency1Delta = flAmount1 + ispAmount1 + uniAmount1;
                        const currency0Fees = flFee0 + ispFee0 + uniFee0;
                        const currency1Fees = flFee1 + ispFee1 + uniFee1;
                        let feesIsInFLETH;
                        let swapType;
                        if (flETHIsCurrencyZero) {
                            swapType = currency0Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency0Fees < 0;
                        }
                        else {
                            swapType = currency1Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency1Fees < 0;
                        }
                        const absCurrency0Delta = currency0Delta < 0 ? -currency0Delta : currency0Delta;
                        const absCurrency1Delta = currency1Delta < 0 ? -currency1Delta : currency1Delta;
                        const absCurrency0Fees = currency0Fees < 0 ? -currency0Fees : currency0Fees;
                        const absCurrency1Fees = currency1Fees < 0 ? -currency1Fees : currency1Fees;
                        const fees = {
                            isInFLETH: feesIsInFLETH,
                            amount: flETHIsCurrencyZero
                                ? feesIsInFLETH
                                    ? absCurrency0Fees
                                    : absCurrency1Fees
                                : feesIsInFLETH
                                    ? absCurrency1Fees
                                    : absCurrency0Fees,
                        };
                        if (swapType === "BUY") {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsBought: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHSold: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                        else {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsSold: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHBought: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolSwap({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolSwap({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolSwapNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolSwapNow = undefined;
            },
            pollPoolSwapNow: pollEvents,
        };
    }
    initialPrice() {
        return this.contract.read("initialPrice");
    }
}
class ReadWriteFlaunchPositionManagerV1_1 extends ReadFlaunchPositionManagerV1_1 {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    /**
     * Flaunches a new token directly from the position manager.
     * For premine support, flaunch via the FlaunchZapClient.
     */
    async flaunch({ name, symbol, tokenUri, fairLaunchPercent, fairLaunchDuration, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, }) {
        const initialMCapInUSDCWei = parseUnits(initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const fairLaunchInBps = BigInt(fairLaunchPercent * 100);
        const creatorFeeAllocationInBps = creatorFeeAllocationPercent * 100;
        let sender = zeroAddress;
        if (this.drift.adapter.getSignerAddress) {
            sender = await this.drift.adapter.getSignerAddress();
        }
        const flaunchingFee = await this.getFlaunchingFee({
            sender,
            initialPriceParams,
            slippagePercent: 5,
        });
        return this.contract.write("flaunch", {
            _params: {
                name,
                symbol,
                tokenUri,
                initialTokenFairLaunch: (this.TOTAL_SUPPLY * fairLaunchInBps) / 10000n,
                fairLaunchDuration,
                premineAmount: 0n,
                creator,
                creatorFeeAllocation: creatorFeeAllocationInBps,
                flaunchAt: flaunchAt ?? 0n,
                initialPriceParams,
                feeCalculatorParams: "0x",
            },
        }, {
            value: flaunchingFee,
            onMined: async () => {
                if (this.pollPoolCreatedNow) {
                    await this.pollPoolCreatedNow();
                }
            },
        });
    }
    /**
     * Flaunches a new token directly from the position manager by uploading the token metadata to IPFS.
     * For premine support, flaunch via the FlaunchZapClient.
     */
    async flaunchIPFS({ name, symbol, fairLaunchPercent, fairLaunchDuration, initialMarketCapUSD, creator, creatorFeeAllocationPercent, flaunchAt, metadata, pinataConfig, }) {
        const tokenUri = await generateTokenUri(name, {
            metadata,
            pinataConfig,
        });
        return this.flaunch({
            name,
            symbol,
            tokenUri,
            fairLaunchPercent,
            fairLaunchDuration,
            initialMarketCapUSD,
            creator,
            creatorFeeAllocationPercent,
            flaunchAt,
        });
    }
}

/**
 * Base client for interacting with the FlaunchZap contract in read-only mode
 * Provides basic contract initialization
 */
class ReadFlaunchZap {
    /**
     * Creates a new ReadFlaunchZap instance
     * @param chainId - The chain ID of the contract
     * @param address - The address of the FlaunchZap contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(chainId, address, drift = createDrift$1()) {
        this.TOTAL_SUPPLY = 100n * 10n ** 27n; // 100 Billion tokens in wei
        this.chainId = chainId;
        this.drift = drift;
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FlaunchZapAbi,
            address,
        });
        this.readPositionManagerV1_1 = new ReadFlaunchPositionManagerV1_1(FlaunchPositionManagerV1_1Address[this.chainId], drift);
    }
    async getPremineCostInWei(params) {
        const mcapInWei = await this.readPositionManagerV1_1.getFlaunchingMarketCap(params.initialPriceParams);
        const premineCostInWei = (mcapInWei * params.premineAmount) / this.TOTAL_SUPPLY;
        // increase the premine cost by the slippage percent
        const premineCostInWeiWithSlippage = getAmountWithSlippage(premineCostInWei, (params.slippagePercent ?? 0 / 100).toFixed(18).toString(), "EXACT_OUT" // as we know the output premine amount
        );
        return premineCostInWeiWithSlippage;
    }
    async getFlaunchingFee(params) {
        const readInitialPrice = new ReadInitialPrice(await this.readPositionManagerV1_1.initialPrice(), this.drift);
        const flaunchingFee = await readInitialPrice.getFlaunchingFee(params);
        // increase the flaunching fee by the slippage percent
        const flaunchingFeeWithSlippage = getAmountWithSlippage(flaunchingFee, (params.slippagePercent ?? 0 / 100).toFixed(18).toString(), "EXACT_OUT");
        return flaunchingFeeWithSlippage;
    }
    /**
     * Calculates the ETH required to flaunch a token, takes into account the ETH for premine and the flaunching fee
     */
    ethRequiredToFlaunch(params) {
        return this.contract.read("calculateFee", {
            _premineAmount: params.premineAmount ?? 0n,
            _slippage: params.slippagePercent
                ? BigInt(params.slippagePercent * 100)
                : 0n,
            _initialPriceParams: params.initialPriceParams,
        });
    }
}
/**
 * Extended client for interacting with the FlaunchZap contract with write capabilities
 */
class ReadWriteFlaunchZap extends ReadFlaunchZap {
    constructor(chainId, address, drift = createDrift$1()) {
        super(chainId, address, drift);
    }
    /**
     * Flaunches a new token, supports premine
     * @param params - Parameters for the flaunch
     * @returns Transaction response for the flaunch creation
     */
    async flaunch(params) {
        const initialMCapInUSDCWei = parseUnits(params.initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const fairLaunchInBps = BigInt(params.fairLaunchPercent * 100);
        const creatorFeeAllocationInBps = params.creatorFeeAllocationPercent * 100;
        const ethRequired = await this.ethRequiredToFlaunch({
            premineAmount: params.premineAmount ?? 0n,
            initialPriceParams,
            slippagePercent: 5,
        });
        return this.contract.write("flaunch", {
            _flaunchParams: {
                name: params.name,
                symbol: params.symbol,
                tokenUri: params.tokenUri,
                initialTokenFairLaunch: (this.TOTAL_SUPPLY * fairLaunchInBps) / 10000n,
                fairLaunchDuration: BigInt(params.fairLaunchDuration),
                premineAmount: params.premineAmount ?? 0n,
                creator: params.creator,
                creatorFeeAllocation: creatorFeeAllocationInBps,
                flaunchAt: params.flaunchAt ?? 0n,
                initialPriceParams,
                feeCalculatorParams: "0x",
            },
            _treasuryManagerParams: {
                manager: zeroAddress,
                initializeData: "0x",
                depositData: "0x",
            },
            _whitelistParams: {
                merkleRoot: zeroHash,
                merkleIPFSHash: "",
                maxTokens: 0n,
            },
            _airdropParams: {
                airdropIndex: 0n,
                airdropAmount: 0n,
                airdropEndTime: 0n,
                merkleRoot: zeroHash,
                merkleIPFSHash: "",
            },
        }, {
            value: ethRequired,
        });
    }
    async flaunchIPFS(params) {
        const tokenUri = await generateTokenUri(params.name, {
            metadata: params.metadata,
            pinataConfig: params.pinataConfig,
        });
        return this.flaunch({
            ...params,
            tokenUri,
        });
    }
    /**
     * Flaunches a new token for a revenue manager
     * @param params - Parameters for the flaunch with revenue manager
     * @param params.name - The name of the token
     * @param params.symbol - The symbol of the token
     * @param params.tokenUri - The URI containing the token metadata
     * @param params.fairLaunchPercent - Percentage of total supply to be used in fair launch (0-100)
     * @param params.fairLaunchDuration - Duration of fair launch in seconds
     * @param params.initialMarketCapUSD - Initial market cap in USD
     * @param params.creator - Address of the token creator
     * @param params.creatorFeeAllocationPercent - Percentage of fees allocated to creator (0-100)
     * @param params.protocolRecipient - Address to receive protocol fees
     * @param params.protocolFeePercent - Percentage of fees allocated to protocol (0-100)
     * @param params.flaunchAt - Optional timestamp when the flaunch should start
     * @param params.premineAmount - Optional amount of tokens to premine
     * @returns Transaction response for the flaunch creation
     */
    async flaunchWithRevenueManager(params) {
        const initialMCapInUSDCWei = parseUnits(params.initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const fairLaunchInBps = BigInt(params.fairLaunchPercent * 100);
        const creatorFeeAllocationInBps = params.creatorFeeAllocationPercent * 100;
        const ethRequired = await this.ethRequiredToFlaunch({
            premineAmount: params.premineAmount ?? 0n,
            initialPriceParams,
            slippagePercent: 5,
        });
        return this.contract.write("flaunch", {
            _flaunchParams: {
                name: params.name,
                symbol: params.symbol,
                tokenUri: params.tokenUri,
                initialTokenFairLaunch: (this.TOTAL_SUPPLY * fairLaunchInBps) / 10000n,
                fairLaunchDuration: BigInt(params.fairLaunchDuration),
                premineAmount: params.premineAmount ?? 0n,
                creator: params.creator,
                creatorFeeAllocation: creatorFeeAllocationInBps,
                flaunchAt: params.flaunchAt ?? 0n,
                initialPriceParams,
                feeCalculatorParams: "0x",
            },
            _treasuryManagerParams: {
                manager: params.revenueManagerInstanceAddress,
                initializeData: "0x",
                depositData: "0x",
            },
            _whitelistParams: {
                merkleRoot: zeroHash,
                merkleIPFSHash: "",
                maxTokens: 0n,
            },
            _airdropParams: {
                airdropIndex: 0n,
                airdropAmount: 0n,
                airdropEndTime: 0n,
                merkleRoot: zeroHash,
                merkleIPFSHash: "",
            },
        }, {
            value: ethRequired,
        });
    }
    /**
     * Flaunches a new token for a revenue manager, storing the token metadata on IPFS
     * @param params - Parameters for the flaunch including all revenue manager params and IPFS metadata
     * @returns Promise resolving to the transaction response for the flaunch creation
     */
    async flaunchIPFSWithRevenueManager(params) {
        const tokenUri = await generateTokenUri(params.name, {
            metadata: params.metadata,
            pinataConfig: params.pinataConfig,
        });
        return this.flaunchWithRevenueManager({
            ...params,
            tokenUri,
        });
    }
}

const FlaunchAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_memecoinImplementation",
                type: "address",
            },
            { internalType: "string", name: "_baseURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccountBalanceOverflow", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "CallerIsNotPositionManager", type: "error" },
    { inputs: [], name: "CallerNotL2ToL2CrossDomainMessenger", type: "error" },
    {
        inputs: [
            { internalType: "uint24", name: "_allocation", type: "uint24" },
            { internalType: "uint256", name: "_maxAllocation", type: "uint256" },
        ],
        name: "CreatorFeeAllocationInvalid",
        type: "error",
    },
    { inputs: [], name: "InvalidCrossDomainSender", type: "error" },
    { inputs: [], name: "InvalidDestinationChain", type: "error" },
    { inputs: [], name: "InvalidFlaunchSchedule", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "InvalidInitialSupply",
        type: "error",
    },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "NotOwnerNorApproved", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_buyAmount", type: "uint256" },
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "PremineExceedsInitialAmount",
        type: "error",
    },
    { inputs: [], name: "TokenAlreadyBridged", type: "error" },
    { inputs: [], name: "TokenAlreadyExists", type: "error" },
    { inputs: [], name: "TokenDoesNotExist", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownMemecoin", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "isApproved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_messageSource",
                type: "uint256",
            },
        ],
        name: "TokenBridged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
        ],
        name: "TokenBridging",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_CREATOR_ALLOCATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_FAIR_LAUNCH_TOKENS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_SCHEDULE_DURATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "baseURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "bridgingStatus",
        outputs: [{ internalType: "bool", name: "_started", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                ],
                internalType: "struct Flaunch.MemecoinMetadata",
                name: "_metadata",
                type: "tuple",
            },
        ],
        name: "finalizeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            {
                internalType: "address payable",
                name: "memecoinTreasury_",
                type: "address",
            },
            { internalType: "uint256", name: "tokenId_", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_memecoinTreasuryImplementation",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "initializeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoin",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoinTreasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinTreasuryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextTokenId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "isApproved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_memecoin", type: "address" },
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMemecoinMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_memecoin", type: "address" }],
        name: "tokenId",
        outputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

/**
 * Client for interacting with the Flaunch V1 contract in read-only mode
 * Provides methods to query token IDs and metadata URIs
 */
class ReadFlaunch {
    /**
     * Creates a new ReadFlaunch instance
     * @param address - The address of the Flaunch contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FlaunchAbi,
            address,
        });
    }
    /**
     * Gets the token ID associated with a memecoin
     * @param coinAddress - The address of the memecoin
     * @returns Promise<bigint> - The token ID
     */
    tokenId(coinAddress) {
        return this.contract.read("tokenId", {
            _memecoin: coinAddress,
        });
    }
    /**
     * Gets the metadata URI for a token
     * @param tokenId - The ID of the token
     * @returns Promise<string> - The token's metadata URI
     */
    tokenURI(tokenId) {
        return this.contract.read("tokenURI", {
            _tokenId: tokenId,
        });
    }
    /**
     * Gets the memecoin address for a given token ID
     * @param tokenId - The ID of the token
     * @returns Promise<Address> - The address of the memecoin
     */
    memecoin(tokenId) {
        return this.contract.read("memecoin", {
            _tokenId: tokenId,
        });
    }
}

const MemecoinAbi = [
    { inputs: [], stateMutability: "nonpayable", type: "constructor" },
    { inputs: [], name: "CallerNotFlaunch", type: "error" },
    { inputs: [], name: "MintAddressIsZero", type: "error" },
    { inputs: [], name: "Permit2AllowanceIsFixedAtInfinity", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "CrosschainBurn",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "amount",
                type: "uint256",
            },
        ],
        name: "CrosschainMint",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegator",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "fromDelegate",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "toDelegate",
                type: "address",
            },
        ],
        name: "DelegateChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "delegate",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "previousBalance",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "newBalance",
                type: "uint256",
            },
        ],
        name: "DelegateVotesChanged",
        type: "event",
    },
    { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: false, internalType: "string", name: "_name", type: "string" },
            {
                indexed: false,
                internalType: "string",
                name: "_symbol",
                type: "string",
            },
        ],
        name: "MetadataUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            {
                indexed: false,
                internalType: "uint256",
                name: "value",
                type: "uint256",
            },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "CLOCK_MODE",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "value", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "burnFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint32", name: "pos", type: "uint32" },
        ],
        name: "checkpoints",
        outputs: [
            {
                components: [
                    { internalType: "uint32", name: "fromBlock", type: "uint32" },
                    { internalType: "uint224", name: "votes", type: "uint224" },
                ],
                internalType: "struct ERC20VotesUpgradeable.Checkpoint",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "clock",
        outputs: [{ internalType: "uint48", name: "", type: "uint48" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "creator",
        outputs: [{ internalType: "address", name: "creator_", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_from", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "crosschainBurn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "crosschainMint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "delegatee", type: "address" }],
        name: "delegate",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "delegatee", type: "address" },
            { internalType: "uint256", name: "nonce", type: "uint256" },
            { internalType: "uint256", name: "expiry", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "delegateBySig",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "delegates",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "eip712Domain",
        outputs: [
            { internalType: "bytes1", name: "fields", type: "bytes1" },
            { internalType: "string", name: "name", type: "string" },
            { internalType: "string", name: "version", type: "string" },
            { internalType: "uint256", name: "chainId", type: "uint256" },
            { internalType: "address", name: "verifyingContract", type: "address" },
            { internalType: "bytes32", name: "salt", type: "bytes32" },
            { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunch",
        outputs: [{ internalType: "contract Flaunch", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "timepoint", type: "uint256" }],
        name: "getPastTotalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "timepoint", type: "uint256" },
        ],
        name: "getPastVotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "getVotes",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
            { internalType: "string", name: "tokenUri_", type: "string" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_to", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "nonces",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "numCheckpoints",
        outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "value", type: "uint256" },
            { internalType: "uint256", name: "deadline", type: "uint256" },
            { internalType: "uint8", name: "v", type: "uint8" },
            { internalType: "bytes32", name: "r", type: "bytes32" },
            { internalType: "bytes32", name: "s", type: "bytes32" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "_interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "treasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "version",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
];

/**
 * Client for interacting with Memecoin (ERC20) contracts in read-only mode
 * Provides methods to query basic token information and balances
 */
class ReadMemecoin {
    /**
     * Creates a new ReadMemecoin instance
     * @param address - The address of the Memecoin contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: MemecoinAbi,
            address,
        });
    }
    /**
     * Gets the name of the token
     * @returns Promise<string> - The name of the token
     */
    name() {
        return this.contract.read("name", {});
    }
    /**
     * Gets the symbol of the token
     * @returns Promise<string> - The symbol of the token
     */
    symbol() {
        return this.contract.read("symbol");
    }
    /**
     * Gets the token URI containing metadata
     * @returns Promise<string> - The token URI
     */
    tokenURI() {
        return this.contract.read("tokenURI");
    }
    /**
     * Gets the total supply of the token
     * @returns Promise<bigint> - The total supply
     */
    totalSupply() {
        return this.contract.read("totalSupply");
    }
    /**
     * Gets the token balance of a specific user
     * @param user - The address of the user to check
     * @returns Promise<bigint> - The token balance
     */
    balanceOf(user) {
        return this.contract.read("balanceOf", {
            account: user,
        });
    }
}

const QuoterAbi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [{ internalType: "PoolId", name: "poolId", type: "bytes32" }],
        name: "NotEnoughLiquidity",
        type: "error",
    },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "QuoteSwap",
        type: "error",
    },
    { inputs: [], name: "UnexpectedCallSuccess", type: "error" },
    {
        inputs: [{ internalType: "bytes", name: "revertData", type: "bytes" }],
        name: "UnexpectedRevertBytes",
        type: "error",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactInput",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactInputSingle",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactOutput",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "_quoteExactOutputSingle",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInput",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactInputSingle",
        outputs: [
            { internalType: "uint256", name: "amountOut", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "exactCurrency", type: "address" },
                    {
                        components: [
                            {
                                internalType: "Currency",
                                name: "intermediateCurrency",
                                type: "address",
                            },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                            { internalType: "bytes", name: "hookData", type: "bytes" },
                        ],
                        internalType: "struct PathKey[]",
                        name: "path",
                        type: "tuple[]",
                    },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                ],
                internalType: "struct IV4Quoter.QuoteExactParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutput",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "Currency", name: "currency0", type: "address" },
                            { internalType: "Currency", name: "currency1", type: "address" },
                            { internalType: "uint24", name: "fee", type: "uint24" },
                            { internalType: "int24", name: "tickSpacing", type: "int24" },
                            {
                                internalType: "contract IHooks",
                                name: "hooks",
                                type: "address",
                            },
                        ],
                        internalType: "struct PoolKey",
                        name: "poolKey",
                        type: "tuple",
                    },
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "uint128", name: "exactAmount", type: "uint128" },
                    { internalType: "bytes", name: "hookData", type: "bytes" },
                ],
                internalType: "struct IV4Quoter.QuoteExactSingleParams",
                name: "params",
                type: "tuple",
            },
        ],
        name: "quoteExactOutputSingle",
        outputs: [
            { internalType: "uint256", name: "amountIn", type: "uint256" },
            { internalType: "uint256", name: "gasEstimate", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
];

/**
 * Client for interacting with the Quoter contract to get price quotes for swaps
 * Provides methods to simulate trades and get expected output amounts
 */
class ReadQuoter {
    /**
     * Creates a new ReadQuoter instance
     * @param chainId - The chain ID where the Quoter contract is deployed
     * @param address - The address of the Quoter contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(chainId, address, drift = createDrift$1()) {
        this.chainId = chainId;
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: QuoterAbi,
            address,
        });
    }
    /**
     * Gets a quote for selling an exact amount of tokens for ETH
     * @param coinAddress - The address of the token to sell
     * @param amountIn - The exact amount of tokens to sell
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The expected amount of ETH to receive
     */
    async getSellQuoteExactInput(coinAddress, amountIn, positionManagerAddress) {
        const res = await this.contract.simulateWrite("quoteExactInput", {
            params: {
                exactAmount: amountIn,
                exactCurrency: coinAddress,
                path: [
                    {
                        fee: 0,
                        tickSpacing: 60,
                        hooks: positionManagerAddress,
                        hookData: "0x",
                        intermediateCurrency: FLETHAddress[this.chainId],
                    },
                    {
                        fee: 0,
                        tickSpacing: 60,
                        hookData: "0x",
                        hooks: FLETHHooksAddress[this.chainId],
                        intermediateCurrency: zeroAddress,
                    },
                ],
            },
        });
        return res.amountOut;
    }
    /**
     * Gets a quote for buying tokens with an exact amount of ETH
     * @param coinAddress - The address of the token to buy
     * @param ethIn - The exact amount of ETH to spend
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The expected amount of tokens to receive
     */
    async getBuyQuoteExactInput(coinAddress, ethIn, positionManagerAddress) {
        const res = await this.contract.simulateWrite("quoteExactInput", {
            params: {
                exactAmount: ethIn,
                exactCurrency: zeroAddress,
                path: [
                    {
                        fee: 0,
                        tickSpacing: 60,
                        hookData: "0x",
                        hooks: FLETHHooksAddress[this.chainId],
                        intermediateCurrency: FLETHAddress[this.chainId],
                    },
                    {
                        fee: 0,
                        tickSpacing: 60,
                        hooks: positionManagerAddress,
                        hookData: "0x",
                        intermediateCurrency: coinAddress,
                    },
                ],
            },
        });
        return res.amountOut;
    }
    /**
     * Gets a quote for buying an exact amount of tokens with ETH
     * @param coinAddress - The address of the token to buy
     * @param coinOut - The exact amount of tokens to receive
     * @param positionManagerAddress - The address of the position manager to use
     * @returns Promise<bigint> - The required amount of ETH to spend
     */
    async getBuyQuoteExactOutput(coinAddress, coinOut, positionManagerAddress) {
        const res = await this.contract.simulateWrite("quoteExactOutput", {
            params: {
                path: [
                    {
                        intermediateCurrency: zeroAddress,
                        fee: 0,
                        tickSpacing: 60,
                        hookData: "0x",
                        hooks: FLETHHooksAddress[this.chainId],
                    },
                    {
                        intermediateCurrency: FLETHAddress[this.chainId],
                        fee: 0,
                        tickSpacing: 60,
                        hooks: positionManagerAddress,
                        hookData: "0x",
                    },
                ],
                exactCurrency: coinAddress,
                exactAmount: coinOut,
            },
        });
        return res.amountIn;
    }
    /**
     * Gets the current ETH/USDC price from the pool
     * @returns Promise<number> - The price of 1 ETH in USDC, formatted with 2 decimal places
     */
    async getETHUSDCPrice() {
        const amountIn = parseEther("1");
        const res = await this.contract.simulateWrite("quoteExactInput", {
            params: {
                exactAmount: amountIn,
                exactCurrency: zeroAddress,
                path: [
                    {
                        fee: USDCETHPoolKeys[this.chainId].fee,
                        tickSpacing: USDCETHPoolKeys[this.chainId].tickSpacing,
                        hooks: USDCETHPoolKeys[this.chainId].hooks,
                        hookData: "0x",
                        intermediateCurrency: USDCETHPoolKeys[this.chainId].currency1,
                    },
                ],
            },
        });
        return Number(Number(formatUnits$1(res.amountOut, 6)).toFixed(2));
    }
}

const Permit2Abi = [
    {
        inputs: [{ internalType: "uint256", name: "deadline", type: "uint256" }],
        name: "AllowanceExpired",
        type: "error",
    },
    { inputs: [], name: "ExcessiveInvalidation", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "InsufficientAllowance",
        type: "error",
    },
    {
        inputs: [{ internalType: "uint256", name: "maxAmount", type: "uint256" }],
        name: "InvalidAmount",
        type: "error",
    },
    { inputs: [], name: "InvalidContractSignature", type: "error" },
    { inputs: [], name: "InvalidNonce", type: "error" },
    { inputs: [], name: "InvalidSignature", type: "error" },
    { inputs: [], name: "InvalidSignatureLength", type: "error" },
    { inputs: [], name: "InvalidSigner", type: "error" },
    { inputs: [], name: "LengthMismatch", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "signatureDeadline", type: "uint256" },
        ],
        name: "SignatureExpired",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "spender",
                type: "address",
            },
        ],
        name: "Lockdown",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "newNonce",
                type: "uint48",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "oldNonce",
                type: "uint48",
            },
        ],
        name: "NonceInvalidation",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "token",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "spender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "amount",
                type: "uint160",
            },
            {
                indexed: false,
                internalType: "uint48",
                name: "expiration",
                type: "uint48",
            },
            { indexed: false, internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        name: "Permit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "word",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "mask",
                type: "uint256",
            },
        ],
        name: "UnorderedNonceInvalidation",
        type: "event",
    },
    {
        inputs: [],
        name: "DOMAIN_SEPARATOR",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
            { internalType: "address", name: "", type: "address" },
        ],
        name: "allowance",
        outputs: [
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
            { internalType: "uint48", name: "nonce", type: "uint48" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "uint48", name: "expiration", type: "uint48" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "token", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint48", name: "newNonce", type: "uint48" },
        ],
        name: "invalidateNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "wordPos", type: "uint256" },
            { internalType: "uint256", name: "mask", type: "uint256" },
        ],
        name: "invalidateUnorderedNonces",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "token", type: "address" },
                    { internalType: "address", name: "spender", type: "address" },
                ],
                internalType: "struct IAllowanceTransfer.TokenSpenderPair[]",
                name: "approvals",
                type: "tuple[]",
            },
        ],
        name: "lockdown",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            { internalType: "uint256", name: "", type: "uint256" },
        ],
        name: "nonceBitmap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint160", name: "amount", type: "uint160" },
                            { internalType: "uint48", name: "expiration", type: "uint48" },
                            { internalType: "uint48", name: "nonce", type: "uint48" },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails[]",
                        name: "details",
                        type: "tuple[]",
                    },
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "sigDeadline", type: "uint256" },
                ],
                internalType: "struct IAllowanceTransfer.PermitBatch",
                name: "permitBatch",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint160", name: "amount", type: "uint160" },
                            { internalType: "uint48", name: "expiration", type: "uint48" },
                            { internalType: "uint48", name: "nonce", type: "uint48" },
                        ],
                        internalType: "struct IAllowanceTransfer.PermitDetails",
                        name: "details",
                        type: "tuple",
                    },
                    { internalType: "address", name: "spender", type: "address" },
                    { internalType: "uint256", name: "sigDeadline", type: "uint256" },
                ],
                internalType: "struct IAllowanceTransfer.PermitSingle",
                name: "permitSingle",
                type: "tuple",
            },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions",
                        name: "permitted",
                        type: "tuple",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails",
                name: "transferDetails",
                type: "tuple",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            { internalType: "string", name: "witnessTypeString", type: "string" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        components: [
                            { internalType: "address", name: "token", type: "address" },
                            { internalType: "uint256", name: "amount", type: "uint256" },
                        ],
                        internalType: "struct ISignatureTransfer.TokenPermissions[]",
                        name: "permitted",
                        type: "tuple[]",
                    },
                    { internalType: "uint256", name: "nonce", type: "uint256" },
                    { internalType: "uint256", name: "deadline", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.PermitBatchTransferFrom",
                name: "permit",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint256", name: "requestedAmount", type: "uint256" },
                ],
                internalType: "struct ISignatureTransfer.SignatureTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "bytes32", name: "witness", type: "bytes32" },
            { internalType: "string", name: "witnessTypeString", type: "string" },
            { internalType: "bytes", name: "signature", type: "bytes" },
        ],
        name: "permitWitnessTransferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "from", type: "address" },
                    { internalType: "address", name: "to", type: "address" },
                    { internalType: "uint160", name: "amount", type: "uint160" },
                    { internalType: "address", name: "token", type: "address" },
                ],
                internalType: "struct IAllowanceTransfer.AllowanceTransferDetails[]",
                name: "transferDetails",
                type: "tuple[]",
            },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint160", name: "amount", type: "uint160" },
            { internalType: "address", name: "token", type: "address" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

/**
 * Client for interacting with Uniswap's Permit2 contract in read-only mode
 * Provides methods to query token approvals and allowances
 */
class ReadPermit2 {
    /**
     * Creates a new ReadPermit2 instance
     * @param address - The address of the Permit2 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: Permit2Abi,
            address,
        });
    }
    /**
     * Gets the allowance and nonce for a token approval
     * @param owner - The address of the token owner
     * @param coinAddress - The address of the token contract
     * @param spender - The address of the spender
     * @returns Promise<{amount: bigint, expiration: bigint, nonce: bigint}> - The allowance details
     */
    async allowance(owner, coinAddress, spender) {
        return this.contract.read("allowance", {
            0: owner,
            1: coinAddress,
            2: spender,
        });
    }
}
class ReadWritePermit2 extends ReadPermit2 {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    /**
     * Approves a spender to spend a token via transaction
     * @param params - The parameters for the approval
     * @returns The transaction response
     */
    approve(params) {
        return this.contract.write("approve", params);
    }
}

const AnyPositionManagerAbi = [
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "nativeToken", type: "address" },
                    {
                        internalType: "contract IPoolManager",
                        name: "poolManager",
                        type: "address",
                    },
                    {
                        components: [
                            { internalType: "uint24", name: "swapFee", type: "uint24" },
                            { internalType: "uint24", name: "referrer", type: "uint24" },
                            { internalType: "uint24", name: "protocol", type: "uint24" },
                            { internalType: "bool", name: "active", type: "bool" },
                        ],
                        internalType: "struct FeeDistributor.FeeDistribution",
                        name: "feeDistribution",
                        type: "tuple",
                    },
                    {
                        internalType: "contract IInitialPrice",
                        name: "initialPrice",
                        type: "address",
                    },
                    { internalType: "address", name: "protocolOwner", type: "address" },
                    {
                        internalType: "address",
                        name: "protocolFeeRecipient",
                        type: "address",
                    },
                    { internalType: "address", name: "flayGovernance", type: "address" },
                    { internalType: "address", name: "feeEscrow", type: "address" },
                    {
                        internalType: "contract FeeExemptions",
                        name: "feeExemptions",
                        type: "address",
                    },
                    {
                        internalType: "contract TreasuryActionManager",
                        name: "actionManager",
                        type: "address",
                    },
                    { internalType: "address", name: "bidWall", type: "address" },
                ],
                internalType: "struct AnyPositionManager.ConstructorParams",
                name: "params",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyFlaunched", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotApprovedCreator", type: "error" },
    { inputs: [], name: "CallerIsNotBidWall", type: "error" },
    {
        inputs: [{ internalType: "address", name: "_caller", type: "address" }],
        name: "CallerNotCreator",
        type: "error",
    },
    { inputs: [], name: "CannotBeInitializedDirectly", type: "error" },
    { inputs: [], name: "HookNotImplemented", type: "error" },
    { inputs: [], name: "InvalidPool", type: "error" },
    { inputs: [], name: "LockFailure", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPoolManager", type: "error" },
    { inputs: [], name: "NotSelf", type: "error" },
    { inputs: [], name: "ProtocolFeeInvalid", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "ReferrerFeeInvalid", type: "error" },
    { inputs: [], name: "SwapFeeInvalid", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "UnknownPool",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_creator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_isApproved",
                type: "bool",
            },
        ],
        name: "CreatorApproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_allocation",
                type: "uint24",
            },
        ],
        name: "CreatorFeeAllocationUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FairLaunchFeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "FeeCalculatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "FeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "feeAmount1",
                type: "uint128",
            },
        ],
        name: "HookFee",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "id", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount0",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "int128",
                name: "amount1",
                type: "int128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount0",
                type: "uint128",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "hookLPfeeAmount1",
                type: "uint128",
            },
        ],
        name: "HookSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_initialPrice",
                type: "address",
            },
        ],
        name: "InitialPriceUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoinTreasury",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "_currencyFlipped",
                type: "bool",
            },
            {
                components: [
                    { internalType: "address", name: "memecoin", type: "address" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                indexed: false,
                internalType: "struct AnyPositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "PoolCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                indexed: false,
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "PoolFeeDistributionUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_donateAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_creatorAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_bidWallAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_governanceAmount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolAmount",
                type: "uint256",
            },
        ],
        name: "PoolFeesDistributed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesReceived",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "zeroForOne",
                type: "bool",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount0",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount1",
                type: "uint256",
            },
        ],
        name: "PoolFeesSwapped",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint160",
                name: "_sqrtPriceX96",
                type: "uint160",
            },
            { indexed: false, internalType: "int24", name: "_tick", type: "int24" },
            {
                indexed: false,
                internalType: "uint24",
                name: "_protocolFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint24",
                name: "_swapFee",
                type: "uint24",
            },
            {
                indexed: false,
                internalType: "uint128",
                name: "_liquidity",
                type: "uint128",
            },
        ],
        name: "PoolStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "flFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "ispFee1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniAmount1",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee0",
                type: "int256",
            },
            {
                indexed: false,
                internalType: "int256",
                name: "uniFee1",
                type: "int256",
            },
        ],
        name: "PoolSwap",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "ReferralEscrowUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ReferrerFeePaid",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_PROTOCOL_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MIN_DISTRIBUTE_THRESHOLD",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "actionManager",
        outputs: [
            {
                internalType: "contract TreasuryActionManager",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterAddLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "uint256", name: "_amount0", type: "uint256" },
            { internalType: "uint256", name: "_amount1", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterDonate",
        outputs: [{ internalType: "bytes4", name: "selector_", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
            { internalType: "int24", name: "", type: "int24" },
        ],
        name: "afterInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "BalanceDelta", name: "_feesAccrued", type: "int256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "afterRemoveLiquidity",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "BalanceDelta", name: "", type: "int256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "BalanceDelta", name: "_delta", type: "int256" },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "afterSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            { internalType: "int128", name: "hookDeltaUnspecified_", type: "int128" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_creator", type: "address" },
            { internalType: "bool", name: "_isApproved", type: "bool" },
        ],
        name: "approveCreator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "approvedMemecoinCreator",
        outputs: [{ internalType: "bool", name: "isApproved", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeAddLiquidity",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "uint256", name: "", type: "uint256" },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeDonate",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            { internalType: "uint160", name: "", type: "uint160" },
        ],
        name: "beforeInitialize",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "int24", name: "tickLower", type: "int24" },
                    { internalType: "int24", name: "tickUpper", type: "int24" },
                    { internalType: "int256", name: "liquidityDelta", type: "int256" },
                    { internalType: "bytes32", name: "salt", type: "bytes32" },
                ],
                internalType: "struct IPoolManager.ModifyLiquidityParams",
                name: "",
                type: "tuple",
            },
            { internalType: "bytes", name: "", type: "bytes" },
        ],
        name: "beforeRemoveLiquidity",
        outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_sender", type: "address" },
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            {
                components: [
                    { internalType: "bool", name: "zeroForOne", type: "bool" },
                    { internalType: "int256", name: "amountSpecified", type: "int256" },
                    {
                        internalType: "uint160",
                        name: "sqrtPriceLimitX96",
                        type: "uint160",
                    },
                ],
                internalType: "struct IPoolManager.SwapParams",
                name: "_params",
                type: "tuple",
            },
            { internalType: "bytes", name: "_hookData", type: "bytes" },
        ],
        name: "beforeSwap",
        outputs: [
            { internalType: "bytes4", name: "selector_", type: "bytes4" },
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "uint24", name: "", type: "uint24" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "bidWall",
        outputs: [{ internalType: "contract BidWall", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "fairLaunchFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract FeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "feeExemptions",
        outputs: [
            { internalType: "contract FeeExemptions", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "feeSplit",
        outputs: [
            { internalType: "uint256", name: "bidWall_", type: "uint256" },
            { internalType: "uint256", name: "creator_", type: "uint256" },
            { internalType: "uint256", name: "protocol_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "address", name: "memecoin", type: "address" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct AnyPositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "flaunchContract",
        outputs: [
            { internalType: "contract IAnyFlaunch", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "flayGovernance",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bool", name: "_isFairLaunch", type: "bool" }],
        name: "getFeeCalculator",
        outputs: [
            { internalType: "contract IFeeCalculator", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes", name: "_initialPriceParams", type: "bytes" },
        ],
        name: "getFlaunchingMarketCap",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getHookPermissions",
        outputs: [
            {
                components: [
                    { internalType: "bool", name: "beforeInitialize", type: "bool" },
                    { internalType: "bool", name: "afterInitialize", type: "bool" },
                    { internalType: "bool", name: "beforeAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterAddLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "afterRemoveLiquidity", type: "bool" },
                    { internalType: "bool", name: "beforeSwap", type: "bool" },
                    { internalType: "bool", name: "afterSwap", type: "bool" },
                    { internalType: "bool", name: "beforeDonate", type: "bool" },
                    { internalType: "bool", name: "afterDonate", type: "bool" },
                    { internalType: "bool", name: "beforeSwapReturnDelta", type: "bool" },
                    { internalType: "bool", name: "afterSwapReturnDelta", type: "bool" },
                    {
                        internalType: "bool",
                        name: "afterAddLiquidityReturnDelta",
                        type: "bool",
                    },
                    {
                        internalType: "bool",
                        name: "afterRemoveLiquidityReturnDelta",
                        type: "bool",
                    },
                ],
                internalType: "struct Hooks.Permissions",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "getPoolFeeDistribution",
        outputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "feeDistribution_",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "initialPrice",
        outputs: [
            { internalType: "contract IInitialPrice", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "notifier",
        outputs: [{ internalType: "contract Notifier", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
        ],
        name: "poolFees",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "amount0", type: "uint256" },
                    { internalType: "uint256", name: "amount1", type: "uint256" },
                ],
                internalType: "struct InternalSwapPool.ClaimableFees",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_token", type: "address" }],
        name: "poolKey",
        outputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "referralEscrow",
        outputs: [
            { internalType: "contract ReferralEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFairLaunchFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract IFeeCalculator",
                name: "_feeCalculator",
                type: "address",
            },
        ],
        name: "setFeeCalculator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunchContract", type: "address" },
        ],
        name: "setFlaunch",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_initialPrice", type: "address" },
        ],
        name: "setInitialPrice",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            {
                components: [
                    { internalType: "uint24", name: "swapFee", type: "uint24" },
                    { internalType: "uint24", name: "referrer", type: "uint24" },
                    { internalType: "uint24", name: "protocol", type: "uint24" },
                    { internalType: "bool", name: "active", type: "bool" },
                ],
                internalType: "struct FeeDistributor.FeeDistribution",
                name: "_feeDistribution",
                type: "tuple",
            },
        ],
        name: "setPoolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint24", name: "_protocol", type: "uint24" }],
        name: "setProtocolFeeDistribution",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_referralEscrow",
                type: "address",
            },
        ],
        name: "setReferralEscrow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "unlockCallback",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

class ReadAnyPositionManager {
    constructor(address, drift = createDrift$1()) {
        this.TOTAL_SUPPLY = 100n * 10n ** 27n; // 100 Billion tokens in wei
        this.drift = drift;
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: AnyPositionManagerAbi,
            address,
        });
    }
    async isValidCoin(coinAddress) {
        const poolKey = await this.contract.read("poolKey", {
            _token: coinAddress,
        });
        return poolKey.tickSpacing !== 0;
    }
    async getFlaunchingFee(params) {
        return 0n;
    }
    async watchPoolCreated({ onPoolCreated, startBlockNumber, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolCreated({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolCreated", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        return {
                            ...log,
                            timestamp: Number(block?.timestamp) * 1000, // convert to ms for js
                        };
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolCreated({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolCreated({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolCreatedNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolCreatedNow = undefined;
            },
            pollPoolCreatedNow: pollEvents,
        };
    }
    async watchPoolSwap({ onPoolSwap, flETHIsCurrencyZero, startBlockNumber, filterByPoolId, }) {
        let intervalId;
        if (startBlockNumber !== undefined) {
            onPoolSwap({
                logs: [],
                isFetchingFromStart: true,
            });
        }
        let lastBlockNumber = startBlockNumber
            ? startBlockNumber - 1n
            : await this.drift.getBlockNumber();
        const pollEvents = async () => {
            try {
                const currentBlockNumber = await this.drift.getBlockNumber();
                if (currentBlockNumber > lastBlockNumber) {
                    const _logs = await this.contract.getEvents("PoolSwap", {
                        fromBlock: lastBlockNumber + 1n,
                        toBlock: currentBlockNumber,
                        filter: {
                            poolId: filterByPoolId,
                        },
                    });
                    // Get timestamps for each log
                    const logsWithTimestamps = await Promise.all([..._logs].reverse().map(async (log) => {
                        const block = await this.drift.getBlock(log.blockNumber);
                        const timestamp = Number(block?.timestamp) * 1000; // convert to ms for js
                        if (flETHIsCurrencyZero === undefined) {
                            return {
                                ...log,
                                timestamp,
                            };
                        }
                        const { flAmount0, flAmount1, flFee0, flFee1, ispAmount0, ispAmount1, ispFee0, ispFee1, uniAmount0, uniAmount1, uniFee0, uniFee1, } = log.args;
                        const currency0Delta = flAmount0 + ispAmount0 + uniAmount0;
                        const currency1Delta = flAmount1 + ispAmount1 + uniAmount1;
                        const currency0Fees = flFee0 + ispFee0 + uniFee0;
                        const currency1Fees = flFee1 + ispFee1 + uniFee1;
                        let feesIsInFLETH;
                        let swapType;
                        if (flETHIsCurrencyZero) {
                            swapType = currency0Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency0Fees < 0;
                        }
                        else {
                            swapType = currency1Delta < 0 ? "BUY" : "SELL";
                            feesIsInFLETH = currency1Fees < 0;
                        }
                        const absCurrency0Delta = currency0Delta < 0 ? -currency0Delta : currency0Delta;
                        const absCurrency1Delta = currency1Delta < 0 ? -currency1Delta : currency1Delta;
                        const absCurrency0Fees = currency0Fees < 0 ? -currency0Fees : currency0Fees;
                        const absCurrency1Fees = currency1Fees < 0 ? -currency1Fees : currency1Fees;
                        const fees = {
                            isInFLETH: feesIsInFLETH,
                            amount: flETHIsCurrencyZero
                                ? feesIsInFLETH
                                    ? absCurrency0Fees
                                    : absCurrency1Fees
                                : feesIsInFLETH
                                    ? absCurrency1Fees
                                    : absCurrency0Fees,
                        };
                        if (swapType === "BUY") {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsBought: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHSold: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                        else {
                            return {
                                ...log,
                                timestamp,
                                type: swapType,
                                delta: {
                                    coinsSold: flETHIsCurrencyZero
                                        ? absCurrency1Delta - (!fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency0Delta -
                                            (!fees.isInFLETH ? fees.amount : 0n),
                                    flETHBought: flETHIsCurrencyZero
                                        ? absCurrency0Delta - (fees.isInFLETH ? fees.amount : 0n)
                                        : absCurrency1Delta - (fees.isInFLETH ? fees.amount : 0n),
                                    fees,
                                },
                            };
                        }
                    }));
                    if (logsWithTimestamps.length > 0) {
                        onPoolSwap({
                            logs: logsWithTimestamps,
                            isFetchingFromStart: false,
                        });
                    }
                    else {
                        onPoolSwap({
                            logs: [],
                            isFetchingFromStart: false,
                        });
                    }
                    lastBlockNumber = currentBlockNumber;
                }
            }
            catch (error) {
                console.error("Error polling events:", error);
            }
        };
        intervalId = setInterval(pollEvents, 5000);
        this.pollPoolSwapNow = pollEvents;
        // Return both cleanup function and immediate poll function
        return {
            cleanup: () => {
                if (intervalId) {
                    clearInterval(intervalId);
                }
                // Clear the pollNow function when cleaning up
                this.pollPoolSwapNow = undefined;
            },
            pollPoolSwapNow: pollEvents,
        };
    }
}
class ReadWriteAnyPositionManager extends ReadAnyPositionManager {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    async flaunch({ memecoin, initialMarketCapUSD, creator, creatorFeeAllocationPercent, }) {
        const initialMCapInUSDCWei = parseUnits(initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const creatorFeeAllocationInBps = creatorFeeAllocationPercent * 100;
        return this.contract.write("flaunch", {
            _params: {
                memecoin,
                creator,
                creatorFeeAllocation: creatorFeeAllocationInBps,
                initialPriceParams,
                feeCalculatorParams: "0x",
            },
        }, {
            onMined: async () => {
                if (this.pollPoolCreatedNow) {
                    await this.pollPoolCreatedNow();
                }
            },
        });
    }
}

const FeeEscrowAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_indexer", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "InvalidRecipient", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "PoolIdNotIndexed", type: "error" },
    { inputs: [], name: "RecipientZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_payee",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Deposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "Withdrawal",
        type: "event",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "allocateFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "indexer",
        outputs: [
            { internalType: "contract IndexerSubscriber", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_indexer", type: "address" }],
        name: "setIndexer",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "totalFeesAllocated",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_recipient", type: "address" },
            { internalType: "bool", name: "_unwrap", type: "bool" },
        ],
        name: "withdrawFees",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

/**
 * Client for interacting with the FeeEscrow contract in read-only mode
 * Provides methods to query fee balances and withdraw fees
 */
class ReadFeeEscrow {
    /**
     * Creates a new ReadFeeEscrow instance
     * @param address - The address of the FeeEscrow contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FeeEscrowAbi,
            address,
        });
    }
    /**
     * Gets the claimable balance of fees for a creator
     * @param creator - The address of the creator to check
     * @returns Promise<bigint> - The claimable balance of fees
     */
    balances(creator) {
        return this.contract.read("balances", {
            _recipient: creator,
        });
    }
}
/**
 * Extended client for interacting with the FeeEscrow contract with write capabilities
 * Provides methods to withdraw fees
 */
class ReadWriteFeeEscrow extends ReadFeeEscrow {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    /**
     * Withdraws fees as ETH to a recipient
     * @param recipient - The address to receive the fees
     * @param unwrap - Whether to unwrap the native token before sending
     * @returns Promise<void>
     */
    withdrawFees(recipient) {
        return this.contract.write("withdrawFees", {
            _recipient: recipient,
            _unwrap: true,
        });
    }
}

const ReferralEscrowAbi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_positionManager", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "MismatchedTokensAndLimits", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "TokensAssigned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "TokensClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_user",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_token",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenIn",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_ethOut",
                type: "uint256",
            },
        ],
        name: "TokensSwapped",
        type: "event",
    },
    {
        inputs: [
            { internalType: "address", name: "_user", type: "address" },
            { internalType: "address", name: "_token", type: "address" },
        ],
        name: "allocations",
        outputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "address", name: "_user", type: "address" },
            { internalType: "address", name: "_token", type: "address" },
            { internalType: "uint256", name: "_amount", type: "uint256" },
        ],
        name: "assignTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "_tokens", type: "address[]" },
            {
                internalType: "uint160[]",
                name: "_sqrtPriceX96Limits",
                type: "uint160[]",
            },
            { internalType: "address payable", name: "_recipient", type: "address" },
        ],
        name: "claimAndSwap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address[]", name: "_tokens", type: "address[]" },
            { internalType: "address payable", name: "_recipient", type: "address" },
        ],
        name: "claimTokens",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolSwap",
        outputs: [{ internalType: "contract PoolSwap", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_poolSwap", type: "address" }],
        name: "setPoolSwap",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

/**
 * Client for interacting with the ReferralEscrow contract in read-only mode
 * Provides methods to query token allocations
 */
class ReadReferralEscrow {
    /**
     * Creates a new ReadReferralEscrow instance
     * @param address - The address of the ReferralEscrow contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: ReferralEscrowAbi,
            address,
        });
    }
    /**
     * Gets the token allocation for a specific user and token
     * @param user - The address of the user to check
     * @param token - The address of the token
     * @returns Promise<bigint> - The allocated token amount
     */
    allocations(user, token) {
        return this.contract.read("allocations", {
            _user: user,
            _token: token,
        });
    }
}
/**
 * Extended client for interacting with the ReferralEscrow contract with write capabilities
 * Provides methods to claim tokens
 */
class ReadWriteReferralEscrow extends ReadReferralEscrow {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    /**
     * Claims tokens for a recipient
     * @param tokens - Array of token addresses to claim
     * @param recipient - The address to receive the claimed tokens
     * @returns Promise<void>
     */
    claimTokens(tokens, recipient) {
        return this.contract.write("claimTokens", {
            _tokens: tokens,
            _recipient: recipient,
        });
    }
}

const BidWallV1_1Abi = [
    {
        inputs: [
            { internalType: "address", name: "_nativeToken", type: "address" },
            { internalType: "address", name: "_poolManager", type: "address" },
            { internalType: "address", name: "_protocolOwner", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "CallerIsNotCreator", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
        ],
        name: "BidWallClosed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_added",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_pending",
                type: "uint256",
            },
        ],
        name: "BidWallDeposit",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            { indexed: false, internalType: "bool", name: "_disabled", type: "bool" },
        ],
        name: "BidWallDisabledStateUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_eth",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickLower",
                type: "int24",
            },
            {
                indexed: false,
                internalType: "int24",
                name: "_tickUpper",
                type: "int24",
            },
        ],
        name: "BidWallRepositioned",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
        ],
        name: "BidWallRewardsTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_newSwapFeeThreshold",
                type: "uint256",
            },
        ],
        name: "FixedSwapFeeThresholdUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_staleTimeWindow",
                type: "uint256",
            },
        ],
        name: "StaleTimeWindowUpdated",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "checkStalePosition",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
        ],
        name: "closeBidWall",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_ethSwapAmount", type: "uint256" },
            { internalType: "int24", name: "_currentTick", type: "int24" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "isBidWallEnabled",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "lastPoolTransaction",
        outputs: [{ internalType: "uint256", name: "_timestamp", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nativeToken",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "poolInfo",
        outputs: [
            { internalType: "bool", name: "disabled", type: "bool" },
            { internalType: "bool", name: "initialized", type: "bool" },
            { internalType: "int24", name: "tickLower", type: "int24" },
            { internalType: "int24", name: "tickUpper", type: "int24" },
            { internalType: "uint256", name: "pendingETHFees", type: "uint256" },
            { internalType: "uint256", name: "cumulativeSwapFees", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "position",
        outputs: [
            { internalType: "uint256", name: "amount0_", type: "uint256" },
            { internalType: "uint256", name: "amount1_", type: "uint256" },
            { internalType: "uint256", name: "pendingEth_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_key",
                type: "tuple",
            },
            { internalType: "bool", name: "_disable", type: "bool" },
        ],
        name: "setDisabledState",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_staleTimeWindow", type: "uint256" },
        ],
        name: "setStaleTimeWindow",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "swapFeeThreshold", type: "uint256" },
        ],
        name: "setSwapFeeThreshold",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "staleTimeWindow",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

/**
 * Client for interacting with the BidWall V1.1 contract in read-only mode
 * Provides methods to query bid wall positions and pool information
 * Enhanced version of the V1 contract with additional features
 */
class ReadBidWallV1_1 {
    /**
     * Creates a new ReadBidWallV1_1 instance
     * @param address - The address of the BidWall V1.1 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: BidWallV1_1Abi,
            address,
        });
    }
    /**
     * Gets information about a bid wall position for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{amount0_: bigint, amount1_: bigint, pendingEth_: bigint}> - Position details including token amounts and pending ETH
     */
    position({ poolId }) {
        return this.contract.read("position", {
            _poolId: poolId,
        });
    }
    /**
     * Gets configuration information about a pool's bid wall
     * @param poolId - The ID of the pool
     * @returns Promise<{tickLower: number, tickUpper: number}> - Pool configuration including tick range
     */
    poolInfo({ poolId }) {
        return this.contract.read("poolInfo", {
            _poolId: poolId,
        });
    }
}

const FairLaunchV1_1Abi = [
    {
        inputs: [
            {
                internalType: "contract IPoolManager",
                name: "_poolManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "CannotModifyLiquidityDuringFairLaunch", type: "error" },
    { inputs: [], name: "CannotSellTokenDuringFairLaunch", type: "error" },
    { inputs: [], name: "NotPositionManager", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokens",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_startsAt",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endsAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchCreated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "PoolId",
                name: "_poolId",
                type: "bytes32",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_revenue",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_supply",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_endedAt",
                type: "uint256",
            },
        ],
        name: "FairLaunchEnded",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "uint256", name: "_tokenFees", type: "uint256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "closePosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int24", name: "_initialTick", type: "int24" },
            { internalType: "uint256", name: "_flaunchesAt", type: "uint256" },
            {
                internalType: "uint256",
                name: "_initialTokenFairLaunch",
                type: "uint256",
            },
            { internalType: "uint256", name: "_fairLaunchDuration", type: "uint256" },
        ],
        name: "createPosition",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "fairLaunchInfo",
        outputs: [
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "Currency", name: "currency0", type: "address" },
                    { internalType: "Currency", name: "currency1", type: "address" },
                    { internalType: "uint24", name: "fee", type: "uint24" },
                    { internalType: "int24", name: "tickSpacing", type: "int24" },
                    { internalType: "contract IHooks", name: "hooks", type: "address" },
                ],
                internalType: "struct PoolKey",
                name: "_poolKey",
                type: "tuple",
            },
            { internalType: "int256", name: "_amountSpecified", type: "int256" },
            { internalType: "bool", name: "_nativeIsZero", type: "bool" },
        ],
        name: "fillFromPosition",
        outputs: [
            {
                internalType: "BeforeSwapDelta",
                name: "beforeSwapDelta_",
                type: "int256",
            },
            { internalType: "BalanceDelta", name: "balanceDelta_", type: "int256" },
            {
                components: [
                    { internalType: "uint256", name: "startsAt", type: "uint256" },
                    { internalType: "uint256", name: "endsAt", type: "uint256" },
                    { internalType: "int24", name: "initialTick", type: "int24" },
                    { internalType: "uint256", name: "revenue", type: "uint256" },
                    { internalType: "uint256", name: "supply", type: "uint256" },
                    { internalType: "bool", name: "closed", type: "bool" },
                ],
                internalType: "struct FairLaunch.FairLaunchInfo",
                name: "fairLaunchInfo_",
                type: "tuple",
            },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        name: "inFairLaunchWindow",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "PoolId", name: "_poolId", type: "bytes32" },
            { internalType: "int256", name: "_revenue", type: "int256" },
        ],
        name: "modifyRevenue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "poolManager",
        outputs: [
            { internalType: "contract IPoolManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
];

/**
 * Client for interacting with the FairLaunch V1.1 contract in read-only mode
 * Provides methods to query fair launch information and status
 * Enhanced version of the V1 contract with additional features like variable duration
 */
class ReadFairLaunchV1_1 {
    /**
     * Creates a new ReadFairLaunchV1_1 instance
     * @param address - The address of the FairLaunch V1.1 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FairLaunchV1_1Abi,
            address,
        });
    }
    /**
     * Gets information about a fair launch for a specific pool
     * @param poolId - The ID of the pool
     * @returns Promise<{initialTick: number, closed: boolean, startsAt: number, endsAt: number}> - Fair launch details
     */
    fairLaunchInfo({ poolId }) {
        return this.contract.read("fairLaunchInfo", {
            _poolId: poolId,
        });
    }
    /**
     * Calculates the duration of a fair launch
     * @param poolId - The ID of the pool
     * @returns Promise<number> - The duration in seconds between start and end time
     */
    async fairLaunchDuration({ poolId }) {
        const { startsAt, endsAt } = await this.fairLaunchInfo({ poolId });
        return endsAt - startsAt;
    }
    /**
     * Checks if a fair launch is currently active
     * @param poolId - The ID of the pool
     * @returns Promise<boolean> - True if the fair launch is active (not closed and not expired), false otherwise
     */
    async isFairLaunchActive({ poolId }) {
        const { closed, endsAt } = await this.fairLaunchInfo({ poolId });
        if (closed) {
            return false;
        }
        if (new Date().getTime() / 1000 > endsAt) {
            return false;
        }
        return true;
    }
}

const FlaunchV1_1Abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_memecoinImplementation",
                type: "address",
            },
            { internalType: "string", name: "_baseURI", type: "string" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccountBalanceOverflow", type: "error" },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "BalanceQueryForZeroAddress", type: "error" },
    { inputs: [], name: "CallerIsNotPositionManager", type: "error" },
    { inputs: [], name: "CallerNotL2ToL2CrossDomainMessenger", type: "error" },
    {
        inputs: [
            { internalType: "uint24", name: "_allocation", type: "uint24" },
            { internalType: "uint256", name: "_maxAllocation", type: "uint256" },
        ],
        name: "CreatorFeeAllocationInvalid",
        type: "error",
    },
    { inputs: [], name: "InvalidCrossDomainSender", type: "error" },
    { inputs: [], name: "InvalidDestinationChain", type: "error" },
    { inputs: [], name: "InvalidFlaunchSchedule", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "InvalidInitialSupply",
        type: "error",
    },
    { inputs: [], name: "InvalidInitialization", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "NotInitializing", type: "error" },
    { inputs: [], name: "NotOwnerNorApproved", type: "error" },
    {
        inputs: [
            { internalType: "uint256", name: "_buyAmount", type: "uint256" },
            { internalType: "uint256", name: "_initialSupply", type: "uint256" },
        ],
        name: "PremineExceedsInitialAmount",
        type: "error",
    },
    { inputs: [], name: "TokenAlreadyBridged", type: "error" },
    { inputs: [], name: "TokenAlreadyExists", type: "error" },
    { inputs: [], name: "TokenDoesNotExist", type: "error" },
    { inputs: [], name: "TransferFromIncorrectOwner", type: "error" },
    { inputs: [], name: "TransferToNonERC721ReceiverImplementer", type: "error" },
    { inputs: [], name: "TransferToZeroAddress", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownMemecoin", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Approval",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "owner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "operator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "bool",
                name: "isApproved",
                type: "bool",
            },
        ],
        name: "ApprovalForAll",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint64",
                name: "version",
                type: "uint64",
            },
        ],
        name: "Initialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_messageSource",
                type: "uint256",
            },
        ],
        name: "TokenBridged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_chainId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_memecoin",
                type: "address",
            },
        ],
        name: "TokenBridging",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "from", type: "address" },
            { indexed: true, internalType: "address", name: "to", type: "address" },
            { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "Transfer",
        type: "event",
    },
    {
        inputs: [],
        name: "MAX_CREATOR_ALLOCATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_FAIR_LAUNCH_TOKENS",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "MAX_SCHEDULE_DURATION",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "approve",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "baseURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "bridgingStatus",
        outputs: [{ internalType: "bool", name: "_started", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                ],
                internalType: "struct Flaunch.MemecoinMetadata",
                name: "_metadata",
                type: "tuple",
            },
        ],
        name: "finalizeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    {
                        internalType: "uint256",
                        name: "initialTokenFairLaunch",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "fairLaunchDuration",
                        type: "uint256",
                    },
                    { internalType: "uint256", name: "premineAmount", type: "uint256" },
                    { internalType: "address", name: "creator", type: "address" },
                    {
                        internalType: "uint24",
                        name: "creatorFeeAllocation",
                        type: "uint24",
                    },
                    { internalType: "uint256", name: "flaunchAt", type: "uint256" },
                    { internalType: "bytes", name: "initialPriceParams", type: "bytes" },
                    { internalType: "bytes", name: "feeCalculatorParams", type: "bytes" },
                ],
                internalType: "struct PositionManager.FlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [
            { internalType: "address", name: "memecoin_", type: "address" },
            {
                internalType: "address payable",
                name: "memecoinTreasury_",
                type: "address",
            },
            { internalType: "uint256", name: "tokenId_", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "getApproved",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
            {
                internalType: "address",
                name: "_memecoinTreasuryImplementation",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
            { internalType: "uint256", name: "_chainId", type: "uint256" },
        ],
        name: "initializeBridge",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "operator", type: "address" },
        ],
        name: "isApprovedForAll",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoin",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "memecoinTreasury",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "memecoinTreasuryImplementation",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextTokenId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
        name: "ownerOf",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "poolId",
        outputs: [{ internalType: "PoolId", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
            { internalType: "bytes", name: "data", type: "bytes" },
        ],
        name: "safeTransferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "operator", type: "address" },
            { internalType: "bool", name: "isApproved", type: "bool" },
        ],
        name: "setApprovalForAll",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "string", name: "_baseURI", type: "string" }],
        name: "setBaseURI",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_memecoin", type: "address" },
            { internalType: "string", name: "name_", type: "string" },
            { internalType: "string", name: "symbol_", type: "string" },
        ],
        name: "setMemecoinMetadata",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "result", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_memecoin", type: "address" }],
        name: "tokenId",
        outputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_tokenId", type: "uint256" }],
        name: "tokenURI",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "from", type: "address" },
            { internalType: "address", name: "to", type: "address" },
            { internalType: "uint256", name: "id", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
];

/**
 * Client for interacting with the Flaunch V1.1 contract in read-only mode
 * Provides methods to query token IDs and metadata URIs
 * Enhanced version of the V1 contract with additional features
 */
class ReadFlaunchV1_1 {
    /**
     * Creates a new ReadFlaunchV1_1 instance
     * @param address - The address of the Flaunch V1.1 contract
     * @param drift - Optional drift instance for contract interactions (creates new instance if not provided)
     * @throws Error if address is not provided
     */
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: FlaunchV1_1Abi,
            address,
        });
    }
    /**
     * Gets the token ID associated with a memecoin
     * @param coinAddress - The address of the memecoin
     * @returns Promise<bigint> - The token ID
     */
    tokenId(coinAddress) {
        return this.contract.read("tokenId", {
            _memecoin: coinAddress,
        });
    }
    /**
     * Gets the metadata URI for a token
     * @param tokenId - The ID of the token
     * @returns Promise<string> - The token's metadata URI
     */
    tokenURI(tokenId) {
        return this.contract.read("tokenURI", {
            _tokenId: tokenId,
        });
    }
}

const TreasuryManagerFactoryAbi = [
    {
        inputs: [
            { internalType: "address", name: "_protocolOwner", type: "address" },
            { internalType: "address", name: "_feeEscrow", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AccessControlBadConfirmation", type: "error" },
    {
        inputs: [
            { internalType: "address", name: "account", type: "address" },
            { internalType: "bytes32", name: "neededRole", type: "bytes32" },
        ],
        name: "AccessControlUnauthorizedAccount",
        type: "error",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "NewOwnerIsZeroAddress", type: "error" },
    { inputs: [], name: "NoHandoverRequest", type: "error" },
    { inputs: [], name: "Unauthorized", type: "error" },
    { inputs: [], name: "UnknownManagerImplemention", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_manager",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerDeployed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerImplementationApproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "ManagerImplementationUnapproved",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverCanceled",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "pendingOwner",
                type: "address",
            },
        ],
        name: "OwnershipHandoverRequested",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "oldOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "bytes32",
                name: "previousAdminRole",
                type: "bytes32",
            },
            {
                indexed: true,
                internalType: "bytes32",
                name: "newAdminRole",
                type: "bytes32",
            },
        ],
        name: "RoleAdminChanged",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleGranted",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "bytes32", name: "role", type: "bytes32" },
            {
                indexed: true,
                internalType: "address",
                name: "account",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "sender",
                type: "address",
            },
        ],
        name: "RoleRevoked",
        type: "event",
    },
    {
        inputs: [],
        name: "DEFAULT_ADMIN_ROLE",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "approveManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "approvedManagerImplementation",
        outputs: [{ internalType: "bool", name: "_approved", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "cancelOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "completeOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "deployAndInitializeManager",
        outputs: [
            { internalType: "address payable", name: "manager_", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "deployManager",
        outputs: [
            { internalType: "address payable", name: "manager_", type: "address" },
        ],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "feeEscrow",
        outputs: [
            { internalType: "contract IFeeEscrow", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes32", name: "role", type: "bytes32" }],
        name: "getRoleAdmin",
        outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "grantRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "hasRole",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_manager", type: "address" }],
        name: "managerImplementation",
        outputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [{ internalType: "address", name: "result", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "pendingOwner", type: "address" },
        ],
        name: "ownershipHandoverExpiresAt",
        outputs: [{ internalType: "uint256", name: "result", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "callerConfirmation", type: "address" },
        ],
        name: "renounceRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestOwnershipHandover",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "bytes32", name: "role", type: "bytes32" },
            { internalType: "address", name: "account", type: "address" },
        ],
        name: "revokeRole",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
        name: "supportsInterface",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_managerImplementation",
                type: "address",
            },
        ],
        name: "unapproveManager",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
];

class ReadTreasuryManagerFactory {
    constructor(address, drift = createDrift$1()) {
        if (!address) {
            throw new Error("Address is required");
        }
        this.contract = drift.contract({
            abi: TreasuryManagerFactoryAbi,
            address,
        });
    }
}
class ReadWriteTreasuryManagerFactory extends ReadTreasuryManagerFactory {
    constructor(chainId, address, drift = createDrift$1()) {
        super(address, drift);
        this.chainId = chainId;
    }
    /**
     * Deploys a new revenue manager
     * @param params - Parameters for deploying the revenue manager
     * @param params.protocolRecipient - The address of the protocol recipient
     * @param params.protocolFeePercent - The percentage of the protocol fee
     * @returns Transaction response
     */
    deployRevenueManager(params) {
        return this.contract.write("deployAndInitializeManager", {
            _managerImplementation: RevenueManagerAddress[this.chainId],
            _owner: params.protocolRecipient,
            _data: encodeAbiParameters([
                {
                    type: "tuple",
                    components: [
                        { type: "address", name: "protocolRecipient" },
                        { type: "uint256", name: "protocolFee" },
                    ],
                },
            ], [
                {
                    protocolRecipient: params.protocolRecipient,
                    protocolFee: BigInt(params.protocolFeePercent * 100), // Convert percentage to basis points
                },
            ]),
        });
    }
}

const RevenueManagerAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "_treasuryManagerFactory",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    { inputs: [], name: "AlreadyInitialized", type: "error" },
    { inputs: [], name: "FailedToClaim", type: "error" },
    { inputs: [], name: "FlaunchContractNotValid", type: "error" },
    { inputs: [], name: "InvalidClaimer", type: "error" },
    { inputs: [], name: "InvalidCreatorAddress", type: "error" },
    { inputs: [], name: "InvalidProtocolFee", type: "error" },
    { inputs: [], name: "NotInitialized", type: "error" },
    { inputs: [], name: "NotManagerOwner", type: "error" },
    {
        inputs: [{ internalType: "uint256", name: "_unlockedAt", type: "uint256" }],
        name: "TokenTimelocked",
        type: "error",
    },
    { inputs: [], name: "UnknownFlaunchToken", type: "error" },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_creator",
                type: "address",
            },
        ],
        name: "CreatorUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                components: [
                    {
                        internalType: "address payable",
                        name: "protocolRecipient",
                        type: "address",
                    },
                    { internalType: "uint256", name: "protocolFee", type: "uint256" },
                ],
                indexed: false,
                internalType: "struct RevenueManager.InitializeParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "ManagerInitialized",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "_newOwner",
                type: "address",
            },
        ],
        name: "ManagerOwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "_protocolFee",
                type: "uint256",
            },
        ],
        name: "ProtocolFeeUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_protocolRecipient",
                type: "address",
            },
        ],
        name: "ProtocolRecipientUpdated",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "ProtocolRevenueClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_amount",
                type: "uint256",
            },
        ],
        name: "RevenueClaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_owner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
        ],
        name: "TreasuryEscrowed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_sender",
                type: "address",
            },
            {
                indexed: false,
                internalType: "address",
                name: "_recipient",
                type: "address",
            },
        ],
        name: "TreasuryReclaimed",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "_flaunch",
                type: "address",
            },
            {
                indexed: true,
                internalType: "uint256",
                name: "_tokenId",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "_unlockedAt",
                type: "uint256",
            },
        ],
        name: "TreasuryTimelocked",
        type: "event",
    },
    {
        inputs: [{ internalType: "address", name: "_recipient", type: "address" }],
        name: "balances",
        outputs: [{ internalType: "uint256", name: "balance_", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "claim",
        outputs: [{ internalType: "uint256", name: "amount_", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken[]",
                name: "_flaunchToken",
                type: "tuple[]",
            },
        ],
        name: "claim",
        outputs: [{ internalType: "uint256", name: "amount_", type: "uint256" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "creator",
        outputs: [{ internalType: "address", name: "_creator", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "creatorTotalClaimed",
        outputs: [{ internalType: "uint256", name: "_claimed", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address", name: "_creator", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "flaunchTokenInternalIds",
        outputs: [
            { internalType: "uint256", name: "_internalId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
        ],
        name: "getPoolId",
        outputs: [{ internalType: "PoolId", name: "poolId_", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_amount", type: "uint256" }],
        name: "getProtocolFee",
        outputs: [
            { internalType: "uint256", name: "protocolFee_", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_owner", type: "address" },
            { internalType: "bytes", name: "_data", type: "bytes" },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "initialized",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_internalId", type: "uint256" }],
        name: "internalIds",
        outputs: [
            { internalType: "contract Flaunch", name: "flaunch", type: "address" },
            { internalType: "uint256", name: "tokenId", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "managerOwner",
        outputs: [{ internalType: "address", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "nextInternalId",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolFee",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolRecipient",
        outputs: [{ internalType: "address payable", name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "protocolTotalClaimed",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address", name: "_recipient", type: "address" },
        ],
        name: "rescue",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken",
                name: "_flaunchToken",
                type: "tuple",
            },
            { internalType: "address payable", name: "_creator", type: "address" },
        ],
        name: "setCreator",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address payable",
                name: "_protocolRecipient",
                type: "address",
            },
        ],
        name: "setProtocolRecipient",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "uint256", name: "_internalId", type: "uint256" }],
        name: "tokenPoolId",
        outputs: [{ internalType: "PoolId", name: "_poolId", type: "bytes32" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenTimelock",
        outputs: [
            { internalType: "uint256", name: "_unlockedAt", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_flaunch", type: "address" },
            { internalType: "uint256", name: "_tokenId", type: "uint256" },
        ],
        name: "tokenTotalClaimed",
        outputs: [{ internalType: "uint256", name: "_claimed", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "_creator", type: "address" }],
        name: "tokens",
        outputs: [
            {
                components: [
                    {
                        internalType: "contract Flaunch",
                        name: "flaunch",
                        type: "address",
                    },
                    { internalType: "uint256", name: "tokenId", type: "uint256" },
                ],
                internalType: "struct ITreasuryManager.FlaunchToken[]",
                name: "flaunchTokens_",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "_newManagerOwner", type: "address" },
        ],
        name: "transferManagerOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "treasuryManagerFactory",
        outputs: [
            {
                internalType: "contract TreasuryManagerFactory",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    { stateMutability: "payable", type: "receive" },
];

const MulticallAbi = [
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes[]",
                name: "returnData",
                type: "bytes[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bool",
                        name: "allowFailure",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call3[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate3",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bool",
                        name: "allowFailure",
                        type: "bool",
                    },
                    {
                        internalType: "uint256",
                        name: "value",
                        type: "uint256",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call3Value[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate3Value",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "blockAndAggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [],
        name: "getBasefee",
        outputs: [
            {
                internalType: "uint256",
                name: "basefee",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
        ],
        name: "getBlockHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getBlockNumber",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getChainId",
        outputs: [
            {
                internalType: "uint256",
                name: "chainid",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockCoinbase",
        outputs: [
            {
                internalType: "address",
                name: "coinbase",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockDifficulty",
        outputs: [
            {
                internalType: "uint256",
                name: "difficulty",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockGasLimit",
        outputs: [
            {
                internalType: "uint256",
                name: "gaslimit",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getCurrentBlockTimestamp",
        outputs: [
            {
                internalType: "uint256",
                name: "timestamp",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "addr",
                type: "address",
            },
        ],
        name: "getEthBalance",
        outputs: [
            {
                internalType: "uint256",
                name: "balance",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getLastBlockHash",
        outputs: [
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "requireSuccess",
                type: "bool",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "tryAggregate",
        outputs: [
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bool",
                name: "requireSuccess",
                type: "bool",
            },
            {
                components: [
                    {
                        internalType: "address",
                        name: "target",
                        type: "address",
                    },
                    {
                        internalType: "bytes",
                        name: "callData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Call[]",
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "tryBlockAndAggregate",
        outputs: [
            {
                internalType: "uint256",
                name: "blockNumber",
                type: "uint256",
            },
            {
                internalType: "bytes32",
                name: "blockHash",
                type: "bytes32",
            },
            {
                components: [
                    {
                        internalType: "bool",
                        name: "success",
                        type: "bool",
                    },
                    {
                        internalType: "bytes",
                        name: "returnData",
                        type: "bytes",
                    },
                ],
                internalType: "struct Multicall3.Result[]",
                name: "returnData",
                type: "tuple[]",
            },
        ],
        stateMutability: "payable",
        type: "function",
    },
];

class ReadMulticall {
    constructor(drift) {
        // same address across all chains
        this.address = "0xcA11bde05977b3631167028862bE2a173976CA11";
        this.contract = drift.contract({
            abi: MulticallAbi,
            address: this.address,
        });
    }
    aggregate3(calls) {
        return this.contract.simulateWrite("aggregate3", {
            calls: calls.map((call) => ({
                target: call.target,
                allowFailure: true,
                callData: call.callData,
            })),
        });
    }
}

class ReadRevenueManager {
    constructor(address, drift = createDrift$1()) {
        this.drift = drift;
        this.contract = drift.contract({
            abi: RevenueManagerAbi,
            address,
        });
    }
    /**
     * Gets the claimable balance of ETH for the recipient
     * @param recipient - The address of the recipient to check
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    balances(address) {
        return this.contract.read("balances", {
            _recipient: address,
        });
    }
    /**
     * Gets the protocol recipient address
     * @returns Promise<Address> - The protocol recipient address
     */
    protocolRecipient() {
        return this.contract.read("protocolRecipient");
    }
    /**
     * Gets the total number of tokens managed by the revenue manager
     * @returns Promise<bigint> - The total count of tokens
     */
    async tokensCount() {
        const nextInternalId = await this.contract.read("nextInternalId");
        return nextInternalId - 1n;
    }
    /**
     * Gets all tokens created by a specific creator address
     * @param creator - The address of the creator to query tokens for
     * @param sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    async allTokensByCreator(creator, sortByDesc = false) {
        const tokens = await this.contract.read("tokens", {
            _creator: creator,
        });
        if (sortByDesc) {
            return [...tokens].reverse();
        }
        return tokens;
    }
    /**
     * Gets all tokens currently managed by the revenue manager contract
     * @dev Uses multicall to batch requests for better performance
     * @param sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    async allTokensInManager(sortByDesc = false) {
        const count = await this.tokensCount();
        const multicall = new ReadMulticall(this.drift);
        let calldatas = Array.from({ length: Number(count) }, (_, i) => this.contract.encodeFunctionData("internalIds", {
            _internalId: BigInt(i + 1),
        }));
        // Reverse the array if sortByDesc is true
        if (sortByDesc) {
            calldatas = calldatas.reverse();
        }
        const result = await multicall.aggregate3(calldatas.map((calldata) => ({
            target: this.contract.address,
            callData: calldata,
        })));
        return result.map((r) => this.contract.decodeFunctionReturn("internalIds", r.returnData));
    }
}
class ReadWriteRevenueManager extends ReadRevenueManager {
    constructor(address, drift = createDrift$1()) {
        super(address, drift);
    }
    /**
     * Allows the protocol recipient to claim the protocol's share of the revenue
     * @returns Promise<TransactionResponse> - The transaction response
     */
    protocolClaim() {
        return this.contract.write("claim", {});
    }
    /**
     * Allows the creator to claim their total share of the revenue from a revenue manager
     * @returns Promise<TransactionResponse> - The transaction response
     */
    creatorClaim() {
        return this.contract.write("claim", {});
    }
    /**
     * Allows the creator to claim their share of the revenue from specific flaunch tokens
     * @param flaunchTokens - The flaunch token ids to claim the revenue for
     * @returns Promise<TransactionResponse> - The transaction response
     */
    creatorClaimForTokens(flaunchTokens) {
        return this.contract.write("claim", {
            _flaunchToken: flaunchTokens,
        });
    }
}

/**
 * Enumeration of Flaunch contract versions
 */
var FlaunchVersion;
(function (FlaunchVersion) {
    FlaunchVersion["V1"] = "V1";
    FlaunchVersion["V1_1"] = "V1_1";
    FlaunchVersion["V1_1_1"] = "V1_1_1";
    FlaunchVersion["ANY"] = "ANY";
})(FlaunchVersion || (FlaunchVersion = {}));

// our min/max tick range that is valid for the tick spacing (60)
const TickFinder = {
    MIN_TICK: -887220,
    MAX_TICK: 887220,
};
const TICK_SPACING = 60;
const getPoolId = (poolKey) => {
    // Pack the data in the same order as Solidity struct
    const packed = concat([
        pad$1(poolKey.currency0, { size: 32 }), // address padded to 32 bytes
        pad$1(poolKey.currency1, { size: 32 }), // address padded to 32 bytes
        pad$1(toHex$1(poolKey.fee), { size: 32 }), // uint24 padded to 32 bytes
        pad$1(toHex$1(poolKey.tickSpacing), { size: 32 }), // int24 padded to 32 bytes
        pad$1(poolKey.hooks, { size: 32 }), // address padded to 32 bytes
    ]);
    return keccak256$1(packed);
};
const orderPoolKey = (poolKey) => {
    const [currency0, currency1] = poolKey.currency0 < poolKey.currency1
        ? [poolKey.currency0, poolKey.currency1]
        : [poolKey.currency1, poolKey.currency0];
    return {
        ...poolKey,
        currency0,
        currency1,
    };
};
const getValidTick = ({ tick, tickSpacing, roundDown, }) => {
    // If the tick is already valid, exit early
    if (tick % tickSpacing === 0) {
        return tick;
    }
    // Division that rounds towards zero (like Solidity)
    let validTick = Math.trunc(tick / tickSpacing) * tickSpacing;
    // Handle negative ticks (Solidity behavior)
    if (tick < 0 && tick % tickSpacing !== 0) {
        validTick -= tickSpacing;
    }
    // If not rounding down, add TICK_SPACING to get the upper tick
    if (!roundDown) {
        validTick += tickSpacing;
    }
    return validTick;
};
const getAmount0ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    let [sqrtRatioA, sqrtRatioB] = [sqrtRatioAX96, sqrtRatioBX96];
    if (sqrtRatioA > sqrtRatioB) {
        [sqrtRatioA, sqrtRatioB] = [sqrtRatioB, sqrtRatioA];
    }
    const leftShiftedLiquidity = liquidity << 96n;
    const sqrtDiff = sqrtRatioB - sqrtRatioA;
    const multipliedRes = leftShiftedLiquidity * sqrtDiff;
    const numerator = multipliedRes / sqrtRatioB;
    const amount0 = numerator / sqrtRatioA;
    return amount0;
};
const getAmount1ForLiquidity = (sqrtRatioAX96, sqrtRatioBX96, liquidity) => {
    let [sqrtRatioA, sqrtRatioB] = [sqrtRatioAX96, sqrtRatioBX96];
    if (sqrtRatioA > sqrtRatioB) {
        [sqrtRatioA, sqrtRatioB] = [sqrtRatioB, sqrtRatioA];
    }
    const sqrtDiff = sqrtRatioB - sqrtRatioA;
    const multipliedRes = liquidity * sqrtDiff;
    const amount1 = multipliedRes / 2n ** 96n;
    return amount1;
};
const getSqrtPriceX96FromTick = (tick) => {
    return BigInt(TickMath.getSqrtRatioAtTick(tick).toString());
};
const calculateUnderlyingTokenBalances = (liquidity, tickLower, tickUpper, tickCurrent) => {
    const sqrtPriceCurrentX96 = getSqrtPriceX96FromTick(tickCurrent);
    const sqrtPriceLowerX96 = getSqrtPriceX96FromTick(tickLower);
    const sqrtPriceUpperX96 = getSqrtPriceX96FromTick(tickUpper);
    let amount0 = 0n;
    let amount1 = 0n;
    if (sqrtPriceCurrentX96 <= sqrtPriceLowerX96) {
        // Current price is below the position range
        amount0 = getAmount0ForLiquidity(sqrtPriceLowerX96, sqrtPriceUpperX96, liquidity);
    }
    else if (sqrtPriceCurrentX96 < sqrtPriceUpperX96) {
        // Current price is within the position range
        amount0 = getAmount0ForLiquidity(sqrtPriceCurrentX96, sqrtPriceUpperX96, liquidity);
        amount1 = getAmount1ForLiquidity(sqrtPriceLowerX96, sqrtPriceCurrentX96, liquidity);
    }
    else {
        // Current price is above the position range
        amount1 = getAmount1ForLiquidity(sqrtPriceLowerX96, sqrtPriceUpperX96, liquidity);
    }
    return { amount0, amount1 };
};

const chainIdToChain = {
    [base.id]: base,
    [baseSepolia.id]: baseSepolia,
};

const FastFlaunchZapAbi = [
    {
        inputs: [
            {
                internalType: "contract PositionManager",
                name: "_positionManager",
                type: "address",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "CREATOR_FEE_ALLOCATION",
        outputs: [{ internalType: "uint24", name: "", type: "uint24" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "FAIR_LAUNCH_SUPPLY",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "USDC_MARKET_CAP",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                components: [
                    { internalType: "string", name: "name", type: "string" },
                    { internalType: "string", name: "symbol", type: "string" },
                    { internalType: "string", name: "tokenUri", type: "string" },
                    { internalType: "address", name: "creator", type: "address" },
                ],
                internalType: "struct FastFlaunchZap.FastFlaunchParams",
                name: "_params",
                type: "tuple",
            },
        ],
        name: "flaunch",
        outputs: [{ internalType: "address", name: "memecoin_", type: "address" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "positionManager",
        outputs: [
            { internalType: "contract PositionManager", name: "", type: "address" },
        ],
        stateMutability: "view",
        type: "function",
    },
];

/**
 * Base class for interacting with Flaunch protocol in read-only mode
 */
class ReadFlaunchSDK {
    constructor(chainId, drift = createDrift$1()) {
        this.TICK_SPACING = TICK_SPACING;
        this.chainId = chainId;
        this.drift = drift;
        this.resolveIPFS = resolveIPFS;
        this.readPositionManager = new ReadFlaunchPositionManager(FlaunchPositionManagerAddress[this.chainId], drift);
        this.readPositionManagerV1_1 = new ReadFlaunchPositionManagerV1_1(FlaunchPositionManagerV1_1Address[this.chainId], drift);
        this.readAnyPositionManager = new ReadAnyPositionManager(AnyPositionManagerAddress[this.chainId], drift);
        this.readFeeEscrow = new ReadFeeEscrow(FeeEscrowAddress[this.chainId], drift);
        this.readReferralEscrow = new ReadReferralEscrow(ReferralEscrowAddress[this.chainId], drift);
        this.readFlaunchZap = new ReadFlaunchZap(this.chainId, FlaunchZapAddress[this.chainId], drift);
        this.readPoolManager = new ReadPoolManager(PoolManagerAddress[this.chainId], drift);
        this.readStateView = new ReadStateView(StateViewAddress[this.chainId], drift);
        this.readFairLaunch = new ReadFairLaunch(FairLaunchAddress[this.chainId], drift);
        this.readFairLaunchV1_1 = new ReadFairLaunchV1_1(FairLaunchV1_1Address[this.chainId], drift);
        this.readBidWall = new ReadBidWall(BidWallAddress[this.chainId], drift);
        this.readBidWallV1_1 = new ReadBidWallV1_1(BidWallV1_1Address[this.chainId], drift);
        this.readAnyBidWall = new AnyBidWall(AnyBidWallAddress[this.chainId], drift);
        this.readFlaunch = new ReadFlaunch(FlaunchAddress[this.chainId], drift);
        this.readFlaunchV1_1 = new ReadFlaunchV1_1(FlaunchV1_1Address[this.chainId], drift);
        this.readQuoter = new ReadQuoter(this.chainId, QuoterAddress[this.chainId], drift);
        this.readPermit2 = new ReadPermit2(Permit2Address[this.chainId], drift);
    }
    /**
     * Checks if a given coin address is a valid Flaunch coin (supports all versions)
     * @param coinAddress - The address of the coin to check
     * @returns Promise<boolean> - True if the coin is valid, false otherwise
     */
    async isValidCoin(coinAddress) {
        return ((await this.readPositionManagerV1_1.isValidCoin(coinAddress)) ||
            (await this.readPositionManager.isValidCoin(coinAddress)) ||
            (await this.readAnyPositionManager.isValidCoin(coinAddress)));
    }
    /**
     * Determines the version of a Flaunch coin
     * @param coinAddress - The address of the coin to check
     * @returns Promise<FlaunchVersion> - The version of the coin
     */
    async getCoinVersion(coinAddress) {
        if (await this.readPositionManager.isValidCoin(coinAddress)) {
            return FlaunchVersion.V1;
        }
        else if (await this.readPositionManagerV1_1.isValidCoin(coinAddress)) {
            return FlaunchVersion.V1_1;
        }
        else if (await this.readAnyPositionManager.isValidCoin(coinAddress)) {
            return FlaunchVersion.ANY;
        }
        throw new Error(`Unknown coin version for address: ${coinAddress}`);
    }
    // TODO: update these get functions to support V1.1.1 and new AnyPositionManager
    /**
     * Gets the position manager address for a given version
     * @param version - The version to get the position manager address for
     */
    getPositionManager(version) {
        switch (version) {
            case FlaunchVersion.V1:
                return this.readPositionManager;
            case FlaunchVersion.V1_1:
                return this.readPositionManagerV1_1;
            case FlaunchVersion.ANY:
                return this.readAnyPositionManager;
            default:
                return this.readPositionManagerV1_1;
        }
    }
    /**
     * Gets the fair launch address for a given version
     * @param version - The version to get the fair launch address for
     */
    getFairLaunch(version) {
        switch (version) {
            case FlaunchVersion.V1:
                return this.readFairLaunch;
            case FlaunchVersion.V1_1:
                return this.readFairLaunchV1_1;
            case FlaunchVersion.ANY:
                return this.readFairLaunchV1_1;
            default:
                return this.readFairLaunchV1_1;
        }
    }
    /**
     * Gets the bid wall address for a given version
     * @param version - The version to get the bid wall address for
     */
    getBidWall(version) {
        switch (version) {
            case FlaunchVersion.V1:
                return this.readBidWall;
            case FlaunchVersion.V1_1:
                return this.readBidWallV1_1;
            case FlaunchVersion.ANY:
                return this.readAnyBidWall;
            default:
                return this.readBidWallV1_1;
        }
    }
    getPositionManagerAddress(version) {
        return this.getPositionManager(version).contract.address;
    }
    getFairLaunchAddress(version) {
        return this.getFairLaunch(version).contract.address;
    }
    getBidWallAddress(version) {
        return this.getBidWall(version).contract.address;
    }
    /**
     * Retrieves metadata for a given Flaunch coin
     * @param coinAddress - The address of the coin
     * @returns Promise<CoinMetadata & { symbol: string }> - The coin's metadata including name, symbol, description, and social links
     */
    async getCoinMetadata(coinAddress) {
        const memecoin = new ReadMemecoin(coinAddress, this.drift);
        const name = await memecoin.name();
        const symbol = await memecoin.symbol();
        const tokenURI = await memecoin.tokenURI();
        // get metadata from tokenURI
        const metadata = (await axios.get(this.resolveIPFS(tokenURI))).data;
        return {
            name,
            symbol,
            description: metadata.description ?? "",
            image: metadata.image ? this.resolveIPFS(metadata.image) : "",
            external_link: metadata.websiteUrl ?? "",
            collaborators: metadata.collaborators ?? [],
            discordUrl: metadata.discordUrl ?? "",
            twitterUrl: metadata.twitterUrl ?? "",
            telegramUrl: metadata.telegramUrl ?? "",
        };
    }
    /**
     * Retrieves metadata for a given Flaunch coin using its token ID & Flaunch contract address
     * @param flaunch - The address of the Flaunch contract
     * @param tokenId - The token ID of the coin
     * @returns The coin's metadata including name, symbol, description, and social links
     */
    async getCoinMetadataFromTokenId(flaunch, tokenId) {
        const _flaunch = new ReadFlaunch(flaunch, this.drift);
        const coinAddress = await _flaunch.memecoin(tokenId);
        return this.getCoinMetadata(coinAddress);
    }
    /**
     * Retrieves metadata for multiple Flaunch coins using their token IDs & Flaunch contract addresses
     * @param params - An array of objects containing flaunch contract address and token ID
     * @param batchSize - Optional, the number of ipfs requests to process in each batch
     * @param batchDelay - Optional, the delay in milliseconds between batches
     * @returns An array of objects containing coin address, name, symbol, description, and social links
     */
    async getCoinMetadataFromTokenIds(params, batchSize = 9, batchDelay = 500) {
        const multicall = new ReadMulticall(this.drift);
        // get coin addresses via multicall
        const coinAddresses_calldata = params.map((p) => this.readFlaunch.contract.encodeFunctionData("memecoin", {
            _tokenId: p.tokenId,
        }));
        const coinAddresses_result = await multicall.aggregate3(coinAddresses_calldata.map((calldata, i) => ({
            target: params[i].flaunch,
            callData: calldata,
        })));
        const coinAddresses = coinAddresses_result.map((r) => this.readFlaunch.contract.decodeFunctionReturn("memecoin", r.returnData));
        /// get coin metadata for each coin address via multicall
        const coinMetadata_calldata = [];
        // name, symbol, tokenURI for each coin
        coinAddresses.forEach(() => {
            coinMetadata_calldata.push(this.drift.adapter.encodeFunctionData({
                abi: MemecoinAbi,
                fn: "name",
            }));
            coinMetadata_calldata.push(this.drift.adapter.encodeFunctionData({
                abi: MemecoinAbi,
                fn: "symbol",
            }));
            coinMetadata_calldata.push(this.drift.adapter.encodeFunctionData({
                abi: MemecoinAbi,
                fn: "tokenURI",
            }));
        });
        const coinMetadata_result = await multicall.aggregate3(coinMetadata_calldata.map((calldata, i) => ({
            target: coinAddresses[Math.floor(i / 3)],
            callData: calldata,
        })));
        // First decode all the results
        const results = [];
        for (let i = 0; i < coinAddresses.length; i++) {
            const name = this.drift.adapter.decodeFunctionReturn({
                abi: MemecoinAbi,
                fn: "name",
                data: coinMetadata_result[i * 3].returnData,
            });
            const symbol = this.drift.adapter.decodeFunctionReturn({
                abi: MemecoinAbi,
                fn: "symbol",
                data: coinMetadata_result[i * 3 + 1].returnData,
            });
            const tokenURI = this.drift.adapter.decodeFunctionReturn({
                abi: MemecoinAbi,
                fn: "tokenURI",
                data: coinMetadata_result[i * 3 + 2].returnData,
            });
            results.push({ name, symbol, tokenURI, coinAddress: coinAddresses[i] });
        }
        // Process IPFS requests in batches to avoid rate limiting
        const processedResults = [];
        for (let i = 0; i < results.length; i += batchSize) {
            const batch = results.slice(i, i + batchSize);
            const batchResults = await Promise.all(batch.map(async ({ name, symbol, tokenURI, coinAddress }) => {
                const metadata = (await axios.get(this.resolveIPFS(tokenURI))).data;
                return {
                    coinAddress,
                    name,
                    symbol,
                    description: metadata.description ?? "",
                    image: metadata.image ? this.resolveIPFS(metadata.image) : "",
                    external_link: metadata.websiteUrl ?? "",
                    collaborators: metadata.collaborators ?? [],
                    discordUrl: metadata.discordUrl ?? "",
                    twitterUrl: metadata.twitterUrl ?? "",
                    telegramUrl: metadata.telegramUrl ?? "",
                };
            }));
            processedResults.push(...batchResults);
            // Add a small delay between batches to avoid rate limiting
            if (i + batchSize < results.length) {
                await new Promise((resolve) => setTimeout(resolve, batchDelay));
            }
        }
        return processedResults;
    }
    /**
     * Watches for pool creation events
     * @param params - Parameters for watching pool creation
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Subscription to pool creation events
     */
    watchPoolCreated(params, version = FlaunchVersion.V1_1) {
        return version === FlaunchVersion.V1
            ? this.readPositionManager.watchPoolCreated(params)
            : this.readPositionManagerV1_1.watchPoolCreated(params);
    }
    /**
     * Polls for current pool creation events
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Current pool creation events or undefined if polling is not available
     */
    pollPoolCreatedNow(version = FlaunchVersion.V1_1) {
        const positionManager = version === FlaunchVersion.V1
            ? this.readPositionManager
            : this.readPositionManagerV1_1;
        const poll = positionManager.pollPoolCreatedNow;
        if (!poll) {
            return undefined;
        }
        return poll();
    }
    /**
     * Watches for pool swap events
     * @param params - Parameters for watching pool swaps including optional coin filter
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Subscription to pool swap events
     */
    async watchPoolSwap(params, version = FlaunchVersion.V1_1) {
        const positionManager = version === FlaunchVersion.V1
            ? this.readPositionManager
            : this.readPositionManagerV1_1;
        return positionManager.watchPoolSwap({
            ...params,
            filterByPoolId: params.filterByCoin
                ? await this.poolId(params.filterByCoin, version)
                : undefined,
            flETHIsCurrencyZero: params.filterByCoin
                ? this.flETHIsCurrencyZero(params.filterByCoin)
                : undefined,
        });
    }
    /**
     * Polls for current pool swap events
     * @param version - Version of Flaunch to use (defaults to V1_1)
     * @returns Current pool swap events or undefined if polling is not available
     */
    pollPoolSwapNow(version = FlaunchVersion.V1_1) {
        const positionManager = version === FlaunchVersion.V1
            ? this.readPositionManager
            : this.readPositionManagerV1_1;
        const poll = positionManager.pollPoolSwapNow;
        if (!poll) {
            return undefined;
        }
        return poll();
    }
    /**
     * Gets information about a liquidity position
     * @param params - Parameters for querying position info
     * @returns Position information from the state view contract
     */
    positionInfo(params) {
        return this.readStateView.positionInfo(params);
    }
    /**
     * Gets the current tick for a given coin's pool
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The current tick of the pool
     */
    async currentTick(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        const poolState = await this.readStateView.poolSlot0({ poolId });
        return poolState.tick;
    }
    /**
     * Calculates the coin price in ETH based on the current tick
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<string> - The price of the coin in ETH with 18 decimals precision
     */
    async coinPriceInETH(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const isFLETHZero = this.flETHIsCurrencyZero(coinAddress);
        const currentTick = await this.currentTick(coinAddress, coinVersion);
        const price = Math.pow(1.0001, currentTick);
        let ethPerCoin = 0;
        if (isFLETHZero) {
            ethPerCoin = 1 / price;
        }
        else {
            ethPerCoin = price;
        }
        return ethPerCoin.toFixed(18);
    }
    /**
     * Calculates the coin price in USD based on the current ETH/USDC price
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<string> - The price of the coin in USD with 2 decimal precision
     */
    async coinPriceInUSD({ coinAddress, version, drift, }) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const ethPerCoin = await this.coinPriceInETH(coinAddress, coinVersion);
        const ethPrice = await this.getETHUSDCPrice(drift);
        return (parseFloat(ethPerCoin) * ethPrice).toFixed(2);
    }
    async coinMarketCapInUSD({ coinAddress, version, drift, }) {
        const totalSupply = 100000000000; // 100 Billion tokens
        const priceInUSD = await this.coinPriceInUSD({
            coinAddress,
            version,
            drift,
        });
        return (parseFloat(priceInUSD) * totalSupply).toFixed(2);
    }
    /**
     * Gets the current ETH/USDC price
     * @param drift - Optional drift instance to get price from Base Mainnet
     * @returns Promise<number> - The current ETH/USDC price
     */
    async getETHUSDCPrice(drift) {
        if (drift) {
            const chainId = await drift.getChainId();
            const quoter = new ReadQuoter(chainId, QuoterAddress[chainId], drift);
            return quoter.getETHUSDCPrice();
        }
        return this.readQuoter.getETHUSDCPrice();
    }
    async initialSqrtPriceX96(params) {
        const initialMCapInUSDCWei = parseUnits(params.initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        const isFLETHZero = this.flETHIsCurrencyZero(params.coinAddress);
        const initialPrice = new ReadInitialPrice(await this.readPositionManagerV1_1.initialPrice(), this.drift);
        return initialPrice.getSqrtPriceX96({
            isFLETHZero,
            initialPriceParams,
        });
    }
    /**
     * Gets information about a fair launch for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Fair launch information from the appropriate contract version
     */
    async fairLaunchInfo(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        return this.getFairLaunch(coinVersion).fairLaunchInfo({ poolId });
    }
    /**
     * Checks if a fair launch is currently active for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<boolean> - True if fair launch is active, false otherwise
     */
    async isFairLaunchActive(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        return this.getFairLaunch(coinVersion).isFairLaunchActive({ poolId });
    }
    /**
     * Gets the duration of a fair launch for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The duration in seconds (30 minutes for V1, variable for V1.1)
     */
    async fairLaunchDuration(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        return this.getFairLaunch(coinVersion).fairLaunchDuration({ poolId });
    }
    /**
     * Gets the initial tick for a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<number> - The initial tick value
     */
    async initialTick(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        const fairLaunchInfo = await this.getFairLaunch(coinVersion).fairLaunchInfo({ poolId });
        return fairLaunchInfo.initialTick;
    }
    /**
     * Gets information about the ETH-only position in a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, tickLower: number, tickUpper: number}> - Position details
     */
    async fairLaunchETHOnlyPosition(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        const initialTick = await this.initialTick(coinAddress, coinVersion);
        const currentTick = await this.currentTick(coinAddress, coinVersion);
        const isFLETHZero = this.flETHIsCurrencyZero(coinAddress);
        let tickLower;
        let tickUpper;
        if (isFLETHZero) {
            tickLower = getValidTick({
                tick: initialTick + 1,
                roundDown: false,
                tickSpacing: this.TICK_SPACING,
            });
            tickUpper = tickLower + this.TICK_SPACING;
        }
        else {
            tickUpper = getValidTick({
                tick: initialTick - 1,
                roundDown: true,
                tickSpacing: this.TICK_SPACING,
            });
            tickLower = tickUpper - this.TICK_SPACING;
        }
        const { liquidity } = await this.readStateView.positionInfo({
            poolId,
            owner: this.getFairLaunchAddress(coinVersion),
            tickLower,
            tickUpper,
            salt: "",
        });
        const { amount0, amount1 } = calculateUnderlyingTokenBalances(liquidity, tickLower, tickUpper, currentTick);
        const [flETHAmount, coinAmount] = isFLETHZero
            ? [amount0, amount1]
            : [amount1, amount0];
        return {
            flETHAmount,
            coinAmount,
            tickLower,
            tickUpper,
        };
    }
    /**
     * Gets information about the coin-only position in a fair launch
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, tickLower: number, tickUpper: number}> - Position details
     */
    async fairLaunchCoinOnlyPosition(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        const initialTick = await this.initialTick(coinAddress, coinVersion);
        const currentTick = await this.currentTick(coinAddress, coinVersion);
        const isFLETHZero = this.flETHIsCurrencyZero(coinAddress);
        let tickLower;
        let tickUpper;
        if (isFLETHZero) {
            tickLower = TickFinder.MIN_TICK;
            tickUpper = getValidTick({
                tick: initialTick - 1,
                roundDown: true,
                tickSpacing: this.TICK_SPACING,
            });
        }
        else {
            tickLower = getValidTick({
                tick: initialTick + 1,
                roundDown: false,
                tickSpacing: this.TICK_SPACING,
            });
            tickUpper = TickFinder.MAX_TICK;
        }
        const { liquidity } = await this.readStateView.positionInfo({
            poolId,
            owner: this.getFairLaunchAddress(coinVersion),
            tickLower,
            tickUpper,
            salt: "",
        });
        const { amount0, amount1 } = calculateUnderlyingTokenBalances(liquidity, tickLower, tickUpper, currentTick);
        const [flETHAmount, coinAmount] = isFLETHZero
            ? [amount0, amount1]
            : [amount1, amount0];
        return {
            flETHAmount,
            coinAmount,
            tickLower,
            tickUpper,
        };
    }
    /**
     * Gets information about the bid wall position for a coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use. If not provided, will be determined automatically
     * @returns Promise<{flETHAmount: bigint, coinAmount: bigint, pendingEth: bigint, tickLower: number, tickUpper: number}> - Bid wall position details
     */
    async bidWallPosition(coinAddress, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        const poolId = await this.poolId(coinAddress, coinVersion);
        const isFLETHZero = this.flETHIsCurrencyZero(coinAddress);
        const { amount0_: amount0, amount1_: amount1, pendingEth_: pendingEth, } = await this.getBidWall(coinVersion).position({ poolId });
        const { tickLower, tickUpper } = await this.getBidWall(coinVersion).poolInfo({ poolId });
        const [flETHAmount, coinAmount] = isFLETHZero
            ? [amount0, amount1]
            : [amount1, amount0];
        return {
            flETHAmount,
            coinAmount,
            pendingEth,
            tickLower,
            tickUpper,
        };
    }
    /**
     * Gets the ETH balance for the creator to claim
     * @param creator - The address of the creator to check
     * @param isV1 - Optional boolean to check the balance for V1. V1.1 & AnyPositionManager use the same FeeEscrow contract
     * @returns The balance of the creator
     */
    creatorRevenue(creator, isV1) {
        if (isV1) {
            return this.readPositionManager.creatorBalance(creator);
        }
        else {
            return this.readFeeEscrow.balances(creator);
        }
    }
    /**
     * Gets the balance of a recipient for a given coin
     * @param recipient - The address of the recipient to check
     * @param coinAddress - The address of the coin
     * @returns Promise<bigint> - The balance of the recipient
     */
    referralBalance(recipient, coinAddress) {
        return this.readReferralEscrow.allocations(recipient, coinAddress);
    }
    /**
     * Gets the claimable balance of ETH for the recipient from a revenue manager
     * @param params - Parameters for checking the balance
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.recipient - The address of the recipient to check
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    revenueManagerBalance(params) {
        const readRevenueManager = new ReadRevenueManager(params.revenueManagerAddress, this.drift);
        return readRevenueManager.balances(params.recipient);
    }
    /**
     * Gets the claimable balance of ETH for the protocol from a revenue manager
     * @param revenueManagerAddress - The address of the revenue manager
     * @returns Promise<bigint> - The claimable balance of ETH
     */
    async revenueManagerProtocolBalance(revenueManagerAddress) {
        const readRevenueManager = new ReadRevenueManager(revenueManagerAddress, this.drift);
        const protocolRecipient = await readRevenueManager.protocolRecipient();
        return readRevenueManager.balances(protocolRecipient);
    }
    /**
     * Gets the total number of tokens managed by a revenue manager
     * @param revenueManagerAddress - The address of the revenue manager
     * @returns Promise<bigint> - The total count of tokens
     */
    async revenueManagerTokensCount(revenueManagerAddress) {
        const readRevenueManager = new ReadRevenueManager(revenueManagerAddress, this.drift);
        return readRevenueManager.tokensCount();
    }
    /**
     * Gets all tokens created by a specific creator address
     * @param params - Parameters for querying tokens by creator
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.creator - The address of the creator to query tokens for
     * @param params.sortByDesc - Whether to sort the tokens by descending order
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    async revenueManagerAllTokensByCreator(params) {
        const readRevenueManager = new ReadRevenueManager(params.revenueManagerAddress, this.drift);
        return readRevenueManager.allTokensByCreator(params.creator, params.sortByDesc);
    }
    /**
     * Gets all tokens currently managed by a revenue manager
     * @param params - Parameters for querying tokens in manager
     * @param params.revenueManagerAddress - The address of the revenue manager
     * @param params.sortByDesc - Optional boolean to sort tokens in descending order (default: false)
     * @returns Promise<Array<{flaunch: Address, tokenId: bigint}>> - Array of token objects containing flaunch address and token ID
     */
    async revenueManagerAllTokensInManager(params) {
        const readRevenueManager = new ReadRevenueManager(params.revenueManagerAddress, this.drift);
        return readRevenueManager.allTokensInManager(params.sortByDesc);
    }
    /**
     * Gets the pool ID for a given coin
     * @param coinAddress - The address of the coin
     * @param version - Optional specific version to use
     * @returns Promise<string> - The pool ID
     */
    async poolId(coinAddress, version) {
        let hookAddress;
        if (version) {
            hookAddress = this.getPositionManagerAddress(version);
        }
        else {
            const coinVersion = await this.getCoinVersion(coinAddress);
            hookAddress = this.getPositionManagerAddress(coinVersion);
        }
        return getPoolId(orderPoolKey({
            currency0: FLETHAddress[this.chainId],
            currency1: coinAddress,
            fee: 0,
            tickSpacing: 60,
            hooks: hookAddress,
        }));
    }
    /**
     * Gets the flaunching fee for a given initial price and slippage percent
     * @param params.sender - The address of the sender
     * @param params.initialMarketCapUSD - The initial market cap in USD
     * @param params.slippagePercent - The slippage percent
     * @returns Promise<bigint> - The flaunching fee
     */
    getFlaunchingFee(params) {
        const initialMCapInUSDCWei = parseUnits(params.initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        return this.readPositionManagerV1_1.getFlaunchingFee({
            sender: params.sender,
            initialPriceParams,
            slippagePercent: params.slippagePercent,
        });
    }
    /**
     * Calculates the ETH required to flaunch a token, takes into account the ETH for premine and the flaunching fee
     * @param params.premineAmount - The amount of coins to be premined
     * @param params.initialMarketCapUSD - The initial market cap in USD
     * @param params.slippagePercent - The slippage percent
     * @returns Promise<bigint> - The ETH required to flaunch
     */
    ethRequiredToFlaunch(params) {
        const initialMCapInUSDCWei = parseUnits(params.initialMarketCapUSD.toString(), 6);
        const initialPriceParams = encodeAbiParameters([
            {
                type: "uint256",
            },
        ], [initialMCapInUSDCWei]);
        return this.readFlaunchZap.ethRequiredToFlaunch({
            premineAmount: params.premineAmount,
            initialPriceParams,
            slippagePercent: params.slippagePercent,
        });
    }
    /**
     * Gets a quote for selling an exact amount of tokens for ETH
     * @param coinAddress - The address of the token to sell
     * @param amountIn - The exact amount of tokens to sell
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The expected amount of ETH to receive
     */
    async getSellQuoteExactInput(coinAddress, amountIn, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        return this.readQuoter.getSellQuoteExactInput(coinAddress, amountIn, this.getPositionManagerAddress(coinVersion));
    }
    /**
     * Gets a quote for buying tokens with an exact amount of ETH
     * @param coinAddress - The address of the token to buy
     * @param ethIn - The exact amount of ETH to spend
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The expected amount of tokens to receive
     */
    async getBuyQuoteExactInput(coinAddress, amountIn, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        return this.readQuoter.getBuyQuoteExactInput(coinAddress, amountIn, this.getPositionManagerAddress(coinVersion));
    }
    /**
     * Gets a quote for buying an exact amount of tokens with ETH
     * @param coinAddress - The address of the token to buy
     * @param coinOut - The exact amount of tokens to receive
     * @param version - Optional specific version to use
     * @returns Promise<bigint> - The required amount of ETH to spend
     */
    async getBuyQuoteExactOutput(coinAddress, amountOut, version) {
        const coinVersion = version || (await this.getCoinVersion(coinAddress));
        return this.readQuoter.getBuyQuoteExactOutput(coinAddress, amountOut, this.getPositionManagerAddress(coinVersion));
    }
    /**
     * Determines if flETH is currency0 in the pool
     * @param coinAddress - The address of the coin
     * @returns boolean - True if flETH is currency0, false otherwise
     */
    flETHIsCurrencyZero(coinAddress) {
        return coinAddress > FLETHAddress[this.chainId];
    }
    /**
     * Sets a custom IPFS resolver function
     * @dev this is used to resolve IPFS hash to a gateway URL
     * eg: input: Qabc, output: https://ipfs.io/ipfs/Qabc
     * @param resolverFn - Custom function to resolve IPFS URIs
     */
    setIPFSResolver(resolverFn) {
        this.resolveIPFS = resolverFn;
    }
}
class ReadWriteFlaunchSDK extends ReadFlaunchSDK {
    constructor(chainId, drift = createDrift$1()) {
        super(chainId, drift);
        this.readWritePositionManager = new ReadWriteFlaunchPositionManager(FlaunchPositionManagerAddress[this.chainId], drift);
        this.readWritePositionManagerV1_1 = new ReadWriteFlaunchPositionManagerV1_1(FlaunchPositionManagerV1_1Address[this.chainId], drift);
        this.readWriteAnyPositionManager = new ReadWriteAnyPositionManager(AnyPositionManagerAddress[this.chainId], drift);
        this.readWriteFeeEscrow = new ReadWriteFeeEscrow(FeeEscrowAddress[this.chainId], drift);
        this.readWriteReferralEscrow = new ReadWriteReferralEscrow(ReferralEscrowAddress[this.chainId], drift);
        this.readWriteFlaunchZap = new ReadWriteFlaunchZap(this.chainId, FlaunchZapAddress[this.chainId], drift);
        this.readWriteTreasuryManagerFactory = new ReadWriteTreasuryManagerFactory(this.chainId, TreasuryManagerFactoryAddress[this.chainId], drift);
        this.readWritePermit2 = new ReadWritePermit2(Permit2Address[this.chainId], drift);
    }
    /**
     * Deploys a new revenue manager
     * @param params - Parameters for deploying the revenue manager
     * @param params.protocolRecipient - The address of the protocol recipient
     * @param params.protocolFeePercent - The percentage of the protocol fee
     * @returns Address of the deployed revenue manager
     */
    async deployRevenueManager(params) {
        const hash = await this.readWriteTreasuryManagerFactory.deployRevenueManager(params);
        // Create a public client to get the transaction receipt with logs
        const publicClient = createPublicClient({
            chain: chainIdToChain[this.chainId],
            transport: http(),
        });
        // Wait for transaction receipt
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        // Get the logs from the receipt and find the ManagerDeployed event
        const events = await publicClient.getContractEvents({
            address: this.readWriteTreasuryManagerFactory.contract.address,
            abi: TreasuryManagerFactoryAbi,
            eventName: "ManagerDeployed",
            fromBlock: receipt.blockNumber,
            toBlock: receipt.blockNumber,
        });
        // Find the event from our transaction
        const event = events.find((e) => e.transactionHash === hash);
        if (!event) {
            throw new Error("ManagerDeployed event not found in transaction logs");
        }
        return event.args._manager;
    }
    /**
     * Creates a new Flaunch on the specified version
     * @param params - Parameters for creating the Flaunch
     * @returns Transaction response
     */
    flaunch(params) {
        return this.readWriteFlaunchZap.flaunch(params);
    }
    /**
     * Creates a new Flaunch with IPFS metadata and optional version specification
     * @param params - Parameters for creating the Flaunch with IPFS data
     * @returns Transaction response
     */
    flaunchIPFS(params) {
        return this.readWriteFlaunchZap.flaunchIPFS(params);
    }
    /**
     * Creates a new Flaunch with revenue manager configuration
     * @param params - Parameters for creating the Flaunch with revenue manager
     * @throws Error if FlaunchZap is not deployed on the current chain
     * @returns Transaction response
     */
    flaunchWithRevenueManager(params) {
        if (this.readWriteFlaunchZap.contract.address === zeroAddress) {
            throw new Error(`FlaunchZap is not deployed at chainId: ${this.chainId}`);
        }
        return this.readWriteFlaunchZap.flaunchWithRevenueManager(params);
    }
    /**
     * Creates a new Flaunch with revenue manager configuration and IPFS metadata
     * @param params - Parameters for creating the Flaunch with revenue manager and IPFS data
     * @throws Error if FlaunchZap is not deployed on the current chain
     * @returns Transaction response
     */
    async flaunchIPFSWithRevenueManager(params) {
        if (this.readWriteFlaunchZap.contract.address === zeroAddress) {
            throw new Error(`FlaunchZap is not deployed at chainId: ${this.chainId}`);
        }
        return this.readWriteFlaunchZap.flaunchIPFSWithRevenueManager(params);
    }
    /**
     * Creates a new Flaunch with AnyPositionManager for external coins
     * @param params - Parameters for creating the Flaunch with AnyPositionManager
     * @returns Transaction response
     */
    anyFlaunch(params) {
        return this.readWriteAnyPositionManager.flaunch(params);
    }
    /**
     * Gets the balance of a specific coin for the connected wallet
     * @param coinAddress - The address of the coin to check
     * @returns Promise<bigint> - The balance of the coin
     */
    async coinBalance(coinAddress) {
        const user = await this.drift.getSignerAddress();
        const memecoin = new ReadMemecoin(coinAddress, this.drift);
        await memecoin.contract.cache.clear();
        return memecoin.balanceOf(user);
    }
    /**
     * Buys a coin with ETH
     * @param params - Parameters for buying the coin including amount, slippage, and referrer
     * @param version - Optional specific version to use. If not provided, will determine automatically
     * @returns Transaction response for the buy operation
     */
    async buyCoin(params, version) {
        const coinVersion = version || (await this.getCoinVersion(params.coinAddress));
        const sender = await this.drift.getSignerAddress();
        let amountIn;
        let amountOutMin;
        let amountOut;
        let amountInMax;
        await this.readQuoter.contract.cache.clear();
        if (params.swapType === "EXACT_IN") {
            amountIn = params.amountIn;
            if (params.amountOutMin === undefined) {
                // Currently only V1 and V1.1 are supported in the Quoter
                amountOutMin = getAmountWithSlippage(await this.readQuoter.getBuyQuoteExactInput(params.coinAddress, amountIn, this.getPositionManagerAddress(coinVersion)), (params.slippagePercent / 100).toFixed(18).toString(), params.swapType);
            }
            else {
                amountOutMin = params.amountOutMin;
            }
        }
        else {
            amountOut = params.amountOut;
            if (params.amountInMax === undefined) {
                // Currently only V1 and V1.1 are supported in the Quoter
                amountInMax = getAmountWithSlippage(await this.readQuoter.getBuyQuoteExactOutput(params.coinAddress, amountOut, this.getPositionManagerAddress(coinVersion)), (params.slippagePercent / 100).toFixed(18).toString(), params.swapType);
            }
            else {
                amountInMax = params.amountInMax;
            }
        }
        // When UniversalRouter supports isAny parameter, add it here
        const { commands, inputs } = ethToMemecoin({
            sender: sender,
            memecoin: params.coinAddress,
            chainId: this.chainId,
            referrer: params.referrer ?? null,
            swapType: params.swapType,
            amountIn: amountIn,
            amountOutMin: amountOutMin,
            amountOut: amountOut,
            amountInMax: amountInMax,
            positionManagerAddress: this.getPositionManagerAddress(coinVersion),
        });
        return this.drift.adapter.write({
            abi: UniversalRouterAbi,
            address: UniversalRouterAddress[this.chainId],
            fn: "execute",
            args: {
                commands,
                inputs,
            },
            value: params.swapType === "EXACT_IN" ? amountIn : amountInMax,
        });
    }
    /**
     * Sells a coin for ETH
     * @param params - Parameters for selling the coin including amount, slippage, permit data, and referrer
     * @param version - Optional specific version to use. If not provided, will determine automatically
     * @returns Transaction response for the sell operation
     */
    async sellCoin(params, version) {
        const coinVersion = version || (await this.getCoinVersion(params.coinAddress));
        let ethOutMin;
        await this.readQuoter.contract.cache.clear();
        if (params.ethOutMin === undefined) {
            // Currently only V1 and V1.1 are supported in the Quoter
            ethOutMin = getAmountWithSlippage(await this.readQuoter.getSellQuoteExactInput(params.coinAddress, params.amountIn, this.getPositionManagerAddress(coinVersion)), (params.slippagePercent / 100).toFixed(18).toString(), "EXACT_IN");
        }
        else {
            ethOutMin = params.ethOutMin;
        }
        await this.readPermit2.contract.cache.clear();
        // When UniversalRouter supports isAny parameter, add it here
        const { commands, inputs } = memecoinToEthWithPermit2({
            chainId: this.chainId,
            memecoin: params.coinAddress,
            amountIn: params.amountIn,
            ethOutMin,
            permitSingle: params.permitSingle,
            signature: params.signature,
            referrer: params.referrer ?? null,
            positionManagerAddress: this.getPositionManagerAddress(coinVersion),
        });
        return this.drift.write({
            abi: UniversalRouterAbi,
            address: UniversalRouterAddress[this.chainId],
            fn: "execute",
            args: {
                commands,
                inputs,
            },
        });
    }
    /**
     * Gets the typed data for a Permit2 signature
     * @param coinAddress - The address of the coin to permit
     * @param deadline - Optional deadline for the permit (defaults to 10 years)
     * @returns The typed data object for signing
     */
    async getPermit2TypedData(coinAddress, deadline) {
        const { nonce } = await this.getPermit2AllowanceAndNonce(coinAddress);
        // 10 years in seconds
        const defaultDeadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365 * 10);
        return getPermit2TypedData({
            chainId: this.chainId,
            coinAddress,
            nonce,
            deadline: deadline !== undefined ? deadline : defaultDeadline,
        });
    }
    /**
     * Gets the current Permit2 allowance and nonce for a coin
     * @param coinAddress - The address of the coin to check
     * @returns Promise<{allowance: bigint, nonce: bigint}> - Current allowance and nonce
     */
    async getPermit2AllowanceAndNonce(coinAddress) {
        const { amount, nonce } = await this.readPermit2.allowance(await this.drift.getSignerAddress(), coinAddress, UniversalRouterAddress[this.chainId]);
        return {
            allowance: amount,
            nonce,
        };
    }
    /**
     * Withdraws the creator's share of the revenue
     * @param params - Parameters for withdrawing the creator's share of the revenue
     * @param params.recipient - The address to withdraw the revenue to. Defaults to the connected wallet
     * @param params.isV1 - Optional boolean to withdraw from V1. V1.1 & AnyPositionManager use the same FeeEscrow contract
     * @returns Transaction response
     */
    async withdrawCreatorRevenue(params) {
        const recipient = params.recipient ?? (await this.drift.getSignerAddress());
        if (params.isV1) {
            return this.readWritePositionManager.withdrawFees(recipient);
        }
        else {
            return this.readWriteFeeEscrow.withdrawFees(recipient);
        }
    }
    /**
     * Claims the referral balance for a given recipient
     * @param coins - The addresses of the coins to claim
     * @param recipient - The address of the recipient to claim the balance for
     * @returns Transaction response
     */
    claimReferralBalance(coins, recipient) {
        return this.readWriteReferralEscrow.claimTokens(coins, recipient);
    }
    /**
     * Claims the protocol's share of the revenue
     * @param params - Parameters for claiming the protocol's share of the revenue
     * @returns Transaction response
     */
    revenueManagerProtocolClaim(params) {
        const readWriteRevenueManager = new ReadWriteRevenueManager(params.revenueManagerAddress, this.drift);
        return readWriteRevenueManager.protocolClaim();
    }
    /**
     * Claims the total creator's share of the revenue from a revenue manager
     * @param params - Parameters for claiming the creator's share of the revenue
     * @returns Transaction response
     */
    revenueManagerCreatorClaim(params) {
        const readWriteRevenueManager = new ReadWriteRevenueManager(params.revenueManagerAddress, this.drift);
        return readWriteRevenueManager.creatorClaim();
    }
    /**
     * Claims the creator's share of the revenue from specific flaunch tokens
     * @param params - Parameters for claiming the creator's share of the revenue
     * @returns Transaction response
     */
    revenueManagerCreatorClaimForTokens(params) {
        const readWriteRevenueManager = new ReadWriteRevenueManager(params.revenueManagerAddress, this.drift);
        return readWriteRevenueManager.creatorClaimForTokens(params.flaunchTokens);
    }
}

/**
 * Creates a Drift instance with the provided clients
 * @param params - Parameters for creating the Drift instance
 * @returns Drift instance configured with the appropriate clients
 * @throws Error if publicClient.chain is not configured
 */
function createDrift(params) {
    const { publicClient, walletClient } = params;
    if (!publicClient.chain) {
        throw new Error("publicClient must be configured with a chain");
    }
    return walletClient
        ? createDrift$1({
            adapter: viemAdapter({ publicClient, walletClient }),
        })
        : createDrift$1({
            adapter: viemAdapter({ publicClient }),
        });
}

/**
 * Creates a Flaunch SDK instance with the provided clients
 * @param params - Parameters for creating the SDK
 * @returns ReadFlaunchSDK if only publicClient is provided, ReadWriteFlaunchSDK if walletClient is also provided
 * @throws Error if publicClient.chain is not configured
 */
function createFlaunch(params) {
    const { publicClient, walletClient } = params;
    if (!publicClient.chain) {
        throw new Error("publicClient must be configured with a chain");
    }
    const chainId = publicClient.chain.id;
    // Return appropriate SDK type based on whether walletClient is provided
    return walletClient
        ? new ReadWriteFlaunchSDK(chainId, createDrift({ publicClient, walletClient }))
        : new ReadFlaunchSDK(chainId, createDrift({ publicClient }));
}

const FlaunchSDK = {
    ReadFlaunchSDK,
    ReadWriteFlaunchSDK,
};

export { AnyBidWallAddress, AnyFlaunchAddress, AnyPositionManagerAbi, AnyPositionManagerAddress, BidWallAddress, BidWallV1_1Abi, BidWallV1_1Address, BidwallAbi, FLETHAddress, FLETHHooksAddress, FairLaunchAbi, FairLaunchAddress, FairLaunchV1_1Abi, FairLaunchV1_1Address, FastFlaunchZapAbi, FastFlaunchZapAddress, FeeEscrowAbi, FeeEscrowAddress, FlaunchAbi, FlaunchAddress, FlaunchPositionManagerAbi, FlaunchPositionManagerAddress, FlaunchPositionManagerV1_1Abi, FlaunchPositionManagerV1_1Address, FlaunchSDK, FlaunchV1_1Abi, FlaunchV1_1Address, FlaunchVersion, FlaunchZapAbi, FlaunchZapAddress, InitialPriceAbi, MemecoinAbi, MulticallAbi, Permit2Abi, Permit2Address, PoolManagerAbi, PoolManagerAddress, QuoterAbi, QuoterAddress, ReadFlaunchSDK, ReadWriteFlaunchSDK, ReferralEscrowAbi, ReferralEscrowAddress, RevenueManagerAbi, RevenueManagerAddress, StateViewAbi, StateViewAddress, TICK_SPACING, TickFinder, TreasuryManagerFactoryAbi, TreasuryManagerFactoryAddress, USDCETHPoolKeys, UniversalRouterAbi, UniversalRouterAddress, bytes32ToUint256, calculateUnderlyingTokenBalances, chainIdToChain, createDrift, createFlaunch, generateTokenUri, getPoolId, getSqrtPriceX96FromTick, getValidTick, orderPoolKey, resolveIPFS, uint256ToBytes32, uploadFileToIPFS, uploadImageToIPFS, uploadJsonToIPFS };
//# sourceMappingURL=index.esm.js.map

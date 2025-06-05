import { zeroAddress } from 'viem';

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
    [baseSepolia.id]: "0xd3d9047CaBE3346C70b510435866565176e8CE12",
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

export { AnyBidWallAddress, AnyFlaunchAddress, AnyPositionManagerAddress, BidWallAddress, BidWallV1_1Address, FLETHAddress, FLETHHooksAddress, FairLaunchAddress, FairLaunchV1_1Address, FastFlaunchZapAddress, FeeEscrowAddress, FlaunchAddress, FlaunchPositionManagerAddress, FlaunchPositionManagerV1_1Address, FlaunchV1_1Address, FlaunchZapAddress, Permit2Address, PoolManagerAddress, QuoterAddress, ReferralEscrowAddress, RevenueManagerAddress, StateViewAddress, TreasuryManagerFactoryAddress, USDCETHPoolKeys, UniversalRouterAddress };
//# sourceMappingURL=index.js.map

import { useState, useEffect } from 'react';

/**
 * Hook to watch and track pool creation events from the Flaunch V1.1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of pool creation events in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
function usePoolCreatedEvents(flaunch, startBlockNumber) {
    const [logs, setLogs] = useState([]);
    const [isFetchingFromStart, setIsFetchingFromStart] = useState(false);
    useEffect(() => {
        const setupWatcher = async () => {
            const cleanup = await flaunch.watchPoolCreated({
                onPoolCreated: ({ logs: newLogs, isFetchingFromStart }) => {
                    setIsFetchingFromStart(isFetchingFromStart);
                    setLogs((prevLogs) => [...newLogs, ...prevLogs]);
                },
                startBlockNumber,
            });
            return cleanup;
        };
        const cleanupPromise = setupWatcher();
        return () => {
            cleanupPromise.then(({ cleanup }) => cleanup());
        };
    }, [flaunch.chainId, startBlockNumber]);
    // Add effect to update times
    useEffect(() => {
        const timer = setInterval(() => {
            // Force re-render to update relative times
            setLogs((prev) => [...prev]);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return { logs, isFetchingFromStart };
}
/**
 * Hook to watch and track swap events (buys/sells) for a specific coin from the Flaunch V1.1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param coinAddress - Address of the coin to watch swaps for
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of swap events (both buys and sells) in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
function usePoolSwapEvents(flaunch, coinAddress, startBlockNumber) {
    const [logs, setLogs] = useState([]);
    const [isFetchingFromStart, setIsFetchingFromStart] = useState(false);
    useEffect(() => {
        const setupWatcher = async () => {
            const cleanup = await flaunch.watchPoolSwap({
                onPoolSwap: ({ logs: newLogs, isFetchingFromStart }) => {
                    setIsFetchingFromStart(isFetchingFromStart);
                    setLogs((prevLogs) => [...newLogs, ...prevLogs]);
                },
                filterByCoin: coinAddress,
                startBlockNumber,
            });
            return cleanup;
        };
        const cleanupPromise = setupWatcher();
        return () => {
            cleanupPromise.then(({ cleanup }) => cleanup());
        };
    }, [flaunch.chainId, coinAddress, startBlockNumber]);
    // Add effect to update times
    useEffect(() => {
        const timer = setInterval(() => {
            // Force re-render to update relative times
            setLogs((prev) => [...prev]);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return { logs, isFetchingFromStart };
}
/**
 * Hook to watch and track pool creation events from the Flaunch V1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of pool creation events in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
function usePoolCreatedEventsV1(flaunch, startBlockNumber) {
    const [logs, setLogs] = useState([]);
    const [isFetchingFromStart, setIsFetchingFromStart] = useState(false);
    useEffect(() => {
        const setupWatcher = async () => {
            const cleanup = await flaunch.watchPoolCreated({
                onPoolCreated: ({ logs: newLogs, isFetchingFromStart }) => {
                    setIsFetchingFromStart(isFetchingFromStart);
                    setLogs((prevLogs) => [...newLogs, ...prevLogs]);
                },
                startBlockNumber,
            });
            return cleanup;
        };
        const cleanupPromise = setupWatcher();
        return () => {
            cleanupPromise.then(({ cleanup }) => cleanup());
        };
    }, [flaunch.chainId, startBlockNumber]);
    // Add effect to update times
    useEffect(() => {
        const timer = setInterval(() => {
            // Force re-render to update relative times
            setLogs((prev) => [...prev]);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return { logs, isFetchingFromStart };
}
/**
 * Hook to watch and track swap events (buys/sells) for a specific coin from the Flaunch V1 contract
 * @param flaunch - Instance of ReadFlaunchSDK to interact with the contract
 * @param coinAddress - Address of the coin to watch swaps for
 * @param startBlockNumber - Optional block number to start watching events from
 * @returns Object containing:
 *  - logs: Array of swap events (both buys and sells) in reverse chronological order
 *  - isFetchingFromStart: Boolean indicating if initial historical events are being fetched
 */
function usePoolSwapEventsV1(flaunch, coinAddress, startBlockNumber) {
    const [logs, setLogs] = useState([]);
    const [isFetchingFromStart, setIsFetchingFromStart] = useState(false);
    useEffect(() => {
        const setupWatcher = async () => {
            const cleanup = await flaunch.watchPoolSwap({
                onPoolSwap: ({ logs: newLogs, isFetchingFromStart }) => {
                    setIsFetchingFromStart(isFetchingFromStart);
                    setLogs((prevLogs) => [...newLogs, ...prevLogs]);
                },
                filterByCoin: coinAddress,
                startBlockNumber,
            });
            return cleanup;
        };
        const cleanupPromise = setupWatcher();
        return () => {
            cleanupPromise.then(({ cleanup }) => cleanup());
        };
    }, [flaunch.chainId, coinAddress, startBlockNumber]);
    // Add effect to update times
    useEffect(() => {
        const timer = setInterval(() => {
            // Force re-render to update relative times
            setLogs((prev) => [...prev]);
        }, 1000);
        return () => clearInterval(timer);
    }, []);
    return { logs, isFetchingFromStart };
}

export { usePoolCreatedEvents, usePoolCreatedEventsV1, usePoolSwapEvents, usePoolSwapEventsV1 };
//# sourceMappingURL=index.js.map

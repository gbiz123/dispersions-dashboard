import { useState, useEffect, useRef } from 'react';

interface UsePollingOptions {
  interval: number;
  maxAttempts?: number;
  stopCondition?: (data: any) => boolean;
}

type PollingFunction<T> = () => Promise<T>;

export function usePolling<T>(
  pollingFunction: PollingFunction<T>,
  options: UsePollingOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [stopped, setStopped] = useState(false);
  const attempts = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const stop = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStopped(true);
  };

  const start = () => {
    setStopped(false);
    setLoading(true);
    attempts.current = 0;
  };

  useEffect(() => {
    if (stopped) return;

    const poll = async () => {
      try {
        attempts.current++;
        const result = await pollingFunction();
        setData(result);
        setError(null);

        const shouldStop =
          (options.stopCondition && options.stopCondition(result)) ||
          (options.maxAttempts && attempts.current >= options.maxAttempts);

        if (shouldStop) {
          setLoading(false);
          setStopped(true);
        } else {
          timeoutRef.current = window.setTimeout(poll, options.interval);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
        setStopped(true);
      }
    };

    if (!stopped && loading) {
      poll();
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [stopped, loading, options, pollingFunction]);

  return { data, loading, error, start, stop };
}

export default usePolling;
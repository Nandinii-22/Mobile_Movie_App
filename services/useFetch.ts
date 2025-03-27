import { useState, useEffect } from "react";

const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(
                err instanceof Error ? err : new Error("An unknown error occurred")
            );
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setData(null);
        setError(null);
        setLoading(false);
    };

    useEffect(() => {
        if (autoFetch) {
            fetchData();
        }
    }, [fetchFunction]); // Add fetchFunction to dependencies to handle dynamic updates

    return { data, loading, error, refetch: fetchData, reset };
};

export default useFetch;

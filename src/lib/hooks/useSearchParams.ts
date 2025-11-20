import * as React from "react";

/**
 * Custom hook to manage URL search parameters
 * Returns a tuple of [params, setParams] similar to useState
 * SSR-safe: returns empty URLSearchParams on server
 */
export function useSearchParams(): [
  URLSearchParams,
  (params: URLSearchParams | Record<string, string>) => void,
] {
  const [params, setParamsState] = React.useState<URLSearchParams>(() => {
    if (typeof window === "undefined") {
      return new URLSearchParams();
    }
    return new URLSearchParams(window.location.search);
  });

  React.useEffect(() => {
    // Initialize with current search params on mount
    setParamsState(new URLSearchParams(window.location.search));

    const handleLocationChange = () => {
      setParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  const setParams = React.useCallback(
    (newParams: URLSearchParams | Record<string, string>) => {
      if (typeof window === "undefined") return;

      const searchParams =
        newParams instanceof URLSearchParams
          ? newParams
          : new URLSearchParams(newParams);

      const url = new URL(window.location.href);
      url.search = searchParams.toString();
      window.history.pushState({}, "", url.toString());
      setParamsState(searchParams);
    },
    [],
  );

  return [params, setParams];
}

import { useCallback, useSyncExternalStore } from "react";

/**
 * Custom React hook that returns a boolean indicating whether the given media query matches.
 *
 * Subscribes to media query changes and updates the value accordingly.
 * Supports server-side rendering with a fallback value.
 *
 * @param query - The media query string to evaluate.
 * @param serverFallback - The fallback value to use during server-side rendering.
 * @returns True if the media query matches, otherwise false.
 */
export default function useMediaQuery(query: string, serverFallback: boolean) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = matchMedia(query);
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => matchMedia(query).matches,
    () => serverFallback,
  );
}

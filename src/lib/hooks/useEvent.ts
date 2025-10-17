import * as React from "react";

export function useEvent(
  event: string,
  callback: (e: Event) => void,
  deps: React.DependencyList = [],
  options: AddEventListenerOptions = {},
) {
  React.useEffect(() => {
    if (event === "resize") {
      callback({} as Event);
    }

    window.addEventListener(event, callback, options);

    return () => window.removeEventListener(event, callback, options);
  }, deps);
}

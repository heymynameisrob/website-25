import * as React from "react";

export function ClickTest() {
  const [count, setCount] = React.useState(0);
  const [lastEvent, setLastEvent] = React.useState("none");

  React.useEffect(() => {
    const onDocumentClick = () => {
      setLastEvent("document");
    };
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  return (
    <section className="w-full rounded-xl border border-gray-4 p-3" data-click-test>
      <p className="text-xs text-gray-10 mb-2">Click test count: {count}</p>
      <p className="text-xs text-gray-10 mb-3">Last event source: {lastEvent}</p>
      <button
        type="button"
        className="px-3 py-2 rounded-md bg-gray-3 text-primary text-sm"
        onClick={() => {
          setCount(prev => prev + 1);
          setLastEvent("button");
        }}
      >
        Increment
      </button>
      <div
        className="mt-3 h-20 rounded-md bg-gray-2 grid place-items-center text-xs text-gray-10"
        onClick={() => {
          setCount(prev => prev + 1);
          setLastEvent("box");
        }}
      >
        Click this box
      </div>
    </section>
  );
}

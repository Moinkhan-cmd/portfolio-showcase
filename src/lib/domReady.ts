export type ReadyState = "interactive" | "complete";

const readyStateRank: Record<DocumentReadyState, number> = {
  loading: 0,
  interactive: 1,
  complete: 2,
};

export const whenDomReady = (minState: ReadyState = "interactive"): Promise<void> => {
  if (typeof document === "undefined") return Promise.resolve();

  const minRank = readyStateRank[minState];
  if (readyStateRank[document.readyState] >= minRank) return Promise.resolve();

  return new Promise((resolve) => {
    const onReady = () => {
      document.removeEventListener("DOMContentLoaded", onReady);
      window.removeEventListener("load", onReady);
      resolve();
    };

    if (minState === "complete") {
      window.addEventListener("load", onReady, { once: true });
    } else {
      document.addEventListener("DOMContentLoaded", onReady, { once: true });
    }
  });
};

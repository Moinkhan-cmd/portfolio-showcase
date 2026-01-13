import { applyDeviceClasses, getDeviceFlags } from "./device";
import { whenDomReady } from "./domReady";

let installed = false;
let bannerContainer: HTMLDivElement | null = null;
let bannerTimer: number | null = null;
let shownCount = 0;

const safeToString = (value: unknown): string => {
  try {
    if (value instanceof Error) return value.stack || value.message || String(value);
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  } catch {
    try {
      return String(value);
    } catch {
      return "<unprintable>";
    }
  }
};

const formatErrorTitle = (prefix: string, message: string): string => {
  const trimmed = message?.trim?.() || "(no message)";
  return `${prefix}: ${trimmed}`;
};

const ensureBanner = async (): Promise<HTMLDivElement | null> => {
  if (typeof document === "undefined") return null;

  await whenDomReady("interactive");

  if (bannerContainer) return bannerContainer;

  const div = document.createElement("div");
  div.id = "__mobile_error_banner__";
  div.style.position = "fixed";
  div.style.left = "12px";
  div.style.right = "12px";
  div.style.bottom = "12px";
  div.style.zIndex = "2147483647";
  div.style.background = "rgba(20, 20, 20, 0.95)";
  div.style.color = "#fff";
  div.style.border = "1px solid rgba(255, 80, 80, 0.8)";
  div.style.borderRadius = "12px";
  div.style.padding = "12px 14px";
  div.style.fontFamily = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
  div.style.fontSize = "12px";
  div.style.lineHeight = "1.35";
  div.style.whiteSpace = "pre-wrap";
  div.style.wordBreak = "break-word";
  div.style.boxShadow = "0 10px 30px rgba(0,0,0,0.35)";
  div.style.display = "none";

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.style.position = "absolute";
  close.style.top = "6px";
  close.style.right = "10px";
  close.style.width = "28px";
  close.style.height = "28px";
  close.style.borderRadius = "9999px";
  close.style.border = "0";
  close.style.background = "rgba(255,255,255,0.08)";
  close.style.color = "#fff";
  close.style.fontSize = "18px";
  close.style.lineHeight = "28px";
  close.style.cursor = "pointer";
  close.onclick = () => hideBanner();

  div.appendChild(close);
  document.body.appendChild(div);
  bannerContainer = div;
  return div;
};

const hideBanner = () => {
  if (!bannerContainer) return;
  bannerContainer.style.display = "none";
  if (bannerTimer != null) {
    window.clearTimeout(bannerTimer);
    bannerTimer = null;
  }
};

const showBanner = async (message: string) => {
  try {
    const flags = getDeviceFlags();
    if (!flags.isRealMobile) return;

    // Avoid alert storms on repeated render loops.
    if (shownCount >= 3) return;
    shownCount += 1;

    const div = await ensureBanner();
    if (!div) return;

    div.style.display = "block";
    div.textContent = message;

    // Re-add close button after textContent reset.
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.style.position = "absolute";
    close.style.top = "6px";
    close.style.right = "10px";
    close.style.width = "28px";
    close.style.height = "28px";
    close.style.borderRadius = "9999px";
    close.style.border = "0";
    close.style.background = "rgba(255,255,255,0.08)";
    close.style.color = "#fff";
    close.style.fontSize = "18px";
    close.style.lineHeight = "28px";
    close.style.cursor = "pointer";
    close.onclick = () => hideBanner();
    div.appendChild(close);

    if (bannerTimer != null) window.clearTimeout(bannerTimer);
    bannerTimer = window.setTimeout(() => hideBanner(), 12000);
  } catch {
    // never throw from logger
  }
};

export const setupGlobalErrorLogger = () => {
  if (installed) return;
  installed = true;

  if (typeof window === "undefined") return;

  // Apply classes early so CSS can react immediately.
  // Do not await.
  applyDeviceClasses().catch(() => undefined);

  const log = (title: string, details?: Record<string, unknown>) => {
    try {
      console.groupCollapsed(title);
      if (details) console.error(details);
      console.groupEnd();
    } catch {
      // ignore
    }
  };

  // Required by your ask: window.onerror
  window.onerror = (message, source, lineno, colno, error) => {
    try {
      const msg = formatErrorTitle("window.onerror", safeToString(message));
      log(msg, { source, lineno, colno, error: safeToString(error) });
      showBanner(`${msg}\n${source || ""}:${lineno || ""}:${colno || ""}\n${safeToString(error)}`);
    } catch {
      // ignore
    }
    return false;
  };

  // Required by your ask: unhandledrejection
  window.addEventListener("unhandledrejection", (event) => {
    try {
      const reason = (event as PromiseRejectionEvent).reason;
      const msg = formatErrorTitle("unhandledrejection", safeToString(reason));
      log(msg, { reason: safeToString(reason) });
      showBanner(`${msg}\n${safeToString(reason)}`);

      // Don’t let this crash the app in some browsers.
      event.preventDefault?.();
    } catch {
      // ignore
    }
  });

  // Also capture resource/script load errors (img/script/css) early.
  window.addEventListener(
    "error",
    ((event: Event) => {
      try {
        const target = event.target;
        if (!target || !(target instanceof HTMLElement)) return;

        const maybeUrlTarget = target as HTMLElement & { src?: string; href?: string };
        const url = String(maybeUrlTarget.src || maybeUrlTarget.href || "");
        const isResourceError = Boolean(url);
        if (!isResourceError) return;

        const msg = formatErrorTitle("resource error", url);
        log(msg, { url, tagName: target.tagName });
        showBanner(`${msg}`);
      } catch {
        // ignore
      }
    }) as EventListener,
    true
  );
};

// Optional helper to delay expensive setup until full load.
export const onFullPageLoad = async (fn: () => void) => {
  try {
    await whenDomReady("complete");
    fn();
  } catch {
    // ignore
  }
};

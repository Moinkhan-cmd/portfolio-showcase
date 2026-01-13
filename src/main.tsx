import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { setupGlobalErrorLogger } from "@/lib/errorLogger";

const start = () => {
	try {
		setupGlobalErrorLogger();
	} catch {
		// Never block app startup.
	}

	const rootEl = document.getElementById("root");
	if (!rootEl) {
		console.error("Root element #root not found.");
		return;
	}

	createRoot(rootEl).render(<App />);
};

if (typeof document !== "undefined" && document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", start, { once: true });
} else {
	start();
}

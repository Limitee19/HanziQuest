import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// Design System V3 fonts (bundled, offline)
import "@fontsource-variable/bricolage-grotesque"; // display: identitas heading
import "@fontsource-variable/plus-jakarta-sans"; // body/UI: teks utama
import "@fontsource-variable/inter"; // fallback + micro-label dense
import "@fontsource-variable/jetbrains-mono"; // data/mono (tabular-nums)
import "./index.css";
import "./hanzi-quest.css";

// Catch any unhandled startup errors or rejections before React mounts
window.addEventListener("error", (event) => {
  console.error("Global window error caught:", event.error || event.message);
  const rootEl = document.getElementById("root");
  if (rootEl && !rootEl.children.length) {
    rootEl.innerHTML = `
      <div style="background:#090d16;color:#f87171;padding:2rem;height:100vh;font-family:sans-serif;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;">
        <h2 style="font-size:1.25rem;font-weight:bold;margin-bottom:0.5rem;">Gagal Memuat Aplikasi (Startup Error)</h2>
        <p style="font-size:0.875rem;color:#94a3b8;max-width:500px;word-break:break-all;">${event.error?.message || event.message}</p>
        <button onclick="window.location.reload()" style="margin-top:1rem;padding:0.5rem 1rem;background:#2563eb;color:#fff;border:none;border-radius:0.5rem;cursor:pointer;font-weight:bold;">Muat Ulang</button>
      </div>
    `;
  }
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise rejection:", event.reason);
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

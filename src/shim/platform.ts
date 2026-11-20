/**
 * Where HyperMixer is running: a browser tab, an installed web app, or the
 * iOS / Android app (an Expo shell around this same site, see mobile/).
 */
type AppBridge = { platform: "ios" | "android" };
const app = (window as unknown as { __hypermixerApp?: AppBridge }).__hypermixerApp;
const rn = (window as unknown as { ReactNativeWebView?: { postMessage(s: string): void } }).ReactNativeWebView;

export const isNative = !!(app && rn);
export const platform: "web" | "ios" | "android" = app?.platform ?? "web";
export const isMobile = isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Sends a message to the native shell. */
export const postToApp = (m: unknown) => rn?.postMessage(JSON.stringify(m));

/** API calls are same-origin everywhere: the apps load the hosted site. VITE_API_BASE can point a self-hosted build elsewhere. */
const base = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";
export const apiUrl = (path: string) => base + path;

import { Capacitor } from "@capacitor/core";

/**
 * Where HyperMixer is running. On the web the page and its /api functions share
 * an origin. Inside the iOS and Android apps the page is bundled into the app,
 * so API calls go to the hosted site instead (VITE_API_BASE, set at build time).
 */
export const isNative = Capacitor.isNativePlatform();
export const platform = Capacitor.getPlatform() as "web" | "ios" | "android";
export const isMobile = isNative || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const DEFAULT_API = "https://hyperdistribution-studio.vercel.app";
const base = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") || (isNative ? DEFAULT_API : "");

export const apiUrl = (path: string) => base + path;

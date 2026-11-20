import type { CapacitorConfig } from "@capacitor/cli";

/**
 * iOS and Android apps. The web build in dist/ is bundled into each app; its
 * AI and link-reading calls go to the hosted site (VITE_API_BASE in npm run build:app).
 */
const config: CapacitorConfig = {
  appId: "com.kraftxworks.hypermixer",
  appName: "HyperMixer",
  webDir: "dist",
  backgroundColor: "#F4F5FA",
  ios: { contentInset: "never", scheme: "HyperMixer" },
  android: { allowMixedContent: false },
  plugins: {
    SplashScreen: { launchShowDuration: 800, launchAutoHide: true, backgroundColor: "#F4F5FA", showSpinner: false },
  },
};

export default config;

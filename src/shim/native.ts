import { App } from "@capacitor/app";
import { Directory, Filesystem } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { SplashScreen } from "@capacitor/splash-screen";
import { StatusBar, Style } from "@capacitor/status-bar";
import { isNative, platform } from "./platform";

type Win = Window & { toast?: (m: string) => void };

async function toBase64(b: Blob) {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}

/**
 * Saves a file out of the app. Web: a normal download. iOS and Android: the
 * file is written to the app's cache and handed to the share sheet, where
 * "Save Video", Files, Instagram and the rest are one tap away.
 */
export async function saveFile(blob: Blob, name: string) {
  if (!isNative) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 60_000);
    return;
  }
  try {
    const { uri } = await Filesystem.writeFile({ path: name, data: await toBase64(blob), directory: Directory.Cache });
    await Share.share({ title: name, files: [uri] });
  } catch (e) {
    if (!/cancel/i.test(String((e as Error)?.message))) (window as Win).toast?.("Couldn't share that file");
  }
}

/** Adds a Save / Share button under each finished video in the apps. */
function addVideoButtons() {
  const add = (v: HTMLVideoElement) => {
    if (v.dataset.hmShare || !v.classList.contains("rvid")) return;
    v.dataset.hmShare = "1";
    const b = document.createElement("button");
    b.className = "btn sm";
    b.textContent = "Save or share";
    b.style.marginTop = "6px";
    b.onclick = async () => {
      const src = v.currentSrc || v.src;
      const blob = await fetch(src).then((r) => r.blob()).catch(() => null);
      if (blob) await saveFile(blob, `hypermixer-${Date.now()}.mp4`);
    };
    v.insertAdjacentElement("afterend", b);
  };
  document.querySelectorAll<HTMLVideoElement>("video.rvid").forEach(add);
  new MutationObserver((muts) => {
    for (const m of muts) m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      const el = n as Element;
      if (el.matches("video.rvid")) add(el as HTMLVideoElement);
      el.querySelectorAll<HTMLVideoElement>("video.rvid").forEach(add);
    });
  }).observe(document.body, { subtree: true, childList: true });
}

/** App chrome for the iOS and Android builds. Does nothing on the web. */
export function setupNative() {
  document.documentElement.dataset.platform = platform;
  if (!isNative) return;
  const dark = matchMedia("(prefers-color-scheme: dark)");
  const paint = () => StatusBar.setStyle({ style: dark.matches ? Style.Dark : Style.Light }).catch(() => {});
  paint();
  dark.addEventListener("change", paint);
  // Android back button closes an open panel first, then leaves the app.
  App.addListener("backButton", () => {
    const close = document.querySelector<HTMLElement>("#panel [data-close]");
    if (close && !document.getElementById("overlay")?.hidden) close.click();
    else App.exitApp();
  });
  addVideoButtons();
  SplashScreen.hide().catch(() => {});
}

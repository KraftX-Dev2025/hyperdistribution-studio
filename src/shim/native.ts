import { isNative, platform, postToApp } from "./platform";

/**
 * Bits that differ inside the iOS and Android apps. The apps are an Expo shell
 * (mobile/App.tsx) that loads this site; the shell handles the back button,
 * splash and status bar, and saves files through the native share sheet.
 */

const CHUNK = 1_500_000; // bytes per message to the shell (base64 grows it by a third)

function base64(bytes: Uint8Array) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(s);
}

/**
 * Saves a file out of HyperMixer. Web: a normal download. Apps: the file goes to
 * the share sheet, where Save Video, Files, Instagram and the rest are one tap away.
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
  const id = crypto.randomUUID();
  postToApp({ type: "save-start", id, name, mime: blob.type || "application/octet-stream" });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  for (let i = 0; i < bytes.length; i += CHUNK) postToApp({ type: "save-chunk", id, data: base64(bytes.subarray(i, i + CHUNK)) });
  postToApp({ type: "save-end", id });
}

/** Adds a Save or share button under each finished video in the apps. */
function addVideoButtons() {
  const add = (v: HTMLVideoElement) => {
    if (v.dataset.hmShare) return;
    v.dataset.hmShare = "1";
    const b = document.createElement("button");
    b.className = "btn sm";
    b.textContent = "Save or share";
    b.style.marginTop = "6px";
    b.onclick = async () => {
      const blob = await fetch(v.currentSrc || v.src).then((r) => r.blob()).catch(() => null);
      if (blob) await saveFile(blob, `hypermixer-${Date.now()}.mp4`);
    };
    v.insertAdjacentElement("afterend", b);
  };
  const scan = (root: ParentNode) => root.querySelectorAll<HTMLVideoElement>("video.rvid").forEach(add);
  scan(document);
  new MutationObserver((muts) => {
    for (const m of muts) m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if ((n as Element).matches("video.rvid")) add(n as HTMLVideoElement);
      scan(n as Element);
    });
  }).observe(document.body, { subtree: true, childList: true });
}

export function setupNative() {
  document.documentElement.dataset.platform = platform;
  if (isNative) addVideoButtons();
}

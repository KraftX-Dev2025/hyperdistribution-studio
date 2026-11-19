import { useRef, useState } from "react";
import { exportWorkspace, useStore } from "../lib/store";
import { emptyWorkspace, type Workspace } from "../lib/types";
import { useToast } from "../ui";

export function Settings() {
  const { ws, update, replace } = useStore();
  const toast = useToast();
  const [show, setShow] = useState(false);
  const file = useRef<HTMLInputElement>(null);

  const importFile = async (f: File) => {
    try {
      const data = JSON.parse(await f.text()) as Workspace;
      if (data.version !== 1 || !Array.isArray(data.brands)) throw new Error();
      replace({ ...data, settings: { ...data.settings, apiKey: ws.settings.apiKey } });
      toast("Workspace imported");
    } catch {
      toast("That file isn't a HyperDistribution workspace", true);
    }
  };

  return (
    <>
      <div className="head"><h1>Settings</h1></div>
      <div className="card stack">
        <h2>Claude API key</h2>
        <p className="muted">
          Get one at <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noreferrer">platform.claude.com</a>. It's stored only in this browser and sent with each AI request to this app's server, which passes it to Anthropic and never saves it. You pay Anthropic for what you use.
        </p>
        <div className="row">
          <input className="i" style={{ maxWidth: 460 }} type={show ? "text" : "password"} placeholder="sk-ant-..." value={ws.settings.apiKey} autoComplete="off"
            onChange={(e) => update((d) => { d.settings.apiKey = e.target.value.trim(); })} />
          <button className="btn" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
        </div>
      </div>

      <div className="card stack">
        <h2>Remotion license</h2>
        <p className="muted">
          Video export uses <a href="https://www.remotion.dev" target="_blank" rel="noreferrer">Remotion</a>. It's free for individuals and companies of up to 3 people; larger companies need a <a href="https://www.remotion.dev/license" target="_blank" rel="noreferrer">company license</a>. Enter your license key, or type <span className="mono">free-license</span> if you qualify for the free one.
        </p>
        <input className="i" style={{ maxWidth: 460 }} placeholder="free-license" value={ws.settings.remotionLicense}
          onChange={(e) => update((d) => { d.settings.remotionLicense = e.target.value.trim(); })} />
      </div>

      <div className="card stack">
        <h2>Your workspace</h2>
        <p className="muted">Brands, posts, ideas and scripts live in this browser's storage. Export a backup to move them to another computer. The API key is never included.</p>
        <div className="row">
          <button className="btn" onClick={() => exportWorkspace(ws)}>Export backup</button>
          <button className="btn" onClick={() => file.current?.click()}>Import backup</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={(e) => e.target.files?.[0] && importFile(e.target.files[0])} />
          <button className="btn danger" onClick={() => {
            if (confirm("Delete every brand, post, idea and script in this browser? Export a backup first if you want to keep them.")) {
              replace({ ...emptyWorkspace(), settings: ws.settings });
              toast("Workspace cleared");
            }
          }}>Clear workspace</button>
        </div>
      </div>
    </>
  );
}

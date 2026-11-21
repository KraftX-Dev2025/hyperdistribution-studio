/* HyperMixer's six modules: Connect, Brands, Approve, Edit, Publish, Dashboard.
   This is the whole visible app. The board script (app.js) loaded before it is the
   engine: it owns the data (S), the brand hub and post editor panels, and Claude calls. */
(() => {
  const root = document.getElementById("six");
  if (!root || typeof S === "undefined") return;
  document.body.classList.add("six");
  root.hidden = false;

  const TABS = [
    ["brands", "Brands", '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="6" rx="2"/>'],
    ["approve", "Approve", '<path d="M5 12l5 5 9-10"/>'],
    ["edit", "Edit", '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M10 9l5 3-5 3z"/>'],
    ["publish", "Publish", '<path d="M21 3L10 14M21 3l-7 18-4-7-7-4z"/>'],
    ["dashboard", "Dashboard", '<path d="M5 20V10M12 20V4M19 20v-7"/>'],
  ];
  const svg = (d, s = 22) => `<svg aria-hidden="true" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const IC = { plus: '<path d="M12 5v14M5 12h14"/>', link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', check: '<path d="M5 12l5 5 9-10"/>' };

  const ui = { get: (k, d) => { try { return localStorage.getItem("hm:six:" + k) ?? d; } catch (_) { return d; } }, set: (k, v) => { try { localStorage.setItem("hm:six:" + k, v); } catch (_) {} } };
  const conn = () => window.__hds.conn.get();
  const X = { tab: ui.get("tab", "brands"), making: {}, dragging: false, skipUndo: null };
  if (!conn().claude) X.tab = "connect";

  /* ---------- data ---------- */
  const isVid = f => bkVid(f);
  const week = () => weekDays(0).map(ymd);
  const live = p => !p.skipped;
  const posts = () => S.posts.filter(live);
  const pending = bid => posts().filter(p => !p.approved && (p.status === "idea" || p.status === "drafting") && (!bid || p.brandId === bid)).sort((a, b) => (a.date || "9").localeCompare(b.date || "9") || (a.createdAt || 0) - (b.createdAt || 0));
  const approved = bid => posts().filter(p => p.approved && p.status !== "posted" && (!bid || p.brandId === bid));
  const rOf = p => renderFor(p.id);
  const inEdit = bid => approved(bid).filter(p => isVid(p.format) && rOf(p) && rOf(p).status !== "done" && rOf(p).status !== "cancelled");
  const readyVids = bid => approved(bid).filter(p => isVid(p.format) && rOf(p)?.status === "done");
  const publishable = bid => approved(bid).filter(p => !inEdit().includes(p)).sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));
  const postedThisWeek = bid => { const w = week(); return posts().filter(p => p.status === "posted" && w.includes(p.date) && (!bid || p.brandId === bid)).length; };
  const target = b => chans(b).reduce((n, c) => n + (+c.cadence || 0), 0);
  const brands = () => S.brands.filter(b => b.status !== "paused").sort((a, b) => (a.order ?? 999) - (b.order ?? 999) || String(a.name).localeCompare(String(b.name)));
  const chLabel = (b, p) => { const c = chanOf(b, p.channelId); return c ? cmeta(c).label : (p.platform || ""); };
  const when = p => p.date ? (p.date === todayStr() ? "Today" : fmtDate(p.date)) : "No date";
  const monoHtml = b => { const L = safeUrl(b?.logo); return `<span class="mono" aria-hidden="true">${L ? `<img src="${esc(L)}" alt="">` : esc(initials(b))}</span>`; };

  /* ---------- actions ---------- */
  function go(tab) { X.tab = tab; if (tab !== "connect") ui.set("tab", tab); draw(); window.scrollTo(0, 0); }

  async function makeWeek(ids) {
    if (!conn().claude) { toast("Add your Claude key first"); return go("connect"); }
    const list = ids.map(brandById).filter(Boolean);
    const start = todayStr();
    let made = 0, lastErr = null;
    await pool(list, 3, async b => {
      let cs = chans(b).filter(c => +c.cadence > 0);
      if (!cs.length) cs = chans(b).slice(0, 3);
      if (!cs.length) { lastErr = { message: `${b.name} has no channels yet. Open the brand and add one.` }; return; }
      X.making[b.id] = "Writing posts…"; draw();
      const slots = []; let left = 12;
      cs.forEach(c => { const n = Math.min(left, Math.max(1, Math.min(7, +c.cadence || 1))); if (n > 0) { slots.push({ c, n, dates: slotDates(start, 7, n) }); left -= n; } });
      const chList = slots.map(s => ({ channelId: s.c.id, platform: cmeta(s.c).label, handle: s.c.handle, allowedFormats: cmeta(s.c).formats, count: s.n, dates: s.dates }));
      const dumps = S.dumps.filter(d => d.brandId === b.id && !d.used).slice(0, 25).map(d => (d.text || "").slice(0, 400));
      const recent = S.posts.filter(p => p.brandId === b.id).slice(-25).map(p => p.title);
      const prompt = `${BASE_VOICE}

You are this brand's content team. Write finished, ready-to-post content, not ideas.
Brand (JSON): ${JSON.stringify(brandBrief(b))}
Sources to mine first: raw notes ${JSON.stringify(dumps)}. Then the brand's content pillars and hooks. Reuse one strong idea across this brand's channels with a native angle per platform.
Don't repeat these recent posts: ${JSON.stringify(recent)}
Channels and how many posts each (use the given dates in order): ${JSON.stringify(chList)}

For each post write: a scroll-stopping hook for that platform; the full caption, post body or video script (videos: beat-by-beat with on-screen text and voiceover lines, 20-45 seconds); 3-8 platform-appropriate hashtags where hashtags are used (empty otherwise); a short CTA.
Reply with only a JSON array, one object per post: {"channelId":"","date":"YYYY-MM-DD","format":"<one of allowedFormats>","title":"<hook>","notes":"<full caption or script, under 160 words>","hashtags":["#..."],"cta":""}`;
      try {
        const out = await S.sample.json(prompt, { modelTier: "default" });
        for (const o of (Array.isArray(out) ? out : [])) {
          const c = chanOf(b, o?.channelId); if (!c || !o.title) continue;
          const fm = cmeta(c).formats, tags = Array.isArray(o.hashtags) ? o.hashtags.slice(0, 10).map(String) : [];
          const notes = String(o.notes || "") + (o.cta ? `\n\n${o.cta}` : "") + (tags.length ? `\n\n${tags.join(" ")}` : "");
          await S.db.collection("posts").doc("p" + Date.now().toString(36) + uid()).set({ brandId: b.id, channelId: c.id, platform: c.platform, title: String(o.title).slice(0, 300), notes, format: fm.includes(o.format) ? o.format : fm[0], date: /^\d{4}-\d{2}-\d{2}$/.test(o.date || "") ? o.date : start, status: "drafting", approved: false, link: "", createdAt: Date.now(), updatedAt: Date.now() });
          made++;
        }
      } catch (e) { lastErr = e; }
      delete X.making[b.id]; draw();
    });
    if (made) { toast(`${made} posts ready to approve`); go("approve"); }
    else toast(lastErr?.code ? sampleErr(lastErr) : (lastErr?.message || "Nothing came back. Try again."));
  }

  async function approve(p) {
    const b = brandById(p.brandId), c = chanOf(b, p.channelId);
    try {
      const vid = isVid(p.format) && b && c && !rOf(p);
      const edit = vid ? { style: styleNames()[0], lengthSec: 30, music: "", aspect: /YouTube|Vimeo|Twitch|Podcast/i.test(cmeta(c).label) && !/Short/i.test(p.format) ? "16:9" : "9:16", notes: "", clips: [], avatarMode: "none" } : null;
      await S.db.collection("posts").doc(p.id).update({ approved: true, status: "scheduled", date: p.date || todayStr(), ...(edit ? { edit } : {}), updatedAt: Date.now() });
      if (edit) await S.db.collection("renders").doc().set({ postId: p.id, brandId: b.id, brand: b.name, channel: cmeta(c).label, handle: c.handle || "", title: p.title, script: p.notes || "", format: p.format, ...edit, brain: b.brain ? { personality: b.brain.personality, visual: b.brain.visual, language: b.brain.language } : null, avatar: null, colors: [b.color, b.color2], status: "queued", requestedAt: Date.now(), updatedAt: Date.now() });
    } catch (e) { denied(e); }
  }
  async function skip(p) {
    try { await S.db.collection("posts").doc(p.id).update({ skipped: true, updatedAt: Date.now() }); X.skipUndo = p.id; } catch (e) { denied(e); }
  }
  async function undoSkip() {
    const id = X.skipUndo; X.skipUndo = null; if (!id) return;
    try { await S.db.collection("posts").doc(id).update({ skipped: false, updatedAt: Date.now() }); } catch (e) { denied(e); }
  }
  async function retry(p) {
    const r = rOf(p); if (!r) return;
    try { await S.db.collection("renders").doc(r.id).update({ status: "queued", error: "", progress: 0, requestedAt: Date.now(), updatedAt: Date.now() }); toast("Trying again"); } catch (e) { denied(e); }
  }
  async function markPosted(p) {
    try { await S.db.collection("posts").doc(p.id).update({ status: "posted", date: todayStr(), postedAt: Date.now(), updatedAt: Date.now() }); toast("Marked as posted"); } catch (e) { denied(e); }
  }
  async function saveVideo(p) {
    const url = rOf(p)?.output?.assetUrl; if (!url) return;
    try { const blob = await (await fetch(url)).blob(); await S.downloads.save({ filename: `${slug(brandById(p.brandId)?.name || "video")}-${slug(p.title).slice(0, 40) || "post"}.mp4`, data: blob }); }
    catch (_) { toast("Couldn't save that video"); }
  }
  function publishSheet(p) {
    const b = brandById(p.brandId), c = chanOf(b, p.channelId), vid = safeUrl(rOf(p)?.output?.assetUrl), link = safeUrl(c?.url) || (c?.handle ? safeUrl(profileUrl(c.platform, c.handle)) : "");
    openPanel(`<div class="panel-h"><h2>Publish</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
      <div class="sx-sheet" style="display:flex;flex-direction:column;gap:12px">
        <div class="sx-muted">${esc(b?.name || "")} · ${esc(chLabel(b, p))} · ${esc(when(p))}</div>
        <b style="font-size:18px;line-height:1.25">${esc(p.title)}</b>
        ${vid ? `<video class="rvid" src="${esc(vid)}" controls playsinline preload="metadata" style="max-height:320px;border-radius:14px;background:#000"></video>` : ""}
        <label class="sx-lbl" for="sxCap">Caption</label><textarea id="sxCap">${esc(p.notes || "")}</textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="sx-btn soft sm" id="sxCopy">Copy caption</button>${vid ? `<button class="sx-btn soft sm" id="sxSave">Save or share video</button>` : ""}${link ? `<a class="sx-btn soft sm" href="${esc(link)}" target="_blank" rel="noopener">Open ${esc(chLabel(b, p))}</a>` : ""}</div>
        <p class="sx-muted" style="margin:0">Post it on ${esc(chLabel(b, p))} with the caption and video above, then mark it here.</p>
        <button class="sx-btn" id="sxDone">Mark as posted</button></div>`);
    $("sxCopy").onclick = async () => { try { await navigator.clipboard.writeText($("sxCap").value); toast("Caption copied"); } catch (_) { $("sxCap").select(); toast("Select and copy the caption"); } };
    if ($("sxSave")) $("sxSave").onclick = () => saveVideo(p);
    $("sxDone").onclick = async () => { const t = $("sxCap").value; if (t !== (p.notes || "")) { try { await S.db.collection("posts").doc(p.id).update({ notes: t }); } catch (_) {} } await markPosted(p); closePanel(); };
  }

  /* ---------- screens ---------- */
  const head = (title, sub, right = "") => `<header class="sx-head"><div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div><div style="display:flex;gap:8px">${right}<button class="sx-icon" data-go="connect" aria-label="Connect accounts">${svg(IC.link, 20)}</button></div></header>`;
  const empty = (t, s, btn = "") => `<div class="sx-empty"><b>${t}</b><span class="sx-muted" style="font-size:15px;max-width:34ch">${s}</span>${btn}</div>`;

  function vConnect() {
    const c = conn(), n = S.media.length;
    const row = (title, sub, right, extra = "") => `<div class="sx-row" style="align-items:flex-start;padding-top:14px;padding-bottom:14px"><div class="t"><b>${title}</b><span>${sub}</span>${extra}</div>${right}</div>`;
    const okTag = '<span class="sx-ok">Connected</span>';
    return `<header class="sx-head"><div><h1>Connect</h1><p>Link things once. Keys stay on this device.</p></div></header>
    <main class="sx-main">
      <div class="sx-card">
        ${row("Claude", c.claude ? "Writes your posts in each brand's voice." : 'Needed to write posts. Get a key at <a href="https://platform.claude.com/settings/keys" target="_blank" rel="noopener">platform.claude.com</a>.', c.claude ? okTag : "", c.claude ? `<button class="sx-btn soft sm" data-clear="claude" style="align-self:flex-start;margin-top:8px">Remove key</button>` : `<input type="password" id="sxKey" autocomplete="off" placeholder="sk-ant-…" aria-label="Claude API key"><button class="sx-btn sm" data-save="claude" data-from="sxKey" style="align-self:flex-start;margin-top:8px">Save key</button>`)}
        ${row("Your media", n ? `${n} photos and clips ready for videos.` : "Photos, clips and music for your videos.", n ? okTag : "", `<span id="sxFolder" style="display:block;margin-top:6px">${window.__hds.folderNote()}</span>`)}
        ${row("Video engine", c.license ? "Videos are cut on this device with Remotion." : 'Videos are cut on this device with <a href="https://www.remotion.dev/license" target="_blank" rel="noopener">Remotion</a>. It is free for individuals and companies of up to 3 people; larger companies need a company license key.', c.license ? okTag : "", c.license ? "" : `<input type="text" id="sxLic" autocomplete="off" placeholder="Company license key" aria-label="Remotion license key"><span style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="sx-btn sm" data-free>We're 3 people or fewer</button><button class="sx-btn soft sm" data-save="license" data-from="sxLic">Save key</button></span>`)}
      </div>
      <p class="sx-lbl">Optional</p>
      <div class="sx-card">
        ${row("HeyGen", "Avatar videos read to camera. Uses your HeyGen credits.", c.heygen ? okTag : "", c.heygen ? `<button class="sx-btn soft sm" data-clear="heygen" style="align-self:flex-start;margin-top:8px">Remove key</button>` : `<input type="password" id="sxHg" autocomplete="off" placeholder="HeyGen API key" aria-label="HeyGen API key"><button class="sx-btn soft sm" data-save="heygen" data-from="sxHg" style="align-self:flex-start;margin-top:8px">Save key</button>`)}
        ${row("Google Drive", "Backs up brands, posts and videos to your Drive.", c.driveConnected ? okTag : c.driveAvailable ? `<button class="sx-btn soft sm" data-drive="on">Connect</button>` : '<span class="sx-muted">Coming soon</span>', c.driveConnected ? `<button class="sx-btn soft sm" data-drive="off" style="align-self:flex-start;margin-top:8px">Disconnect</button>` : "")}
        ${row("Instagram, YouTube, LinkedIn and others", "Add each brand's channels on its card. Posting straight to them is coming; for now Publish hands you the caption and video to post.", "")}
      </div>
      <button class="sx-btn" data-go="${ui.get("tab", "brands")}" ${c.claude ? "" : "disabled"}>${c.claude ? "Continue" : "Add your Claude key to continue"}</button>
      <button class="sx-btn soft" data-backup>Back up or restore my data</button>
    </main>`;
  }

  function vBrands() {
    const bs = brands();
    const add = `<button class="sx-icon fill" data-newbrand aria-label="Add brand">${svg(IC.plus, 20)}</button>`;
    if (!bs.length) return head("Brands", "", add) + `<main class="sx-main">${empty("Add your first brand", "Paste its website or a profile link and HyperMixer learns how it talks.", `<button class="sx-btn" data-newbrand>Add a brand</button>`)}</main>`;
    return head("Brands", "", add) + `<main class="sx-main">${bs.map(b => {
      const tg = target(b), busy = X.making[b.id], pn = pending(b.id).length;
      return `<div class="sx-card" style="${bvars(b)}"><button class="sx-band" data-brand="${esc(b.id)}" aria-label="Open ${esc(b.name)}">${monoHtml(b)}<span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.name)}</span></button>
        <div class="sx-pad" style="display:flex;flex-direction:column;gap:12px">
          <div class="sx-muted" style="font-size:15px">${esc(b.brain?.summary || b.tagline || "Open the brand to teach HyperMixer how it talks.").slice(0, 150)}</div>
          <div class="sx-stats"><div class="sx-stat"><b>${pn}</b><span>to approve</span></div><div class="sx-stat"><b>${inEdit(b.id).length}</b><span>in editing</span></div><div class="sx-stat"><b>${postedThisWeek(b.id)}${tg ? ` / ${tg}` : ""}</b><span>posted this week</span></div></div>
          ${pn ? `<button class="sx-btn" data-approvebrand="${esc(b.id)}">Approve ${pn} post${pn === 1 ? "" : "s"}</button><button class="sx-btn soft" data-make="${esc(b.id)}" ${busy ? "disabled" : ""}>${busy || "Make more posts"}</button>` : `<button class="sx-btn" data-make="${esc(b.id)}" ${busy ? "disabled" : ""}>${busy || "Make this week's posts"}</button>`}
        </div></div>`;
    }).join("")}${bs.length > 1 ? `<button class="sx-btn soft" data-makeall ${Object.keys(X.making).length ? "disabled" : ""}>Make this week's posts for all ${bs.length} brands</button>` : ""}</main>`;
  }

  function vApprove() {
    const q = pending(X.brandFilter), p = q[0], total = q.length;
    const undo = X.skipUndo ? `<button class="sx-btn soft sm" data-undo>Undo skip</button>` : "";
    if (!p) { X.brandFilter = null; const more = pending().length; return head("Approve", "") + `<main class="sx-main">${empty("All caught up", approved().length ? "Approved posts are on the editing board and in Publish." : "Make this week's posts from a brand card and they land here.", (more ? `<button class="sx-btn" data-go="approve">See ${more} from other brands</button>` : approved().length ? `<button class="sx-btn" data-go="edit">Open editing board</button>` : `<button class="sx-btn" data-go="brands">Go to Brands</button>`) + undo)}</main>`; }
    const b = brandById(p.brandId);
    return head("Approve", `${total} left${X.brandFilter && b ? ` for ${esc(b.name)}` : ""}`) + `<main class="sx-main">
      <div class="sx-deck">${total > 1 ? '<div class="sx-under" aria-hidden="true"></div>' : ""}
        <article class="sx-swipe" id="sxCard" style="${bvars(b)}" data-id="${esc(p.id)}">
          <span class="sx-stamp yes" aria-hidden="true">APPROVE</span><span class="sx-stamp no" aria-hidden="true">SKIP</span>
          <div class="sx-hero"><span class="sx-pill">${esc(b?.name || "")}</span><span class="sx-hook">${esc(p.title)}</span></div>
          <div class="sx-cap"><span class="sx-lbl">${esc(chLabel(b, p))} · ${esc(p.format || "")} · ${esc(when(p))}</span><p>${esc(p.notes || "")}</p></div>
        </article></div>
      <div class="sx-acts"><button class="sx-round" data-skip aria-label="Skip this post">${svg(IC.x, 26)}</button><button class="sx-btn soft sm" data-change>Change it</button><button class="sx-round yes" data-yes aria-label="Approve this post">${svg(IC.check, 28)}</button></div>
      ${undo ? `<div style="display:flex;justify-content:center">${undo}</div>` : ""}</main>`;
  }

  function vEdit() {
    const now = inEdit(), ready = readyVids();
    if (!now.length && !ready.length) return head("Editing board", "") + `<main class="sx-main">${empty("Nothing in editing", "Approve a video post and it is cut here on its own.", `<button class="sx-btn" data-go="approve">Go to Approve</button>`)}</main>`;
    const rowNow = p => { const r = rOf(p), b = brandById(p.brandId), f = r.status === "failed", pc = Math.max(0, Math.min(100, +r.progress || 0));
      return `<div class="sx-row" style="${bvars(b)}"><span class="sx-thumb" aria-hidden="true"></span><div class="t"><b>${esc(p.title)}</b><span>${esc(b?.name || "")} · ${f ? "" : r.status === "rendering" ? "Editing now" : "Waiting its turn"}</span>${f ? `<span class="sx-warn" style="white-space:normal">${esc(r.error || "Couldn't make this video.")}</span>` : `<div class="sx-bar" role="img" aria-label="${pc} percent done"><i style="width:${r.status === "rendering" ? Math.max(4, pc) : 0}%"></i></div>`}</div>${f ? `<button class="sx-btn soft sm" data-retry="${esc(p.id)}">Try again</button>` : `<b style="font-size:15px">${r.status === "rendering" ? pc + "%" : ""}</b>`}</div>`; };
    return head("Editing board", "Approved videos are cut on their own. Keep this open while they finish.") + `<main class="sx-main">
      ${now.length ? `<p class="sx-lbl">Editing now · ${now.length}</p><div class="sx-card">${now.map(rowNow).join("")}</div>` : ""}
      ${ready.length ? `<p class="sx-lbl">Ready to review · ${ready.length}</p><div class="sx-vgrid">${ready.map(p => { const b = brandById(p.brandId); return `<div class="sx-vid"><video class="rvid" src="${esc(safeUrl(rOf(p).output?.assetUrl))}" controls playsinline preload="metadata"></video><b>${esc(p.title)}</b><span class="sx-muted">${esc(b?.name || "")}</span><button class="sx-btn soft sm" data-open="${esc(p.id)}">Change it</button></div>`; }).join("")}</div>
      <button class="sx-btn" data-go="publish">Go to Publish</button>` : ""}</main>`;
  }

  function vPublish() {
    const list = publishable(), t = todayStr(), wk = week(), done = posts().filter(p => p.status === "posted" && wk.includes(p.date));
    if (!list.length && !done.length) return head("Publish", "") + `<main class="sx-main">${empty("Nothing to publish yet", inEdit().length ? "Your videos are still being edited." : "Approved posts show up here when they're ready.", `<button class="sx-btn" data-go="${inEdit().length ? "edit" : "approve"}">${inEdit().length ? "Open editing board" : "Go to Approve"}</button>`)}</main>`;
    const row = (p, posted) => { const b = brandById(p.brandId), v = safeUrl(rOf(p)?.output?.assetUrl);
      return `<div class="sx-row" style="${bvars(b)}">${v ? `<video class="sx-thumb" src="${esc(v)}" preload="metadata" muted playsinline aria-hidden="true"></video>` : `<span class="sx-thumb" style="height:48px;width:36px" aria-hidden="true"></span>`}<div class="t"><b>${esc(p.title)}</b><span>${esc(b?.name || "")} · ${esc(chLabel(b, p))} · ${esc(when(p))}</span></div>${posted ? '<span class="sx-ok">Posted</span>' : `<button class="sx-btn sm" data-pub="${esc(p.id)}">Post</button>`}</div>`; };
    const due = list.filter(p => !p.date || p.date <= t), later = list.filter(p => p.date && p.date > t);
    return head("Publish", list.length ? `${list.length} post${list.length === 1 ? " is" : "s are"} ready.` : "Everything for now is posted.") + `<main class="sx-main">
      ${due.length ? `<p class="sx-lbl">Due now · ${due.length}</p><div class="sx-card">${due.map(p => row(p)).join("")}</div>` : ""}
      ${later.length ? `<p class="sx-lbl">Coming up · ${later.length}</p><div class="sx-card">${later.map(p => row(p)).join("")}</div>` : ""}
      ${done.length ? `<p class="sx-lbl">Posted this week · ${done.length}</p><div class="sx-card">${done.slice(-8).reverse().map(p => row(p, true)).join("")}</div>` : ""}</main>`;
  }

  function vDashboard() {
    const bs = brands();
    if (!bs.length) return head("Dashboard", "") + `<main class="sx-main">${empty("No brands yet", "Add a brand and its week shows up here.", `<button class="sx-btn" data-newbrand>Add a brand</button>`)}</main>`;
    const tg = bs.reduce((n, b) => n + target(b), 0), out = postedThisWeek();
    const behind = bs.find(b => target(b) && !pending(b.id).length && !approved(b.id).length && postedThisWeek(b.id) < target(b));
    const pn = pending().length, pb = publishable().length;
    const next = behind ? [`${esc(behind.name)} has nothing in the works this week.`, `Make posts for ${esc(behind.name)}`, `data-make="${esc(behind.id)}"`]
      : pn ? [`${pn} post${pn === 1 ? " is" : "s are"} waiting for your yes or no.`, `Approve ${pn} post${pn === 1 ? "" : "s"}`, 'data-go="approve"']
      : pb ? [`${pb} post${pb === 1 ? " is" : "s are"} ready to go out.`, "Go to Publish", 'data-go="publish"'] : null;
    return head("Dashboard", "All brands, this week") + `<main class="sx-main">
      <div class="sx-stats"><div class="sx-stat" style="background:var(--surface)"><b>${out}${tg ? ` / ${tg}` : ""}</b><span>posts out</span></div><div class="sx-stat" style="background:var(--surface)"><b>${pn}</b><span>to approve</span></div><div class="sx-stat" style="background:var(--surface)"><b>${inEdit().length}</b><span>in editing</span></div></div>
      ${next ? `<div class="sx-card sx-pad" style="display:flex;flex-direction:column;gap:10px"><span class="sx-lbl">Next best step</span><span style="font-size:16px;line-height:1.35">${next[0]}</span><button class="sx-btn" ${next[2]}>${next[1]}</button></div>` : ""}
      <div class="sx-card">${bs.map(b => { const t2 = target(b), o = postedThisWeek(b.id), pe = pending(b.id).length, ed = inEdit(b.id).length, ap = approved(b.id).length;
        const state = !t2 ? '<span class="sx-muted">No weekly target set</span>' : o >= t2 ? '<span class="sx-ok">Done for the week</span>' : (pe || ap) ? `<span class="sx-muted">${pe} to approve · ${ed} in editing · On track</span>` : '<span class="sx-warn">Behind: nothing in the works</span>';
        return `<div class="sx-pad" style="${bvars(b)};display:flex;flex-direction:column;gap:8px;border-top:1px solid var(--line)"><div style="display:flex;align-items:center;gap:10px"><b style="flex:1;font-size:17px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(b.name)}</b><b style="font-size:15px">${o}${t2 ? ` / ${t2}` : ""}</b></div><div class="sx-bar" role="img" aria-label="${o} of ${t2} posts out"><i style="width:${t2 ? Math.min(100, Math.round(o / t2 * 100)) : 0}%"></i></div>${state}</div>`; }).join("")}</div></main>`;
  }

  /* ---------- draw + wiring ---------- */
  const VIEWS6 = { connect: vConnect, brands: vBrands, approve: vApprove, edit: vEdit, publish: vPublish, dashboard: vDashboard };
  function draw() {
    if (X.dragging) return;
    const a = document.activeElement;
    if (a && root.contains(a) && /INPUT|TEXTAREA/.test(a.tagName) && a.value) return;   // don't wipe a key someone is typing
    if ([...root.querySelectorAll("video")].some(v => !v.paused && !v.ended)) return;   // nor a playing video
    const pn = pending().length, pb = publishable().length;
    const tabs = X.tab === "connect" ? "" : `<nav class="sx-tabs" aria-label="Modules">${TABS.map(([k, l, d]) => `<button data-go="${k}" ${X.tab === k ? 'aria-current="page"' : ""}>${svg(d)}${l}${k === "approve" && pn ? `<span class="n">${pn > 99 ? "99+" : pn}</span>` : k === "publish" && pb ? `<span class="n">${pb > 99 ? "99+" : pb}</span>` : ""}</button>`).join("")}</nav>`;
    root.innerHTML = (VIEWS6[X.tab] || vBrands)() + tabs;
    if (X.tab === "approve") wireSwipe();
  }

  function decide(card, yes) {
    const p = S.posts.find(x => x.id === card.dataset.id); if (!p) return;
    card.classList.add("anim"); card.style.transform = `translateX(${yes ? 520 : -520}px) rotate(${yes ? 14 : -14}deg)`; card.style.opacity = "0";
    if (yes) X.skipUndo = null;
    setTimeout(async () => { X.dragging = false; await (yes ? approve(p) : skip(p)); draw(); }, 220);
  }
  function wireSwipe() {
    const card = document.getElementById("sxCard"); if (!card) return;
    let x0 = 0, dx = 0, on = false;
    const stamp = (yes, no) => { card.querySelector(".sx-stamp.yes").style.opacity = yes; card.querySelector(".sx-stamp.no").style.opacity = no; };
    card.onpointerdown = e => { if (e.button) return; on = true; x0 = e.clientX; dx = 0; card.classList.remove("anim"); card.setPointerCapture(e.pointerId); };
    card.onpointermove = e => { if (!on) return; dx = e.clientX - x0; if (Math.abs(dx) > 6) X.dragging = true; card.style.transform = `translateX(${dx}px) rotate(${dx / 22}deg)`; stamp(Math.max(0, Math.min(1, dx / 90)), Math.max(0, Math.min(1, -dx / 90))); };
    const end = () => { if (!on) return; on = false; if (Math.abs(dx) > 90) return decide(card, dx > 0); X.dragging = false; card.classList.add("anim"); card.style.transform = ""; stamp(0, 0); };
    card.onpointerup = end; card.onpointercancel = end;
  }

  root.addEventListener("click", async e => {
    const t = e.target.closest("button,a"); if (!t || !root.contains(t)) return;
    const d = t.dataset, C = window.__hds.conn;
    if (d.go) return go(d.go);
    if ("newbrand" in d) return brandPanel(null);
    if (d.brand) return brandPanel(d.brand);
    if (d.make) return makeWeek([d.make]);
    if ("makeall" in d) return makeWeek(brands().map(b => b.id));
    if (d.approvebrand) { X.brandFilter = d.approvebrand; return go("approve"); }
    if (d.open) return postPanel(d.open);
    if (d.retry) return retry(S.posts.find(p => p.id === d.retry));
    if (d.pub) { const p = S.posts.find(x => x.id === d.pub); return p && publishSheet(p); }
    if ("undo" in d) { await undoSkip(); return draw(); }
    const card = document.getElementById("sxCard");
    if ("yes" in d && card) return decide(card, true);
    if ("skip" in d && card) return decide(card, false);
    if ("change" in d && card) return postPanel(card.dataset.id);
    if (d.save) { const v = document.getElementById(d.from)?.value.trim(); if (!v) return toast("Paste the key first"); C.set(d.save, v); document.activeElement?.blur(); toast("Saved"); return draw(); }
    if (d.clear) { C.set(d.clear, ""); return draw(); }
    if ("free" in d) { C.set("license", "free-license"); return draw(); }
    if (d.drive) { try { await (d.drive === "on" ? C.connectDrive() : C.disconnectDrive()); } catch (err) { toast(err?.message || "Couldn't connect Google Drive"); } return draw(); }
    if ("backup" in d) return window.__hds.settings();
  });
  window.addEventListener("hds:folder", () => { const el = document.getElementById("sxFolder"); if (el) el.innerHTML = window.__hds.folderNote(); });

  let timer = null;
  const soon = () => { clearTimeout(timer); timer = setTimeout(draw, 60); };
  ["brands", "posts", "renders", "media", "dumps"].forEach(c => { try { S.db?.collection(c).onSnapshot(soon, () => {}); } catch (_) {} });
  const boot = setInterval(() => { if (S.db) { clearInterval(boot); ["brands", "posts", "renders", "media"].forEach(c => S.db.collection(c).onSnapshot(soon, () => {})); } }, 200);
  if (S.db) clearInterval(boot);
  draw();
})();

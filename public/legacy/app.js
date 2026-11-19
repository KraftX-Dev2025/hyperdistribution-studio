/* Ported from the Distribution board. Runtime services come from src/shim. */
/* ================= platforms ================= */
const F = {
  short:["Short video","Reel","Live"], social:["Post","Image post","Carousel","Video","Story"],
  text:["Post","Thread","Image post","Video"], long:["Article","Blog post","Issue"],
  press:["Press pitch","Guest article","Founder feature","Funding news","Product launch"],
  community:["Post","AMA","Poll","Discussion"], chat:["Announcement","Message","Poll","Event"],
  app:["Release notes","Screenshots","Promo text / description","App preview video","In-app event","Review replies"],
  shop:["Listing","A+ / rich content","Product images","Product video","Sponsored ad","Deal / offer","Review replies"],
  qc:["Listing","Product images","Offer / deal","Sponsored ad","Search keywords"],
  food:["Menu update","Dish photos","Offer","Combo launch","Ad","Review replies"],
  travel:["Listing update","Photos","Offer","Review replies"]
};
const PLATFORMS = {
  instagram:{label:"Instagram",g:"IG",c:"#D6307A",cat:"Social",kind:"reel",formats:["Reel","Carousel","Image post","Story","Live","Broadcast channel"]},
  facebook:{label:"Facebook",g:"f",c:"#3B5FD9",cat:"Social",kind:"card",formats:["Post","Reel","Video","Live","Group post"]},
  x:{label:"X",g:"X",c:"#3A3F4B",cat:"Social",kind:"card",formats:["Post","Thread","Video","Space"]},
  threads:{label:"Threads",g:"@",c:"#6B5BD2",cat:"Social",kind:"card",formats:["Post","Thread"]},
  linkedin:{label:"LinkedIn",g:"in",c:"#0A66C2",cat:"Social",kind:"card",formats:["Text post","Carousel","Image post","Video","Article","Newsletter","Poll"]},
  snapchat:{label:"Snapchat",g:"SC",c:"#C9B200",cat:"Social",kind:"reel",formats:["Spotlight","Story","Snap"]},
  pinterest:{label:"Pinterest",g:"P",c:"#C8232C",cat:"Social",kind:"card",formats:["Pin","Idea pin","Video pin"]},
  bluesky:{label:"Bluesky",g:"BS",c:"#1185FE",cat:"Social",kind:"card",formats:F.text},
  tumblr:{label:"Tumblr",g:"t",c:"#34526F",cat:"Social",kind:"card",formats:F.social},
  lemon8:{label:"Lemon8",g:"L8",c:"#B8A300",cat:"Social",kind:"card",formats:["Carousel","Post"]},

  youtube:{label:"YouTube",g:"YT",c:"#E02B20",cat:"Video",kind:"yt",formats:["Short","Long video","Live","Community post","Podcast episode"]},
  tiktok:{label:"TikTok",g:"TT",c:"#14A3A8",cat:"Video",kind:"reel",formats:["Video","Carousel","Live"]},
  moj:{label:"Moj",g:"Moj",c:"#F2552C",cat:"Video",kind:"reel",formats:F.short},
  josh:{label:"Josh",g:"J",c:"#E5266C",cat:"Video",kind:"reel",formats:F.short},
  sharechat:{label:"ShareChat",g:"SH",c:"#2E7BF6",cat:"Video",kind:"reel",formats:["Short video","Image post","Post","Live"]},
  roposo:{label:"Roposo",g:"R",c:"#E8418C",cat:"Video",kind:"reel",formats:F.short},
  chingari:{label:"Chingari",g:"CH",c:"#F07B1A",cat:"Video",kind:"reel",formats:F.short},
  twitch:{label:"Twitch",g:"TW",c:"#8A43F0",cat:"Video",kind:"yt",formats:["Stream","Clip"]},
  kick:{label:"Kick",g:"K",c:"#3FA30F",cat:"Video",kind:"yt",formats:["Stream","Clip"]},
  vimeo:{label:"Vimeo",g:"V",c:"#1AB7EA",cat:"Video",kind:"yt",formats:["Video","Showreel"]},

  reddit:{label:"Reddit",g:"r/",c:"#FF4500",cat:"Community",kind:"reddit",formats:F.community},
  discord:{label:"Discord",g:"DC",c:"#5865F2",cat:"Community",kind:"chat",formats:F.chat},
  telegram:{label:"Telegram",g:"TG",c:"#229ED9",cat:"Community",kind:"chat",formats:F.chat},
  whatsapp:{label:"WhatsApp",g:"WA",c:"#1FA855",cat:"Community",kind:"chat",formats:["Channel post","Status","Broadcast","Community post"]},
  slack:{label:"Slack community",g:"SL",c:"#611F69",cat:"Community",kind:"chat",formats:F.chat},
  quora:{label:"Quora",g:"Q",c:"#B92B27",cat:"Community",kind:"reddit",formats:["Answer","Space post","Question"]},
  mastodon:{label:"Mastodon",g:"M",c:"#6364FF",cat:"Community",kind:"card",formats:F.text},
  fbgroups:{label:"Facebook Groups",g:"FG",c:"#2D4FB8",cat:"Community",kind:"reddit",formats:F.community},

  github:{label:"GitHub",g:"GH",c:"#24292F",cat:"Builders",kind:"repo",formats:["Repo launch","Release","README update","Discussion","Gist"]},
  producthunt:{label:"Product Hunt",g:"PH",c:"#DA552F",cat:"Builders",kind:"reddit",formats:["Launch","Maker comment","Forum post"]},
  hackernews:{label:"Hacker News",g:"Y",c:"#F26522",cat:"Builders",kind:"reddit",formats:["Show HN","Ask HN","Link post"]},
  indiehackers:{label:"Indie Hackers",g:"IH",c:"#0E2439",cat:"Builders",kind:"reddit",formats:["Post","Milestone","Product update"]},
  devto:{label:"DEV / Hashnode",g:"DEV",c:"#0A0A0A",cat:"Builders",kind:"card",formats:["Article","Tutorial","Series"]},
  behance:{label:"Behance",g:"Bē",c:"#1769FF",cat:"Builders",kind:"card",formats:["Case study","Project"]},
  dribbble:{label:"Dribbble",g:"Dr",c:"#EA4C89",cat:"Builders",kind:"card",formats:["Shot","Case study"]},

  medium:{label:"Medium",g:"Me",c:"#1A1A1A",cat:"Long-form",kind:"press",formats:F.long},
  substack:{label:"Substack",g:"SS",c:"#FF6719",cat:"Long-form",kind:"mail",formats:["Issue","Note","Podcast"]},
  newsletter:{label:"Newsletter",g:"NL",c:"#C9780A",cat:"Long-form",kind:"mail",formats:["Issue"]},
  website:{label:"Website / blog",g:"W",c:"#4B5563",cat:"Long-form",kind:"press",formats:["Blog post","Case study","Landing page"]},
  podcast:{label:"Podcast",g:"♪",c:"#8A3FD1",cat:"Long-form",kind:"yt",formats:["Episode","Clip","Guest appearance"]},
  spotify:{label:"Spotify",g:"SP",c:"#1DB954",cat:"Long-form",kind:"yt",formats:["Episode","Video podcast"]},

  techcrunch:{label:"TechCrunch",g:"TC",c:"#0A9E01",cat:"Press & PR",kind:"press",formats:F.press},
  yourstory:{label:"YourStory",g:"YS",c:"#E5322D",cat:"Press & PR",kind:"press",formats:F.press},
  inc42:{label:"Inc42",g:"42",c:"#E01F26",cat:"Press & PR",kind:"press",formats:F.press},
  economictimes:{label:"Economic Times",g:"ET",c:"#B21F24",cat:"Press & PR",kind:"press",formats:F.press},
  forbesindia:{label:"Forbes India",g:"Fb",c:"#1C1C1C",cat:"Press & PR",kind:"press",formats:F.press},
  entrackr:{label:"Entrackr",g:"EN",c:"#0B5CAD",cat:"Press & PR",kind:"press",formats:F.press},
  prwire:{label:"Press release wire",g:"PR",c:"#5B6475",cat:"Press & PR",kind:"press",formats:["Press release"]},

  googlebusiness:{label:"Google Business",g:"G",c:"#1A73E8",cat:"Local & commerce",kind:"card",formats:["Update","Offer","Event","Photo"]},
  justdial:{label:"Justdial",g:"JD",c:"#F5821F",cat:"Local & commerce",kind:"card",formats:["Listing update","Photo"]},
  appstore:{label:"App Store",g:"A",c:"#0D84FF",cat:"App stores",kind:"store",formats:F.app},
  playstore:{label:"Google Play",g:"▶",c:"#01875F",cat:"App stores",kind:"store",formats:F.app},
  galaxystore:{label:"Galaxy Store",g:"GS",c:"#1428A0",cat:"App stores",kind:"store",formats:F.app},
  appgallery:{label:"Huawei AppGallery",g:"AG",c:"#CF0A2C",cat:"App stores",kind:"store",formats:F.app},
  chromestore:{label:"Chrome Web Store",g:"CW",c:"#3F7FE6",cat:"App stores",kind:"store",formats:F.app},
  amazon:{label:"Amazon",g:"a",c:"#E47911",cat:"Marketplaces",kind:"store",formats:F.shop},
  flipkart:{label:"Flipkart",g:"FK",c:"#2874F0",cat:"Marketplaces",kind:"store",formats:F.shop},
  myntra:{label:"Myntra",g:"My",c:"#E5357B",cat:"Marketplaces",kind:"store",formats:F.shop},
  nykaa:{label:"Nykaa",g:"Ny",c:"#E80071",cat:"Marketplaces",kind:"store",formats:F.shop},
  meesho:{label:"Meesho",g:"Me",c:"#9F2089",cat:"Marketplaces",kind:"store",formats:F.shop},
  ajio:{label:"AJIO",g:"AJ",c:"#2C4152",cat:"Marketplaces",kind:"store",formats:F.shop},
  tatacliq:{label:"Tata CLiQ",g:"TC",c:"#B8125B",cat:"Marketplaces",kind:"store",formats:F.shop},
  jiomart:{label:"JioMart",g:"JM",c:"#0C5BB5",cat:"Marketplaces",kind:"store",formats:F.shop},
  etsy:{label:"Etsy",g:"Et",c:"#E4572E",cat:"Marketplaces",kind:"store",formats:F.shop},
  shopify:{label:"Own store (Shopify)",g:"S",c:"#5E8E3E",cat:"Marketplaces",kind:"store",formats:["Product page","Collection","Offer / banner","Blog post"]},
  blinkit:{label:"Blinkit",g:"bl",c:"#C9A800",cat:"Quick commerce",kind:"store",formats:F.qc},
  zepto:{label:"Zepto",g:"Z",c:"#5B2C8E",cat:"Quick commerce",kind:"store",formats:F.qc},
  instamart:{label:"Swiggy Instamart",g:"IM",c:"#F2610C",cat:"Quick commerce",kind:"store",formats:F.qc},
  bigbasket:{label:"BigBasket / BB Now",g:"bb",c:"#689F38",cat:"Quick commerce",kind:"store",formats:F.qc},
  flipkartmin:{label:"Flipkart Minutes",g:"FM",c:"#1D5FD1",cat:"Quick commerce",kind:"store",formats:F.qc},
  swiggy:{label:"Swiggy",g:"Sw",c:"#FC8019",cat:"Food & dining",kind:"store",formats:F.food},
  zomato:{label:"Zomato",g:"zo",c:"#E23744",cat:"Food & dining",kind:"store",formats:F.food},
  district:{label:"District (dining out)",g:"D",c:"#6C3BD1",cat:"Food & dining",kind:"store",formats:["Table booking page","Dining offer","Event listing","Photos","Review replies"]},
  eazydiner:{label:"EazyDiner",g:"ED",c:"#D93A2B",cat:"Food & dining",kind:"store",formats:["Listing","Dining offer","Photos","Review replies"]},
  magicpin:{label:"magicpin",g:"mp",c:"#E32B6E",cat:"Food & dining",kind:"store",formats:["Listing","Offer","Photos","Review replies"]},
  tripadvisor:{label:"Tripadvisor",g:"TA",c:"#00AA6C",cat:"Travel & reviews",kind:"store",formats:F.travel},
  googlemaps:{label:"Google Maps reviews",g:"GM",c:"#34A853",cat:"Travel & reviews",kind:"store",formats:["Review replies","Photos","Q&A answer","Listing update"]},
  booking:{label:"Booking.com",g:"B.",c:"#1D4ED8",cat:"Travel & reviews",kind:"store",formats:F.travel},
  airbnb:{label:"Airbnb",g:"ab",c:"#FF385C",cat:"Travel & reviews",kind:"store",formats:["Listing","Experience","Photos","Review replies"]},
  makemytrip:{label:"MakeMyTrip / Goibibo",g:"MT",c:"#D7262B",cat:"Travel & reviews",kind:"store",formats:F.travel},
  agoda:{label:"Agoda",g:"Ag",c:"#5A2D82",cat:"Travel & reviews",kind:"store",formats:F.travel},
  yelp:{label:"Yelp",g:"y",c:"#D32323",cat:"Travel & reviews",kind:"store",formats:["Listing update","Photos","Review replies"]},
  trustpilot:{label:"Trustpilot",g:"★",c:"#00956A",cat:"Travel & reviews",kind:"store",formats:["Review replies","Invite campaign"]},
  g2:{label:"G2 / Capterra",g:"G2",c:"#E8412E",cat:"Travel & reviews",kind:"store",formats:["Listing update","Review campaign","Review replies"]},
  other:{label:"Other",g:"•",c:"#6E7489",cat:"Custom",kind:"card",formats:["Post","Video","Article","Other"]}
};
const CATS = ["Social","Video","Community","Builders","Long-form","Press & PR","App stores","Marketplaces","Quick commerce","Food & dining","Travel & reviews","Local & commerce"];
const PF_ORDER = Object.keys(PLATFORMS);
const GROUPS = ["Founders","Agency","Creators","Content brands","In-house brands","Other"];
const STAGES = [{id:"idea",label:"Ideas",one:"Idea"},{id:"drafting",label:"Drafting",one:"Drafting"},{id:"scheduled",label:"Scheduled",one:"Scheduled"},{id:"posted",label:"Posted",one:"Posted"}];
const BSTATUS = [["active","Active"],["setup","Setting up"],["paused","Paused"]];

const S = {mcp:null, subs:[], media:[], renders:[], styles:[], meta:{}, brands:[], posts:[], dumps:[], db:null, group:"all", platform:"all", brand:null, weekOffset:0, gotB:false, gotP:false, sample:null, imgCaps:null, assets:null, boardLimit:{}};
const $ = id => document.getElementById(id);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const pf = k => PLATFORMS[k] || PLATFORMS.other;
const brandById = id => S.brands.find(b => b.id === id);
const chans = b => Array.isArray(b?.channels) ? b.channels : [];
const chanOf = (b, id) => chans(b).find(c => c.id === id);
const okColor = (c, d) => /^#[0-9a-fA-F]{6}$/.test(c||"") ? c : d;
const bvars = b => `--b1:${okColor(b?.color,"#5C6176")};--b2:${okColor(b?.color2,okColor(b?.color,"#8A8FA3"))}`;
const initials = b => (b?.monogram || (b?.name||"?").replace(/[^A-Za-z0-9 ]/g," ").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("")).slice(0,3).toUpperCase();
const safeUrl = u => /^(https?:\/\/|\/_blob\/|blob:|data:image\/(jpeg|png|webp);)/.test(u||"") ? u : "";
const mono = (b, cls="") => { const L = safeUrl(b?.logo); return L ? `<span class="mono logo ${cls}" style="${bvars(b)}"><img src="${esc(L)}" alt=""></span>` : `<span class="mono ${cls}" style="${bvars(b)}">${esc(initials(b))}</span>`; };
/* channel meta: built-in platform or a custom one */
function cmeta(c){
  if (!c) return PLATFORMS.other;
  if (c.platform==="custom"){ const L=(c.label||"Custom").trim(); return {label:L, g:L.replace(/[^A-Za-z0-9 ]/g,"").split(/\s+/).map(w=>w[0]||"").join("").slice(0,3).toUpperCase()||"•", c:okColor(c.color,"#6E7489"), cat:"Custom", kind:c.kind||"card", formats:F.social.concat(["Article","Other"])}; }
  return pf(c.platform);
}
const colKey = c => c.platform==="custom" ? "custom:"+(c.label||"custom").trim().toLowerCase() : c.platform;
const pgm = (m, cls="") => `<span class="pg ${cls}" style="--pc:${m.c}" title="${esc(m.label)}">${esc(m.g)}</span>`;
const pg = (k, cls="") => pgm(pf(k), cls);
const handleOf = (b, c) => c?.handle ? (/^[@#r\/]|[.\s]/.test(c.handle) ? c.handle : "@"+c.handle) : (b?.name||"");
const uid = () => Math.random().toString(36).slice(2,8);
function postMeta(p){ const b=brandById(p.brandId), c=chanOf(b,p.channelId); return c ? cmeta(c) : pf(p.platform); }

function ymd(d){ return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0"); }
function parseYmd(s){ if(!s) return null; const [y,m,d]=s.split("-").map(Number); return new Date(y,m-1,d); }
function weekStart(o){ const d=new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate()-((d.getDay()+6)%7)+o*7); return d; }
function weekDays(o){ const s=weekStart(o); return Array.from({length:7},(_,i)=>{const d=new Date(s); d.setDate(s.getDate()+i); return d;}); }
function fmtDate(s){ const d=parseYmd(s); return d ? d.toLocaleDateString(undefined,{day:"numeric",month:"short"}) : ""; }
const todayStr = () => ymd(new Date());
function toast(msg){ const t=$("toast"); t.textContent=msg; t.hidden=false; clearTimeout(toast._t); toast._t=setTimeout(()=>t.hidden=true,2600); }
function opts(list, sel){ return list.map(([v,l])=>`<option value="${esc(v)}" ${v===sel?"selected":""}>${esc(l)}</option>`).join(""); }
function platformSelect(sel, attrs=""){
  return `<select ${attrs}>${CATS.map(cat=>`<optgroup label="${esc(cat)}">${PF_ORDER.filter(k=>pf(k).cat===cat).map(k=>`<option value="${k}" ${k===sel?"selected":""}>${esc(pf(k).label)}</option>`).join("")}</optgroup>`).join("")}<optgroup label="Custom"><option value="custom" ${sel==="custom"?"selected":""}>Custom channel…</option></optgroup></select>`;
}

/* ================= filtering ================= */
function brandVisible(b){ return (S.group==="all" || (b.group||"Other")===S.group) && (S.platform==="all" || chans(b).some(c=>colKey(c)===S.platform)); }
function visibleBrands(){ return S.brands.filter(brandVisible); }
function visiblePosts(){
  return S.posts.filter(p => {
    if (S.brand) return p.brandId === S.brand;
    const b = brandById(p.brandId);
    if (S.group!=="all" && (!b || (b.group||"Other")!==S.group)) return false;
    if (S.platform!=="all"){ const c=chanOf(b,p.channelId); if(!c || colKey(c)!==S.platform) return false; }
    return true;
  });
}
const thisWeek = () => weekDays(0).map(ymd);
function shots(brandId, channelId, days){ return S.posts.filter(p=>p.brandId===brandId && p.channelId===channelId && (p.status==="posted"||p.status==="scheduled") && days.includes(p.date)).length; }
const dumpsOf = id => S.dumps.filter(d=>d.brandId===id).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));

/* ================= render ================= */
function render(){ renderStats(); renderChips(); renderFire(); renderWeek(); renderBoard(); renderBrands(); }

function renderStats(){
  const days = thisWeek();
  const live = S.brands.filter(b=>b.status!=="paused");
  const nCh = live.reduce((n,b)=>n+chans(b).length,0);
  const target = live.reduce((n,b)=>n+chans(b).reduce((m,c)=>m+(+c.cadence||0),0),0);
  const fired = S.posts.filter(p=>(p.status==="posted"||p.status==="scheduled") && days.includes(p.date)).length;
  const ideas = S.posts.filter(p=>p.status==="idea").length;
  const voiced = S.brands.filter(b=>b.brain?.summary).length;
  $("stats").innerHTML = [
    ["Brands", live.length, `${voiced} with a brand brain`],
    ["Channels", nCh, `${new Set(live.flatMap(b=>chans(b).map(colKey))).size} platforms`],
    ["Shots this week", fired, target ? `of ${target} targeted, posted or scheduled` : "set targets per channel"],
    ["Ammo", ideas, `ideas · ${S.dumps.filter(d=>!d.used).length} raw dumps waiting`]
  ].map(([l,v,s])=>`<div class="stat"><span class="eyebrow">${l}</span><b>${v}</b><span class="muted" style="font-size:12px">${esc(s)}</span></div>`).join("");
}

function renderChips(){
  const groups = GROUPS.filter(g=>S.brands.some(b=>(b.group||"Other")===g));
  $("groupChips").innerHTML = [["all","All brands",S.brands.length],...groups.map(g=>[g,g,S.brands.filter(b=>(b.group||"Other")===g).length])]
    .map(([k,l,n])=>`<button class="chip" data-group="${esc(k)}" aria-pressed="${S.group===k}">${esc(l)}<span class="n">${n}</span></button>`).join("");
  const seen = new Map();
  S.brands.forEach(b=>chans(b).forEach(c=>{ const k=colKey(c); if(!seen.has(k)) seen.set(k,cmeta(c)); }));
  const keys = [...seen.keys()].sort((a,b)=>(PF_ORDER.indexOf(a)+1||999)-(PF_ORDER.indexOf(b)+1||999));
  $("pfChips").innerHTML = [`<button class="chip" data-pf="all" aria-pressed="${S.platform==="all"}">All platforms</button>`,...keys.map(k=>`<button class="chip" data-pf="${esc(k)}" aria-pressed="${S.platform===k}">${pgm(seen.get(k))}${esc(seen.get(k).label)}</button>`)].join("")
    + (S.brand ? `<button class="chip" data-clearbrand aria-pressed="true">${mono(brandById(S.brand),"sm")}${esc(brandById(S.brand)?.name)} ✕</button>` : "");
}

function renderFire(){
  const list = visibleBrands(), days = thisWeek();
  const meta = new Map();
  list.forEach(b=>chans(b).forEach(c=>{ const k=colKey(c); if(!meta.has(k)) meta.set(k,cmeta(c)); }));
  ["instagram","linkedin","youtube"].forEach(k=>{ if(!meta.has(k)) meta.set(k,pf(k)); });
  let cols = [...meta.keys()];
  if (S.platform!=="all") cols = [S.platform];
  cols.sort((a,b)=>(PF_ORDER.indexOf(a)+1||999)-(PF_ORDER.indexOf(b)+1||999));
  if (!S.brands.length){ $("fire").innerHTML = `<tbody><tr><td class="muted" style="text-align:left;padding:16px">${S.gotB?"No brands yet. Add a brand, then give it channels.":"Loading your brands…"}</td></tr></tbody>`; return; }
  const head = `<thead><tr><th class="brand">Brand</th>${cols.map(k=>`<th>${pgm(meta.get(k)||pf(k))}${esc((meta.get(k)||pf(k)).label)}</th>`).join("")}<th class="addcol"><button class="btn sm" data-addcolumn>+ Channel</button></th><th>Week</th></tr></thead>`;
  const groups = GROUPS.filter(g=>list.some(b=>(b.group||"Other")===g));
  const body = groups.map(g => {
    const rows = list.filter(b=>(b.group||"Other")===g).sort((a,b)=>(a.order??999)-(b.order??999)||a.name.localeCompare(b.name));
    return `<tr class="grp"><td class="brand">${esc(g)}</td><td colspan="${cols.length+2}"></td></tr>` + rows.map(b => {
      let tot=0, tgt=0;
      const cells = cols.map(k => {
        const cs = chans(b).filter(c=>colKey(c)===k);
        if (!cs.length) return `<td><button class="addch" data-addch="${b.id}" data-p="${esc(k.startsWith("custom:")?"custom":k)}" data-label="${esc(k.startsWith("custom:")?(meta.get(k)?.label||""):"")}" aria-label="Open ${esc((meta.get(k)||pf(k)).label)} for ${esc(b.name)}">+</button></td>`;
        return `<td>${cs.map(c => {
          const n = shots(b.id,c.id,days), t = +c.cadence||0; tot+=n; tgt+=t;
          const ammo = Array.from({length:Math.min(Math.max(t,n,1),10)},(_,i)=>`<i class="${i<n?"f":""}"></i>`).join("");
          return `<button class="cell ${t?(n>=t?"hit":"behind"):""}" style="${bvars(b)}" data-fire="${b.id}" data-ch="${c.id}" title="${esc(handleOf(b,c))}: ${n}${t?` of ${t}`:""} this week"><b>${n}${t?`/${t}`:""}</b><span class="ammo">${ammo}</span></button>`;
        }).join(" ")}</td>`;
      }).join("");
      const st = b.status && b.status!=="active" ? ` <span class="status-pill ${b.status}">${esc((BSTATUS.find(x=>x[0]===b.status)||[])[1]||b.status)}</span>` : "";
      const extra = chans(b).filter(c=>!cols.includes(colKey(c))).length;
      return `<tr><td class="brand"><button class="bname" data-editbrand="${b.id}">${mono(b)}<div style="min-width:0"><span>${esc(b.name)}</span>${st}<small>${esc(b.industry||"")}${b.brain?.summary?" · ✦ brain":""}</small></div></button></td>${cells}<td>${extra?`<span class="muted" style="font-size:11.5px">+${extra} more</span>`:""}</td><td class="rowtot">${tot}${tgt?`/${tgt}`:""}</td></tr>`;
    }).join("");
  }).join("");
  $("fire").innerHTML = head + `<tbody>${body || `<tr><td class="muted" colspan="${cols.length+3}" style="text-align:left;padding:16px">No brands match these filters.</td></tr>`}</tbody>`;
}

function renderBrands(){
  const list = visibleBrands().sort((a,b)=>GROUPS.indexOf(a.group||"Other")-GROUPS.indexOf(b.group||"Other")||(a.order??999)-(b.order??999));
  $("brands").innerHTML = list.map(b => { const nd = dumpsOf(b.id).filter(d=>!d.used).length, br=b.brain||{};
    return `<div class="bcard ${S.brand===b.id?"sel":""}" style="${bvars(b)}">
      <div class="bband">${mono(b)}<span class="ind">${esc(b.industry||b.group||"")}</span></div>
      <div class="bbody"><strong>${esc(b.name)}</strong><p>${esc(br.summary||b.tagline||"")}</p>
        ${br.personality?.length?`<div class="traits">${br.personality.slice(0,4).map(t=>`<span>${esc(t)}</span>`).join("")}</div>`:""}
        <div class="chans">${chans(b).map(c=>`<span class="ch">${pgm(cmeta(c))}<em>${esc(c.handle?handleOf(b,c):cmeta(c).label)}</em></span>`).join("") || `<span class="muted" style="font-size:12px">No channels yet</span>`}</div>
      </div>
      <div class="bfoot"><button class="btn sm" data-editbrand="${b.id}">Open hub</button><button class="btn sm ghost" data-hub="${b.id}" data-tab="dump">Dump${nd?` · ${nd}`:""}</button><button class="btn sm ghost" data-focus="${b.id}">${S.brand===b.id?"Show all":"Focus"}</button></div>
    </div>`; }).join("") + `<button class="bcard" data-addbrand style="border-style:dashed;display:grid;place-items:center;min-height:180px;color:var(--muted);background:transparent">+ Add brand</button>`;
}

function renderWeek(){
  const days = weekDays(S.weekOffset), t = todayStr(), posts = visiblePosts();
  $("weekTitle").textContent = S.weekOffset===0 ? "This week" : `${fmtDate(ymd(days[0]))} – ${fmtDate(ymd(days[6]))}`;
  $("week").innerHTML = days.map(d => {
    const k = ymd(d), items = posts.filter(p=>p.date===k), show = items.slice(0,8);
    return `<div class="day ${k===t?"today":""}"><div class="day-h"><span>${d.toLocaleDateString(undefined,{weekday:"short"})}</span><span>${d.getDate()}${items.length?` · ${items.length}`:""}</span></div>
      ${show.map(p=>{const b=brandById(p.brandId);return `<button class="mini ${p.status==="posted"?"done":""}" style="${bvars(b)}" data-open="${p.id}" title="${esc((b?.name||"")+" · "+p.title)}">${pgm(postMeta(p))}<span>${esc(p.title)}</span></button>`;}).join("")}
      ${items.length>8?`<span class="more">+${items.length-8} more</span>`:""}</div>`;
  }).join("");
}

function renderBoard(){
  const posts = visiblePosts(), t = todayStr();
  $("board").innerHTML = STAGES.map((st,i) => {
    let items = posts.filter(p => (p.status||"idea")===st.id); const total = items.length;
    items.sort((a,b)=> st.id==="posted" ? (b.date||"").localeCompare(a.date||"") : ((a.date||"9999").localeCompare(b.date||"9999")) || ((b.updatedAt||0)-(a.updatedAt||0)));
    const lim = S.boardLimit[st.id] || 25; items = items.slice(0, lim);
    return `<div class="col" data-stage="${st.id}">
      <div class="col-h"><strong><span class="st" style="--s:var(--${st.id})"></span>${st.label}</strong><span class="n">${total}</span></div>
      ${items.map(p=>{const b=brandById(p.brandId), c=chanOf(b,p.channelId), late=p.date&&p.date<t&&st.id!=="posted";
        return `<div class="card" style="${bvars(b)}" draggable="true" data-id="${p.id}" tabindex="0" role="button" aria-label="Open ${esc(p.title)}">
          <div class="card-t">${esc(p.title||"Untitled")}</div>
          <div class="card-m">${mono(b,"sm")}${pgm(postMeta(p))}<span>${esc(c?handleOf(b,c):(b?.name||"No brand"))}</span>${p.format?`<span>· ${esc(p.format)}</span>`:""}${p.date?`<span class="date ${late?"late":""}">${fmtDate(p.date)}${late?" · overdue":""}</span>`:""}${p.blastId?`<span class="blast-tag">BLAST</span>`:""}${p.dumpId?`<span class="blast-tag">DUMP</span>`:""}${renderBadge(p.id)}</div>
          ${i<3?`<div class="card-a"><button class="btn sm ghost" data-advance="${p.id}">Move to ${STAGES[i+1].label} →</button></div>`:""}
        </div>`;}).join("") || `<div class="empty-col">${S.gotP?"Nothing here":"Loading…"}</div>`}
      ${total>lim?`<button class="btn sm ghost" data-more="${st.id}">Show ${Math.min(25,total-lim)} more</button>`:""}
    </div>`;
  }).join("");
}

/* ================= writes ================= */
function denied(e){ toast(e?.code==="permission_denied"?"You can view this board but not change it":"Couldn't save. Try again."); return false; }
async function savePost(id, data){
  if(!S.db){ toast("Sign in to save changes"); return false; }
  const body = {...data, updatedAt: Date.now()};
  try{ if(id) await S.db.collection("posts").doc(id).update(body); else await S.db.collection("posts").doc().set({...body, createdAt: Date.now()}); return true; }
  catch(e){ return denied(e); }
}
async function saveBrand(id, data){
  if(!S.db){ toast("Sign in to save changes"); return false; }
  try{ if(id) await S.db.collection("brands").doc(id).set({...data, updatedAt:Date.now()}); else await S.db.collection("brands").doc().set({...data, createdAt:Date.now(), updatedAt:Date.now()}); return true; }
  catch(e){ return denied(e); }
}
async function patchBrand(id, data){ try{ await S.db.collection("brands").doc(id).update({...data, updatedAt:Date.now()}); return true; }catch(e){ return denied(e); } }
async function saveDump(data){ if(!S.db){ toast("Sign in to save changes"); return false; } try{ await S.db.collection("dumps").doc().set({...data, used:false, createdAt:Date.now()}); return true; }catch(e){ return denied(e); } }
async function del(col, id){ try{ await S.db.collection(col).doc(id).delete(); return true; }catch(e){ toast("Couldn't delete. Try again."); return false; } }
async function upload(file){
  if(!S.assets){ toast("Uploads need editor access on this page"); return null; }
  try{ return await S.assets.upload(file); }catch(e){ toast(e?.code==="too_large"?"That file is too big (20 MB max)":"Couldn't upload. Try again."); return null; }
}
async function blobOf(url){ try{ const r=await fetch(url); return r.ok ? await r.blob() : null; }catch(_){ return null; } }

/* ================= panels ================= */
function openPanel(html, wide){ const p=$("panel"); p.className="panel"+(wide?" wide":""); delete p.dataset.brand; p.innerHTML=html; $("overlay").hidden=false; p.scrollTop=0; }
function closePanel(){ $("overlay").hidden = true; $("panel").innerHTML = ""; }
$("overlay").addEventListener("click", e => { if(e.target.id==="overlay") closePanel(); });
document.addEventListener("keydown", e => { if(e.key==="Escape" && !$("overlay").hidden) closePanel(); });

/* ---------- Brand hub (identity · brain · channels · dump) ---------- */
function chRow(c){ const custom = c.platform==="custom";
  return `<div class="chrow" data-cid="${esc(c.id)}">
  ${platformSelect(c.platform,'aria-label="Platform" data-k="platform"')}
  <input aria-label="Custom channel name" data-k="label" placeholder="Channel name" value="${esc(c.label)}" ${custom?"":"hidden"}>
  <input aria-label="Handle" data-k="handle" placeholder="handle / sub / server" value="${esc(c.handle)}">
  <input aria-label="Link" data-k="url" placeholder="https://" value="${esc(c.url)}">
  <input aria-label="Posts per week" data-k="cadence" type="number" min="0" max="99" placeholder="/wk" value="${esc(c.cadence||"")}">
  <button class="btn ghost sm x" data-rmch aria-label="Remove channel">✕</button></div>`; }

function listOrText(v){ return Array.isArray(v) ? v : (v ? String(v).split(/\n|;/).map(s=>s.trim()).filter(Boolean) : []); }
function brainView(br){
  if(!br || !br.summary) return `<div class="banner">No brand brain yet. Add what you have below, then press <b>Build brand brain</b>.</div>`;
  const L = (t, arr) => arr?.length ? `<div class="bb-block"><span class="eyebrow">${t}</span><ul>${arr.map(x=>`<li>${esc(typeof x==="string"?x:(x.name?`${x.name}${x.share?` (${x.share})`:""}${x.about?` — ${x.about}`:""}`:JSON.stringify(x)))}</li>`).join("")}</ul></div>` : "";
  const tone = br.tone && typeof br.tone==="object" ? Object.entries(br.tone).filter(([,v])=>typeof v==="number").slice(0,5) : [];
  return `<div class="bb">
    <p class="bb-sum">${esc(br.summary)}</p>
    ${br.audience?`<p><span class="eyebrow">Audience</span><br>${esc(br.audience)}</p>`:""}
    ${br.personality?.length?`<div class="traits big">${br.personality.map(t=>`<span>${esc(t)}</span>`).join("")}</div>`:""}
    ${tone.length?`<div class="tone">${tone.map(([k,v])=>`<div><span>${esc(k)}</span><i style="--v:${Math.max(0,Math.min(100,v))}%"></i></div>`).join("")}</div>`:""}
    <div class="bb-grid">${L("Content pillars",br.pillars)}${L("Hook templates",br.hooks)}${L("Do",br.dos)}${L("Don't",br.donts)}${L("Words we use",br.vocabulary)}${L("Hashtags",br.hashtags)}</div>
    ${br.language||br.ctaStyle?`<p class="muted" style="font-size:12.5px">${br.language?`Language: ${esc(br.language)}. `:""}${br.ctaStyle?`CTA style: ${esc(br.ctaStyle)}.`:""}</p>`:""}
    ${br.visual?`<p class="muted" style="font-size:12.5px">Visual: ${esc([br.visual.style,br.visual.type].filter(Boolean).join(" · "))}</p>`:""}
    <p class="muted" style="font-size:11.5px">${esc(br.source||"")}${br.updatedAt?` · ${new Date(br.updatedAt).toLocaleDateString()}`:""}</p>
  </div>`;
}

function brandPanel(id, opt={}){
  const b = id ? structuredClone(brandById(id)) : {group:S.group!=="all"?S.group:"Content brands", status:"setup", color:"#3846F0", color2:"#E8367A", channels:[]};
  if(!b) return;
  if(opt.addPlatform) b.channels = [...chans(b), {id:(id||"b")+"-"+opt.addPlatform+"-"+uid(), platform:opt.addPlatform, label:opt.label||"", handle:"", url:"", cadence:3}];
  const tab = opt.tab || (opt.addPlatform ? "channels" : "identity");
  const src = b.brainSources || {};
  openPanel(`<div class="panel-h"><h2>${id?"Brand hub":"Add brand"}</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
  <div class="idhead" id="idPrev" style="${bvars(b)}">${mono(b,"xl")}<div style="min-width:0"><strong id="idName">${esc(b.name||"New brand")}</strong><span id="idTag">${esc(b.tagline||"")}</span></div></div>
  <div class="tabs" role="tablist">${[["identity","Identity"],["brain","✦ Brand brain"],["channels",`Channels · ${chans(b).length}`],["avatar",`🧑 Avatar${b.avatar?.status==="ready"?" ✓":""}`],["logins",`💳 Accounts${id&&subsForBrand(id).length?` · ${subsForBrand(id).length}`:""}`],["dump",`Dump & ideas${id?` · ${dumpsOf(id).filter(d=>!d.used).length}`:""}`]].map(([k,l])=>`<button role="tab" data-tabbtn="${k}" aria-selected="${k===tab}" ${!id&&k!=="identity"&&k!=="brain"&&k!=="channels"?"disabled":""}>${l}</button>`).join("")}</div>

  <div data-tabpane="identity" ${tab==="identity"?"":"hidden"}>
  <form class="form" id="brandForm" onsubmit="return false">
    <div class="field"><label for="b_name">Brand name</label><input id="b_name" required value="${esc(b.name)}"></div>
    <div class="field"><label for="b_group">Group</label><select id="b_group">${opts(GROUPS.map(g=>[g,g]),b.group||"Other")}</select></div>
    <div class="field"><label for="b_ind">Industry</label><input id="b_ind" value="${esc(b.industry)}"></div>
    <div class="field"><label for="b_status">Status</label><select id="b_status">${opts(BSTATUS,b.status||"active")}</select></div>
    <div class="field full"><label for="b_tag">What it is (one line)</label><input id="b_tag" value="${esc(b.tagline)}"></div>
    <div class="field full"><label for="b_voice">Extra voice notes (Claude reads these with the brand brain)</label><input id="b_voice" value="${esc(b.voice)}"></div>
    <div class="field"><label for="b_c1">Primary colour</label><input id="b_c1" type="color" value="${okColor(b.color,"#3846F0")}"></div>
    <div class="field"><label for="b_c2">Secondary colour</label><input id="b_c2" type="color" value="${okColor(b.color2,"#E8367A")}"></div>
    <div class="field"><label for="b_mono">Monogram</label><input id="b_mono" maxlength="3" value="${esc(b.monogram||"")}" placeholder="${esc(initials(b))}"></div>
    <div class="field"><label for="b_web">Website</label><input id="b_web" value="${esc(b.website)}" placeholder="www."></div>
    <div class="field full"><span class="lbl">Logo</span><div class="logo-row"><span id="logoPrev">${mono(b,"xl")}</span>
      <input type="file" id="b_logo" accept="image/*" ${S.assets?"":"disabled"}><button class="btn sm ghost" id="logoClear" ${b.logo?"":"hidden"}>Remove logo</button>
      <span class="muted" style="font-size:12px">${S.assets?"PNG, JPG or SVG. Used everywhere this brand shows.":"Logo upload needs editor access."}</span></div></div>
  </form></div>

  <div data-tabpane="brain" ${tab==="brain"?"":"hidden"}>
    <div id="brainView" style="${bvars(b)}">${brainView(b.brain)}</div>
    <div class="ai">
      <div class="ai-h"><span class="spark">✦</span> Sources Claude reads</div>
      <p class="muted" style="margin:0;font-size:12.5px">Every link on this brand (website, channel profile links and anything below) is read automatically as soon as it's added, and the brain rebuilds from what it finds.</p>
      <div class="srcs" id="srcList"></div>
      <div class="field"><label for="bb_links">More links (comma or space separated)</label><input id="bb_links" value="${esc(src.links||"")}" placeholder="instagram.com/yourbrand, yourbrand.com/about"></div>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn sm" id="srcRead">Read links again</button><span class="status-line" id="srcStatus"></span></div>
      <details class="more-src"><summary>Add more yourself (optional)</summary>
        <div class="field"><label for="bb_text">Pasted text: About, captions, pitch summary</label><textarea id="bb_text" placeholder="Anything the links don't show">${esc(src.text||"")}</textarea></div>
        <div class="field"><label for="bb_imgs">Logo, post screenshots, moodboard (images)</label><input type="file" id="bb_imgs" accept="image/*" multiple ${S.sample?"":"disabled"}><span class="muted" style="font-size:12px" id="bbImgNote"></span></div>
      </details>
      <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn fire" id="bbGo" ${S.sample?"":"disabled"}>✦ Rebuild brand brain</button><span class="status-line" id="bbStatus">${S.sample?"":"Open on claude.ai to use Claude here."}</span></div>
    </div>
  </div>
  <div data-tabpane="channels" ${tab==="channels"?"":"hidden"}>
    <div class="field"><span class="lbl">Channels: handle, link, posts per week. Add as many as you like, including custom ones.</span>
      <div class="chrows" id="chrows">${chans(b).map(chRow).join("")}</div>
      <div class="quick"><button class="btn sm" id="addChRow">+ Add channel</button>${CATS.map(cat=>`<button class="btn sm ghost" data-addcat="${esc(cat)}">+ all ${esc(cat)}</button>`).join("")}</div></div>
    <div class="ai"><div class="ai-h"><span class="spark">✦</span> Go horizontal</div>
      <p class="muted" style="margin:0;font-size:12.5px">Claude picks every channel where this brand could realistically win, with a target and a first post for each.</p>
      <div><button class="btn sm" id="hzGo" ${S.sample?"":"disabled"}>Suggest channels</button> <span class="status-line" id="hzStatus"></span></div>
      <div class="sugg" id="hzOut"></div></div>
  </div>

  <div data-tabpane="avatar" ${tab==="avatar"?"":"hidden"}>${id?avatarPane(b):""}</div>
  <div data-tabpane="logins" ${tab==="logins"?"":"hidden"}>${id?`<div id="loginsBox">${brandSubsPane(id)}</div>`:""}</div>
  <div data-tabpane="dump" ${tab==="dump"?"":"hidden"}>${id?dumpPane(id):""}</div>

  <div class="panel-foot"><div id="delZone">${id?`<button class="btn danger" data-askdel>Delete brand</button>`:""}</div>
    <div class="actions"><button class="btn" data-close>Close</button><button class="btn primary" id="brandSave">${id?"Save identity & channels":"Add brand"}</button></div></div>`, true);

  const P = $("panel"); if(id) P.dataset.brand = id;
  P.querySelectorAll("[data-tabbtn]").forEach(t => t.onclick = () => { P.querySelectorAll("[data-tabbtn]").forEach(x=>x.setAttribute("aria-selected", x===t)); P.querySelectorAll("[data-tabpane]").forEach(x=>x.hidden = x.dataset.tabpane!==t.dataset.tabbtn); });
  let logo = {url:b.logo||"", id:b.logoId||""};
  const sync = () => { const t={name:$("b_name").value,color:$("b_c1").value,color2:$("b_c2").value,monogram:$("b_mono").value.trim(),logo:logo.url}; $("idPrev").setAttribute("style",bvars(t)); $("idPrev").querySelector(".mono").outerHTML=mono(t,"xl"); $("logoPrev").innerHTML=mono(t,"xl"); $("idName").textContent=t.name||"New brand"; $("idTag").textContent=$("b_tag").value; };
  ["b_name","b_c1","b_c2","b_mono","b_tag"].forEach(k=>$(k).addEventListener("input",sync));
  $("b_logo").onchange = async () => { const f=$("b_logo").files[0]; if(!f) return; const r = await upload(f); if(r){ logo={url:r.url,id:r.id}; $("logoClear").hidden=false; sync(); toast("Logo uploaded. Save to keep it."); } };
  $("logoClear").onclick = () => { logo={url:"",id:""}; $("logoClear").hidden=true; sync(); };

  /* channels */
  const rows = $("chrows");
  rows.addEventListener("click", e => { if(e.target.closest("[data-rmch]")) e.target.closest(".chrow").remove(); });
  rows.addEventListener("change", e => { if(e.target.dataset.k==="platform"){ const r=e.target.closest(".chrow"); r.querySelector('[data-k="label"]').hidden = e.target.value!=="custom"; } });
  const addRow = (platform, extra={}) => rows.insertAdjacentHTML("beforeend", chRow({id:(id||"b")+"-"+platform+"-"+uid(), platform, cadence:extra.cadence??3, label:extra.label||"", handle:extra.handle||""}));
  $("addChRow").onclick = () => addRow("instagram");
  P.querySelectorAll("[data-addcat]").forEach(bt => bt.onclick = () => {
    const have = new Set([...rows.querySelectorAll('[data-k="platform"]')].map(s=>s.value));
    PF_ORDER.filter(k=>pf(k).cat===bt.dataset.addcat && !have.has(k)).forEach(k=>addRow(k,{cadence:0}));
    toast(`Added ${bt.dataset.addcat} channels. Remove any you don't want, then save.`);
  });
  const collectChannels = () => [...rows.querySelectorAll(".chrow")].map(r=>{ const g=k=>r.querySelector(`[data-k="${k}"]`).value.trim(); const c={id:r.dataset.cid, platform:g("platform"), handle:g("handle").replace(/^@/,""), url:g("url"), cadence:Math.max(0,+g("cadence")||0)}; if(c.platform==="custom") c.label=g("label")||"Custom"; return c; });
  const collect = () => {
    const old = id ? brandById(id) : {};
    const d = {...(old||{}), name:$("b_name").value.trim(), group:$("b_group").value, industry:$("b_ind").value.trim(), status:$("b_status").value, tagline:$("b_tag").value.trim(), voice:$("b_voice").value.trim(), color:$("b_c1").value, color2:$("b_c2").value, monogram:$("b_mono").value.trim().toUpperCase(), website:$("b_web").value.trim(), logo:logo.url, logoId:logo.id, channels:collectChannels()};
    delete d.id; return d;
  };
  $("brandSave").onclick = async () => {
    const data = collect(); if(!data.name){ P.querySelector('[data-tabbtn="identity"]').click(); $("b_name").focus(); return toast("Give the brand a name"); }
    if(await saveBrand(id, data)){ closePanel(); toast(id?"Brand saved":"Brand added"); if(id) setTimeout(()=>autoRead(id),400); }
  };

  /* brain */
  if(S.imgCaps) $("bbImgNote").textContent = `Up to ${S.imgCaps.maxCount} images. The saved logo is included automatically.`;
  else if(S.sample) $("bbImgNote").textContent = "Images can't be sent to Claude in this view; text only.";
  if(id){ renderSources(id); if(!S.mcp) setSrcStatus(id, "Links are read automatically in the Claude desktop app. Elsewhere they're queued and Claude reads them from chat."); autoRead(id,{quiet:true}); }
  $("bb_links").addEventListener("change", () => { if(id){ renderSources(id); autoRead(id,{extraLinks:$("bb_links").value.trim()}); } });
  $("bb_links").addEventListener("input", () => { if(id) renderSources(id); });
  $("srcRead").onclick = () => { if(id) autoRead(id,{force:true, extraLinks:$("bb_links").value.trim()}); else toast("Add the brand first"); };
  $("bbGo").onclick = async () => {
    const cur = {...collect(), brain: id ? brandById(id)?.brain : b.brain, sources: id ? brandById(id)?.sources : {}};
    const text = $("bb_text").value.trim();
    $("bbGo").disabled = true; $("bbStatus").textContent = "Claude is studying the brand…";
    let images = [];
    if(S.imgCaps){
      const max = S.imgCaps.maxCount||4;
      if(logo.url){ const bl = await blobOf(logo.url); if(bl) images.push(bl); }
      [...$("bb_imgs").files].forEach(f=>images.push(f));
      images = images.filter(f=>!S.imgCaps.maxInputBytes || f.size<=S.imgCaps.maxInputBytes).slice(0,max);
    }
    try{
      const brain = await buildBrain(null, {cur, text, images});
      $("brainView").innerHTML = brainView(brain) + (brain.assumptions?`<p class="muted" style="font-size:12px">Assumptions: ${esc(brain.assumptions)}</p>`:"") + (brain.visual?.colors?.length?`<div class="sug-a" style="justify-content:flex-start"><button class="btn sm" id="applyCol">Use suggested colours ${brain.visual.colors.slice(0,2).map(c=>`<span class="sw" style="background:${okColor(c,"#888")}"></span>`).join("")}</button></div>`:"");
      if($("applyCol")) $("applyCol").onclick = () => { const [c1,c2]=brain.visual.colors; if(okColor(c1,null)) $("b_c1").value=c1; if(okColor(c2,null)) $("b_c2").value=c2; sync(); toast("Colours applied. Save to keep them."); };
      if(id){ if(await patchBrand(id,{brain, brainSources:{text:text.slice(0,12000), links:$("bb_links").value.trim()}})) $("bbStatus").textContent = "Saved. Every blast, plan and dump for this brand now uses this voice."; }
      else { b.brain = brain; $("bbStatus").textContent = "Add the brand to keep this brain."; }
    }catch(e){ $("bbStatus").textContent = e?.code==="empty" ? "Claude didn't return a profile. Try again with more material." : sampleErr(e); }
    $("bbGo").disabled = false;
  };

  /* horizontal */
  $("hzGo").onclick = async () => {
    const cur = collect(); $("hzGo").disabled = true; $("hzStatus").textContent = "Claude is mapping channels…"; $("hzOut").innerHTML="";
    const avail = PF_ORDER.filter(k=>k!=="other").map(k=>({key:k, label:pf(k).label, category:pf(k).cat}));
    const prompt = `Pick distribution channels for this brand. Go as horizontal as is realistic: include unconventional channels (press, communities, builder platforms, regional short-video apps, local listings) wherever the brand has a credible angle, but skip ones that clearly don't fit.
Brand: ${JSON.stringify({name:cur.name, industry:cur.industry, whatItIs:cur.tagline, brain:cur.brain?{summary:cur.brain.summary,audience:cur.brain.audience,pillars:cur.brain.pillars}:null})}
Already has: ${JSON.stringify(cur.channels.map(c=>cmeta(c).label))}
Available platform keys: ${JSON.stringify(avail)}
Reply with only a JSON array (max 14), best first: {"platform":"<key from list>","why":"one line","postsPerWeek":number,"firstPost":"a specific first post idea"}`;
    try{
      const out = await S.sample.json(prompt, {modelTier:"default"});
      const have = new Set(cur.channels.map(c=>c.platform));
      const list = (Array.isArray(out)?out:[]).filter(s=>PLATFORMS[s?.platform] && !have.has(s.platform));
      $("hzStatus").textContent = list.length ? `${list.length} channels suggested` : "No new channels suggested.";
      $("hzOut").innerHTML = list.map((s,i)=>`<label class="sug hz" style="${bvars(cur)}"><div class="card-m"><input type="checkbox" data-hz="${i}" checked> ${pg(s.platform)} <strong style="color:var(--ink)">${esc(pf(s.platform).label)}</strong><span>· ${+s.postsPerWeek||0}/wk</span></div><p>${esc(s.why)}</p>${s.firstPost?`<p><b>First post:</b> ${esc(s.firstPost)}</p>`:""}</label>`).join("") + (list.length?`<div class="sug-a"><button class="btn primary sm" id="hzAdd">Add selected to channels</button></div>`:"");
      if($("hzAdd")) $("hzAdd").onclick = () => { let n=0; $("hzOut").querySelectorAll("[data-hz]:checked").forEach(x=>{ const s=list[+x.dataset.hz]; addRow(s.platform,{cadence:Math.max(0,Math.min(99,+s.postsPerWeek||0))}); n++; }); toast(`Added ${n} channels. Save to keep them.`); $("hzOut").innerHTML=""; $("hzStatus").textContent=""; };
    }catch(e){ $("hzStatus").textContent = sampleErr(e); }
    $("hzGo").disabled = false;
  };

  if(id){ wireDump(id); wireAvatar(id); $("loginsBox").addEventListener("click", e => { const o=e.target.closest("[data-opensubs]"), ed=e.target.closest("[data-editsub]"); if(o) subsPanel({brand:id}); else if(ed) subsPanel({brand:id, edit:ed.dataset.editsub}); }); }
  if(id) P.querySelector("[data-askdel]").onclick = () => {
    const n = S.posts.filter(p=>p.brandId===id).length;
    $("delZone").innerHTML = `<div class="confirm"><span>Delete ${esc(b.name)}${n?` (its ${n} post${n>1?"s":""} stay, unlinked)`:""}?</span><button class="btn danger sm" id="delYes">Delete</button><button class="btn sm" id="delNo">Keep</button></div>`;
    $("delNo").onclick = () => brandPanel(id);
    $("delYes").onclick = async () => { if(await del("brands", id)){ if(S.brand===id) S.brand=null; closePanel(); toast("Brand deleted"); } };
  };
}

/* ---------- Digital avatar clone ---------- */
const AV_PROVIDERS = [["heygen","HeyGen"],["synthesia","Synthesia"],["captions","Captions"],["tavus","Tavus"],["did","D-ID"],["elevenlabs","ElevenLabs voice + Remotion lip-sync"],["other","Other"]];
const AV_STATUS = [["none","Not set up"],["collecting","Collecting footage"],["training","Training at provider"],["ready","Ready to use"]];
const AV_MODES = [["none","No avatar"],["full","Avatar presents the whole video"],["pip","Avatar in a corner over the clips"],["hook","Avatar says the hook, then clips"],["outro","Clips, then avatar CTA outro"]];
function avatarReady(b){ return b?.avatar?.status==="ready" && b.avatar.consent; }
function avatarPane(b){
  const a = b.avatar || {};
  const ph = (a.photos||[]).map((x,i)=>`<span class="av-ph"><img src="${esc(safeUrl(x.url))}" alt=""><button class="btn ghost sm" data-rmph="${i}" aria-label="Remove">✕</button></span>`).join("");
  return `<div class="av" style="${bvars(b)}">
    <div class="av-card">${(a.photos||[])[0]?`<img src="${esc(safeUrl(a.photos[0].url))}" alt="">`:mono(b,"xl")}<div style="min-width:0"><b>${esc(a.name||"No presenter yet")}</b><span class="muted" style="font-size:12px">${esc((AV_STATUS.find(x=>x[0]===(a.status||"none"))||[])[1])}${a.provider?` · ${esc((AV_PROVIDERS.find(x=>x[0]===a.provider)||[,""])[1])}`:""}</span>${a.persona?`<p style="margin:4px 0 0;font-size:12.5px">${esc(a.persona)}</p>`:""}</div></div>
    <p class="muted" style="margin:0;font-size:12.5px">A digital twin of you (or a brand presenter) that reads scripts on camera. You record the training footage once at the avatar provider, paste its avatar and voice IDs here, and every video post can then use it in the Remotion edit.</p>
    <form class="form" onsubmit="return false">
      <div class="field"><label for="av_name">Presenter name</label><input id="av_name" value="${esc(a.name||"")}" placeholder="e.g. your name, or a brand host"></div>
      <div class="field"><label for="av_kind">Type</label><select id="av_kind">${opts([["clone","Clone of a real person"],["persona","Made-up brand presenter"]],a.kind||"clone")}</select></div>
      <div class="field"><label for="av_prov">Provider</label><select id="av_prov">${opts([["","Choose…"],...AV_PROVIDERS],a.provider||"")}</select></div>
      <div class="field"><label for="av_status">Status</label><select id="av_status">${opts(AV_STATUS,a.status||"none")}</select></div>
      <div class="field"><label for="av_pid">Avatar ID at provider</label><input id="av_pid" value="${esc(a.providerId||"")}" placeholder="from the provider's dashboard"></div>
      <div class="field"><label for="av_vid">Voice ID</label><input id="av_vid" value="${esc(a.voiceId||"")}" placeholder="cloned voice ID"></div>
      <div class="field"><label for="av_lang">Languages</label><input id="av_lang" value="${esc(a.language||b.brain?.language||"")}" placeholder="English, Hinglish, Hindi"></div>
      <div class="field"><label for="av_set">Look & setting</label><input id="av_set" value="${esc(a.look||"")}" placeholder="black tee, studio desk, warm light"></div>
      <div class="field full"><label for="av_persona">How they talk on camera</label><textarea id="av_persona" placeholder="Energy, pace, catchphrases, intro and sign-off">${esc(a.persona||"")}</textarea></div>
      <div class="field full"><span class="lbl">Reference photos (for thumbnails and the editor)</span><div class="av-phs" id="avPhs">${ph}</div><input type="file" id="av_up" accept="image/*" multiple ${S.assets?"":"disabled"}></div>
      <label class="full av-consent"><input type="checkbox" id="av_consent" ${a.consent?"checked":""}><span>I am this person, or I have their written consent to clone their face and voice. Videos made with it will be labelled as AI-generated where the platform asks.</span></label>
    </form>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn primary" id="avSave">Save avatar</button>${S.sample?`<button class="btn sm" id="avAi">✦ Write on-camera persona from the brand brain</button>`:""}<span class="status-line" id="avStatus"></span></div>
    <details class="more-src"><summary>How to set up the clone</summary><ol class="av-steps">
      <li>At the provider, record 2–5 minutes of you talking to camera in good light, plus the consent clip they ask for.</li>
      <li>Clone the voice there, or in ElevenLabs. Add a Hinglish sample if you'll post in Hinglish.</li>
      <li>Paste the avatar ID and voice ID here and set the status to Ready.</li>
      <li>In any video post, choose how the avatar appears under 🎬 Edit with Remotion. Render the avatar shots with the provider, drop them in your media folder, and they're cut in with your clips.</li></ol>
      <p class="muted" style="font-size:12px;margin:0">Keep the provider's API key in the provider's app, not here. Instagram, YouTube and TikTok ask you to label realistic AI-generated people.</p></details>
  </div>`;
}
function wireAvatar(id){
  const b = brandById(id); if(!b || !$("avSave")) return;
  let photos = [...(b.avatar?.photos||[])];
  const drawPh = () => { $("avPhs").innerHTML = photos.map((x,i)=>`<span class="av-ph"><img src="${esc(safeUrl(x.url))}" alt=""><button class="btn ghost sm" data-rmph="${i}" aria-label="Remove">✕</button></span>`).join(""); };
  $("avPhs").addEventListener("click", e => { const r=e.target.closest("[data-rmph]"); if(r){ photos.splice(+r.dataset.rmph,1); drawPh(); } });
  $("av_up").onchange = async () => { for(const f of [...$("av_up").files].slice(0,6)){ $("avStatus").textContent=`Uploading ${f.name}…`; const r=await upload(f); if(r) photos.push({url:r.url,id:r.id}); } drawPh(); $("avStatus").textContent="Uploaded. Save to keep them."; };
  $("avSave").onclick = async () => {
    const st = $("av_status").value, consent = $("av_consent").checked;
    if(st==="ready" && !consent) return toast("Tick the consent box before marking the avatar ready");
    const avatar = {name:$("av_name").value.trim(), kind:$("av_kind").value, provider:$("av_prov").value, status:st, providerId:$("av_pid").value.trim(), voiceId:$("av_vid").value.trim(), language:$("av_lang").value.trim(), look:$("av_set").value.trim(), persona:$("av_persona").value.trim(), photos:photos.slice(0,8), consent, consentAt: consent ? (b.avatar?.consentAt||Date.now()) : null, updatedAt:Date.now()};
    if(await patchBrand(id,{avatar})) $("avStatus").textContent = st==="ready" ? "Saved. Video posts for this brand can now use the avatar." : "Saved.";
  };
  if($("avAi")) $("avAi").onclick = async () => {
    $("avAi").disabled=true; $("avStatus").textContent="Claude is writing the on-camera persona…";
    try{
      const out = await S.sample.json(`Write how this brand's on-camera presenter (a digital avatar that reads scripts) should come across in short videos.
Brand: ${JSON.stringify(brandBrief(brandById(id)))}
Presenter: ${JSON.stringify({name:$("av_name").value, type:$("av_kind").value, look:$("av_set").value})}
Reply with only JSON: {"persona":"3-4 sentences on energy, pace, gestures, catchphrases, intro line and sign-off","look":"wardrobe and setting in one line","language":"languages/mix"}`, {modelTier:"default"});
      if(out?.persona) $("av_persona").value = out.persona;
      if(out?.look && !$("av_set").value) $("av_set").value = out.look;
      if(out?.language && !$("av_lang").value) $("av_lang").value = out.language;
      $("avStatus").textContent = "Drafted. Edit it, then save.";
    }catch(e){ $("avStatus").textContent = sampleErr(e); }
    $("avAi").disabled=false;
  };
}

/* ---------- Accounts & subscriptions (no passwords or card numbers stored) ---------- */
const SUB_STATUS = [["active","Active"],["trial","Free trial"],["cancel","Cancel before renewal"],["paused","Paused"],["cancelled","Cancelled"]];
const SUB_CYCLE = [["monthly","Monthly"],["quarterly","Quarterly"],["yearly","Yearly"],["one-time","One-time"],["usage","Pay as you go"],["free","Free"]];
const SUB_KIND = [["tool","Tool / software"],["channel","Channel account"],["marketplace","Marketplace / seller"],["ads","Ads account"],["domain","Domain / hosting"],["other","Other"]];
const TWOFA = [["","Not set"],["app","Authenticator app"],["passkey","Passkey"],["sms","SMS"],["email","Email code"],["none","None, turn it on"]];
const CUR = {INR:"₹",USD:"$",EUR:"€",GBP:"£",AED:"AED "};
const PER_MONTH = {monthly:1, quarterly:1/3, yearly:1/12};
const SUB_PRESETS = ["Canva Pro","CapCut Pro","Adobe Creative Cloud","HeyGen","Synthesia","ElevenLabs","ChatGPT Plus","Claude","Midjourney","Notion","Google Workspace","Microsoft 365","Meta Verified","LinkedIn Premium","X Premium","Buffer","Later","Metricool","Shopify","GoDaddy domain","Hostinger","Zoho","Figma","Epidemic Sound","Artlist"];
const money = (n, c) => (CUR[c]||((c||"")+" ")) + Math.round(n).toLocaleString("en-IN");
const monthlyOf = s => (s.status==="cancelled"||s.status==="paused"||s.status==="trial") ? 0 : (+s.price||0) * (PER_MONTH[s.cycle]||0);
const daysTo = ymdStr => { const d = parseYmd(ymdStr); if(!d) return null; const t = new Date(); t.setHours(0,0,0,0); return Math.round((d-t)/864e5); };
function nextRenewal(s){ // roll a past renewal date forward by its cycle
  let d = parseYmd(s.renewsOn); if(!d || !PER_MONTH[s.cycle]) return s.renewsOn||"";
  const step = {monthly:1, quarterly:3, yearly:12}[s.cycle]; const t = new Date(); t.setHours(0,0,0,0);
  let guard = 0; while(d < t && guard++ < 400) d.setMonth(d.getMonth()+step);
  return ymd(d);
}
function looksSecret(v){ v=String(v||"").trim(); if(!v) return false;
  if(/\b(pass(word|wd)?|pwd|pin|otp|cvv|cvc|secret|token)\b\s*[:=-]/i.test(v)) return true;
  if(/(?:\d[ -]?){13,19}/.test(v)) return true; // full card or account number
  return v.split(/\s+/).some(w => w.length>=8 && w.length<=64 && !/^https?:|@|\.(com|in|io|co)\b/i.test(w) && /[a-z]/.test(w) && /[A-Z]/.test(w) && /\d/.test(w) && /[^A-Za-z0-9]/.test(w)); }
const subBrands = s => Array.isArray(s.brandIds) ? s.brandIds : [];
const subsForBrand = id => S.subs.filter(s => subBrands(s).includes(id));
function subTotals(list){ const m = {}; list.forEach(s=>{ const v = monthlyOf(s); if(v) m[s.currency||"INR"] = (m[s.currency||"INR"]||0) + v; }); return m; }
const fmtTotals = m => Object.keys(m).length ? Object.entries(m).map(([c,v])=>money(v,c)).join(" + ") : "₹0";
function untracked(){ const have = new Set(S.subs.filter(s=>s.channelKey).map(s=>s.channelKey)); return S.brands.flatMap(b=>chans(b).filter(c=>(c.handle||c.url) && !have.has(b.id+"__"+c.id)).map(c=>({b,c}))); }

function subRow(s){
  const nr = nextRenewal(s), dd = daysTo(nr), bs = subBrands(s).map(brandById).filter(Boolean);
  const soon = s.status!=="cancelled" && dd!=null && dd>=0 && dd<=7, gl = s.platform ? pg(s.platform) : `<span class="pg" style="--pc:#6E7489">${esc((s.service||"?").slice(0,2))}</span>`;
  const price = s.cycle==="free" ? "Free" : (+s.price ? `${money(+s.price, s.currency||"INR")}${s.cycle==="one-time"?"":" / "+({monthly:"mo",quarterly:"qtr",yearly:"yr",usage:"usage"}[s.cycle]||s.cycle)}` : "Price not set");
  return `<div class="srow ${s.status||"active"}" data-sid="${esc(s.id)}">
    <div class="srow-m">${gl}<div style="min-width:0"><b>${esc(s.service||"Untitled")}</b>${s.plan?` <span class="muted">· ${esc(s.plan)}</span>`:""}
      <div class="srow-s">${bs.length?bs.slice(0,6).map(b=>mono(b,"sm")).join("")+(bs.length>6?`<span class="muted">+${bs.length-6}</span>`:""):`<span class="muted">All brands</span>`}${s.loginId?`<span class="muted">· ${esc(s.loginId)}</span>`:""}${s.owner?`<span class="muted">· ${esc(s.owner)}</span>`:""}</div></div></div>
    <div class="srow-p"><b>${esc(price)}</b><span class="${soon?"due":"muted"}">${s.status==="cancelled"?"Cancelled":s.status==="trial"?(nr?`Trial ends ${fmtDate(nr)}`:"Trial"):nr&&PER_MONTH[s.cycle]?`Renews ${fmtDate(nr)}${soon?` · in ${dd}d`:""}`:""}</span>${s.paidWith?`<span class="muted">${esc(s.paidWith)}</span>`:""}</div>
    <div class="srow-a">${s.status==="cancel"?`<span class="lst attention">Cancel</span>`:""}${safeUrl(s.vault)?`<a class="btn sm ghost" href="${esc(s.vault)}" target="_blank" rel="noopener" title="Open the login in your password manager">🔑</a>`:""}${safeUrl(s.manageUrl)?`<a class="btn sm ghost" href="${esc(s.manageUrl)}" target="_blank" rel="noopener">Billing ↗</a>`:""}<button class="btn sm" data-editsub="${esc(s.id)}">Edit</button></div></div>`;
}
function subForm(s){
  s = s || {status:"active", cycle:"monthly", currency:"INR", kind:"tool", brandIds:[]};
  const sel = new Set(subBrands(s));
  return `<div class="ai sform" id="subForm" data-sid="${esc(s.id||"")}">
    <div class="ai-h">${s.id?"Edit":"Add"} account or subscription</div>
    <div class="form">
      <div class="field"><label for="s_service">Service</label><input id="s_service" list="subPresets" value="${esc(s.service||"")}" placeholder="Canva Pro, Meta Verified, Amazon Seller…"><datalist id="subPresets">${SUB_PRESETS.map(x=>`<option value="${esc(x)}">`).join("")}</datalist></div>
      <div class="field"><label for="s_kind">Type</label><select id="s_kind">${opts(SUB_KIND, s.kind||"tool")}</select></div>
      <div class="field"><label for="s_plan">Plan</label><input id="s_plan" value="${esc(s.plan||"")}" placeholder="Pro, Teams, Business…"></div>
      <div class="field"><label for="s_status">Status</label><select id="s_status">${opts(SUB_STATUS, s.status||"active")}</select></div>
      <div class="field"><label for="s_price">Charge</label><div style="display:flex;gap:6px"><select id="s_cur" style="width:84px">${opts(Object.keys(CUR).map(c=>[c,c]), s.currency||"INR")}</select><input id="s_price" type="number" min="0" step="0.01" value="${esc(s.price??"")}" placeholder="0"></div></div>
      <div class="field"><label for="s_cycle">Billing cycle</label><select id="s_cycle">${opts(SUB_CYCLE, s.cycle||"monthly")}</select></div>
      <div class="field"><label for="s_renew">Next renewal / trial end</label><input id="s_renew" type="date" value="${esc(s.renewsOn||"")}"></div>
      <div class="field"><label for="s_paid">Paid with (label only)</label><input id="s_paid" value="${esc(s.paidWith||"")}" placeholder="e.g. HDFC card ending 4321, UPI autopay"></div>
      <div class="field"><label for="s_login">Login email or phone</label><input id="s_login" value="${esc(s.loginId||"")}" placeholder="no passwords here"></div>
      <div class="field"><label for="s_2fa">2FA</label><select id="s_2fa">${opts(TWOFA, s.twofa||"")}</select></div>
      <div class="field"><label for="s_vault">Password manager link</label><input id="s_vault" value="${esc(s.vault||"")}" placeholder="1Password / Bitwarden / Google item link"></div>
      <div class="field"><label for="s_owner">Who manages it</label><input id="s_owner" value="${esc(s.owner||"")}"></div>
      <div class="field full"><label for="s_manage">Billing / manage-plan page</label><input id="s_manage" value="${esc(s.manageUrl||"")}" placeholder="https://"></div>
      <div class="field full"><span class="lbl">Used by (leave empty for all brands)</span><div class="sbrands">${S.brands.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(b=>`<label class="chip sb" style="${bvars(b)}"><input type="checkbox" value="${esc(b.id)}" ${sel.has(b.id)?"checked":""}>${mono(b,"sm")}${esc(b.name)}</label>`).join("")}</div></div>
      <div class="field full"><label for="s_notes">Notes</label><input id="s_notes" value="${esc(s.notes||"")}" placeholder="Seats, what it's for, who to ask before cancelling"></div>
    </div>
    <p class="muted" style="margin:0;font-size:12px">Passwords, OTPs and full card numbers are blocked here because the board is shared. Use the password manager link, and only the last 4 digits of a card.</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn primary" id="subSave">Save</button><button class="btn" id="subCancel">Cancel</button>${s.id?`<button class="btn danger sm" id="subDel" style="margin-left:auto">Delete</button>`:""}</div>
  </div>`;
}
function subsPanel(opt={}){
  const f = opt.filter || "all", q = (opt.q||"").toLowerCase(), bf = opt.brand || "";
  const all = S.subs.slice();
  const due30 = all.filter(s=>s.status!=="cancelled" && (PER_MONTH[s.cycle]||s.status==="trial")).map(s=>({s, d:daysTo(nextRenewal(s))})).filter(x=>x.d!=null && x.d>=0 && x.d<=30).sort((a,b)=>a.d-b.d);
  const tot = subTotals(all), yr = Object.fromEntries(Object.entries(tot).map(([c,v])=>[c,v*12]));
  const tests = {all:()=>true, paid:s=>monthlyOf(s)>0||s.cycle==="one-time"||s.cycle==="usage", free:s=>s.cycle==="free", trial:s=>s.status==="trial", soon:s=>due30.some(x=>x.s===s), cancel:s=>s.status==="cancel", logins:s=>!!s.loginId||!!s.vault};
  let list = all.filter(tests[f]||tests.all).filter(s=>!bf || subBrands(s).includes(bf) || !subBrands(s).length).filter(s=>!q || [s.service,s.plan,s.loginId,s.owner,s.notes,s.paidWith].join(" ").toLowerCase().includes(q));
  list.sort((a,b)=>(a.status==="cancelled")-(b.status==="cancelled") || monthlyOf(b)-monthlyOf(a) || String(a.service).localeCompare(String(b.service)));
  const un = untracked();
  openPanel(`<div class="panel-h"><h2>💳 Accounts & subscriptions</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <div class="sstats">
      <div><span class="eyebrow">Monthly spend</span><b>${esc(fmtTotals(tot))}</b><small>${esc(fmtTotals(yr))} a year</small></div>
      <div><span class="eyebrow">Renewing in 30 days</span><b>${due30.length}</b><small>${(()=>{ const m={}; due30.forEach(({s})=>{ if(+s.price && s.status!=="cancelled") m[s.currency||"INR"]=(m[s.currency||"INR"]||0)+(+s.price); }); return esc(fmtTotals(m)); })()} will be charged</small></div>
      <div><span class="eyebrow">Paid plans</span><b>${all.filter(s=>monthlyOf(s)>0).length}</b><small>${all.filter(s=>s.status==="trial").length} trials · ${all.filter(s=>s.status==="cancel").length} to cancel</small></div>
      <div><span class="eyebrow">Accounts tracked</span><b>${all.length}</b><small>${un.length} channel accounts not added</small></div>
    </div>
    ${due30.length?`<div class="renew"><span class="eyebrow">Coming up</span>${due30.slice(0,8).map(({s,d})=>`<button class="rn ${d<=7?"due":""}" data-editsub="${esc(s.id)}"><b>${d===0?"Today":d===1?"Tomorrow":fmtDate(nextRenewal(s))}</b><span>${esc(s.service)}</span><small>${s.status==="trial"?"trial ends":+s.price?esc(money(+s.price,s.currency||"INR")):""}</small></button>`).join("")}</div>`:""}
    <div id="subFormBox"></div>
    <div class="sbar"><button class="btn primary sm" id="subAdd">+ Add account or subscription</button>${un.length?`<button class="btn sm" id="subImport">+ Add ${un.length} channel accounts from your brands</button>`:""}<input id="subQ" placeholder="Search" value="${esc(opt.q||"")}"><select id="subB" aria-label="Brand"><option value="">All brands</option>${S.brands.map(b=>`<option value="${esc(b.id)}" ${b.id===bf?"selected":""}>${esc(b.name)}</option>`).join("")}</select></div>
    <div class="chips">${[["all","All"],["paid","Paid"],["soon","Renewing soon"],["trial","Trials"],["cancel","To cancel"],["free","Free accounts"],["logins","With login saved"]].map(([k,l])=>`<button class="chip" data-sf="${k}" aria-pressed="${k===f}">${esc(l)} · ${all.filter(tests[k]).length}</button>`).join("")}</div>
    <div class="slist" id="subList">${list.map(subRow).join("") || `<div class="banner">${all.length?"Nothing matches.":"Nothing tracked yet. Add the tools you pay for (Canva, CapCut, HeyGen, Meta Verified…) and every brand's channel logins. Renewals and monthly spend show up here."}</div>`}</div>`, true);
  const P = $("panel"), again = o => subsPanel({filter:f, q:$("subQ").value, brand:$("subB").value, ...o});
  P.querySelectorAll("[data-sf]").forEach(b=>b.onclick=()=>again({filter:b.dataset.sf}));
  $("subQ").onchange = () => again({}); $("subB").onchange = () => again({});
  const edit = s => { $("subFormBox").innerHTML = subForm(s); wireSubForm(s, () => again({})); $("subFormBox").scrollIntoView({block:"start"}); };
  $("subAdd").onclick = () => edit(opt.brand ? {status:"active", cycle:"monthly", currency:"INR", kind:"tool", brandIds:[opt.brand]} : null);
  P.querySelectorAll("[data-editsub]").forEach(b=>b.onclick=()=>edit(S.subs.find(x=>x.id===b.dataset.editsub)));
  if($("subImport")) $("subImport").onclick = async () => {
    if(!S.db) return toast("Sign in to save changes");
    $("subImport").disabled = true; let n = 0;
    for(const {b,c} of un){ try{ await S.db.collection("subs").doc(("ch_"+b.id+"__"+c.id).replace(/[^A-Za-z0-9_-]/g,"_").slice(0,140)).set({service:`${b.name} · ${cmeta(c).label}`, kind:"channel", platform:c.platform, channelKey:b.id+"__"+c.id, brandIds:[b.id], plan:"", price:0, currency:"INR", cycle:"free", status:"active", loginId:"", vault:"", twofa:"", owner:"", paidWith:"", manageUrl:c.url||"", notes:c.handle?handleOf(b,c):"", createdAt:Date.now(), updatedAt:Date.now()}); n++; }catch(e){ denied(e); break; } }
    toast(`Added ${n} channel accounts. Fill in each login as you go.`); setTimeout(()=>again({filter:"free"}), 400);
  };
  if(opt.edit) edit(S.subs.find(x=>x.id===opt.edit));
}
function wireSubForm(orig, done){
  const sf = $("subForm"); if(!sf) return;
  $("subCancel").onclick = () => { $("subFormBox").innerHTML = ""; };
  $("s_cycle").onchange = () => { if($("s_cycle").value==="free") $("s_price").value = 0; };
  if($("subDel")) $("subDel").onclick = async () => { if($("subDel").dataset.sure){ if(await del("subs", orig.id)){ toast("Deleted"); done(); } } else { $("subDel").dataset.sure = 1; $("subDel").textContent = "Delete for good?"; } };
  $("subSave").onclick = async () => {
    const g = k => $(k).value.trim();
    const d = {service:g("s_service"), kind:$("s_kind").value, plan:g("s_plan"), status:$("s_status").value, currency:$("s_cur").value, price:Math.max(0,+$("s_price").value||0), cycle:$("s_cycle").value, renewsOn:g("s_renew"), paidWith:g("s_paid"), loginId:g("s_login"), twofa:$("s_2fa").value, vault:g("s_vault"), owner:g("s_owner"), manageUrl:g("s_manage"), notes:g("s_notes"), brandIds:[...sf.querySelectorAll(".sbrands input:checked")].map(x=>x.value), updatedAt:Date.now()};
    if(!d.service) return toast("Name the service");
    if([d.plan,d.paidWith,d.loginId,d.owner,d.notes,d.service].some(looksSecret)) return toast("That looks like a password, code or full card number. Keep it in your password manager; use only the last 4 digits of a card here.");
    if(/^otpauth:/i.test(d.vault)) return toast("That's a 2FA secret. Keep it in your authenticator, not here.");
    if(d.vault && !/^https:\/\//i.test(d.vault) && !/^(onepassword|bitwarden):/i.test(d.vault)) return toast("The password manager link should be the item's link");
    if(d.manageUrl && !/^https?:\/\//i.test(d.manageUrl)) d.manageUrl = "https://"+d.manageUrl;
    if(!S.db) return toast("Sign in to save changes");
    try{
      if(orig?.id){ const {id:_x, ...rest} = orig; await S.db.collection("subs").doc(orig.id).set({...rest, ...d}); }
      else await S.db.collection("subs").doc().set({...d, createdAt:Date.now()});
      toast("Saved"); done();
    }catch(e){ denied(e); }
  };
}
function brandSubsPane(id){
  const list = subsForBrand(id), shared = S.subs.filter(s=>!subBrands(s).length);
  return `<div class="sstats sm"><div><span class="eyebrow">This brand's plans</span><b>${esc(fmtTotals(subTotals(list)))}</b><small>a month</small></div><div><span class="eyebrow">Accounts</span><b>${list.length}</b><small>+ ${shared.length} shared tools</small></div></div>
    <div class="slist">${list.map(subRow).join("") || `<div class="muted" style="font-size:13px">Nothing tracked for this brand yet.</div>`}</div>
    <div><button class="btn sm" data-opensubs="${esc(id)}">Open accounts & subscriptions</button></div>`;
}

/* ---------- Dump & ideas ---------- */
function dumpItem(d){ const img = safeUrl(d.assetUrl);
  return `<div class="dump ${d.used?"used":""}" data-did="${d.id}">${img?`<img src="${esc(img)}" alt="">`:""}<div class="dump-t">${esc(d.text||"")}</div><div class="dump-m"><span>${new Date(d.createdAt||Date.now()).toLocaleDateString(undefined,{day:"numeric",month:"short"})}${d.used?" · used":""}</span><button class="btn ghost sm" data-rmdump="${d.id}" aria-label="Delete">✕</button></div></div>`; }
function dumpPane(id){
  const ds = dumpsOf(id);
  return `<div class="field"><label for="dumpText">Dump anything: a thought, a voice-note transcript, a link, a client story, a meme idea</label>
    <textarea id="dumpText" style="min-height:90px" placeholder="Raw is fine. One idea per dump works best."></textarea>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><button class="btn primary sm" id="dumpAdd">Add to dump</button><input type="file" id="dumpImg" accept="image/*" ${S.assets?"":"disabled"} aria-label="Attach an image"><span class="muted" style="font-size:12px">Ctrl/⌘ + Enter adds it</span></div></div>
  <div class="ai"><div class="ai-h"><span class="spark">✦</span> Turn the dump into ammo</div>
    <p class="muted" style="margin:0;font-size:12.5px">Claude reads the unused dumps with this brand's brain and turns them into ready ideas, spread across its channels.</p>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><label class="muted" style="font-size:12.5px;display:flex;gap:6px;align-items:center">Ideas per dump <input id="perDump" type="number" min="1" max="10" value="3" style="width:56px;background:var(--bg);border:1px solid var(--line);border-radius:6px;padding:4px 6px"></label><button class="btn fire sm" id="dumpGo" ${S.sample?"":"disabled"}>✦ Generate ideas</button><span class="status-line" id="dumpStatus"></span></div>
    <div class="sugg" id="dumpOut"></div><div id="dumpAll"></div></div>
  <div class="dumps" id="dumpList">${ds.map(dumpItem).join("") || `<div class="muted" style="font-size:13px">Nothing dumped yet.</div>`}</div>`;
}
function wireDump(id){
  const add = async () => {
    const text = $("dumpText").value.trim(), f = $("dumpImg").files[0];
    if(!text && !f) return toast("Write something or attach an image");
    $("dumpAdd").disabled = true;
    let asset = null; if(f) asset = await upload(f);
    if(await saveDump({brandId:id, text, ...(asset?{assetId:asset.id, assetUrl:asset.url}:{})})){ $("dumpText").value=""; $("dumpImg").value=""; toast("Dumped"); }
    $("dumpAdd").disabled = false; $("dumpText").focus();
  };
  $("dumpAdd").onclick = add;
  $("dumpText").addEventListener("keydown", e => { if(e.key==="Enter" && (e.metaKey||e.ctrlKey)){ e.preventDefault(); add(); } });
  $("dumpList").addEventListener("click", async e => { const r=e.target.closest("[data-rmdump]"); if(r){ r.disabled=true; await del("dumps", r.dataset.rmdump); } });
  $("dumpGo").onclick = async () => {
    const b = brandById(id), pending = dumpsOf(id).filter(d=>!d.used).slice(0,25);
    if(!pending.length) return toast("Dump something first");
    if(!chans(b).length) return toast("Give this brand a channel first");
    $("dumpGo").disabled = true; $("dumpStatus").textContent = "Claude is turning the dump into ideas…"; $("dumpOut").innerHTML=""; $("dumpAll").innerHTML="";
    let images = [];
    if(S.imgCaps){ for(const d of pending.filter(d=>d.assetUrl).slice(0,S.imgCaps.maxCount||3)){ const bl=await blobOf(d.assetUrl); if(bl) images.push(bl); } }
    const per = Math.max(1,Math.min(10,+$("perDump").value||3));
    const prompt = `${BASE_VOICE}
Turn this brand's raw content dump into ready-to-make post ideas. Use the brand brain for voice. Spread ideas across the brand's channels, using each platform's native format. Each dump should produce about ${per} ideas (different angles: story, lesson, hot take, how-to, behind-the-scenes, meme).
Brand: ${JSON.stringify(brandBrief(b))}
Dump items (JSON): ${JSON.stringify(pending.map(d=>({dumpId:d.id, text:(d.text||"").slice(0,1500), hasImage:!!d.assetUrl})))}
${images.length?`${images.length} attached image(s) belong to the dump items that have images, in order.`:""}
Reply with only a JSON array: {"dumpId":"...","channelId":"<one of the brand's channelIds>","title":"<hook>","format":"<native format>","notes":"<angle, outline or caption draft, under 80 words>"}. At most ${Math.min(40,pending.length*per)} items.`;
    try{
      const out = await S.sample.json(prompt, {modelTier:"default", ...(images.length?{images}:{})});
      const list = (Array.isArray(out)?out:[]).map(s=>({...s, brandId:id})).filter(validTarget);
      $("dumpStatus").textContent = list.length ? `${list.length} ideas from ${pending.length} dump${pending.length>1?"s":""}` : "No ideas came back. Try again.";
      const mk = s => ({...mkPlan(s), dumpId: pending.some(d=>d.id===s.dumpId)?s.dumpId:""});
      $("dumpOut").innerHTML = list.map(sugCard).join(""); wireSugs($("dumpOut"), list, mk);
      if(list.length){ $("dumpAll").innerHTML = `<button class="btn fire" id="dumpAddAll">Add all ${list.length} as ideas</button>`;
        $("dumpAddAll").onclick = async () => { $("dumpAddAll").disabled=true; let ok=0; for(const s of list){ if(await savePost(null, mk(s))) ok++; }
          for(const d of pending){ try{ await S.db.collection("dumps").doc(d.id).update({used:true}); }catch(_){} }
          $("dumpAddAll").textContent=`Added ${ok}`; $("dumpOut").querySelectorAll("[data-sug]").forEach(x=>{x.disabled=true;x.textContent="Added";}); toast(`${ok} ideas loaded`); }; }
    }catch(e){ $("dumpStatus").textContent = sampleErr(e); }
    $("dumpGo").disabled = false;
  };
}

function quickDump(){
  const opts2 = S.brands.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(b=>[b.id,b.name]);
  openPanel(`<div class="panel-h"><h2>Quick dump</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <div class="field"><label for="qdBrand">Brand</label><select id="qdBrand">${opts(opts2, S.brand||opts2[0]?.[0]||"")}</select></div>
    <div class="field"><label for="qdText">What's on your mind?</label><textarea id="qdText" placeholder="One idea per dump. Raw is fine."></textarea></div>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" id="qdAdd">Add to dump</button><button class="btn" id="qdOpen">Open brand dump</button></div>
    <p class="muted" style="font-size:12.5px;margin:0">Ctrl/⌘ + Enter adds it and keeps this open for the next one.</p>`);
  $("qdText").focus();
  const add = async () => { const t=$("qdText").value.trim(); if(!t) return toast("Write something first"); if(await saveDump({brandId:$("qdBrand").value, text:t})){ $("qdText").value=""; $("qdText").focus(); toast(`Dumped into ${brandById($("qdBrand").value)?.name||"brand"}`); } };
  $("qdAdd").onclick = add;
  $("qdText").addEventListener("keydown", e => { if(e.key==="Enter"&&(e.metaKey||e.ctrlKey)){ e.preventDefault(); add(); } });
  $("qdOpen").onclick = () => brandPanel($("qdBrand").value,{tab:"dump"});
}

/* ---------- platform-native preview ---------- */
function storePreview(b, c, p, P, title, body){
  const name = b?.name||"Brand", f = p.format||P.formats[0], cat = P.cat;
  const top = cat==="App stores" ? `${mono(b,"xl")}<div style="min-width:0"><b>${esc(name)}</b><span>${esc(b?.tagline||b?.industry||"")}</span><em>★ 4.6 · 10K+ · ${esc(P.label)}</em><button class="st-btn">Get</button></div>`
    : cat==="Food & dining" ? `<div class="st-hero">${esc(title)}</div><div style="min-width:0"><b>${esc(name)}</b><span>${esc(b?.industry||"Restaurant")} · ₹₹</span><em><i class="st-rate">4.3 ★</i> 30–35 min · ${esc(P.label)}</em></div>`
    : cat==="Travel & reviews" ? `<div class="st-hero">${esc(title)}</div><div style="min-width:0"><b>${esc(name)}</b><span>${esc(b?.industry||"")}</span><em><i class="st-dots">●●●●○</i> 1,284 reviews · ${esc(P.label)}</em></div>`
    : `<div class="st-hero">${esc(title)}</div><div style="min-width:0"><b>${esc(name)} ${esc(title).slice(0,60)}</b><span>${esc(b?.tagline||"")}</span><em>★ 4.4 (2,310) · <s>₹999</s> <strong>₹699</strong>${cat==="Quick commerce"?" · ⚡ 10 mins":""}</em><button class="st-btn">${cat==="Quick commerce"?"ADD":"Add to cart"}</button></div>`;
  return `<div class="pv-store ${cat==="App stores"?"app":""}" style="${bvars(b)};--pc:${P.c}"><div class="st-h"><span>${esc(P.label)}</span><small>${esc(f)}</small></div><div class="st-top">${top}</div>${body?`<div class="st-b"><span class="eyebrow">${esc(f)}</span><p>${esc(body)}</p></div>`:""}</div>`;
}
function preview(b, c, p){
  const P = cmeta(c), h = handleOf(b,c), title = p.title || "Your hook goes here", body = p.notes || "";
  const plat = `<span class="pv-plat" style="--pc:${P.c}">${esc(P.label)}${p.format?" · "+esc(p.format):""}</span>`;
  if (P.kind==="reel") return `<div class="pv-reel" style="${bvars(b)}"><span class="plat">${esc(P.label)} · ${esc(p.format||"Video")}</span><div class="hook">${esc(title)}</div><div class="side"><span>♥</span><span>💬</span><span>↗</span></div><div class="who">${mono(b)}<span>${esc(h)}</span></div><div class="cap">${esc(body)}</div></div>`;
  if (P.kind==="yt") return `<div class="pv-yt" style="${bvars(b)}"><div class="thumb"><b>${esc(title)}</b><span class="dur">${/Short/.test(p.format||"")?"SHORT":/Stream|Live/.test(p.format||"")?"LIVE":"12:04"}</span></div><div class="meta">${mono(b)}<div><strong>${esc(title)}</strong><span>${esc(b?.name||"")} · ${esc(P.label)}</span></div></div></div>`;
  if (P.kind==="mail") return `<div class="pv-mail" style="${bvars(b)}"><div class="mh">${mono(b,"sm")} ${esc(b?.name||"Newsletter")}</div><div class="mb"><b>${esc(title)}</b>\n\n${esc(body)}</div></div>`;
  if (P.kind==="press") return `<div class="pv-press" style="${bvars(b)};--pc:${P.c}"><div class="mast">${esc(P.label)}</div><span class="kick">${esc(p.format||"Story")}</span><h3>${esc(title)}</h3><p>${esc(body.split("\n")[0]||"")}</p><div class="by">${mono(b,"sm")} ${esc(b?.name||"")}</div></div>`;
  if (P.kind==="reddit") return `<div class="pv-card pv-reddit" style="${bvars(b)};--pc:${P.c}"><div class="rd-v">▲<b>1.2k</b>▼</div><div style="min-width:0"><span class="rd-sub">${esc(c?.handle?handleOf(b,c):P.label)} · posted by ${esc(b?.name||"")}</span><b class="rd-t">${esc(title)}</b><div class="body">${esc(body)}</div><span class="rd-f">💬 248 comments · ${esc(p.format||"Post")}</span></div></div>`;
  if (P.kind==="chat") return `<div class="pv-chat" style="${bvars(b)};--pc:${P.c}"><div class="ch-h"># ${esc(c?.handle||"announcements")}<span>${esc(P.label)}</span></div><div class="ch-m">${mono(b)}<div style="min-width:0"><b>${esc(b?.name||"")}</b> <small>today</small><p><b>${esc(title)}</b>\n${esc(body)}</p></div></div></div>`;
  if (P.kind==="repo") return `<div class="pv-repo" style="${bvars(b)}"><div class="rp-h">📦 <b>${esc(c?.handle||(b?.name||"brand").toLowerCase().replace(/\s+/g,"-"))}</b><span>Public</span></div><div class="rp-b"><h3>${esc(title)}</h3><p>${esc(body)}</p></div><div class="rp-f"><span>★ 1.4k</span><span>⑂ 210</span><span>${esc(p.format||"Repo")}</span></div></div>`;
  if (P.kind==="store") return storePreview(b, c, p, P, title, body);
  const media = /Carousel|Image|Pin|Video|Reel|Photo|Shot|Case/.test(p.format||"") ? `<div class="media">${esc(title)}</div>` : "";
  return `<div class="pv-card" style="${bvars(b)}">${plat}<div class="who">${mono(b)}<div><strong>${esc(b?.name||h)}</strong><span>${esc(h)}</span></div></div><div class="body"><b>${esc(title)}</b>${esc(body)}</div>${media}<div class="rx"><span>Like</span><span>Comment</span><span>Share</span></div></div>`;
}

/* ---------- post editor ---------- */
function postPanel(id, preset){
  const base = id ? S.posts.find(x=>x.id===id) : null; if(id && !base) return;
  const p = base ? {...base} : {status:"idea", ...(preset||{})};
  if(!p.brandId) p.brandId = S.brand || (S.brands.find(b=>chans(b).length)||S.brands[0])?.id || "";
  let b = brandById(p.brandId);
  if(!p.channelId || !chanOf(b,p.channelId)) p.channelId = chans(b)[0]?.id || "";
  openPanel(`<div class="panel-h"><h2>${id?"Edit post":"New post"}</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
  <div class="pv-wrap" id="pv"></div>
  <form class="form" id="postForm" onsubmit="return false">
    <div class="field full"><label for="p_title">Hook / title</label><input id="p_title" required value="${esc(p.title)}"></div>
    <div class="field"><label for="p_brand">Brand</label><select id="p_brand">${opts(S.brands.slice().sort((a,b)=>a.name.localeCompare(b.name)).map(x=>[x.id,x.name]),p.brandId)}</select></div>
    <div class="field"><label for="p_chan">Channel</label><select id="p_chan"></select></div>
    <div class="field"><label for="p_status">Stage</label><select id="p_status">${opts(STAGES.map(s=>[s.id,s.one]),p.status||"idea")}</select></div>
    <div class="field"><label for="p_format">Format</label><select id="p_format"></select></div>
    <div class="field"><label for="p_date">Date</label><input id="p_date" type="date" value="${esc(p.date)}"></div>
    <div class="field"><label for="p_link">Live link</label><input id="p_link" type="url" placeholder="https://" value="${esc(p.link)}"></div>
    <div class="field full"><label for="p_notes">Caption, script or notes</label><textarea id="p_notes">${esc(p.notes)}</textarea></div>
  </form>
  ${S.sample?`<div><button class="btn sm" id="writeIt">✦ Write it in the brand voice</button> <span class="status-line" id="wStatus"></span></div>`:""}
  <div id="vidWrap">${videoSection({...p, id})}</div>
  <div class="panel-foot"><div id="delZone">${id?`<button class="btn danger" data-askdel>Delete post</button>`:""}</div>
    <div class="actions">${id?`<button class="btn" id="blastThis">Blast this →</button>`:""}${safeUrl(p.link)?`<a class="btn" href="${esc(p.link)}" target="_blank" rel="noopener">Open ↗</a>`:""}<button class="btn" data-close>Cancel</button><button class="btn primary" id="postSave">${id?"Save":"Add post"}</button></div></div>`);
  const fillChan = keep => { b = brandById($("p_brand").value); const o = chans(b).map(c=>[c.id, `${cmeta(c).label}${c.handle?" · "+handleOf(b,c):""}`]); $("p_chan").innerHTML = o.length ? opts(o, keep) : `<option value="">No channels yet</option>`; fillFormat(p.format); };
  const fillFormat = keep => { const list = cmeta(chanOf(b,$("p_chan").value)).formats; $("p_format").innerHTML = opts([...list.map(f=>[f,f]), ...(keep&&!list.includes(keep)?[[keep,keep]]:[])], keep||list[0]); draw(); };
  const draw = () => { $("pv").innerHTML = preview(b, chanOf(b,$("p_chan").value), {title:$("p_title").value, notes:$("p_notes").value, format:$("p_format").value}); const vw=$("vidWrap"); if(vw) vw.hidden = !VIDEO_RX.test($("p_format").value||""); };
  fillChan(p.channelId);
  $("p_brand").onchange = () => fillChan(""); $("p_chan").onchange = () => fillFormat($("p_format").value);
  ["p_title","p_notes"].forEach(k=>$(k).addEventListener("input",draw)); $("p_format").addEventListener("change",draw);
  const collect = () => { const c = chanOf(b,$("p_chan").value); return {title:$("p_title").value.trim(), brandId:$("p_brand").value, channelId:c?.id||"", platform:c?.platform||"other", status:$("p_status").value, format:$("p_format").value, date:$("p_date").value, link:$("p_link").value.trim(), notes:$("p_notes").value}; };
  $("postSave").onclick = async () => { const data = collect(); if(!data.title){ $("p_title").focus(); return toast("Give the post a hook"); } if(await savePost(id, data)){ closePanel(); toast(id?"Post saved":"Post added"); } };
  wireVideo(id, () => ({...(base||{}), ...collect()}));
  if($("writeIt")) $("writeIt").onclick = async () => {
    const d = collect(), c = chanOf(b,d.channelId); if(!d.title) return toast("Add a hook first");
    $("writeIt").disabled=true; $("wStatus").textContent="Claude is writing…";
    try{ const {text} = await S.sample(`${BASE_VOICE}\nWrite the full ${d.format||"post"} for ${cmeta(c).label} (${handleOf(b,c)}) in this brand's voice. Native to the platform: length, structure, line breaks, hashtags or CTA as that platform expects. For video formats write a tight script with on-screen text and shot notes.\nBrand: ${JSON.stringify(brandBrief(b))}\nHook: ${d.title}\nNotes so far: ${d.notes||"none"}\nReply with only the post/script text.`, {modelTier:"default", onText:({text})=>{ $("p_notes").value=text; draw(); }}); $("p_notes").value=text; draw(); $("wStatus").textContent="Done. Edit freely, then save."; }
    catch(e){ $("wStatus").textContent = sampleErr(e); }
    $("writeIt").disabled=false;
  };
  if(id){
    $("blastThis").onclick = () => blastPanel({...base, ...collect(), id});
    $("panel").querySelector("[data-askdel]").onclick = () => {
      $("delZone").innerHTML = `<div class="confirm"><span>Delete this post?</span><button class="btn danger sm" id="delYes">Delete</button><button class="btn sm" id="delNo">Keep</button></div>`;
      $("delNo").onclick = () => postPanel(id);
      $("delYes").onclick = async () => { if(await del("posts", id)){ closePanel(); toast("Post deleted"); } };
    };
  }
}


/* ================= link reading (auto-scrape) ================= */
const BROWSER = "host:claude_browser";
function normUrl(u){ u=String(u||"").trim().replace(/[),.;]+$/,""); if(!u) return ""; if(/^@[\w.]+$/.test(u)) return ""; if(!/^https?:\/\//i.test(u)) u="https://"+u; try{ const x=new URL(u); if(!x.hostname.includes(".")) return ""; return x.href; }catch(_){ return ""; } }
const srcKey = u => u.replace(/^https?:\/\/(www\.)?/i,"").replace(/\/+$/,"").toLowerCase().replace(/[^a-z0-9]+/g,"_").slice(0,120);
function linkList(b, extra){
  const raw = [b.website, ...chans(b).map(c=>c.url), ...String(extra ?? b.brainSources?.links ?? "").split(/[\s,]+/)];
  const out = [], seen = new Set();
  raw.map(normUrl).filter(Boolean).forEach(u=>{ const k=srcKey(u); if(!seen.has(k)){ seen.add(k); out.push(u); } });
  return out;
}
let browserTools = null;
async function browserReady(){
  if(!S.mcp) return false;
  if(browserTools) return browserTools.ok;
  try{
    const [nav, txt] = await Promise.all([S.mcp.describeTool(BROWSER,"navigate"), S.mcp.describeTool(BROWSER,"get_page_text")]);
    browserTools = {ok:true, navReq:nav?.inputSchema?.required||[], txtReq:txt?.inputSchema?.required||[], txtProps:Object.keys(txt?.inputSchema?.properties||{})};
  }catch(_){ browserTools = {ok:false}; }
  return browserTools.ok;
}
function textOf(res){ if(!res) return ""; if(typeof res.payload==="string") return res.payload; const blocks=(res.content||[]).filter(b=>b.type==="text").map(b=>b.text); if(blocks.length) return blocks.join("\n"); return typeof res.payload==="object" ? JSON.stringify(res.payload) : ""; }
async function readLink(url){
  if(!(await browserReady())) throw {code:"no_browser"};
  const nav = await S.mcp.callTool(BROWSER, "navigate", {url});
  const navText = textOf(nav);
  const tabId = nav?.payload?.tabId ?? nav?.structuredContent?.tabId ?? (navText.match(/tab\s*id[^0-9]{0,4}(\d+)/i)||[])[1];
  const input = {};
  if(browserTools.txtProps.includes("tabId") && tabId!=null) input.tabId = isNaN(+tabId) ? tabId : +tabId;
  if(browserTools.txtReq.includes("tabId") && input.tabId==null) throw {code:"no_tab"};
  await new Promise(r=>setTimeout(r,1200));
  const res = await S.mcp.callTool(BROWSER, "get_page_text", input);
  const text = textOf(res).trim();
  if(text.length < 40) throw {code:"empty"};
  return text.slice(0, 8000);
}
const reading = new Set();
async function autoRead(brandId, {force=false, extraLinks, quiet=false}={}){
  const b = brandById(brandId); if(!b || reading.has(brandId) || !S.db) return {read:0};
  const links = linkList(b, extraLinks);
  const sources = {...(b.sources||{})};
  const todo = links.filter(u=>{ const s=sources[srcKey(u)]; return force || !s || (s.status!=="read" && s.status!=="queued") || (s.status==="queued" && S.mcp && browserTools?.ok!==false); });
  if(!todo.length) return {read:0};
  reading.add(brandId); setSrcStatus(brandId, `Reading ${todo.length} link${todo.length>1?"s":""}…`);
  let read=0, queued=0, failed=0;
  for(const u of todo){
    try{ const text = await readLink(u); sources[srcKey(u)] = {url:u, status:"read", text, at:Date.now(), by:"page"}; read++; }
    catch(e){ if(e?.code==="no_browser"){ sources[srcKey(u)] = {url:u, status:"queued", at:Date.now()}; queued++; } else { sources[srcKey(u)] = {url:u, status:"failed", at:Date.now(), why:e?.code||"error"}; failed++; } }
    renderSources(brandId, sources);
  }
  await patchBrand(brandId, {sources, ...(extraLinks!=null?{brainSources:{...(b.brainSources||{}), links:extraLinks}}:{})});
  reading.delete(brandId);
  const msg = [read?`Read ${read}`:"", queued?`${queued} queued for Claude in chat`:"", failed?`${failed} couldn't be read`:""].filter(Boolean).join(" · ");
  setSrcStatus(brandId, msg);
  if(read && S.sample){ setSrcStatus(brandId, msg+" · rebuilding the brain…"); try{ await buildBrain(brandId); setSrcStatus(brandId, msg+" · brain updated from the new sources."); }catch(e){ setSrcStatus(brandId, msg+" · "+sampleErr(e)); } }
  else if(!quiet && queued) toast("Links saved. Claude in chat will read them.");
  return {read, queued, failed};
}
function setSrcStatus(brandId, t){ const el=$("srcStatus"); if(el && $("panel").dataset.brand===brandId) el.textContent=t; }
function srcChip(s){ const st = s.status||"new"; const lab = {read:"✓ read", queued:"⏳ queued for Claude", failed:"✕ couldn't read", new:"○ not read yet"}[st]||st;
  let host=s.url; try{ const x=new URL(s.url); host=(x.hostname.replace(/^www\./,"")+x.pathname).replace(/\/$/,""); }catch(_){}
  return `<div class="src ${st}"><span class="src-u" title="${esc(s.url)}">${esc(host)}</span><span class="src-s">${lab}${s.at&&st==="read"?` · ${new Date(s.at).toLocaleDateString(undefined,{day:"numeric",month:"short"})}${s.by==="claude"?" by Claude":""}`:""}</span></div>`; }
function renderSources(brandId, sources){
  const el = $("srcList"); if(!el || $("panel").dataset.brand!==brandId) return;
  const b = brandById(brandId); if(!b) return;
  const src = sources || b.sources || {};
  const links = linkList(b, $("bb_links")?.value);
  const known = new Set(links.map(srcKey));
  const rows = links.map(u=>src[srcKey(u)] || {url:u, status:"new"}).concat(Object.entries(src).filter(([k])=>!known.has(k)).map(([,v])=>v));
  el.innerHTML = rows.length ? rows.map(srcChip).join("") : `<div class="muted" style="font-size:12.5px">No links yet. Add the website or a profile link below, or on the Channels tab.</div>`;
}

async function buildBrain(brandId, extra={}){
  const cur = extra.cur || brandById(brandId);
  const text = extra.text ?? cur.brainSources?.text ?? "", images = extra.images || [];
  const srcs = Object.values(cur.sources||{}).filter(s=>s.status==="read" && s.text);
  let budget = 24000;
  const srcText = srcs.map(s=>{ const t = s.text.slice(0, Math.max(0, Math.min(8000, budget))); budget -= t.length; return t ? `--- ${s.url} ---\n${t}` : ""; }).filter(Boolean).join("\n\n");
  const prompt = `You are a brand strategist building a "brand brain": a compact voice and content profile that a content team (and other Claude calls) will use to write posts for this brand across many platforms.

Brand facts (JSON): ${JSON.stringify({name:cur.name, group:cur.group, industry:cur.industry, whatItIs:cur.tagline, extraNotes:cur.voice, website:cur.website, colours:[cur.color,cur.color2], channels:chans(cur).map(c=>({platform:cmeta(c).label, handle:c.handle, url:c.url, postsPerWeek:c.cadence}))})}
Text read from the brand's own links (website, social profiles, captions). This is the strongest evidence; quote its real phrases, spelling quirks and themes:
"""${srcText||"none"}"""
Extra material pasted by the owner:
"""${String(text).slice(0,10000)||"none"}"""
${images.length?`Also attached: ${images.length} image(s) (logo and/or posts/screenshots). Read the visual identity from them: colours, type feel, imagery style.`:""}
Previous brain (refine it, but let real evidence above override earlier guesses): ${JSON.stringify(cur.brain||null).slice(0,3000)}

Context: the owner may run several brands; write in each brand's own language. If material is thin, make specific assumptions from the industry and say so in "assumptions".

Reply with only JSON:
{"summary":"2 sentences: who we are and why anyone should care","audience":"specific audience","personality":["4-6 adjectives"],"tone":{"Playful":0-100,"Bold":0-100,"Expert":0-100,"Warm":0-100,"Desi":0-100},"pillars":[{"name":"","share":"40%","about":""}],"hooks":["5 reusable hook templates with [blanks]"],"dos":["4"],"donts":["4"],"vocabulary":["8 words/phrases we actually use"],"hashtags":["6"],"language":"","ctaStyle":"","visual":{"style":"","type":"","colors":["#hex","#hex"]},"assumptions":"what you guessed"}`;
  const out = await S.sample.json(prompt, {modelTier:"default", ...(images.length?{images}:{})});
  if(!out || !out.summary) throw {code:"empty"};
  const used = [srcs.length?`${srcs.length} link${srcs.length>1?"s":""} read`:"", text?"pasted text":"", images.length?`${images.length} image(s)`:""].filter(Boolean);
  const brain = {...out, source:`Built by Claude from ${used.length?used.join(", "):"brand facts only"}`, updatedAt:Date.now()};
  if(brandId) await patchBrand(brandId, {brain});
  return brain;
}


/* ================= media library + Remotion edit queue ================= */
const VIDEO_RX = /Reel|Short|Video|Story|Spotlight|Clip|Stream|Live|Showreel|Episode/i;
const RSTATUS = {queued:"Queued", rendering:"Rendering in your browser", done:"Ready", failed:"Failed"};
const DEFAULT_STYLES = ["Auto-pick","Slam hook + beat-cut","Camcorder flashback","Phonk beat-cut","Deadpan one-liner","Split-screen before/after","Talking head + captions","Gold title card outro"];
const mediaOf = id => S.media.find(m=>m.id===id);
const renderFor = postId => S.renders.filter(r=>r.postId===postId).sort((a,b)=>(b.requestedAt||0)-(a.requestedAt||0))[0];
function styleNames(){ const s = S.styles.map(x=>x.name).filter(Boolean); return s.length ? s : DEFAULT_STYLES; }
function mediaThumb(m, sel){ const t = safeUrl(m.thumbUrl) || (m.kind==="image" ? safeUrl(m.assetUrl) : "");
  return `<button class="mthumb ${sel?"sel":""}" data-mid="${m.id}" title="${esc(m.name||"")}${m.description?" · "+esc(m.description):""}">${t?`<img src="${esc(t)}" alt="" loading="lazy">`:`<span class="mkind">${m.kind==="audio"?"♪":m.kind==="image"?"▣":"▶"}</span>`}<span class="mcap">${esc((m.name||"").slice(0,28))}${m.durationSec?` · ${Math.round(m.durationSec)}s`:""}</span>${sel?`<span class="mnum">${sel}</span>`:""}</button>`; }
function renderBadge(postId){ const r = renderFor(postId); if(!r) return ""; return `<span class="rbadge ${r.status}">🎬 ${esc(RSTATUS[r.status]||r.status)}</span>`; }
function syncNote(){ return window.__hds.folderNote(); }

function mediaPanel(){
  const tags = [...new Set(S.media.flatMap(m=>m.tags||[]))].slice(0,30);
  openPanel(`<div class="panel-h"><h2>Media library</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <p class="muted" style="margin:0;font-size:12.5px">${syncNote()}</p>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><input id="mSearch" placeholder="Search clips, tags, descriptions" style="flex:1;min-width:180px;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 10px">
      <select id="mKind" style="background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px">${opts([["","All"],["video","Video"],["image","Images"],["audio","Audio"]],"")}</select>
      <label class="btn sm" ${S.assets?"":"aria-disabled=\"true\""}>Upload<input type="file" id="mUp" accept="video/*,image/*,audio/*" multiple hidden ${S.assets?"":"disabled"}></label></div>
    ${tags.length?`<div class="quick">${tags.map(t=>`<button class="btn sm ghost" data-mtag="${esc(t)}">#${esc(t)}</button>`).join("")}</div>`:""}
    <div class="mgrid" id="mGrid"></div><span class="status-line" id="mStatus"></span>`, true);
  const draw = () => { const q=$("mSearch").value.toLowerCase(), k=$("mKind").value;
    const list = S.media.filter(m=>(!k||m.kind===k) && (!q || [m.name,m.description,(m.tags||[]).join(" "),m.path].join(" ").toLowerCase().includes(q))).sort((a,b)=>(b.takenAt||b.addedAt||0)-(a.takenAt||a.addedAt||0)).slice(0,300);
    $("mGrid").innerHTML = list.map(m=>mediaThumb(m)).join("") || `<div class="muted" style="font-size:13px">No media yet.</div>`; };
  draw(); $("mSearch").oninput = draw; $("mKind").onchange = draw;
  $("panel").querySelectorAll("[data-mtag]").forEach(b=>b.onclick=()=>{ $("mSearch").value=b.dataset.mtag; draw(); });
  $("mUp").onchange = async () => { const files=[...$("mUp").files]; let ok=0; for(const f of files){ $("mStatus").textContent=`Uploading ${f.name}…`; const r=await upload(f); if(r){ try{ await S.db.collection("media").doc().set({name:f.name, kind:f.type.startsWith("video")?"video":f.type.startsWith("audio")?"audio":"image", assetId:r.id, assetUrl:r.url, source:"upload", addedAt:Date.now(), tags:[]}); ok++; }catch(e){ denied(e); } } } $("mStatus").textContent=`Uploaded ${ok}.`; };
}

function videoSection(p){
  const r = p.id ? renderFor(p.id) : null;
  const out = r?.output || {};
  return `<div class="ai vid" id="vidBox">
    <div class="ai-h">🎬 Edit with Remotion <span class="muted" style="font-weight:400;font-size:12px">in your browser</span></div>
    ${r?`<div class="rstat ${r.status}"><b>${esc(RSTATUS[r.status]||r.status)}</b>${r.status==="failed"&&r.error?` · ${esc(r.error)}`:""}${r.updatedAt?` · ${new Date(r.updatedAt).toLocaleString(undefined,{hour:"numeric",minute:"2-digit",day:"numeric",month:"short"})}`:""}</div>
      ${safeUrl(out.assetUrl)?`<video class="rvid" src="${esc(out.assetUrl)}" controls playsinline preload="metadata"></video>`:""}
      ${out.localPath?`<div class="muted" style="font-size:12px">On your Mac: <code>${esc(out.localPath)}</code></div>`:""}`:""}
    <div class="field"><span class="lbl">Clips, in order (${S.media.length} in your library)</span><div class="mgrid sm" id="vSel"></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" id="vPick">Pick clips</button>${S.sample?`<button class="btn sm" id="vAuto">✦ Auto-pick from script</button>`:""}<button class="btn sm ghost" id="vClear">Clear</button><span class="status-line" id="vStatus"></span></div>
      <div id="vPicker" hidden><input id="vSearch" placeholder="Search clips" style="width:100%;background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:7px 10px;margin:6px 0"><div class="mgrid" id="vGrid"></div></div></div>
    <div class="form">
      <div class="field"><label for="v_style">Editing style</label><select id="v_style">${opts(styleNames().map(s=>[s,s]), p.edit?.style||styleNames()[0])}</select></div>
      <div class="field"><label for="v_len">Length (seconds)</label><input id="v_len" type="number" min="5" max="600" value="${esc(p.edit?.lengthSec||25)}"></div>
      <div class="field"><label for="v_music">Music</label><input id="v_music" value="${esc(p.edit?.music||"")}" placeholder="e.g. lo-fi into phonk drop, or a trending audio name"></div>
      <div class="field"><label for="v_aspect">Aspect</label><select id="v_aspect">${opts([["9:16","9:16 vertical"],["1:1","1:1 square"],["16:9","16:9 wide"],["4:5","4:5 feed"]], p.edit?.aspect||"9:16")}</select></div>
      ${(()=>{ const vb=brandById(p.brandId); return avatarReady(vb) ? `<div class="field full"><label for="v_avatar">🧑 Avatar (${esc(vb.avatar.name||"presenter")})</label><select id="v_avatar">${opts(AV_MODES, p.edit?.avatarMode||"none")}</select></div>` : `<div class="field full muted" style="font-size:12px">🧑 No avatar for this brand yet. Set one up in the brand hub's Avatar tab to have a digital clone present this video.</div>`; })()}
      <div class="field full"><label for="v_notes">Notes for the editor</label><input id="v_notes" value="${esc(p.edit?.notes||"")}" placeholder="Captions, pacing, motion graphics, what to avoid"></div>
    </div>
    <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn fire" id="vSend">${r&&r.status!=="failed"?"Re-render with Remotion":"Send to Remotion"}</button><span class="status-line" id="vSendStatus">${p.id?"":"Save the post first."}</span></div>
  </div>`;
}
function wireVideo(postId, getPost){
  let sel = [...(getPost().edit?.clips||[])].filter(c=>mediaOf(c.mediaId));
  const drawSel = () => { $("vSel").innerHTML = sel.map((c,i)=>{ const m=mediaOf(c.mediaId); return m?mediaThumb(m,i+1):""; }).join("") || `<span class="muted" style="font-size:12px;grid-column:1/-1">No clips picked. The editor will choose from your library using the script.</span>`; };
  const drawGrid = () => { const q=($("vSearch").value||"").toLowerCase(); const ids=new Set(sel.map(c=>c.mediaId));
    $("vGrid").innerHTML = S.media.filter(m=>m.kind!=="audio" && (!q || [m.name,m.description,(m.tags||[]).join(" ")].join(" ").toLowerCase().includes(q))).slice(0,200).map(m=>mediaThumb(m, ids.has(m.id)?sel.findIndex(c=>c.mediaId===m.id)+1:0)).join("") || `<span class="muted" style="font-size:12px">${S.media.length?"No matches.":"Your library is empty. Sync it from your Mac or upload clips in Media."}</span>`; };
  drawSel();
  $("vPick").onclick = () => { $("vPicker").hidden = !$("vPicker").hidden; drawGrid(); };
  $("vSearch").oninput = drawGrid;
  $("vClear").onclick = () => { sel=[]; drawSel(); if(!$("vPicker").hidden) drawGrid(); };
  const toggle = mid => { const i=sel.findIndex(c=>c.mediaId===mid); if(i>=0) sel.splice(i,1); else sel.push({mediaId:mid}); drawSel(); if(!$("vPicker").hidden) drawGrid(); };
  $("vGrid").addEventListener("click", e => { const b=e.target.closest("[data-mid]"); if(b) toggle(b.dataset.mid); });
  $("vSel").addEventListener("click", e => { const b=e.target.closest("[data-mid]"); if(b) toggle(b.dataset.mid); });
  if($("vAuto")) $("vAuto").onclick = async () => {
    const p = getPost(); if(!S.media.length) return toast("Your media library is empty");
    $("vAuto").disabled=true; $("vStatus").textContent="Claude is matching clips to the script…";
    const lib = S.media.filter(m=>m.kind!=="audio").slice(0,400).map(m=>({id:m.id, name:m.name, d:m.description, tags:m.tags, sec:m.durationSec, date:m.takenAt?new Date(m.takenAt).toISOString().slice(0,10):undefined}));
    try{
      const out = await S.sample.json(`Pick and order clips from this media library to edit a ${$("v_len").value||25}-second ${$("v_aspect").value} video in the style "${$("v_style").value}".
Hook: ${p.title}
Script / notes: ${(p.notes||"").slice(0,4000)}
Library (JSON): ${JSON.stringify(lib)}
Use only ids from the library. Prefer clips whose name/description/tags/date fit each beat of the script. Reply with only JSON: {"clips":[{"mediaId":"","beat":"which line of the script it covers","inSec":0,"outSec":3}],"music":"suggested music direction","notes":"one line for the editor"}`, {modelTier:"default"});
      const ids = new Set(S.media.map(m=>m.id));
      sel = (out?.clips||[]).filter(c=>ids.has(c.mediaId)).map(c=>({mediaId:c.mediaId, beat:String(c.beat||""), inSec:+c.inSec||0, outSec:+c.outSec||0}));
      if(out?.music && !$("v_music").value) $("v_music").value = out.music;
      if(out?.notes && !$("v_notes").value) $("v_notes").value = out.notes;
      drawSel(); $("vStatus").textContent = sel.length ? `Picked ${sel.length} clips.` : "No matching clips found.";
    }catch(e){ $("vStatus").textContent = sampleErr(e); }
    $("vAuto").disabled=false;
  };
  $("vSend").onclick = async () => {
    if(!postId) return toast("Save the post first");
    const p = getPost(), b = brandById(p.brandId), c = chanOf(b,p.channelId);
    const edit = {style:$("v_style").value, lengthSec:Math.max(5,+$("v_len").value||25), music:$("v_music").value.trim(), aspect:$("v_aspect").value, notes:$("v_notes").value.trim(), clips:sel, avatarMode:$("v_avatar")?.value||"none"};
    $("vSend").disabled = true;
    try{
      await S.db.collection("posts").doc(postId).update({edit, updatedAt:Date.now()});
      await S.db.collection("renders").doc().set({postId, brandId:p.brandId, brand:b?.name||"", channel:c?cmeta(c).label:"", handle:c?.handle||"", title:p.title, script:p.notes||"", format:p.format||"", ...edit,
        clips: sel.map(x=>{ const m=mediaOf(x.mediaId)||{}; return {...x, name:m.name||"", path:m.path||"", assetUrl:m.assetUrl||""}; }),
        brain: b?.brain ? {personality:b.brain.personality, visual:b.brain.visual, language:b.brain.language} : null,
        avatar: edit.avatarMode!=="none" && avatarReady(b) ? {mode:edit.avatarMode, name:b.avatar.name, provider:b.avatar.provider, providerId:b.avatar.providerId, voiceId:b.avatar.voiceId, language:b.avatar.language, look:b.avatar.look, persona:b.avatar.persona} : null,
        colors:[b?.color, b?.color2], status:"queued", requestedAt:Date.now(), updatedAt:Date.now()});
      $("vSendStatus").textContent = "Queued. It renders right here in your browser; keep this tab open.";
      toast("Sent to Remotion");
    }catch(e){ denied(e); }
    $("vSend").disabled = false;
  };
}

function queuePanel(){
  const list = S.renders.slice().sort((a,b)=>(b.requestedAt||0)-(a.requestedAt||0)).slice(0,60);
  openPanel(`<div class="panel-h"><h2>Edit queue</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <p class="muted" style="margin:0;font-size:12.5px">Videos sent to Remotion. They render in this browser tab with Remotion, using the media in your connected folder, and the finished video appears here. ${esc(S.meta?.renderer?.at?`Renderer last checked in ${new Date(S.meta.renderer.at).toLocaleString(undefined,{hour:"numeric",minute:"2-digit",day:"numeric",month:"short"})}.`:"The renderer on your Mac hasn't checked in yet.")}</p>
    <div class="rq">${list.map(r=>{ const b=brandById(r.brandId); return `<div class="rq-row" style="${bvars(b)}">${mono(b,"sm")}<div style="min-width:0;flex:1"><b>${esc(r.title||"Untitled")}</b><div class="muted" style="font-size:12px">${esc(r.brand||"")} · ${esc(r.channel||"")} · ${esc(r.style||"")} · ${r.clips?.length||0} clips</div>${safeUrl(r.output?.assetUrl)?`<video class="rvid sm" src="${esc(r.output.assetUrl)}" controls playsinline preload="metadata"></video>`:""}${r.output?.localPath?`<div class="muted" style="font-size:11.5px"><code>${esc(r.output.localPath)}</code></div>`:""}</div><span class="rbadge ${r.status}">${esc(RSTATUS[r.status]||r.status)}</span>${S.posts.some(x=>x.id===r.postId)?`<button class="btn sm ghost" data-openpost="${esc(r.postId)}">Open</button>`:`<span class="rq-orph"><span class="muted" style="font-size:11.5px">Post deleted</span><button class="btn sm" data-restore="${esc(r.id)}">Restore as post</button><button class="btn sm ghost" data-rmrender="${esc(r.id)}">Remove</button></span>`}</div>`; }).join("") || `<div class="muted" style="font-size:13px">Nothing in the queue yet. Open a video post and press Send to Remotion.</div>`}</div>`, true);
  $("panel").querySelectorAll("[data-openpost]").forEach(b=>b.onclick=()=>postPanel(b.dataset.openpost));
  $("panel").querySelectorAll("[data-rmrender]").forEach(b=>b.onclick=async()=>{ if(await del("renders", b.dataset.rmrender)){ toast("Removed from the queue"); queuePanel(); } });
  $("panel").querySelectorAll("[data-restore]").forEach(bt=>bt.onclick=async()=>{
    const r = S.renders.find(x=>x.id===bt.dataset.restore); if(!r || !S.db) return;
    const b = brandById(r.brandId), c = chans(b).find(x=>cmeta(x).label===r.channel) || chans(b)[0];
    if(!b || !c) return toast("That brand or channel no longer exists");
    const pid = r.postId || "p-"+uid();
    try{
      await S.db.collection("posts").doc(pid).set({brandId:b.id, channelId:c.id, platform:c.platform, title:r.title||"Untitled", notes:r.script||"", format:r.format||cmeta(c).formats[0], status:"drafting", date:"", link:"", edit:{style:r.style||"", lengthSec:r.lengthSec||25, music:r.music||"", aspect:r.aspect||"9:16", notes:r.notes||"", clips:r.clips||[], avatarMode:r.avatar?.mode||"none"}, createdAt:Date.now(), updatedAt:Date.now()});
      if(r.postId!==pid) await S.db.collection("renders").doc(r.id).update({postId:pid});
      toast("Post restored to Drafting"); setTimeout(queuePanel, 300);
    }catch(e){ denied(e); }
  });
}
function updateQueueBtn(){ const n = S.renders.filter(r=>r.status==="queued"||r.status==="rendering").length, d = S.renders.filter(r=>r.status==="done").length; $("queueBtn").innerHTML = `🎬 Edit queue${n?` <span class="qn">${n}</span>`:d?` <span class="qn done">${d}</span>`:""}`; }

/* ================= Claude helpers ================= */
function brandBrief(b){ const br=b.brain||{}; return {brandId:b.id, name:b.name, group:b.group, industry:b.industry, whatItIs:b.tagline, notes:b.voice, brain: br.summary ? {summary:br.summary, audience:br.audience, personality:br.personality, pillars:br.pillars, hooks:br.hooks, dos:br.dos, donts:br.donts, vocabulary:br.vocabulary, language:br.language, ctaStyle:br.ctaStyle} : null, channels:chans(b).map(c=>({channelId:c.id, platform:cmeta(c).label, handle:c.handle, postsPerWeek:+c.cadence||0, formats:cmeta(c).formats}))}; }
function sampleErr(e){ return e?.code==="no_key" ? "Add your Claude API key in ⚙ Settings first." : e?.code==="bad_key" ? "Your Claude API key was rejected. Check it in ⚙ Settings." : e?.code==="not_granted" ? "Claude access was declined for this page." : e?.code==="rate_limited" ? "Too many requests. Try again in a minute." : e?.code==="images_unavailable" ? "Images can't be sent here. Try again without images." : (e?.message||"Claude couldn't answer. Try again."); }
const BASE_VOICE = "The operator may run several brands at once. Each brand keeps its own identity and voice: follow the brand's brain (summary, personality, pillars, dos/donts, vocabulary, language) when present.";
function sugCard(s, i){ const b=brandById(s.brandId), c=chanOf(b,s.channelId);
  return `<div class="sug" style="${bvars(b)}"><div class="card-m">${mono(b,"sm")}${pgm(cmeta(c))}<span>${esc(b?.name||"")} · ${esc(c?handleOf(b,c):"")}</span>${s.format?`<span>· ${esc(s.format)}</span>`:""}${s.date?`<span class="date">${fmtDate(s.date)}</span>`:""}</div>
    <strong>${esc(s.title)}</strong>${s.notes?`<p>${esc(s.notes)}</p>`:""}<div class="sug-a"><button class="btn sm" data-sug="${i}">Add</button></div></div>`; }
function wireSugs(box, list, mk){ box.querySelectorAll("[data-sug]").forEach(btn => btn.onclick = async () => { btn.disabled = true; if(await savePost(null, mk(list[+btn.dataset.sug]))) btn.textContent = "Added"; else btn.disabled = false; }); }
function validTarget(s){ const b=brandById(s?.brandId); return !!(b && chanOf(b,s.channelId) && s.title); }
function mkPlan(s){ const b=brandById(s.brandId), c=chanOf(b,s.channelId), fm=cmeta(c).formats; return {title:String(s.title).slice(0,300), notes:String(s.notes||""), brandId:b.id, channelId:c.id, platform:c.platform, format:fm.includes(s.format)?s.format:fm[0], date:/^\d{4}-\d{2}-\d{2}$/.test(s.date||"")?s.date:"", status:"idea", link:""}; }

/* ================= BLAST ================= */
function blastPanel(src){
  const ideas = S.posts.filter(p=>p.status==="idea").sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,80);
  const brands = S.brands.filter(b=>b.status!=="paused" && chans(b).length).sort((a,b)=>GROUPS.indexOf(a.group||"Other")-GROUPS.indexOf(b.group||"Other")||(a.order??999)-(b.order??999));
  const pre = new Set(); if (src?.brandId) chans(brandById(src.brandId)).forEach(c=>{ if(c.id!==src.channelId) pre.add(src.brandId+"|"+c.id); });
  const catsIn = CATS.concat(["Custom"]).filter(cat=>brands.some(b=>chans(b).some(c=>cmeta(c).cat===cat)));
  openPanel(`<div class="panel-h"><h2>Blast one idea</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
  <p class="muted" style="margin:0">One core idea, fired across as many brands and channels as you pick. Claude rewrites it for each platform in each brand's voice, or you can copy it as-is.</p>
  <div class="form">
    <div class="field full"><label for="bl_pick">Start from an idea in the bank (optional)</label><select id="bl_pick"><option value="">Type a new idea below</option>${opts(ideas.map(p=>[p.id, (brandById(p.brandId)?.name?brandById(p.brandId).name+": ":"")+p.title]), src?.id||"")}</select></div>
    <div class="field full"><label for="bl_title">Core idea / hook</label><input id="bl_title" value="${esc(src?.title||"")}" placeholder="e.g. We tested 50 cold brews so you don't have to"></div>
    <div class="field full"><label for="bl_notes">Notes, angle or script</label><textarea id="bl_notes" style="min-height:80px">${esc(src?.notes||"")}</textarea></div>
    <div class="field"><label for="bl_date">Date for all (optional)</label><input id="bl_date" type="date"></div>
    <div class="field"><label for="bl_stage">Add them as</label><select id="bl_stage">${opts([["idea","Ideas"],["drafting","Drafting"],["scheduled","Scheduled"]],"idea")}</select></div>
  </div>
  <div class="field"><span class="lbl">Targets</span>
    <div class="quick"><button class="btn sm" data-q="all">All</button><button class="btn sm" data-q="none">None</button>
      ${catsIn.map(cat=>`<button class="btn sm" data-q="cat:${esc(cat)}">All ${esc(cat)}</button>`).join("")}
      ${GROUPS.filter(g=>brands.some(b=>b.group===g)).map(g=>`<button class="btn sm ghost" data-q="g:${esc(g)}">${esc(g)}</button>`).join("")}</div>
    <div class="tgt" id="tgt">${brands.map(b=>`<div class="tgt-row" style="${bvars(b)}"><span class="bn">${mono(b,"sm")}${esc(b.name)}</span>${chans(b).map(c=>`<label>${pgm(cmeta(c))}<input type="checkbox" value="${b.id}|${c.id}" data-cat="${esc(cmeta(c).cat)}" data-g="${esc(b.group||"Other")}" ${pre.has(b.id+"|"+c.id)?"checked":""}>${esc(c.handle?handleOf(b,c):cmeta(c).label)}</label>`).join("")}</div>`).join("") || `<div class="tgt-row muted">No brands with channels yet.</div>`}</div>
    <span class="status-line" id="tgtCount"></span>
  </div>
  <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
    <div class="seg" role="radiogroup" aria-label="How to write each version">
      ${S.sample?`<label><input type="radio" name="bl_mode" value="ai" checked><span class="spark">✦</span> Claude adapts each</label>`:""}
      <label><input type="radio" name="bl_mode" value="copy" ${S.sample?"":"checked"}> Copy as-is</label></div>
    <button class="btn fire" id="blGo">Fire</button><span class="status-line" id="blStatus"></span>
  </div>
  <div class="sugg" id="blOut"></div><div id="blAll"></div>`, true);
  const count = () => { const n=$("tgt").querySelectorAll("input:checked").length; $("tgtCount").textContent = `${n} target${n===1?"":"s"} selected`; $("blGo").textContent = n ? `Fire at ${n}` : "Fire"; };
  count(); $("tgt").addEventListener("change", count);
  $("panel").querySelectorAll("[data-q]").forEach(bt => bt.onclick = () => {
    const q = bt.dataset.q, boxes = [...$("tgt").querySelectorAll("input")];
    if(q==="all") boxes.forEach(x=>x.checked=true); else if(q==="none") boxes.forEach(x=>x.checked=false);
    else if(q.startsWith("cat:")) boxes.filter(x=>x.dataset.cat===q.slice(4)).forEach(x=>x.checked=true);
    else if(q.startsWith("g:")) boxes.filter(x=>x.dataset.g===q.slice(2)).forEach(x=>x.checked=true);
    count();
  });
  $("bl_pick").onchange = () => { const p=S.posts.find(x=>x.id===$("bl_pick").value); if(p){ $("bl_title").value=p.title||""; $("bl_notes").value=p.notes||""; } };
  $("blGo").onclick = async () => {
    const title = $("bl_title").value.trim(), notes = $("bl_notes").value;
    if(!title){ $("bl_title").focus(); return toast("Write the core idea first"); }
    const targets = [...$("tgt").querySelectorAll("input:checked")].map(x=>{const [brandId,channelId]=x.value.split("|"); return {brandId,channelId};});
    if(!targets.length) return toast("Pick at least one target");
    const mode = ($("panel").querySelector('input[name="bl_mode"]:checked')||{}).value || "copy";
    const date = $("bl_date").value, stage = $("bl_stage").value, blastId = "bl-"+Date.now().toString(36);
    const mk = s => ({...mkPlan(s), status:stage, date:date||"", blastId, sourcePostId:src?.id||$("bl_pick").value||""});
    $("blGo").disabled = true; $("blOut").innerHTML = ""; $("blAll").innerHTML = "";
    if(mode==="copy"){ let ok=0; $("blStatus").textContent = "Loading…"; for(const t of targets){ if(await savePost(null, mk({...t, title, notes}))) ok++; } $("blStatus").textContent = `Fired ${ok} posts into ${STAGES.find(s=>s.id===stage).label}.`; $("blGo").disabled=false; toast(`Blasted to ${ok} channels`); return; }
    const results = [], chunks = []; for(let i=0;i<targets.length;i+=10) chunks.push(targets.slice(i,i+10));
    let failed = false;
    for(const ch of chunks){
      $("blStatus").textContent = `Claude is writing ${results.length+1}–${Math.min(results.length+ch.length, targets.length)} of ${targets.length}…`;
      const tb = ch.map(t=>{const b=brandById(t.brandId), c=chanOf(b,t.channelId), br=b.brain||{}; return {brandId:b.id, channelId:c.id, brand:b.name, industry:b.industry, whatItIs:b.tagline, voice:br.summary?{personality:br.personality, audience:br.audience, dos:br.dos, donts:br.donts, language:br.language}:b.voice, platform:cmeta(c).label, handle:c.handle, allowedFormats:cmeta(c).formats};});
      const prompt = `${BASE_VOICE}

Machine-gun distribution: take ONE core idea and write a native version for every target below. Each version must fit its platform (a TechCrunch/press target gets a press pitch angle and headline; Reddit/Hacker News gets a community-first, non-salesy post; GitHub gets a repo/release angle; Moj/ShareChat/Snapchat get vertical short-video hooks, Hindi/Hinglish where natural) and be re-angled for that brand's audience so it never reads like a copy. If the idea doesn't naturally fit a brand, find the bridge (a lesson, parallel, or behind-the-scenes angle).

Core idea / hook: ${title}
Notes: ${notes.slice(0,2500)||"none"}
Targets (JSON): ${JSON.stringify(tb)}

Reply with only a JSON array, one object per target, same order: {"brandId":"...","channelId":"...","title":"<scroll-stopping hook for that platform>","format":"<one of allowedFormats>","notes":"<caption or script outline, under 90 words>"}`;
      try{ const out = await S.sample.json(prompt, {modelTier:"default"}); (Array.isArray(out)?out:[]).filter(validTarget).forEach(s=>results.push(s)); }
      catch(e){ $("blStatus").textContent = sampleErr(e); failed = true; break; }
      $("blOut").innerHTML = results.map(sugCard).join(""); wireSugs($("blOut"), results, mk);
    }
    $("blGo").disabled = false;
    if(results.length){
      if(!failed) $("blStatus").textContent = `${results.length} versions ready.`;
      $("blAll").innerHTML = `<button class="btn fire" id="addAll">Add all ${results.length}</button>`;
      $("addAll").onclick = async () => { $("addAll").disabled=true; let ok=0; for(const s of results){ if(await savePost(null, mk(s))) ok++; } $("addAll").textContent=`Added ${ok}`; $("blOut").querySelectorAll("[data-sug]").forEach(b=>{b.disabled=true;b.textContent="Added";}); toast(`Blasted to ${ok} channels`); };
    } else if(!failed) $("blStatus").textContent = "No versions came back. Try again.";
  };
}

/* ================= plan the week ================= */
function planPanel(){
  const days = weekDays(S.weekOffset).map(ymd);
  const live = S.brands.filter(b=>b.status!=="paused" && chans(b).some(c=>+c.cadence>0) && brandVisible(b));
  openPanel(`<div class="panel-h"><h2>Plan the week</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <p class="muted" style="margin:0">Claude checks every channel's weekly target against what's planned for ${fmtDate(days[0])} – ${fmtDate(days[6])}, uses each brand's dump and idea bank first, and proposes posts to fill the gaps. It covers the ${live.length} brands in your current filter that have targets.</p>
    <div class="field"><label for="planHint">Focus (optional)</label><input id="planHint" placeholder="e.g. push one brand, or launch week for a new product"></div>
    <div><button class="btn primary" id="planGo">✦ Suggest posts</button> <span class="status-line" id="planStatus"></span></div>
    <div class="sugg" id="planOut"></div><div id="planAll"></div>`, true);
  $("planGo").onclick = async () => {
    if(!live.length) return toast("Set a weekly target on at least one channel");
    $("planGo").disabled = true; $("planOut").innerHTML = ""; $("planAll").innerHTML = "";
    const results = [], chunks = []; for(let i=0;i<live.length;i+=5) chunks.push(live.slice(i,i+5));
    let failed=false;
    for(const ch of chunks){
      $("planStatus").textContent = `Claude is planning ${ch.map(b=>b.name).join(", ")}…`;
      const ids = ch.map(b=>b.id);
      const existing = S.posts.filter(p=>ids.includes(p.brandId) && days.includes(p.date)).map(p=>({brandId:p.brandId,channelId:p.channelId,title:p.title,date:p.date,status:p.status}));
      const ideas = S.posts.filter(p=>ids.includes(p.brandId) && p.status==="idea").slice(0,30).map(p=>({brandId:p.brandId,channelId:p.channelId,title:p.title}));
      const dumps = S.dumps.filter(d=>ids.includes(d.brandId) && !d.used).slice(0,20).map(d=>({brandId:d.brandId,text:(d.text||"").slice(0,400)}));
      const prompt = `${BASE_VOICE}

Plan posts for ${days[0]} to ${days[6]} (today is ${todayStr()}; only dates from today onward inside this week).
Brands and channels (JSON): ${JSON.stringify(ch.map(brandBrief))}
Already planned: ${JSON.stringify(existing)}
Idea bank (reuse first): ${JSON.stringify(ideas)}
Raw dumps (mine these for ideas): ${JSON.stringify(dumps)}
Focus: ${$("planHint").value.trim()||"none"}

For each channel, fill the gap between postsPerWeek and what's planned. Spread across days. Reuse one idea across a brand's channels with a native angle per platform.
Reply with only a JSON array: {"brandId":"...","channelId":"...","date":"YYYY-MM-DD","title":"<hook>","format":"<native format>","notes":"<one or two lines>"}. At most 30 items.`;
      try{ const out = await S.sample.json(prompt, {modelTier:"default"}); (Array.isArray(out)?out:[]).filter(validTarget).slice(0,30).forEach(s=>results.push(s)); }
      catch(e){ $("planStatus").textContent = sampleErr(e); failed=true; break; }
      $("planOut").innerHTML = results.map(sugCard).join(""); wireSugs($("planOut"), results, mkPlan);
    }
    $("planGo").disabled = false;
    if(results.length){ if(!failed) $("planStatus").textContent = `${results.length} suggestions.`;
      $("planAll").innerHTML = `<button class="btn fire" id="planAddAll">Add all ${results.length}</button>`;
      $("planAddAll").onclick = async () => { $("planAddAll").disabled=true; let ok=0; for(const s of results){ if(await savePost(null, mkPlan(s))) ok++; } $("planAddAll").textContent=`Added ${ok}`; $("planOut").querySelectorAll("[data-sug]").forEach(b=>{b.disabled=true;b.textContent="Added";}); };
    } else if(!failed) $("planStatus").textContent = "Every channel already meets its target this week.";
  };
}

/* ---------- add a channel column across brands ---------- */
function columnPanel(){
  openPanel(`<div class="panel-h"><h2>Add a channel</h2><button class="btn ghost" data-close aria-label="Close">✕</button></div>
    <p class="muted" style="margin:0">Open one channel for many brands at once. Handles can be filled in later from each brand's hub.</p>
    <div class="form"><div class="field"><label for="colPf">Channel</label>${platformSelect("reddit",'id="colPf"')}</div>
      <div class="field"><label for="colLabel">Custom name</label><input id="colLabel" placeholder="Only for custom channels" disabled></div>
      <div class="field"><label for="colCad">Posts per week</label><input id="colCad" type="number" min="0" max="99" value="2"></div></div>
    <div class="field"><span class="lbl">Brands</span><div class="quick"><button class="btn sm" data-cq="all">All</button><button class="btn sm" data-cq="none">None</button>${GROUPS.filter(g=>S.brands.some(b=>b.group===g)).map(g=>`<button class="btn sm ghost" data-cq="${esc(g)}">${esc(g)}</button>`).join("")}</div>
      <div class="tgt" id="colB">${S.brands.slice().sort((a,b)=>GROUPS.indexOf(a.group||"Other")-GROUPS.indexOf(b.group||"Other")||(a.order??999)-(b.order??999)).map(b=>`<label class="tgt-row" style="${bvars(b)}"><input type="checkbox" value="${b.id}" data-g="${esc(b.group||"Other")}"> ${mono(b,"sm")} <b style="font-size:13px">${esc(b.name)}</b></label>`).join("")}</div></div>
    <div class="panel-foot"><span></span><div class="actions"><button class="btn" data-close>Cancel</button><button class="btn primary" id="colGo">Open channel</button></div></div>`, true);
  $("colPf").onchange = () => { $("colLabel").disabled = $("colPf").value!=="custom"; };
  $("panel").querySelectorAll("[data-cq]").forEach(bt=>bt.onclick=()=>{ const q=bt.dataset.cq; $("colB").querySelectorAll("input").forEach(x=>{ if(q==="all") x.checked=true; else if(q==="none") x.checked=false; else if(x.dataset.g===q) x.checked=true; }); });
  $("colGo").onclick = async () => {
    const platform=$("colPf").value, label=$("colLabel").value.trim(), cad=Math.max(0,+$("colCad").value||0);
    if(platform==="custom" && !label){ $("colLabel").focus(); return toast("Name the custom channel"); }
    const ids=[...$("colB").querySelectorAll("input:checked")].map(x=>x.value); if(!ids.length) return toast("Pick at least one brand");
    $("colGo").disabled=true; let ok=0;
    for(const id of ids){ const b=brandById(id); if(!b) continue; const exists = chans(b).some(c=>c.platform===platform && (platform!=="custom" || (c.label||"").toLowerCase()===label.toLowerCase())); if(exists) continue;
      const c={id:id+"-"+platform+"-"+uid(), platform, handle:"", url:"", cadence:cad, ...(platform==="custom"?{label}:{})};
      if(await patchBrand(id,{channels:[...chans(b), c]})) ok++; }
    closePanel(); toast(`Opened ${platform==="custom"?label:pf(platform).label} for ${ok} brand${ok===1?"":"s"}`);
  };
}

/* ================= events ================= */
document.addEventListener("click", e => {
  const t = e.target.closest("button,[data-id]");
  if(!t) return;
  if(t.matches("[data-close]")) return closePanel();
  if(t.closest("#panel")) return;
  if(t.dataset.group){ S.group=t.dataset.group; S.brand=null; return render(); }
  if(t.dataset.pf && t.classList.contains("chip")){ S.platform=t.dataset.pf; return render(); }
  if(t.hasAttribute("data-clearbrand")){ S.brand=null; return render(); }
  if(t.dataset.focus){ S.brand = S.brand===t.dataset.focus ? null : t.dataset.focus; render(); if(S.brand) $("week").scrollIntoView({behavior:"smooth",block:"start"}); return; }
  if(t.dataset.fire) return postPanel(null,{brandId:t.dataset.fire, channelId:t.dataset.ch, date:todayStr(), status:"scheduled"});
  if(t.dataset.addch) return brandPanel(t.dataset.addch, {addPlatform:t.dataset.p, label:t.dataset.label});
  if(t.hasAttribute("data-addcolumn")) return columnPanel();
  if(t.dataset.hub) return openHub(t.dataset.hub, t.dataset.tab);
  if(t.dataset.editbrand) return openHub(t.dataset.editbrand);
  if(t.hasAttribute("data-addbrand")) return brandPanel(null);
  if(t.dataset.open) return postPanel(t.dataset.open);
  if(t.dataset.more){ S.boardLimit[t.dataset.more]=(S.boardLimit[t.dataset.more]||25)+25; return renderBoard(); }
  if(t.dataset.advance){ const p=S.posts.find(x=>x.id===t.dataset.advance); const i=STAGES.findIndex(s=>s.id===(p.status||"idea")); const next=STAGES[i+1].id; savePost(p.id,{status:next,...(next==="posted"&&!p.date?{date:todayStr()}:{})}); return; }
  if(t.matches(".card")) return postPanel(t.dataset.id);
});
function openHub(id, tab){ brandPanel(id,{tab}); $("panel").dataset.brand = id; }
document.addEventListener("keydown", e => { if((e.key==="Enter"||e.key===" ") && e.target.matches?.(".card")){ e.preventDefault(); postPanel(e.target.dataset.id); } });
$("addBrandBtn").onclick = () => brandPanel(null);
$("addPostBtn").onclick = () => S.brands.length ? postPanel(null) : brandPanel(null);
$("dumpBtn").onclick = () => S.brands.length ? quickDump() : brandPanel(null);
$("blastBtn").onclick = () => blastPanel(null);
$("mediaBtn").onclick = mediaPanel;
$("queueBtn").onclick = queuePanel;
$("loginsBtn").onclick = () => subsPanel();
$("planBtn").onclick = planPanel;
$("settingsBtn").onclick = () => window.__hds.settings();
$("wkPrev").onclick = () => { S.weekOffset--; renderWeek(); };
$("wkNext").onclick = () => { S.weekOffset++; renderWeek(); };
$("wkNow").onclick = () => { S.weekOffset=0; renderWeek(); };

let dragId = null;
document.addEventListener("dragstart", e => { const c=e.target.closest?.(".card"); if(!c) return; dragId=c.dataset.id; c.classList.add("dragging"); e.dataTransfer.effectAllowed="move"; try{e.dataTransfer.setData("text/plain",dragId);}catch(_){} });
document.addEventListener("dragend", e => { e.target.closest?.(".card")?.classList.remove("dragging"); document.querySelectorAll(".col.over").forEach(c=>c.classList.remove("over")); });
document.addEventListener("dragover", e => { const col=e.target.closest?.(".col"); if(!col||!dragId) return; e.preventDefault(); document.querySelectorAll(".col.over").forEach(c=>c!==col&&c.classList.remove("over")); col.classList.add("over"); });
document.addEventListener("drop", e => { const col=e.target.closest?.(".col"); if(!col||!dragId) return; e.preventDefault(); col.classList.remove("over");
  const p=S.posts.find(x=>x.id===dragId), st=col.dataset.stage; dragId=null;
  if(p && (p.status||"idea")!==st) savePost(p.id,{status:st, ...(st==="posted"&&!p.date?{date:todayStr()}:{})}); });

/* ================= boot ================= */
function setLive(on, text){ $("live").classList.toggle("on",on); $("liveText").textContent=text; }
render();
(async () => {
  const c = window.claude;
  const offline = msg => { setLive(false,msg[0]); $("banner").hidden=false; $("banner").textContent=msg[1]; S.gotB=S.gotP=true; render(); };
  if(!c?.use) return offline(["Offline preview","Open this page on claude.ai to load and edit your brands."]);
  const db = await c.use("db");
  if(!db) return offline(["Not connected","Sign in to claude.ai to see and edit your brands and posts."]);
  S.db = db;
  const timer = setTimeout(()=>{ if(!S.gotB||!S.gotP) setLive(false,"Still connecting…"); }, 10000);
  const ok = () => { if(S.gotB&&S.gotP){ clearTimeout(timer); setLive(true,"Saved in this browser"); } };
  const onErr = () => { clearTimeout(timer); setLive(false,"Connection lost. Reload to reconnect."); };
  db.collection("brands").onSnapshot(snap => { S.brands = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id, name:String(d.data().name||"Untitled")})); S.gotB=true; ok(); render(); const pb=$("panel").dataset.brand; if(pb && $("srcList") && !reading.has(pb)) renderSources(pb); }, onErr);
  db.collection("posts").onSnapshot(snap => { S.posts = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); S.gotP=true; ok(); render(); }, onErr);
  db.collection("dumps").onSnapshot(snap => { S.dumps = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); renderStats(); renderBrands(); const l=$("dumpList"), bid=$("panel").dataset.brand; if(l && bid){ l.innerHTML = dumpsOf(bid).map(dumpItem).join("") || `<div class="muted" style="font-size:13px">Nothing dumped yet.</div>`; } }, ()=>{});
  c.use("sample").then(async s => { if(s){ S.sample=s; $("planBtn").hidden=false; try{ const L=await s.limits(); S.imgCaps = L?.images || null; }catch(_){ S.imgCaps=null; } } }).catch(()=>{});
  c.use("assets").then(a => { S.assets = a || null; }).catch(()=>{});
  db.collection("media").onSnapshot(snap => { S.media = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); }, ()=>{});
  db.collection("subs").onSnapshot(snap => { S.subs = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); renderStats(); }, ()=>{});
  db.collection("styles").onSnapshot(snap => { S.styles = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); }, ()=>{});
  db.collection("meta").onSnapshot(snap => { const m={}; snap.docs.filter(d=>d.exists).forEach(d=>m[d.id]=d.data()); S.meta=m; }, ()=>{});
  db.collection("renders").onSnapshot(snap => { S.renders = snap.docs.filter(d=>d.exists).map(d=>({...d.data(), id:d.id})); updateQueueBtn(); renderBoard(); }, ()=>{});
  c.use("mcp").then(m => { S.mcp = m || null; }).catch(()=>{});
})();

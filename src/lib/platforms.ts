export type Platform = { label: string; g: string; c: string; cat: string; formats: string[] };
const F = {
  short:["Short video","Reel","Live"], social:["Post","Image post","Carousel","Video","Story"],
  text:["Post","Thread","Image post","Video"], long:["Article","Blog post","Issue"],
  press:["Press pitch","Guest article","Founder feature","Funding news","Product launch"],
  community:["Post","AMA","Poll","Discussion"], chat:["Announcement","Message","Poll","Event"]
};
export const PLATFORMS: Record<string, Platform> = {
  instagram:{label:"Instagram",g:"IG",c:"#D6307A",cat:"Social",formats:["Reel","Carousel","Image post","Story","Live","Broadcast channel"]},
  facebook:{label:"Facebook",g:"f",c:"#3B5FD9",cat:"Social",formats:["Post","Reel","Video","Live","Group post"]},
  x:{label:"X",g:"X",c:"#3A3F4B",cat:"Social",formats:["Post","Thread","Video","Space"]},
  threads:{label:"Threads",g:"@",c:"#6B5BD2",cat:"Social",formats:["Post","Thread"]},
  linkedin:{label:"LinkedIn",g:"in",c:"#0A66C2",cat:"Social",formats:["Text post","Carousel","Image post","Video","Article","Newsletter","Poll"]},
  snapchat:{label:"Snapchat",g:"SC",c:"#C9B200",cat:"Social",formats:["Spotlight","Story","Snap"]},
  pinterest:{label:"Pinterest",g:"P",c:"#C8232C",cat:"Social",formats:["Pin","Idea pin","Video pin"]},
  bluesky:{label:"Bluesky",g:"BS",c:"#1185FE",cat:"Social",formats:F.text},
  tumblr:{label:"Tumblr",g:"t",c:"#34526F",cat:"Social",formats:F.social},
  lemon8:{label:"Lemon8",g:"L8",c:"#B8A300",cat:"Social",formats:["Carousel","Post"]},

  youtube:{label:"YouTube",g:"YT",c:"#E02B20",cat:"Video",formats:["Short","Long video","Live","Community post","Podcast episode"]},
  tiktok:{label:"TikTok",g:"TT",c:"#14A3A8",cat:"Video",formats:["Video","Carousel","Live"]},
  moj:{label:"Moj",g:"Moj",c:"#F2552C",cat:"Video",formats:F.short},
  josh:{label:"Josh",g:"J",c:"#E5266C",cat:"Video",formats:F.short},
  sharechat:{label:"ShareChat",g:"SH",c:"#2E7BF6",cat:"Video",formats:["Short video","Image post","Post","Live"]},
  roposo:{label:"Roposo",g:"R",c:"#E8418C",cat:"Video",formats:F.short},
  chingari:{label:"Chingari",g:"CH",c:"#F07B1A",cat:"Video",formats:F.short},
  twitch:{label:"Twitch",g:"TW",c:"#8A43F0",cat:"Video",formats:["Stream","Clip"]},
  kick:{label:"Kick",g:"K",c:"#3FA30F",cat:"Video",formats:["Stream","Clip"]},
  vimeo:{label:"Vimeo",g:"V",c:"#1AB7EA",cat:"Video",formats:["Video","Showreel"]},

  reddit:{label:"Reddit",g:"r/",c:"#FF4500",cat:"Community",formats:F.community},
  discord:{label:"Discord",g:"DC",c:"#5865F2",cat:"Community",formats:F.chat},
  telegram:{label:"Telegram",g:"TG",c:"#229ED9",cat:"Community",formats:F.chat},
  whatsapp:{label:"WhatsApp",g:"WA",c:"#1FA855",cat:"Community",formats:["Channel post","Status","Broadcast","Community post"]},
  slack:{label:"Slack community",g:"SL",c:"#611F69",cat:"Community",formats:F.chat},
  quora:{label:"Quora",g:"Q",c:"#B92B27",cat:"Community",formats:["Answer","Space post","Question"]},
  mastodon:{label:"Mastodon",g:"M",c:"#6364FF",cat:"Community",formats:F.text},
  fbgroups:{label:"Facebook Groups",g:"FG",c:"#2D4FB8",cat:"Community",formats:F.community},

  github:{label:"GitHub",g:"GH",c:"#24292F",cat:"Builders",formats:["Repo launch","Release","README update","Discussion","Gist"]},
  producthunt:{label:"Product Hunt",g:"PH",c:"#DA552F",cat:"Builders",formats:["Launch","Maker comment","Forum post"]},
  hackernews:{label:"Hacker News",g:"Y",c:"#F26522",cat:"Builders",formats:["Show HN","Ask HN","Link post"]},
  indiehackers:{label:"Indie Hackers",g:"IH",c:"#0E2439",cat:"Builders",formats:["Post","Milestone","Product update"]},
  devto:{label:"DEV / Hashnode",g:"DEV",c:"#0A0A0A",cat:"Builders",formats:["Article","Tutorial","Series"]},
  behance:{label:"Behance",g:"Bē",c:"#1769FF",cat:"Builders",formats:["Case study","Project"]},
  dribbble:{label:"Dribbble",g:"Dr",c:"#EA4C89",cat:"Builders",formats:["Shot","Case study"]},

  medium:{label:"Medium",g:"Me",c:"#1A1A1A",cat:"Long-form",formats:F.long},
  substack:{label:"Substack",g:"SS",c:"#FF6719",cat:"Long-form",formats:["Issue","Note","Podcast"]},
  newsletter:{label:"Newsletter",g:"NL",c:"#C9780A",cat:"Long-form",formats:["Issue"]},
  website:{label:"Website / blog",g:"W",c:"#4B5563",cat:"Long-form",formats:["Blog post","Case study","Landing page"]},
  podcast:{label:"Podcast",g:"♪",c:"#8A3FD1",cat:"Long-form",formats:["Episode","Clip","Guest appearance"]},
  spotify:{label:"Spotify",g:"SP",c:"#1DB954",cat:"Long-form",formats:["Episode","Video podcast"]},

  techcrunch:{label:"TechCrunch",g:"TC",c:"#0A9E01",cat:"Press & PR",formats:F.press},
  yourstory:{label:"YourStory",g:"YS",c:"#E5322D",cat:"Press & PR",formats:F.press},
  inc42:{label:"Inc42",g:"42",c:"#E01F26",cat:"Press & PR",formats:F.press},
  economictimes:{label:"Economic Times",g:"ET",c:"#B21F24",cat:"Press & PR",formats:F.press},
  forbesindia:{label:"Forbes India",g:"Fb",c:"#1C1C1C",cat:"Press & PR",formats:F.press},
  entrackr:{label:"Entrackr",g:"EN",c:"#0B5CAD",cat:"Press & PR",formats:F.press},
  prwire:{label:"Press release wire",g:"PR",c:"#5B6475",cat:"Press & PR",formats:["Press release"]},

  googlebusiness:{label:"Google Business",g:"G",c:"#1A73E8",cat:"Local & commerce",formats:["Update","Offer","Event","Photo"]},
  justdial:{label:"Justdial",g:"JD",c:"#F5821F",cat:"Local & commerce",formats:["Listing update","Photo"]},
  amazon:{label:"Amazon / marketplace",g:"A",c:"#E47911",cat:"Local & commerce",formats:["Listing","A+ content","Post"]},
  other:{label:"Other",g:"•",c:"#6E7489",cat:"Custom",formats:["Post","Video","Article","Other"]}
};
export const PLATFORM_IDS = Object.keys(PLATFORMS);
export const CATEGORIES = [...new Set(Object.values(PLATFORMS).map((p) => p.cat))];

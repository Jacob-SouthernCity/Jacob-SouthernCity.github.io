import type { Locale } from "./config";

const en = {
  separator: ", ",
  nav: {
    Home: "Home",
    Experience: "Experience",
    Projects: "Projects",
    Skills: "Skills",
    Places: "Places",
    Contact: "Contact",
  },
  language: {
    label: "Language",
  },
  theme: {
    toggle: "Toggle dark mode",
  },
  dates: {
    present: "Present",
  },
  intro: {
    downloadResume: "Download Resume",
    portraitAlt: (name: string) => `${name} portrait`,
    showName: (label: string) => `Show my ${label.toLowerCase()}`,
  },
  experience: {
    heading: "Experience",
    filterLabel: "Filter experience",
    all: "All",
    kinds: { work: "Work", education: "Education" },
    chartHint: "Hover a bar for details · Pinch or Ctrl + scroll to zoom",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
    fitTimeline: "Fit timeline to view",
    timelineLabel: "Experience timeline",
  },
  projects: {
    heading: "Projects",
    trailer: (title: string) => `${title} trailer`,
    screenshotAlt: (title: string) => `${title} project screenshot`,
    enlargeScreenshot: (title: string) => `Enlarge ${title} screenshot`,
    closeScreenshot: "Close screenshot",
    videoUnsupported: "Your browser does not support HTML5 video.",
  },
  skills: {
    heading: "Skills",
  },
  places: {
    heading: "Places I've been",
    summary: (places: number, countries: number, trips: number) =>
      `${places} ${places === 1 ? "place" : "places"} · ${countries} ${countries === 1 ? "country" : "countries"} · ${trips} ${trips === 1 ? "trip" : "trips"}`,
    viewLabel: "Show places or trips",
    views: { places: "Places", trips: "Trips" },
    filterLabel: "Filter places",
    all: "All",
    tags: { lived: "Lived", studied: "Studied", worked: "Worked", visited: "Visited" },
    globeLabel: (places: number, countries: number) =>
      `Globe marking ${places} places I've been across ${countries} countries`,
    hintPlaces: "Drag the globe, tap a dot, or pick a place below.",
    hintTrips: "Pick a trip to see its route on the globe.",
    webglFallback: "The interactive globe needs WebGL, which this browser does not support. Every place is still listed here.",
    nearby: (count: number) => `${count} places nearby`,
    pickOne: "pick one",
    stops: (count: number) => `${count} ${count === 1 ? "stop" : "stops"}`,
    tripCount: (count: number) => `${count} ${count === 1 ? "trip" : "trips"}`,
    showMoreTrips: (count: number, year: string) => `Show ${count} more from ${year}`,
    showFewerTrips: "Show fewer",
  },
  contact: {
    heading: "Get in touch",
    blurb: "Whether it's a role, a project, or just to say hi, email is the best way to reach me.",
  },
  footer: {
    rights: (year: number, name: string) => `© ${year} ${name}. All rights reserved.`,
    aboutLabel: "About this website:",
    about: "built with Next.js, React, TypeScript, Tailwind CSS and Motion, hosted on Vercel.",
  },
  meta: {
    description: (name: string, title: string, organization: string) =>
      `${name} is a ${title.toLowerCase()} at ${organization}, building across web, mobile, and platform.`,
  },
};

export type Messages = typeof en;

const zh: Messages = {
  separator: "，",
  nav: {
    Home: "首页",
    Experience: "经历",
    Projects: "项目",
    Skills: "技能",
    Places: "足迹",
    Contact: "联系",
  },
  language: {
    label: "语言",
  },
  theme: {
    toggle: "切换深色模式",
  },
  dates: {
    present: "至今",
  },
  intro: {
    downloadResume: "下载简历",
    portraitAlt: (name) => `${name}的照片`,
    showName: (label) => `显示我的${label}`,
  },
  experience: {
    heading: "经历",
    filterLabel: "筛选经历",
    all: "全部",
    kinds: { work: "工作", education: "教育" },
    chartHint: "悬停在条形上查看详情 · 双指或 Ctrl + 滚轮缩放",
    zoomOut: "缩小",
    zoomIn: "放大",
    fitTimeline: "让时间轴适应视图",
    timelineLabel: "经历时间轴",
  },
  projects: {
    heading: "项目",
    trailer: (title) => `${title} 预告片`,
    screenshotAlt: (title) => `${title} 项目截图`,
    enlargeScreenshot: (title) => `放大 ${title} 截图`,
    closeScreenshot: "关闭截图",
    videoUnsupported: "你的浏览器不支持 HTML5 视频。",
  },
  skills: {
    heading: "技能",
  },
  places: {
    heading: "我去过的地方",
    summary: (places, countries, trips) => `${places} 个地方 · ${countries} 个国家 · ${trips} 次旅行`,
    viewLabel: "显示地点或旅行",
    views: { places: "地点", trips: "旅行" },
    filterLabel: "筛选地点",
    all: "全部",
    tags: { lived: "居住", studied: "求学", worked: "工作", visited: "到访" },
    globeLabel: (places, countries) => `地球仪标出了我在 ${countries} 个国家去过的 ${places} 个地方`,
    hintPlaces: "拖动地球仪、点击圆点，或在下方选择一个地点。",
    hintTrips: "选择一次旅行，在地球仪上查看路线。",
    webglFallback: "交互式地球仪需要 WebGL，当前浏览器不支持。所有地点仍在下方列出。",
    nearby: (count) => `附近有 ${count} 个地方`,
    pickOne: "选一个",
    stops: (count) => `${count} 站`,
    tripCount: (count) => `${count} 次旅行`,
    showMoreTrips: (count, year) => `显示 ${year} 年的其余 ${count} 次旅行`,
    showFewerTrips: "收起",
  },
  contact: {
    heading: "联系我",
    blurb: "无论是工作机会、项目合作，还是只想打个招呼，发邮件都是联系我的最好方式。",
  },
  footer: {
    rights: (year, name) => `© ${year} ${name}。保留所有权利。`,
    aboutLabel: "关于本网站：",
    about: "使用 Next.js、React、TypeScript、Tailwind CSS 和 Motion 构建，托管于 Vercel。",
  },
  meta: {
    description: (name, title, organization) =>
      `${name}，${organization}${/[A-Za-z0-9]$/.test(organization) ? " " : ""}${title}，工作横跨 Web、移动端和平台。`,
  },
};

const ja: Messages = {
  separator: "、",
  nav: {
    Home: "ホーム",
    Experience: "経歴",
    Projects: "プロジェクト",
    Skills: "スキル",
    Places: "訪れた場所",
    Contact: "連絡先",
  },
  language: {
    label: "言語",
  },
  theme: {
    toggle: "ダークモードを切り替える",
  },
  dates: {
    present: "現在",
  },
  intro: {
    downloadResume: "履歴書をダウンロード",
    portraitAlt: (name) => `${name}の写真`,
    showName: (label) => `${label}を表示`,
  },
  experience: {
    heading: "経歴",
    filterLabel: "経歴を絞り込む",
    all: "すべて",
    kinds: { work: "職歴", education: "学歴" },
    chartHint: "バーにカーソルを合わせると詳細を表示 · ピンチまたは Ctrl + スクロールで拡大",
    zoomOut: "縮小",
    zoomIn: "拡大",
    fitTimeline: "タイムライン全体を表示",
    timelineLabel: "経歴のタイムライン",
  },
  projects: {
    heading: "プロジェクト",
    trailer: (title) => `${title} のトレーラー`,
    screenshotAlt: (title) => `${title} のスクリーンショット`,
    enlargeScreenshot: (title) => `${title} のスクリーンショットを拡大`,
    closeScreenshot: "スクリーンショットを閉じる",
    videoUnsupported: "お使いのブラウザは HTML5 動画に対応していません。",
  },
  skills: {
    heading: "スキル",
  },
  places: {
    heading: "訪れた場所",
    summary: (places, countries, trips) => `${places} か所 · ${countries} か国 · ${trips} 回の旅行`,
    viewLabel: "場所と旅行を切り替える",
    views: { places: "場所", trips: "旅行" },
    filterLabel: "場所を絞り込む",
    all: "すべて",
    tags: { lived: "住んだ", studied: "学んだ", worked: "働いた", visited: "訪れた" },
    globeLabel: (places, countries) => `${countries} か国で訪れた ${places} か所を示す地球儀`,
    hintPlaces: "地球儀をドラッグするか、点をタップするか、下から場所を選んでください。",
    hintTrips: "旅行を選ぶと、地球儀にルートが表示されます。",
    webglFallback: "インタラクティブな地球儀には WebGL が必要ですが、このブラウザは対応していません。すべての場所は下に一覧表示されています。",
    nearby: (count) => `近くに ${count} か所`,
    pickOne: "1 つ選んでください",
    stops: (count) => `${count} か所`,
    tripCount: (count) => `${count} 回`,
    showMoreTrips: (count, year) => `${year} 年の旅行をあと ${count} 件表示`,
    showFewerTrips: "閉じる",
  },
  contact: {
    heading: "お問い合わせ",
    blurb: "お仕事のご相談、プロジェクトのお誘い、ちょっとしたご挨拶まで、メールでお気軽にご連絡ください。",
  },
  footer: {
    rights: (year, name) => `© ${year} ${name}. All rights reserved.`,
    aboutLabel: "このサイトについて：",
    about: "Next.js、React、TypeScript、Tailwind CSS、Motion で構築し、Vercel でホストしています。",
  },
  meta: {
    description: (name, title, organization) =>
      `${name}は${organization}の${title}として、Web・モバイル・プラットフォームを横断して開発しています。`,
  },
};

export const messages: Record<Locale, Messages> = { en, zh, ja };

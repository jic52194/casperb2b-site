// Visuals drawn for casperb2b.com (inline SVG, no stock photos, nothing that implies invented clients or results):
//  • heroArt(cluster): one illustration per topic, showing the outcome the visitor wants (the booked appointment, the
//    top search result, the protected network, the matched team…). Decorative: aria-hidden, no numbers or claims.
//  • iconFor(text): a consistent line icon for each card, picked from the card's heading.
const O = "#39ff14", OD = "#15803d", OL = "#f0fdf4", N = "#030712", G = "#16a34a", L = "#e2e8f0", M = "#64748b", W = "#ffffff";

const frame = (inner, label) => `<svg viewBox="0 0 440 340" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><defs><filter id="sh" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0b1220" flood-opacity=".12"/></filter></defs><circle cx="320" cy="118" r="104" fill="${OL}"/><circle cx="92" cy="262" r="66" fill="#f1f5f9"/>${inner}</svg>`;
const card = (x, y, w, h, body, r = 16) => `<g filter="url(#sh)"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${W}" stroke="${L}"/></g>${body}`;
const pill = (x, y, w, t, fill = O, color = N) => `<rect x="${x}" y="${y}" width="${w}" height="26" rx="13" fill="${fill}"/><text x="${x + w / 2}" y="${y + 17.5}" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="12" font-weight="700" fill="${color}">${t}</text>`;
const txt = (x, y, t, size = 13, weight = 600, fill = N) => `<text x="${x}" y="${y}" font-family="Inter,Arial,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${t}</text>`;
const bar = (x, y, w, fill = L) => `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" fill="${fill}"/>`;
const check = (cx, cy, r = 11) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${G}"/><path d="M${cx - 5} ${cy}l3.5 3.5L${cx + 5.5} ${cy - 4}" fill="none" stroke="${W}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;

const ART = {
  // a missed call becomes a booked appointment
  customers: frame(
    card(40, 40, 230, 78, `<circle cx="78" cy="79" r="20" fill="#fee2e2"/><path d="M71 72c2 7 6 11 13 14l3-3c1-1 2-1 3 0l4 3c1 1 1 2 0 3l-2 2c-2 2-6 2-9 0-6-4-11-9-15-15-2-3-2-7 0-9l2-2c1-1 2-1 3 0l3 4c1 1 1 2 0 3z" fill="#dc2626"/>${txt(108, 74, "Missed call")}${txt(108, 94, "While you were on a job", 11, 500, M)}`) +
    card(130, 136, 250, 78, `<circle cx="168" cy="175" r="20" fill="${OL}"/><path d="M158 168h20v13h-13l-7 5z" fill="${O}"/>${txt(198, 170, "Text sent automatically")}${txt(198, 190, "“Sorry we missed you — book here”", 11, 500, M)}`) +
    card(60, 232, 300, 84, `<rect x="82" y="252" width="42" height="44" rx="8" fill="${O}"/><rect x="82" y="252" width="42" height="13" rx="6" fill="${OD}"/>${txt(103, 288, "TUE", 12, 800, W).replace("<text ", '<text text-anchor="middle" ')}${txt(140, 270, "Appointment booked", 14, 700)}${txt(140, 290, "On your calendar, with notes", 11, 500, M)}${check(330, 274, 13)}`),
    "A missed call answered by an automatic text and turned into a booked appointment"),
  // your business at the top of the results and the map
  marketing: frame(
    card(40, 36, 340, 54, `<circle cx="70" cy="63" r="12" fill="none" stroke="${M}" stroke-width="2.5"/><path d="M79 72l8 8" stroke="${M}" stroke-width="2.5" stroke-linecap="round"/>${txt(98, 68, "plumber near me", 14, 500, M)}`, 27) +
    card(40, 108, 340, 92, `${pill(60, 124, 64, "Top spot")}${txt(60, 170, "Your Business", 17, 800)}${txt(60, 190, "★★★★★  ·  Open now  ·  Call  ·  Directions", 11, 600, OD)}<circle cx="344" cy="146" r="18" fill="${O}"/><path d="M344 136a8 8 0 0 1 8 8c0 6-8 14-8 14s-8-8-8-14a8 8 0 0 1 8-8z" fill="${W}"/>`) +
    card(40, 218, 340, 44, `${bar(60, 236, 180)}${bar(250, 236, 60)}`) + card(40, 272, 340, 44, `${bar(60, 290, 150)}${bar(220, 290, 90)}`),
    "Your business shown as the top result for a local search"),
  // an assistant answers and books, any hour
  ai: frame(
    card(40, 40, 250, 64, `${txt(62, 70, "Can I come in Thursday?", 14, 600)}${txt(62, 90, "Customer · 9:42 PM", 11, 500, M)}`, 18) +
    card(150, 122, 250, 84, `<rect x="150" y="122" width="250" height="84" rx="18" fill="${N}"/>${txt(172, 152, "Yes — 2:00 or 4:30 are open.", 14, 600, W)}${txt(172, 174, "Want me to book 2:00?", 14, 600, W)}${txt(172, 194, "AI assistant", 11, 600, "#39ff14")}`, 18) +
    card(40, 226, 250, 64, `${txt(62, 256, "2:00 works, thanks!", 14, 600)}${txt(62, 276, "Customer", 11, 500, M)}`, 18) + `<g transform="translate(318 236)">${card(0, 0, 82, 74, `<rect x="16" y="14" width="50" height="46" rx="8" fill="${OL}" stroke="${O}"/>${check(41, 37, 13)}`)}</g>`,
    "An AI assistant answering a customer after hours and booking the appointment"),
  // devices behind one shield
  cyber: frame(
    `<g filter="url(#sh)"><path d="M220 36l110 40v76c0 74-48 118-110 142-62-24-110-68-110-142V76z" fill="${W}" stroke="${L}"/></g><path d="M220 62l86 31v59c0 58-37 93-86 112-49-19-86-54-86-112V93z" fill="${OL}"/>` +
    `<rect x="186" y="120" width="68" height="56" rx="10" fill="${O}"/><path d="M200 120v-14a20 20 0 0 1 40 0v14" fill="none" stroke="${O}" stroke-width="9" stroke-linecap="round"/><circle cx="220" cy="144" r="7" fill="${W}"/><rect x="217" y="146" width="6" height="16" rx="3" fill="${W}"/>` +
    card(28, 220, 100, 64, `<rect x="48" y="236" width="60" height="34" rx="4" fill="#f1f5f9" stroke="${M}"/>${check(116, 228, 10)}`) + card(312, 220, 100, 64, `<rect x="344" y="232" width="36" height="42" rx="6" fill="#f1f5f9" stroke="${M}"/>${check(400, 228, 10)}`) +
    card(170, 270, 100, 52, `<rect x="186" y="284" width="68" height="10" rx="3" fill="#f1f5f9" stroke="${M}"/><rect x="186" y="300" width="68" height="10" rx="3" fill="#f1f5f9" stroke="${M}"/>${check(258, 278, 10)}`),
    "Computers, phones and servers protected behind one security shield"),
  // the right people, matched to your team
  va: frame(
    card(150, 30, 140, 92, `<circle cx="220" cy="64" r="20" fill="${OL}"/><circle cx="220" cy="58" r="8" fill="${O}"/><path d="M206 76a14 10 0 0 1 28 0" fill="${O}"/>${txt(220, 108, "Your team", 13, 700).replace("<text ", '<text text-anchor="middle" ')}`) +
    [[60, 200, "Developer"], [190, 230, "SDR"], [320, 200, "Support"]].map(([x, y, t]) => `<path d="M220 122L${x + 30} ${y}" stroke="${O}" stroke-width="2" stroke-dasharray="5 5"/>` + card(x - 20, y, 100, 100, `<circle cx="${x + 30}" cy="${y + 36}" r="18" fill="#f1f5f9"/><circle cx="${x + 30}" cy="${y + 31}" r="7" fill="${M}"/><path d="M${x + 18} ${y + 47}a12 9 0 0 1 24 0" fill="${M}"/>${txt(x + 30, y + 80, t, 12, 700).replace("<text ", '<text text-anchor="middle" ')}${check(x + 66, y + 10, 10)}`)).join(""),
    "Vetted specialists matched and connected to your team"),
  // a score that shows where to start
  tools: frame(
    card(70, 40, 300, 260, `<path d="M130 200a90 90 0 0 1 180 0" fill="none" stroke="${L}" stroke-width="22" stroke-linecap="round"/><path d="M130 200a90 90 0 0 1 150-67" fill="none" stroke="${O}" stroke-width="22" stroke-linecap="round"/><circle cx="220" cy="200" r="10" fill="${N}"/><path d="M220 200l46-52" stroke="${N}" stroke-width="5" stroke-linecap="round"/>${txt(220, 248, "Your score", 15, 800).replace("<text ", '<text text-anchor="middle" ')}${txt(220, 270, "+ what to fix first", 12, 600, M).replace("<text ", '<text text-anchor="middle" ')}`),
    "A score gauge showing where your business stands and what to fix first"),
  // a clear checklist answer
  resources: frame(
    card(90, 34, 260, 276, `${txt(116, 72, "The plain-English answer", 15, 800)}${bar(116, 88, 200)}${bar(116, 104, 170)}` + [0, 1, 2, 3].map((i) => `${check(128, 148 + i * 38)}${bar(150, 144 + i * 38, 150 - i * 18, i === 0 ? "#bbf7d0" : L)}`).join("")),
    "A checklist page with clear answers"),
  // towns you serve, pinned
  local: frame(
    card(40, 30, 360, 280, `<path d="M70 250c40-30 70-10 110-40s60-70 110-60 60 50 90 40" fill="none" stroke="#bfdbfe" stroke-width="16" stroke-linecap="round"/><path d="M60 120h300M60 200h300M140 50v240M270 50v240" stroke="#f1f5f9" stroke-width="2"/>` +
      [[120, 110, 1], [220, 160, 0], [300, 100, 0], [180, 240, 0], [320, 220, 0]].map(([x, y, big]) => `<path d="M${x} ${y - (big ? 34 : 24)}a${big ? 16 : 11} ${big ? 16 : 11} 0 0 1 ${big ? 16 : 11} ${big ? 16 : 11}c0 ${big ? 12 : 8}-${big ? 16 : 11} ${big ? 26 : 18}-${big ? 16 : 11} ${big ? 26 : 18}s-${big ? 16 : 11}-${big ? 14 : 10}-${big ? 16 : 11}-${big ? 26 : 18}a${big ? 16 : 11} ${big ? 16 : 11} 0 0 1 ${big ? 16 : 11}-${big ? 16 : 11}z" fill="${big ? O : N}"/><circle cx="${x}" cy="${y - (big ? 18 : 13)}" r="${big ? 6 : 4}" fill="${W}"/>`).join("") + pill(70, 270, 110, "Your town")),
    "A map of the towns we serve with location pins"),
};
// B2B pipeline: decision-maker found, reply, meeting on the calendar
ART.b2b = frame(
  card(40, 40, 250, 78, `<circle cx="78" cy="79" r="20" fill="${OL}"/><circle cx="78" cy="79" r="11" fill="none" stroke="${O}" stroke-width="3"/><circle cx="78" cy="79" r="3.5" fill="${O}"/>${txt(108, 74, "Decision-maker found")}${txt(108, 94, "Matches your ideal customer", 11, 500, M)}`) +
  card(130, 136, 270, 78, `<circle cx="168" cy="175" r="20" fill="${OL}"/><path d="M158 168h20v13h-13l-7 5z" fill="${O}"/>${txt(198, 170, "They replied")}${txt(198, 190, "“Tuesday works — send an invite”", 11, 500, M)}`) +
  card(60, 232, 310, 84, `<rect x="82" y="252" width="42" height="44" rx="8" fill="${O}"/><rect x="82" y="252" width="42" height="13" rx="6" fill="${OD}"/>${txt(103, 288, "TUE", 12, 800, W).replace("<text ", '<text text-anchor="middle" ')}${txt(140, 270, "Qualified meeting booked", 14, 700)}${txt(140, 290, "On your calendar, with notes", 11, 500, M)}${check(340, 274, 13)}`),
  "A decision-maker found, replying, and a qualified meeting booked on your calendar");
ART.about = ART.va;

const B2B = /^\/(b2b-growth|services\/(b2b-lead-generation|appointment-setting|demand-generation|content-syndication|account-based-marketing|outbound-prospecting)|niches\/(saas|cybersecurity-companies|fintech))$/;
export const heroArt = (cluster, path = "") => { const k = B2B.test(path) ? "b2b" : cluster; return ART[k] ? `<div class="hero-art" aria-hidden="true">${ART[k]}</div>` : ""; };

// ── card icons (24×24 line icons drawn for this site) ──
const P = {
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M9 15l2 2 4-4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  pin: '<path d="M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
  shield: '<path d="M12 3l8 3v6c0 5-3.5 8.5-8 9.5-4.5-1-8-4.5-8-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  server: '<rect x="3" y="4" width="18" height="7" rx="2"/><rect x="3" y="13" width="18" height="7" rx="2"/><path d="M7 7.5h.01M7 16.5h.01"/>',
  cloud: '<path d="M7 18a5 5 0 0 1-.6-10A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z"/>',
  code: '<path d="M9 8l-4 4 4 4M15 8l4 4-4 4M13 6l-2 12"/>',
  mobile: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
  bug: '<rect x="8" y="7" width="8" height="12" rx="4"/><path d="M12 7V4M4 13h4M16 13h4M5 8l3 2M19 8l-3 2M5 19l3-2M19 19l-3-2"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 5"/>',
  userCheck: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20a6.5 6.5 0 0 1 11-4.5M15 18l2 2 4-4"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  megaphone: '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  zap: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
  refresh: '<path d="M20 11a8 8 0 0 0-14-5L4 8M4 13a8 8 0 0 0 14 5l2-2"/><path d="M4 3v5h5M20 21v-5h-5"/>',
  database: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  bot: '<rect x="4" y="8" width="16" height="11" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 16h6"/>',
  palette: '<path d="M12 3a9 9 0 0 0 0 18c1.5 0 2-1 2-2 0-1.5 1-2 2-2h1.5A3.5 3.5 0 0 0 21 13.5 9 9 0 0 0 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7" r="1"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
  layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  gauge: '<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 14l4-5"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12l3 3 5-6"/>',
  wrench: '<path d="M14.5 5.5a4 4 0 0 0 5 5L12 18l-3 3-3-3 3-3 7.5-7.5"/>',
};
const RULES = [
  [/\bcrm\b/i, "users"], [/marketing automation/i, "zap"],
  [/missed call|call|phone|ring|answer/i, "phone"], [/appointment|meeting|book|calendar|schedul/i, "calendar"], [/review|reputation|rating|star/i, "star"],
  [/map|local|town|google business|listing|citation|near/i, "pin"], [/seo|search|keyword|rank|audit|visib/i, "search"], [/security|cyber|threat|phishing|ransom|protect|compliance|hipaa/i, "shield"],
  [/password|access|identity|lock|encrypt/i, "lock"], [/backup|recover|restore|storage|data protect/i, "database"], [/server|network|infrastructure|uptime/i, "server"],
  [/cloud|aws|azure|migration/i, "cloud"], [/monitor|performance|speed|load|vital/i, "gauge"], [/test|qa|bug|quality/i, "bug"], [/mobile|ios|android|app store/i, "mobile"],
  [/code|develop|software|app|api|integration|custom/i, "code"], [/chatbot|ai |ai$|^ai|assistant|automat/i, "bot"], [/chat|message|text|sms|inbox|reply/i, "chat"],
  [/email|newsletter|nurture|sequence/i, "mail"], [/ads|ppc|paid|campaign|social|promot|syndicat|awareness/i, "megaphone"], [/account|target|icp|abm|ideal/i, "target"],
  [/lead|pipeline|demand|growth|revenue|conversion|roi|sales/i, "trend"], [/report|dashboard|analytic|track|measure|metric/i, "chart"], [/staff|hire|recruit|talent|team|role|candidate|people|vett/i, "users"],
  [/train|upskill|learn|onboard/i, "cap"], [/project|scope|plan|process|step|workflow/i, "layers"], [/design|brand|logo|graphic|visual/i, "palette"],
  [/maint|support|update|patch|fix|care/i, "wrench"], [/content|blog|article|write|copy|guide|page/i, "file"], [/website|web|site|domain/i, "globe"],
  [/business|company|firm|partner|msp|contract/i, "briefcase"], [/fast|quick|speed|instant/i, "zap"], [/repeat|ongoing|monthly|refresh/i, "refresh"],
];
export function iconFor(text) {
  const t = String(text).replace(/<[^>]+>/g, " ");
  const k = P[t] ? t : (RULES.find(([re]) => re.test(t)) || [, "check"])[1];
  return `<span class="ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[k]}</svg></span>`;
}

// Spam rules for the casperb2b-forms Worker. Pure functions, no I/O, so they run the same in the Worker and in node tests.
//
// A submission is rejected (the Worker answers 200 but does not forward it to GoHighLevel) when any rule hits:
//   honeypot     the hidden _gotcha field (sent as _hp) has a value
//   too_fast     less than 3 seconds between page load and submit
//   gibberish_name   first or last name is 12+ letters of random mixed-case / no-vowel noise ("KVduYVMwTrYUKFZpOlOghdjL")
//   dotted_email     the email's local part has 3+ dots ("j.o.h.n.smith@gmail.com")

export const MIN_FILL_MS = 3000;
export const NAME_MIN_LEN = 12;
export const GIBBERISH_THRESHOLD = 3;

const VOWELS = /[aeiou]/i;

// Score a single name field. Higher = more likely random letters. Only the letters are scored.
//   +2  3+ lower→upper case switches inside the word   (+1 for exactly 2)   real names: "McDonald", "DeShawn" have 1
//   +2  a vowel ratio under 15%                         (+1 under 25%)       random letters average ~19%
//   +2  a run of 5+ consonants                          (+1 for a run of 4)  "Schwarz" has 4, random text has 5-7
export function gibberishScore(raw) {
  const s = String(raw || "").replace(/[^A-Za-z]/g, "");
  if (!s) return 0;
  let score = 0;

  let switches = 0;
  for (let i = 1; i < s.length; i++) if (/[a-z]/.test(s[i - 1]) && /[A-Z]/.test(s[i])) switches++;
  if (switches >= 3) score += 2; else if (switches === 2) score += 1;

  const vowels = [...s].filter((c) => VOWELS.test(c)).length / s.length;
  if (vowels < 0.15) score += 2; else if (vowels < 0.25) score += 1;

  let run = 0, maxRun = 0;
  for (const c of s) { run = VOWELS.test(c) ? 0 : run + 1; if (run > maxRun) maxRun = run; }
  if (maxRun >= 5) score += 2; else if (maxRun === 4) score += 1;

  return score;
}

export function isGibberishName(raw) {
  const letters = String(raw || "").replace(/[^A-Za-z]/g, "");
  return letters.length >= NAME_MIN_LEN && gibberishScore(letters) >= GIBBERISH_THRESHOLD;
}

export function hasDottedLocalPart(email) {
  const local = String(email || "").split("@")[0];
  return (local.match(/\./g) || []).length >= 3;
}

export function emailDomain(email) {
  const at = String(email || "").lastIndexOf("@");
  return at > 0 ? String(email).slice(at + 1).toLowerCase().slice(0, 100) : "";
}

// Fill time: prefer _tl (ms since page load, sent by forms.js since 2026-10-31); fall back to _t (since first touch of the form).
export function fillTimeMs(p) {
  const n = Number(p && (p._tl ?? p._t));
  return Number.isFinite(n) ? n : null;
}

// All reasons a payload is spam; an empty array means "forward it".
export function spamReasons(p) {
  const reasons = [];
  if (String(p?._hp ?? p?._gotcha ?? "").trim()) reasons.push("honeypot");
  const t = fillTimeMs(p);
  if (t === null || t < MIN_FILL_MS) reasons.push("too_fast");
  if (isGibberishName(p?.first_name) || isGibberishName(p?.last_name)) reasons.push("gibberish_name");
  if (hasDottedLocalPart(p?.email)) reasons.push("dotted_email");
  return reasons;
}

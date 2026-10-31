// node --test tests/   — spam rules used by the casperb2b-forms Worker (worker/src/spam.js)
import test from "node:test";
import assert from "node:assert/strict";
import { gibberishScore, isGibberishName, hasDottedLocalPart, emailDomain, spamReasons } from "../worker/src/spam.js";

const BOT_NAMES = ["KVduYVMwTrYUKFZpOlOghdjL", "xQmTzRbWpLkVnHcY", "bHfTgKxLmPzQwRtY", "ZKdqWnHrGtXbPlMs", "rTgYhUjKlMnBvCxZ", "aSdFgHjKlQwErTy", "LmnBvcXzQwrtPkd"];
const REAL_NAMES = ["Christopherson", "Bartholomew", "Maximilliano", "Krzysztofiak", "Wojciechowski", "Schwarzenegger", "MacDonaldson", "Mary-Elizabeth", "Ramakrishnan",
  "Alexandrovich", "Papadopoulos", "Vanderbilt-Jones", "Constantinople", "Featherstonehaugh", "DeShawnTavarius", "Nguyenhuuthanh", "JEANCHRISTOPHE", "Oluwaseun Adebayo", "Bhattacharya",
  "Jared", "Mark", "Casper", "KVdu"];

test("random mixed-case names are gibberish", () => {
  for (const n of BOT_NAMES) assert.ok(isGibberishName(n), `${n} should be flagged (score ${gibberishScore(n)})`);
});

test("long real names are not gibberish", () => {
  for (const n of REAL_NAMES) assert.ok(!isGibberishName(n), `${n} should pass (score ${gibberishScore(n)})`);
});

test("names under 12 letters are never flagged, whatever they look like", () => {
  assert.equal(isGibberishName("xQzTkWpRb"), false);
  assert.equal(isGibberishName(""), false);
  assert.equal(isGibberishName(null), false);
});

test("the example bot name scores high", () => {
  assert.ok(gibberishScore("KVduYVMwTrYUKFZpOlOghdjL") >= 5);
});

test("dotted email local parts", () => {
  assert.equal(hasDottedLocalPart("j.o.h.nsmith@gmail.com"), true);
  assert.equal(hasDottedLocalPart("a.b.c.d.e@gmail.com"), true);
  assert.equal(hasDottedLocalPart("john.r.smith@gmail.com"), false); // 2 dots is fine
  assert.equal(hasDottedLocalPart("jane@my.big.company.co.uk"), false); // dots in the domain don't count
  assert.equal(hasDottedLocalPart(""), false);
});

test("emailDomain keeps only the domain", () => {
  assert.equal(emailDomain("Someone@Gmail.COM"), "gmail.com");
  assert.equal(emailDomain("nope"), "");
});

const good = { first_name: "Jared", last_name: "Casper", email: "jared@example.com", _hp: "", _t: 1200, _tl: 9000 };

test("a normal lead has no spam reasons", () => {
  assert.deepEqual(spamReasons(good), []);
});

test("each rule fires on its own", () => {
  assert.deepEqual(spamReasons({ ...good, _hp: "http://spam" }), ["honeypot"]);
  assert.deepEqual(spamReasons({ ...good, _tl: 1500 }), ["too_fast"]);
  assert.deepEqual(spamReasons({ ...good, first_name: "KVduYVMwTrYUKFZpOlOghdjL" }), ["gibberish_name"]);
  assert.deepEqual(spamReasons({ ...good, last_name: "xQmTzRbWpLkVnHcY" }), ["gibberish_name"]);
  assert.deepEqual(spamReasons({ ...good, email: "k.v.d.u@gmail.com" }), ["dotted_email"]);
});

test("fill time: _tl (since page load) wins; old clients that only send _t still work; missing time is too fast", () => {
  assert.deepEqual(spamReasons({ ...good, _t: 500, _tl: 8000 }), []); // autofilled quickly, but the page was open 8s
  const { _tl, ...old } = good;
  assert.deepEqual(spamReasons({ ...old, _t: 4000 }), []);
  assert.deepEqual(spamReasons({ ...old, _t: 900 }), ["too_fast"]);
  const { _t, ...none } = old;
  assert.deepEqual(spamReasons(none), ["too_fast"]);
});

test("a typical bot hits several rules", () => {
  assert.deepEqual(spamReasons({ first_name: "KVduYVMwTrYUKFZpOlOghdjL", last_name: "", email: "k.v.d.u.y@gmail.com", _hp: "x", _tl: 400 }), ["honeypot", "too_fast", "gibberish_name", "dotted_email"]);
});

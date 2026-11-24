// node test.mjs: the list's format, a source with a quote for every entry, and the copy rules.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const readme = readFileSync(new URL("./README.md", import.meta.url), "utf8");
const sources = JSON.parse(readFileSync(new URL("./sources.json", import.meta.url), "utf8")).entries;
const OWN = "https://github.com/viewgum/";

const body = readme.slice(readme.indexOf("\n## ", readme.indexOf("## Contents") + 1));
const entries = [...body.matchAll(/^- \[([^\]]+)\]\(([^)]+)\) - (.+)$/gm)].map(([, title, url, text]) => ({ title, url, text }));
const listLines = body.split("\n").filter((l) => l.startsWith("- "));
assert.equal(entries.length, listLines.length, "every list line is `- [Title](url) - Description.`");
assert.ok(entries.length >= 20);

const seen = new Set();
for (const e of entries) {
  assert.ok(!seen.has(e.url), `${e.url} is listed twice`);
  seen.add(e.url);
  assert.match(e.url, /^https:\/\//, `${e.title}: links are https`);
  assert.match(e.text, /^[A-Z0-9].*\.$/, `${e.title}: starts with a capital and ends with a period`);
  assert.ok(!/^(A|An) /.test(e.text), `${e.title}: does not start with A or An`);
  const s = sources.find((x) => x.url === e.url);
  assert.ok(s, `${e.url} has no entry in sources.json`);
  assert.match(s.read, /^\d{4}-\d{2}-\d{2}$/, `${e.url}: read date`);
  if (!e.url.startsWith(OWN)) assert.ok(s.quote || s.note, `${e.url}: a quote from the page, or a note on how it was read`);
}
for (const s of sources) assert.ok(seen.has(s.url), `sources.json lists ${s.url}, which the README does not`);

const contents = [...readme.matchAll(/^- \[[^\]]+\]\(#([^)]+)\)$/gm)].map((m) => m[1]);
const anchors = [...readme.matchAll(/^## (.+)$/gm)].map((m) => m[1].toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/ /g, "-"));
for (const c of contents) assert.ok(anchors.includes(c), `Contents links #${c}, which no heading makes`);

for (const f of ["README.md", "CONTRIBUTING.md", "llms.txt", "sources.json"]) {
  const t = readFileSync(new URL(`./${f}`, import.meta.url), "utf8");
  assert.ok(!/[–—]/.test(t), `${f} has a long dash`);
  assert.ok(!/(?<![!\[])!(?!\[)/.test(t.replace(/<!--[\s\S]*?-->/g, "")), `${f} has an exclamation mark`);
}
console.log(`ok: ${entries.length} entries, each with a source`);

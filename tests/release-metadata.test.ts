import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";
import { PLUGIN_VERSION } from "../src/constants";

const packageJson = JSON.parse(readFileSync("package.json", "utf8")) as { version: string };
const manifest = JSON.parse(readFileSync("manifest.json", "utf8")) as { version: string };
const versions = JSON.parse(readFileSync("versions.json", "utf8")) as Record<string, string>;
const lock = JSON.parse(readFileSync("package-lock.json", "utf8")) as { lockfileVersion: number; packages: { "": { version: string } } };
const ci = readFileSync(".github/workflows/ci.yml", "utf8");
const release = readFileSync(".github/workflows/release.yml", "utf8");
const readme = readFileSync("README.md", "utf8");
const changelog = readFileSync("CHANGELOG.md", "utf8");
const architecture = readFileSync("ARCHITECTURE.md", "utf8");

test("0.7.0 release metadata and reproducible build inputs agree", () => {
  assert.equal(PLUGIN_VERSION, "0.7.0");
  assert.equal(packageJson.version, PLUGIN_VERSION);
  assert.equal(manifest.version, PLUGIN_VERSION);
  assert.equal(versions[PLUGIN_VERSION], "1.11.4");
  assert.ok(lock.lockfileVersion >= 3);
  assert.equal(lock.packages[""].version, PLUGIN_VERSION);
  assert.ok(ci.includes("npm ci"));
  assert.ok(release.includes("npm ci"));
});

test("release artifacts include bundled Hero assets and current privacy guidance", () => {
  for (const asset of ["assets/heroes/alpine.webp", "assets/heroes/paper.webp", "assets/heroes/midnight.webp"]) {
    assert.equal(existsSync(asset), true, asset);
    assert.ok(ci.includes(asset) || ci.includes("assets/heroes/*.webp"));
    assert.ok(release.includes(asset) || release.includes("assets/heroes/*.webp"));
  }
  for (const phrase of ["SecretStorage", "离线行为", "恢复", "许可证"]) assert.ok(readme.includes(phrase), phrase);
  for (const phrase of ["VaultIndexService", "DashboardRenderService", "SecretStorage", "license"]) assert.ok(architecture.includes(phrase), phrase);
});

test("release workflow ships an install ZIP with nested assets and complete source inputs", () => {
  assert.match(release, /zip -r "DashFlow-v\$VERSION\.zip"/);
  assert.match(release, /gh release create "\$VERSION"[\s\S]*?"DashFlow-v\$VERSION\.zip"/);
  for (const input of ["package-lock.json", "CHANGELOG.md"]) assert.ok(ci.includes(input), input);
  assert.ok(readme.includes("DashFlow-v0.7.0.zip"));
  assert.ok(changelog.includes("## 0.7.0"));
  assert.ok(readFileSync(".gitignore", "utf8").includes("main.js"));
});

test("CI derives source archive naming from manifest metadata", () => {
  assert.ok(ci.includes("require('./manifest.json').version"));
  assert.match(ci, /DashFlow-v\$VERSION-full-source\.zip/);
  assert.equal(ci.includes("DashFlow-v0.6.1-full-source.zip"), false);
});

test("duplicate releases fail loudly instead of silently succeeding", () => {
  assert.match(release, /if gh release view "\$VERSION"[\s\S]*?exit 1/);
  assert.equal(release.includes("already exists; skipping"), false);
});

test("release publishing requires a matching version tag and an owner-selected license", () => {
  assert.match(release, /push:[\s\S]*?tags:/);
  assert.equal(release.includes("branches: [main]"), false);
  assert.ok(release.includes("manifest.json"));
  assert.match(release, /if \[ "\$GITHUB_REF_NAME" != "\$VERSION" \][\s\S]*?exit 1/);
  assert.match(release, /test -f LICENSE[\s\S]*?exit 1/);
});

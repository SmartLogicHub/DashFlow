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
const architecture = readFileSync("ARCHITECTURE.md", "utf8");

test("0.6.0 release metadata and reproducible build inputs agree", () => {
  assert.equal(PLUGIN_VERSION, "0.6.0");
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

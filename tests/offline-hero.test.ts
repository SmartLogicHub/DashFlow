import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const sources = [
  readFileSync("src/services/PersonalHomeDesignService.ts", "utf8"),
  readFileSync("src/styles/ProductPresentationStyles.ts", "utf8"),
  readFileSync("src/services/PresentationRuntimeService.ts", "utf8"),
].join("\n");

test("built-in Hero scenes are local, bundled, and offline-safe", () => {
  assert.equal(sources.includes("images.unsplash.com"), false);
  assert.ok(sources.includes("getResourcePath"));
  assert.ok(sources.includes("bundledHeroAssetPath"));
  for (const asset of [
    "assets/heroes/alpine.webp",
    "assets/heroes/paper.webp",
    "assets/heroes/moss.webp",
    "assets/heroes/dune.webp",
    "assets/heroes/ink.webp",
    "assets/heroes/blush.webp",
    "assets/heroes/midnight.webp",
    "assets/heroes/aurora.webp",
  ]) {
    assert.equal(existsSync(asset), true, asset);
    assert.ok(readFileSync(asset).subarray(0, 4).equals(Buffer.from([0x52, 0x49, 0x46, 0x46])), asset);
  }
});

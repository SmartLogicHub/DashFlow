import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const service = readFileSync("src/services/WeReadService.ts", "utf8");
const settings = readFileSync("src/settings/DashFlowSettingsTab.ts", "utf8");
const home = readFileSync("src/services/PersonalHomeService.ts", "utf8");

test("WeRead uses Tencent official Agent Gateway with the published skill version", () => {
  assert.ok(service.includes('https://i.weread.qq.com/api/agent/gateway'));
  assert.ok(service.includes('const WEREAD_SKILL_VERSION = "1.0.4"'));
  assert.ok(service.includes('Authorization: `Bearer ${apiKey}`'));
  assert.ok(service.includes('api_name: apiName'));
  assert.ok(service.includes('skill_version: WEREAD_SKILL_VERSION'));
});

test("daily highlight workflow reads notebook overview then personal underline content", () => {
  assert.ok(service.includes('"/user/notebooks"'));
  assert.ok(service.includes('"/book/bookmarklist"'));
  assert.ok(service.includes("markText"));
  assert.ok(service.includes("chapterByUid"));
  assert.ok(service.includes("deepLink"));
});

test("WeRead integration never uses Cookie scraping or invents a deep link", () => {
  assert.equal(service.toLowerCase().includes("cookie"), false);
  assert.equal(service.includes("weread://"), false);
  assert.equal(service.includes("/book/bestbookmarks"), false);
});

test("WeRead API key is referenced through Obsidian SecretComponent and SecretStorage", () => {
  assert.ok(settings.includes("SecretComponent"));
  assert.ok(settings.includes("weReadSecretId"));
  assert.ok(service.includes("secretStorage.getSecret"));
  assert.ok(settings.includes("https://weread.qq.com/r/weread-skills"));
});

test("Home shows an explicit disconnected state instead of a fake quote", () => {
  assert.ok(home.includes("连接微信读书后，每天重新发现一句自己的划线"));
  assert.ok(home.includes("不会展示伪造的名言、书封或来源"));
  assert.ok(home.includes("renderWeReadHighlight"));
});

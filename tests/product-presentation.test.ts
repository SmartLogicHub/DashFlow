import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readFileSync } from "node:fs";

const presentationPath = "src/styles/ProductPresentationStyles.ts";
const productDesign = readFileSync("src/services/ProductDesignService.ts", "utf8");

test("the product has one canonical presentation entry point", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  assert.ok(
    productDesign.includes('import { PRODUCT_PRESENTATION_STYLES } from "../styles/ProductPresentationStyles"'),
    "ProductDesignService should import the canonical presentation layer",
  );
});

test("the canonical presentation layer owns the minimum type and control tokens", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  const presentation = readFileSync(presentationPath, "utf8");

  for (const token of [
    "--df-type-label: 11px",
    "--df-type-secondary: 12px",
    "--df-type-body: 13px",
    "--df-type-title: 14px",
    "--df-control-compact: 32px",
    "--df-control-touch: 36px",
  ]) {
    assert.ok(presentation.includes(token), `missing presentation token: ${token}`);
  }
});

test("the product shell exposes a container query boundary", () => {
  assert.ok(existsSync(presentationPath), "ProductPresentationStyles.ts should exist");
  const presentation = readFileSync(presentationPath, "utf8");
  assert.ok(presentation.includes(".dashflow-command-shell"));
  assert.ok(presentation.includes("container: dashflow-shell / inline-size"));
});

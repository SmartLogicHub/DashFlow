import assert from "node:assert/strict";
import test from "node:test";
import { TimedConfirmation } from "../src/ui/timedConfirmation";

test("timed confirmation requires a second click within the expiry window", () => {
  const confirmation = new TimedConfirmation(5_000);

  assert.equal(confirmation.request("reset", 100), false);
  assert.equal(confirmation.request("reset", 4_999), true);
  assert.equal(confirmation.request("reset", 5_000), false);
});

test("timed confirmation expires and isolates different destructive actions", () => {
  const confirmation = new TimedConfirmation(5_000);

  assert.equal(confirmation.request("remove-widget", 100), false);
  assert.equal(confirmation.request("reset-layout", 101), false);
  assert.equal(confirmation.request("remove-widget", 102), false);
  assert.equal(confirmation.request("remove-widget", 5_102), true);
});

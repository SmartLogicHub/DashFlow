import assert from "node:assert/strict";
import test from "node:test";
import { TimedConfirmation } from "../src/ui/timedConfirmation";
import {
  removeOpportunityItem,
  restoreOpportunityItem,
} from "../src/product/opportunityOrdering";
import type { OpportunityItem } from "../src/services/OpportunityService";

function opportunity(id: string): OpportunityItem {
  return {
    id,
    title: id,
    status: "inbox",
    tags: [],
    notes: "",
    link: "",
    starred: false,
    order: 0,
    createdAt: "2026-08-20",
    updatedAt: "2026-08-20",
  };
}

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

test("opportunity removal and restore preserve exact order and are idempotent", () => {
  const original = [opportunity("a"), opportunity("b"), opportunity("c")];
  const removal = removeOpportunityItem(original, "b");
  assert.equal(removal.removed?.id, "b");
  assert.equal(removal.index, 1);
  assert.deepEqual(removal.items.map((item) => item.id), ["a", "c"]);
  assert.deepEqual(restoreOpportunityItem(removal.items, removal).map((item) => item.id), ["a", "b", "c"]);
  assert.deepEqual(restoreOpportunityItem(restoreOpportunityItem(removal.items, removal), removal).map((item) => item.id), ["a", "b", "c"]);
});

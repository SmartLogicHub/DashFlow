import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";

const service = readFileSync("src/services/OpportunityService.ts", "utf8");
const widget = readFileSync("src/widgets/opportunity.ts", "utf8");
const interaction = readFileSync("src/services/OpportunityWidgetInteractionService.ts", "utf8");
const main = readFileSync("src/main.ts", "utf8");

test("opportunity board is a registered widget storing items in one Markdown file", () => {
  assert.ok(widget.includes('type: "opportunity-board"'));
  assert.ok(widget.includes("registerOpportunityWidgets"));
  assert.ok(service.includes("frontmatter.opportunities"));
  assert.ok(service.includes("processFrontMatter"));
  assert.ok(service.includes("OPPORTUNITY_STAGES"));
});

test("opportunity board interaction is lifecycle-managed by the plugin", () => {
  assert.ok(main.includes("new OpportunityWidgetInteractionService(this)"));
  assert.ok(main.includes("this.opportunityWidgets.start()"));
  assert.ok(main.includes("this.opportunityWidgets?.stop()"));
  assert.ok(main.includes("registerOpportunityWidgets(this.widgetRegistry)"));
});

test("opportunity board keeps data in Markdown frontmatter, not a second store", () => {
  assert.ok(service.includes("parseYaml"));
  assert.ok(interaction.includes("dashflow-opportunity-board"));
  assert.equal(service.includes("localStorage"), false);
  assert.equal(service.includes("indexedDB"), false);
});

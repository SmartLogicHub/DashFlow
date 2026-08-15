import test from "node:test";
import assert from "node:assert/strict";
import { parseTasks, serializeTaskLine } from "../src/parsers/taskParser";

const source = "  - [ ] Ship release #context/work #project/alpha 🔼 🛫 2026-08-16 ⏳ 2026-08-17 📅 2026-08-20";

test("parser separates editable task text from managed metadata", () => {
  const [task] = parseTasks("Inbox.md", source);
  assert.ok(task);
  assert.equal(task.text, "Ship release #context/work");
  assert.equal(task.projectId, "alpha");
  assert.equal(task.priority, "high");
  assert.equal(task.start, "2026-08-16");
  assert.equal(task.scheduled, "2026-08-17");
  assert.equal(task.due, "2026-08-20");
});

test("task serialization edits scheduling metadata without exposing markup to the user", () => {
  const [task] = parseTasks("Inbox.md", source);
  assert.ok(task);

  const line = serializeTaskLine(task, {
    text: "Ship v0.3 #context/work",
    completed: true,
    start: "2026-08-18",
    scheduled: "2026-08-19",
    due: "2026-08-22",
    priority: "urgent",
    projectId: "beta",
  });

  assert.equal(
    line,
    "  - [x] Ship v0.3 #context/work #project/beta ⏫ 🛫 2026-08-18 ⏳ 2026-08-19 📅 2026-08-22",
  );
});

test("task serialization can clear project and all managed dates", () => {
  const [task] = parseTasks("Inbox.md", source);
  assert.ok(task);

  const line = serializeTaskLine(task, {
    text: "Ship release #context/work",
    completed: false,
    priority: "normal",
  });

  assert.equal(line, "  - [ ] Ship release #context/work");
});

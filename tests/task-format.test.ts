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
  assert.equal(task.due, "2026-08-20");
});

test("task serialization preserves list indentation and non-edited scheduling metadata", () => {
  const [task] = parseTasks("Inbox.md", source);
  assert.ok(task);

  const line = serializeTaskLine(task, {
    text: "Ship v0.1.3 #context/work",
    completed: true,
    due: "2026-08-22",
    priority: "urgent",
    projectId: "beta",
  });

  assert.equal(
    line,
    "  - [x] Ship v0.1.3 #context/work #project/beta ⏫ 🛫 2026-08-16 ⏳ 2026-08-17 📅 2026-08-22",
  );
});

test("task serialization can clear project, due date and priority", () => {
  const [task] = parseTasks("Inbox.md", source);
  assert.ok(task);

  const line = serializeTaskLine(task, {
    text: "Ship release #context/work",
    completed: false,
    priority: "normal",
  });

  assert.equal(
    line,
    "  - [ ] Ship release #context/work 🛫 2026-08-16 ⏳ 2026-08-17",
  );
});

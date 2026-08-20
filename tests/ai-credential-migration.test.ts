import assert from "node:assert/strict";
import test from "node:test";
import {
  AI_SECRET_ID,
  migrateAiCredential,
  resolveAiApiKey,
  type AiSecretStore,
} from "../src/core/aiCredentialMigration";

class MemorySecretStore implements AiSecretStore {
  readonly values = new Map<string, string>();
  readonly writes: Array<[string, string]> = [];

  getSecret(id: string): string | null {
    return this.values.get(id) ?? null;
  }

  setSecret(id: string, secret: string): void {
    this.writes.push([id, secret]);
    this.values.set(id, secret);
  }
}

test("keeps an existing SecretStorage identifier without rewriting its secret", () => {
  const store = new MemorySecretStore();
  store.values.set("my-ai-key", "sk-existing-secret-123456");

  const result = migrateAiCredential("my-ai-key", store);

  assert.deepEqual(result, {
    aiSecretId: "my-ai-key",
    status: "configured",
    shouldPersist: false,
  });
  assert.deepEqual(store.writes, []);
});

test("moves a v0.5.6 plaintext API key to the stable SecretStorage identifier", () => {
  const store = new MemorySecretStore();

  const result = migrateAiCredential("sk-plaintext-secret-123456", store);

  assert.deepEqual(result, {
    aiSecretId: AI_SECRET_ID,
    status: "migrated",
    shouldPersist: true,
  });
  assert.deepEqual(store.writes, [[AI_SECRET_ID, "sk-plaintext-secret-123456"]]);
  assert.equal(resolveAiApiKey(result.aiSecretId, store), "sk-plaintext-secret-123456");
});

test("empty credentials remain unconfigured for local endpoints", () => {
  const store = new MemorySecretStore();
  assert.deepEqual(migrateAiCredential("", store), {
    aiSecretId: "",
    status: "unconfigured",
    shouldPersist: false,
  });
  assert.equal(resolveAiApiKey("", store), null);
});

test("invalid values are removed from plugin data without entering SecretStorage", () => {
  const store = new MemorySecretStore();
  assert.deepEqual(migrateAiCredential("not a usable key", store), {
    aiSecretId: "",
    status: "invalid",
    shouldPersist: true,
  });
  assert.deepEqual(store.writes, []);
});

test("migration is idempotent on repeated startup", () => {
  const store = new MemorySecretStore();
  const first = migrateAiCredential("sk-repeat-secret-123456", store);
  const second = migrateAiCredential(first.aiSecretId, store);

  assert.equal(first.status, "migrated");
  assert.deepEqual(second, {
    aiSecretId: AI_SECRET_ID,
    status: "configured",
    shouldPersist: false,
  });
  assert.equal(store.writes.length, 1);
});

test("credential resolution never falls back to returning the identifier", () => {
  const store = new MemorySecretStore();
  assert.equal(resolveAiApiKey("missing-secret", store), null);
});

export const AI_SECRET_ID = "dashflow-ai-api-key";

export interface AiSecretStore {
  getSecret(id: string): string | null;
  setSecret(id: string, secret: string): void;
}

export type AiCredentialMigrationStatus = "configured" | "migrated" | "unconfigured" | "invalid";

export interface AiCredentialMigrationResult {
  aiSecretId: string;
  status: AiCredentialMigrationStatus;
  shouldPersist: boolean;
}

const SECRET_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function looksLikePlaintextApiKey(value: string): boolean {
  if (/\s/.test(value) || value.length < 12) return false;
  return /^sk-[A-Za-z0-9._-]+$/.test(value)
    || (!SECRET_ID_PATTERN.test(value) && /^[A-Za-z0-9._-]+$/.test(value));
}

export function resolveAiApiKey(secretId: string, secrets: AiSecretStore): string | null {
  const id = secretId.trim();
  if (!id || !SECRET_ID_PATTERN.test(id)) return null;
  const secret = secrets.getSecret(id)?.trim();
  return secret || null;
}

export function migrateAiCredential(
  storedValue: string,
  secrets: AiSecretStore,
): AiCredentialMigrationResult {
  const candidate = typeof storedValue === "string" ? storedValue.trim() : "";
  if (!candidate) {
    return { aiSecretId: "", status: "unconfigured", shouldPersist: false };
  }

  if (SECRET_ID_PATTERN.test(candidate) && resolveAiApiKey(candidate, secrets)) {
    return {
      aiSecretId: candidate,
      status: "configured",
      shouldPersist: candidate !== storedValue,
    };
  }

  if (looksLikePlaintextApiKey(candidate)) {
    secrets.setSecret(AI_SECRET_ID, candidate);
    return { aiSecretId: AI_SECRET_ID, status: "migrated", shouldPersist: true };
  }

  return { aiSecretId: "", status: "invalid", shouldPersist: true };
}

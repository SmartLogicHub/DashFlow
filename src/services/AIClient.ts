import { requestUrl } from "obsidian";
import type DashFlowPlugin from "../main";
import { resolveAiApiKey } from "../core/aiCredentialMigration";
import { withTimeout } from "../utils/requestTimeout";

export type AIMessage = { role: "system" | "user" | "assistant"; content: string };

const AI_REQUEST_TIMEOUT_MS = 120_000;

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
  error?: { message?: string };
}

function trimBaseUrl(value: string): string {
  return value.trim().replace(/\/+$/, "");
}

function isLocalEndpoint(value: string): boolean {
  try {
    const url = new URL(value);
    return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
  } catch {
    return false;
  }
}

function jsonPayload(content: string): string {
  const stripped = content.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
  if (stripped.startsWith("{") || stripped.startsWith("[")) return stripped;
  const objectStart = stripped.indexOf("{");
  const objectEnd = stripped.lastIndexOf("}");
  if (objectStart >= 0 && objectEnd > objectStart) return stripped.slice(objectStart, objectEnd + 1);
  const arrayStart = stripped.indexOf("[");
  const arrayEnd = stripped.lastIndexOf("]");
  if (arrayStart >= 0 && arrayEnd > arrayStart) return stripped.slice(arrayStart, arrayEnd + 1);
  return stripped;
}

export class AIClient {
  constructor(private readonly plugin: DashFlowPlugin) {}

  isConfigured(): boolean {
    const settings = this.plugin.data.settings;
    const baseUrl = trimBaseUrl(settings.aiBaseUrl);
    if (!settings.aiEnabled || !baseUrl || !settings.aiModel.trim()) return false;
    if (isLocalEndpoint(baseUrl)) return true;
    return Boolean(resolveAiApiKey(settings.aiSecretId, this.plugin.app.secretStorage));
  }

  async testConnection(): Promise<string> {
    return this.complete([
      { role: "system", content: "You are a connection test. Reply with exactly OK." },
      { role: "user", content: "OK" },
    ], 32);
  }

  async complete(messages: AIMessage[], maxTokens = 900): Promise<string> {
    const settings = this.plugin.data.settings;
    if (!settings.aiEnabled) throw new Error("AI 尚未启用。");

    const baseUrl = trimBaseUrl(settings.aiBaseUrl);
    const model = settings.aiModel.trim();
    if (!baseUrl || !model) throw new Error("AI Base URL 或模型尚未配置。");

    const apiKey = resolveAiApiKey(settings.aiSecretId, this.plugin.app.secretStorage);
    if (!apiKey && !isLocalEndpoint(baseUrl)) {
      throw new Error("没有可用的 API Key。请先在 DashFlow 设置中填写 API Key；localhost / 127.0.0.1 本地端点可不填写 Key。");
    }

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await withTimeout(requestUrl({
      url: `${baseUrl}/chat/completions`,
      method: "POST",
      headers,
      body: JSON.stringify({ model, messages, max_tokens: maxTokens, stream: false }),
    }), AI_REQUEST_TIMEOUT_MS, "AI 请求超时，请稍后重试。");
    const data = response.json as ChatCompletionResponse;
    if (response.status < 200 || response.status >= 300) {
      throw new Error(data.error?.message || `HTTP ${response.status}`);
    }
    const content = data.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("AI 返回了空结果。");
    return content;
  }

  async completeJson<T>(messages: AIMessage[], maxTokens = 900): Promise<T> {
    const content = await this.complete(messages, maxTokens);
    try {
      return JSON.parse(jsonPayload(content)) as T;
    } catch {
      throw new Error("AI 返回的 JSON 无法解析。请重试或更换模型。");
    }
  }
}

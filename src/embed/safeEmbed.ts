export interface SafeEmbedUrl {
  url: string;
  origin: string;
  hostname: string;
}

function isLoopback(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost"
    || host.endsWith(".localhost")
    || host === "127.0.0.1"
    || host.startsWith("127.")
    || host === "::1";
}

export function parseSafeEmbedUrl(value: string): SafeEmbedUrl | null {
  try {
    const parsed = new URL(value.trim());
    if (parsed.username || parsed.password) return null;
    const secureRemote = parsed.protocol === "https:";
    const localHttp = parsed.protocol === "http:" && isLoopback(parsed.hostname);
    if (!secureRemote && !localHttp) return null;
    parsed.hash = "";
    return {
      url: parsed.toString(),
      origin: parsed.origin,
      hostname: parsed.hostname,
    };
  } catch {
    return null;
  }
}

export function magicEmbedSandbox(allowForms: boolean): string {
  const tokens = ["allow-popups", "allow-popups-to-escape-sandbox", "allow-scripts"];
  if (allowForms) tokens.push("allow-forms");
  return tokens.join(" ");
}

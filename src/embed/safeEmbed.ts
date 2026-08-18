export interface SafeEmbedUrl {
  url: string;
  origin: string;
  hostname: string;
}

function isIpv4Loopback(host: string): boolean {
  const parts = host.split(".");
  if (parts.length !== 4) return false;
  if (!parts.every((part) => /^\d{1,3}$/.test(part))) return false;
  const octets = parts.map(Number);
  if (octets.some((octet) => octet < 0 || octet > 255)) return false;
  return octets[0] === 127;
}

function isLoopback(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".localhost")) return true;
  if (host === "::1") return true;
  if (host.startsWith("::ffff:")) return isIpv4Loopback(host.slice("::ffff:".length));
  return isIpv4Loopback(host);
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

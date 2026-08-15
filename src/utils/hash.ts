export function stableHash(input: string): string {
  let value = 5381;
  for (let i = 0; i < input.length; i += 1) {
    value = ((value << 5) + value) ^ input.charCodeAt(i);
  }
  return (value >>> 0).toString(36);
}

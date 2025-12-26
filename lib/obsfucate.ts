const SECRET = process.env.HLS_SECRET;

function xor(data: Uint8Array, key: Uint8Array) {
  const out = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length];
  }
  return out;
}

export function encodeObfuscated(input: string) {
  const data = new TextEncoder().encode(input);
  const key = new TextEncoder().encode(SECRET);

  const mixed = xor(data, key);
  return Buffer.from(mixed).toString("base64url");
}

export function decodeObfuscated(token: string) {
  const data = Buffer.from(token, "base64url");
  const key = new TextEncoder().encode(SECRET);

  const original = xor(data, key);
  return new TextDecoder().decode(original);
}

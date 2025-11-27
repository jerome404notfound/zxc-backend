import crypto from "crypto";

export function hmacSign(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("hex");
}

export function encodeBase64Url(str: string): string {
  const base64 = Buffer.from(str, "utf8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) base64 += "=";
  return Buffer.from(base64, "base64").toString("utf8");
}

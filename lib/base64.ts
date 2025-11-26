export function encodeBase64Url(str: string): string {
  // Convert string to base64 using native browser API (handles Unicode)
  const base64 = btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
      String.fromCharCode(parseInt(p1, 16))
    )
  );

  // Make URL-safe
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeBase64Url(str: string): string {
  // Convert from URL-safe to standard base64
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");

  // Add padding
  while (base64.length % 4) {
    base64 += "=";
  }

  // Decode and handle Unicode
  return decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

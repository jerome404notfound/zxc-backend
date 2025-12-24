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
/**
 * Encrypts a string (e.g., URL) with a secret password.
 * Returns a Base64-encoded ciphertext (IV + encrypted data) safe for URLs.
 */
// export async function encryptString(plainText: string, password: string): Promise<string> {
//   // Derive a proper crypto key from the password (using PBKDF2)
//   const enc = new TextEncoder();
//   const passwordBuffer = enc.encode(password);

//   const importedKey = await crypto.subtle.importKey(
//     "raw",
//     passwordBuffer,
//     { name: "PBKDF2" },
//     false,
//     ["deriveBits", "deriveKey"]
//   );

//   const salt = crypto.getRandomValues(new Uint8Array(16)); // Random salt for each encryption
//   const derivedKey = await crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt,
//       iterations: 100000, // High for security
//       hash: "SHA-256"
//     },
//     importedKey,
//     { name: "AES-GCM", length: 256 },
//     false,
//     ["encrypt"]
//   );

//   // Generate random IV
//   const iv = crypto.getRandomValues(new Uint8Array(12));

//   // Encrypt the plaintext
//   const data = enc.encode(plainText);
//   const encrypted = await crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     derivedKey,
//     data
//   );

//   // Combine salt + iv + ciphertext
//   const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
//   combined.set(salt, 0);
//   combined.set(iv, salt.byteLength);
//   combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);

//   // Return as Base64URL (safe to share)
//   return btoa(String.fromCharCode(...combined))
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

// /**
//  * Decrypts a string encrypted with encryptString().
//  */
// export async function decryptString(cipherText: string, password: string): Promise<string> {
//   const enc = new TextEncoder();
//   const dec = new TextDecoder();

//   // Restore standard Base64 and convert to bytes
//   let binary = atob(
//     cipherText.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((cipherText.length % 4))
//   );
//   const combined = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) {
//     combined[i] = binary.charCodeAt(i);
//   }

//   // Extract salt, iv, ciphertext
//   const salt = combined.slice(0, 16);
//   const iv = combined.slice(16, 16 + 12);
//   const encrypted = combined.slice(16 + 12);

//   // Derive the same key
//   const importedKey = await crypto.subtle.importKey(
//     "raw",
//     enc.encode(password),
//     { name: "PBKDF2" },
//     false,
//     ["deriveBits", "deriveKey"]
//   );

//   const derivedKey = await crypto.subtle.deriveKey(
//     {
//       name: "PBKDF2",
//       salt,
//       iterations: 100000,
//       hash: "SHA-256"
//     },
//     importedKey,
//     { name: "AES-GCM", length: 256 },
//     false,
//     ["decrypt"]
//   );

//   try {
//     const decrypted = await crypto.subtle.decrypt(
//       { name: "AES-GCM", iv },
//       derivedKey,
//       encrypted
//     );
//     return dec.decode(decrypted);
//   } catch (e) {
//     throw new Error("Decryption failed — wrong password or corrupted data");
//   }
// }

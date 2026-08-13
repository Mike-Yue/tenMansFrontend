// sha256Hex computes the SHA-256 of a file's bytes and returns it as a 64-char
// lowercase hex string — the content hash the backend keys uploads on.
//
// Uses the Web Crypto API, which is only available in a secure context
// (localhost and any HTTPS origin both qualify). The whole file is read into
// memory to hash it; that is fine for demo files today, but streaming would be
// the move if demos ever get large enough to strain memory.
export async function sha256Hex(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

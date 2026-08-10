// ApiError carries the HTTP status so callers can distinguish, e.g., a 501
// "not implemented" stub from a real 404 or 500.
export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// The backend emits int64 fields (notably steamId) as bare JSON numbers. Values
// like 76561198137660080 exceed Number.MAX_SAFE_INTEGER, so a plain JSON.parse
// would silently corrupt them. We quote any integer literal that is too large to
// represent exactly, turning it into a string before parsing. This keeps steamId
// intact (as a string) while leaving safe numbers untouched.
function parseJsonPreservingBigInts(text: string): unknown {
  if (text.trim() === '') return null

  // Match integer literals that appear as JSON values (after ":" or "[" or ",").
  const safe = text.replace(
    /([:[,]\s*)(-?\d+)(?=\s*[,\]}])/g,
    (match, prefix: string, digits: string) => {
      return Number.isSafeInteger(Number(digits))
        ? match
        : `${prefix}"${digits}"`
    },
  )

  return JSON.parse(safe)
}

// apiGet fetches a relative /api path and returns the parsed body as T.
// On a non-2xx response it throws an ApiError carrying the status code.
export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(path, {
    headers: { Accept: 'application/json' },
  })

  const text = await res.text()

  if (!res.ok) {
    const message = text.trim() || res.statusText
    throw new ApiError(res.status, message)
  }

  return parseJsonPreservingBigInts(text) as T
}

// apiPost sends a POST to a relative /api path and returns the parsed body as T.
// On a non-2xx response it throws an ApiError carrying the status code.
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const text = await res.text()

  if (!res.ok) {
    const message = text.trim() || res.statusText
    throw new ApiError(res.status, message)
  }

  return parseJsonPreservingBigInts(text) as T
}

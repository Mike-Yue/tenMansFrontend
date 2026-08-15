// The stateless session token the backend issues after Steam login. Stored in
// localStorage and sent as `Authorization: Bearer <token>` on every API call
// (the app and backend are on different origins, so a cookie can't be used).
const TOKEN_KEY = 'tm_token'

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // localStorage unavailable (private mode / disabled) — nothing we can do.
  }
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

// captureTokenFromUrl reads a token the backend placed in the URL fragment
// (".../#token=<token>") after a successful login, stores it, and strips the
// fragment so the token isn't left in the address bar or browser history. Call
// once at startup, before the app reads auth state.
export function captureTokenFromUrl(): void {
  const hash = window.location.hash
  const marker = '#token='
  if (!hash.startsWith(marker)) return

  const token = decodeURIComponent(hash.slice(marker.length))
  if (token) setToken(token)

  // Drop the fragment without adding a history entry.
  history.replaceState(null, '', window.location.pathname + window.location.search)
}

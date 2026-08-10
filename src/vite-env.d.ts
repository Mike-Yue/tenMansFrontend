/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Base URL of the backend API, e.g. https://tenmansbackend.onrender.com.
   * Leave empty for local dev so requests use relative /api paths through the
   * Vite proxy.
   */
  readonly VITE_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

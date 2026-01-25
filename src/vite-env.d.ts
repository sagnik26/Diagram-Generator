/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TAMBO_API_KEY?: string
  // Add other VITE_ prefixed env vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

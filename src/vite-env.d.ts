/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FO5_ADMIN_PASSWORD_SHA256?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

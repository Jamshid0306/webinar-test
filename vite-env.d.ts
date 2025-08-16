/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_URL: string
    // kerak bo‘lsa boshqa env’larni ham shu yerga qo‘shasiz
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
type EnvType = {
  WEB_API_URL: string,
}

export const env: EnvType = {
  WEB_API_URL: import.meta.env.VITE_WEB_API_URL,
}
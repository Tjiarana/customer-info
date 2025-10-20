// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],
  css: ["~/assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  ssr: true,
  ui: {},
  colorMode: {
    preference: "light",
    fallback: "light",
    classSuffix: ".light",
  },
  runtimeConfig: {
    public: {
      // base สำหรับ axios
      apiBase: "/backend",
    },
  },
  nitro: {
    devProxy: {
      // ส่งทุกอย่างที่ขึ้นต้นด้วย /backend ไปยัง backend จริง
      "/backend": {
        target: "http://10.22.26.77:4040",
        changeOrigin: true,
      },
    },
  },
  routeRules: {
    // proxy /backend/** → http://10.22.26.77:4040/**
    "/backend/**": { proxy: "http://10.22.26.77:4040/**" },
  },
});

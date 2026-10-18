import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const target = (
    process.env.VITE_API_URL ||
    process.env.VITE_API_BASE_URL ||
    env.VITE_API_URL ||
    env.VITE_API_BASE_URL ||
    "http://localhost:3000"
  )
    .replace(/\/+$/, "")
    .replace(/\/api$/, "");
  return {
    plugins: [vue()],
    base: "./",
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        "/api": { target, changeOrigin: true },
        "/uploads": { target, changeOrigin: true },
      },
    },
  };
});

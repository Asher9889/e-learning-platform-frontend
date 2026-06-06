import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
   define: {
    "process.env": {},  // ✅ yeh add karo
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   server: {
    proxy: {
      "/api": {
        target: "http://160.25.62.109:8230",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

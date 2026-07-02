import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
    assetsInclude: ["**/*.lottie"],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
   include: ["@excalidraw/excalidraw", "es6-promise-pool"],
  },
  server : {
    allowedHosts: ["7b0f-2401-4900-bde9-8839-c811-6bb9-e70-a6da.ngrok-free.app"]
  }
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "http://160.25.62.109:8230",
  //       changeOrigin: true,
  //       secure: false,
  //     },
  //   },
  // },
})
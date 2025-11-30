import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
      },
    },
  server: {
      port: 3000,
      proxy: {
        "/api/auth": {
          target: "http://localhost:6060", // service-auth
          changeOrigin: true,
        },
        "/api/tours": {
          target: "http://localhost:8081", // service-tour
          changeOrigin: true,
        },
      },
    },
})

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
          target: "http://localhost:8080", // service-auth
          changeOrigin: true,
        },
        "/api/tours": {
          target: "http://localhost:8081", // service-tour
          changeOrigin: true,
        },
        "/api/bookings": {
          target: "http://localhost:8082", // service-booking
          changeOrigin: true,
        },
      },
    },
})

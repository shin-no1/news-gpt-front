import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['newsgpt.know-that.dev', 'localhost'],
    host: '0.0.0.0', // 외부 접속 허용
    port: 5173,
  },
  plugins: [
      react(),
  ],
});

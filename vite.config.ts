import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5175,
    strictPort: true,
  },
  build: {
    // mapbox-gl은 단일 벤더 청크(~1.7MB)로 분리돼 지도 화면에서만 lazy 로드된다.
    // 이 청크는 더 쪼갤 수 없으므로 경고 임계값을 올려 빌드 로그 노이즈를 없앤다.
    chunkSizeWarningLimit: 1800,
  },
});

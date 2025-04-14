import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    include: /\.js$/,
    exclude: [],
    loader: "jsx",
  },
});

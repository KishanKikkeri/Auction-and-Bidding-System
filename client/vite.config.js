import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path"; // Import path module

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "src"), // Set an alias for your src folder
    },
  },
});

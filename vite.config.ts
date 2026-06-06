import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PORT = 3000;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");

  return {
    server: { port: PORT },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: "startup-log",
        configureServer() {
          console.log(
            [
              "\n🌐 app.web iniciado",
              `🚀 Puerto:       http://localhost:${PORT}`,
              `📡 API Gateway: ${env.VITE_API_GATEWAY_URL}`,
              `🖼️  Cloudinary:  ${env.VITE_CLOUDNAME}`,
              `⚙️  Modo:        ${mode}\n`,
            ].join("\n")
          );
        },
      },
    ],
  };
});

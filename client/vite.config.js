import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Port 3000 matches CLIENT_URL in the server's .env (used for CORS).
export default defineConfig({
  plugins: [react()],
  server: { port: 3000, strictPort: true },
  preview: { port: 3000, strictPort: true },
});

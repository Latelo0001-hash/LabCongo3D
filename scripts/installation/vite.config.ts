import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Outil de rendu de l'installation (hors du site) : la scène 3D calée sur la photo du laboratoire de l'école, pilotée
// image par image pour produire la vidéo de l'installation (voir render.mjs). `npm run installation:dev`.
const repo = fileURLToPath(new URL('../..', import.meta.url));
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  publicDir: `${repo}/public`,
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5199, strictPort: true, fs: { allow: [repo] } },
});

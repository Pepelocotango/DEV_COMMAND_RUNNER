import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Important per Electron (rutes relatives)
  build: {
    outDir: 'build', // Sortida a la carpeta 'build' per mantenir coherència
    emptyOutDir: true,
  },
  server: {
    port: 5173, // Port per defecte de Vite
  }
});
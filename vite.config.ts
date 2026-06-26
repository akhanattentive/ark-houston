import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on GitHub Pages project sites
// (https://user.github.io/ark-website/) as well as custom domains.
export default defineConfig({
  base: './',
  plugins: [react()],
});

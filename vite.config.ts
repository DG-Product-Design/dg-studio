import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { exampleSourcesPlugin } from './.storybook/example-sources';

export default defineConfig({
  plugins: [exampleSourcesPlugin(), react(), tailwindcss()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'studio-ui',
      cssFileName: 'studio-ui',
    },
    rollupOptions: {
      external: [
        /^react($|\/)/,
        /^react-dom($|\/)/,
        '@shadcn/react/message-scroller',
        'radix-ui',
        'lucide-react',
        'lottie-web',
        /^motion($|\/)/,
      ],
    },
  },
});

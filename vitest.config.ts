import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import viteConfig from './vite.config';

const localChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const executablePath =
  process.env.CHROME_PATH || (existsSync(localChrome) ? localChrome : undefined);

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      coverage: {
        provider: 'v8',
        reporter: ['text', 'html', 'json-summary'],
        include: ['src/components/**/*.{ts,tsx}', 'src/lib/**/*.ts'],
        exclude: ['src/**/*.test.{ts,tsx}', 'src/components/ui/**'],
      },
      projects: [
        {
          extends: true,
          test: {
            name: 'unit',
            environment: 'jsdom',
            include: ['src/**/*.test.{ts,tsx}'],
            setupFiles: ['./src/test/setup.ts'],
            restoreMocks: true,
            clearMocks: true,
          },
        },
        {
          extends: true,
          plugins: [
            storybookTest({
              configDir: fileURLToPath(new URL('./.storybook', import.meta.url)),
              storybookScript: 'npm run storybook',
            }),
          ],
          test: {
            name: 'storybook',
            sequence: { groupOrder: 1 },
            testTimeout: 20000,
            maxWorkers: 2,
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({ launchOptions: { executablePath } }),
              instances: [{ browser: 'chromium' }],
            },
          },
        },
      ],
    },
  }),
);

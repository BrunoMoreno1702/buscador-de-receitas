import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4300',
    ...devices['Desktop Chrome'],
  },
  webServer: [
    {
      command: 'node tests/mock-api.mjs',
      url: 'http://127.0.0.1:4301/recipes',
      reuseExistingServer: false,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 4300',
      url: 'http://127.0.0.1:4300',
      env: { NUXT_PUBLIC_RECIPES_API_BASE: 'http://127.0.0.1:4301/recipes' },
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
})

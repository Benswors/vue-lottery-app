import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests', fullyParallel: true,
  use: { baseURL: 'http://127.0.0.1:5190/vue-lottery-app/', channel: process.platform === 'win32' ? 'chrome' : undefined },
  webServer: { command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5190', url: 'http://127.0.0.1:5190/vue-lottery-app/', reuseExistingServer: !process.env.CI, env: { VITE_API_URL: 'https://dummyjson.com', VITE_BASE_PATH: '/vue-lottery-app/' } },
})

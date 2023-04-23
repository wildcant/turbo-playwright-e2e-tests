import { defineConfig, devices } from '@playwright/test'
import path from 'path'
import dotenv from 'dotenv'
import z from 'zod'

dotenv.config({ path: path.resolve(__dirname, '.env.test') })

const envVariables = z.object({
  API_URL: z.string(),
  WEB_APP_URL: z.string(),
  CI: z.coerce.boolean().optional(),
})

envVariables.parse(process.env)

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env.WEB_APP_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ..devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: 'pnpm --filter web start:test',
      url: process.env.WEB_APP_URL,
      reuseExistingServer: !process.env.CI,
      env: {
        NEXT_PUBLIC_API_URL: 'http://127.0.0.1:4000',
        NODE_ENV: 'test',
      },
    },
    {
      command: 'pnpm --filter be start:test',
      url: process.env.API_URL,
      // We don't want to share db instances between test and development environments.
      reuseExistingServer: false,
      env: {
        API_SECRET: 'supersecretstring',
        MONGO_URL: 'mongodb://127.0.0.1:27019/test',
        PG_HOST: '127.0.0.1',
        PG_NAME: 'postgres',
        PG_PASSWORD: 'postgres',
        PG_PORT: '5434',
        PG_USER: 'postgres',
        PORT: '4000',
        NODE_ENV: 'test',
      },
    },
  ],
})

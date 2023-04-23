## Turborepo + Playwright

playwright e2e tests with turbo cache in dev (local server) & ci (github actions)

Before anything you'll have to create the .env files in apps.

```sh
cp apps/web/.env.example apps/web/.env && cp apps/be/.env.example apps/be/.env
```

Start apps in development mode for the first time with:

```sh
pnpm i && pnpm db:init:dev && pnpm start:dev
```

Run tests for the first time with

```sh
pnpm i && pnpm db:init:test && pnpm test:e2e
```

##### References

- [End-to-end tests in 200ms with Turborepo](https://www.youtube.com/watch?v=bsE1VJn1HeU)
- [The Ultimate Guide to Testing with Prisma: End-To-End Testing](https://www.prisma.io/blog/testing-series-4-OVXtDis201)
- [Using Turborepo with GitHub Actions](https://turbo.build/repo/docs/ci/github-actions)
- [Database Initialization & Seeding](https://learn.cypress.io/advanced-cypress-concepts/database-initialization-and-seeding)
- [Viewing Playwright traces](https://www.youtube.com/watch?v=lfxjs--9ZQs)
- [Use parallelism and sharding](https://playwright.dev/docs/best-practices#use-parallelism-and-sharding)
- [Two Ways of Test Isolation](https://playwright.dev/docs/browser-contexts#two-ways-of-test-isolation)
- [Pnpm Continuous Integration](https://pnpm.io/continuous-integration#github-actions)
- [Caching dependencies to speed up workflows](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)
- [Caching packages data](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#caching-packages-data)

### TODOs

- [ ] Research how to use pnpm cache.

- [ ] Research if it's possible to use turbo cache from node_modules instead of vercel.

- [ ] There's a weird issue after running `next dev` I'm not able to run `next start` again,
      it's like the `next dev` command mutates the build so you no longer can use it with `next start` is this expected?
      If `next dev` is mutating the build then the hash of the cache should change, so the next type you run `pnpm start:prod` it should re compute the build.
      Steps to reproduce:
  1. `pnpm clean && pnpm i && pnpm db:init:dev && pnpm build && pnpm start:prod`
  2. `pnpm start:dev`
  3. `pnpm start:prod` or `pnpm test:e2e`
     This issue is affecting e2e tests when running locally, but is not likely to affect in ci pipeline, so a possible solution is to run the build without cache locally, whe might end up with too many scripts tho :(.

### Troubleshooting

I.
If you try to run `pnpm start:dev & pnpm build` within the next project it will throw
See https://github.com/vercel/next.js/issues/15880 and [Ability to configure "persistent" tasks](https://github.com/vercel/turbo/pull/2258)

Ideally the apps that are being tested should be in the dependencies so that turbo resolves those automatically for you

```json
"devDependencies": {
    "be": "workspace:*",
    "web": "workspace:*",
  },
```

but I encounter this issue with the `next dev` command where it won't start because it's trying to run build and dev at the same time.

![alt text](graph-dev.jpg 'turbo run dev dependencies')
(generated with `npx turbo run start:dev --graph=graph.pdf` requires `graphviz` which could be installed with `brew install graphviz`)

and that's why I decided to run that manually in the script like: `"test:e2e": "turbo run build --filter web && turbo run test:e2e",`

II.
Notice we are using turbo to run migrate and seed scripts because those require schemas to be build before we can run them.

III.
When building a next js project the environment variables are attached to the build it seems, therefore I have to use those same
environment variables on my test environment if I want to take advantage of the cache, this is not the case for the node js app, so I can easily
run the backend app build with different env vars without an problems.

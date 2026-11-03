# Birdseye admin console

The internal console at [console.birdseye-poultry.com](https://console.birdseye-poultry.com) for running Birdseye:
what's happening across farms, billing, and the platform's settings. It uses the `/admin/*` API of
[birdseye-backend](https://github.com/codeDaydreamer/birdseye-backend) with separate admin accounts.

Nuxt 3 · Pinia · Tailwind · Chart.js

## Pages

- **Overview.** Monthly recurring revenue, active farms, sign-ups, trial to paid, revenue by month, farms by billing
  status, feature usage, flocks by type and place, most active and quiet farms, trials ending this week, latest
  activity.
- **Farms** and a page per farm: people, batches, 30 days of records, payments; extend a trial or change the plan.
- **Users, Activity, Payments** (M-Pesa across farms), **Subscriptions, Pricing** (plans, promo codes, trial
  settings), **Reports**.
- **System health.** Database, Dynapay, which integrations are set up, stuck payments, server stats.
- **Keys.** Resend, browser push (VAPID), Firebase, Google sign-in and Dynapay keys. Saved encrypted on the server
  and used immediately; secrets are never shown again; saving needs your password. Includes test email,
  test Dynapay connection, and push key generation.
- **Audit log.** Every change an admin makes, who made it and from where.

Light (black, white and blue) and dark themes, or follow the system; works on phones.

## Run it locally

```bash
npm install
API_BASE_URL=http://localhost:8080 npm run dev     # http://localhost:3000
```

Without `API_BASE_URL` it uses `https://server.birdseye-poultry.com`. Create the first admin with
`POST /auth/admin/register` on the backend.

## Build and deploy

```bash
npm run build      # or npm run generate for a static build
```

GitHub Actions builds pushes to `master` and pull requests.

# Vercel Deployment Guide

## Auto-Deploy Setup

This project is configured for automatic deployment to Vercel via GitHub Actions.

## Prerequisites

1. **Vercel Account**: Create an account at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install with `npm i -g vercel`
3. **GitHub Secrets**: Add the following secrets to your GitHub repository

## Required GitHub Secrets

Navigate to **Settings > Secrets and variables > Actions** and add:

| Secret | Description |
|--------|-------------|
| `VERCEL_TOKEN` | Vercel API token (get from vercel.com/account/tokens) |
| `VITE_FIREBASE_API_KEY` | Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `CRON_SECRET` | Random secret for cron job auth |
| `VERCEL_URL` | Your deployed Vercel URL (e.g., business-watch.vercel.app) |

## Setup Steps

### 1. Link Project to Vercel
```bash
vercel login
vercel link
```

### 2. Get Project Info
```bash
vercel project list
cat .vercel/project.json
```

### 3. Get Vercel Token
- Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
- Create a new token
- Copy the token value

### 4. Add Secrets to GitHub
Go to your GitHub repository **Settings > Secrets and variables > Actions** and add all the secrets listed above.

### 5. Deploy
Push to the `main` branch - the GitHub Action will automatically deploy to Vercel:
```bash
git push origin main
```

## Cron Jobs (GitHub Actions)

Cron jobs run via **GitHub Actions** (not Vercel) to avoid Hobby plan limitations:

- **Deadline Check**: Daily at 8:00 AM UTC (1:00 PM Maldives time)
- **Gazette Scrape**: Every 6 hours

Configured in `.github/workflows/cron.yml`

## Auto Email for New Tenders

Emails are sent automatically when:
- New tenders are found during gazette scraping
- Tender deadlines are approaching (7, 3, 1 days before)
- Bid openings are today

Configure SMTP settings in your `.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=alerts@businesswatch.mv
```

## Manual Deploy

If you want to deploy manually:
```bash
vercel --prod
```

## Preview Deployments

Pull requests will automatically create preview deployments.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "vercel-token not supplied" | Add `VERCEL_TOKEN` secret to GitHub |
| "Hobby accounts limited to daily cron jobs" | Cron jobs run via GitHub Actions, not Vercel |
| Build errors | Check Firebase env secrets are set |
| Deployment not visible in dashboard | Check correct Vercel team/project |
| Sticky header issues | Headers are now non-sticky on all screen sizes |

## Architecture Notes

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Vercel Serverless Functions (`/api`)
- **Data**: Firebase + local JSON files
- **Cron**: GitHub Actions (free, no Vercel Pro needed)
- **Notifications**: Nodemailer for email alerts
